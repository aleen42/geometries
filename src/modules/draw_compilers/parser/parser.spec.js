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
 *  - Create Time: Oct, 12nd, 2017
 *  - Update Time: Oct, 12nd, 2017
 *
 */

import Parser from 'compilers/parser/parser';
import Chai from 'chai';

const should = Chai.should();

/* global describe, it */
describe('Unit tests for the module Parser', () => {
    let caseStr = '';

    caseStr = 'ORIGIN IS (380,140);';
    it(caseStr, () => {
        const result = new Parser(caseStr, {
            debug: true,
            isSyntaxTreeShown: false
        }).outputLog();

        console.log(`\t${caseStr}`);

        result.replace(/\n|\t|\s/g, '').should.equal(`
            Enter in Parser
                Enter in Program
                    Enter in Statement
                        Enter in Origin Statement
                            Match Token: ORIGIN ()
                            Match Token: IS ()
                            Match Token: L_BRACKET ()
                            Enter in Expression
                                Enter in Term
                                    Enter in Factor
                                        Enter in Component
                                            Enter in atom
                                                Match Token: CONST_ID (380)
                                            Exit from atom
                                        Exit from Component
                                    Exit from Factor
                                Exit from Term
                            Exit from Expression
                            Match Token: COMMA ()
                                Enter in Expression
                                    Enter in Term
                                        Enter in Factor
                                            Enter in Component
                                                Enter in atom
                                                    Match Token: CONST_ID (140)
                                                Exit from atom
                                            Exit from Component
                                        Exit from Factor
                                    Exit from Term
                                Exit from Expression
                            Match Token: R_BRACKET ()
                        Exit from Origin Statement
                    Exit from Statement
                    Match Token: SEMICOLON ()
                Exit from Program
             Exit from Parser
        `.replace(/\n|\t|\s/g, ''))
    });
});
