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
 *  - Document: scanner.js
 *  - Author: aleen42
 *  - Description: A scanner module for scanning validated content
 *  - Create Time: May, 30th, 2017
 *  - Update Time: Oct, 12nd, 2017
 *
 */

import Util from 'util/index';
import Token from 'compilers/scanner/token';

function Scanner() {
    this.MAXSIZE = 10000; /** the max type of notations */
    this.MAX_TOKEN_LEN = 100000; /** the max length of notations */

    this.index = 0;
    this.lineNumber = 0;

    this.tokenTabs = [];
    this.tokenBuffer = '';
}

Scanner.tokenTypeName = [
    'ORIGIN', 'SCALE', 'ROT', 'IS', /** reserved keyword */
    'TO', 'STEP', 'DRAW', 'FOR', 'FROM', /** reserved keyword */
    'T', /** parameter */
    'SEMICOLON', 'L_BRACKET', 'R_BRACKET', 'COMMA', /** separators */
    'PLUS', 'MINUS', 'MUL', 'DIV', 'POWER', /** operators */
    'FUNC', /** function (called) */
    'CONST_ID', /** constant */
    'NONTOKEN', /** empty notation (the end of a program) */
    'ERRTOKEN' /** error notation (invalid input) */
];

/** @namespace Scanner.tokenType.ORIGIN */
/** @namespace Scanner.tokenType.SCALE */
/** @namespace Scanner.tokenType.ROT */
/** @namespace Scanner.tokenType.IS */
/** @namespace Scanner.tokenType.TO */
/** @namespace Scanner.tokenType.STEP */
/** @namespace Scanner.tokenType.DRAW */
/** @namespace Scanner.tokenType.FOR */
/** @namespace Scanner.tokenType.FROM */
/** @namespace Scanner.tokenType.T */
/** @namespace Scanner.tokenType.SEMICOLON */
/** @namespace Scanner.tokenType.L_BRACKET */
/** @namespace Scanner.tokenType.R_BRACKET */
/** @namespace Scanner.tokenType.COMMA */
/** @namespace Scanner.tokenType.PLUS */
/** @namespace Scanner.tokenType.MINUS */
/** @namespace Scanner.tokenType.MUL */
/** @namespace Scanner.tokenType.DIV */
/** @namespace Scanner.tokenType.POWER */
/** @namespace Scanner.tokenType.FUNC */
/** @namespace Scanner.tokenType.CONST_ID */
/** @namespace Scanner.tokenType.NONTOKEN */
/** @namespace Scanner.tokenType.ERRTOKEN */
Scanner.tokenType = Util.enumerate(Scanner.tokenTypeName);

Scanner.prototype.initTokenTab = function () {
    const tokenList = [
        { type: Scanner.tokenType.CONST_ID, lexeme: 'PI', value: 3.1415926, callback: null },
        { type: Scanner.tokenType.CONST_ID, lexeme: 'E', value: 2.71828, callback: null },
        { type: Scanner.tokenType.T, lexeme: 'T', value: 0.0, callback: null },
        { type: Scanner.tokenType.FUNC, lexeme: 'SIN', value: 0.0, callback: Math.sin },
        { type: Scanner.tokenType.FUNC, lexeme: 'COS', value: 0.0, callback: Math.cos },
        { type: Scanner.tokenType.FUNC, lexeme: 'TAN', value: 0.0, callback: Math.tan },
        { type: Scanner.tokenType.FUNC, lexeme: 'LN', value: 0.0, callback: Math.log },
        { type: Scanner.tokenType.FUNC, lexeme: 'EXP', value: 0.0, callback: Math.exp },
        { type: Scanner.tokenType.FUNC, lexeme: 'SQRT', value: 0.0, callback: Math.sqrt },
        { type: Scanner.tokenType.ORIGIN, lexeme: 'ORIGIN', value: 0.0, callback: null },
        { type: Scanner.tokenType.SCALE, lexeme: 'SCALE', value: 0.0, callback: null },
        { type: Scanner.tokenType.ROT, lexeme: 'ROT', value: 0.0, callback: null },
        { type: Scanner.tokenType.IS, lexeme: 'IS', value: 0.0, callback: null },
        { type: Scanner.tokenType.FOR, lexeme: 'FOR', value: 0.0, callback: null },
        { type: Scanner.tokenType.FROM, lexeme: 'FROM', value: 0.0, callback: null },
        { type: Scanner.tokenType.TO, lexeme: 'TO', value: 0.0, callback: null },
        { type: Scanner.tokenType.STEP, lexeme: 'STEP', value: 0.0, callback: null },
        { type: Scanner.tokenType.DRAW, lexeme: 'DRAW', value: 0.0, callback: null }
    ];

    for (let i = 0, len = tokenList.length; i < len; i++) {
        this.tokenTabs.push(new Token(
            tokenList[i].type,
            tokenList[i].lexeme,
            tokenList[i].value,
            tokenList[i].callback
        ));
    }
};

Scanner.prototype.clearAll = function () {
    this.index = 0;
    this.lineNumber = 0;
    this.tokenBuffer = '';
};

Scanner.prototype.close = function () {
    this.index = 0;
};

Scanner.prototype.readInput = function (text) {
    if (text.length > this.MAX_TOKEN_LEN) {
        return -1;
    }

    /** clear all */
    this.clearAll();
    this.buffer = text;
};

Scanner.prototype.getChar = function () {
    if (this.index === this.buffer.length) {
        return '';
    }

    return this.buffer[this.index++];
};

Scanner.prototype.emptyTokenString = function () {
    this.tokenBuffer = '';
};

Scanner.prototype.addCharTokenString = function (ch) {
    if (this.tokenBuffer.length === this.MAX_TOKEN_LEN) {
        return -1;
    }

    this.tokenBuffer = this.tokenBuffer.concat(ch);
};

Scanner.prototype.judgeKeyToken = function (idString) {
    const tokenTabs = this.tokenTabs;

    for (let i = 0, len = tokenTabs.length; i < len; i++) {
        if (tokenTabs[i].lexeme === idString) {
            return tokenTabs[i];
        }
    }

    return new Token(Scanner.tokenType.ERRTOKEN, '', 0.0, null);
};

Scanner.prototype.getToken = function () {
    let str = '';
    let token = new Token();
    let character;

    this.emptyTokenString();
    str += this.tokenBuffer.toUpperCase();
    token.lexeme = str;

    for (;;) {
        character = this.getChar();

        if (character.charCodeAt(0) === 0) {
            return new Token(Scanner.tokenType.NONTOKEN, '', 0.0, null);
        }

        if (character === '\r' || character === '\n') {
            if (character === '\r') {
                character = this.getChar();
            }

            this.lineNumber++;
            continue;
        }

        if (character === '\t') {
            continue;
        }

        if (character !== ' ') {
            break;
        }
    }

    /**
     * if the character is not an empty character, or a tab, an enter key,
     * or even an EOF character, then push it into the tokenBuffer
     */
    this.addCharTokenString(character);

    /** DFA */
    if (/^[a-z]+$/i.test(character)) {
        /** function, keyword, PI, E, etc. */
        for (;;) {
            character = this.getChar();
            if (/^[a-z0-9]+$/i.test(character)) {
                this.addCharTokenString(character);
            } else {
                break;
            }
        }

        this.index--;
        str += this.tokenBuffer;

        token = this.judgeKeyToken(str.toUpperCase());
        token.lexeme = str.toUpperCase();
        return token;
    } else if (/^\d+$/i.test(character)) {
        for (;;) {
            character = this.getChar();
            if (/^\d+$/i.test(character)) {
                this.addCharTokenString(character);
            } else {
                break;
            }
        }

        if (character === '.') {
            this.addCharTokenString(character);

            for (;;) {
                character = this.getChar();
                if (/^\d+$/i.test(character)) {
                    this.addCharTokenString(character);
                } else {
                    break;
                }
            }
        }

        this.index--;
        str += this.tokenBuffer;
        token = new Token(Scanner.tokenType.CONST_ID, parseFloat(str).toString(), parseFloat(str), null);
        return token;
    } else {
        switch (character) {
        case ':':
            token = new Token(Scanner.tokenType.SEMICOLON, ':', 0.0, null);
            break;
        case '(':
            token = new Token(Scanner.tokenType.L_BRACKET, '(', 0.0, null);
            break;
        case ')':
            token = new Token(Scanner.tokenType.R_BRACKET, ')', 0.0, null);
            break;
        case ',':
            token = new Token(Scanner.tokenType.COMMA, ',', 0.0, null);
            break;
        case '+':
            token = new Token(Scanner.tokenType.PLUS, '+', 0.0, null);
            break;
        case '-':
            character = this.getChar();

            if (character === '-') {
                for (; character !== '\n' && character.charCodeAt(0) !== 0; character = this.getChar()) {}
                this.index--;
                return this.getToken(); /** call recursively */
            } else {
                /** binary operations */
                this.index--;
                token = new Token(Scanner.tokenType.MINUS, '-', 0.0, null);
                break;
            }
        case '/':
            character = this.getChar();

            if (character === '/') {
                for (; character !== '\n' && character.charCodeAt(0) !== 0; character = this.getChar()) {}
                this.index--;
                return this.getToken(); /** call recursively */
            } else {
                /** binary operations */
                this.index--;
                token = new Token(Scanner.tokenType.DIV, '/', 0.0, null);
                break;
            }
        case '*':
            character = this.getChar();

            if (character === '*') {
                token = new Token(Scanner.tokenType.POWER, '^', 0.0, null);
            } else {
                /** binary operations */
                this.index--;
                token = new Token(Scanner.tokenType.MUL, '*', 0.0, null);
            }
            break;
        default:
            token = new Token(Scanner.tokenType.ERRTOKEN, '', 0.0, null);
            break;
        }
    }

    return token;
};

export default Scanner;
