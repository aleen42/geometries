/*
 *                                                               _
 *   _____  _                           ____  _                 |_|
 *  |  _  |/ \   ____  ____ __ ___     / ___\/ \   __   _  ____  _
 *  | |_| || |  / __ \/ __ \\ '_  \ _ / /    | |___\ \ | |/ __ \| |
 *  |  _  || |__. ___/. ___/| | | ||_|\ \___ |  _  | |_| |. ___/| |
 *  |_/ \_|\___/\____|\____||_| |_|    \____/|_| |_|_____|\____||_|
 *
 *  ===============================================================
 *             More than a coder, More than a designer
 *  ===============================================================
 *
 *  - Document: semantic.spec.js
 *  - Author: aleen42
 *  - Description: Unit tests for the module, Semantic.
 *  - Create Time: Jul 19th, 2021
 *  - Update Time: Jul 19th, 2021
 *
 */

const Chai = require('chai');
const Color = require('../../util/color');
const fs = require('fs');
const path = require('path');
const Parser = require('../parser/parser');

Chai.should();

/* global describe, it */
describe(Color.wrapColor('GREEN', 'Unit tests for the module, Semantic'), () => {
    Array(4).fill('').forEach((_, i) => {
        it(`Draw - example ${i + 1}`, () => {
            const pointsArr = [];
            const pathsArr = [];

            new Parser(fs.readFileSync(path.resolve(__dirname, `../../../cases/${i + 1}.ge`), 'utf8'), {
                drawingCallback: (x, y) => {
                    pointsArr.push(x);
                    pointsArr.push(y);
                },
                lineCompleted: () => {
                    pathsArr.push(`<path fill="none" stroke="#000"
            stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
            d="M${pointsArr.shift()},${pointsArr.shift()}L${pointsArr.join(' ')}"/>`);
                    // reset storing points of each line
                    pointsArr.splice(0, pointsArr.length);
                },
                drawingCompleted: () => {
                    (fs.readFileSync(path.resolve(__dirname, `../../../cases/${i + 1}.svg`), 'utf8') === '<svg '
                        + 'xmlns="http://www.w3.org/2000/svg" '
                        + 'xmlns:xlink="http://www.w3.org/1999/xlink"'
                        + ' width="500" height="500">' + pathsArr.join('\n') + '</svg>').should.equal(true);
                },
            });
        });
    });
});
