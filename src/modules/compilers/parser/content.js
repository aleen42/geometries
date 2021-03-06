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
 *  - Document: content.js
 *  - Author: aleen42
 *  - Description: A data structure
 *  - Create Time: May 31st, 2017
 *  - Update Time: Feb 13rd, 2019
 *
 */

/* global module */
module.exports = function Content() {
    /** binary operators */
    this.caseOperator = {
        leftNode: null,
        rightNode: null,
    };
    /** functions */
    this.caseFunc = {
        mathFunc: null,
        childNode: null,
    };
    /** const */
    this.caseConst = null;
    /** parameter pointer */
    this.caseParamPtr = null;
};
