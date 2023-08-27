<template>
    <ul ref="rightGroupList" class="wtc_roster-table-right-group-list" :style="{'width': rightWidth}">
        <li class="wtc_roster-table-right-group-item"
            v-for="(orgRosterData, index3) in allRosterData.rosterAdminOrgModelsList" :key="index3"
            :groupId="orgRosterData.id">
            <ul class="wtc_roster-table-right-group-row row_1">
                <cell @showRightClickMenu="showRightClickMenu" @shiftActiveCells="shiftActiveCells"
                    @cancelAllActive="cancelAllActive" ref="cells" class="wtc_roster-table-right-group-roster-wrap"
                    v-for="(orgRoster, index4) in orgRosterData.adminOrgRosterList" :key="index4"
                    :groupId="orgRosterData.id" :rowNum="index3" :rowIndex="index3" :colIndex="index4"
                    :cellRoster="orgRoster" :lockPower="allRosterData.lockPower" :savePower="allRosterData.savePower"
                    :cellType="'org'">
                </cell>
            </ul>

            <ul class="wtc_roster-table-right-data-list">
                <li class="wtc_roster-table-right-data-item" v-for="(rosterData, index) in rosterShiftModelList[index3]"
                    :key="index" :personId="rosterData.rosterPerson.id">
                    <ul class="wtc_roster-table-right-plan-list"
                        :style="{'height': allRosterData.showType === 'SHOW_REAL' || allRosterData.showType === 'SHOW_PLAN' ? '60px' : '30px'}"
                        v-show="allRosterData.showType === 'SHOW_ALL' || allRosterData.showType === 'SHOW_PLAN'">
                        <cell class="wtc_roster-table-right-plan-roster-wrap"
                            v-for="(planRoster, index1) in rosterData.planRosterList" :key="index1"
                            :cellRoster="planRoster" :lockPower="allRosterData.lockPower"
                            :savePower="allRosterData.savePower" :cellType="'orgPerson'">
                        </cell>
                    </ul>
                    <ul class="wtc_roster-table-right-actual-list"
                        :style="{'height': allRosterData.showType === 'SHOW_REAL' || allRosterData.showType === 'SHOW_PLAN' ? '60px' : '30px'}"
                        v-show="allRosterData.showType === 'SHOW_ALL' || allRosterData.showType === 'SHOW_REAL'">
                        <cell class="wtc_roster-table-right-actual-roster-wrap"
                            v-for="(actualRoster, index1) in rosterData.realRosterList" :key="index1"
                            :cellRoster="actualRoster" :lockPower="allRosterData.lockPower"
                            :savePower="allRosterData.savePower" :cellType="'orgPerson'">
                        </cell>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
    import cell from "../cell/cell.vue";

    export default {
        name: "rosterCells",
        components: { cell },
        props: ['allRosterData'],
        inject: ['model', 'KDApi', 'themeNum', 'myTool'],

        data() {
            return {
                rosterShiftModelList: [],
                rightWidth: 'calc(100% - 230px - 40px)',
                copyShiftId: null,
                copyShiftBoId: null,
                isCtrl: false,
                isShift: false,
                arrshiftStratCell: [0, 0],  // shift选中的起始单元格：[行序号，列序号]
                arrshiftEndCell: [],  // shift选中的结束单元格：[行序号，列序号]
                arrInsertShift: [],
            };
        },

        mounted() {
            this.initRosterShiftModelList(this.allRosterData.rosterAdminOrgModelsList.length);
            this.getInsertShift(this.allRosterData.shiftInfoMap.all);
        },

        watch: {
            'allRosterData.showType': function (newValue) {
                this.showRoster(newValue);
            },
            'allRosterData.rosterAdminOrgModelsList': function (newValue) {
                this.initRosterShiftModelList(newValue.length)
            },
            'allRosterData.shiftInfoMap.all': function (newValue) {
                this.getInsertShift(newValue);
            }
        },

        methods: {
            initRosterShiftModelList(orgRosterLen) {
                this.rosterShiftModelList = [];
                for (let i = 0; i < orgRosterLen; i++) {
                    this.rosterShiftModelList.push([]);
                }
            },

            /*
            * 根据showType的不同，选中的单元格需要调整
            * */
            showRoster(showType) {
                if (showType === 'SHOW_ALL') return;

                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];
                    if (cell.active) {
                        switch (showType) {
                            case 'SHOW_PLAN':
                                if (cell.cellType !== 'plan') cell.active = false;
                                break;
                            case 'SHOW_REAL':
                                if (cell.cellType !== 'actual') cell.active = false;
                                break;
                            case 'SHOW_NO':
                                cell.active = false;
                                break;
                        }
                    }
                }
            },

            tableScroll(scrollLeft) {
                this.$refs.rightGroupList.scrollLeft = scrollLeft;
            },

            keydownHandle(e) {
                const $this = this;
                // 有弹窗，同时又不是循环排班预览页时，不执行键盘事件：(0循环排班，1排班管理)
                if (document.querySelector('#dialogShow') && $this.allRosterData.type === 1) return;

                // 如果切换到其他页面，也不执行键盘事件：
                if ($this.$root.$el.offsetWidth === 0) return;

                // ctrl shift功能
                if (e.ctrlKey && !e.shiftKey) $this.isCtrl = true;
                if (!e.ctrlKey && e.shiftKey) {
                    $this.isShift = true;
                    //todo 这样写严重影响性能： $($this.rootDom).css('userSelect', 'none');
                }
                if (!$this.isCtrl && !$this.isShift) {
                    // 复制功能：
                    if (e.keyCode === 67) {
                        $this.copyShift();
                    }
                    // 黏贴功能：
                    if (e.keyCode === 86) {
                        $this.parseShift_event()
                    }
                    // 删除功能（行政组织排班、循环排班无删除功能）：
                    // if (e.keyCode === 46 && $this.rosterData.type !== 0) {
                    //     $this.delShift_event()
                    // }
                    if (e.keyCode === 46 && $this.allRosterData.rosterview !== 'taborg' && $this.allRosterData.type !== 0) {
                        $this.delShift_event()
                    }
                }
            },

            cancelAllActive() {
                this.$refs.cells.forEach((cell) => {
                    cell.active = false;
                });
            },

            shiftActiveCells() {
                const $this = this;
                let tempRow = null;

                //行从小到大排序：
                if ($this.arrshiftStratCell[0] > $this.arrshiftEndCell[0]) {
                    tempRow = $this.arrshiftStratCell[0];
                    $this.arrshiftStratCell[0] = $this.arrshiftEndCell[0];
                    $this.arrshiftEndCell[0] = tempRow;
                }
                //列从小到大排序：
                if ($this.arrshiftStratCell[1] > $this.arrshiftEndCell[1]) {
                    tempRow = $this.arrshiftStratCell[1];
                    $this.arrshiftStratCell[1] = $this.arrshiftEndCell[1];
                    $this.arrshiftEndCell[1] = tempRow;
                }

                this.$refs.cells.forEach((cell) => {
                    // 先判断是否在行列矩阵内：
                    if (cell.rowNum >= $this.arrshiftStratCell[0] && cell.rowNum <= $this.arrshiftEndCell[0] && cell.colIndex >= $this.arrshiftStratCell[1] && cell.colIndex <= $this.arrshiftEndCell[1]) {
                        // 再判断该单元格是否冻结：
                        if (!cell.isFrozen) {
                            // 再判断是显示计划，还是实际：
                            switch ($this.allRosterData.showType) {
                                case 'SHOW_PLAN':
                                    if (cell.cellType === 'plan') cell.active = true;
                                    break;
                                case 'SHOW_REAL':
                                    if (cell.cellType === 'actual') cell.active = true;
                                    break;
                                case 'SHOW_ALL':
                                    cell.active = true;
                                    break;
                            }
                        }
                    }
                });
            },

            /*
            * 行批量操作
            * */
            rowCellActive(personIndex, clientX, clientY) {
                this.batchCellActive('row', personIndex, clientX, clientY)
            },

            /*
            * 列批量操作
            * */
            colCellActive(dateIndex, clientX, clientY) {
                this.batchCellActive('col', dateIndex, clientX, clientY)
            },

            /*
            * 批量操作
            * */
            batchCellActive(type, index, clientX, clientY) {
                // 清除所有选中的单元格
                this.cancelAllActive();

                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];
                    let batchIndex = type === 'row' ? cell.rowIndex : cell.colIndex;
                    // 找出符合index条件，且未被冻结的cell：
                    if (batchIndex === index && !cell.isFrozen) {
                        switch (this.allRosterData.showType) {
                            case 'SHOW_ALL':
                                cell.active = true;
                                break;
                            case 'SHOW_PLAN':
                                if (cell.cellType === 'plan') cell.active = true;
                                break;
                            case 'SHOW_REAL':
                                if (cell.cellType === 'actual') cell.active = true;
                                break;
                        }
                    }
                }

                // 打开右键菜单
                this.showRightClickMenu(clientX + 2, clientY + 2)
            },

            /*
            * 显示右键菜单
            * */
            showRightClickMenu(positionX, positionY) {
                let $this = this;
                let inputFlag = true;
                let objDisabled = this.rightMenuDisabled();

                let htmlStr = `
               <div class="wtc_roster_rightClickMenu-item" style="padding:10px;color:#333;min-width: 200px;height: 259px;background:#f2f2f2;box-sizing: border-box;cursor: auto;overflow: hidden;">
                    <div class="wtc_roster_rightClickMenu-input-wrap" style="width: 100%;background: #fff;border: 1px solid #eee;margin-bottom: 10px;padding:6px;;box-sizing: border-box">
                        <i class="wtc_roster_rightClickMenu-input-icon kdfont kdfont-sousuo2" style="font-size: 14px;color:#999;margin-right: 4px;vertical-align:sub;"></i>
                        <input type="text" class="wtc_roster_rightClickMenu-input" style="outline: none;border: none;width:140px;color:#333;font-size: 12px;" placeholder="${this.KDApi.getLangMsg(this.model, 'placeholder1')}">
                    </div>
                    <ul class="wtc_roster_rightClickMenu-shift-list" style="width: 220px;max-height: 200px;overflow-y: auto;overflow-x: hidden;margin-left: 6px;box-sizing: border-box"></ul>
                </div>
            `;
                // 组织右键菜单数据：
                let menuData = {
                    themeColor: this.themeNum,
                    positionX: positionX,
                    positionY: positionY,
                    data: [
                        [  // 组
                            {
                                value: this.KDApi.getLangMsg(this.model, 'insertShift'),
                                iconLeft: 'kdfont kdfont-charubanci',
                                iconRight: 'kdfont kdfont-houfan',
                                disabled: objDisabled.insert,
                                index: 1,
                                isHtml: false,
                                children: [[
                                    {
                                        value: htmlStr,
                                        isHtml: true,
                                    },
                                ]]
                            },
                            {
                                value: this.KDApi.getLangMsg(this.model, 'copyShift'),
                                iconLeft: 'kdfont kdfont-fuzhi4',
                                iconRight: '',
                                disabled: objDisabled.copy,
                                index: 2,
                                isHtml: false,
                                children: []
                            },
                            {
                                value: this.KDApi.getLangMsg(this.model, 'parseShift'),
                                iconLeft: 'kdfont kdfont-zhantie2',
                                iconRight: '',
                                disabled: objDisabled.parse,
                                index: 3,
                                isHtml: false,
                                children: []
                            },
                            {
                                value: this.KDApi.getLangMsg(this.model, 'delShift'),
                                iconLeft: 'kdfont kdfont-shanchu7',
                                iconRight: '',
                                disabled: objDisabled.del,
                                index: 4,
                                isHtml: false,
                                children: []
                            },
                            {
                                value: this.KDApi.getLangMsg(this.model, 'lock'),
                                iconLeft: 'kdfont kdfont-suo16',
                                iconRight: '',
                                disabled: objDisabled.lock,
                                index: 5,
                                isHtml: false,
                                children: []
                            },
                            {
                                value: this.KDApi.getLangMsg(this.model, 'unlock'),
                                iconLeft: 'kdfont kdfont-jiesuo3',
                                iconRight: '',
                                disabled: objDisabled.unlock,
                                index: 6,
                                isHtml: false,
                                children: []
                            },
                        ],
                    ],
                    callback: function (index) {
                        switch (index) {
                            case '2':  // 复制
                                $this.copyShift();
                                break;
                            case '3':  // 黏贴
                                $this.parseShift_event();
                                break;
                            case '4':  // 删除
                                $this.delShift_event();
                                break;
                            case '5':  // 锁定
                                $this.lockShift_event();
                                break;
                            case '6':  // 解锁
                                $this.unlockShift_event();
                                break;
                        }
                    }
                };

                let dom_menu = this.myTool.rightClickMenu(menuData);

                let $dom_menuItem = $('.wtc_kztTool_rightClickMenu-item', dom_menu);
                let $dom_menuInput = $('.wtc_roster_rightClickMenu-input', dom_menu);
                let $dom_shiftList = $('.wtc_roster_rightClickMenu-shift-list', dom_menu);

                // 排班控件右键菜单个性化样式：
                $('.wtc_kztTool_rightClickMenu-group', $dom_menuItem[0]).css({ 'boxShadow': 'none', 'width': 'auto' });

                // 阻止一点击就隐藏菜单的事件：
                $('.wtc_roster_rightClickMenu-item', dom_menu).on('mousedown', function (event) {
                    event.stopPropagation();
                });

                // 插入班次按钮点击事件：
                $dom_shiftList.click(function (event) {
                    // 判断点击的目标：
                    let target = event.target;
                    while (target.className !== 'wtc_roster_rightClickMenu-shift-item') {
                        target = target.parentElement;
                    }

                    $this.insertShiftId = target.getAttribute('shiftId');
                    $this.insertShiftBoId = target.getAttribute('shiftBoId');
                    $this.insertShift_event($this.insertShiftId, $this.insertShiftBoId, 'insert');

                    // 关闭菜单
                    dom_menu.parentElement.removeChild(dom_menu);
                });

                // 插入班次弹窗中的输入框输入事件：
                $dom_menuInput.on('input', function () {
                    setTimeout(function () {
                        if (inputFlag) {
                            $this.menuInputMatch();
                        }
                    }, 0)
                });
                // 监听汉字输入
                $dom_menuInput.on('compositionstart', function () {
                    inputFlag = false;
                });
                $dom_menuInput.on('compositionend', function () {
                    inputFlag = true;
                });

                // 当“插入班次”非禁止时，滑入“插入班次”向后端发事件，获取当前班次数据：
                if ($dom_menuItem[0].getAttribute('disabled') === 'false') {
                    $($dom_menuItem[0]).on('mouseenter', function () {
                        if (!$dom_shiftList.html()) { // 如果是第一次，则需加载班次
                            $this.refreshMenuShiftList($this.arrInsertShift);
                        }
                    });
                }
            },

            /*
            * 判断右键菜单中选项是否禁用
            * */
            rightMenuDisabled() {
                let $this = this;

                let objDisabled = {
                    copy: false,
                    insert: false,
                    parse: false,
                    del: false,
                    lock: false,
                    unlock: false,
                };

                let existShift = false;
                let shiftAllLock = true;
                let shiftAllUnLock = true;
                let allPlan = true;
                let activeNum = 0;

                this.$refs.cells.forEach((cell) => {
                    if (cell.active) {
                        activeNum++;

                        //选中的单元格数量不等于1或者不存在班次，则复制功能不可用
                        if (activeNum !== 1) {
                            objDisabled.copy = true;
                        } else {
                            cell.cellRoster.shiftId ? objDisabled.copy = false : objDisabled.copy = true;
                        }

                        // 判断是否是全计划班：
                        if (cell.cellType !== 'plan') {
                            allPlan = false
                        }

                        // 判断单元格中是锁定还是解锁：
                        if (cell.cellRoster.lock) {
                            shiftAllUnLock = false;
                        } else {
                            shiftAllLock = false;
                        }
                        // 判断单元格中是否存在班次：
                        if (cell.cellRoster.shiftId) {
                            existShift = true;
                        }
                    }
                });

                // 判断是否存在已复制班次(是否禁用黏贴)：
                if (!$this.copyShiftId) objDisabled.parse = true;

                // 判断删除按钮是否禁用（所有选中单元格不存在班次则禁用）
                if (!existShift) {
                    objDisabled.del = true;
                    objDisabled.lock = true;
                }
                // 判断锁定按钮是否禁用
                if (shiftAllLock) {
                    objDisabled.del = true;
                    objDisabled.lock = true;
                    objDisabled.insert = true;
                    objDisabled.parse = true;
                }
                // 判断解锁按钮是否禁用
                if (shiftAllUnLock) objDisabled.unlock = true;


                if (allPlan) {
                    // 判断是否有锁定，解锁的权限（系统锁只针对计划班，且锁定后不允许解锁，同样解锁后不允许锁定）：
                    // if (!this.rosterData.lockPower) objDisabled.lock = true;  // 无锁定权限，则锁定按钮置灰
                    // if (!this.rosterData.unlockPower) objDisabled.unlock = true;  // 无解锁权限，则解锁按钮置灰

                    // 计划班不允许删除：
                    objDisabled.del = true;
                }

                //行政组织，删除班次按钮禁用：
                if (this.allRosterData.rosterview === 'taborg') {
                    objDisabled.del = true;
                }

                //右键菜单按钮控权：
                if (!this.allRosterData.insertPower) objDisabled.insert = true;  // 无插入权限，则锁定按钮置灰
                if (!this.allRosterData.copyPower) objDisabled.copy = true;  // 无复制权限，则锁定按钮置灰
                if (!this.allRosterData.parsePower) objDisabled.parse = true;  // 无黏贴权限，则锁定按钮置灰
                if (!this.allRosterData.delPower) objDisabled.del = true;  // 无删除权限，则锁定按钮置灰
                if (!this.allRosterData.lockPower) objDisabled.lock = true;  // 无锁定权限，则锁定按钮置灰
                if (!this.allRosterData.unlockPower) objDisabled.unlock = true;  // 无解锁权限，则解锁按钮置灰

                if (this.allRosterData.type === 0) {  //循环排班
                    objDisabled.lock = true;
                    objDisabled.unlock = true;
                    objDisabled.del = true;
                }

                return objDisabled;
            },

            /*
            * 右键菜单-鼠标滑入插入班次-加载班次列表数据
            * */
            refreshMenuShiftList(shiftList) {
                let $this = this;
                let shiftStr = '';
                let shiftInfo = shiftList;
                let curActiveCell;

                // 判断选中的单元格有几个，一个时需要对班次列表做过滤
                let activeCellNum = 0;
                for (let j = 0; j < this.$refs.cells.length; j++) {
                    if (this.$refs.cells[j].active) {
                        activeCellNum++;
                        if (activeCellNum === 1) {
                            curActiveCell = this.$refs.cells[j].cellRoster;
                        }
                    }
                }
                if (activeCellNum === 1) {
                    shiftInfo = this.getFilterShiftList(shiftList, curActiveCell);
                }

                for (let i = 0; i < shiftInfo.length; i++) {
                    let title = shiftInfo[i].number + '_' + shiftInfo[i].name + '&#10;&#10;';

                    if (shiftInfo[i].shiftEntryList) {
                        for (let n = 0; n < shiftInfo[i].shiftEntryList.length; n++) {
                            let objShiftEntry = shiftInfo[i].shiftEntryList[n];
                            let outWorkType = null;
                            switch (objShiftEntry.outWorkType) {
                                case 'W':
                                    outWorkType = $this.KDApi.getLangMsg($this.model, 'work');
                                    break;
                                case 'O':
                                    outWorkType = $this.KDApi.getLangMsg($this.model, 'overtime');
                                    break;
                                case 'B':
                                    outWorkType = $this.KDApi.getLangMsg($this.model, 'rest');
                                    break;
                                case 'S':
                                    outWorkType = $this.KDApi.getLangMsg($this.model, 'workMain');
                                    break;
                                default:
                                    outWorkType = $this.KDApi.getLangMsg($this.model, 'work');
                                    break;
                            }
                            title += `${outWorkType}：${objShiftEntry.shiftStartDateStr} ~ ${objShiftEntry.shiftEndDateStr}（${objShiftEntry.workTime}h）&#10;`;
                        }
                    }

                    shiftStr += `
                        <li class="wtc_roster_rightClickMenu-shift-item" style="display:flex;padding:4px 0;cursor: pointer" shiftId="${shiftInfo[i].id}" shiftBoId="${shiftInfo[i].boId}">
                            <div class="wtc_roster_rightClickMenu-item-color" style="flex:0 0 16px;width:16px;height:16px;background: ${shiftInfo[i].shiftColor};margin-right: 6px;border-radius: 2px;"></div>
                            <div class="wtc_roster_rightClickMenu-item-text-wrap" title="${title}" style="flex:1;font-size: 12px;color:#333;white-space: nowrap;">
                                <div class="wtc_roster_rightClickMenu-item-number" style="display:inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width:60px;">${shiftInfo[i].number}</div>
                                <div class="wtc_roster_rightClickMenu-item-text" style="display:inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width:120px;">_${shiftInfo[i].name}</div>
                            </div>
                        </li>
                        `;
                }
                let $dom_shiftList = $('.wtc_roster_rightClickMenu-shift-list');
                $dom_shiftList.html(shiftStr);

                $('.wtc_roster_rightClickMenu-shift-item', $dom_shiftList).on('mouseenter', function () {
                    $(this).css('background', '#e5e5e5');
                }).on('mouseleave', function () {
                    $(this).css('background', 'initial');
                });

                this.menuInputMatch();
            },

            /*
            * 需要判断单元格排班的时间是否在生效时间与失效时间之内
            * */
            getFilterShiftList(shiftList, curActiveCell) {
                let shiftInfo = [];
                for (let i = 0; i < shiftList.length; i++) {
                    if (shiftList[i].firstBsed <= curActiveCell.rosterDate && shiftList[i].endBsled >= curActiveCell.rosterDate) {
                        shiftInfo.push(shiftList[i]);
                    }
                }
                return shiftInfo;
            },

            /*
            * 获取插入班次中显示的班次数据
            * */
            getInsertShift(arrInsertShiftId) {
                this.arrInsertShift = [];
                for (let i = 0; i < arrInsertShiftId.length; i++) {
                    let shiftId = arrInsertShiftId[i];
                    for (let j = 0; j < this.allRosterData.shiftModelList.length; j++) {
                        let objShift = this.allRosterData.shiftModelList[j];
                        if (objShift.id === shiftId) {
                            this.arrInsertShift.push(objShift);
                            break;
                        }
                    }
                }
            },

            /*
            * 右键菜单中显示班次与用户输入的匹配
            * */
            menuInputMatch() {
                let $dom_menuInput = $('.wtc_roster_rightClickMenu-input');
                let value = $dom_menuInput.val();
                let $dom_shiftItem = $('.wtc_roster_rightClickMenu-item-text-wrap');
                $dom_shiftItem.each(function () {
                    if (this.innerText.includes(value)) {
                        this.parentElement.style.display = 'flex'
                    } else {
                        this.parentElement.style.display = 'none'
                    }
                })
            },


            /*
            * 插入班次
             * */
            insertShift_event(shiftId, shiftBoId, type) {
                let arrRowIndex = [];
                let arrColIndex = [];
                let arrShiftId = [];
                let arrShiftBoId = [];

                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];
                    // 当该单元格没有被锁，则可以插入
                    if (cell.active && !cell.cellRoster.lock) {
                        arrRowIndex.push(cell.rowIndex);
                        arrColIndex.push(cell.colIndex);
                        arrShiftId.push(shiftId);
                        arrShiftBoId.push(shiftBoId);
                    }
                }

                // 修改数据：
                this.getRosterData_org(type, arrRowIndex, arrColIndex, arrShiftId, arrShiftBoId);

                // this.opPower({
                //     power: true,
                //     opType: '1'
                // });
            },

            /*
            * 黏贴班次
            * */
            parseShift_event() {
                if (!this.copyShiftId) {
                    this.myTool.message({
                        type: 'warn',
                        message: this.KDApi.getLangMsg(this.model, 'msg3')
                    });
                    return;
                }

                this.insertShift_event(this.copyShiftId, this.copyShiftBoId, 'parse');

                // this.opPower({
                //     power: true,
                //     opType: '3'
                // });
            },

            /*
           * 删除班次
           * */
            delShift_event() {
                let arrRowIndex = [];
                let arrColIndex = [];
                let arrShiftId = [];
                let arrShiftBoId = [];

                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];
                    // 1.当该单元格存在班次，且没有被锁；2.计划班不允许删;
                    if (cell.active && !cell.cellRoster.lock && cell.cellRoster.shiftId) {
                        arrRowIndex.push(cell.rowIndex);
                        arrColIndex.push(cell.colIndex);
                    }
                }

                // 修改数据：
                this.getRosterData_org('del', arrRowIndex, arrColIndex, arrShiftId, arrShiftBoId);

                // this.opPower({
                //     power: true,
                //     opType: '4'
                // });
            },

            /*
            * 锁定班次
            * */
            lockShift_event() {
                let arrRowIndex = [];
                let arrColIndex = [];
                let arrShiftId = [];
                let arrShiftBoId = [];

                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];

                    // 1.判断是否有锁权限； 2.有权限则当该单元格没有被锁，则加锁
                    if (!cell.active || cell.cellRoster.lock || !this.allRosterData.lockPower) continue;

                    arrRowIndex.push(cell.rowIndex);
                    arrColIndex.push(cell.colIndex);
                }

                // 修改数据：
                this.getRosterData_org('lock', arrRowIndex, arrColIndex, arrShiftId, arrShiftBoId);

                // this.opPower({
                //     power: true,
                //     opType: '5'
                // });
            },

            /*
            * 解锁班次
            * */
            unlockShift_event() {
                let arrRowIndex = [];
                let arrColIndex = [];
                let arrShiftId = [];
                let arrShiftBoId = [];

                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];

                    // 1.判断是否有解锁权限（只针对计划班）； 2.有权限当该单元格被锁，则解锁
                    if (!cell.active || !cell.cellRoster.lock || !this.allRosterData.unlockPower) continue;

                    arrRowIndex.push(cell.rowIndex);
                    arrColIndex.push(cell.colIndex);
                }

                // 修改数据：
                this.getRosterData_org('unlock', arrRowIndex, arrColIndex, arrShiftId, arrShiftBoId);

                // this.opPower({
                //     power: true,
                //     opType: '6'
                // });
            },


            /*
            * 复制排班
            * */
            copyShift() {
                let activeCellNum = 0;
                let copyShiftId = this.copyShiftId;
                let copyShiftBoId = this.copyShiftBoId;

                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];
                    if (cell.active) {
                        activeCellNum++;
                        if (activeCellNum > 1) break;
                        copyShiftId = cell.cellRoster.shiftId;
                        copyShiftBoId = cell.cellRoster.shiftBoId;
                    }
                }

                // 判断复制的单元格是否就一个
                if (activeCellNum !== 1) {
                    this.myTool.message({
                        type: 'warn',
                        message: this.KDApi.getLangMsg(this.model, 'msg5')
                    });
                    return;
                }

                this.copyShiftId = copyShiftId;
                this.copyShiftBoId = copyShiftBoId;
            },

            /*
            * 插入班次
            * */
            insertShift(shiftId, shiftBoId) {
                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];
                    if (cell.active && !cell.cellRoster.lock) {
                        this.refreshRosterData('insert', cell, shiftId, shiftBoId);

                        // // 获取当前单元格的前后单元格（判断时段重叠必须是同一行的单元格）
                        // let preCell = this.$refs.cells[i - 1] && this.$refs.cells[i - 1].rowNum === cell.rowNum ? this.$refs.cells[i - 1] : null;
                        // let nextCell = this.$refs.cells[i + 1] && this.$refs.cells[i + 1].rowNum === cell.rowNum ? this.$refs.cells[i + 1] : null;
                        // // 标识班次时段重叠的排班：
                        // this.shiftTimeOverLap('insert', preCell, cell, nextCell);
                    }
                }
            },

            /*
            * 删除班次
            * */
            delShift() {
                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];
                    // 1.当该单元格存在班次，且没有被锁；2.计划班不允许删
                    if (cell.active && !cell.cellRoster.lock && cell.cellRoster.shiftId) {
                        this.refreshRosterData('del', cell, null, null);

                        // // 获取当前单元格的前后单元格（判断时段重叠必须是同一行的单元格）
                        // let preCell = this.$refs.cells[i - 1] && this.$refs.cells[i - 1].rowNum === cell.rowNum ? this.$refs.cells[i - 1] : null;
                        // let nextCell = this.$refs.cells[i + 1] && this.$refs.cells[i + 1].rowNum === cell.rowNum ? this.$refs.cells[i + 1] : null;
                        // // 取消班次时段重叠的排班：
                        // this.shiftTimeOverLap('del', preCell, cell, nextCell);
                    }
                }
            },

            /*
            * 锁定班次
            * */
            lockShift() {
                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];
                    // 1.判断是否有锁权限； 2.有权限则当该单元格没有被锁，则加锁
                    if (!cell.active || cell.cellRoster.lock || !this.allRosterData.lockPower) continue;

                    this.refreshRosterData('lock', cell, null, null);
                }
            },

            /*
            * 解决班次
            * */
            unlockShift() {
                for (let i = 0; i < this.$refs.cells.length; i++) {
                    let cell = this.$refs.cells[i];

                    // 1.判断是否有解锁权限（只针对计划班）； 2.有权限当该单元格被锁，则解锁
                    if (!cell.active || !cell.cellRoster.lock || !this.allRosterData.unlockPower) continue;

                    this.refreshRosterData('unlock', cell, null, null);
                }
            },


            /*
            * 判断当前班次时段与后一天是否存在重叠，存在则把存在的单元格添加标识
            * */
            shiftTimeOverLap(type, preCell, curCell, nextCell) {
                // 取消当前单元格重叠标志：
                curCell.overlap = false;
                curCell.overlapNext = false;

                // 先取消前一天排班重叠标注：
                if (preCell) preCell.overlap = false;
                // 再取消后一天排班重叠标注：
                if (nextCell) nextCell.overlapNext = false;

                if (type === 'insert') {
                    // 判断当前排班与后一天是否重叠：
                    this.isOverlap(curCell, nextCell);
                    // 判断前一天排班与它的后一天是否重叠（主体为前一天）：
                    this.isOverlap(preCell, curCell);
                }
            },

            isOverlap(curCell, nextCell) {
                if (!curCell || !nextCell) return;

                let curShiftData = this.getShiftModel(curCell.cellRoster.shiftId);
                let nextShiftData = this.getShiftModel(nextCell.cellRoster.shiftId);

                // 该班次不存在时间段，则一定不会重叠：
                if (!curShiftData || !curShiftData.shiftEntryList || !curShiftData.shiftEntryList[0]) return;
                if (!nextShiftData || !nextShiftData.shiftEntryList || !nextShiftData.shiftEntryList[0]) return;

                // 获取当天排班时段总体时间，看看是否大于24小时：
                let totalWorkTime = 0;
                curShiftData.shiftEntryList.forEach(function (item) {
                    totalWorkTime += item.workTime;
                });

                let startTime_cur = curShiftData.shiftEntryList[0].shiftStartDate;
                let endTime_cur = curShiftData.shiftEntryList[curShiftData.shiftEntryList.length - 1].shiftEndDate;

                // 当排班时间小于24，只有 startTime_cur > endTime_cur 才存在下班时间是第二天的情况：
                if (totalWorkTime < 24 && startTime_cur < endTime_cur) return;

                let startTime_next = nextShiftData.shiftEntryList[0].shiftStartDate;
                // 判断后一天和当前天是否存在重叠：
                if (startTime_next < endTime_cur) {
                    // 后一天存在重叠：
                    curCell.overlap = true;
                    nextCell.overlapNext = true;
                }
            },

            /*
            * 用户操作后，同步最新数据到rosterData（行政组织）
            * */
            getRosterData_org(type, arrGroupIndex, arrColIndex, arrShiftId, arrShiftBoId) {
                let arrPara = [];

                for (let i = 0; i < arrGroupIndex.length; i++) {
                    let groupId = this.allRosterData.rosterAdminOrgModelsList[arrGroupIndex[i]].id;
                    let rosterList = this.allRosterData.rosterAdminOrgModelsList[arrGroupIndex[i]].adminOrgRosterList;
                    let opType = null;
                    let objRoster_copy = JSON.parse(JSON.stringify(rosterList[arrColIndex[i]]));

                    switch (type) {
                        case 'insert':
                            //需要替换原数据中的saveType和shiftModel的值
                            if (objRoster_copy.hasRoster === false) {
                                objRoster_copy.saveType = '2';
                            } else {
                                if (objRoster_copy.rosterSource === '1') {
                                    objRoster_copy.saveType = '2';
                                } else {
                                    objRoster_copy.saveType = '3';
                                }
                            }
                            objRoster_copy.shiftId = arrShiftId[i];
                            objRoster_copy.shiftBoId = arrShiftBoId[i];
                            opType = '1';
                            break;
                        case 'copy':
                            opType = '2';
                            break;
                        case 'parse':
                            //需要替换原数据中的saveType和shiftModel的值
                            if (objRoster_copy.hasRoster === false) {
                                objRoster_copy.saveType = '2';
                            } else {
                                if (objRoster_copy.rosterSource === '1') {
                                    objRoster_copy.saveType = '2';
                                } else {
                                    objRoster_copy.saveType = '3';
                                }
                            }
                            objRoster_copy.shiftId = arrShiftId[i];
                            objRoster_copy.shiftBoId = arrShiftBoId[i];
                            opType = '3';
                            break;
                        case 'del':
                            if (objRoster_copy.hasRoster === false) {
                                objRoster_copy.saveType = '1';
                            } else {
                                if (objRoster_copy.rosterSource === '1') {
                                    objRoster_copy.saveType = '2';
                                } else {
                                    objRoster_copy.saveType = '3';
                                }
                            }
                            objRoster_copy.shiftId = null;
                            objRoster_copy.shiftBoId = null;
                            opType = '4';
                            break;
                        case 'lock':
                            if (objRoster_copy.hasRoster) {
                                if (objRoster_copy.rosterSource === '1') {
                                    objRoster_copy.saveType = '2';
                                } else {
                                    objRoster_copy.saveType = '3';
                                }
                            }
                            objRoster_copy.lock = true;
                            opType = '5';
                            break;
                        case 'unlock':
                            if (objRoster_copy.hasRoster) {
                                if (objRoster_copy.rosterSource === '1') {
                                    objRoster_copy.saveType = '2';
                                } else {
                                    objRoster_copy.saveType = '3';
                                }
                            }
                            objRoster_copy.lock = false;
                            opType = '6';
                            break;
                    }

                    arrPara.push({
                        type: 'taborg',
                        adminOrgId: groupId,
                        opType: opType,
                        rosterInfoModel: objRoster_copy
                    });
                }

                if (arrPara.length > 0) {
                    this.$parent.$parent.$parent.showLoading = true;
                    console.log(arrPara);
                    this.model.invoke('changeShift', arrPara);
                }
            },

            /*
            * 用户操作后，同步最新数据到rosterData
            * */
            refreshRosterData(type, cell, shiftId, shiftBoId) {
                switch (type) {
                    case 'insert':
                    case 'parse':
                        //需要替换原数据中的saveType和shiftModel的值
                        if (cell.cellRoster.hasRoster === false) {
                            cell.cellRoster.saveType = '2';
                        } else {
                            if (cell.cellRoster.rosterSource === '1') {
                                cell.cellRoster.saveType = '2';
                            } else {
                                cell.cellRoster.saveType = '3';
                            }
                        }
                        // 只要所有修改或者增加属性的语句都使用this.$set() ，就能解决 v-if 无法响应对象中动态变化的属性的问题。
                        this.$set(cell.cellRoster, 'shiftId', shiftId);
                        this.$set(cell.cellRoster, "shiftBoId", shiftBoId);
                        break;
                    case 'del':
                        if (cell.cellRoster.hasRoster === false) {
                            cell.cellRoster.saveType = '1';
                        } else {
                            if (cell.cellRoster.rosterSource === '1') {
                                cell.cellRoster.saveType = '2';
                            } else {
                                cell.cellRoster.saveType = '3';
                            }
                        }
                        // 只要所有修改或者增加属性的语句都使用this.$set() ，就能解决 v-if 无法响应对象中动态变化的属性的问题。
                        this.$set(cell.cellRoster, "shiftId", null);
                        this.$set(cell.cellRoster, "shiftBoId", null);
                        break;
                    case 'lock':
                        if (cell.cellRoster.hasRoster) {
                            if (cell.cellRoster.rosterSource === '1') {
                                cell.cellRoster.saveType = '2';
                            } else {
                                cell.cellRoster.saveType = '3';
                            }
                        }
                        cell.cellRoster.lock = true;
                        break;
                    case 'unlock':
                        if (cell.cellRoster.hasRoster) {
                            if (cell.cellRoster.rosterSource === '1') {
                                cell.cellRoster.saveType = '2';
                            } else {
                                cell.cellRoster.saveType = '3';
                            }
                        }
                        cell.cellRoster.lock = false;
                        break;
                }
            },

            /*后端调用：判断是否右键菜单有权限操作*/
            opPower(args) {
                if (args.power) {
                    switch (args.opType) {
                        case '1':  //插入
                            this.insertShift(this.insertShiftId, this.insertShiftBoId);
                            break;
                        case '2':  //复制
                            this.copyShift();
                            break;
                        case '3':  //黏贴
                            this.insertShift(this.copyShiftId, this.copyShiftBoId);
                            break;
                        case '4':  //删除
                            this.delShift();
                            break;
                        case '5':  //锁定
                            this.lockShift();
                            break;
                        case '6':  //解锁
                            this.unlockShift();
                            break;
                    }
                }
            },

            /*
           * 后端点击保存，返回当前排班数据
           * */
            saveRoster() {
                this.model.invoke('save');
            },

            timeOverlap(arrOverlapRoster) {
                //将时段重叠的单元格标红框：
                for (let j = 0; j < this.$refs.cells.length; j++) {
                    let cell = this.$refs.cells[j];
                    cell.overlap = false;
                    for (let i = 0; i < arrOverlapRoster.length; i++) {
                        if (cell.groupId === arrOverlapRoster[i].adminOrgId && cell.cellRoster.rosterDateStr === arrOverlapRoster[i].rosterDate) {
                            arrOverlapRoster.splice(i, 1);
                            cell.overlap = true;
                            break;
                        }
                    }
                }
            },

            /*获取班次id对应的班次对象*/
            getShiftModel(shiftId) {
                // 初始化shiftId对应的shiftModel：
                for (let i = 0; i < this.$root.rosterData.shiftModelList.length; i++) {
                    if (this.$root.rosterData.shiftModelList[i].id === shiftId) {
                        return this.$root.rosterData.shiftModelList[i];
                    }
                }
            },
        }
    };
</script>

<style scoped>
    .wtc_roster-table-right-group-list {
        display: inline-block;
        background-color: #fff;
        box-sizing: border-box;
        z-index: 5;
        vertical-align: top;
        /*width: calc(((100% - 230px) - 40px) - 0px);*/
        overflow: hidden;
    }

    .wtc_roster-table-right-group-list .wtc_roster-table-right-group-row {
        display: flex;
        box-sizing: border-box;
        height: 30px;
    }

    .wtc_roster-table-right-group-list .wtc_roster-table-right-group-row .wtc_roster-table-right-group-roster-wrap {
        flex: 1;
        height: 30px;
        min-width: 150px;
        border-right: 1px solid #D9D9D9;
        border-bottom: 1px solid #D9D9D9;
        box-sizing: border-box;
        background-color: #fff;
    }

    .wtc_roster-table-right-data-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 60px;
    }

    .wtc_roster-table-right-group-list .wtc_roster-table-right-data-item>ul {
        display: flex;
    }

    .wtc_roster-table-right-group-list .wtc_roster-table-right-data-item .wtc_roster-table-right-plan-list {
        box-sizing: border-box;
    }

    .wtc_roster-table-right-data-item .wtc_roster-table-right-actual-list>li {
        border-bottom: 1px solid #D9D9D9;
    }


    .wtc_roster-table-right-actual-list .wtc_roster-table-right-actual-roster-wrap {
        border-bottom: 1px solid #d9d9d9;
    }
</style>