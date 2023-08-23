window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-923339191');
gtag('consent', 'default', {
  'analytics_storage': 'granted',
  'ad_storage': 'granted',
  'functionality_storage': 'granted',
  'wait_for_update': 500
});

gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'functionality_storage': 'denied',
  'region': ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'PE', 'RU'],
  'wait_for_update': 500
});

window.geofeed = (options) => {
  dataLayer.push({
    'event' : 'OneTrustCountryLoad',
    'oneTrustCountryId': options.country.toString()
  })
}

const json = document.createElement('script');
json.setAttribute('src', 'https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location/geofeed');
document.head.appendChild(json);
