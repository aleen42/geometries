/*
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
 *  - Document: token.js
 *  - Author: aleen42
 *  - Description: A data structure for notations
 *  - Create Time: May, 30th, 2017
 *  - Update Time: May, 30th, 2017
 *
 */

export default function Token(type, lexeme, value, callback) {
    this.type = type;
    this.lexeme = lexeme;
    this.value = value;
    this.callback = callback;
};
