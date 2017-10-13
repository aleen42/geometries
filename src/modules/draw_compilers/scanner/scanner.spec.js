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
 *  - Update Time: May, 31st, 2017
 *
 */

import { TokenType, tokenTypeName } from 'compilers/common/tokenType';
import Scanner from 'compilers/scanner/scanner';
import Chai from 'chai';

const should = Chai.should();

/* global describe, it */
describe('Unit tests for the module Scanner', () => {
    const scanner = new Scanner();
    scanner.initTokenTab();

    it('PI', () => {
        scanner.readInput(`PI`);
        const token = scanner.getToken();

        const result = `type: ${tokenTypeName[token.type]}, lexeme: ${token.lexeme}, value: ${token.value}`;
        console.log(`\t${result}`);
        result.should.equal('type: CONST_ID, lexeme: PI, value: 3.1415926');
    });

    it('ORIGIN', () => {
        scanner.readInput(`ORIGIN`);
        const token = scanner.getToken();

        const result = `type: ${tokenTypeName[token.type]}, lexeme: ${token.lexeme}, value: ${token.value}`;
        console.log(`\t${result}`);
        result.should.equal('type: ORIGIN, lexeme: ORIGIN, value: 0');
    });

    it('ORIGIN IS (380,140)', () => {
        scanner.readInput(`ORIGIN IS (380,140);`);
        scanner.getToken();
        const token = scanner.getToken();

        const result = `type: ${tokenTypeName[token.type]}, lexeme: ${token.lexeme}, value: ${token.value}`; 
        console.log(`\t${result}`);
        result.should.equal('type: IS, lexeme: IS, value: 0');
    });
});
