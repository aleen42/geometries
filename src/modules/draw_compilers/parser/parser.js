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
 *  - Update Time: Oct, 12nd, 2017
 *
 */

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
    this.scanner.close();
    this.back('Parser');
}

Parser.prototype.enter = function (str) {
    if (this.PARSE_DEBUG) {
        let info = '';
        this.indent++;

        for (let i = 1; i <= this.indent; i++) {
            info += '\t';
        }

        console.log(`${info} Enter in ${str}`);
    }
};

Parser.prototype.back = function (str) {
    if (this.PARSE_DEBUG) {
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
    case Scanner.tokenType.PLUS:
        console.log(`${info} +`);
        break;
    case Scanner.tokenType.MINUS:
        console.log(`${info} -`);
        break;
    case Scanner.tokenType.DIV:
        console.log(`${info} /`);
        break;
    case Scanner.tokenType.POWER:
        console.log(`${info} **`);
        break;
    case Scanner.tokenType.FUNC:
        console.log(`${info} ${root.content.caseFunc.mathFunc.name}`);
        break;
    case Scanner.tokenType.CONST_ID:
        console.log(`${info} ${root.content.caseConst}`);
        break;
    case Scanner.tokenType.T:
        console.log(`${info} T`);
        break;
    default:
        console.log(`${info} Error Tree Node!`);
        return;
    }

    if (root.tokenType === Scanner.tokenType.CONST_ID
        || root.tokenType == Scanner.tokenType.T) {
        return;
    }

    if (root.tokenType === Scanner.tokenType.FUNC) {
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

    if (this.token.type === Scanner.tokenType.ERRTOKEN) {
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

    switch(tokenType) {
    case Scanner.tokenType.CONST_ID:
        node.content.caseConst = parseFloat(leftNode);
        break;
    case Scanner.tokenType.T:
        node.content.caseParamPtr = this.parameter;
        break;
    case Scanner.tokenType.FUNC:
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
                            case Scanner.tokenType.CONST_ID:
                                self.matchToken(Scanner.tokenType.CONST_ID);
                                addressNode = self.makeExprNode(Scanner.tokenType.CONST_ID, curToken.value, null, null);
                                break;
                            case Scanner.tokenType.T:
                                self.matchToken(Scanner.tokenType.T);
                                addressNode = self.makeExprNode(Scanner.tokenType.T, null, null, null);
                                break;
                            case Scanner.tokenType.FUNC:
                                self.matchToken(Scanner.tokenType.FUNC);
                                self.matchToken(Scanner.tokenType.L_BRACKET);
                                tempNode = expression.call(this);
                                addressNode = self.makeExprNode(Scanner.tokenType.FUNC, null, tempNode, self.token.callback);
                                self.matchToken(Scanner.tokenType.R_BRACKET);
                                break;
                            case Scanner.tokenType.L_BRACKET:
                                self.matchToken(Scanner.tokenType.L_BRACKET);
                                addressNode = expression.call(this);
                                self.matchToken(Scanner.tokenType.R_BRACKET);
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

                        leftNode = atom.call(this);
                        if (self.token.type === Scanner.tokenType.POWER) {
                            self.matchToken(Scanner.tokenType.POWER);
                            rightNode = component.call(this);
                            leftNode = self.makeExprNode(Scanner.tokenType.POWER, leftNode, rightNode, null);
                        }

                        self.back('Component');
                        return leftNode;
                    }

                    let leftNode;
                    let rightNode;

                    self.enter('Factor');

                    if (self.token.type === Scanner.tokenType.PLUS) {
                        self.matchToken(Scanner.tokenType.PLUS);
                        rightNode = factor.call(this);
                    } else if (self.token.type === Scanner.tokenType.MINUS) {
                        self.matchToken(Scanner.tokenType.MINUS);
                        rightNode = factor.call(this);

                        const transparent = new Content();
                        transparent.caseConst = 0.0;

                        leftNode = new ExprNode(Scanner.tokenType.CONST_ID, transparent);

                        rightNode = self.makeExprNode(Scanner.tokenType.MINUS, leftNode, rightNode, null);
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

        switch(self.token.type) {
        case Scanner.tokenType.ORIGIN:
            /** Origin Statement */
            self.enter('Origin Statement');

            self.matchToken(Scanner.tokenType.ORIGIN);
            self.matchToken(Scanner.tokenType.IS);
            self.matchToken(Scanner.tokenType.L_BRACKET);

            tempNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                self.originX = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(Scanner.tokenType.R_BRACKET);

            self.back('Origin Statement');

            break;
        case Scanner.tokenType.SCALE:
            /** Scale Statement */
            self.enter('Scale Statement');

            self.matchToken(Scanner.tokenType.ORIGIN);
            self.matchToken(Scanner.tokenType.IS);
            self.matchToken(Scanner.tokenType.L_BRACKET);

            tempNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                /** get the ratio factor of X axis */
                self.scaleX = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(Scanner.tokenType.COMMA);

            tempNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                /** get the ratio factor of Y axis */
                self.scaleY = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            self.matchToken(Scanner.tokenType.R_BRACKET);

            self.back('Scale Statement');
            break;
        case Scanner.tokenType.ROT:
            /** Rotate Statement */
            self.enter('Rotate Statement');

            self.matchToken(Scanner.tokenType.ROT);
            self.matchToken(Scanner.tokenType.IS);

            tempNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                /** get the rotate angle */
                self.rotateAngle = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            self.back('Rotate Statement');
            break;
        case Scanner.tokenType.FOR:
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

            self.matchToken(Scanner.tokenType.FOR);
            self.match('FOR');
            self.matchToken(Scanner.tokenType.T);
            self.match('T');
            self.matchToken(Scanner.tokenType.FROM);
            self.match('FROM');

            /** calculate the value of start point to draw */
            startNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                start = Semantic.getExprssionValue(startNode);
                Semantic.deleteExpressionTree(startNode);
            }

            self.matchToken(Scanner.tokenType.TO);
            self.match('TO');

            /** calculate the value of end point to draw */
            endNode = expression.call(this);

            if (!self.PARSE_DEBUG) {
                end = Semantic.getExprssionValue(endNode);
                Semantic.deleteExpressionTree(endNode);
            }

            self.matchToken(Scanner.tokenType.STEP);
            stepNode = expression().call(this);

            if (!self.PARSE_DEBUG) {
                step = Semantic.getExprssionValue(stepNode);
                Semantic.deleteExpressionTree(stepNode);
            }

            self.matchToken(Scanner.tokenType.DRAW);
            self.match('DRAW');

            self.matchToken(Scanner.tokenType.L_BRACKET);
            self.match('(');

            x = expression.call(this);

            self.matchToken(Scanner.tokenType.COMMA);
            self.match(',');

            y = expression.call(this);

            self.matchToken(Scanner.tokenType.R_BRACKET);
            self.match(')');

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
        if (self.token.type === Scanner.tokenType.NONTOKEN) {
            break;
        }

        if (self.scanner.lineNumber !== self.errorLineNumber) {
            statement.call(this);
        }

        self.matchToken(Scanner.tokenType.SEMICOLON)
    }

    self.back('Program');
};

export default Parser;
