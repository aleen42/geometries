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
 *  - Update Time: Jun, 8th, 2017
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
                            let curToken = this.token;

                            this.enter('atom');

                            switch (this.token.type) {
                            case Scanner.tokenType.CONST_ID:
                                this.matchToken(Scanner.tokenType.CONST_ID);
                                addressNode = this.makeExprNode(Scanner.tokenType.CONST_ID, curToken.value, null, null);
                                break;
                            case Scanner.tokenType.T:
                                this.matchToken(Scanner.tokenType.T);
                                addressNode = this.makeExprNode(Scanner.tokenType.T, null, null, null);
                                break;
                            case Scanner.tokenType.FUNC:
                                this.matchToken(Scanner.tokenType.FUNC);
                                this.matchToken(Scanner.tokenType.L_BRACKET);
                                tempNode = expression.call(this);
                                addressNode = this.makeExprNode(Scanner.tokenType.FUNC, null, tempNode, this.token.callback);
                                this.matchToken(Scanner.tokenType.R_BRACKET);
                                break;
                            case Scanner.tokenType.L_BRACKET:
                                this.matchToken(Scanner.tokenType.L_BRACKET);
                                addressNode = expression.call(this);
                                this.matchToken(Scanner.tokenType.R_BRACKET);
                                break;
                            default:
                                this.syntaxError('Unexpected Token');
                                return null;
                            }

                            this.back('atom');
                            return addressNode;
                        }

                        let leftNode;
                        let rightNode;

                        this.enter('Component');

                        leftNode = atom.call(this);
                        if (this.token.type === Scanner.tokenType.POWER) {
                            this.matchToken(Scanner.tokenType.POWER);
                            rightNode = component.call(this);
                            leftNode = this.makeExprNode(Scanner.tokenType.POWER, leftNode, rightNode, null);
                        }

                        this.back('Component');
                        return leftNode;
                    }

                    let leftNode;
                    let rightNode;

                    this.enter('Factor');

                    if (this.token.type === Scanner.tokenType.PLUS) {
                        this.matchToken(Scanner.tokenType.PLUS);
                        rightNode = factor.call(this);
                    } else if (this.token.type === Scanner.tokenType.MINUS) {
                        this.matchToken(Scanner.tokenType.MINUS);
                        rightNode = factor.call(this);

                        const transparent = new Content();
                        transparent.caseConst = 0.0;

                        leftNode = new ExprNode(Scanner.tokenType.CONST_ID, transparent);

                        rightNode = this.makeExprNode(Scanner.tokenType.MINUS, leftNode, rightNode, null);
                    } else {
                        rightNode = component.call(this);
                    }

                    this.back('Factor');
                    return rightNode;
                }

                this.enter('Term');

                let leftNode = factor.call(this);

                this.back('Term');
                return leftNode;
            }

            this.enter('Expression');

            let leftNode = term.call(this);

            this.back('Expression');
            return leftNode;
        }

        this.enter('Statement');

        switch(this.token.type) {
        case Scanner.tokenType.ORIGIN:
            /** Origin Statement */
            let tempNode = new ExprNode();

            this.enter('Origin Statement');

            this.matchToken(Scanner.tokenType.ORIGIN);
            this.matchToken(Scanner.tokenType.IS);
            this.matchToken(Scanner.tokenType.L_BRACKET);

            tempNode = expression.call(this);

            if (!this.PARSE_DEBUG) {
                this.originX = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            this.matchToken(Scanner.tokenType.R_BRACKET);

            this.back('Origin Statement');

            break;
        case Scanner.tokenType.SCALE:
            /** Scale Statement */
            let tempNode = new ExprNode();

            this.enter('Scale Statement');

            this.matchToken(Scanner.tokenType.ORIGIN);
            this.matchToken(Scanner.tokenType.IS);
            this.matchToken(Scanner.tokenType.L_BRACKET);

            tempNode = expression.call(this);

            if (!this.PARSE_DEBUG) {
                /** get the ratio factor of X axis */
                this.scaleX = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            this.matchToken(Scanner.tokenType.COMMA);

            tempNode = expression.call(this);

            if (!this.PARSE_DEBUG) {
                /** get the ratio factor of Y axis */
                this.scaleY = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            this.matchToken(Scanner.tokenType.R_BRACKET);

            this.back('Scale Statement');
            break;
        case Scanner.tokenType.ROT:
            /** Rotate Statement */
            let tempNode = new ExprNode();

            this.enter('Rotate Statement');

            this.matchToken(Scanner.tokenType.ROT);
            this.matchToken(Scanner.tokenType.IS);

            tempNode = expression.call(this);

            if (!this.PARSE_DEBUG) {
                /** get the rotate angle */
                this.rotateAngle = Semantic.getExprssionValue(tempNode);
                Semantic.deleteExpressionTree(tempNode);
            }

            this.back('Rotate Statement');
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

            this.enter('Loop Statement');

            this.matchToken(Scanner.tokenType.FOR);
            this.match('FOR');
            this.matchToken(Scanner.tokenType.T);
            this.match('T');
            this.matchToken(Scanner.tokenType.FROM);
            this.match('FROM');

            /** calculate the value of start point to draw */
            startNode = expression.call(this);

            if (!this.PARSE_DEBUG) {
                start = Semantic.getExprssionValue(startNode);
                Semantic.deleteExpressionTree(startNode);
            }

            this.matchToken(Scanner.tokenType.TO);
            this.match('TO');

            /** calculate the value of end point to draw */
            endNode = expression.call(this);

            if (!this.PARSE_DEBUG) {
                end = Semantic.getExprssionValue(endNode);
                Semantic.deleteExpressionTree(endNode);
            }

            this.matchToken(Scanner.tokenType.STEP);
            stepNode = expression().call(this);

            if (!this.PARSE_DEBUG) {
                step = Semantic.getExprssionValue(stepNode);
                Semantic.deleteExpressionTree(stepNode);
            }

            this.matchToken(Scanner.tokenType.DRAW);
            this.match('DRAW');

            this.matchToken(Scanner.tokenType.L_BRACKET);
            this.match('(');

            x = expression.call(this);

            this.matchToken(Scanner.tokenType.COMMA);
            this.match(',');

            y = expression.call(this);

            this.matchToken(Scanner.tokenType.R_BRACKET);
            this.match(')');

            if (!this.PARSER_DEBUG) {
                Semantic.DrawLoop(start, end, step, x, y);
                Semantic.DelExprTree(x);
                Semantic.DelExprTree(y);
            }

            this.back('Loop Statement');
            break;
        default:
            this.syntaxError('Unexpected Token');
            this.errorLineNumber = this.scanner.lineNumber;
            break;
        }

        this.back('Statement');
    }

    this.enter('Program');

    for (;;) {
        if (this.token.type === Scanner.tokenType.NONTOKEN) {
            break;
        }

        if (this.scanner.lineNumber !== this.errorLineNumber) {
            statement.call(this);
        }

        this.matchToken(Scanner.tokenType.SEMICOLON)
    }

    this.back('Program');
};

export default Parser;
