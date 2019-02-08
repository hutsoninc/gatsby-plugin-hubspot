export function onRouteUpdate({ location }) {
    if (process.env.NODE_ENV === 'production' && typeof _hsq === 'object') {
        let _hsq = window._hsq = window._hsq || [];
        _hsq.push(['setPath', location ? location.pathname + location.search + location.hash : undefined]);
        _hsq.push(['trackPageView']);
    }
}