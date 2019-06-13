const { onRouteUpdate } = require('../src/gatsby-browser');
const { onRenderBody } = require('../src/gatsby-ssr');

const env = process.env;

describe('gatsby-plugin-hubspot', () => {

    beforeAll(() => {
        process.env = Object.assign(env, {
            NODE_ENV: 'production',
        });
    });

    describe('onRenderBody', () => {

        it('imports', () => {
            expect(onRenderBody).toBeDefined();
            expect(typeof onRenderBody).toEqual('function');
        });

        it('reports when no tracking code is provided', () => {
            const setPostBodyComponents = jest.fn();
            const reporter = {
                warn: jest.fn(),
            };

            onRenderBody({ reporter, setPostBodyComponents });

            expect(setPostBodyComponents).toHaveBeenCalledTimes(0);
            expect(reporter.warn).toHaveBeenCalledTimes(1);
            expect(reporter.warn).toHaveBeenCalledWith(
                expect.stringContaining('No HubSpot tracking code provided.')
            );

        });

        it('works when tracking code is provided', () => {
            const setPostBodyComponents = jest.fn();
            const reporter = {
                warn: jest.fn(),
            };
            const options = {
                trackingCode: 1234567,
            };

            onRenderBody({ reporter, setPostBodyComponents }, options);

            expect(reporter.warn).toHaveBeenCalledTimes(0);
            expect(setPostBodyComponents).toHaveBeenCalledTimes(1);

            const resultObj = setPostBodyComponents.mock.calls[0][0];

            expect(Array.isArray(resultObj)).toBe(true);
            expect(resultObj[0].type).toEqual('script');
            expect(resultObj[0].props.src).toMatch(/1234567/);
        });

        it('uses default options', () => {
            const setPostBodyComponents = jest.fn();
            const reporter = {
                warn: jest.fn(),
            };
            const options = {
                trackingCode: 1234567,
            };

            onRenderBody({ reporter, setPostBodyComponents }, options);

            const resultObj = setPostBodyComponents.mock.calls[0][0];

            expect(Array.isArray(resultObj)).toBe(true);
            expect(resultObj[0].props.dangerouslySetInnerHTML.__html).not.toMatch(/doNotTrack/);
        });

        it('uses respectDNT option', () => {
            const setPostBodyComponents = jest.fn();
            const reporter = {
                warn: jest.fn(),
            };
            const options = {
                trackingCode: 1234567,
                respectDNT: true,
            };

            onRenderBody({ reporter, setPostBodyComponents }, options);

            const resultObj = setPostBodyComponents.mock.calls[0][0];

            expect(Array.isArray(resultObj)).toBe(true);
            expect(resultObj[0].props.dangerouslySetInnerHTML.__html).toMatch(/doNotTrack/);
        });

    });

    describe('onRouteUpdate', () => {

        const location = {
            hash: '#hash',
            pathname: '/page',
            search: '?search'
        };

        beforeEach(() => {
            global.window = Object.assign(global.window, {
                _hsq: [],
            });
        });

        it('imports', () => {
            expect(onRouteUpdate).toBeDefined();
            expect(typeof onRouteUpdate).toEqual('function');
        });

        it('tracks page view', () => {
            onRouteUpdate({ location });

            expect(global.window._hsq).toStrictEqual([['setPath', '/page?search#hash'], ['trackPageView']]);
        });

        it('tracks multiple page views', () => {
            onRouteUpdate({ location });

            onRouteUpdate({
                location: {
                    hash: '',
                    pathname: '/page/sub-page',
                    search: ''
                }
            });

            expect(global.window._hsq).toStrictEqual([['setPath', '/page?search#hash'], ['trackPageView'], ['setPath', '/page/sub-page'], ['trackPageView']]);
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

    afterAll(() => {
        process.env = env;
    });

});