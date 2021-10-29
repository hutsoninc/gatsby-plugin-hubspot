import React from 'react'
import { isDefined, oneline } from './utils'
import defaultOptions from './default-options'

exports.onRenderBody = ({ setPostBodyComponents }, pluginOptions) => {
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  if (
    (options.productionOnly && process.env.NODE_ENV !== 'production') ||
    !isDefined(options.trackingCode)
  ) {
    return null
  }

  return setPostBodyComponents([
    <script
      type='text/javascript'
      id='hs-script-loader'
      key='gatsby-plugin-hubspot'
      async
      defer
      src={`//js.hs-scripts.com/${options.trackingCode}.js`}
    />,
    <script
      dangerouslySetInnerHTML={{
        __html: oneline`
          var _hsq = window._hsq = window._hsq || [];
          _hsq.push(['setPath', window.location.pathname + window.location.search + window.location.hash]);
          ${
            options.respectDNT
              ? `
                  if (window.doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || 'msTrackingProtectionEnabled' in window.external) {
                    if (window.doNotTrack == '1' || navigator.doNotTrack == 'yes' || navigator.doNotTrack == '1' || navigator.msDoNotTrack == '1' || window.external.msTrackingProtectionEnabled()) {
                      _hsq.push(['doNotTrack']);
                    }
                  }
                `
              : ``
          }
        `,
      }}
    />,
  ])
}
