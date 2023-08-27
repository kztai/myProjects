/*
 * @Author: your name
 * @Date: 2022-01-24 19:39:56
 * @LastEditTime: 2022-01-24 19:41:59
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \learn\在金蝶做的项目\webpackItems\packages\roster\index.js
 */
(function (KDApi, $) {
    function Roster(model) {
        this._setModel(model)
    }

    Roster.prototype = {
        _setModel: function (model) {
            this.model = model
        },
        init: function (props) {
            this.testData = {};
            props.data.args = this.testData;

            this.uniqueId = new Date().getTime();
            this.themeNum = props.themeNum;
            this.initFunc(this.model, props);
        },
        update: function (props) {
            if (props.data && props.data.event === 'getShift') {
                this.roster.refreshMenuShiftList(props.data.args.shiftInfo, props.data.args.notDoRoster)
            }
            if (props.data && props.data.event === 'copy') {
                this.roster.copyShift(props.data.args)
            }
            if (props.data && props.data.event === 'paste') {
                this.roster.parseShift(props.data.args.notDoRoster)
            }
            if (props.data && props.data.event === 'deleteroster') {
                this.roster.delShift(props.data.args.notDoRoster)
            }
            if (props.data && props.data.event === 'save') {
                this.roster.saveRoster()
            }
            if (props.data && props.data.event === 'updatedata') {
                this.roster.refreshRoster(props.data.args)
            }
            if (props.data && props.data.event === 'changeShowType') {
                this.roster.showRoster(props.data.args.showType)
            }
            if (props.data && props.data.event === 'changeTab') {
                this.roster.changeTab(props.data.args)
            }
        },
        destoryed: function () {
            $(window).off('keydown.roster_keydown');// 防止事件被多次注册
        },

        initFunc: function (model, props) {
            let $this = this;
            // KDApi.loadFile可以通过路径加载js或css文件，并且在html文件头生成script或者link标签，第一个参数是路径，第二个参数是model，第三个参数是加载完成后执行的回调函数
            KDApi.loadFile(['./css/roster.css', './js/roster.js', './js/myTool.js'], model, function () {
                // 通过路径去获取html字符串，第一个参数是路径，第二个参数是model，第三个参数是HTML模板中变量的值
                KDApi.getTemplateStringByFilePath('./html/roster.art', model, {}).then(function (result) {
                    model.dom.innerHTML = result;
                    // 初始化
                    $this.initRoster(model, props);
                })
            })
        },

        initRoster: function (model, props) {
            var $this = this;

            var para = {
                model: model,
                data: props.data.args,
                KDApi: KDApi,
                themeNum: this.themeNum,
                uniqueId: this.uniqueId
            };

            this.roster = new KdWtcRoster(para);
        },
    };

    KDApi.register('wtcroster', Roster, { isMulLang: true })
})(window.KDApi, jQuery);