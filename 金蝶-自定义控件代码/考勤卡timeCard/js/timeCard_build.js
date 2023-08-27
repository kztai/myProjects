'use strict';

(function () {
    function KdWtcTimeCard(para) {
        this.moveFlag = false;
        this.model = para.model;
        this.rootDom = para.model.dom;
        this.data_cardRecord = para.cardRecord;
        this.data_attendanceTotal = para.attendanceTotal;
        this.data_operationLog = para.operationLog;
        this.defaultDateRange = para.dateValue;
        this.userDateRange = para.dateValue;

        this.dom_container = $('.wtc_timeCard_container', this.rootDom);
        this.dom_fullSrceenBtn = $('.wtc_timeCard_card-allPage-btn', this.rootDom);
        this.dom_recordHeader = $('.wtc_timeCard_card-record-header', this.rootDom);
        this.dom_recordMain = $('.wtc_timeCard_card-record-main', this.rootDom);
        this.dom_recordWrap = $('.wtc_timeCard_card-record', this.rootDom);
        this.dom_attendanceTotal = $('.wtc_timeCard_total-main-attendance', this.rootDom);
        this.dom_operationLog = $('.wtc_timeCard_operation-log-main', this.rootDom);
        this.dom_rangeBtn = $('.wtc_timeCard_btn-selected-range', this.rootDom);
        this.dom_customBtn = $('.wtc_timeCard_btn-custom', this.rootDom);
        this.dom_bottomPicker = $('.wtc_timeCard_total-left-btns .wtc_timeCard_date-picker', this.rootDom);
        this.dom_btnAttendance = $('.wtc_timeCard_btn-attendance-total', this.rootDom);
        this.dom_btnOperation = $('.wtc_timeCard_btn-operation-log', this.rootDom);
        // this.dom_totalMain = $('.wtc_timeCard_data-total-main', this.rootDom);
        this.dom_mainAttendance = $('.wtc_timeCard_total-main-attendance', this.rootDom);
        this.dom_mainOperation = $('.wtc_timeCard_total-main-operation-log', this.rootDom);
        this.dom_dataTotal = $('.wtc_timeCard_data-total', this.rootDom);
        this.dom_btnFold = $('.wtc_timeCard_data-total-fold-btn', this.rootDom);
        this.dom_totalLine = $('.wtc_timeCard_data-total-line', this.rootDom);

        this.dom_dialog = $('.wtc_timeCard_dialog-wrap', this.rootDom);
        this.dom_dialogText = $('.wtc_timeCard_dialog-text', this.rootDom);
        this.dom_dialogConfirmBtn = $('.wtc_timeCard_dialog-confirm-btn', this.rootDom);
        this.dom_dialogCancelBtn = $('.wtc_timeCard_dialog-cancel-btn', this.rootDom);

        this.init();
    }

    KdWtcTimeCard.prototype.init = function () {
        var $this = this;
        this.init_cardRecord();
        this.init_attendanceTotal();
        this.init_operationLog();
        this.init_dynamicEvent();

        // 绑定事件：
        // 隐藏更多按钮框
        $('body').click(function () {
            $this.dom_crecordPop.fadeOut(200);
        });

        // 默认已选范围按钮：
        this.dom_rangeBtn.click(function () {
            if (!$this.dom_rangeBtn.hasClass('wtc_timeCard_left-btn-active')) {
                $this.dom_rangeBtn.addClass('wtc_timeCard_left-btn-active');
                $this.dom_bottomPicker.css('display', 'none');
                $this.dom_customBtn.removeClass('wtc_timeCard_left-btn-active');

                // 发事件到后端获取数据：
                // $this.model.invoke('eventName', this.defaultDateRange);
            }
        });

        // 自定义按钮：
        this.dom_customBtn.click(function () {
            if (!$this.dom_customBtn.hasClass('wtc_timeCard_left-btn-active')) {
                $this.dom_customBtn.addClass('wtc_timeCard_left-btn-active');
                $this.dom_bottomPicker.css('display', 'block');
                $this.dom_rangeBtn.removeClass('wtc_timeCard_left-btn-active');

                // 发事件到后端获取数据：
                // $this.model.invoke('eventName', this.userDateRange);
            }
        });

        // 出勤汇总按钮：
        this.dom_btnAttendance.click(function () {
            // 按钮样式切换：
            if (!$this.dom_btnAttendance.hasClass('wtc_timeCard_right-btn-active')) {
                $this.dom_btnAttendance.addClass('wtc_timeCard_right-btn-active');
            }
            $this.dom_btnOperation.removeClass('wtc_timeCard_right-btn-active');

            // 数据界面切换
            if (!$this.dom_mainOperation.hasClass('wtc_timeCard_total-main-hide')) {
                $this.dom_mainOperation.addClass('wtc_timeCard_total-main-hide');
            }
            $this.dom_mainAttendance.removeClass('wtc_timeCard_total-main-hide');
        });

        // 操作日志按钮：
        this.dom_btnOperation.click(function () {
            // 按钮样式切换：
            if (!$this.dom_btnOperation.hasClass('wtc_timeCard_right-btn-active')) {
                $this.dom_btnOperation.addClass('wtc_timeCard_right-btn-active');
            }
            $this.dom_btnAttendance.removeClass('wtc_timeCard_right-btn-active');

            // 数据界面切换
            if (!$this.dom_mainAttendance.hasClass('wtc_timeCard_total-main-hide')) {
                $this.dom_mainAttendance.addClass('wtc_timeCard_total-main-hide');
            }
            $this.dom_mainOperation.removeClass('wtc_timeCard_total-main-hide');
        });

        // 展开收起按钮：
        this.dom_btnFold.click(function () {
            $this.dom_dataTotal.slideToggle(200);
            if (this.firstElementChild.className === 'icon iconfont icon-gengduo') {
                this.innerHTML = '汇总<i class="icon iconfont icon-sousuo"></i>';
            } else {
                this.innerHTML = '收起<i class="icon iconfont icon-gengduo"></i>';
            }
        });

        // 取消全屏按钮：
        this.dom_fullSrceenBtn.click(function () {
            $this.fullScreenCancel();
        });

        // 调节高度按钮：
        this.dom_totalLine.mousedown(function (event) {
            $this.moveFlag = true;
            $this.startY = event.clientY;
            $this.dataTotalHeight = $this.dom_dataTotal.height();
            $this.containerHeight = $this.dom_container.height();
        });

        $('body').mouseup(function () {
            $this.moveFlag = false;
        });

        $(this.rootDom).mousemove(function (event) {
            if ($this.moveFlag) {
                var curHeight = $this.dataTotalHeight + ($this.startY - event.clientY);
                // 5为拖动线的高度，防止被隐藏：
                // 28为底部展开按钮的高度：
                if (curHeight > 5 && curHeight < $this.containerHeight - 28) $this.dom_dataTotal.height(curHeight);
            }
        });

        // 对话框确定按钮
        this.dom_dialogConfirmBtn.click(function () {
            $this.dialogConfirm();
        });
        // 对话框取消按钮
        this.dom_dialogCancelBtn.click(function () {
            $this.dialogCancel();
        });
    };

    KdWtcTimeCard.prototype.init_cardRecord = function () {
        var objUnit = {};
        var curUnit = null;
        var curStr = '';

        // 判断是否有数据：
        if (this.data_cardRecord[0]) {
            for (var j = 0; j < this.data_cardRecord[0].length; j++) {
                var col = 'col-' + (j + 1);
                curStr += '<div class="wtc_timeCard_card-record-item-col item-' + col + '">';

                for (var i = 0; i < this.data_cardRecord.length; i++) {
                    var row = 'row-' + (i + 1);

                    if (j === 0) {
                        // 第一列有需要合并的项，需要单独处理：
                        if (this.isFirstItem(i, j)) {
                            curUnit = '.wtc_timeCard_card-record-item-row.' + row + '.' + col;
                            objUnit[curUnit] = [row];

                            curStr += '<div style="border-left: 2px solid ' + this.data_cardRecord[i][j].color + '" class="wtc_timeCard_card-record-item-row ' + row + ' ' + col + ' ' + (this.data_cardRecord[i][j].abnormal ? 'item-abnormal' : '') + '"><i class="wtc_timeCard_card-record-icon icon iconfont icon-duihao"></i>';

                            if (this.data_cardRecord[i][j].abnormal) {
                                // 异常的打卡记录
                                curStr += this.data_cardRecord[i][j].value + '<i class="wtc_timeCard_card-abnormal-record icon iconfont icon-gengduo"></i>\n                            <ul class="wtc_timeCard_card-abnormal-record-pop">\n                                <li class="wtc_timeCard_card-abnormal-record-pop-item wtc_timeCard_card-abnormal-pop-modify">\u4FEE\u6539\u6253\u5361</li>\n                                <li class="wtc_timeCard_card-abnormal-record-pop-item wtc_timeCard_card-abnormal-pop-confirm">\u5F02\u5E38\u786E\u8BA4</li>\n                            </ul></div>';
                            } else {
                                // 正常的打卡记录
                                curStr += this.data_cardRecord[i][j].value + '</div>';
                            }
                        } else {
                            objUnit[curUnit].push(row);
                        }
                    } else {
                        curStr += '<div class="wtc_timeCard_card-record-item-row ' + row + ' ' + col + ' ' + (this.data_cardRecord[i][j].abnormal ? 'item-abnormal' : '') + ' ' + (this.data_cardRecord[i][j].actual ? 'item-actual' : '') + '">';
                        if (this.data_cardRecord[i][j].abnormal) {
                            // 异常的打卡记录
                            curStr += this.data_cardRecord[i][j].value + '<i class="wtc_timeCard_card-abnormal-record icon iconfont icon-gengduo"></i>\n                            <ul class="wtc_timeCard_card-abnormal-record-pop">\n                                <li class="wtc_timeCard_card-abnormal-record-pop-item wtc_timeCard_card-abnormal-pop-modify">\u4FEE\u6539\u6253\u5361</li>\n                                <li class="wtc_timeCard_card-abnormal-record-pop-item wtc_timeCard_card-abnormal-pop-confirm">\u5F02\u5E38\u786E\u8BA4</li>\n                            </ul></div>';
                        } else {
                            // 正常的打卡记录
                            curStr += this.data_cardRecord[i][j].value + '</div>';
                        }
                    }
                }

                curStr += '</div>';
            }

            this.dom_recordMain.html(curStr);

            // 合并项合并：
            for (var key in objUnit) {
                var $item = $(key);
                $item.css({
                    'height': objUnit[key].length * 30 + 'px'
                });
                for (var _i = 0; _i < objUnit[key].length; _i++) {
                    if (_i > 0) {
                        $item.addClass(objUnit[key][_i]);
                    }
                }
            }

            // 当数据部分出现滚动条时，表格头部需要加右内边距：
            if (this.dom_recordMain.height() > this.dom_recordWrap.height()) {
                this.dom_recordHeader.css('padding-right', '18px');
            } else {
                this.dom_recordHeader.css('padding-right', '1px');
            }
        } else {
            this.dom_recordMain.html('无数据');
        }
    };

    KdWtcTimeCard.prototype.init_attendanceTotal = function () {
        var curStr = '';

        // 判断是否有数据：
        if (this.data_attendanceTotal[0]) {
            for (var i = 0; i < this.data_attendanceTotal.length; i++) {
                curStr += '<div class="wtc_timeCard_total-main-attendance-item">' + this.data_attendanceTotal[i][0] + '\uFF1A<span style="color: #5582F3;">' + this.data_attendanceTotal[i][1] + '</span> ' + this.data_attendanceTotal[i][2] + '</div>';
            }

            this.dom_attendanceTotal.html(curStr);
        } else {
            this.dom_attendanceTotal.html('无数据');
        }
    };

    KdWtcTimeCard.prototype.init_operationLog = function () {
        var curStr = '';

        // 判断是否有数据：
        if (this.data_operationLog[0]) {
            for (var i = 0; i < this.data_operationLog.length; i++) {
                var row = 'log-row-' + (i + 1);
                curStr += '<div class="wtc_timeCard_total-main-log-row ' + row + '">';
                for (var j = 0; j < this.data_operationLog[i].length; j++) {
                    var col = 'log-col-' + (j + 1);
                    curStr += '<div class="wtc_timeCard_total-main-log-col ' + col + '">' + this.data_operationLog[i][j] + '</div>';
                }
                curStr += '</div>';
            }

            this.dom_operationLog.html(curStr);
        } else {
            this.dom_operationLog.html('无数据');
        }
    };

    /*
    * 绑定动态部分的dom事件
    * */
    KdWtcTimeCard.prototype.init_dynamicEvent = function () {
        var $this = this;
        this.dom_crecordPop = $('.wtc_timeCard_card-abnormal-record-pop', this.rootDom);
        this.dom_popModify = $('.wtc_timeCard_card-abnormal-pop-modify', this.rootDom);
        this.dom_popConfirm = $('.wtc_timeCard_card-abnormal-pop-confirm', this.rootDom);
        this.dom_btnMore = $('.wtc_timeCard_card-abnormal-record', this.rootDom);
        this.dom_col1 = $('.col-1', this.rootDom);

        // 弹出框修改打卡按钮：
        this.dom_popModify.click(function (event) {
            event.stopPropagation();
            // 阻止默认行为后，body事件不会触发，所以需要重新实现：
            $(this.parentElement).fadeOut(200);

            // todo 后续实现，需要向后端发事件，实现跳转：
            console.log('修改打卡事件被触发');
        });

        // 弹出框异常确认按钮：
        this.dom_popConfirm.click(function (event) {
            event.stopPropagation();
            // 阻止默认行为后，body事件不会触发，所以需要重新实现：
            $(this.parentElement).fadeOut(200);

            // todo 下一个版本实现：
            // console.log('异常确认事件被触发');
            $this.dom_dialogText.html('是否确定该异常？');
            $this.dom_dialog.css('display', 'block');
        });

        // 日期下拉框
        this.dom_col1.click(function () {
            // 1是下拉，2是上拉：
            if (this.firstElementChild.className === 'wtc_timeCard_card-record-icon icon iconfont icon-gengduo') {
                $this.toggleDateSelected(this, 1);
            } else {
                $this.toggleDateSelected(this, 2);
            }
        });

        // 更多按钮：
        this.dom_btnMore.click(function (event) {
            var curPop = this.parentElement.lastElementChild;
            event.stopPropagation(); // 阻止触发body、日期下拉框事件

            // 其他弹出框隐藏，当前弹出框显示：
            $this.dom_crecordPop.each(function (index, item) {
                if (curPop !== item) {
                    $(item).fadeOut(200);
                }
            });
            $(curPop).fadeToggle(200);
        });
    };

    KdWtcTimeCard.prototype.dateSelectAll = function (type) {
        // 1是全展开，2是全收起：
        for (var i = 0; i < this.dom_col1.length; i++) {
            if (type === 1) {
                if (this.dom_col1[i].firstElementChild.className === 'wtc_timeCard_card-record-icon icon iconfont icon-gengduo') {
                    this.toggleDateSelected(this.dom_col1[i], type);
                }
            } else {
                if (this.dom_col1[i].firstElementChild.className !== 'wtc_timeCard_card-record-icon icon iconfont icon-gengduo') {
                    this.toggleDateSelected(this.dom_col1[i], type);
                }
            }
        }
    };

    KdWtcTimeCard.prototype.toggleDateSelected = function (target, type) {
        // wtc_timeCard_card-record-item-row row-1 col-1 item-abnormal row-2 row-3 row-4 row-5 row-6
        var arrClass = target.className.split(' ');
        var arrRow = [];

        for (var i = 0; i < arrClass.length; i++) {
            if (arrClass[i].startsWith('row-')) arrRow.push(arrClass[i]);
        }

        // 对除了第一列的其他列进行处理：
        for (var _i2 = 0; _i2 < arrRow.length; _i2++) {
            // 行的顺序一定是固定的，所以可知arrRow第一个值一定是第一行，直接跳过：
            if (_i2 > 0) {
                var $curRow = $('.' + arrRow[_i2], this.rootDom);
                // 1是下拉，2是上拉：
                type === 1 ? $curRow.css('display', 'flex') : $curRow.css('display', 'none');
            }
        }

        // 处理第一列：上面代码把第一列也隐藏了，需要恢复，并重新计算高度：
        var $target = $(target);
        // 判断是上拉还是下拉：
        if (type === 1) {
            // 下拉icon
            target.firstElementChild.className = 'wtc_timeCard_card-record-icon icon iconfont icon-duihao';
            $target.height($target.height() + 30 * (arrRow.length - 1));
        } else {
            // 上拉icon
            target.firstElementChild.className = 'wtc_timeCard_card-record-icon icon iconfont icon-gengduo';
            $target.height($target.height() - 30 * (arrRow.length - 1));
            $target.css('display', 'flex');
        }

        // 当数据部分出现滚动条时，表格头部需要加右内边距：
        if (this.dom_recordMain.height() > this.dom_recordWrap.height()) {
            this.dom_recordHeader.css('padding-right', '18px');
        } else {
            this.dom_recordHeader.css('padding-right', '1px');
        }
    };

    KdWtcTimeCard.prototype.fullScreen = function () {
        this.dom_container.css('position', 'fixed');
        this.dom_fullSrceenBtn.css('display', 'block');

        // 当数据部分出现滚动条时，表格头部需要加右内边距：
        if (this.dom_recordMain.height() > this.dom_recordWrap.height()) {
            this.dom_recordHeader.css('padding-right', '18px');
        } else {
            this.dom_recordHeader.css('padding-right', '1px');
        }
    };

    KdWtcTimeCard.prototype.fullScreenCancel = function () {
        this.dom_container.css('position', 'relative');
        this.dom_fullSrceenBtn.css('display', 'none');

        // 一种情况：全屏时统计部分拉的很高，再取消全屏则高度超过主体高度：
        if (this.dom_dataTotal.height() > this.dom_container.height() - 28) {
            this.dom_dataTotal.height(this.dom_container.height() - 28);
        }

        // 当数据部分出现滚动条时，表格头部需要加右内边距：
        if (this.dom_recordMain.height() > this.dom_recordWrap.height()) {
            this.dom_recordHeader.css('padding-right', '18px');
        } else {
            this.dom_recordHeader.css('padding-right', '1px');
        }
    };

    /*
    * 点击对话框确定按钮
    * */
    KdWtcTimeCard.prototype.dialogConfirm = function () {
        this.dom_dialog.css('display', 'none');
    };

    /*
    * 点击对话框取消按钮
    * */
    KdWtcTimeCard.prototype.dialogCancel = function () {
        this.dom_dialog.css('display', 'none');
    };

    /*
    * 刷新考勤记录数据
    * */
    KdWtcTimeCard.prototype.refresh_cardRecord = function (data) {
        this.data_cardRecord = data;
        this.init_cardRecord();
        this.init_dynamicEvent();
    };

    /*
    * 刷新出勤汇总数据
    * */
    KdWtcTimeCard.prototype.refresh_attendanceTotal = function (data) {
        this.data_attendanceTotal = data;
        this.init_attendanceTotal();
    };

    /*
    * 刷新操作日志数据
    * */
    KdWtcTimeCard.prototype.refresh_operationLog = function (data) {
        this.data_operationLog = data;
        this.init_operationLog();
    };

    /*
    * 是否是合并项的首个item
    * */
    KdWtcTimeCard.prototype.isFirstItem = function (i, j) {
        if (i === 0) return true;

        if (this.data_cardRecord[i][j].value !== this.data_cardRecord[i - 1][j].value) return true;

        while (j !== 0) {
            j--;
            if (this.data_cardRecord[i][j].value !== this.data_cardRecord[i - 1][j].value) return true;
        }

        return false;
    };

    window.KdWtcTimeCard = KdWtcTimeCard;
})();