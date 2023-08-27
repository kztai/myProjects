<template>
    <ul class="wtc_roster-table-content-left-group-list">
        <li class="wtc_roster-table-left-person-item" @mousedown="rowCellActive($event, index)"
            v-for="(rosterData, index) in shiftModelList" :key="index" :personId="rosterData.rosterPerson.id">
            <div class="wtc_roster-table-left-person-img">
                <img :src="rosterData.rosterPerson.img || imgUrl_person" alt="" width="28" height="28">
            </div>
            <div class="wtc_roster-table-left-person-msg">
                <div class="wtc_roster-table-left-person-msg-top">
                    <p class="wtc_roster-table-left-person-top-name"
                        @mouseenter="showPersonInfo($event, rosterData.rosterPerson)" @mouseleave="hidePersonInfo">
                        {{ rosterData.rosterPerson.name }}
                    </p>
                    <div class="wtc_roster-table-left-person-top-number">{{ rosterData.rosterPerson.number }}</div>
                    <!--<div class="wtc_roster-table-left-person-top-log">{{ langText_log }}</div>-->
                </div>
                <div class="wtc_roster-table-left-person-msg-bottom">
                    <div class="wtc_roster-table-left-person-bottom-left">
                        <i class="kdfont kdfont-gongzuori2" title="工作日天数"></i>
                        <span class="wtc_roster-table-left-person-bottom-left-num1">{{ rosterData.rosterPerson.workDay
                            }}</span>
                    </div>
                    <div class="wtc_roster-table-left-person-bottom-left">
                        <i class="kdfont kdfont-xiuxiri" title="休息日天数"></i>
                        <span class="wtc_roster-table-left-person-bottom-left-num2">{{ rosterData.rosterPerson.restDay
                            }}</span>
                    </div>
                    <div class="wtc_roster-table-left-person-bottom-left">
                        <i class="kdfont kdfont-jiaqi2" title="节假日天数"></i>
                        <span class="wtc_roster-table-left-person-bottom-left-num3">{{ rosterData.rosterPerson.holiday
                            }}</span>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "personMainInfo",

        props: ['shiftModelList', 'savePower'],
        inject: ['model', 'KDApi', 'myTool'],

        data() {
            return {
                langText_log: this.KDApi.getLangMsg(this.model, 'log'),
                imgUrl_person: this.KDApi.getNameSpace(this.model) + 'images/person.png'
            };
        },

        mounted() {

        },

        methods: {
            rowCellActive(event, index) {
                if (this.savePower && event.which === 3) {
                    this.$emit('rowCellActive', index, event.clientX, event.clientY);
                }
            },

            /*
            * 用户鼠标滑入显示更多人员信息的icon时，触发
            * */
            showPersonInfo(event, objPerson) {
                let $this = this;
                $this.myTool.popover_isEnter = true;

                setTimeout(function () {
                    if ($this.myTool.popover_isEnter && !document.querySelector('.wtc_kztTool_popover-wrap')) {
                        let nameText = $this.KDApi.getLangMsg($this.model, 'name');
                        let numberText = $this.KDApi.getLangMsg($this.model, 'number');
                        let attGroupText = $this.KDApi.getLangMsg($this.model, 'attGroup');
                        let companyText = $this.KDApi.getLangMsg($this.model, 'company');
                        let departmentText = $this.KDApi.getLangMsg($this.model, 'department');
                        let positionText = $this.KDApi.getLangMsg($this.model, 'position');
                        let jobText = $this.KDApi.getLangMsg($this.model, 'job');

                        let str = `
                        <div class="wtc_roster-table-left-person-msg-detail" style="font-size: 12px;padding:6px;">
                            <p style="margin-top: 4px;white-space: nowrap;">${nameText}：${objPerson.name}</p>
                            <p style="margin-top: 4px;white-space: nowrap;">${numberText}：${objPerson.number}</p>
                            <p style="margin-top: 4px;white-space: nowrap;">${attGroupText}：${objPerson.org}</p>
                            <p style="margin-top: 4px;white-space: nowrap;">${companyText}：${objPerson.company}</p>
                            <p style="margin-top: 4px;white-space: nowrap;">${departmentText}：${objPerson.department}</p>
                            <p style="margin-top: 4px;white-space: nowrap;">${positionText}：${objPerson.position}</p>
                            <p style="margin-top: 4px;white-space: nowrap;">${jobText}：${objPerson.job}</p>
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

            hidePersonInfo() {
                this.myTool.cancelPopover()
            }
        }
    };
</script>

<style scoped>
    .wtc_roster-table-content-left-group-list {
        display: inline-block;
        width: 230px;
        box-sizing: border-box;
        background-color: #fff;
        z-index: 6;
        vertical-align: top;
    }

    .wtc_roster-table-content-left-group-list .wtc_roster-table-content-left-group-item {}

    .wtc_roster-table-content-left-group-item .wtc_roster-table-content-left-group-row {
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        box-sizing: border-box;
        background-color: #f2f2f2;
        border-bottom: 1px solid #D9D9D9;
        border-right: 1px solid #D9D9D9;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .wtc_roster-table-content-left-group-item .wtc_roster-table-content-left-group-row>i {
        font-size: 14px;
        margin-right: 4px;
        cursor: pointer;
    }

    .wtc_roster-table .wtc_roster-table-left-person-list {
        /*max-height: 100px;*/
        /*overflow: hidden;*/
    }

    .wtc_roster-table .wtc_roster-table-left-person-item {
        display: flex;
        border-bottom: 1px solid #D9D9D9;
        border-right: 1px solid #D9D9D9;
        text-align: center;
        height: 60px;
        padding: 6px 14px 0 10px;
        box-sizing: border-box;
        background-color: #fbfbfb;
        width: 100%;
    }

    .wtc_roster-table .wtc_roster-table-left-person-item .wtc_roster-table-left-person-img {
        flex: 0 0 28px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
    }

    .wtc_roster-table .wtc_roster-table-left-person-item .wtc_roster-table-left-person-msg {
        flex: 1;
        margin-left: 10px;
        width: 170px
    }

    .wtc_roster-table-left-person-msg .wtc_roster-table-left-person-msg-top {
        display: flex;
        margin-bottom: 10px;
        box-sizing: border-box;
        width: 100%;
    }

    .wtc_roster-table-left-person-msg .wtc_roster-table-left-person-msg-top>p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        color: var(--themeColor, #276FF5);
        font-weight: 700;
    }

    .wtc_roster-table-left-person-msg .wtc_roster-table-left-person-msg-top .wtc_roster-table-left-person-top-number {
        margin: 2px 0 0 8px;
        color: #666;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 40px;
        text-align: left;
    }

    /*.wtc_roster-table-left-person-msg .wtc_roster-table-left-person-msg-top .wtc_roster-table-left-person-top-log {*/
    /*display: none;*/
    /*flex: 1;*/
    /*text-align: right;*/
    /*color: var(--themeColor, #276FF5);*/
    /*font-size: 12px;*/
    /*}*/

    .wtc_roster-table-left-person-msg .wtc_roster-table-left-person-msg-bottom {
        display: flex;
        justify-content: space-between;
    }

    .wtc_roster-table-left-person-msg .wtc_roster-table-left-person-msg-bottom div {
        padding-right: 2px;
    }

    .wtc_roster-table-left-person-msg .wtc_roster-table-left-person-msg-bottom div i {
        color: #8590A6;
        font-size: 14px;
        margin-right: 8px;
    }

    .wtc_roster-table-left-person-msg .wtc_roster-table-left-person-msg-bottom div span {
        color: #333;
        font-size: 14px;
        font-weight: 700;
    }
</style>