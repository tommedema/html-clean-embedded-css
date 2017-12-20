/* global describe, it */
require('should')
require('loud-rejection/register')

const clean = require('../src')
const fs = require('fs')
const getHtml = (file) => fs.readFileSync(`${__dirname}/input/${file}.html`, 'utf8')
const getOutHtml = (file) => fs.readFileSync(`${__dirname}/input/${file}-out.html`, 'utf8')

describe('html-clean-embedded-css', () => {
  it('should export a function', () => {
    clean.should.be.a.Function()
  })

  it('should remove redundant css rules', async () => {
    const input = getHtml('simple')
    const output = getOutHtml('simple')
    const cleaned = await clean(input)
    cleaned.should.equal(output)
  })

  it('should work with incomplete documents too', async () => {
    const input = getHtml('incomplete')
    const output = getOutHtml('incomplete')
    const cleaned = await clean(input)
    cleaned.should.equal(output)
  })

  it('should not remove used css rules', async () => {
    const input = getHtml('used')
    const output = getOutHtml('used')
    const cleaned = await clean(input)
    cleaned.should.equal(output)
  })

  it('should preserve css as-is if no closing head tag is present', async () => {
    const input = getHtml('no-head')
    const cleaned = await clean(input)
    cleaned.should.equal(input)
  })

  it('should prepend non-redundant styles just before closing head (no whitespace)', async () => {
    const input = getHtml('whitespace-none')
    const output = getOutHtml('whitespace-none')
    const cleaned = await clean(input)
    cleaned.should.equal(output)
  })

  it('should prepend non-redundant styles just before closing head (leading newline)', async () => {
    const input = getHtml('whitespace-leading')
    const output = getOutHtml('whitespace-leading')
    const cleaned = await clean(input)
    cleaned.should.equal(output)
  })

  it('should prepend non-redundant styles just before closing head  (trailing newline)', async () => {
    const input = getHtml('whitespace-trailing')
    const output = getOutHtml('whitespace-trailing')
    const cleaned = await clean(input)
    cleaned.should.equal(output)
  })

  it('should prepend non-redundant styles just before closing head  (pretty formatting)', async () => {
    const input = getHtml('whitespace-pretty')
    const output = getOutHtml('whitespace-pretty')
    const cleaned = await clean(input)
    cleaned.should.equal(output)
  })

  it('should return html as-is if style tags do not contain styles', async () => {
    const input = getHtml('style-tag-no-styles')
    const cleaned = await clean(input)
    cleaned.should.equal(input)
  })

  it('should return html as-is if no style tags are present', async () => {
    const input = getHtml('no-style')
    const cleaned = await clean(input)
    cleaned.should.equal(input)
  })
})
