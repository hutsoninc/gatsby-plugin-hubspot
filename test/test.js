jest.useFakeTimers();

const env = process.env;

const { onRouteUpdate } = require('../src/gatsby-browser');
const { onRenderBody } = require('../src/gatsby-ssr');

describe('gatsby-plugin-hubspot', () => {
    beforeEach(() => {
        process.env = Object.assign(env, {
            NODE_ENV: 'production',
        });
    });

    describe('onRenderBody', () => {
        const setup = (options = {}) => {
            const setPostBodyComponents = jest.fn();

            onRenderBody({ setPostBodyComponents }, options);

            return { options, setPostBodyComponents };
        };

        it('imports', () => {
            expect(onRenderBody).toBeDefined();
            expect(typeof onRenderBody).toEqual('function');
        });

        it('does nothing when no tracking code is provided', () => {
            const { setPostBodyComponents } = setup();

            expect(setPostBodyComponents).toHaveBeenCalledTimes(0);
        });

        it('works when tracking code is provided', () => {
            const options = {
                trackingCode: 1234567,
            };

            const { setPostBodyComponents } = setup(options);

            expect(setPostBodyComponents).toHaveBeenCalledTimes(1);

            const resultObj = setPostBodyComponents.mock.calls[0][0];

            expect(Array.isArray(resultObj)).toBe(true);
            expect(resultObj[0].type).toEqual('script');
            expect(resultObj[0].props.src).toMatch(/1234567/);
        });

        it('uses default options', () => {
            const options = {
                trackingCode: 1234567,
            };

            const { setPostBodyComponents } = setup(options);

            const resultObj = setPostBodyComponents.mock.calls[0][0];

            expect(Array.isArray(resultObj)).toBe(true);
            expect(
                resultObj[0].props.dangerouslySetInnerHTML.__html
            ).not.toMatch(/doNotTrack/);
        });

        it('uses respectDNT option', () => {
            const options = {
                trackingCode: 1234567,
                respectDNT: true,
            };

            const { setPostBodyComponents } = setup(options);

            const resultObj = setPostBodyComponents.mock.calls[0][0];

            expect(Array.isArray(resultObj)).toBe(true);
            expect(resultObj[0].props.dangerouslySetInnerHTML.__html).toMatch(
                /doNotTrack/
            );
        });

        it('uses productionOnly option', () => {
            process.env.NODE_ENV = 'test';

            const options = {
                trackingCode: 1234567,
                productionOnly: false,
            };

            const { setPostBodyComponents } = setup(options);

            expect(setPostBodyComponents).toHaveBeenCalledTimes(1);
        });
    });

    describe('onRouteUpdate', () => {
        const location = {
            hash: '#hash',
            pathname: '/page',
            search: '?search',
        };

        beforeEach(() => {
            global.window = Object.assign(global.window, {
                _hsq: [],
                requestAnimationFrame: jest.fn(cb => {
                    cb();
                }),
            });
        });

        it('imports', () => {
            expect(onRouteUpdate).toBeDefined();
            expect(typeof onRouteUpdate).toEqual('function');
        });

        it('tracks page view', () => {
            onRouteUpdate({ location });

            expect(global.window._hsq).toStrictEqual([
                ['setPath', '/page?search#hash'],
                ['trackPageView'],
            ]);
        });

        it('tracks multiple page views', () => {
            onRouteUpdate({ location });

            onRouteUpdate({
                location: {
                    hash: '',
                    pathname: '/page/sub-page',
                    search: '',
                },
            });

            expect(global.window._hsq).toStrictEqual([
                ['setPath', '/page?search#hash'],
                ['trackPageView'],
                ['setPath', '/page/sub-page'],
                ['trackPageView'],
            ]);
        });

        it('works when window.requestAnimationFrame is undefined', () => {
            delete global.window.requestAnimationFrame;

            onRouteUpdate({ location });

            expect(global.window._hsq).toStrictEqual([]);

            jest.runAllTimers();

            expect(global.window._hsq).toStrictEqual([
                ['setPath', '/page?search#hash'],
                ['trackPageView'],
            ]);
            expect(setTimeout).toHaveBeenCalledTimes(1);
        });

        it('does nothing when window._hsq is undefined', () => {
            delete global.window._hsq;

            onRouteUpdate({ location });

            expect(global.window._hsq).toBeUndefined();
        });

        it('does nothing when process.env.NODE_ENV is not production', () => {
            process.env.NODE_ENV = 'test';

            onRouteUpdate({ location });

            expect(global.window._hsq).toStrictEqual([]);
        });
    });

    afterEach(() => {
        process.env = env;
    });
});
