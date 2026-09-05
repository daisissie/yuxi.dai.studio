#!/usr/bin/env python3
"""Validate and stage the static portfolio. Requires only Python 3."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import shutil

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'dist'
PAGES = sorted(ROOT.glob('*.html')) + sorted((ROOT / 'projects').glob('*.html'))

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.refs, self.images = path, set(), [], []
        self.h1s = self.mains = 0
        self.title = self.description = self.active = False
        self.errors = []
    def handle_starttag(self, tag, pairs):
        a = dict(pairs)
        if 'id' in a:
            if a['id'] in self.ids: self.errors.append('duplicate ID: ' + a['id'])
            self.ids.add(a['id'])
        if tag == 'h1': self.h1s += 1
        if tag == 'main': self.mains += 1
        if tag == 'title': self.title = True
        if tag == 'meta' and a.get('name') == 'description': self.description = bool(a.get('content'))
        if a.get('aria-current') == 'page': self.active = True
        if tag == 'img':
            self.images.append(a)
            for key in ('alt', 'width', 'height', 'loading'):
                if not a.get(key): self.errors.append('image missing ' + key)
        for attr in ('href', 'src'):
            if attr in a:
                value = urlsplit(a[attr])
                if not value.scheme and not value.netloc:
                    target = self.path.parent / unquote(value.path) if value.path else self.path
                    self.refs.append((target.resolve(), unquote(value.fragment)))
        if a.get('target') == '_blank' and 'noopener' not in a.get('rel', ''):
            self.errors.append('external tab link missing noopener')

parsed = {}
files = {ROOT / 'style.css', ROOT / 'main.js', ROOT / 'analytics.js'}
for path in PAGES:
    p = Page(path)
    p.feed(path.read_text())
    parsed[path.resolve()] = p
    files.add(path)
errors = []
for path, page in parsed.items():
    for message in page.errors: errors.append(f'{path.name}: {message}')
    if page.h1s != 1 or page.mains != 1: errors.append(f'{path.name}: expected one heading and main')
    if not all((page.title, page.description, page.active)): errors.append(f'{path.name}: missing page metadata/navigation')
    for target, anchor in page.refs:
        if not target.is_relative_to(ROOT):
            errors.append(f'{path.name}: local reference outside site: {target}')
        elif not target.is_file(): errors.append(f'{path.name}: missing {target.relative_to(ROOT)}')
        else:
            files.add(target)
            # Check path spelling on case-insensitive local filesystems too.
            current = ROOT
            for part in target.relative_to(ROOT).parts:
                if part not in {child.name for child in current.iterdir()}:
                    errors.append(f'{path.name}: filename case mismatch: {part}')
                    break
                current /= part
            if anchor and target in parsed and anchor not in parsed[target].ids:
                errors.append(f'{path.name}: missing anchor #{anchor} in {target.name}')
if errors:
    raise SystemExit('\n'.join(errors))
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir()
for source in files:
    dest = OUT / source.relative_to(ROOT)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, dest)
print(f'Validated {len(PAGES)} pages, {sum(len(p.images) for p in parsed.values())} image placements, and all local links and anchors.')
print(f'Staged {len(files)} files ({sum(p.stat().st_size for p in files) / 1e6:.1f} MB) in {OUT}')
