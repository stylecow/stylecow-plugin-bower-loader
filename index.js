"use strict";

let findup = require('findup-sync');
let fs     = require('fs');
let path   = require('path');

module.exports = function (tasks, stylecow) {

    let bowerComponents;

    tasks.addTask({
        position: 'before',
        fn: function (root) {
            let cwd = root.getData('file');

            if (cwd) {
                bowerComponents = getComponentsDirectory(path.dirname(cwd));
            }
        }
    });

    tasks.addTask({
        filter: {
            type: 'AtRule',
            name: 'import'
        },
        fn: function (atRule) {
            if (!bowerComponents || atRule.data['bower-loaded']) {
                return;
            }

            let root = atRule.getAncestor('Root').getData('file');

            if (!root) {
                return;
            }

            root = path.dirname(root);
            let name = path.basename(atRule.get('String').name), packageDir, main;

            try {
                let bowerFile = path.join(bowerComponents, name, 'bower.json');
                fs.statSync(bowerFile);
                main = JSON.parse(fs.readFileSync(bowerFile)).main;
                packageDir = path.dirname(bowerFile);
            } catch (err) {
                return;
            }

            if (!main) {
                return;
            }

            if (typeof main === 'string') {
                main = [main];
            }

            main = main
                .filter(file => path.extname(file) === '.css')
                .map(file => path.relative(root, path.join(packageDir, file)));

            if (!main.length) {
                tasks.log(`Bower module ${name} has no main css file`, atRule);
            } else {
                main.forEach(function (file) {
                    let newImport = stylecow.parse(`@import url("${file}")`, 'AtRule');
                    newImport.setData('bower-loaded', true);
                    atRule.before(newImport);
                });
            }

            atRule.detach();
        }
    });

    function getComponentsDirectory (cwd) {
        let found = findup('.bowerrc', { cwd: cwd });

        if (found) {
            let bowerRc = JSON.parse(fs.readFileSync(found));

            if (bowerRc.directory) {
                return path.resolve(path.dirname(found), bowerRc.directory);
            }
        }

        return findup('bower_components', { cwd: cwd });
    }
};
