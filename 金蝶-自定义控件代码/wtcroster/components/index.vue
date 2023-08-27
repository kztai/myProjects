<template>
    <div class="wtc_roster-container" :style="{height: rosterData.type===0 ? '533px' : '100%'}"
        :class="{'wtc_roster-container-preview': rosterData.type===0, 'wtc_roster-container-fullpage':fullpage}">
        <div class="wtc_roster-container-menu">
            <div class="wtc_roster-container-menu-left" v-if="rosterData.type===1">
                <div class="wtc_roster-container-menu-datePicker">
                    <datePicker ref="datePicker" :disabled="dateDisabled" :clearable="dateClearable" :value1="dateValue"
                        :uniqueId="uniqueId" :model="model" :pickerOptions="pickerOptions" @dateEmpty="dateEmpty"
                        @dateChange="dateChange"></datePicker>
                </div>
                <div class="wtc_roster-container-menu-checkbox-wrap"
                    v-show="showPlanRoster && rosterData.rosterview === 'tabperson'">
                    <div class="wtc_roster-container-menu-checkbox"
                        :class="{'wtc_roster-container-menu-checkbox-checked': rosterData.showType === 'SHOW_ALL'}"
                        @click="checkPlan">
                        <div class="wtc_roster-container-menu-checkbox-icon"><i class="kdfont kdfont-dagou"></i></div>
                        <div>计划</div>
                    </div>
                    <div
                        class="wtc_roster-container-menu-checkbox wtc_roster-container-menu-checkbox-actual wtc_roster-container-menu-checkbox-checked">
                        <div class="wtc_roster-container-menu-checkbox-icon"><i class="kdfont kdfont-dagou"></i></div>
                        <div>实际</div>
                    </div>
                    <!--<label><input type="checkbox" checked="checked" @change="checkPlan">计划</label>-->
                    <!--<label><input type="checkbox" checked="checked" disabled="disabled">实际</label>-->
                </div>
                <!--只有排班管理模块的人员排班才显示模式切换-->
                <div class="wtc_roster-container-menu-mode-wrap" v-if="rosterData.rosterview === 'tabperson'"
                    v-show="showModeBtn" @click="changeMode">
                    <div class="wtc_roster-container-menu-mode" v-if="simpleMode">
                        <i class="kdfont kdfont-qiehuanfangan"></i>
                        <span>标准模式</span>
                    </div>
                    <div class="wtc_roster-container-menu-mode" v-else>
                        <i class="kdfont kdfont-qiehuanfangan"></i>
                        <span>紧凑模式</span>
                    </div>
                </div>
            </div>
            <div class="wtc_roster-container-menu-right">
                <div class="wtc_roster-container-shift-info-wrap">
                    <shift-info :shiftListId="rosterData.shiftInfoMap.all" :type="rosterData.type"></shift-info>
                </div>
                <div class="wtc_roster-container-pagination" v-show="showPagination">
                    <pagination ref="pagination" :data="paginationData" @pageChange="pageChange"></pagination>
                </div>
                <!--只有排班管理模块的人员排班才显示全屏按钮-->
                <div v-if="rosterData.rosterview === 'tabperson' && rosterData.type===1"
                    class="wtc_roster-container-menu-fullpage kdfont"
                    :class="{'kdfont-quanping':!fullpage, 'kdfont-guanbiquanping':fullpage}" @click="toggleFullpage">
                </div>
            </div>
        </div>

        <div ref="containerRoster" class="wtc_roster-container-roster">
            <roster v-if="!simpleMode" ref="roster" :rosterData="rosterData"></roster>
            <rosterSimple v-else ref="rosterSimple" :rosterData="rosterData"></rosterSimple>
        </div>

        <div class="wtc_roster-table-loading" v-show="showLoading">
            <img width="50" height="50" :src="imgUrl_person" alt="no img" class="wtc_roster-table-loading-icon">
            <!--<div class="wtc_roster-table-loading-icon kdfont kdfont-jiazai"></div>-->
        </div>
    </div>
</template>

<script>
    import pagination from "./pagination.vue";
    import roster from "./roster/roster.vue";
    import rosterSimple from "./roster_simple/roster_simple.vue";
    import shiftInfo from "./shiftInfo.vue";
    import datePicker from "../../wtcdatepicker/components/datePicker.vue";

    export default {
        name: "index",
        components: {
            roster,
            pagination,
            shiftInfo,
            rosterSimple,
            datePicker
        },
        props: ['paginationData', 'rosterData', 'datePicker'],
        inject: ['uniqueId', 'model', 'uniqueId', 'KDApi'],

        data() {
            return {
                imgUrl_person: this.KDApi.getNameSpace(this.model) + 'images/loading.gif',
                showPlanRoster: this.rosterData.showType === 'SHOW_ALL',
                showPagination: true,
                simpleMode: false,
                fullpage: false,
                showModeBtn: true,
                showLoading: false,

                uniqueId: new Date().getTime(),
                // arrDateValue: this.datePicker.dateValue,
                dateDisabled: false,
                dateClearable: false,
                pickerOptions: {},
                dateValue: this.datePicker.dateValue,
                dateValue_copy: this.datePicker.dateValue,
            };
        },

        mounted() {
            let $this = this;

            // 阻止默认右键菜单：
            $(this.$refs.containerRoster).on('contextmenu', function () {
                return false;
            });

            // 当为编辑态才有这事件：
            if (this.rosterData.savePower) {
                const $this = this;
                // 屏幕大小改变后触发
                $(window).on('resize.roster_resize_' + this.uniqueId, function () {
                    // 如果切换到其他页面，不执行键盘事件：
                    if ($this.$root.$el.offsetWidth === 0) return;
                    $this.rosterResize()
                });

                //按住ctrl键进行多选，按shift键进行多选
                $(window).on('keydown.roster_keydown_' + this.uniqueId, function (e) {
                    if ($this.rosterData.rosterview === 'tabperson') {
                        let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                        ele_roster.$refs.rosterTable.$refs.rosterCells.keydownHandle(e);
                    } else {
                        $this.$refs.roster.$refs.rosterTable_org.$refs.rosterCells.keydownHandle(e);
                    }
                }
                ).on('keyup.roster_keyup_' + this.uniqueId, function () {
                    if ($this.rosterData.rosterview === 'tabperson') {
                        let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                        ele_roster.$refs.rosterTable.$refs.rosterCells.isCtrl = false;
                        ele_roster.$refs.rosterTable.$refs.rosterCells.isShift = false;
                    } else {
                        $this.$refs.roster.$refs.rosterTable_org.$refs.rosterCells.isCtrl = false;
                        $this.$refs.roster.$refs.rosterTable_org.$refs.rosterCells.isShift = false;
                    }
                    //todo 这样写严重影响性能： $($this.rootDom).css('userSelect', 'initial');
                });
            }

            // 行政组织排班，则隐藏分页控件：
            this.rosterData.rosterview === 'tabperson' ? this.showPagination = true : this.showPagination = false;

            // todo 未自测
            if (this.rosterData.type === 1) {  //排班管理特有事件
                // 监听头部页签切换事件
                $('._2oSxsI6M.hover-theme-fc').on('click.roster_click1_' + this.uniqueId, function () {
                    $this.rosterResize()
                });
                $('.oym9trU1.Tmdc0v3r').on('click.roster_click2_' + this.uniqueId, function () {
                    $this.rosterResize()
                });
            }

            // 组织成日期选择器需要的数据：
            var curShortcuts = [];
            if (this.datePicker.shortcuts) {
                for (var i = 0; i < this.datePicker.shortcuts.length; i++) {
                    var shortcut = this.datePicker.shortcuts[i];
                    (function (shortcut) {
                        if (shortcut.enable === true || shortcut.enable === undefined) {
                            curShortcuts.push({
                                text: shortcut.text,
                                enable: true,
                                onClick: function onClick(picker) {
                                    $this.$refs.datePicker.curClickIndex = shortcut.index;
                                    picker.$emit('pick', [shortcut.dateValue[0], shortcut.dateValue[1]]);
                                }
                            })
                        } else {
                            curShortcuts.push({
                                text: shortcut.text,
                                enable: false
                            })
                        }
                    })(shortcut);
                }
            }
            this.pickerOptions = {
                shortcuts: curShortcuts
            }
        },

        destroyed() {
            $(window).off('resize.roster_resize_' + this.uniqueId);// 防止事件被多次注册
            $(window).off('keydown.roster_keydown_' + this.uniqueId);// 防止事件被多次注册
            $(window).off('keyup.roster_keyup_' + this.uniqueId);// 防止事件被多次注册
            $('._2IuNtC78.hover-theme-fc').off('click.roster_click1_' + this.uniqueId);// 防止事件被多次注册
            $('.oym9trU1.Tmdc0v3r').off('click.roster_click2_' + this.uniqueId);// 防止事件被多次注册
        },

        methods: {
            /*
            * 切换标准模式与紧凑模式
            * */
            changeMode() {
                let $this = this;
                let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                let arrFilterData = ele_roster.getFilterData();
                // 显示加载中
                $this.showLoading = true;
                // 这里需要加个定时器异步一下，让加载中的动画先渲染出来：
                setTimeout(function () {
                    // 模式转化
                    $this.simpleMode = !$this.simpleMode;

                    $this.$nextTick(function () {
                        let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                        ele_roster.refreshFilterData(arrFilterData);
                        // 取消显示加载中
                        $this.showLoading = false;
                    })
                }, 0);
            },
            /*
            * 选中与取消选中计划班
            * */
            checkPlan() {
                this.rosterData.showType = this.rosterData.showType === 'SHOW_ALL' ? 'SHOW_REAL' : 'SHOW_ALL';
                //如果是紧凑模式，需要修改高度：
                if (this.simpleMode) {
                    this.$refs.rosterSimple.changeCellHeight();
                }
            },

            /*
            * 切换全屏按钮
            * */
            toggleFullpage() {
                this.fullpage = !this.fullpage;
                this.fullpage ? this.showModeBtn = false : this.showModeBtn = true;
            },

            /*
            * 响应后端-用户点击保存按钮
            * */
            saveRoster() {
                let $this = this;
                let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                ele_roster.saveRoster()
            },

            /*
            * 时段重叠判断
            * */
            timeOverlap(arrOverlapRoster) {
                let $this = this;
                let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                ele_roster.timeOverlap(arrOverlapRoster)
            },

            /*
            * 行政组织排班-加载人员（后端响应）
            * */
            onloadOrgPersonRoster(personRoster) {
                let $this = this;
                let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                ele_roster.onloadOrgPersonRoster(personRoster)
            },

            /*
            * 后端响应右键事件
            * */
            opPower(args) {
                let $this = this;
                let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                ele_roster.opPower(args)
            },

            /*
            * 单元个全部取消选中
            * */
            cancelAllActive() {
                let $this = this;
                let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                ele_roster.cancelAllActive()
            },

            /*
            * 页码变化
            * */
            pageChange(curPage, curPartPage) {
                let $this = this;
                let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                $this.showLoading = true;

                this.model.invoke('pageChange', {
                    curPage: curPage,
                    curPartPage: curPartPage,
                    rosterview: this.rosterData.rosterview,
                    groupId: this.rosterData.rosterview === 'taborg' ? ele_roster.$refs.rosterTable_org.$refs.personMainInfo.curGroupId : undefined
                })
            },

            /*
            * 排班页面大小改变，需要从新计算表格的宽度
            * */
            rosterResize() {
                let $this = this;
                setTimeout(function () {
                    let $dom_middleHeaderList = $('.wtc_roster-table-middle-header-list-wrap', $this.$root.$el);

                    var newWidth = parseInt($dom_middleHeaderList.css('width'));
                    // 设置排班列的宽度（通过整表宽度-固定的几个宽度，因为浏览器的分辨率会变化，所以导致右侧排班类的宽度需要动态变化）：
                    let ele_roster = $this.$refs.roster ? $this.$refs.roster : $this.$refs.rosterSimple;
                    ele_roster.infoDetailWidthChange(newWidth);
                }, 20)
            },

            /*
            * 日期选择器日期范围改变（后端触发）
            * */
            changeDatePicker(arrDate) {
                // this.arrDateValue = arrDate;
                this.$refs.datePicker.changeDatePicker(arrDate);
            },

            /*
            * 日期选择器清空
            * */
            dateEmpty(dateRange) {
                // 保存一份日期范围的备份，用于当日期范围超过2个月时复原原时间：
                this.dateValue_copy = [null, null];
            },

            /*
            * 日期选择器日期范围改变（用户触发）
            * */
            dateChange(dateRange) {
                // 判断日期范围是否超过2个月
                let startDate = typeof dateRange[0] === 'string' ? new Date(dateRange[0]) : dateRange[0];
                let endDate = typeof dateRange[1] === 'string' ? new Date(dateRange[1]) : dateRange[1];

                let startYear = startDate.getFullYear();
                let startMonth = startDate.getMonth() + 1;
                let endYear = endDate.getFullYear();
                let endMonth = endDate.getMonth() + 1;

                let isExceed = this.exceedRange(startYear, startMonth, endYear, endMonth);

                if (isExceed) {
                    // 超出2个月，日期复原
                    this.dateValue = JSON.parse(JSON.stringify(this.dateValue_copy));
                } else {
                    // 未超出2个月：
                    // 显示加载中
                    this.showLoading = true;
                    // 保存一份日期范围的备份，用于当日期范围超过2个月时复原原时间：
                    this.dateValue_copy = JSON.parse(JSON.stringify([startDate, endDate]));
                }

                // let objYearMonth = this.getNextMonth(startYear, startMonth);
                // objYearMonth = this.getNextMonth(objYearMonth.year, objYearMonth.month);
                // let targetDate = this.toExistDate(objYearMonth.year, objYearMonth.month, startDay);
                //
                // if(endDate.getTime() > new Date(targetDate).getTime()) {
                //     // 超出2个月，日期复原
                //     this.dateValue = JSON.parse(JSON.stringify(this.dateValue_copy));
                //     // tips提示：
                //     this.myTool.message({
                //         type: 'warn',
                //         message: '所选择的日期范围不能大于2个月。'
                //     })
                // } else {
                //     // 显示加载中
                //     this.showLoading = true;
                //     // 保存一份日期范围的备份，用于当日期范围超过2个月时复原原时间：
                //     this.dateValue_copy = JSON.parse(JSON.stringify(dateRange));
                //     // 发事件到后端：
                //     // this.model.invoke('dateChange', dateRange);
                // }
            },

            /*
            * 判断起始日期与结束日期是否超过2个月
            * */
            exceedRange(startYear, startMonth, endYear, endMonth) {
                if (startYear === endYear) {
                    // 年份相等
                    return endMonth - startMonth > 1;
                } else if (endYear - startYear > 1) {
                    // 年份相差大于1年
                    return true;
                } else {
                    // 年份相差1年
                    return !(startMonth === 12 && endMonth === 1)
                }
            },

            /*/!*
            * 给定年月日可能不存在，将其转化为存在的日期
            * *!/
            toExistDate(year, month, date) {
                // 先判断该日期是否存在：
                if (new Date(year + "/" + month + "/" + date).getDate() === date) {
                    return year + "/" + month + "/" + date;
                } else {
                    let lastDay = this.getMonthLastDate(year, month);
                    return year + "/" + month + "/" + lastDay;
                }
            },

            /!*
             * 获取当前年月对应的下一个年月
             *!/
            getNextMonth(year, month) {
                return month === 12
                    ? {
                        year: ++year,
                        month: 1,
                    }
                    : {
                        year: year,
                        month: ++month,
                    };
            },

            /!*
             * 返回该月最后一天
             *!/
            getMonthLastDate(curYear, curMonth) {
                let {year, month} = this.getNextMonth(curYear, curMonth);
                let tempDate = year + "/" + month + "/01 00:00:00";
                let timestamp = new Date(tempDate).getTime() - 1;
                return new Date(timestamp).getDate();
            },*/
        }
    };
</script>

<style scoped>
    .wtc_roster-container {
        position: relative;
        color: #333;
        font-size: 12px;
        width: 100%;
        /*height: 100%;  !*根据外层的高度设置固定高度*!*/
        /*height: 493px;  !*根据外层的高度设置固定高度*!*/
    }

    .wtc_roster-container-fullpage {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        z-index: 999;
    }

    .wtc_roster-container .wtc_roster-container-menu {
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        /*padding: 0 10px;*/
        background-color: #fff;
    }

    .wtc_roster-container-menu-left {
        display: flex;
    }

    .wtc_roster-container-menu-right {
        display: flex;
    }

    .wtc_roster-container-preview .wtc_roster-container-menu-right {
        justify-content: space-between;
        flex: 1;
    }

    .wtc_roster-container-menu-mode:hover {
        cursor: pointer;
        color: var(--theme-color);
    }

    .wtc_roster-container-menu-mode>span {
        vertical-align: top;
    }

    .wtc_roster-container-menu-checkbox-wrap {
        display: flex;
    }

    .wtc_roster-container-menu-checkbox {
        display: flex;
        margin-left: 10px;
        cursor: pointer;
    }

    .wtc_roster-container-menu-checkbox-actual {
        color: #ccc;
        cursor: default;
    }

    .wtc_roster-container-menu-checkbox-checked .wtc_roster-container-menu-checkbox-icon {
        background-color: var(--theme-color, #276FF5);
        border-color: var(--theme-color, #276FF5);
    }

    .wtc_roster-container-menu-checkbox-actual.wtc_roster-container-menu-checkbox-checked .wtc_roster-container-menu-checkbox-icon {
        background-color: #ccc;
        border-color: #d9d9d9;
    }

    .wtc_roster-container-menu-checkbox-icon {
        width: 16px;
        height: 16px;
        line-height: 14px;
        text-align: center;
        border-radius: 2px;
        border: 1px solid #d9d9d9;
        margin: 11px 4px 0 0;
    }

    .wtc_roster-container-menu-checkbox-icon>i {
        display: none;
        font-size: 12px;
        font-weight: 700;
        color: #fff;
    }

    .wtc_roster-container-menu-checkbox-checked .wtc_roster-container-menu-checkbox-icon>i {
        display: inline;
    }

    /*.wtc_roster-container-menu-checkbox-wrap>label>input[type=checkbox] {
        vertical-align: sub;
        width: 16px;
        height: 16px;
        margin-right: 4px;
    }*/

    .wtc_roster-container-menu-left>div {
        margin-left: 16px;
    }

    .wtc_roster-container-menu-right>div {
        margin-right: 16px;
    }

    .wtc_roster-container-shift-info-wrap {
        line-height: initial;
    }

    .wtc_roster-container-pagination {
        line-height: initial;
        padding-top: 8px;
        /*flex: 0 0 316px;*/
    }

    .wtc_roster-container-menu-fullpage:hover {
        color: var(--theme-color);
        cursor: pointer;
    }

    .wtc_roster-container-roster {
        height: calc(100% - 40px);
    }


    .wtc_roster-table-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        z-index: 1000;
        margin: auto;
    }

    .wtc_roster-table-loading .wtc_roster-table-loading-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        /*display: inline-block;*/
        /*font-size: 32px;*/
        /*color: #606266;*/
        /*animation:loading 2s linear infinite;*/
    }


    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(1turn);
        }
    }

    /*循环排班特有样式*/
    .wtc_roster-container-preview .wtc_roster-container-shift-info-wrap {
        margin-left: 6px;
    }


    /* todo 这些样式不知道有没用 */
    .wtc_roster-container .wtc_roster-container-select {
        margin-top: 4px;
    }

    .wtc_roster-container .wtc_roster-container-select-text {
        display: inline-block;
    }

    .wtc_roster-container .wtc_roster-container-select-btn {
        display: inline-block;
        margin-left: 6px;
        color: var(--themeColor, #276FF5);
        cursor: pointer;
    }

    /*.wtc_roster-container-pagination {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 40px;
    }*/
</style>