import defaultOptions from './default-options';

export function onRouteUpdate({ location }, pluginOptions) {
    const { productionOnly } = Object.assign(
        {},
        defaultOptions,
        pluginOptions
    );
    
    if (
        (productionOnly && process.env.NODE_ENV !== 'production') ||
        !Array.isArray(window._hsq)
    ) {
        return;
    }

    // wrap inside a timeout to make sure react-helmet is done with it's changes (https://github.com/gatsbyjs/gatsby/issues/9139)
    // react-helmet is using requestAnimationFrame (https://github.com/nfl/react-helmet/blob/5.2.0/src/HelmetUtils.js#L296-L299)
    const trackPageView = () => {
        const path = location
            ? location.pathname + location.search + location.hash
            : undefined;
        window._hsq.push(['setPath', path]);
        window._hsq.push(['trackPageView']);
    };

    if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(trackPageView);
        });
    } else {
        // simulate 2 requestAnimationFrame calls
        setTimeout(trackPageView, 32);
    }
}
