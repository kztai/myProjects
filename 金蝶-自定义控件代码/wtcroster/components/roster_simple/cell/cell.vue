<template>
    <li class="wtc_roster-simple-table-right-roster-wrap">
        <!--:class="{'wtc_roster-simple-table-right-plan-roster-wrap': cellType === 'plan', 'wtc_roster-simple-table-right-actual-roster-wrap': cellType === 'actual'}">-->
        <div class="wtc_roster-simple-table-right-roster" :class="{
                    'wtc_roster-shift-frozen': cellType === 'orgPerson' ? false : isFrozen,
                    'wtc_roster-simple-table-roster-active': active,
                    'wtc_roster-shift-overlap-red': overlap,
                    'wtc_roster-shift-overlap-red-next': overlapNext,
                    'wtc_roster-shift-lock': cellRoster.lock,
                }" ref="rightRoster" @mouseenter="showDisableReason" @mouseleave="hideDisableReason"
            @mousedown="rosterCellClick" :rosterId="cellRoster.id">

            <div class="wtc_roster-simple-table-right-shift-frozen-wrap"></div>
            <shift v-if="cellRoster.shiftId" :shiftId="cellRoster.shiftId" :lockPower="lockPower" :cellType="cellType">
            </shift>
        </div>
    </li>
</template>

<script>
    import shift from "./shift.vue";

    export default {
        name: "cell",
        components: { shift },
        props: ['cellRoster', 'lockPower', 'rowNum', 'rowIndex', 'colIndex', 'cellType', 'savePower', 'groupId', 'attFileId'],
        inject: ['model', 'KDApi', 'myTool'],

        data() {
            return {
                isFrozen: this.cellRoster.frozen || this.cellRoster.noPower || this.cellRoster.stopAtt || this.cellRoster.ineffectiveDate || this.cellRoster.planComplete,
                active: false,
                overlap: false,
                overlapNext: false,
            };
        },

        watch: {
            cellRoster(newValue) {
                this.isFrozen = newValue.frozen || newValue.noPower || newValue.stopAtt || newValue.ineffectiveDate || newValue.planComplete;
                // this.active = false;
                this.overlap = false;
                this.overlapNext = false;
            },
            'cellRoster.planComplete'(isPlanComplete) {
                this.isFrozen = this.cellRoster.frozen || this.cellRoster.noPower || this.cellRoster.stopAtt || this.cellRoster.ineffectiveDate || isPlanComplete;
            }
        },

        mounted() {

        },

        methods: {
            /*
            * 点击排班单元格
            * */
            rosterCellClick(event) {
                // 被冰冻单元格不允许点击；行政组织中人员不允许被点击；查看态不允许点击：
                if (!this.savePower || this.isFrozen || this.cellType === 'orgPerson') return;  //查看态不允许点击

                event.preventDefault();
                let $this = this;

                // 先判断班次弹窗是否打开：
                if (this.$root.$refs.index.$refs.rosterSimple.showShiftDialog) {
                    // todo 班次弹窗逻辑待完善：
                    // let $dom_shiftSelected = $('.wtc_personnelSchedule-dialog-shift-item-active', $this.rootDom);
                    // if ($dom_shiftSelected[0]) { // 存在选中的班次
                    //     // 当前单元格高亮：
                    //     $dom_activeCell.removeClass('wtc_roster-simple-table-roster-active');
                    //     $dom_curCell.addClass('wtc_roster-simple-table-roster-active');
                    //     // 黏贴班次：
                    //     $this.parseShift_event()
                    // } else {
                    //     $this.myTool.message({
                    //         type: 'warn',
                    //         message: $this.langText_msg2
                    //     })
                    // }
                } else {
                    if (event.which === 3) { // 点击右键
                        if (!this.active) {
                            // 先取消其他选中单元格，再选中这个单元格：
                            this.$emit('cancelAllActive');
                            this.active = true;
                        }
                        // 弹出右键菜单：
                        this.$emit('showRightClickMenu', event.clientX + 2, event.clientY + 2);
                    } else { //点击左键
                        if ($this.$parent.isShift) {
                            // 取消其他选中单元格：
                            this.$emit('cancelAllActive');
                            // 重置shift选中的结束单元格的行列序号：
                            $this.$parent.arrshiftEndCell = [this.rowNum, this.colIndex];
                            // 高亮shift选中单元格：
                            this.$emit('shiftActiveCells');

                        } else {
                            // 重置shift选中的起始单元格的行列序号：
                            $this.$parent.arrshiftStratCell = [this.rowNum, this.colIndex];

                            if ($this.$parent.isCtrl) {
                                // 切换单元格高亮：
                                this.active = !this.active;
                            } else {
                                // 先取消其他选中单元格，再选中这个单元格：
                                this.$emit('cancelAllActive');
                                this.active = true;
                            }
                        }

                    }
                }
            },

            // 显示置灰排班的置灰原因
            showDisableReason(event) {
                if (this.cellType === 'orgPerson') return;

                if (this.isFrozen) {
                    let reason = '无法排班原因：';
                    if (this.cellRoster.frozen) reason += '档案已冻结，不可排班；';
                    if (this.cellRoster.noPower) reason += '未有人员档案权限，不可排班；';
                    if (this.cellRoster.stopAtt) reason += '档案已停止考勤，不可排班；';
                    if (this.cellRoster.ineffectiveDate) reason += '未有生效的考勤档案，不可排班；';
                    if (this.cellRoster.planComplete) reason += '已完成计划排班，不可更改；';

                    this.myTool.showTips({
                        showTriangle: true,
                        target: event.target,
                        isHtml: false,
                        data: reason
                    })
                } else if (this.overlap || this.overlapNext) {
                    let reason = '无法排班原因：相邻班次时段存在重叠，不可排班。';
                    this.myTool.showTips({
                        showTriangle: true,
                        target: event.target,
                        isHtml: false,
                        data: reason
                    })
                }
            },

            hideDisableReason() {
                if (this.cellType === 'orgPerson') return;

                if (this.isFrozen || this.overlap || this.overlapNext) {
                    this.myTool.cancelTips()
                }
            },
        }
    };
</script>

<style scoped>
    .wtc_roster-simple-table-right-roster-wrap {
        flex: 1;
        height: 100%;
        min-width: 48px;
        border-right: 1px solid #D9D9D9;
        border-bottom: 1px solid #D9D9D9;
        box-sizing: border-box;
        background-color: #fff;
    }

    .wtc_roster-simple-table-right-roster {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        text-align: center;
        padding: 1px;
        box-sizing: border-box;
        border: 1px solid #fff;
        background-color: #fff;
        /*cursor: pointer;*/
    }

    .wtc_roster-simple-table-roster-active {
        border: 1px solid var(--themeColor, #276FF5);
    }

    .wtc_roster-simple-table-right-roster .wtc_roster-simple-table-right-shift-frozen-wrap {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(198, 198, 198, 0.5);
        border-radius: 2px;
    }

    .wtc_roster-shift-frozen .wtc_roster-simple-table-right-shift-frozen-wrap {
        display: block;
    }

    .wtc_roster-shift-overlap-red {
        /*border-left: 1px dashed #F32F2F;*/
        /*border-top: 1px dashed #F32F2F;*/
        /*border-bottom: 1px dashed #F32F2F;*/
        border: 1px dashed #F32F2F;
    }

    .wtc_roster-shift-overlap-red-next {
        border-right: 1px dashed #F32F2F;
        border-top: 1px dashed #F32F2F;
        border-bottom: 1px dashed #F32F2F;
    }

    .wtc_roster-shift-overlap-red-next.wtc_roster-shift-overlap-red {
        border-left: none;
        border-right: none;
    }
</style>