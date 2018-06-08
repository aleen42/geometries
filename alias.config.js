/******************************************************************
 *                                                               _
 *     _____  _                           ____  _                 |_|
 *    |  _  |/ \   ____  ____ __ ___     / ___\/ \   __   _  ____  _
 *    | |_| || |  / __ \/ __ \\ '_  \ _ / /    | |___\ \ | |/ __ \| |
 *    |  _  || |__. ___/. ___/| | | ||_|\ \___ |  _  | |_| |. ___/| |
 *    |_/ \_|\___/\____|\____||_| |_|    \____/|_| |_|_____|\____||_|
 *
 *    ===============================================================
 *           More than a coder, More than a designer
 *    ===============================================================
 *
 *    - Document: alias.config.js
 *    - Author: aleen42
 *    - Description: A configuration file for rename some keyword
 for importing
 *    - Create Time: May, 30th, 2017
 *    - Update Time: Jun, 6th, 2018
 *
 *****************************************************************/

/* global require, module */
const path = require('path');
const modulesPath = path.resolve('./src/modules');
const componentsPath = path.resolve('./src/components');

module.exports = {
    modules: modulesPath,
    components: componentsPath,
};
