<template>
    <div class="wtc_roster-simple-table-right-shift" @mouseenter="showMoreIcon" @mouseleave="hideMoreIcon"
        :shiftid="shiftModel.id"
        :style="{'background-color': bgColor, 'border-left': '2px solid ' + shiftModel.shiftColor}">
        <div class="wtc_roster-simple-table-right-shift-name" :title="shiftModel.name"
            :style="{'color': shiftModel.shiftColor}">{{shiftModel.name}}</div>
        <div v-show="showMoreBtn" class="wtc_roster-simple-table-right-shift-more-btn kdfont kdfont-gengduo3"
            @mouseenter="showShiftDetail" @mouseleave="hideShiftDetail"></div>
        <div class="wtc_roster-simple-table-right-shift-lock-icon kdfont kdfont-suo16"></div>
    </div>
</template>

<script>
    export default {
        name: "shift",
        props: ['shiftId', 'lockPower', 'cellType'],
        inject: ['model', 'KDApi', 'myTool'],

        data() {
            return {
                showMoreBtn: false,
                bgColor: null,
                // shiftIcon: 'kdfont-gongzuori2',
                shiftModel: {}
            };
        },

        watch: {
            shiftId(newValue) {
                this.init(newValue);
            }
        },

        mounted() {
            this.init(this.shiftId);
        },

        methods: {
            init(shiftId) {
                // 初始化shiftId对应的shiftModel：
                let shiftModelList;
                if (this.$parent.cellType === 'orgPerson') {
                    shiftModelList = this.$root.rosterData.shiftModelList_orgPerson;
                } else {
                    shiftModelList = this.$root.rosterData.shiftModelList;
                }
                for (let i = 0; i < shiftModelList.length; i++) {
                    if (shiftModelList[i].id === shiftId) {
                        this.shiftModel = shiftModelList[i];
                        break;
                    }
                }

                // 设置班次的颜色
                let bgColor = this.hexToRgba(this.shiftModel.shiftColor);
                this.bgColor = `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.12)`;

            },
            hexToRgba(hex) {
                return {
                    r: parseInt(hex.slice(1, 3), 16),
                    g: parseInt(hex.slice(3, 5), 16),
                    b: parseInt(hex.slice(5, 7), 16),
                    a: hex.length === 9 ? parseInt(hex.slice(-2), 16) / 255 : 1
                };
            },
            /*
            * 用户鼠标滑入单元格
            * */
            showMoreIcon() {
                this.showMoreBtn = true;
            },

            hideMoreIcon() {
                this.showMoreBtn = false;
            },

            /*
            * 用户滑入班次中显示更多icon时，触发
            * */
            showShiftDetail(event) {
                let $this = this;
                $this.myTool.popover_isEnter = true;

                setTimeout(function () {
                    if ($this.myTool.popover_isEnter && !document.querySelector('.wtc_kztTool_popover-wrap')) {
                        // 异常提示文本：
                        let abnormalText = '';
                        if (!$this.lockPower && $this.$parent.cellRoster.lock && $this.$parent.cellType !== 'actual') abnormalText = '计划排班已锁定，不可排班。';
                        if ($this.$parent.cellRoster.frozen) abnormalText = '档案已冻结，不可排班。';
                        // 判断排班有没有该属性：
                        let dateType = $this.$parent.cellRoster.dateType || {};

                        let dateAttribute = '';
                        switch ($this.$parent.cellRoster.dateAttribute) {
                            case 'WORKDAY':
                                dateAttribute = $this.KDApi.getLangMsg($this.model, 'workDay');
                                break;
                            case 'OFFDAY':
                                dateAttribute = $this.KDApi.getLangMsg($this.model, 'restDay');
                                break;
                            case 'HOLIDAY':
                                dateAttribute = $this.KDApi.getLangMsg($this.model, 'holiday');
                                break;
                            default:
                                dateAttribute = $this.KDApi.getLangMsg($this.model, 'workDay')
                        }

                        let str = `
                        <div class="wtc_roster-simple-table-right-shift-detail-wrap" style="min-width: 190px;max-width:400px;overflow: hidden;font-size: 12px;">
                            <div class="wtc_roster-simple-table-right-shift-detail-title-wrap" style="padding-bottom: 5px;display: flex;color: #333;">
                                <div class="wtc_roster-simple-table-right-shift-detail-number" title="${$this.shiftModel.number}" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding-right: 0px;padding-top: 4px;max-width: 80px;">${$this.shiftModel.number || '无'}</div>
                                <div class="wtc_roster-table-right-shift-detail-line" style="padding: 4px 4px 0 4px;">|</div>
                                <div class="wtc_roster-table-right-shift-detail-off" style="padding-top: 4px;">${$this.shiftModel.off ? 'OFF班' : '非OFF班'}</div>
                                <div class="wtc_roster-table-right-shift-detail-line" style="padding: 4px 4px 0 4px;">|</div>
                                <div class="wtc_roster-simple-table-right-shift-detail-title" title="${$this.shiftModel.name}" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding-right: 10px;padding-top: 4px;max-width: 280px;">${$this.shiftModel.name}</div>
                            </div>
                            <div class="wtc_roster-simple-table-right-shift-detail-second" style="${$this.cellType === 'org' ? 'display:none;' : ''} padding: 5px 0;color: #666;">
                                <p style="height: 12px;line-height:14px;display: inline-block;border-right: 1px solid #999;padding-right: 4px;">${dateAttribute}</p>
                                <p style="height: 12px;line-height:14px;display: inline-block;">${dateType.name ? dateType.name : '无'}</p>
                            </div>
                            <ul class="wtc_roster-simple-table-shift-detail-time-list" style="padding: 5px 0;color: #999;max-height: 200px;overflow-y: auto;overflow-x: hidden;">`;

                        if ($this.shiftModel.shiftEntryList) {
                            for (let n = 0; n < $this.shiftModel.shiftEntryList.length; n++) {
                                let objShiftEntry = $this.shiftModel.shiftEntryList[n];
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
                                str += `
                            <li class="wtc_roster-simple-table-shift-detail-time-item" style="margin-bottom: 6px;white-space: nowrap;">${outWorkType}：${objShiftEntry.shiftStartDateStr} ~ ${objShiftEntry.shiftEndDateStr}（${objShiftEntry.workTime}h）</li>
                        `;
                            }
                        }

                        str += `</ul>`;

                        if ($this.$parent.cellRoster.holidayList) {
                            for (let n = 0; n < $this.$parent.cellRoster.holidayList.length; n++) {
                                let holiday = $this.$parent.cellRoster.holidayList[n];
                                str += `
                            <div class="wtc_roster-shift-detail-holiday" style="display:inline-block;max-width: 170px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding: 0 4px;border-radius: 10px;border:1px solid rgb(2, 167, 240); color:rgb(2, 167, 240); margin-bottom: 4px;" title="${holiday}">${holiday}</div>
                        `;
                            }
                        }

                        str += `
                            <div class="wtc_roster-simple-table-shift-detail-warn" style="color: #FF981D;">${abnormalText}</div>
                        </div>
                    `;

                        $this.myTool.showPopover({
                            positionX: event.clientX,
                            positionY: event.clientY,
                            isHtml: true,
                            data: str
                        })
                    }
                }, 100);
            },

            hideShiftDetail() {
                this.myTool.cancelPopover()
            },
        }
    };
</script>

<style scoped>
    /*班次样式*/
    .wtc_roster-simple-table-right-shift {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        max-height: 30px;
        font-size: 12px;
        border-radius: 2px;
    }

    .wtc_roster-simple-table-right-shift .wtc_roster-simple-table-right-shift-name {
        /*color: green;*/
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        /*padding-right: 10px;*/
        /*margin-left: 2px;*/
        padding: 0 2px;
    }

    .wtc_roster-simple-table-right-group-list .wtc_roster-simple-table-right-shift .wtc_roster-simple-table-right-shift-more-btn {
        position: absolute;
        top: -2px;
        right: 2px;
        color: #999;
        font-size: 12px;
        z-index: 2;
        cursor: pointer;
    }

    .wtc_roster-simple-table-right-shift .wtc_roster-simple-table-right-shift-more-btn:hover {
        z-index: 3;
    }

    .wtc_roster-simple-table-right-shift .wtc_roster-simple-table-right-shift-lock-icon {
        display: none;
        position: absolute;
        bottom: -3px;
        right: -3px;
        color: #999;
        font-size: 12px;
    }

    .wtc_roster-shift-lock .wtc_roster-simple-table-right-shift-name {
        opacity: 0.5;
    }

    .wtc_roster-shift-lock .wtc_roster-simple-table-right-shift-lock-icon {
        display: block;
    }
</style>