jest.useFakeTimers()

const env = process.env

const { onRouteUpdate } = require('../gatsby-browser')

describe('gatsby-plugin-hubspot', () => {
  beforeEach(() => {
    process.env = { ...env, NODE_ENV: 'production' }
  })

  afterEach(() => {
    process.env = env
  })

  describe('onRouteUpdate', () => {
    const location = {
      hash: '#hash',
      pathname: '/page',
      search: '?search',
    }

    beforeEach(() => {
      global.window = Object.assign(global.window, {
        _hsq: [],
        requestAnimationFrame: jest.fn(cb => {
          cb()
        }),
      })
    })

    it('imports', () => {
      expect(onRouteUpdate).toBeDefined()
      expect(typeof onRouteUpdate).toEqual('function')
    })

    it('tracks page view', () => {
      onRouteUpdate({ location })

      expect(global.window._hsq).toStrictEqual([
        ['setPath', '/page?search#hash'],
        ['trackPageView'],
      ])
    })

    it('tracks multiple page views', () => {
      onRouteUpdate({ location })

      onRouteUpdate({
        location: {
          hash: '',
          pathname: '/page/sub-page',
          search: '',
        },
      })

      expect(global.window._hsq).toStrictEqual([
        ['setPath', '/page?search#hash'],
        ['trackPageView'],
        ['setPath', '/page/sub-page'],
        ['trackPageView'],
      ])
    })

    it('works when window.requestAnimationFrame is undefined', () => {
      delete global.window.requestAnimationFrame

      onRouteUpdate({ location })

      expect(global.window._hsq).toStrictEqual([])

      jest.runAllTimers()

      expect(global.window._hsq).toStrictEqual([
        ['setPath', '/page?search#hash'],
        ['trackPageView'],
      ])
      expect(setTimeout).toHaveBeenCalledTimes(1)
    })

    it('does nothing when window._hsq is undefined', () => {
      delete global.window._hsq

      onRouteUpdate({ location })

      expect(global.window._hsq).toBeUndefined()
    })

    it('does nothing when process.env.NODE_ENV is not production', () => {
      process.env.NODE_ENV = 'test'

      onRouteUpdate({ location })

      expect(global.window._hsq).toStrictEqual([])
    })
  })
})
