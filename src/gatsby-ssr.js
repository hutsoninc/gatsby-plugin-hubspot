import React from 'react';
import { oneLine } from 'common-tags';

export function onRenderBody({ setPostBodyComponents }, pluginOptions) {
    if (process.env.NODE_ENV === 'production') {
        let { trackingCode, respectDNT } = pluginOptions;
        if (trackingCode === undefined) {
            console.error('No HubSpot tracking code provided.');
        }
        setPostBodyComponents([
            <script
                type="text/javascript"
                id="hs-script-loader"
                key={`gatsby-plugin-hubspot`}
                async
                defer
                src={`//js.hs-scripts.com/${trackingCode}.js`}
                dangerouslySetInnerHTML={{
                    __html: oneLine`
                        var _hsq = window._hsq = window._hsq || [];
                        _hsq.push(['setPath', window.location.pathname + window.location.search + window.location.hash]);
                        ${respectDNT === true ? `if (window.doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || 'msTrackingProtectionEnabled' in window.external) {
                            if (window.doNotTrack == "1" || navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1" || window.external.msTrackingProtectionEnabled()) {
                                _hsq.push(['doNotTrack']);
                            }
                        }` : ``}
                        
                    `
                }}
            />,
        ]);

    }
}