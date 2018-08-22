import React from 'react'

export function onRenderBody({ setPostBodyComponents }, pluginOptions) {
    let { trackingCode } = pluginOptions;

    if (trackingCode === undefined) {
        console.error('No HubSpot tracking code provided.');
    }

    if (process.env.NODE_ENV === "production") {

        setPostBodyComponents([
            <script type="text/javascript" id="hs-script-loader" async defer src={`//js.hs-scripts.com/${trackingCode}.js`}></script>
        ]);

    }
}