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
 *  - Update Time: Oct, 13rd, 2017
 *
 */

import { TokenType, tokenTypeName } from 'compilers/common/tokenType';

import Scanner from 'compilers/scanner/scanner';
import Semantic from 'compilers/semantic/semantic';

import ExprNode from 'compilers/parser/exprNode';
import Content from 'compilers/parser/content';
import Reference from 'compilers/parser/reference';

function Parser(str) {
    /** a flag for setting debug process of the module, Parser */
    this.PARSE_DEBUG = true;

    this.errorLineNumber = -1;
    this.indent = -1;

    this.parameter = new Reference();

    // default value
    this.originX = 300;
    this.originY = 300;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotateAngle = 0;

    this.scanner = new Scanner();
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

Parser.prototype.enter = function (str) {
    if (this.PARSE_DEBUG && !this.scanner.isScannerClosed) {
        let info = '';
        this.indent++;

        for (let i = 1; i <= this.indent; i++) {
            info += '\t';
        }

        console.log(`${info} Enter in ${str}`);
    }
};

Parser.prototype.back = function (str) {
    if (this.PARSE_DEBUG && !this.scanner.isScannerClosed) {
        let info = '';

        for (let i = 1; i <= this.indent; i++) {
            info += '\t';
        }

        console.log(`${info} Exit from ${str}`);
        this.indent--;
    }
};

Parser.prototype.match = function (str) {
    if (this.PARSE_DEBUG) {
        console.log(`Match token ${str}`)
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
        console.log(`${info} +`);
        break;
    case TokenType.MINUS:
        console.log(`${info} -`);
        break;
    case TokenType.DIV:
        console.log(`${info} /`);
        break;
    case TokenType.POWER:
        console.log(`${info} **`);
        break;
    case TokenType.FUNC:
        console.log(`${info} ${root.content.caseFunc.mathFunc.name}`);
        break;
    case TokenType.CONST_ID:
        console.log(`${info} ${root.content.caseConst}`);
        break;
    case TokenType.T:
        console.log(`${info} T`);
        break;
    default:
        console.log(`${info} Error Tree Node!`);
        return;
    }

    if (root.tokenType === TokenType.CONST_ID
        || root.tokenType === TokenType.T) {
        return;
    }

    if (root.tokenType === TokenType.FUNC) {
        this.printSyntaxTree(root.content.caseFunc.childNode, indent + 1);
    } else {
        this.printSyntaxTree(root.content.caseFunc.leftNode, indent + 1);
        this.printSyntaxTree(root.content.caseFunc.rightNode, indent + 1);
    }
};

Parser.prototype.traceTree = function (node) {
    if (this.PARSE_DEBUG) {
        this.printSyntaxTree(node, 1);
    }
};

Parser.prototype.errMsg = function (info, lineNumber, description, str) {
    if (this.PARSE_DEBUG) {
        console.log(`${info} Line Number: ${lineNumber}: ${str} ${description}`)
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

Parser.prototype.matchToken = function (tokenType) {
    if (this.token.type !== tokenType) {
        this.syntaxError('Unexpected Token');
        this.errorLineNumber = this.scanner.lineNumber;
    }

    this.fetchToken();
};

Parser.prototype.makeExprNode = function (tokenType, leftNode, rightNode, funcPtr) {
    const content = new Content();
    const node = new ExprNode(tokenType, content);

    switch (tokenType) {
    case TokenType.CONST_ID:
        node.content.caseConst = parseFloat(leftNode);
        break;
    case TokenType.T:
        node.content.caseParamPtr = this.parameter;
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
    var self = this;

    /** Statement Recursive Function */
    function statement() {
        /** Expression Recursive Function */
        function expression () {
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

                            self.enter('atom');

                            switch (self.token.type) {
                            case TokenType.CONST_ID:
                                self.matchToken(TokenType.CONST_ID, curToken.value);
                                addressNode = self.makeExprNode(TokenType.CONST_ID, curToken.value, null, null);
                                break;
                            case TokenType.T:
                                self.matchToken(TokenType.T);
                                addressNode = self.makeExprNode(TokenType.T, null, null, null);
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

                            self.back('atom');
                            return addressNode;
                        }

                        let leftNode;
                        let rightNode;

                        self.enter('Component');

                        leftNode = atom.call(self);
                        if (self.token.type === TokenType.POWER) {
                            self.matchToken(TokenType.POWER);
                            rightNode = component.call(self);
                            leftNode = self.makeExprNode(TokenType.POWER, leftNode, rightNode, null);
                        }

                        self.back('Component');
                        return leftNode;
                    }

                    let leftNode;
                    let rightNode;

                    self.enter('Factor');

                    if (self.token.type === TokenType.PLUS) {
                        self.matchToken(TokenType.PLUS);
                        rightNode = factor.call(self);
                    } else if (self.token.type === TokenType.MINUS) {
                        self.matchToken(TokenType.MINUS);
                        rightNode = factor.call(self);

                        const transparent = new Content();
                        transparent.caseConst = 0.0;

                        leftNode = new ExprNode(TokenType.CONST_ID, transparent);

                        rightNode = self.makeExprNode(TokenType.MINUS, leftNode, rightNode, null);
                    } else {
                        rightNode = component.call(this);
                    }

                    self.back('Factor');
                    return rightNode;
                }

                self.enter('Term');

                let leftNode = factor.call(this);

                self.back('Term');
                return leftNode;
            }

            self.enter('Expression');

            let leftNode = term.call(this);

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

            tempNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                self.originX = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(TokenType.COMMA);

            self.back('Origin Statement');

            break;
        case TokenType.SCALE:
            /** Scale Statement */
            self.enter('Scale Statement');

            self.matchToken(TokenType.SCALE);
            self.matchToken(TokenType.IS);
            self.matchToken(TokenType.L_BRACKET);

            tempNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                /** get the ratio factor of X axis */
                self.scaleX = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(TokenType.COMMA);

            tempNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                /** get the ratio factor of Y axis */
                self.scaleY = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(TokenType.R_BRACKET);

            self.back('Scale Statement');
            break;
        case TokenType.ROT:
            /** Rotate Statement */
            self.enter('Rotate Statement');

            self.matchToken(TokenType.ROT);
            self.matchToken(TokenType.IS);

            tempNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                /** get the rotate angle */
                self.rotateAngle = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
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

            self.enter('Loop Statement');

            self.matchToken(TokenType.FOR);
            self.matchToken(TokenType.T);
            self.matchToken(TokenType.FROM);

            /** calculate the value of start point to draw */
            startNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                start = Semantic.getExprssionValue(startNode);
                Semantic.deleteExpressionTree(startNode);
            }

            self.matchToken(TokenType.TO);

            /** calculate the value of end point to draw */
            endNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                end = Semantic.getExprssionValue(endNode);
                Semantic.deleteExpressionTree(endNode);
            }

            stepNode = expression().call(this);
            self.matchToken(TokenType.STEP);

            if (!self.PARSE_DEBUG) {
                step = Semantic.getExprssionValue(stepNode);
                Semantic.deleteExpressionTree(stepNode);
            }

            self.matchToken(TokenType.DRAW);
            self.matchToken(TokenType.L_BRACKET);

            x = expression.call(this);

            self.matchToken(TokenType.COMMA);

            y = expression.call(this);

            self.matchToken(TokenType.R_BRACKET);

            if (!self.PARSER_DEBUG) {
                Semantic.DrawLoop(start, end, step, x, y);
                Semantic.DelExprTree(x);
                Semantic.DelExprTree(y);
            }

            self.back('Loop Statement');
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
            break;
        }

        if (self.scanner.lineNumber !== self.errorLineNumber) {
            statement.call(this);
        }

        self.matchToken(TokenType.SEMICOLON)
    }

    self.back('Program');
};

export default Parser;
