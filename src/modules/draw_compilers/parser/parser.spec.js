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
 *  - Update Time: Oct, 30th, 2017
 *
 */

import Parser from 'compilers/parser/parser';
import Chai from 'chai';
import Color from 'util/color';

Chai.should();

/* global describe, it */
describe(Color.wrapColor('GREEN', 'Unit tests for the module, Parser'), () => {
    const checkResult = function (caseStr, expected) {
        const escapeCharacter = function (str) {
            return str.replace(/(\(|\)|\*|\+)/g, '\\$1');
        };

        const showColorfulTree = function (result) {
            const indent = '        ';
            let tempStr = '';

            console.log(
                Color.wrapColor('YELLOW', `${
                    result.replace(/\n ([a-z])/gi, `\n${indent}+-- $1`)
                        .replace(/\n\t/g, `\n${indent}\t\t`)
                        .replace(/\t/g, '| ')
                        .replace(/\| {2}([a-z])/gi, '+-- $1')
                    }\n`).replace(/(\| *.*)?Match Token: ([_A-Z]+) \((.+)\)\n/gi, (whole, prefix, type, lexeme) => {
                        let tempLexeme = lexeme;
                        tempLexeme = tempLexeme === '3.1415926' ? 'PI' : tempLexeme;
                        tempLexeme = tempLexeme === '2.71828' ? 'E' : tempLexeme;

                        const currentMatchedToken = new RegExp(`\\s*(${escapeCharacter(tempLexeme)})`).exec(caseStr);

                        let result = `${prefix}Match Token: ${type} (${Color.nestedColor('GREEN', Color.wrapColor('RED', lexeme))})\n`
                            .replace(/(Match Token: .+?)\n/gi, `${Color.nestedColor('YELLOW', Color.wrapColor('GREEN', '$1'))
                            + `\n${indent}${prefix}${new Array(Math.ceil((10 - prefix.match(/\| /g).length) / 4) + 5).join('\t')}`
                            + tempStr
                            + currentMatchedToken[0].replace(
                                new RegExp(`(${escapeCharacter(currentMatchedToken[1])})`),
                                Color.nestedColor('YELLOW', Color.wrapColor('RED', '$1'))
                            )}\n`);

                        tempStr += currentMatchedToken[0];
                        caseStr = caseStr.replace(new RegExp(escapeCharacter(currentMatchedToken[0])), '');

                        return result;
                    })
            );
        };

        const result = new Parser(caseStr, {
            debug: true,
            isSyntaxTreeShown: false
        }).outputLog();

        showColorfulTree(result);
        result.replace(/\n|\t|\s/g, '').should.equal(expected.replace(/\n|\t|\s/g, ''));
    };

    it('ORIGIN IS (380,140);', () => {
        checkResult('ORIGIN IS (380,140);', `
            Enter in Parser
                Enter in Program
                    Enter in Statement
                        Enter in Origin Statement
                            Match Token: ORIGIN (ORIGIN)
                            Match Token: IS (IS)
                            Match Token: L_BRACKET (()
                            Enter in Expression
                                Enter in Term
                                    Enter in Factor
                                        Enter in Component
                                            Enter in Atom
                                                Match Token: CONST_ID (380)
                                            Exit from Atom
                                        Exit from Component
                                    Exit from Factor
                                Exit from Term
                            Exit from Expression
                            Match Token: COMMA (,)
                                Enter in Expression
                                    Enter in Term
                                        Enter in Factor
                                            Enter in Component
                                                Enter in Atom
                                                    Match Token: CONST_ID (140)
                                                Exit from Atom
                                            Exit from Component
                                        Exit from Factor
                                    Exit from Term
                                Exit from Expression
                            Match Token: R_BRACKET ())
                        Exit from Origin Statement
                    Exit from Statement
                    Match Token: SEMICOLON (;)
                Exit from Program
            Exit from Parser
        `);
    });

    it('FOR T FROM -PI TO PI STEP PI/50 DRAW (COS(T), SIN(T));', () => {
        checkResult('FOR T FROM -PI TO PI STEP PI/50 DRAW (COS(T), SIN(T));', `
             Enter in Parser
                 Enter in Program
                     Enter in Statement
                         Enter in For Statement
                             Match Token: FOR (FOR)
                             Match Token: T (T)
                             Match Token: FROM (FROM)
                             Enter in Expression
                                 Enter in Term
                                     Enter in Factor
                                         Match Token: MINUS (-)
                                         Enter in Factor
                                             Enter in Component
                                                 Enter in Atom
                                                     Match Token: CONST_ID (3.1415926)
                                                 Exit from Atom
                                             Exit from Component
                                         Exit from Factor
                                     Exit from Factor
                                 Exit from Term
                             Exit from Expression
                             Match Token: TO (TO)
                             Enter in Expression
                                 Enter in Term
                                     Enter in Factor
                                         Enter in Component
                                             Enter in Atom
                                                 Match Token: CONST_ID (3.1415926)
                                             Exit from Atom
                                         Exit from Component
                                     Exit from Factor
                                 Exit from Term
                             Exit from Expression
                             Match Token: STEP (STEP)
                             Enter in Expression
                                 Enter in Term
                                     Enter in Factor
                                         Enter in Component
                                             Enter in Atom
                                                 Match Token: CONST_ID (3.1415926)
                                             Exit from Atom
                                         Exit from Component
                                     Exit from Factor
                                     Match Token: DIV (/)
                                     Enter in Factor
                                         Enter in Component
                                             Enter in Atom
                                                 Match Token: CONST_ID (50)
                                             Exit from Atom
                                         Exit from Component
                                     Exit from Factor
                                 Exit from Term
                             Exit from Expression
                             Match Token: DRAW (DRAW)
                             Match Token: L_BRACKET (()
                             Enter in Expression
                                 Enter in Term
                                     Enter in Factor
                                         Enter in Component
                                             Enter in Atom
                                                 Match Token: FUNC (COS)
                                                 Match Token: L_BRACKET (()
                                                 Enter in Expression
                                                     Enter in Term
                                                         Enter in Factor
                                                             Enter in Component
                                                                 Enter in Atom
                                                                     Match Token: T (T)
                                                                 Exit from Atom
                                                             Exit from Component
                                                         Exit from Factor
                                                     Exit from Term
                                                 Exit from Expression
                                                 Match Token: R_BRACKET ())
                                             Exit from Atom
                                         Exit from Component
                                     Exit from Factor
                                 Exit from Term
                             Exit from Expression
                             Match Token: COMMA (,)
                             Enter in Expression
                                 Enter in Term
                                     Enter in Factor
                                         Enter in Component
                                             Enter in Atom
                                                 Match Token: FUNC (SIN)
                                                 Match Token: L_BRACKET (()
                                                 Enter in Expression
                                                     Enter in Term
                                                         Enter in Factor
                                                             Enter in Component
                                                                 Enter in Atom
                                                                     Match Token: T (T)
                                                                 Exit from Atom
                                                             Exit from Component
                                                         Exit from Factor
                                                     Exit from Term
                                                 Exit from Expression
                                                 Match Token: R_BRACKET ())
                                             Exit from Atom
                                         Exit from Component
                                     Exit from Factor
                                 Exit from Term
                             Exit from Expression
                             Match Token: R_BRACKET ())
                         Exit from For Statement
                     Exit from Statement
                     Match Token: SEMICOLON (;)
                 Exit from Program
             Exit from Parser
        `);
    });
});
