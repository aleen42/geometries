/******************************************************************
 *                                                                _
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
 *  - Document: util.js
 *  - Author: aleen42
 *  - Description: A util file for making some external functions
                   for helping
 *  - Create Time: May, 30th, 2017
 *  - Update Time: May, 30th, 2017
 *
 *****************************************************************/

function Util() {}

Util.enumerate = arr => {
    var returnObj = {};

    arr.forEach((item, index) => {
        returnObj[item] = index;
    });

    return returnObj;
}

export default Util;
