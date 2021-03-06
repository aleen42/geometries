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
 *  - Create Time: May 30th, 2017
 *  - Update Time: Feb 13rd, 2019
 *
 */

const { tokenTypeName } = require('../common/tokenType');
const Scanner = require('./scanner');
const Chai = require('chai');
const Color = require('../../util/color');

Chai.should();

/* global describe, it */
describe(Color.wrapColor('GREEN', 'Unit tests for the module, Scanner'), () => {
    const scanner = new Scanner();
    scanner.initTokenTab();

    const _checkResult = (caseStr, expected) => {
        scanner.readInput(caseStr);
        const token = scanner.getToken();

        const result = `type: ${tokenTypeName[token.type]}, lexeme: ${token.lexeme}, value: ${token.value}`;
        console.log(Color.wrapColor(tokenTypeName[token.type] === 'ERRTOKEN' ? 'RED' : 'YELLOW', `\n\t${result}\n`));
        result.should.equal(expected);
    };

    it('PI', () => {
        _checkResult('PI', 'type: CONST_ID, lexeme: PI, value: 3.1415926');
    });

    it('ORIGIN', () => {
        _checkResult('ORIGIN', 'type: ORIGIN, lexeme: ORIGIN, value: 0');
    });

    it('IS', () => {
        _checkResult('IS', 'type: IS, lexeme: IS, value: 0');
    });

    it('COS', () => {
        _checkResult('COS', 'type: FUNC, lexeme: COS, value: 0');
    });

    it('NOT', () => {
        _checkResult('NOT', 'type: RESERVED, lexeme: NOT, value: 0');
    });

    it('SITA', () => {
        _checkResult('SITA', 'type: VAR, lexeme: SITA, value: 0');
    });

    it('SITA1', () => {
        _checkResult('SITA1', 'type: VAR, lexeme: SITA1, value: 0');
    });

    it('SITA_1', () => {
        _checkResult('SITA_1', 'type: VAR, lexeme: SITA_1, value: 0');
    });

    it('@', () => {
        _checkResult('@', 'type: ERRTOKEN, lexeme: @, value: 0');
    });
});
