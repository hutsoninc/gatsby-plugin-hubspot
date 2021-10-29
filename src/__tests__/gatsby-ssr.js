const env = process.env

const { onRenderBody } = require('../gatsby-ssr')

describe('gatsby-plugin-hubspot', () => {
  beforeEach(() => {
    process.env = { ...env, NODE_ENV: 'production' }
  })

  afterEach(() => {
    process.env = env
  })

  describe('onRenderBody', () => {
    const setup = (options = {}) => {
      const setPostBodyComponents = jest.fn()

      onRenderBody({ setPostBodyComponents }, options)

      return { options, setPostBodyComponents }
    }

    it('imports', () => {
      expect(onRenderBody).toBeDefined()
      expect(typeof onRenderBody).toEqual('function')
    })

    it('does nothing when no tracking code is provided', () => {
      const { setPostBodyComponents } = setup()

      expect(setPostBodyComponents).toHaveBeenCalledTimes(0)
    })

    it('works when tracking code is provided', () => {
      const options = {
        trackingCode: 1234567,
      }

      const { setPostBodyComponents } = setup(options)

      expect(setPostBodyComponents).toHaveBeenCalledTimes(1)

      const resultObj = setPostBodyComponents.mock.calls[0][0]

      expect(Array.isArray(resultObj)).toBe(true)
      expect(resultObj[0].type).toEqual('script')
      expect(resultObj[0].props.src).toMatch(/1234567/)
    })

    it('uses default options', () => {
      const options = {
        trackingCode: 1234567,
      }

      const { setPostBodyComponents } = setup(options)

      const resultObj = setPostBodyComponents.mock.calls[0][0]

      expect(Array.isArray(resultObj)).toBe(true)
      expect(resultObj[1].props.dangerouslySetInnerHTML.__html).not.toMatch(/doNotTrack/)
    })

    it('uses respectDNT option', () => {
      const options = {
        trackingCode: 1234567,
        respectDNT: true,
      }

      const { setPostBodyComponents } = setup(options)

      const resultObj = setPostBodyComponents.mock.calls[0][0]

      expect(Array.isArray(resultObj)).toBe(true)
      expect(resultObj[1].props.dangerouslySetInnerHTML.__html).toMatch(/doNotTrack/)
    })

    it('uses productionOnly option', () => {
      process.env.NODE_ENV = 'test'

      const options = {
        trackingCode: 1234567,
        productionOnly: false,
      }

      const { setPostBodyComponents } = setup(options)

      expect(setPostBodyComponents).toHaveBeenCalledTimes(1)
    })
  })
})
