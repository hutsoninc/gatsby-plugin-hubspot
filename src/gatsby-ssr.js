import React from 'react'

export function onRenderBody({ setPostBodyComponents }, pluginOptions) {
    if (process.env.NODE_ENV === 'production') {
        let { trackingCode } = pluginOptions;

        if (trackingCode === undefined) {
            console.error('No HubSpot tracking code provided.');
        }

        setPostBodyComponents([
            <script
                type="text/javascript"
                id="hs-script-loader"
                async
                defer
                src={`//js.hs-scripts.com/${trackingCode}.js`}
                dangerouslySetInnerHTML={{
                    __html: `
                        var _hsq = window._hsq = window._hsq || [];
                        _hsq.push(['setPath', window.location.pathname + window.location.search + window.location.hash]);
                    `
                }}
            />,
        ]);

    }
}