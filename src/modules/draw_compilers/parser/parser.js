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
 *  - Document: parser.js
 *  - Author: aleen42
 *  - Description: A parser module for parsing content
 *  - Create Time: May, 31st, 2017
 *  - Update Time: Oct, 30th, 2017
 *
 */

import { TokenType, tokenTypeName } from 'compilers/common/tokenType';

import Scanner from 'compilers/scanner/scanner';
import Semantic from 'compilers/semantic/semantic';

import ExprNode from 'compilers/parser/exprNode';
import Content from 'compilers/parser/content';
import Reference from 'compilers/parser/reference';

/** @namespace options.debug */
/** @namespace options.isDrawing */
/** @namespace options.drawingCallback */
/** @namespace options.drawingCompleted */
/** @namespace options.isSyntaxTreeShown */

/**
 * the string text you want to parser
 * @param str
 * @param [debug]
 * @param [isSyntaxTreeShown]
 * @param [isDrawing]
 * @param [drawingCallback]
 * @param [lineCompleted]
 * @param [drawingCompleted]
 * @constructor
 */
function Parser(str, {
    debug = false,
    isSyntaxTreeShown = false,
    isDrawing = false,
    drawingCallback = () => {},
    lineCompleted = () => {},
    drawingCompleted = () => {}
} = {}) {
    /** a flag for setting debug process of the module, Parser */
    this.PARSE_DEBUG = debug;

    /** a flag for setting showing of syntax tree */
    this.isSyntaxTreeShown = isSyntaxTreeShown;

    /** a flag for setting drawing */
    this.isDrawing = isDrawing;
    this.drawCallback = drawingCallback;
    this.lineCompleted = lineCompleted;
    this.drawingCompleted = drawingCompleted;

    this.errorLineNumber = -1;
    this.indent = -1;

    this.variables = [];

    /** default value */
    this.originX = 300;
    this.originY = 300;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotateAngle = 0;
    this.logStr = '';

    /** using scanner and semantic to complete parsing */
    this.scanner = new Scanner();
    this.semantic = new Semantic(this);

    this.token = null;

    /** the entrance of Parser */
    this.enter('Parser');
    this.scanner.readInput(str);
    this.scanner.initTokenTab();
    this.fetchToken();
    this.program();
    this.back('Parser');
    this.scanner.close();
}

Parser.prototype.log = function (str) {
    this.logStr += `\n${str}`;
};

Parser.prototype.outputLog = function () {
    return this.logStr;
};

Parser.prototype.enter = function (str) {
    if (this.PARSE_DEBUG && !this.scanner.isScannerClosed) {
        let info = '';
        this.indent++;

        for (let i = 1; i <= this.indent; i++) {
            info += '\t';
        }

        this.log(`${info} Enter in ${str}`);
    }
};

Parser.prototype.back = function (str) {
    if (this.PARSE_DEBUG && !this.scanner.isScannerClosed) {
        let info = '';

        for (let i = 1; i <= this.indent; i++) {
            info += '\t';
        }

        this.log(`${info} Exit from ${str}`);
        this.indent--;
    }
};

Parser.prototype.printSyntaxTree = function (root, indent) {
    let info = '';

    for (let i = 1; i <= this.indent + 1; i++) {
        info += '\t';
    }

    for (let i = 1; i <= indent; i++) {
        info += '\t';
    }

    switch (root.tokenType) {
    case TokenType.PLUS:
        this.log(`${info} +`);
        break;
    case TokenType.MINUS:
        this.log(`${info} -`);
        break;
    case TokenType.MUL:
        this.log(`${info} *`);
        break;
    case TokenType.DIV:
        this.log(`${info} /`);
        break;
    case TokenType.POWER:
        this.log(`${info} **`);
        break;
    case TokenType.FUNC:
        this.log(`${info} ${root.content.caseFunc.mathFunc.name}`);
        break;
    case TokenType.CONST_ID:
        this.log(`${info} ${root.content.caseConst}`);
        break;
    case TokenType.VAR:
        this.log(`${info} ${root.content.caseConst}`);
        break;
    default:
        this.log(`${info} Error Tree Node!`);
        return;
    }

    if (root.tokenType === TokenType.CONST_ID
        || root.tokenType === TokenType.VAR) {
        return;
    }

    if (root.tokenType === TokenType.FUNC) {
        this.printSyntaxTree(root.content.caseFunc.childNode, indent + 1);
    } else {
        this.printSyntaxTree(root.content.caseOperator.leftNode, indent + 1);
        this.printSyntaxTree(root.content.caseOperator.rightNode, indent + 1);
    }
};

Parser.prototype.errMsg = function (info, lineNumber, description, str) {
    if (this.PARSE_DEBUG) {
        this.log(`${info} Line Number: ${lineNumber}: ${str} ${description}`)
    }

    this.scanner.close();
};

Parser.prototype.syntaxError = function (description) {
    if (this.scanner.lineNumber !== this.errorLineNumber) {
        let info = '';
        this.indent++;

        for (let i = 1; i <= this.indent; i++) {
            info += '\t';
        }

        this.errMsg(info, this.scanner.lineNumber, description, this.token.lexeme);

        this.indent--;
    }
};

Parser.prototype.fetchToken = function () {
    this.token = this.scanner.getToken();

    if (this.token.type === TokenType.ERRTOKEN) {
        this.syntaxError('Wrong Token');
        this.errorLineNumber = this.scanner.lineNumber;
    }
};

Parser.prototype.matchToken = function (tokenType, value) {
    value = value === void 0 ? this.token.lexeme : value;

    if (this.token.type !== tokenType) {
        this.syntaxError('Unexpected Token');
        this.errorLineNumber = this.scanner.lineNumber;
    } else {
        if (this.PARSE_DEBUG) {
            let info = '';

            for (let i = 1; i <= this.indent + 1; i++) {
                info += '\t';
            }

            this.log(`${info} Match Token: ${tokenTypeName[tokenType]} (${value})`);
        }
    }

    this.fetchToken();
};

Parser.prototype.makeExprNode = function (tokenType, leftNode, rightNode, funcPtr) {
    const content = new Content();
    let node = new ExprNode(tokenType, content);

    switch (tokenType) {
    case TokenType.CONST_ID:
        node.content.caseConst = parseFloat(leftNode);
        break;
    case TokenType.VAR:
        /** get the same variable node */
        var variableNode = this.variables.filter(item => item.content.lexeme === content.lexeme)[0];
        if (variableNode) {
            node = variableNode;
        } else {
            node.content.caseParamPtr = new Reference();
            this.variables.push(node);
        }
        break;
    case TokenType.FUNC:
        node.content.caseFunc.mathFunc = funcPtr;
        node.content.caseFunc.childNode = rightNode;
        break;
    default:
        node.content.caseOperator.leftNode = leftNode;
        node.content.caseOperator.rightNode = rightNode;
        break;
    }

    return node;
};

Parser.prototype.program = function () {
    const self = this;

    /** Statement Recursive Function */
    function statement() {
        /** Expression Recursive Function */
        function expression() {
            /** Term Recursive Function */
            function term() {
                /** Factor Recursive Function */
                function factor() {
                    /** Component Recursive Function */
                    function component() {
                        /** Atom Recursive Function */
                        function atom() {
                            let addressNode;
                            let tempNode;
                            let curToken = self.token;

                            self.enter('Atom');

                            switch (self.token.type) {
                            case TokenType.CONST_ID:
                                self.matchToken(TokenType.CONST_ID, curToken.value);
                                addressNode = self.makeExprNode(TokenType.CONST_ID, curToken.value, null, null);
                                break;
                            case TokenType.VAR:
                                self.matchToken(TokenType.VAR, curToken.lexeme);
                                addressNode = self.makeExprNode(TokenType.VAR, null, null, null);
                                break;
                            case TokenType.FUNC:
                                self.matchToken(TokenType.FUNC);
                                self.matchToken(TokenType.L_BRACKET);
                                tempNode = expression.call(self);
                                addressNode = self.makeExprNode(TokenType.FUNC, null, tempNode, curToken.callback);
                                self.matchToken(TokenType.R_BRACKET);
                                break;
                            case TokenType.L_BRACKET:
                                self.matchToken(TokenType.L_BRACKET);
                                addressNode = expression.call(self);
                                self.matchToken(TokenType.R_BRACKET);
                                break;
                            default:
                                self.syntaxError('Unexpected Token');
                                return null;
                            }

                            self.back('Atom');
                            return addressNode;
                        }

                        let leftNode;
                        let rightNode;
                        let tempTokenType;

                        self.enter('Component');

                        if (self.token.type === TokenType.INCREMENT || self.token.type === TokenType.DECREMENT) {
                            /** pre-increment or pre-decrement */
                            tempTokenType = self.token.type;
                            self.matchToken(tempTokenType);
                            leftNode = self.makeExprNode(tempTokenType, null, atom.call(self), null);
                        } else {
                            leftNode = atom.call(self);

                            if (self.token.type === TokenType.INCREMENT || self.token.type === TokenType.DECREMENT) {
                                /** post-increment or post-decrement */
                                tempTokenType = self.token.type;
                                self.matchToken(tempTokenType);
                                leftNode = self.makeExprNode(tempTokenType, leftNode, null, null);
                            }

                            if (self.token.type === TokenType.POWER) {
                                self.matchToken(TokenType.POWER);
                                rightNode = component.call(self);
                                leftNode = self.makeExprNode(TokenType.POWER, leftNode, rightNode, null);
                            }
                        }

                        self.back('Component');
                        return leftNode;
                    }

                    self.enter('Factor');

                    let leftNode;
                    let rightNode;

                    if (self.token.type === TokenType.PLUS || self.token.type === TokenType.MINUS) {
                        /** negative or positive value */
                        const tempTokenType = self.token.type;
                        self.matchToken(tempTokenType);

                        rightNode = factor.call(self);

                        const transparent = new Content();
                        transparent.caseConst = 0.0;

                        leftNode = new ExprNode(TokenType.CONST_ID, transparent);
                        rightNode = self.makeExprNode(tempTokenType, leftNode, rightNode, null);
                    } else {
                        rightNode = component.call(self);
                    }

                    self.back('Factor');
                    return rightNode;
                }

                self.enter('Term');

                let leftNode = factor.call(self);
                let rightNode;

                for (;;) {
                    if (self.token.type !== TokenType.MUL && self.token.type !== TokenType.DIV) {
                        break;
                    }

                    const tempTokenType = self.token.type;
                    self.matchToken(tempTokenType);
                    rightNode = factor.call(self);
                    leftNode = self.makeExprNode(tempTokenType, leftNode, rightNode, null);
                }


                self.back('Term');
                return leftNode;
            }

            self.enter('Expression');

            let leftNode = term.call(self);
            let rightNode;

            for (;;) {
                if (self.token.type !== TokenType.PLUS && self.token.type !== TokenType.MINUS) {
                    break;
                }

                const tempTokenType = self.token.type;
                self.matchToken(tempTokenType);
                rightNode = term.call(self);
                leftNode = self.makeExprNode(tempTokenType, leftNode, rightNode, null);
            }

            if (this.isSyntaxTreeShown) {
                this.printSyntaxTree(leftNode, 1);
            }

            self.back('Expression');
            return leftNode;
        }

        self.enter('Statement');

        let tempNode = new ExprNode();

        switch (self.token.type) {
        case TokenType.ORIGIN:
            /** Origin Statement */
            self.enter('Origin Statement');

            self.matchToken(TokenType.ORIGIN);
            self.matchToken(TokenType.IS);
            self.matchToken(TokenType.L_BRACKET);

            tempNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                self.originX = this.semantic.getExpressionValue(tempNode);
                self.semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(TokenType.COMMA);

            tempNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                self.originY = this.semantic.getExpressionValue(tempNode);
                self.semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(TokenType.R_BRACKET);

            self.back('Origin Statement');
            break;
        case TokenType.SCALE:
            /** Scale Statement */
            self.enter('Scale Statement');

            self.matchToken(TokenType.SCALE);
            self.matchToken(TokenType.IS);
            self.matchToken(TokenType.L_BRACKET);

            tempNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                /** get the ratio factor of X axis */
                self.scaleX = self.semantic.getExpressionValue(tempNode);
                self.semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(TokenType.COMMA);

            tempNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                /** get the ratio factor of Y axis */
                self.scaleY = self.semantic.getExpressionValue(tempNode);
                self.semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(TokenType.R_BRACKET);

            self.back('Scale Statement');
            break;
        case TokenType.ROT:
            /** Rotate Statement */
            self.enter('Rotate Statement');

            self.matchToken(TokenType.ROT);
            self.matchToken(TokenType.IS);

            tempNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                /** get the rotate angle */
                self.rotateAngle = self.semantic.getExpressionValue(tempNode);
                self.semantic.deleteExpressionTree(tempNode);
            }

            self.back('Rotate Statement');
            break;
        case TokenType.FOR:
            /** Loop Statement */
            /** the start point to draw */
            let start = 0;
            /** the end point to draw */
            let end = 0;
            /** the step of each drawing process */
            let step = 0;

            let startNode;
            let endNode;
            let stepNode;
            let x;
            let y;

            self.enter('For Statement');

            self.matchToken(TokenType.FOR);
            self.matchToken(TokenType.VAR);
            self.matchToken(TokenType.FROM);

            /** calculate the value of start point to draw */
            startNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                start = self.semantic.getExpressionValue(startNode);
                self.semantic.deleteExpressionTree(startNode);
            }

            self.matchToken(TokenType.TO);

            /** calculate the value of end point to draw */
            endNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                end = self.semantic.getExpressionValue(endNode);
                self.semantic.deleteExpressionTree(endNode);
            }

            self.matchToken(TokenType.STEP);
            stepNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                step = self.semantic.getExpressionValue(stepNode);
                self.semantic.deleteExpressionTree(stepNode);
            }

            self.matchToken(TokenType.DRAW);
            self.matchToken(TokenType.L_BRACKET);

            x = expression.call(self);

            self.matchToken(TokenType.COMMA);

            y = expression.call(self);

            self.matchToken(TokenType.R_BRACKET);

            if (self.isDrawing && !self.PARSE_DEBUG) {
                self.semantic.drawLoop(start, end, step, x, y);
                self.semantic.deleteExpressionTree(x);
                self.semantic.deleteExpressionTree(y);
            }

            self.back('For Statement');
            break;
        default:
            self.syntaxError('Unexpected Token');
            self.errorLineNumber = self.scanner.lineNumber;
            break;
        }

        self.back('Statement');
    }

    self.enter('Program');

    for (;;) {
        if (self.token.type === TokenType.NONTOKEN) {
            if (self.isDrawing) {
                self.drawingCompleted();
            }

            break;
        }

        if (self.scanner.lineNumber !== self.errorLineNumber) {
            statement.call(self);
        }

        self.matchToken(TokenType.SEMICOLON)
    }

    self.back('Program');
};

export default Parser;
