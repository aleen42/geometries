/******************************************************************
 *                                                               _
 * 	 _____  _                           ____  _                 |_|
 *	|  _  |/ \   ____  ____ __ ___     / ___\/ \   __   _  ____  _
 *	| |_| || |  / __ \/ __ \\ '_  \ _ / /    | |___\ \ | |/ __ \| |
 *	|  _  || |__. ___/. ___/| | | ||_|\ \___ |  _  | |_| |. ___/| |
 *	|_/ \_|\___/\____|\____||_| |_|    \____/|_| |_|_____|\____||_|
 *
 *	===============================================================
 *		   More than a coder, More than a designer
 *	===============================================================
 *
 *	- Document: alias.config.js
 *	- Author: aleen42
 *	- Description: A configuration file for rename some keyword
                   for importing
 *	- Create Time: May, 30th, 2017
 *	- Update Time: May, 30th, 2017
 *
 *****************************************************************/

const path = require('path');
const modulesPath = path.resolve('./src/modules');
const componentsPath = path.resolve('./src/components');

module.exports = {
    modules: modulesPath,
    components: componentsPath,

    /** any alias for modules or components, or even anything else */
    util: path.resolve(modulesPath + '/util'),

    compilers: 'modules/draw_compilers'
};
