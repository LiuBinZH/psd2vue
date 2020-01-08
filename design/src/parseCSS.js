/*
* @Author: bin.liu
* @Date:   2020-01-08 18:02:04
* @Last Modified by:   bin.liu
*/

function cssTpl(node) {
  const { name, width, height, left, top } = node;

  return `\n.${name} {
    position: absolute;
    width: ${width}px;
    height: ${height}px;
    left: ${left}px;
    top: ${top}px;
  }`;
}

function parseCSS (psdTree) {
  const { children } = psdTree;
  if (!children || !children.length) {
    return cssTpl(psdTree);
  } else {
    return children.map(child => parseCSS(child)).join('');
  }
}

module.exports = parseCSS;
