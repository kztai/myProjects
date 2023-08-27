<template>
    <ul class="wtc_roster-simple-table-content-left-group-list">
        <li class="wtc_roster-simple-table-left-person-item" :style="{'height': cellHeight}"
            @mousedown="rowCellActive($event, index)" v-for="(rosterData, index) in shiftModelList" :key="index"
            :personId="rosterData.rosterPerson.id">

            <p class="wtc_roster-simple-table-left-person-top-name"
                @mouseenter="showPersonInfo($event, rosterData.rosterPerson)" @mouseleave="hidePersonInfo">
                {{ rosterData.rosterPerson.name }}
            </p>
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
                cellHeight: '60px'
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
                        <div class="wtc_roster-simple-table-left-person-msg-detail" style="font-size: 12px;padding:6px;">
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
    .wtc_roster-simple-table-content-left-group-list {
        display: inline-block;
        width: 90px;
        box-sizing: border-box;
        background-color: #fff;
        z-index: 6;
        vertical-align: top;
    }

    .wtc_roster-simple-table-left-person-item {
        display: flex;
        align-items: center;
        width: 100%;
        height: 60px;
        padding: 4px 4px 4px 12px;
        border-bottom: 1px solid #D9D9D9;
        border-right: 1px solid #D9D9D9;
        box-sizing: border-box;
        background-color: #fbfbfb;
    }


    .wtc_roster-simple-table-left-person-top-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        color: var(--theme-color, #276FF5);
    }
</style>