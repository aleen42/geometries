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
 *  - Create Time: May 31st, 2017
 *  - Update Time: Jul 19th, 2021
 *
 */

/* global require, module */
const { TokenType, tokenTypeName } = require('../common/tokenType');

const Scanner = require('../scanner/scanner');
const Semantic = require('../semantic/semantic');

const ExprNode = require('./exprNode');
const Content = require('./content');
const Reference = require('./reference');

/** @namespace options.debug */
/** @namespace options.drawingCallback */
/** @namespace options.drawingCompleted */
/** @namespace options.isSyntaxTreeShown */

/**
 * the string text you want to parser
 * @param str
 * @param [debug]
 * @param [isSyntaxTreeShown]
 * @param [drawingCallback]
 * @param [lineCompleted]
 * @param [drawingCompleted]
 * @constructor
 */
function Parser(str, {
    debug = false,
    isSyntaxTreeShown = false,
    drawingCallback = () => {},
    lineCompleted = () => {},
    drawingCompleted = () => {},
} = {}) {
    /** a flag for setting debug process of the module, Parser */
    this.PARSE_DEBUG = debug;

    /** a flag for setting showing of syntax tree */
    this.isSyntaxTreeShown = isSyntaxTreeShown;

    /** a flag for setting drawing */
    this.drawCallback = drawingCallback;
    this.lineCompleted = lineCompleted;
    this.drawingCompleted = drawingCompleted;

    this.errorLineNumber = -1;
    this.indent = -1;

    /** an array for storing defined variables */
    this.variables = [];
    /** an array for storing defined loop */
    this.loops = [];

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
        this.log(formatInfo(++this.indent, `Enter in ${str}`));
    }
};

Parser.prototype.back = function (str) {
    if (this.PARSE_DEBUG && !this.scanner.isScannerClosed) {
        this.log(formatInfo(this.indent--, `Exit from ${str}`));
    }
};

Parser.prototype.printSyntaxTree = function (root, indent) {
    const info = {
        [TokenType.PLUS]: '+',
        [TokenType.MINUS]: '-',
        [TokenType.MUL]: '*',
        [TokenType.DIV]: '/',
        [TokenType.POWER]: '^',
        [TokenType.MOD]: '%',
        [TokenType.FUNC]: () => root.content.caseFunc.mathFunc.name,
        [TokenType.CONST_ID]: () => root.content.caseConst,
        [TokenType.VAR]: () => root.content.caseConst,
    }[root.tokenType] || 'Error Tree Node!';

    this.log(formatInfo(this.indent + 1 + indent, info.call ? info() : info));

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

Parser.prototype.errMsg = function (lineNumber, description, str) {
    this.scanner.close();
    throw `Line Number: ${lineNumber}: ${str} ${description}`;
};

Parser.prototype.syntaxError = function (description) {
    if (this.scanner.lineNumber !== this.errorLineNumber) {
        this.indent++;
        this.errMsg(this.scanner.lineNumber, description, this.token.lexeme);
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
            this.log(formatInfo(this.indent + 1, `Match Token: ${tokenTypeName[tokenType]} (${value})`));
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
        const variableNode = this.variables.filter(item => item.content.caseConst === leftNode)[0];
        if (variableNode) {
            node = variableNode;
        } else {
            node.content.caseConst = leftNode;
            node.content.caseParamPtr = new Reference();
            this.variables.push(node);
        }
        break;
    case TokenType.FUNC:
        node.content.caseFunc.mathFunc = funcPtr;
        node.content.caseFunc.childNode = rightNode;
        break;
    case TokenType.INCREMENT:
    case TokenType.DECREMENT:
        if (![TokenType.CONST_ID, TokenType.VAR].includes((leftNode || rightNode).tokenType)) {
            this.syntaxError(`Invalid left-hand side expression in ${leftNode ? 'postfix' : 'prefix'} operation`);
            this.errorLineNumber = this.scanner.lineNumber;
        }
        node.content.caseOperator.leftNode = leftNode;
        node.content.caseOperator.rightNode = rightNode;
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
                            const curToken = self.token;
                            const tokenType = curToken.type;

                            self.enter('Atom');

                            switch (tokenType) {
                            case TokenType.CONST_ID:
                            case TokenType.VAR:
                                const val = {
                                    [TokenType.CONST_ID]: curToken.value,
                                    [TokenType.VAR]: curToken.lexeme,
                                }[tokenType];

                                self.matchToken(tokenType, val);
                                addressNode = self.makeExprNode(tokenType, val, null, null);
                                break;
                            case TokenType.FUNC:
                                self.matchToken(TokenType.FUNC);
                                self.matchToken(TokenType.L_BRACKET);
                                addressNode = self.makeExprNode(TokenType.FUNC, null, expression.call(self), curToken.callback);
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

                        self.enter('Component');

                        let curTokenType = self.token.type;
                        if (curTokenType === TokenType.INCREMENT || curTokenType === TokenType.DECREMENT) {
                            /** pre-increment or pre-decrement */
                            self.matchToken(curTokenType);
                            leftNode = self.makeExprNode(curTokenType, null, atom.call(self), null);
                        } else {
                            leftNode = atom.call(self);
                            curTokenType = self.token.type;

                            if (curTokenType === TokenType.INCREMENT || curTokenType === TokenType.DECREMENT) {
                                /** post-increment or post-decrement */
                                self.matchToken(curTokenType);
                                leftNode = self.makeExprNode(curTokenType, leftNode, null, null);
                            }

                            if (curTokenType === TokenType.POWER) {
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
                    if (self.token.type !== TokenType.MUL
                        && self.token.type !== TokenType.DIV
                        && self.token.type !== TokenType.MOD) {
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

            let loopNode;
            let startNode;
            let endNode;
            let stepNode;
            let x;
            let y;

            self.enter('For Statement');

            self.matchToken(TokenType.FOR);

            loopNode = self.makeExprNode(TokenType.VAR, self.token.lexeme, null, null);
            self.loops.push(loopNode);
            self.matchToken(TokenType.VAR, self.token.lexeme);

            self.matchToken(TokenType.FROM);

            startNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                /** calculate the value of start point */
                start = self.semantic.getExpressionValue(startNode);
                self.semantic.deleteExpressionTree(startNode);
            }

            self.matchToken(TokenType.TO);

            endNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                /** calculate the value of end point */
                end = self.semantic.getExpressionValue(endNode);
                self.semantic.deleteExpressionTree(endNode);
            }

            self.matchToken(TokenType.STEP);
            stepNode = expression.call(self);

            if (!self.PARSE_DEBUG) {
                step = self.semantic.getExpressionValue(stepNode);
                self.semantic.deleteExpressionTree(stepNode);
            }

            if (self.token.type === TokenType.FOR) {
                loopNode.childLoopNode = statement.call(self);

                if (!self.PARSE_DEBUG) {
                    loopNode.execute = function () {
                        const pointer = loopNode.content.caseParamPtr;
                        for (pointer.parameter = start; pointer.parameter <= end; pointer.parameter += step) {
                            loopNode.childLoopNode.execute();
                        }
                    };
                }
            }

            /** loop for drawing */
            if (self.token.type === TokenType.DRAW) {
                self.matchToken(TokenType.DRAW);
                self.matchToken(TokenType.L_BRACKET);

                x = expression.call(self);

                self.matchToken(TokenType.COMMA);

                y = expression.call(self);

                self.matchToken(TokenType.R_BRACKET);

                if (!self.PARSE_DEBUG) {
                    loopNode.execute = function () {
                        const pointer = loopNode.content.caseParamPtr;
                        for (pointer.parameter = start; pointer.parameter <= end; pointer.parameter += step) {
                            self.semantic.draw(x, y);
                            self.semantic.deleteExpressionTree(x);
                            self.semantic.deleteExpressionTree(y);
                        }

                        self.lineCompleted();
                    };
                }
            }

            self.back('For Statement');
            self.back('Statement');
            return loopNode;
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
            if (!self.PARSE_DEBUG) {
                self.drawingCompleted();
            }

            break;
        }

        if (self.scanner.lineNumber !== self.errorLineNumber) {
            statement.call(self);
        }

        self.matchToken(TokenType.SEMICOLON);

        if (!self.PARSE_DEBUG && self.loops.length > 0) {
            /** execute from the first loop when it is a loop statement */
            self.loops[0].execute();
            /** clear the array */
            self.loops = [];
        }
    }

    self.back('Program');
};

function formatInfo(indent, msg) {
    return `${Array(indent).fill('\t').join('')}${msg ? ` ${msg}` : ''}`;
}

module.exports = Parser;
