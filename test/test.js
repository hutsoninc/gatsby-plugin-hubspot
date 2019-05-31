const { onRouteUpdate } = require('../gatsby-browser');
const { onRenderBody } = require('../gatsby-ssr');

describe('Gatsby plugin', () => {
    test('should import', () => {
        expect(typeof onRenderBody).toEqual('function');
        expect(typeof onRouteUpdate).toEqual('function');
    });
});