/*
* @Author: bin.liu
* @Date:   2020-01-08 18:02:25
* @Last Modified by:   bin.liu
*/

function nodeTpl(node) {
  const { name, left, top, height, width } = node;
  return `<div clss="${name}">
    <img src="./img/${name}.png"/>
  </div>`;
}

function parsePsdTree(node) {
  const child = node.children;
  if (!child || !child.length) {
    return nodeTpl(node);
  } else {
    return child.map(n => parsePsdTree(n)).join('');
  }
}

module.exports = parsePsdTree;
