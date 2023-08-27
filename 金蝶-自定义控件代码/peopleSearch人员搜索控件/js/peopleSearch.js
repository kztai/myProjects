(function () {
    function KDWtcPeopleSearch(para) {
        this.inputFlag = true;
        this.uniqueId = new Date().getTime();
        this.model = para.model;
        this.rootDom = para.model.dom;
        this.total = para.total;
        this.value = para.value;
        this.options = para.options;

        this.dom_search = $('.wtc_peopleSearch-search', this.rootDom);
        this.dom_leftIcon = $('.wtc_peopleSearch-left-icon', this.rootDom);
        this.dom_rightIcon = $('.wtc_peopleSearch-right-icon', this.rootDom);
        this.dom_curNumber = $('.wtc_peopleSearch-cur-number', this.rootDom);
        this.dom_totalNumber = $('.wtc_peopleSearch-total-number', this.rootDom);

        this.init();
    }

    KDWtcPeopleSearch.prototype.init = function () {
        let $this = this;

        let str = `<input value="${this.value}" list="wtc_peopleSearch-browsers-${this.uniqueId}" name="wtc_peopleSearch-browser" class="wtc_peopleSearch-input">
            <datalist id="wtc_peopleSearch-browsers-${this.uniqueId}">`;

        for (let i = 0; i < this.options.length; i++) {
            str += `<option value="${this.options[i]}">`;
        }

        str += '</datalist>';

        this.dom_search.html(str);
        this.dom_totalNumber.html(this.total);

        this.dom_input = $('.wtc_peopleSearch-input', this.rootDom);
        this.dom_datalist = $(`#wtc_peopleSearch-browsers-${this.uniqueId}`, this.rootDom);

        this.dom_input.on('change',function(){  // 因为datalist没有事件，所以只能通过监听input的change事件，来发现选中哪个option
            let inputValue = $(this).val();
            for(let i = 0; i < $this.dom_datalist[0].options.length; i++){
                if($this.dom_datalist[0].options[i].value === inputValue){
                    console.log('optionClick事件：' + inputValue);
                    // $this.model.invoke('optionClick', inputValue);
                    break;
                }
            }
        });

        // input事件在输入中文拼音时（还没有确定汉字）就会触发，所以需要监听compositionstart和compositionend事件：
        this.dom_input.on('compositionstart',function(){  //文本框填入 “虚拟文本”（待确认文本）触发
            $this.inputFlag = false;
        });
        this.dom_input.on('compositionend',function(){  //填入实际内容后（已确认文本）触发
            $this.inputFlag = true;
        });
        this.dom_input.on('input',function(){
            var _this = this;
            setTimeout(function(){
                if($this.inputFlag){
                    console.log($(_this).val());
                    // $this.model.invoke('inputChange', $(_this).val());
                    // $this.model.callback($(_this).val())   // todo 临时测试
                }
            })
        });

        this.dom_leftIcon.click(function () {
            // 判断是否被禁用了：
            if(!$this.dom_leftIcon.hasClass('wtc_peopleSearch-icon-disable')){
                let curNum = Number($this.dom_curNumber.html());
                curNum--;

                $this.dom_curNumber.html(curNum);

                // 发事件到后端：
                $this.model.invoke('curNumber', curNum);
                // console.log('发事件到后端，curNumber: ' + curNum);
                // $this.model.callback(curNum)   // todo 临时测试

                // 右侧按钮取消禁止：
                $this.dom_rightIcon.removeClass('wtc_peopleSearch-icon-disable');

                // 判断是否已到最低值：
                if(curNum === 1) {
                    $this.dom_leftIcon.addClass('wtc_peopleSearch-icon-disable')
                }
            }
        });

        this.dom_rightIcon.click(function () {
            // 判断是否被禁用了：
            if(!$this.dom_rightIcon.hasClass('wtc_peopleSearch-icon-disable')){
                let curNum = Number($this.dom_curNumber.html());
                curNum++;

                $this.dom_curNumber.html(curNum);

                // 发事件到后端：
                $this.model.invoke('curNumber', curNum);
                // console.log('发事件到后端，curNumber: ' + curNum);
                // $this.model.callback(curNum)   // todo 临时测试

                // 左侧按钮取消禁止：
                $this.dom_leftIcon.removeClass('wtc_peopleSearch-icon-disable');

                // 判断是否已到最大值：
                if(curNum === $this.total) {
                    $this.dom_rightIcon.addClass('wtc_peopleSearch-icon-disable')
                }
            }
        });
    };

    KDWtcPeopleSearch.prototype.changeOption = function (options) {
        let str = '';
        for(let i = 0; i < options.length; i++){
            str += `<option value="${options[i]}">`
        }

        this.dom_datalist.html(str);
    };

    KDWtcPeopleSearch.prototype.changePeople = function (para) {
        let str = '';
        for(let i = 0; i < para.options.length; i++){
            str += `<option value="${para.options[i]}">`
        }
        this.dom_datalist.html(str);

        this.dom_input.val(para.value);
    };

    window.KDWtcPeopleSearch = KDWtcPeopleSearch;
})();