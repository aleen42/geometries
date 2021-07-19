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
 *  - Document: semantic.js
 *  - Author: aleen42
 *  - Description: A semantic module for specifying the meaning notations
 *  - Create Time: Oct 12nd, 2017
 *  - Update Time: Jul 19th, 2021
 *
 */

/* global require, module */
const {TokenType} = require('../common/tokenType');

function Semantic(parser) {
    this.parser = parser;
}

Semantic.prototype.errMsg = () => null; /** catch and ignore */

Semantic.prototype.getExpressionValue = function (root) {
    if (root === null) {
        return 0;
    }

    const {caseOperator, caseFunc, caseConst} = root.content;
    let {leftNode, rightNode} = caseOperator;
    return ({
        [TokenType.PLUS]: () => this.getExpressionValue(leftNode) + this.getExpressionValue(rightNode),
        [TokenType.MINUS]: () => this.getExpressionValue(leftNode) - this.getExpressionValue(rightNode),
        [TokenType.MUL]: () => this.getExpressionValue(leftNode) * this.getExpressionValue(rightNode),
        [TokenType.DIV]: () => this.getExpressionValue(leftNode) / this.getExpressionValue(rightNode),
        [TokenType.MOD]: () => this.getExpressionValue(leftNode) % this.getExpressionValue(rightNode),
        [TokenType.POWER]: () => Math.pow(this.getExpressionValue(leftNode), this.getExpressionValue(rightNode)),
        [TokenType.INCREMENT]: () => leftNode ? leftNode++ : ++rightNode,
        [TokenType.DECREMENT]: () => leftNode ? leftNode-- : --rightNode,
        [TokenType.FUNC]: () => caseFunc.mathFunc(this.getExpressionValue(caseFunc.childNode)),
        [TokenType.CONST_ID]: () => caseConst,
        [TokenType.VAR]: () => this.parser.variables.filter(item => item === root)[0].content.caseParamPtr.parameter,
    }[root.tokenType] || (() => 0))();
};

/** calculate the coordinate according to original one and changes on it */
Semantic.prototype.calculateCoordinate = function (horizontalExpression, verticalExpression) {
    let horizontalCoordinate = this.getExpressionValue(horizontalExpression);
    let verticalCoordinate = this.getExpressionValue(verticalExpression);

    const {scaleX, scaleY, rotateAngle, originX, originY} = this.parser;

    /** scale */
    horizontalCoordinate *= scaleX;
    verticalCoordinate *= scaleY;

    /** rotate */
    const temp = horizontalCoordinate * Math.cos(rotateAngle) + verticalCoordinate * Math.sin(rotateAngle);
    verticalCoordinate = verticalCoordinate * Math.cos(rotateAngle) - horizontalCoordinate * Math.sin(rotateAngle);
    horizontalCoordinate = temp;

    /** move */
    horizontalCoordinate += originX;
    verticalCoordinate += originY;

    return {
        x: horizontalCoordinate,
        y: verticalCoordinate,
    };
};

/** loop for drawing */
Semantic.prototype.draw = function (horizontalPtr, verticalPtr) {
    const {x, y} = this.calculateCoordinate(horizontalPtr, verticalPtr);
    this.parser.drawCallback(x, y);
};

/** remove a syntax tree */
Semantic.prototype.deleteExpressionTree = function (root) {
    if (root === null) {
        return;
    }

    const content = root.content;
    const tokenType = root.tokenType;
    if ([
        TokenType.PLUS, TokenType.MINUS, TokenType.MUL, TokenType.DIV, TokenType.POWER, TokenType.MOD,
    ].includes(tokenType)) {
        const {leftNode, rightNode} = content.caseOperator;
        this.deleteExpressionTree(leftNode);
        this.deleteExpressionTree(rightNode);
    } else if (tokenType === TokenType.FUNC) {
        this.deleteExpressionTree(content.caseFunc.childNode);
    }

    /** delete the root node */
    root = null;
};

module.exports = Semantic;
