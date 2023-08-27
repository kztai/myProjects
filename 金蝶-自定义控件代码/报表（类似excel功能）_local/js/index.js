(function () {
    function ReportForm(data) {
        this.dom_formHeader = $('.form-header');
        this.dom_formData = $('.form-data');
        this.dom_LeftMenu = $('.wtc_reportForm_left-menu');
        this.dom_foldBtn = $('.wtc_reportForm_field-header-icon');
        this.dom_openBtn = $('.wtc_reportForm_open-btn');
        this.dom_fieldList = $('.wtc_reportForm_menu-field-list');
        this.dom_unitList = $('.wtc_reportForm_menu-select-unit-list');
        this.dom_totalList = $('.wtc_reportForm_menu-select-total-list');
        this.dom_singleList = $('.wtc_reportForm_menu-select-single-list');
        this.dom_dialog = $('.wtc_reportForm_dialog-wrap');
        this.dom_dialogInput = $('.wtc_reportForm_dialog-input');
        this.dom_dialogConfirmBtn = $('.wtc_reportForm_dialog-confirm-btn');
        this.dom_dialogCancelBtn = $('.wtc_reportForm_dialog-cancel-btn');

        this.init(data)
    }

    ReportForm.prototype.init = function (data) {
        let $this = this;

        this.header = data.header;
        this.data = data.data;

        // 初始化计算列的计算方式（默认求和）
        for (let i = 0; i < this.header.length; i++) {
            if(this.header[i].displaymode == '3'){
                this['isAvg_' + this.header[i].id] = false
            }
        }

        if(this.data[0]){
            this.headerToData();
            this.dataExpand();
        }

        let rowCount = this.data.length;
        let colCount = this.header.length;

        this.init_leftMenu();
        this.init_header(colCount);

        if(this.data[0]){
            this.init_data(rowCount, colCount);
            if(this.dom_formData[0].scrollHeight > this.dom_formData[0].clientHeight){
                this.dom_formHeader.css('padding-right', '17px')
            } else {
                this.dom_formHeader.css('padding-right', '0')
            }
        } else {
            this.dom_formData.html('<div style="padding:10px;">无数据</div>')
        }

        // 这些只有在数据加载完毕后才能访问：
        this.dom_selectHeader = $('.wtc_reportForm_menu-select-item-header');
        this.dom_selectOptions = $('.wtc_reportForm_menu-select-item-options');
        this.dom_optionsTotal = $('.wtc_reportForm_menu-option-total-input');
        this.dom_optionsRadio = $('.wtc_reportForm_menu-select-item-options input[type=radio]');
        this.dom_optionsRename = $('.wtc_reportForm_menu-option-rename');
        this.dom_optionsRemove = $('.wtc_reportForm_menu-option-remove');

        // 隐藏左侧菜单栏
        this.dom_foldBtn.click(function () {
            $this.dom_LeftMenu.css('display', 'none');
            $this.dom_openBtn.css('display', 'inline-block');

            // $this.dom_LeftMenu.animate({
            //     'flex-basis': '-=100px',
            //     opacity: '-=1'
            // }, 1300, function () {
            //     $this.dom_LeftMenu.css('display', 'none');
            //     $this.dom_openBtn.css('display', 'inline-block');
            // });
        });
        // 显示左侧菜单栏
        this.dom_openBtn.click(function () {
            $this.dom_openBtn.css('display', 'none');
            $this.dom_LeftMenu.css('display', 'block');
            // $this.dom_LeftMenu.animate({
            //     'flex-basis': '+=100px',
            //     opacity: '+=1'
            // }, 1300);
        });

        if(this.data[0]){
            // 显示与隐藏下拉框
            $('body').click(function (e) {
                // 只有点头部文字与图标才触发下拉框显示隐藏事件；点其他任意地方，下拉框隐藏：
                if(e.target.className === 'wtc_reportForm_menu-select-item-header' || e.target.className === 'icon iconfont icon-sousuo') {
                    let destTarget = null;

                    if(e.target.className === 'wtc_reportForm_menu-select-item-header'){
                        destTarget = $('.wtc_reportForm_menu-select-item-options', e.target.parentElement)
                    }
                    if( e.target.className === 'icon iconfont icon-sousuo'){  // todo class需要改
                        destTarget = $('.wtc_reportForm_menu-select-item-options', e.target.parentElement.parentElement)
                    }

                    if(destTarget.css('display') === 'block'){
                        destTarget.css('display', 'none');
                    } else {
                        $this.dom_selectOptions.css('display', 'none');
                        destTarget.css('display', 'block');
                    }
                } else {
                    $this.dom_selectOptions.css('display', 'none');
                }
            });
            // 下拉框小计按钮
            this.dom_optionsTotal.click(function () {
                $this.toggleTotal(this.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText, this.checked)
            });
            // 求和平均选项切换：
            this.dom_optionsRadio.change(function () {
                var text = this.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText;
                var value = $(this).val();
                var colId;

                for(let i = 0; i < $this.header.length; i++){
                    if(text === $this.header[i].value){
                        colId = $this.header[i].id;
                    }
                }

                if(value === '求和'){
                    $this['isAvg_' + colId] = false
                } else {
                    $this['isAvg_' + colId] = true;
                }

                let rowCount = $this.data.length;
                let colCount = $this.header.length;
                $this.init_data(rowCount, colCount);
                // 刷新是否显示小计行：
                $('.wtc_reportForm_menu-select-item',$this.dom_unitList).each(function (index,item) {
                    $this.toggleTotal(item.firstElementChild.innerText, item.lastElementChild.firstElementChild.firstElementChild.firstElementChild.checked)
                });
            });

            // 下拉框重命名按钮
            this.dom_optionsRename.click(function () {
                $this.rename(this.parentElement.parentElement.firstElementChild)
            });
            // 下拉框移除按钮
            this.dom_optionsRemove.click(function () {
                $this.remove(this.parentElement.parentElement.firstElementChild)
            });
            // 对话框确定按钮
            this.dom_dialogConfirmBtn.click(function () {
                $this.dialogConfirm()
            });
            // 对话框取消按钮
            this.dom_dialogCancelBtn.click(function () {
                $this.dialogCancel()
            });
        } else {
            this.dom_selectHeader.css('cursor', 'not-allowed')
        }
    };

    /*
    * 初始化左侧菜单
    * */
    ReportForm.prototype.init_leftMenu = function () {
        let fieldStr = '';
        let unitStr = '';
        let totalStr = '';
        let singleStr = '';

        for (let i = 0; i < this.header.length; i++) {
            // 初始化字段部分：
            let icon = '';
            switch (this.header[i].datatype) {
                case 'java.lang.Integer': // 数字
                case 'java.math.BigDecimal': // 数字
                    icon = 'icon iconfont icon-sousuo';
                    break;
                case 'boolean': // 布尔
                    icon = 'icon iconfont icon-sousuo';
                    break;
                case 'java.util.Date': // 日期
                    icon = 'icon iconfont icon-sousuo';
                    break;
                // case 'java.lang.String':
                // case 'kd.bos.dataentity.entity.ILocaleString':
                default:  // 字符串以及其他
                    icon = 'icon iconfont icon-sousuo';
                    break;
            }
            fieldStr += `<li class="wtc_reportForm_field-item"><i class="${icon}"></i><span>${this.header[i].value}</span></li>`;


            switch (this.header[i].displaymode) {
                case '1': // 初始化单列部分：
                    singleStr+=
                `<div class="wtc_reportForm_menu-select-item">
                    <div class="wtc_reportForm_menu-select-item-header"><i class="icon iconfont icon-sousuo"></i>${this.header[i].value}</div>
                    <ul class="wtc_reportForm_menu-select-item-options">
                        <li class="wtc_reportForm_menu-option-rename">重命名</li>
                    </ul>
                </div>`;
                    break;
                case '2': // 初始化合并部分：
                    unitStr+=
                `<div class="wtc_reportForm_menu-select-item">
                    <div class="wtc_reportForm_menu-select-item-header"><i class="icon iconfont icon-sousuo"></i>${this.header[i].value}</div>
                    <ul class="wtc_reportForm_menu-select-item-options">
                        <li style="padding:0;" class="wtc_reportForm_menu-option-total">
                            <label style="display:block; padding:10px;"><input class="wtc_reportForm_menu-option-total-input" type="checkbox" checked="checked"/>小计</label>
                        </li>
                        <li class="wtc_reportForm_menu-option-rename">重命名</li>
                        <li class="wtc_reportForm_menu-option-remove">移除</li>
                    </ul>
                </div>`;
                    break;
                case '3':  // 初始化计算部分：
                    totalStr+=
                `<div class="wtc_reportForm_menu-select-item">
                    <div class="wtc_reportForm_menu-select-item-header"><i class="icon iconfont icon-sousuo"></i>${this.header[i].value}</div>
                    <ul class="wtc_reportForm_menu-select-item-options">
                        <li class="wtc_reportForm_menu-option-sum" style="padding:0; border-bottom: none;">
                            <label style="display:block; padding:10px;"><input type="radio" name="${this.header[i].id}" checked="checked" value="求和"/>求和</label>
                        </li>
                        <li class="wtc_reportForm_menu-option-avg" style="padding:0;">
                            <label style="display:block; padding:10px;"><input type="radio" name="${this.header[i].id}" value="平均"/>平均</label>
                        </li>
                        <li class="wtc_reportForm_menu-option-rename">重命名</li>
                    </ul>
                </div>`;
                    break;
            }
        }

        this.dom_fieldList.html(fieldStr);
        this.dom_unitList.html(unitStr);
        this.dom_totalList.html(totalStr);
        this.dom_singleList.html(singleStr);
    };

    /*
    * 初始化表格头部
    * */
    ReportForm.prototype.init_header = function (colCount) {
        // 头部分行列
        this.dom_formHeader.css({
            'grid-template-rows': '1fr',
            // 'grid-template-columns': `minmax(600px, 1fr) minmax(600px, 1fr) minmax(600px, 1fr) minmax(600px, 1fr) minmax(600px, 1fr) minmax(600px, 1fr)`
            // 'grid-template-columns': `repeat(${colCount}, 1fr)`
            'grid-template-columns': `repeat(${colCount}, minmax(200px, 1fr))`
        });

        // 填充头部的item，并渲染
        let str = '';
        for (let i = 0; i < this.header.length; i++) {
            str += `<div class="form-item header-item col-${i + 1}">${this.header[i].value}</div>`;
        }
        this.dom_formHeader.html(str);
    };

    /*
    * 初始化表格数据部分
    * */
    ReportForm.prototype.init_data = function (rowCount, colCount) {
        // 主体分行列
        let str = '';
        for (let i = 0; i < rowCount; i++) {
            i === 0 ? str += '1fr' : str += ' 1fr';
        }
        this.dom_formData.css({
            'grid-template-rows': str,
            'grid-template-columns': `repeat(${colCount}, 1fr)`
        });

        // 填充主体的item，并渲染
        let objUnit = {};
        let curUnit = null;
        str = '';

        for (let j = 0; j < this.data[0].length; j++) {
            for (let i = 0; i < this.data.length; i++) {
                let row = 'row-' + (i + 1);
                let col = 'col-' + (j + 1);

                if (this.data[i][j].displaymode == '2') {
                    if (this.isFirstItem(i, j)) {
                        curUnit = `.form-item.${row}.${col}`;
                        objUnit[curUnit] = [i + 1, i + 2];
                        // 判断是否是小计项：
                        if (this.data[i][j].isTotal) {
                            let text = this.data[i][j].value;
                            str += `<div class="form-item text-align-${this.data[i][j].alignmode} total total-${this.data[i][j].isTotal} ${row} ${col}">${text}</div>`;
                        } else {
                            str += `<div class="form-item text-align-${this.data[i][j].alignmode} ${row} ${col}">${this.data[i][j].value}</div>`;
                        }
                    } else {
                        objUnit[curUnit][1]++;
                    }
                } else {
                    let text = this.data[i][j].value;
                    if (this.data[i][j].displaymode == '3') {
                        text = this['isAvg_' + this.data[i][j].id] ? this.data[i][j].value[1] : this.data[i][j].value[0];
                        // 再判断小计行是否需要填写总数：
                        if (this.data[i][j].isTotal && !this.data[i][j].total) {
                            text = '';
                        }
                    }
                    if (this.data[i][j].isTotal) {
                        str += `<div class="form-item text-align-${this.data[i][j].alignmode} total total-${this.data[i][j].isTotal} ${row} ${col}">${text}</div>`;
                        // str += `<div class="form-item text-align-${this.data[i][j].alignmode} total total-${this.data[i][j].isTotal} ${row} ${col}" ${i % 2 !== 0 ? "style='background:rgba(85,130,243,0.1)'" : ''}>${text}</div>`;
                    } else {
                        str += `<div class="form-item text-align-${this.data[i][j].alignmode} ${row} ${col}">${text}</div>`;
                    }
                }
            }
        }

        this.dom_formData.html(str);

        // 合并项合并：
        for (let key in objUnit) {
            $(key).css({
                'grid-row-start': `${objUnit[key][0]}`,
                'grid-row-end': `${objUnit[key][1]}`
            })
        }
    };

    /*
    * 将头部信息同步到数据中
    * */
    ReportForm.prototype.headerToData = function () {
        // 将头部数据同步到data中：
        for (let j = 0; j < this.data[0].length; j++) {
            for (let i = 0; i < this.data.length; i++) {
                // 数据中添加total displaymode项：
                this.data[i][j].total = this.header[j].total;
                this.data[i][j].displaymode = this.header[j].displaymode;
                // 对齐方式自动的话，需要从新定义对齐方式（按需求文档）：
                if(this.header[j].alignmode == '1'){
                    switch (this.header[j].datatype) {
                        case 'java.lang.Integer': // 数字
                        case 'java.math.bigDecimal': // 数字
                            this.data[i][j].alignmode = '4';  // 居右
                            break;
                        case 'boolean': // 布尔
                            this.data[i][j].alignmode = '3'; // 居中
                            break;
                        case 'java.util.Date': // 日期
                            this.data[i][j].alignmode = '3'; // 居中
                            break;
                        // case 'java.lang.String':
                        // case 'kd.bos.dataentity.entity.ILocaleString':
                        default:  // 字符串以及其他
                            this.data[i][j].alignmode = '2'; // 居左
                            break;
                    }
                }else {
                    this.data[i][j].alignmode = this.header[j].alignmode;
                }
            }
        }
    };

    /*
    * 数据的扩展，把小计数据添加到原data中
    * */
    ReportForm.prototype.dataExpand = function () {
        let otherData = null;
        let count = 1;
        let zIndex = 0;  // 合并列的层级
        let arrSumCol = [];  // 当前合并项的总和

        for (var j = 0; j < this.data[0].length; j++) {
            otherData = {};  // 新增的小计行
            count = 1;
            // 是合并列，则层级叠加：
            if(this.data[0][j].displaymode == '2'){
                zIndex++;
            }
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i][j].displaymode == '2' && this.isLastItem(i, j)) {
                    // 判断是否是合并列的小计项：是小计项则跳过；不是则新增一行小计行：
                    if (!this.data[i][j].isTotal) {
                        otherData[i] = [];
                        // 组织小计行数据：
                        this.data[i].forEach(function (item, index) {
                            if (index <= j) {
                                otherData[i].push({
                                    value: item.value,
                                    id: item.id,
                                    displaymode: item.displaymode,
                                    alignmode: item.alignmode,
                                    total: item.total,
                                    isTotal: zIndex
                                })
                            } else if (index === j + 1) {
                                otherData[i].push({
                                    value: '小计',
                                    id: item.id,
                                    displaymode: item.displaymode,
                                    alignmode: item.alignmode,
                                    total: item.total,
                                    isTotal: zIndex
                                })
                            } else {
                                otherData[i].push({
                                    value: '',
                                    id: item.id,
                                    displaymode: item.displaymode,
                                    alignmode: item.alignmode,
                                    total: item.total,
                                    isTotal: zIndex
                                })
                            }
                        });
                    }
                }

                // 判断是否是计算列：
                if (this.data[i][j].displaymode == '3') {
                    let curZIndex = this.data[i][j].isTotal;
                    // 判断是否是计算列中的小计项，是则计算总值，否则保存单个值：
                    if (curZIndex) {
                        // 记录总数：
                        if (!arrSumCol[curZIndex]) arrSumCol[curZIndex] = [[], []];

                        // 获取当前小计的总数与平均值：
                        let curTotal = arrSumCol[curZIndex + 1][0].reduce(function (total, item) {
                            return total + item
                        }, 0);
                        let curAvg = arrSumCol[curZIndex + 1][1].reduce(function (total, item) {
                            return total + item
                        }, 0);

                        // 存储当前层级的总值，因为再计算下一个层级时需要用到：
                        arrSumCol[curZIndex][0].push(curTotal);
                        arrSumCol[curZIndex][1].push(curAvg);

                        // 将当前层级的后面层级都清空：
                        for(let m= curZIndex; m <= zIndex; m++){
                            arrSumCol[m+1] = [[], []];   // 记录总数
                        }
                        // 将计算的结果保存到小计项：
                        this.data[i][j].value = [curTotal, curAvg];

                        // 判断是否层级已到最高层，是的话要重置：
                        if (curZIndex === 1) {
                            arrSumCol = [];
                        }
                    } else {
                        if (!arrSumCol[zIndex+1]) arrSumCol[zIndex+1] = [[], []];
                        arrSumCol[zIndex+1][0].push(this.data[i][j].value[0]);
                        arrSumCol[zIndex+1][1].push(this.data[i][j].value[1]);
                    }
                }
            }

            // 将当前列的小计数据添加到data中：
            for (let key in otherData) {
                let nKey = Number(key);
                this.data.splice(nKey + count, 0, otherData[key]);
                count++;
            }
        }
    };

    /*
    * 用户传入新数据，刷新界面
    * */
    ReportForm.prototype.refreshData_query = function (data) {
        // 没有数据的情况：
        if(!data || !data[0]){
            this.dom_formData.css({
                'grid-template-rows': '1fr',
                'grid-template-columns': '1fr'
            });
            this.dom_formData.html('<div style="padding:10px;">无数据</div>');
            return
        }

        let $this = this;
        let arrOldId = [];
        let arrNewId = [];
        for(let i = 0; i < this.header.length; i++){
            arrOldId.push(this.header[i].id);
        }
        for(let i = 0; i < data[0].length; i++){
            arrNewId.push(data[0][i].id);
        }

        // 将新数据中多出的列删除
        for(let i = 0; i < arrNewId.length; i++){
            let index = arrOldId.indexOf(arrNewId[i]);
            if(index === -1){ // 原数据中没有这一列
                arrNewId.splice(i, 1);
                // 删除这列：
                for(let j = 0; j < data.length; j++){
                    data[j].splice(i, 1)
                }
                i--;
            }
        }

        // 将新数据中缺少的列添加：
        if(arrNewId.length !== arrOldId.length){
            for(let i = 0; i < arrOldId.length; i++){
                let index = arrNewId.indexOf(arrOldId[i]);
                if(index === -1){ // 新数据中没有这一列
                    arrNewId.push(arrOldId[i]);
                    // 添加这列：
                    for(let j = 0; j < data.length; j++){
                        data[j].push({id: arrOldId[i], value: ''});
                    }
                }
            }
        }

        // 判断是否与原数据顺序一致，一致则跳过，否则调换位置：
        for(let i = 0; i < arrNewId.length; i++){
            let index = arrOldId.indexOf(arrNewId[i]);
            if(index !== i){ // 调换位置
                let temp_id = arrNewId[index];
                arrNewId[index] = arrNewId[i];
                arrNewId[i] = temp_id;

                for(let j = 0; j < data.length; j++){
                    let temp_data = data[j][index];
                    data[j][index] = data[j][i];
                    data[j][i] = temp_data;
                }
                i--;
            }
        }

        // 更新本地data，并重新渲染:
        this.data = data;
        this.headerToData();
        this.dataExpand();
        let rowCount = this.data.length;
        let colCount = this.header.length;
        this.init_data(rowCount, colCount);
        // 刷新是否显示小计行：
        $('.wtc_reportForm_menu-select-item',this.dom_unitList).each(function (index,item) {
            $this.toggleTotal(item.firstElementChild.innerText, item.lastElementChild.firstElementChild.firstElementChild.firstElementChild.checked)
        });
        // 是否出现滚动条：
        if(this.dom_formData[0].scrollHeight > this.dom_formData[0].clientHeight){
            this.dom_formHeader.css('padding-right', '17px')
        } else {
            this.dom_formHeader.css('padding-right', '0')
        }

    };

    /*
    * 是否显示小计行
    * */
    ReportForm.prototype.toggleTotal = function (unitItem, selected) {
        let arrRow = [];
        let index;
        let count = 0;

        // 找出该列的索引：
        for (let i = 0; i < this.header.length; i++) {
            if (this.header[i].value === unitItem) {
                index = i;
                break;
            }
        }
        // 计算出该列对应的层级：
        for (let i = 0; i < this.data[0].length; i++) {
            if (i > index) break;
            if (this.data[0][i].displaymode == '2') count++;
        }
        // 找出该列层级对应的行：
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i][0].isTotal === count) {
                arrRow.push(i)
            }
        }

        // 隐藏态则行的高度变为0，同时隐藏；显示态则行的高度变为1fr，同时显示：
        let str = this.dom_formData.css('grid-template-rows');
        let arrTemp = str.split(' ');
        arrRow.forEach(function (item) {
            selected ? arrTemp[item] = '1fr' : arrTemp[item] = '0'
        });
        str = arrTemp.join(' ');

        this.dom_formData.css({
            'grid-template-rows': str
        });

        var dom_sum = $(`.total-${count}`);

        if (selected) {
            dom_sum.css({
                'padding': '4px',
                'border-bottom': '1px solid #ddd',
                'visibility': 'visible'
            });
        } else {
            dom_sum.css({
                'padding': '0',
                'border-bottom': 'none',
                'visibility': 'hidden'
            });
        }

        // 是否出现滚动条：
        if(this.dom_formData[0].scrollHeight > this.dom_formData[0].clientHeight){
            this.dom_formHeader.css('padding-right', '17px')
        } else {
            this.dom_formHeader.css('padding-right', '0')
        }
    };

    /*
    * 点击移除按钮
    * */
    ReportForm.prototype.remove = function (el) {
        let $this = this;
        let arrTemp;
        let curRemoveValue = el.innerText;
        let modifyIndex = -1;
        let lastUnitIndex = -1;

        for(let i = 0; i < this.header.length; i++){
            if(this.header[i].value === curRemoveValue) modifyIndex = i;
            if(this.header[i].displaymode === '2') lastUnitIndex++;
        }

        // 头部展示方式修改：
        this.header[modifyIndex].displaymode = '1';
        // 头部组合项前移：
        if(lastUnitIndex>0 && modifyIndex !== lastUnitIndex){
            arrTemp = this.header.splice(modifyIndex, 1);
            this.header.splice(lastUnitIndex, 0, arrTemp[0]);
        }

        for(let i = this.data.length-1; i >= 0; i--){
            if(this.data[i][0].isTotal){
                this.data.splice(i,1);
                continue;
            }
            // 数据展示方式修改,改为单列
            this.data[i][modifyIndex].displaymode = '1';
            // 数据组合项前移：
            if(lastUnitIndex>0 && modifyIndex !== lastUnitIndex){
                arrTemp = this.data[i].splice(modifyIndex, 1);
                this.data[i].splice(lastUnitIndex, 0, arrTemp[0]);
            }
        }

        let rowCount = this.data.length;
        let colCount = this.data[0].length;
        // 刷新表格：
        this.init_header(colCount);
        this.dataExpand();
        this.init_data(rowCount, colCount);

        // 刷新左侧菜单
        let eleTemp = el.parentNode.parentNode;
        el.parentNode.parentNode.removeChild(el.parentNode);
        if(eleTemp.innerHTML==='') {
            // eleTemp.parentNode.style.display = 'none';
            eleTemp.parentNode.parentNode.removeChild(eleTemp.parentNode);
        }
        let singleStr =
            `<div class="wtc_reportForm_menu-select-item">
                    <div class="wtc_reportForm_menu-select-item-header"><i class="icon iconfont icon-sousuo"></i>${curRemoveValue}</div>
                    <ul class="wtc_reportForm_menu-select-item-options">
                        <li class="wtc_reportForm_menu-option-rename">重命名</li>
                    </ul>
                </div>`;
        this.dom_singleList.html(function (index, oldHtml) {
            return oldHtml+singleStr
        });

        this.dom_selectOptions = $('.wtc_reportForm_menu-select-item-options');
        this.dom_optionsRename = $('.wtc_reportForm_menu-option-rename');
        // 从新绑定下拉框重命名按钮
        this.dom_optionsRename.click(function () {
            $this.rename(this.parentElement.parentElement.firstElementChild)
        });
        // 刷新是否显示小计行：
        $('.wtc_reportForm_menu-select-item',this.dom_unitList).each(function (index,item) {
            $this.toggleTotal(item.firstElementChild.innerText, item.lastElementChild.firstElementChild.firstElementChild.firstElementChild.checked)
        });

        // 是否出现滚动条：
        if(this.dom_formData[0].scrollHeight > this.dom_formData[0].clientHeight){
            this.dom_formHeader.css('padding-right', '17px')
        } else {
            this.dom_formHeader.css('padding-right', '0')
        }
    };

    /*
    * 点击重命名按钮，显示对话框
    * */
    ReportForm.prototype.rename = function (el) {
        this.curRenameItem = el;
        this.curRenameOldValue = el.innerText;
        this.dom_dialogInput.val(el.innerText);
        this.dom_dialog.css('display', 'block')
    };

    /*
    * 点击重命名对话框确定按钮
    * */
    ReportForm.prototype.dialogConfirm = function () {
        let $this = this;
        let newValue = this.dom_dialogInput.val();
        // 修改菜单栏文本：
        this.curRenameItem.innerHTML = `<i class="icon iconfont icon-sousuo"></i>${newValue}`;
        // 隐藏对话框：
        this.dom_dialog.css('display', 'none');

        // 刷新表格头部数据：
        for(let i = 0; i < this.header.length; i++){
            if(this.header[i].value === this.curRenameOldValue){
                this.header[i].value = newValue;
                break;
            }
        }

        let colCount = this.data[0].length;
        // 刷新表格：
        this.init_header(colCount);
        // 刷新字段列表：
        $('.wtc_reportForm_field-item', this.dom_fieldList).each(function (index, item) {
            if(item.lastElementChild.innerText === $this.curRenameOldValue){
                item.lastElementChild.innerText = newValue;
            }
        })
    };

    /*
    * 点击对话框取消按钮
    * */
    ReportForm.prototype.dialogCancel = function () {
        this.dom_dialog.css('display', 'none')
    };

    /*
    * 是否是合并项的首个item
    * */
    ReportForm.prototype.isFirstItem = function (i, j) {
        if (i === 0) return true;

        if (this.data[i][j].value !== this.data[i - 1][j].value) return true;

        while (j !== 0) {
            j--;
            if (this.data[i][j].value !== this.data[i - 1][j].value) return true;
        }

        return false;
    };

    /*
    * 是否是合并项的最后item
    * */
    ReportForm.prototype.isLastItem = function (i, j) {
        if (this.data[i + 1] === undefined) return true;

        if (this.data[i][j].value !== this.data[i + 1][j].value) return true;

        return false;
    };

    window.ReportForm = ReportForm;
})();