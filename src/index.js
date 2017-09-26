const pify = require('pify')
const stylesFromHtml = require('styles-from-html')
const cssRazor = pify(require('css-razor').default)
const iReplace = require('i-replace')

/**
 * Expects html, removes redundant css within style tags, and returns html. The output HTML
 * document should render the same as the input, but with less css rules present.
 * This is primarily useful if you reduce the number of requests to your web application by
 * embedding your css into a single HTML document instead of a separate stylesheet document.
 * @function cleanEmbeddedCss
 * @param {string} html - The HTML document to parse style tags from.
 *
 * @example
 * const cleanCssHtml = cleanEmbeddedCss(redundantCssHtml)
 *
 * @returns {string} html - the input HTML document but with embedded style tags having
 * redundant css rules removed.
 */
module.exports = async function cleanEmbeddedCss (html) {
  const segmented = stylesFromHtml(html)
  const cleanCss = (await cssRazor({ htmlRaw: segmented.html, cssRaw: segmented.css })).css
  const cleanHtml = iReplace(segmented.html, '</head', `<style>${cleanCss}</style>$1`)
  return cleanHtml
}
