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
 *  - Document: tokenType.js
 *  - Author: aleen42
 *  - Description: the type of token
 *  - Create Time: Oct, 12nd, 2017
 *  - Update Time: Oct, 12nd, 2017
 *
 */

import Util from 'util/index';

const tokenTypeName = [
    'ORIGIN', 'SCALE', 'ROT', 'IS', /** reserved keyword */
    'TO', 'STEP', 'DRAW', 'FOR', 'FROM', /** reserved keyword */
    'T', /** parameter */
    'SEMICOLON', 'L_BRACKET', 'R_BRACKET', 'COMMA', /** separators */
    'PLUS', 'MINUS', 'MUL', 'DIV', 'POWER', /** operators */
    'FUNC', /** function (called) */
    'CONST_ID', /** constant */
    'NONTOKEN', /** empty notation (the end of a program) */
    'ERRTOKEN', /** error notation (invalid input) */
    'INCREMENT', /** ++ operator */
    'DECREMENT' /** -- operator */
];

/** @namespace TokenType.ORIGIN        0 */
/** @namespace TokenType.SCALE         1 */
/** @namespace TokenType.ROT           2 */
/** @namespace TokenType.IS            3 */
/** @namespace TokenType.TO            4 */
/** @namespace TokenType.STEP          5 */
/** @namespace TokenType.DRAW          6 */
/** @namespace TokenType.FOR           7 */
/** @namespace TokenType.FROM          8 */
/** @namespace TokenType.T             9 */
/** @namespace TokenType.SEMICOLON    10 */
/** @namespace TokenType.L_BRACKET    11 */
/** @namespace TokenType.R_BRACKET    12 */
/** @namespace TokenType.COMMA        13 */
/** @namespace TokenType.PLUS         14 */
/** @namespace TokenType.MINUS        15 */
/** @namespace TokenType.MUL          16 */
/** @namespace TokenType.DIV          17 */
/** @namespace TokenType.POWER        18 */
/** @namespace TokenType.FUNC         19 */
/** @namespace TokenType.CONST_ID     20 */
/** @namespace TokenType.NONTOKEN     21 */
/** @namespace TokenType.ERRTOKEN     22 */
/** @namespace TokenType.INCREMENT    23 */
/** @namespace TokenType.DECREMENT    24 */
const TokenType = Util.enumerate(tokenTypeName);
export { TokenType, tokenTypeName };
