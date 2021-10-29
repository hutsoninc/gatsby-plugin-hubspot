const { oneline } = require('../utils')

describe('gatsby-plugin-hubspot', () => {
  describe('online', () => {
    it('works as expected', () => {
      const result = oneline`
        if(true) {
          console.log('Success!')
        }
      `
      expect(result).toEqual("if(true) {console.log('Success!')}")
    })
  })
})
