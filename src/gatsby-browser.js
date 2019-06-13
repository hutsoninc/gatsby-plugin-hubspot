export function onRouteUpdate({
    location: {
        hash,
        pathname,
        search,
    },
}) {
    if (process.env.NODE_ENV === 'production' && typeof window._hsq === 'object') {
        window._hsq.push(['setPath', `${pathname}${search}${hash}`]);
        window._hsq.push(['trackPageView']);
    }
}