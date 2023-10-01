// Create a mapping of common locales to country codes
const localeToCountryMap = {
    'US': 'US',  // English - United States
    'GB': 'GB',  // English - United Kingdom
    'ES': 'ES',  // Spanish - Spain
    'MX': 'MX',  // Spanish - Mexico
    'DE': 'DE',  // German - Germany
    'RU': 'RU',  // Russian - Russia
    // Add more mappings as needed
  };
  
  export function localeToCountryCode(locale) {
    // Check if the provided locale is in the mapping
    if (localeToCountryMap.hasOwnProperty(locale)) {
      return localeToCountryMap[locale];
    } else {
      // If the locale is not found, you can handle it here
      console.error(`Country code not found for locale ${locale}`);
      return 'US'; // default to united states
    }
  }