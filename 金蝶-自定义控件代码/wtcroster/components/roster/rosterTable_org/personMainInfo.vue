<template>
    <ul class="wtc_roster-table-content-left-group-list">
        <li class="wtc_roster-table-content-left-group-item" v-for="(orgRosterData, index) in orgShiftModelList"
            :key="index" @mousedown="rowCellActive($event, index)" :groupid="orgRosterData.id">
            <div class="wtc_roster-table-content-left-group-row" @click="togglePersonRoster(orgRosterData.id, index)">
                <i class="wtc_roster-table-content-group-row-icon kdfont"
                    :class="{'kdfont-houfan': !arrShowPerson[index], 'kdfont-xiala': arrShowPerson[index]}"></i>
                <span :title="orgRosterData.name">{{ orgRosterData.name }}</span>
            </div>
            <ul @mousedown.stop class="wtc_roster-table-left-person-list">
                <li class="wtc_roster-table-left-person-item"
                    v-for="(rosterData, index1) in rosterShiftModelList[index]" :key="index1"
                    :personId="rosterData.rosterPerson.id">
                    <div class="wtc_roster-table-left-person-img">
                        <img :src="rosterData.rosterPerson.img || imgUrl_person" alt="" width="28" height="28">
                    </div>
                    <div class="wtc_roster-table-left-person-msg">
                        <div class="wtc_roster-table-left-person-msg-top">
                            <p class="wtc_roster-table-left-person-top-name"
                                @mouseenter="showPersonInfo($event, rosterData.rosterPerson)"
                                @mouseleave="hidePersonInfo">
                                {{ rosterData.rosterPerson.name }}
                            </p>
                            <div class="wtc_roster-table-left-person-top-number">{{ rosterData.rosterPerson.number }}
                            </div>
                            <!--<div class="wtc_roster-table-left-person-top-log">{{ langText_log }}</div>-->
                        </div>
                        <div class="wtc_roster-table-left-person-msg-bottom">
                            <div class="wtc_roster-table-left-person-bottom-left">
                                <i class="kdfont kdfont-gongzuori2" title="工作日天数"></i>
                                <span class="wtc_roster-table-left-person-bottom-left-num1">{{
                                    rosterData.rosterPerson.workDay }}</span>
                            </div>
                            <div class="wtc_roster-table-left-person-bottom-left">
                                <i class="kdfont kdfont-xiuxiri" title="休息日天数"></i>
                                <span class="wtc_roster-table-left-person-bottom-left-num2">{{
                                    rosterData.rosterPerson.restDay }}</span>
                            </div>
                            <div class="wtc_roster-table-left-person-bottom-left">
                                <i class="kdfont kdfont-jiaqi2" title="节假日天数"></i>
                                <span class="wtc_roster-table-left-person-bottom-left-num3">{{
                                    rosterData.rosterPerson.holiday }}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "personMainInfoOrg",

        props: ['orgShiftModelList', 'savePower'],
        inject: ['model', 'KDApi', 'myTool'],

        data() {
            return {
                langText_log: this.KDApi.getLangMsg(this.model, 'log'),
                imgUrl_person: this.KDApi.getNameSpace(this.model) + 'images/person.png',
                rosterShiftModelList: [],
                arrShowPerson: [],
                curShowIndex: -1,
                curGroupId: ''
            };
        },


        watch: {
            orgShiftModelList(newValue) {
                this.initRosterShiftModelList(newValue.length);
            }
        },

        mounted() {
            this.initRosterShiftModelList(this.orgShiftModelList.length);
        },

        methods: {
            initRosterShiftModelList(orgRosterLen) {
                this.rosterShiftModelList = [];
                this.arrShowPerson = [];
                this.curShowIndex = -1;
                this.curGroupId = '';
                for (let i = 0; i < orgRosterLen; i++) {
                    this.rosterShiftModelList.push([]);
                    this.arrShowPerson.push(false);
                }
            },

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
            },

            /*
            * 行政组织中人员展开或收起时，需要加载人员排班或者删除：
            * */
            togglePersonRoster(groupId, index) {
                if (this.arrShowPerson[index]) {
                    this.curShowIndex = -1;
                    this.$emit('foldPerson', index);
                } else {
                    let curPartPage = this.$root.$refs.index.$refs.pagination.curPartPage;
                    this.curGroupId = groupId;

                    this.$parent.$parent.$parent.showLoading = true;
                    this.model.invoke('pageChange', {
                        curPage: 1,
                        curPartPage: curPartPage,
                        groupId: groupId,
                        rosterview: 'taborg'
                    });

                    /*this.$root.onloadOrgPersonRoster({
                        groupId: groupId,
                        existRoster: true,
                        paginationData: {   // 分页数据（当用户展开行政组织时（即第一次加载）需要传这个分页数据）
                            curPage: 1,   // 当前页码
                            curPartPage: 50,  // 当前每页多少条
                            total: 100,    // 总共有多少条
                            partPageList: [20, 50, 100, 200]   // 每页显示多少条list
                        },
                        rosterShiftModelList: [
                            {
                                "rosterPerson": {
                                    "org": "环宇国际集团有限公司",
                                    "changeTips": "",
                                    "restDay": 0,
                                    "position": "qwer",
                                    "number": "00000796",
                                    "realTime": 0,
                                    "name": "百里玄策",
                                    "workDay": 0,
                                    "departmentId": 865829143550386200,
                                    "department": "AAA公司AAA公司AAA公司",
                                    "planTime": 45,
                                    "holiday": 0,
                                    "id": "977431832981170176",
                                    "company": "AAA公司",
                                    "group": ""
                                },
                                "planRosterList": [
                                    {
                                        "dateAttribute": "OFFDAY",
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1266525387970580480",
                                        "shiftBoId": "1266525387970580480-bo",
                                        "dateType": "A",
                                        "lock": true,
                                        "saveType": "1",
                                        "holiday": "",
                                        holidayList: ['中秋999节', '中秋节', '中秋节1111111111ddddddddddddd'],
                                        "rosterDateStr": "2021-11-01",
                                        "rosterDate": "2021-11-01 00:00:00",
                                        "id": "1286202704443476997",
                                        lockPower: false,
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1269396516766748672",
                                        "shiftBoId": "1269396516766748672-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-02",
                                        "rosterDate": "2021-11-02 00:00:00",
                                        "id": "1286202704443476998",
                                        lockPower: true
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1288493795414917120",
                                        "shiftBoId": "1288493795414917120-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-03",
                                        "rosterDate": "2021-11-03 00:00:00",
                                        "id": "1286202704443476999",
                                        frozen: true,
                                        noPower: false,
                                        stopAtt: false,
                                        ineffectiveDate: true,
                                        lockPower: false
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-04",
                                        "rosterDate": "2021-11-04 00:00:00",
                                        "id": "1286202704443477000",
                                        frozen: false,
                                        noPower: false,
                                        stopAtt: true,
                                        ineffectiveDate: false,
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1288493795414917120",
                                        "shiftBoId": "1288493795414917120-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-05",
                                        "rosterDate": "2021-11-05 00:00:00",
                                        "id": "1286202704443477001"
                                    }
                                ],
                                "realRosterList": [
                                    {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-01",
                                        "rosterDate": "2021-11-01 00:00:00",
                                        "id": "1286202706825841668",
                                        frozen: true,
                                        noPower: true,
                                        stopAtt: true,
                                        ineffectiveDate: true,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "shiftId": "1266525387970580480",
                                        "shiftBoId": "1266525387970580480-bo",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-02",
                                        "rosterDate": "2021-11-02 00:00:00",
                                        "id": "1286202706825841669"
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-03",
                                        "rosterDate": "2021-11-03 00:00:00",
                                        "id": "1286202706825841670",
                                        frozen: false,
                                        noPower: true,
                                        stopAtt: true,
                                        ineffectiveDate: true,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-04",
                                        "rosterDate": "2021-11-04 00:00:00",
                                        "id": "1286202706834230272",
                                        frozen: false,
                                        noPower: false,
                                        stopAtt: false,
                                        ineffectiveDate: false,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-05",
                                        "rosterDate": "2021-11-05 00:00:00",
                                        "id": "1286202706834230273"
                                    }]
                            },
                            {
                                "rosterPerson": {
                                    "org": "环宇国际集团有限公司",
                                    "changeTips": "",
                                    "restDay": 0,
                                    "position": "qwer",
                                    "number": "00000796",
                                    "realTime": 0,
                                    "name": "百里玄策11",
                                    "workDay": 0,
                                    "departmentId": 865829143550386200,
                                    "department": "AAA公司AAA公司AAA公司",
                                    "planTime": 45,
                                    "holiday": 0,
                                    "id": "9774318329811701761",
                                    "company": "AAA公司",
                                    "group": ""
                                },
                                "planRosterList": [
                                    {
                                        "dateAttribute": "OFFDAY",
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1266525387970580480",
                                        "shiftBoId": "1266525387970580480-bo",
                                        "dateType": "A",
                                        "lock": true,
                                        "saveType": "1",
                                        "holiday": "",
                                        holidayList: ['中秋999节', '中秋节', '中秋节1111111111ddddddddddddd'],
                                        "rosterDateStr": "2021-11-01",
                                        "rosterDate": "2021-11-01 00:00:00",
                                        "id": "1286202704443476997",
                                        lockPower: false,

                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1269396516766748672",
                                        "shiftBoId": "1269396516766748672-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-02",
                                        "rosterDate": "2021-11-02 00:00:00",
                                        "id": "1286202704443476998",
                                        lockPower: true
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1288493795414917120",
                                        "shiftBoId": "1288493795414917120-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-03",
                                        "rosterDate": "2021-11-03 00:00:00",
                                        "id": "1286202704443476999",
                                        frozen: true,
                                        noPower: false,
                                        stopAtt: false,
                                        ineffectiveDate: true,
                                        lockPower: false
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-04",
                                        "rosterDate": "2021-11-04 00:00:00",
                                        "id": "1286202704443477000",
                                        frozen: false,
                                        noPower: false,
                                        stopAtt: true,
                                        ineffectiveDate: false,
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1288493795414917120",
                                        "shiftBoId": "1288493795414917120-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-05",
                                        "rosterDate": "2021-11-05 00:00:00",
                                        "id": "1286202704443477001"
                                    }
                                ],
                                "realRosterList": [
                                    {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-01",
                                        "rosterDate": "2021-11-01 00:00:00",
                                        "id": "1286202706825841668",
                                        frozen: true,
                                        noPower: true,
                                        stopAtt: true,
                                        ineffectiveDate: true,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "shiftId": "1266525387970580480",
                                        "shiftBoId": "1266525387970580480-bo",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-02",
                                        "rosterDate": "2021-11-02 00:00:00",
                                        "id": "1286202706825841669"
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-03",
                                        "rosterDate": "2021-11-03 00:00:00",
                                        "id": "1286202706825841670",
                                        frozen: false,
                                        noPower: true,
                                        stopAtt: true,
                                        ineffectiveDate: true,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-04",
                                        "rosterDate": "2021-11-04 00:00:00",
                                        "id": "1286202706834230272",
                                        frozen: false,
                                        noPower: false,
                                        stopAtt: false,
                                        ineffectiveDate: false,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-05",
                                        "rosterDate": "2021-11-05 00:00:00",
                                        "id": "1286202706834230273"
                                    }]
                            },
                            {
                                "rosterPerson": {
                                    "org": "环宇国际集团有限公司",
                                    "changeTips": "",
                                    "restDay": 0,
                                    "position": "qwer",
                                    "number": "00000796",
                                    "realTime": 0,
                                    "name": "百里玄策22",
                                    "workDay": 0,
                                    "departmentId": 865829143550386200,
                                    "department": "AAA公司AAA公司AAA公司",
                                    "planTime": 45,
                                    "holiday": 0,
                                    "id": "9774318329811701762",
                                    "company": "AAA公司",
                                    "group": ""
                                },
                                "planRosterList": [
                                    {
                                        "dateAttribute": "OFFDAY",
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1266525387970580480",
                                        "shiftBoId": "1266525387970580480-bo",
                                        "dateType": "A",
                                        "lock": true,
                                        "saveType": "1",
                                        "holiday": "",
                                        holidayList: ['中秋999节', '中秋节', '中秋节1111111111ddddddddddddd'],
                                        "rosterDateStr": "2021-11-01",
                                        "rosterDate": "2021-11-01 00:00:00",
                                        "id": "1286202704443476997",
                                        lockPower: false,

                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1269396516766748672",
                                        "shiftBoId": "1269396516766748672-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-02",
                                        "rosterDate": "2021-11-02 00:00:00",
                                        "id": "1286202704443476998",
                                        lockPower: true
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1288493795414917120",
                                        "shiftBoId": "1288493795414917120-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-03",
                                        "rosterDate": "2021-11-03 00:00:00",
                                        "id": "1286202704443476999",
                                        frozen: true,
                                        noPower: false,
                                        stopAtt: false,
                                        ineffectiveDate: true,
                                        lockPower: false
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-04",
                                        "rosterDate": "2021-11-04 00:00:00",
                                        "id": "1286202704443477000",
                                        frozen: false,
                                        noPower: false,
                                        stopAtt: true,
                                        ineffectiveDate: false,
                                    },
                                    {
                                        "rosterType": "0",
                                        "hasRoster": true,
                                        "rosterSource": "1",
                                        "shiftId": "1288493795414917120",
                                        "shiftBoId": "1288493795414917120-bo",
                                        "dateType": "A",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-05",
                                        "rosterDate": "2021-11-05 00:00:00",
                                        "id": "1286202704443477001"
                                    }
                                ],
                                "realRosterList": [
                                    {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-01",
                                        "rosterDate": "2021-11-01 00:00:00",
                                        "id": "1286202706825841668",
                                        frozen: true,
                                        noPower: true,
                                        stopAtt: true,
                                        ineffectiveDate: true,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "shiftId": "1266525387970580480",
                                        "shiftBoId": "1266525387970580480-bo",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-02",
                                        "rosterDate": "2021-11-02 00:00:00",
                                        "id": "1286202706825841669"
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-03",
                                        "rosterDate": "2021-11-03 00:00:00",
                                        "id": "1286202706825841670",
                                        frozen: false,
                                        noPower: true,
                                        stopAtt: true,
                                        ineffectiveDate: true,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-04",
                                        "rosterDate": "2021-11-04 00:00:00",
                                        "id": "1286202706834230272",
                                        frozen: false,
                                        noPower: false,
                                        stopAtt: false,
                                        ineffectiveDate: false,
                                    }, {
                                        "rosterType": "1",
                                        "hasRoster": true,
                                        "rosterSource": "0",
                                        "dateType": "",
                                        "lock": false,
                                        "saveType": "1",
                                        "holiday": "",
                                        "rosterDateStr": "2021-11-05",
                                        "rosterDate": "2021-11-05 00:00:00",
                                        "id": "1286202706834230273"
                                    }]
                            },
                        ]
                    })*/
                }
            },
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
        cursor: pointer;
    }

    .wtc_roster-table-content-left-group-item .wtc_roster-table-content-left-group-row>i {
        font-size: 14px;
        margin-right: 4px;
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