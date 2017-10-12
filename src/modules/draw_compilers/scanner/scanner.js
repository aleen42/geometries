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

import { TokenType } from 'compilers/common/tokenType';
import Token from 'compilers/scanner/token';

function Scanner() {
    this.MAXSIZE = 10000; /** the max type of notations */
    this.MAX_TOKEN_LEN = 100000; /** the max length of notations */

    this.index = 0;
    this.lineNumber = 0;

    this.tokenTabs = [];
    this.tokenBuffer = '';

    /** check whether the scanner is close */
    this.isScannerClosed = false;
}

Scanner.prototype.initTokenTab = function () {
    const tokenList = [
        { type: TokenType.CONST_ID, lexeme: 'PI', value: 3.1415926, callback: null },
        { type: TokenType.CONST_ID, lexeme: 'E', value: 2.71828, callback: null },
        { type: TokenType.T, lexeme: 'T', value: 0.0, callback: null },
        { type: TokenType.FUNC, lexeme: 'SIN', value: 0.0, callback: Math.sin },
        { type: TokenType.FUNC, lexeme: 'COS', value: 0.0, callback: Math.cos },
        { type: TokenType.FUNC, lexeme: 'TAN', value: 0.0, callback: Math.tan },
        { type: TokenType.FUNC, lexeme: 'LN', value: 0.0, callback: Math.log },
        { type: TokenType.FUNC, lexeme: 'EXP', value: 0.0, callback: Math.exp },
        { type: TokenType.FUNC, lexeme: 'SQRT', value: 0.0, callback: Math.sqrt },
        { type: TokenType.ORIGIN, lexeme: 'ORIGIN', value: 0.0, callback: null },
        { type: TokenType.SCALE, lexeme: 'SCALE', value: 0.0, callback: null },
        { type: TokenType.ROT, lexeme: 'ROT', value: 0.0, callback: null },
        { type: TokenType.IS, lexeme: 'IS', value: 0.0, callback: null },
        { type: TokenType.FOR, lexeme: 'FOR', value: 0.0, callback: null },
        { type: TokenType.FROM, lexeme: 'FROM', value: 0.0, callback: null },
        { type: TokenType.TO, lexeme: 'TO', value: 0.0, callback: null },
        { type: TokenType.STEP, lexeme: 'STEP', value: 0.0, callback: null },
        { type: TokenType.DRAW, lexeme: 'DRAW', value: 0.0, callback: null }
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
    this.isScannerClosed = true;
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

    return new Token(TokenType.ERRTOKEN, '', 0.0, null);
};

Scanner.prototype.getToken = function () {
    let str = '';
    let token = new Token();
    let character;

    this.emptyTokenString();
    str += this.tokenBuffer.toUpperCase();
    token.lexeme = str;

    if (this.isScannerClosed) {
        /** return NONTOKEN to stop parser when it is closed with exeption */
        return new Token(TokenType.NONTOKEN, '', 0.0, null);
    }

    for (;;) {
        character = this.getChar();

        if (character === '') {
            return new Token(TokenType.NONTOKEN, '', 0.0, null);
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
        token = new Token(TokenType.CONST_ID, parseFloat(str).toString(), parseFloat(str), null);
        return token;
    } else {
        switch (character) {
        case ';':
            token = new Token(TokenType.SEMICOLON, ';', 0.0, null);
            break;
        case '(':
            token = new Token(TokenType.L_BRACKET, '(', 0.0, null);
            break;
        case ')':
            token = new Token(TokenType.R_BRACKET, ')', 0.0, null);
            break;
        case ',':
            token = new Token(TokenType.COMMA, ',', 0.0, null);
            break;
        case '+':
            token = new Token(TokenType.PLUS, '+', 0.0, null);
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
                token = new Token(TokenType.MINUS, '-', 0.0, null);
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
                token = new Token(TokenType.DIV, '/', 0.0, null);
                break;
            }
        case '*':
            character = this.getChar();

            if (character === '*') {
                token = new Token(TokenType.POWER, '^', 0.0, null);
            } else {
                /** binary operations */
                this.index--;
                token = new Token(TokenType.MUL, '*', 0.0, null);
            }
            break;
        default:
            token = new Token(TokenType.ERRTOKEN, '', 0.0, null);
            break;
        }
    }

    return token;
};

export default Scanner;
