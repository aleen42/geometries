/*
 *                                                                _
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
 *  - Update Time: May, 30th, 2017
 *
 */

import Util from 'util/index';
import Token from 'compilers/token';

function Scanner() {
    this.tokenTypeName = [
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

    this.tokenType = Util.enumerate(this.tokenTypeName);

    this.MAXSIZE = 10000; /** the max type of notations */
    this.MAX_TOKEN_LEN = 100000; /** the max length of notations */

    this.index = 0;
    this.lineNumber = 0;

    this.tokenTabs = [];
    this.tokenBuffer = '';
}

Scanner.prototype.initTokenTab = function () {
    const tokenList = [
        { type: this.tokenType.CONST_ID, lexeme: 'PI', value: 3.1415926, callback: null },
        { type: this.tokenType.CONST_ID, lexeme: 'E', value: 2.71828, callback: null },
        { type: this.tokenType.T, lexeme: 'T', value: 0.0, callback: null },
        { type: this.tokenType.FUNC, lexeme: 'SIN', value: 0.0, callback: Math.sin },
        { type: this.tokenType.FUNC, lexeme: 'COS', value: 0.0, callback: Math.cos },
        { type: this.tokenType.FUNC, lexeme: 'TAN', value: 0.0, callback: Math.tan },
        { type: this.tokenType.FUNC, lexeme: 'LN', value: 0.0, callback: Math.log },
        { type: this.tokenType.FUNC, lexeme: 'EXP', value: 0.0, callback: Math.exp },
        { type: this.tokenType.FUNC, lexeme: 'SQRT', value: 0.0, callback: Math.sqrt },
        { type: this.tokenType.ORIGIN, lexeme: 'ORIGIN', value: 0.0, callback: null },
        { type: this.tokenType.SCALE, lexeme: 'SCALE', value: 0.0, callback: null },
        { type: this.tokenType.ROT, lexeme: 'ROT', value: 0.0, callback: null },
        { type: this.tokenType.IS, lexeme: 'IS', value: 0.0, callback: null },
        { type: this.tokenType.FOR, lexeme: 'FOR', value: 0.0, callback: null },
        { type: this.tokenType.FROM, lexeme: 'FROM', value: 0.0, callback: null },
        { type: this.tokenType.TO, lexeme: 'TO', value: 0.0, callback: null },
        { type: this.tokenType.STEP, lexeme: 'STEP', value: 0.0, callback: null },
        { type: this.tokenType.DRAW, lexeme: 'DRAW', value: 0.0, callback: null }
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

    return new Token(this.tokenType.ERRTOKEN, '', 0.0, null);
};

Scanner.prototype.getToken = function () {
    let str = '';
    let token = new Token();
    let character;

    this.emptyTokenString();
    str += this.tokenBuffer.toUpperCase()
    token.lexeme = str;

    for (;;) {
        character = this.getChar();

        if (character.charCodeAt(0) === 0) {
            return new Token(this.tokenType.NONTOKEN, '', 0.0, null);
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
        token = new Token(this.tokenType.CONST_ID, parseFloat(str).toString(), parseFloat(str), null);
        return token;
    } else {
        switch (character) {
        case ':':
            token = new Token(this.tokenType.SEMICOLON, ':', 0.0, null);
            break;
        case '(':
            token = new Token(this.tokenType.L_BRACKET, '(', 0.0, null);
            break;
        case ')':
            token = new Token(this.tokenType.R_BRACKET, ')', 0.0, null);
            break;
        case ',':
            token = new Token(this.tokenType.COMMA, ',', 0.0, null);
            break;
        case '+':
            token = new Token(this.tokenType.PLUS, '+', 0.0, null);
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
                token = new Token(this.tokenType.MINUS, '-', 0.0, null);
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
                token = new Token(this.tokenType.DIV, '/', 0.0, null);
                break;
            }
        case '*':
            character = this.getChar();

            if (character === '*') {
                token = new Token(this.tokenType.POWER, '^', 0.0, null);
            } else {
                /** binary operations */
                this.index--;
                token = new Token(this.tokenType.MUL, '*', 0.0, null);
            }
            break;
        default:
            token = new Token(this.tokenType.ERRTOKEN, '', 0.0, null);
            break;
        }
    }

    return token;
};

export default Scanner;
