# gatsby-plugin-hubspot

[![Current npm package version](https://img.shields.io/npm/v/gatsby-plugin-hubspot.svg)](https://www.npmjs.com/package/gatsby-plugin-hubspot) 

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
          trackingCode: "1234567"
      },
    },
  ]
}
```

## License

MIT © [Hutson Inc](https://www.hutsoninc.com)