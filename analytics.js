// Preserve the existing Analytics ID and browser opt-out preference.

    (function() {
      var gaId = 'G-9VR0SQK6EF';
      var disableKey = 'ga-disable-' + gaId;
      try {
        var params = new URLSearchParams(window.location.search);
        var toggle = params.get('ga');

        if (toggle === 'off') {
          localStorage.setItem(disableKey, 'true');
          document.cookie = disableKey + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
        } else if (toggle === 'on') {
          localStorage.removeItem(disableKey);
          document.cookie = disableKey + '=; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/';
        }
      } catch (err) {
        console.warn('Unable to persist Analytics preference.', err);
      }

      try {
        var hasOptOut = localStorage.getItem(disableKey) === 'true' ||
          document.cookie.indexOf(disableKey + '=true') > -1;
        if (hasOptOut) {
          window[disableKey] = true;
          console.info('Google Analytics disabled for this browser.');
        }
      } catch (err) {
        console.warn('Unable to read Analytics preference.', err);
      }
    })();
  
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9VR0SQK6EF');
  
if (!window['ga-disable-G-9VR0SQK6EF']) {
  const analytics = document.createElement('script');
  analytics.async = true;
  analytics.src = 'https://www.googletagmanager.com/gtag/js?id=G-9VR0SQK6EF';
  document.head.append(analytics);
}
