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
 *  - Update Time: Nov, 2nd, 2017
 *
 */

import Util from 'util/index';

const tokenTypeName = [
    'RESERVED',
    'ORIGIN', 'SCALE', 'ROT', 'IS', /** reserved keyword */
    'TO', 'STEP', 'DRAW', 'FOR', 'FROM', /** reserved keyword */
    'VAR', /** variables */
    'SEMICOLON', 'L_BRACKET', 'R_BRACKET', 'COMMA', /** separators */
    'PLUS', 'MINUS', 'MUL', 'DIV', 'POWER', /** operators */
    'FUNC', /** function (called) */
    'CONST_ID', /** constant */
    'NONTOKEN', /** empty notation (the end of a program) */
    'ERRTOKEN', /** error notation (invalid input) */
    'INCREMENT', /** ++ operator */
    'DECREMENT', /** -- operator */
    'MOD' /** % operator */
];

/** @namespace TokenType.RESERVED      0 */
/** @namespace TokenType.ORIGIN        1 */
/** @namespace TokenType.SCALE         2 */
/** @namespace TokenType.ROT           3 */
/** @namespace TokenType.IS            4 */
/** @namespace TokenType.TO            5 */
/** @namespace TokenType.STEP          6 */
/** @namespace TokenType.DRAW          7 */
/** @namespace TokenType.FOR           8 */
/** @namespace TokenType.FROM          9 */
/** @namespace TokenType.VAR          10 */
/** @namespace TokenType.SEMICOLON    11 */
/** @namespace TokenType.L_BRACKET    12 */
/** @namespace TokenType.R_BRACKET    13 */
/** @namespace TokenType.COMMA        14 */
/** @namespace TokenType.PLUS         15 */
/** @namespace TokenType.MINUS        16 */
/** @namespace TokenType.MUL          17 */
/** @namespace TokenType.DIV          18 */
/** @namespace TokenType.POWER        19 */
/** @namespace TokenType.FUNC         20 */
/** @namespace TokenType.CONST_ID     21 */
/** @namespace TokenType.NONTOKEN     22 */
/** @namespace TokenType.ERRTOKEN     23 */
/** @namespace TokenType.INCREMENT    24 */
/** @namespace TokenType.DECREMENT    25 */
/** @namespace TokenType.MOD          26 */
const TokenType = Util.enumerate(tokenTypeName);
export { TokenType, tokenTypeName };
