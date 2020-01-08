/*
* @Author: bin.liu
* @Date:   2020-01-08 18:00:42
* @Last Modified by:   bin.liu
*/

const lib = () => {};
const fs = require('fs');
const PSD = require('psd');
const path = require('path');
const cut = new RegExp('-{0,2}cut');
const help = new RegExp('-{0,2}help');
const version = new RegExp('-{0,2}version');

const parseJS   = require('./parseJS');
const parseCSS  = require('./parseCSS');
const parseHTML = require('./parseHTML');

const psdpath = path.resolve(__dirname, '../psd');
const dist    = path.resolve(__dirname, '../../src/views');
const imgpath = path.resolve(__dirname, '../../src/assets');
const tplpath = path.resolve(__dirname, '../templete/index.vue');

lib.init = (args) => {
  const arg = args[2];
  if (cut.test(arg)) lib.cut(args);
  else if (help.test(arg)) lib.help();
  else if (version.test(arg)) lib.version();
  else lib.use();
}

lib.cut = (args) => {
  const filename = args[3];
  const filepath = `${psdpath}/${filename}.psd`;

  const template = fs.readFileSync(tplpath).toString();
  const psd = PSD.fromFile(filepath);
  psd.parse();
  const psdDetail = psd.tree();

  PSD.open(filepath).then(psd => {
    const img = `${imgpath}/${filename}`;
    fs.existsSync(img) || fs.mkdirSync(img);

    psd.tree().descendants().forEach(node => {
      const png= path.resolve(__dirname, `${img}/${node.name}.png`);
      if (node.isGroup()) return true;
      node.saveAsPng(png).catch(err => {});
    })
    return psd;
  }).then(psd => {
    const psdTree = psdDetail.export();

    const jsStr = parseJS(psdTree);
    const domStr = parseHTML(psdTree);
    const cssStr = parseCSS(psdTree);

    const tpl = template.trim().replace('${html}', domStr).replace('${script}', jsStr).replace('${style}', cssStr);
    const vuefile = `${dist}/${filename}.vue`;

    fs.existsSync(dist) || fs.mkdirSync(dist);
    fs.writeFileSync(vuefile, tpl);

  }).catch(err => {
    console.log(JSON.stringify(err))
  });

}

lib.help = () => {
  lib.use();
}

lib.version = () => {
  const packagepath = path.resolve(__dirname, '../package.json');
  const package = fs.readFileSync(packagepath).toString();
  const { version } = JSON.parse(package);
  process.stdout.write(`${version}\n`);
}

lib.use = () => {
  process.stdout.write('*********************************************\n');
  process.stdout.write('Use:\n');
  process.stdout.write('\t node index.js [--help] [--cut] [--version]\n');
  process.stdout.write('\t\t --cut ****\n');
  process.stdout.write('\t\t --help ****\n');
  process.stdout.write('\t\t --version ****\n');
  process.stdout.write('*********************************************\n');
}

module.exports = lib;
