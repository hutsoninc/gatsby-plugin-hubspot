# gatsby-plugin-hubspot

[![Current npm package version](https://img.shields.io/npm/v/gatsby-plugin-hubspot.svg)](https://www.npmjs.com/package/gatsby-plugin-hubspot)

Gatsby plugin to add a HubSpot embed code to your site.

## Installation

`npm install --save gatsby-plugin-hubspot`

## Usage

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-hubspot",
      options: {
        trackingCode: "1234567",
        respectDNT: false,
        productionOnly: true,
      },
    },
  ],
}
```

### Options

#### `respectDNT`

By enabling this option, visitors with "Do Not Track" enabled will have a `__hs_do_not_track` cookie
placed in their browser. This prevents the HubSpot tracking code from sending any information for
the visitor.

More information about HubSpot cookies and privacy can be found in the
[HubSpot Tracking Code API documentation](https://developers.hubspot.com/docs/methods/tracking_code_api/tracking_code_overview).

#### `productionOnly`

Only load the script when `process.env.NODE_ENV` is set to `production`.

## License

MIT © [Hutson Inc](https://www.hutsoninc.com)
