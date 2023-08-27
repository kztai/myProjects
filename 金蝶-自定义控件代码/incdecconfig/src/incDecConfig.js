(function () {
    class KdWtcIncDecConfig {
        constructor(para) {
            this.uniqueId = para.uniqueId;
            this.model = para.model;
            this.themeNum = para.themeNum;
            this.KDApi = para.KDApi;
            this.rootDom = para.model.dom;
            this.args = para.args;

            this.arrCondition = [];  // 当前剩余的条件

            // 多语言文本
            // this.langText_log = para.KDApi.getLangMsg(this.model, 'log');

            this.dom_body = document.querySelector('body');
            this.$dom_btns = $('.wtc_incDecConfig-btns', this.rootDom);
            this.$dom_btnAnd = $('.wtc_incDecConfig-btn-and', this.rootDom);
            this.$dom_btnOr = $('.wtc_incDecConfig-btn-or', this.rootDom);
            this.$dom_btnLeft = $('.wtc_incDecConfig-btn-left', this.rootDom);
            this.$dom_btnRight = $('.wtc_incDecConfig-btn-right', this.rootDom);
            this.$dom_input = $('.wtc_incDecConfig-input', this.rootDom);
            this.$dom_radioWrap = $('.wtc_incDecConfig-radio-wrap', this.rootDom);

            this.init();
        }

        init() {
            let $this = this;

            // 设置主题色：
            this.rootDom.style.setProperty('--themeColor', this.themeNum);

            let htmlStr = `
                    <label><input name="wtc_incDecConfig-radio-${this.uniqueId}" type="radio" value="and">满足所有条件（并且）</label>
                    <label><input name="wtc_incDecConfig-radio-${this.uniqueId}" type="radio" value="or">满足任意条件（或者）</label>
                    <label><input name="wtc_incDecConfig-radio-${this.uniqueId}" type="radio" value="custom">自定义逻辑</label>
                `;

            this.$dom_radioWrap.html(htmlStr);

            if (this.args.conditionType === 2) {  // 用户自定义
                $('input[value=custom]', this.$dom_radioWrap).prop('checked', true);
                $this.$dom_input.css('display', 'block');
            } else if (this.args.conditionType === 1) {  // 或者
                $('input[value=or]', this.$dom_radioWrap).prop('checked', true);
            } else {  // 并且
                $('input[value=and]', this.$dom_radioWrap).prop('checked', true);
            }

            this.refreshInput(this.args.data);  // 初始化文本框内容

            if (this.args.showType === 1) {  // 查看态
                $this.$dom_btns.css('display', 'none');
                $('input[type=radio]', this.$dom_radioWrap).prop('disabled', true);
                // 查看态的用户自定义的文本框不可编辑：
                if (this.args.conditionType === 2) {
                    $this.$dom_input.prop('contenteditable', 'false');
                }
            } else {  // 编辑态
                if (this.args.conditionType === 2) {  // 用户自定义
                    $this.$dom_btns.css('display', 'flex');
                }

                // 解析出条件语句中的条件：
                this.initArrCondition(this.args.data);

                this.$dom_radios = $('input[type=radio]', this.rootDom);

                this.$dom_radios.on('change', function () {
                    let value = $(this).val();
                    if (value === 'custom') {
                        $this.args.conditionType = 2;
                        $this.$dom_input.css('display', 'block');
                        $this.$dom_btns.css('display', 'flex');
                    } else {
                        value === 'and' ? $this.args.conditionType = 0 : $this.args.conditionType = 1;
                        $this.$dom_input.css('display', 'none');
                        $this.$dom_btns.css('display', 'none');
                        $this.changeLogicType(value);
                    }
                });

                this.$dom_btnAnd.click(function () {
                    $this.insert('and');
                });
                this.$dom_btnOr.click(function () {
                    $this.insert('or');
                });
                this.$dom_btnLeft.click(function () {
                    $this.insert('left');
                });
                this.$dom_btnRight.click(function () {
                    $this.insert('right');
                });

                // compositionstart、compositionend可以用来监听汉字的输入
                let flag = true;
                this.$dom_input.on('compositionstart', function () {
                    flag = false;
                });
                this.$dom_input.on('compositionend', function () {
                    flag = true;
                });
                this.$dom_input.on('input', function (e) {
                    setTimeout(function () {
                        if (flag) {
                            $this.legalInput(e.originalEvent)
                        }
                    }, 0)
                });
                // 几个特殊键的处理：
                this.$dom_input.on('keydown', function (e) {
                    if (e.keyCode === 32) {  // 空格键
                        $this.insertSpace();
                        return false;
                    }
                    if (e.keyCode === 13 || e.keyCode === 46 || e.keyCode === 8) {  // enter键、delete键、back键
                        flag = false;
                    }
                });
            }
        }

        /*
        * 将默认的空格键输入的内容替换成&nbsp;
        * */
        insertSpace() {
            let selectionObj = window.getSelection();
            let rangeObj = selectionObj.getRangeAt(0);
            rangeObj.deleteContents();
            let oSpace = document.createElement('span');
            oSpace.className = 'content-base';
            oSpace.innerHTML = '&nbsp;';
            rangeObj.insertNode(oSpace);
            rangeObj.setStartAfter(oSpace);
        }

        /*
        * 检查用户输入的内容。1.是否是逻辑（' 并且', ' 或者', ' （', ' ）'），是逻辑则需要变为蓝色；2.是否是条件，条件则变绿
        * */
        legalInput() {
            let selectionObj = window.getSelection();
            let rangeObj = selectionObj.getRangeAt(0);
            let container = rangeObj.commonAncestorContainer;

            let len = 3;  // 条件或者逻辑词的长度
            let isCondition = false; // 是否是条件
            // 判断是否匹配逻辑词的格式
            let index = container.textContent.search(/\s并且$|\s或者$/g);
            // todo 1019
            if (index === -1) {
                index = container.textContent.search(/\s（$|\s）$/g);
                len = 2;
            }
            // 判断是否匹配条件的格式
            if (index === -1) {
                index = container.textContent.search(/\sT\d+$/g);
                let arrCond = container.textContent.match(/\sT\d+$/g);
                len = arrCond ? arrCond[0].length : 0;
                isCondition = true;
            }
            if (index !== -1) {
                let newRange = document.createRange();
                newRange.setStart(container, index);
                newRange.setEnd(container, index + len);
                let documentFragment = newRange.extractContents();
                let oSpan = document.createElement('span');
                oSpan.className = isCondition ? 'content-green' : 'content-blue';
                oSpan.appendChild(documentFragment);
                rangeObj.insertNode(oSpan);
                rangeObj.setStartAfter(oSpan);
            }
        }

        /*
        * 切换单选框时触发，需要修改文本框中的内容
        * type: [string] and/or
        * */
        changeLogicType(type) {
            let arrTemp = [];
            for (let i = 0; i < this.arrCondition.length; i++) {
                type === 'and' ? arrTemp.push(this.arrCondition[i], '并且') : arrTemp.push(this.arrCondition[i], '或者');
            }
            arrTemp.pop();  // 最后多了一个逻辑词，需剔除

            this.refreshInput(arrTemp.join(' '));
        }

        /*
        * 将字符串形式的逻辑条件转为html形式，并插入到文本框中
        * data: [string]
        * */
        refreshInput(data) {
            if (data === '') {
                this.$dom_input.empty();  // 先清空文本框
                return;
            }

            let strHtml = '';
            this.$dom_input.empty();  // 先清空文本框
            let arrTemp = data.split(/\s|&nbsp;/g);

            for (let i = 0; i < arrTemp.length; i++) {
                let item = arrTemp[i].trim();

                if (item === '并且' || item === '或者' || item === '（' || item === '）') {
                    strHtml += `<span class="content-blue">&nbsp;${arrTemp[i]}</span>`;
                } else if (item.match(/^T\d+$/g)) {
                    strHtml += `<span class="content-green">&nbsp;${arrTemp[i]}</span>`;
                } else {
                    strHtml += `<span class="content-base">&nbsp;${arrTemp[i]}</span>`;
                }
            }

            this.$dom_input.html(strHtml);
        }

        /*
        * 用户点击逻辑按钮触发，将对应逻辑插入到文本框中
        * */
        insert(type, content) {
            this.$dom_input[0].focus();
            let selectionObj = window.getSelection();
            let rangeObj = selectionObj.getRangeAt(0);
            let oSpan = document.createElement('span');

            switch (type) {
                case 'and':
                    oSpan.className = 'content-blue';
                    oSpan.innerHTML = '&nbsp;并且';
                    break;
                case 'or':
                    oSpan.className = 'content-blue';
                    oSpan.innerHTML = '&nbsp;或者';
                    break;
                case 'left':
                    oSpan.className = 'content-blue';
                    oSpan.innerHTML = '&nbsp;（';
                    break;
                case 'right':
                    oSpan.className = 'content-blue';
                    oSpan.innerHTML = '&nbsp;）';
                    break;
                case 'condition':
                    oSpan.className = 'content-green';
                    oSpan.innerHTML = content;
                    break;
                default:
                    oSpan.className = 'content-base';
                    oSpan.innerHTML = '&nbsp;';
                    break;
            }

            if (!rangeObj.collapsed) rangeObj.deleteContents();

            rangeObj.insertNode(oSpan);
            rangeObj.setStartAfter(oSpan);

            this.insertSpace();
        }

        /*
        * 后端触发，新增或者删除条件后触发。
        * 更新文本框中的内容
        * arrCondition：[array] 新增或者删除的条件（目前新增只有一个，删除可以多个）
        * */
        conditionChange(arrCondition) {
            if (arrCondition.length === 0) return;

            // 删除（替换）文本框中的错误条件：
            let arrTemp = this.formatCondition();

            if (this.arrCondition.includes(arrCondition[0])) {  // 删除
                for (let i = 0; i < arrCondition.length; i++) {   // 同步本地的条件队列
                    this.arrCondition.pop();
                }

                // 删除条件：
                for (let i = 0; i < arrCondition.length; i++) {
                    let index = arrTemp.indexOf(arrCondition[i]);
                    if (index !== -1) {
                        if (index === 0 || index === arrTemp.length - 1) {  // 该条件是首位或者末尾
                            // 判断当前条件是否是第一个：
                            if (index === 0) {
                                arrTemp.splice(index, 2)
                            } else {
                                arrTemp.splice(index - 1, 2)
                            }
                        } else {
                            // 判断条件的前后是否是括号：
                            if (arrTemp[index - 1] === '（' && arrTemp[index + 1] !== '）') {
                                arrTemp.splice(index, 2)
                            } else if (arrTemp[index - 1] !== '（' && arrTemp[index + 1] === '）') {
                                arrTemp.splice(index - 1, 2)
                            } else if (arrTemp[index - 1] === '（' && arrTemp[index + 1] === '）') {
                                if (index === 1) {  // （T01）并 T02
                                    arrTemp.splice(index - 1, 4)
                                } else {  // T02 并（T01）
                                    arrTemp.splice(index - 2, 4)
                                }
                            } else {  // 没括号
                                arrTemp.splice(index, 2)
                            }
                        }

                    }
                }

                // 将条件的序号调整：
                let index = 0;
                for (let i = 0; i < arrTemp.length; i++) {
                    if (arrTemp[i].match(/^T\d+$/g)) {
                        arrTemp[i] = this.arrCondition[index];
                        index++;
                    }
                }
            } else {  // 新增
                for (let i = 0; i < arrCondition.length; i++) {
                    this.arrCondition.push(arrCondition[i]);
                    // arrTemp.length === 0 ? arrTemp.push(arrCondition[i]) : arrTemp.push('并且', arrCondition[i]);
                    if (arrTemp.length === 0) {
                        arrTemp.push(arrCondition[i]);
                    } else {
                        // conditionType：0并且，1或者，2自定义
                        this.args.conditionType === 1 ? arrTemp.push('或者', arrCondition[i]) : arrTemp.push('并且', arrCondition[i]);
                    }
                }
            }


            this.refreshInput(arrTemp.join(' '));
        }

        /*
        * 将用户输入的乱七八糟的内容做整理，去掉逻辑错误的部分
        * return：[array] 整理后的内容
        * */
        formatCondition() {
            let strTemp = this.$dom_input.text();
            let arrTemp = strTemp.split(/\s+|&nbsp;/g);

            // 1.将英文括号替换为中文：
            this.bracketsChange(arrTemp);
            // 1.括号个数顺序必须匹配：
            this.bracketsFormat(arrTemp);
            // 2.将乱七八糟的词语替换掉：
            this.logicFormat(arrTemp);
            // 3.将前后连接不合法的词语删除掉：
            this.connectFormat(arrTemp);

            return arrTemp;
        }

        /*
        * 将英文括号替换为中文括号
        * */
        bracketsChange(arrTemp) {
            for (let i = 0; i < arrTemp.length; i++) {
                if (arrTemp[i] === '(') arrTemp[i] = '（';
                if (arrTemp[i] === ')') arrTemp[i] = '）';
            }
        }

        /*
        * 1.删除多余的括号; 2.括号是否合法
        * arrTemp: [array] 文本框内容标准化后的数组
        * */
        bracketsFormat(arrTemp) {
            let leftBracketsIndex = [];
            let rightBracketsIndex = [];
            for (let i = 0; i < arrTemp.length; i++) {
                if (arrTemp[i] === '（') {
                    // 括号是否合法
                    // todo 1019
                    if ((!arrTemp[i - 1] || arrTemp[i - 1] === '（' || arrTemp[i - 1] === '并且' || arrTemp[i - 1] === '或者') && (arrTemp[i + 1] && (arrTemp[i + 1] === '（' || arrTemp[i + 1].match(/^T\d+$/g)))) {
                        leftBracketsIndex.push(i);
                    } else {
                        arrTemp.splice(i, 1);
                        i--;
                    }
                    continue;
                }
                if (arrTemp[i] === '）') {
                    // 括号是否合法
                    if ((!arrTemp[i + 1] || arrTemp[i + 1] === '）' || arrTemp[i + 1] === '并且' || arrTemp[i + 1] === '或者') && (arrTemp[i - 1] && (arrTemp[i - 1] === '）' || arrTemp[i - 1].match(/^T\d+$/g)))) {
                        if (leftBracketsIndex.length > 0) {
                            leftBracketsIndex.pop()
                        } else {
                            rightBracketsIndex.push(i);
                        }
                    } else {
                        arrTemp.splice(i, 1);
                        i--;
                    }
                }
            }
            // 将需要删除的括号按从大到小的顺序排列：
            let arr = leftBracketsIndex.concat(rightBracketsIndex).sort((a, b) => b - a);
            // 删除多余的括号
            for (let i = 0; i < arr.length; i++) {
                arrTemp.splice(arr[i], 1);
            }
        }

        /*
        * 将不符合的条件替换为“并且”
        * arrTemp: [array] 文本框内容标准化后的数组
        * */
        logicFormat(arrTemp) {
            // var a = ["", "T02", "或者", "(", "T03", "并且", "T01", ")"];

            // 将不符合的条件替换为并且
            for (let i = 0; i < arrTemp.length; i++) {
                if (arrTemp[i] && (arrTemp[i] !== '（' && arrTemp[i] !== '）' && arrTemp[i] !== '并且' && arrTemp[i] !== '或者' && !arrTemp[i].match(/^T\d+$/g))) {
                    arrTemp[i] = '并且'
                }
            }
        }

        /*
        * 将不符合的条件替换为并且
        * arrTemp: [array] 文本框内容标准化后的数组
        * */
        connectFormat(arrTemp) {
            for (let i = 0; i < arrTemp.length; i++) {
                // 1.以条件开头
                // 2.条件后是逻辑，再是条件，再是逻辑...
                // 3.特殊情况：左括号在条件左边，右括号在条件右边
                let item0 = arrTemp[i].trim();
                let item1 = arrTemp[i + 1] && arrTemp[i + 1].trim();

                if (item0 === '（') {
                    if (!item1 || (!item1.match(/^T\d+$/g) && item1 !== '）')) {
                        arrTemp.splice(i, 1);
                        i--;
                    }
                } else if (item0 === '）') {
                    if (item1 && item1 !== '并且' && item1 !== '或者' && item1 !== '（') {
                        arrTemp.splice(i, 1);
                        i--;
                    }
                } else if (item0 === '并且' || item0 === '或者') {
                    if (!item1 || (!item1.match(/^T\d+$/g) && item1 !== '（')) {
                        arrTemp.splice(i, 1);
                        i--;
                    }
                } else if (item0.match(/^T\d+$/g)) {
                    if (item1 && item1 !== '并且' && item1 !== '或者' && item1 !== '）') {
                        arrTemp.splice(i, 1);
                        i--;
                    }
                } else {
                    arrTemp.splice(i, 1);
                    i--;
                }
            }
            // 2.必须以条件或者（开头：
            if (arrTemp[0] && arrTemp[0] !== '（' && !arrTemp[0].match(/^T\d+$/g)) arrTemp.splice(0, 1);
        }

        placeCaretAtEnd(el) { //传入光标要去的jq节点对象 todo 暂时弃用
            el.focus();
            if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }

        getData(type) {
            let strTemp = this.$dom_input.text();
            let arrTemp = strTemp.split(/\s+|&nbsp;/g);

            this.model.invoke('getData', {
                data: arrTemp.join(' '),
                conditionType: this.args.conditionType,
                opType: type
            });
        }

        /*
        * 筛选出条件语句中的条件
        * sCond：[string] 条件语句
        * */
        initArrCondition(sCond) {
            let arrTemp = sCond.split(' ');
            for (let i = 0; i < arrTemp.length; i++) {
                if (arrTemp[i].match(/^T\d+$/g)) {
                    this.arrCondition.push(arrTemp[i])
                }
            }
            this.arrCondition.sort();
        }
    }

    window.KdWtcIncDecConfig = KdWtcIncDecConfig;
})();