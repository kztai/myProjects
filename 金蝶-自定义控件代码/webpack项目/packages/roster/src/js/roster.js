/*
 * @Author: your name
 * @Date: 2022-01-24 19:40:31
 * @LastEditTime: 2022-01-24 19:46:19
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \learn\在金蝶做的项目\webpackItems\packages\roster\js\roster.js
 */
(function() {

    function Roster(para) {
        this.para = para;
        console.log(para);
    }

    Roster.prototype.func = function(para) {
        console.log(para);
    };

    window.Roster = Roster;

})()