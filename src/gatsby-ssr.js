import React from 'react';
import { oneline } from './utils';
import defaultOptions from './default-options';

export function onRenderBody({ reporter, setPostBodyComponents }, options) {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    options = Object.assign(defaultOptions, options);

    const { trackingCode, respectDNT } = options;

    if (trackingCode === undefined) {
        reporter.warn('No HubSpot tracking code provided.');
        return;
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
                __html: oneline`
                    var _hsq = window._hsq = window._hsq || [];
                    _hsq.push(['setPath', window.location.pathname + window.location.search + window.location.hash]);
                    ${respectDNT ? `if (window.doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || 'msTrackingProtectionEnabled' in window.external) {
                        if (window.doNotTrack == "1" || navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1" || window.external.msTrackingProtectionEnabled()) {
                            _hsq.push(['doNotTrack']);
                        }
                    }` : ``}
                    
                `
            }}
        />,
    ]);
}