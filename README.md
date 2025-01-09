# CookieBot-Import-google-sheet-apps-script

## Cookiebot API
In this section you will find support material directly related to the Cookiebot API. The API is available from here: https://www.cookiebot.com/goto/developer/

### [CookieBot APIS](https://support.cookiebot.com/hc/en-us/sections/360001333773-Cookiebot-API)
- Extracting cookie information via API - https://support.cookiebot.com/hc/en-us/articles/360006346473-Extracting-cookie-information-via-API
- Extracting consent data via API - https://support.cookiebot.com/hc/en-us/articles/4405045044882-Extracting-consent-data-via-API

### Replace the placeholders with your specific information:
`https://consent.cookiebot.com/api/v1/{{APIKEY}}/json/domaingroup/{{SERIAL}}/{{CULTURE}}/domain/{{DOMAIN}}/cookies`


{{APIKEY}}: Your API key (found in Cookiebot Manager under Settings > Your scripts)
{{SERIAL}}: Your Domain Group ID (also in Cookiebot Manager)
{{CULTURE}}: ISO 639-1 language code or "default"
{{DOMAIN}}: Your registered domain name

This endpoint will return detailed information about each cookie found in our scan, including name, provider, expiration, purpose, and more.

### Example Response

```
{
  "domain": "www.domain.com",
  "urlpath": "/",
  "utcscandate": "2022-03-03T09:45:00.5030000Z",
  "culture": "en",
  "cookies": [
    {
      "Name": "CookieConsent",
      "NamePattern": "",
      "Provider": "www.domain.com",
      "Path": "/",
      "Value": "{stamp:%27-1%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:2147483647%2Cutc:1646127963403}",
      "HTTPOnly": "0",
      "Secure": "0",
      "ThirdParty": "0",
      "Persistent": "1",
      "ExpireSeconds": "15897668",
      "ExpireDays": "184",
      "ExpireDescription": "6 months",
      "TrackerTypeID": "1",
      "TrackerTypeAbbr": "HTTP",
      "TrackerTypeName": "HTTP Cookie",
      "Category": "1",
      "PurposeDescription": "Stores the user's cookie consent state for the current domain",
      "FirstURL": "https://www.domain.com/",
      "Initiator": "https://consent.cookiebot.eu/uc.js",
      "InitiatorSource": "https://consent.cookiebot.eu/uc.js",
      "InitiatorCodeBlockBegin": "39",
      "InitiatorCodeBlockEnd": "39",
      "InitiatorCodeLineSpecific": "39",
      "InitiatorSourceDomain": "cookiebot.eu",
      "InitiatorSourceDomainIP": "15.197.142.173",
      "InitiatorSourceDomainCountryID": "ie",
      "InitiatorSourceDomainCountryName": "Ireland",
      "GDPRAdequateCountry": "1",
      "PriorConsentEnabled": "1"
    }
  ]
}
```
