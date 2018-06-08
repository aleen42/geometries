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
 *  - Update Time: Jun, 6th, 2018
 *
 */

/* global require, module */
const { TokenType } = require('../common/tokenType');
const Token = require('./token');

class Scanner {
    constructor() {
        this.index = 0;
        this.lineNumber = 0;

        this.tokenTabs = [];
        this.tokenBuffer = '';

        /** check whether the scanner is close */
        this.isScannerClosed = false;
    }

    initTokenTab() {
        [
            /** reserved keyword */
            { type: TokenType.RESERVED, lexeme: 'NOT', value: 0.0, callback: null },
            { type: TokenType.CONST_ID, lexeme: 'PI', value: 3.1415926, callback: null },
            { type: TokenType.CONST_ID, lexeme: 'E', value: 2.71828, callback: null },
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
        ].map(item => {
            this.tokenTabs.push(new Token(item.type, item.lexeme, item.value, item.callback));
        });
    }

    clearAll() {
        this.index = 0;
        this.lineNumber = 0;
        this.tokenBuffer = '';
    }

    close() {
        this.index = 0;
        this.isScannerClosed = true;
    }

    readInput(text) {
        /** clear all */
        this.clearAll();
        this.buffer = text;
    }

    getChar() {
        return this.index === this.buffer.length ? '' : this.buffer[this.index++];
    }

    emptyTokenString() {
        this.tokenBuffer = '';
    }

    addCharTokenString(ch) {
        this.tokenBuffer = this.tokenBuffer.concat(ch);
    }

    judgeKeyToken(idString) {
        const legalTokenTabs = this.tokenTabs.filter(item => item.lexeme === idString)[0];

        /** if do not match any legal token, then mark it as a parameter */
        return legalTokenTabs === void 0 ? new Token(TokenType.VAR, idString, 0.0, null) : legalTokenTabs;
    }

    getToken() {
        if (this.isScannerClosed) {
            /** return NONTOKEN to stop parser when it is closed with exeption */
            return new Token(TokenType.NONTOKEN, '', 0.0, null);
        }

        let str = '';
        let token = new Token();
        let character;

        this.emptyTokenString();
        str += this.tokenBuffer.toUpperCase();
        token.lexeme = str;

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

        /**
         * try to match characters with regex and add them to the token buffer
         * @param regex
         */
        const tryToMatch = regex => {
            for (;;) {
                character = this.getChar();
                if (!regex.test(character)) {
                    break;
                }

                this.addCharTokenString(character);
            }
        };

        /**
         * map operator character to token type
         * @param character
         * @returns {*}
         */
        const convertToTokenType = character => {
            return {
                ';': TokenType.SEMICOLON,
                '(': TokenType.L_BRACKET,
                ')': TokenType.R_BRACKET,
                ',': TokenType.COMMA,
                '+': TokenType.PLUS,
                '-': TokenType.MINUS,
                '*': TokenType.MUL,
                '/': TokenType.DIV,
                '^': TokenType.POWER,
                '%': TokenType.MOD,
                '++': TokenType.INCREMENT,
                '--': TokenType.DECREMENT
            }[character]
        };

        /** DFA */
        if (/^[a-z][_0-9a-z]*$/i.test(character)) {
            /** function, keyword, PI, E, or variables. */
            tryToMatch(/^[_0-9a-z]+$/i);
            this.index--;
            str += this.tokenBuffer;

            token = this.judgeKeyToken(str.toUpperCase());
            token.lexeme = str.toUpperCase();
            return token;
        } else if (/^\d+$/i.test(character)) {
            tryToMatch(/^\d+$/i);
            if (character === '.') {
                this.addCharTokenString(character);
                tryToMatch(/^\d+$/i);
            }

            this.index--;
            str += this.tokenBuffer;
            token = new Token(TokenType.CONST_ID, parseFloat(str).toString(), parseFloat(str), null);
            return token;
        } else {
            switch (character) {
            case ';':
            case '(':
            case ')':
            case ',':
            case '*':
            case '/':
            case '^':
            case '%':
                token = new Token(convertToTokenType(character), character, 0.0, null);
                break;
            case '+':
            case '-':
                const previousCharacter = character;
                character = this.getChar();

                if (character === previousCharacter) {
                    /** increment or decrement */
                    token = new Token(convertToTokenType(previousCharacter + character), previousCharacter + character, 0.0, null);
                } else {
                    this.index--;
                    token = new Token(convertToTokenType(previousCharacter), previousCharacter, 0.0, null);
                }
                break;
            default:
                token = new Token(TokenType.ERRTOKEN, character, 0.0, null);
                break;
            }
        }

        return token;
    }
}

module.exports = Scanner;
