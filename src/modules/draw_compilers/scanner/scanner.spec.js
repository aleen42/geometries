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
 *  - Document: scanner.spec.js
 *  - Author: aleen42
 *  - Description: Unit tests for the module, Scanner.
 *  - Create Time: May, 30th, 2017
 *  - Update Time: Oct, 26th, 2017
 *
 */

import { TokenType, tokenTypeName } from 'compilers/common/tokenType';
import Scanner from 'compilers/scanner/scanner';
import Chai from 'chai';
import Color from 'util/color';

Chai.should();

/* global describe, it */
describe(Color.wrapColor('GREEN', 'Unit tests for the module, Scanner'), () => {
    const scanner = new Scanner();
    scanner.initTokenTab();

    const checkResult = function (caseStr, expected) {
        scanner.readInput(caseStr);
        const token = scanner.getToken();

        const result = `type: ${tokenTypeName[token.type]}, lexeme: ${token.lexeme}, value: ${token.value}`;
        console.log(Color.wrapColor('YELLOW', `\n\t${result}\n`));
        result.should.equal(expected);
    };

    it('PI', () => {
        checkResult('PI', 'type: CONST_ID, lexeme: PI, value: 3.1415926');
    });

    it('ORIGIN', () => {
        checkResult('ORIGIN', 'type: ORIGIN, lexeme: ORIGIN, value: 0');
    });

    it('IS', () => {
        checkResult('IS', 'type: IS, lexeme: IS, value: 0');
    });

    it('COS', () => {
        checkResult('COS', 'type: FUNC, lexeme: COS, value: 0');
    });
});
