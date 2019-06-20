# gatsby-plugin-hubspot

[![Build Status](https://travis-ci.com/hutsoninc/gatsby-plugin-hubspot.svg?branch=master)](https://travis-ci.com/hutsoninc/gatsby-plugin-hubspot) [![Current npm package version](https://img.shields.io/npm/v/gatsby-plugin-hubspot.svg)](https://www.npmjs.com/package/gatsby-plugin-hubspot) 

A Gatsby plugin to easily add a HubSpot embed code to your site.

## Installing

`npm install --save gatsby-plugin-hubspot`

## How to use

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-hubspot",
      options: {
          trackingCode: "1234567",
          respectDNT: true,
          productionOnly: true,
      },
    },
  ]
}
```

### Options

#### respectDNT

Type: `boolean`<br/>
Default: `false`

By enabling this option, visitors with "Do Not Track" enabled will have a `__hs_do_not_track` cookie placed in their browser. This prevents the HubSpot tracking code from sending any information for the visitor.

More information about HubSpot cookies and privacy can be found in the [HubSpot Tracking Code API documentation](https://developers.hubspot.com/docs/methods/tracking_code_api/tracking_code_overview).

#### productionOnly

Type: `boolean`<br/>
Default: `true`

Only load the script when `process.env.NODE_ENV` is set to `production`.

## License

MIT © [Hutson Inc](https://www.hutsoninc.com)