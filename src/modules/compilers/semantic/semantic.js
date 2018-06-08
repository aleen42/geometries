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
 *  - Create Time: Oct, 12nd, 2017
 *  - Update Time: Jun, 6th, 2018
 *
 */

/* global require, module */
const { TokenType } = require('../common/tokenType');

function Semantic(parser) {
    this.parser = parser;
}

Semantic.prototype.errMsg = function () {
    /** catch and ignore */
    return null;
};

Semantic.prototype.getExpressionValue = function (root) {
    if (root === null) {
        return 0;
    }

    const content = root.content;
    const caseOperator = content.caseOperator;
    switch (root.tokenType) {
    case TokenType.PLUS:
        return this.getExpressionValue(caseOperator.leftNode) + this.getExpressionValue(caseOperator.rightNode);
    case TokenType.MINUS:
        return this.getExpressionValue(caseOperator.leftNode) - this.getExpressionValue(caseOperator.rightNode);
    case TokenType.MUL:
        return this.getExpressionValue(caseOperator.leftNode) * this.getExpressionValue(caseOperator.rightNode);
    case TokenType.DIV:
        return this.getExpressionValue(caseOperator.leftNode) / this.getExpressionValue(caseOperator.rightNode);
    case TokenType.MOD:
        return this.getExpressionValue(caseOperator.leftNode) % this.getExpressionValue(caseOperator.rightNode);
    case TokenType.POWER:
        return Math.pow(this.getExpressionValue(caseOperator.leftNode), this.getExpressionValue(caseOperator.rightNode));
    case TokenType.INCREMENT:
        return caseOperator.leftNode ? caseOperator.leftNode++ : ++caseOperator.rightNode;
    case TokenType.DECREMENT:
        return caseOperator.leftNode ? caseOperator.leftNode-- : --caseOperator.rightNode;
    case TokenType.FUNC:
        const caseFunc = content.caseFunc;
        return caseFunc.mathFunc(this.getExpressionValue(caseFunc.childNode));
    case TokenType.CONST_ID:
        return content.caseConst;
    case TokenType.VAR:
        return this.parser.variables.filter(item => item === root)[0].content.caseParamPtr.parameter;
    default:
        return 0;
    }
};

/** calculate the coordinate according to original one and changes on it */
Semantic.prototype.calculateCoordinate = function (horizontalExpression, verticalExpression) {
    let horizontalCoordinate = this.getExpressionValue(horizontalExpression);
    let verticalCoordinate = this.getExpressionValue(verticalExpression);

    /** scale */
    horizontalCoordinate *= this.parser.scaleX;
    verticalCoordinate *= this.parser.scaleY;

    /** rotate */
    const rotateAngle = this.parser.rotateAngle;
    const temp = horizontalCoordinate * Math.cos(rotateAngle) + verticalCoordinate * Math.sin(rotateAngle);
    verticalCoordinate = verticalCoordinate * Math.cos(rotateAngle) - horizontalCoordinate * Math.sin(rotateAngle);
    horizontalCoordinate = temp;

    /** move */
    horizontalCoordinate += this.parser.originX;
    verticalCoordinate += this.parser.originY;

    return {
        x: horizontalCoordinate,
        y: verticalCoordinate
    };
};

/** loop for drawing */
Semantic.prototype.draw = function (horizontalPtr, verticalPtr) {
    var coordinate = this.calculateCoordinate(horizontalPtr, verticalPtr);
    this.parser.drawCallback(coordinate.x, coordinate.y);
};

/** remove a syntax tree */
Semantic.prototype.deleteExpressionTree = function (root) {
    if (root === null) {
        return;
    }

    const content = root.content;
    switch (root.tokenType) {
    case TokenType.PLUS:
    case TokenType.MINUS:
    case TokenType.MUL:
    case TokenType.DIV:
    case TokenType.POWER:
    case TokenType.MOD:
        const caseOperator = content.caseOperator;
        this.deleteExpressionTree(caseOperator.leftNode);
        this.deleteExpressionTree(caseOperator.rightNode);
        break;
    case TokenType.FUNC:
        this.deleteExpressionTree(content.caseFunc.childNode);
        break;
    default:
        break;
    }

    /** delete the root node */
    root = null;
};

module.exports = Semantic;
