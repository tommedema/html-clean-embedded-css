/* global describe, it */
require('should')

const fn = require('../src')

describe('module', () => {
  it('should return a string', () => {
    fn('test').should.be.a.String()
  })
})
