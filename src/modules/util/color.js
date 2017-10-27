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
 *  - Document: color.js
 *  - Author: aleen42
 *  - Description: a util tool for setting color of console
 *  - Create Time: Oct, 26th, 2017
 *  - Update Time: Oct, 26th, 2017
 *
 */

import Util from './index';

var _colorMap = Util.enumerate(['BLACK', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'MAGENTA', 'CYAN', 'WHITE']);

export default {
    nestedColor: function (type, string) {
        return `\x1b[0m${string}\x1b[3${_colorMap[type]}m`;
    },
    wrapColor: function (type, string) {
        return `\x1b[3${_colorMap[type]}m${string}\x1b[0m`;
    }
};
