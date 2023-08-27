// 在main.js上通过import引入Vue库和自己写的Vue组件库
import Vue from 'vue';
import index from './components/index.vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

(function (KDApi) {
    function Roster(model) {
        this._setModel(model)
    }

    Roster.prototype = {
        _setModel: function (model) {
            this.model = model
        },
        init: function (props) {
            
            /*this.testData = {
                type: 1,  //0循环排班，1排班管理
                // "rosterview": "taborg",   //taborg/tabperson
                "rosterview": "tabperson",   //taborg/tabperson
                "shiftInfoMap": {
                    "all": ['1266525387970580480', '1288493795414917120'],
                    "popular": ['1266525387970580480', '1288493795414917120'],
                },
                "rosterAdminOrgModelsList": [
                    {
                        "id": "11",
                        "name": "AAA公司",
                        "adminOrgRosterList": [
                            {
                                "shiftId": "1269396516766748672",
                                "shiftBoId": "1269396516766748672-bo",
                                "planComplete": false,
                                "hasRoster": false,
                                "dateType": "",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-01",
                                "rosterDate": "2021-11-01 00:00:00",
                                "id": "1290595032784443392",
                                frozen: false,
                                noPower: true,
                                stopAtt: false,
                                ineffectiveDate: true,
                            }, {
                                "planComplete": false,
                                "hasRoster": false,
                                "dateType": "",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-02",
                                "rosterDate": "2021-11-02 00:00:00",
                                "id": "1290595032784442368"
                            }, {
                                "shiftId": "1269396516766748672",
                                "shiftBoId": "1269396516766748672-bo",
                                "planComplete": false,
                                "hasRoster": false,
                                "dateType": "",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-03",
                                "rosterDate": "2021-11-03 00:00:00",
                                "id": "1290595032784443393",
                                frozen: true,
                                noPower: false,
                                stopAtt: false,
                                ineffectiveDate: true,
                            }, {
                                "shiftId": "1269396516766748672",
                                "shiftBoId": "1269396516766748672-bo",
                                "planComplete": false,
                                "hasRoster": false,
                                "dateType": "",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-04",
                                "rosterDate": "2021-11-04 00:00:00",
                                "id": "1290595032784442369"
                            }, {
                                "shiftId": "1269396516766748672",
                                "shiftBoId": "1269396516766748672-bo",
                                "planComplete": false,
                                "hasRoster": false,
                                "dateType": "",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-05",
                                "rosterDate": "2021-11-05 00:00:00",
                                "id": "1290595032784443394"
                            }
                        ],
                    },
                    {
                        "id": "22",
                        "name": "bbb公司",
                        "adminOrgRosterList": [
                            {
                                "rosterType": "0",
                                "hasRoster": true,
                                "rosterSource": "1",
                                "dateType": "A",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-01",
                                "rosterDate": "2021-11-01 00:00:00",
                                "id": "1286202704443476997"
                            },
                            {
                                "rosterType": "0",
                                "hasRoster": true,
                                "rosterSource": "1",
                                "dateType": "A",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-02",
                                "rosterDate": "2021-11-02 00:00:00",
                                "id": "1286202704443476998"
                            },
                            {
                                "rosterType": "0",
                                "hasRoster": true,
                                "rosterSource": "1",
                                "dateType": "A",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-03",
                                "rosterDate": "2021-11-03 00:00:00",
                                "id": "1286202704443476999"
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
                                "id": "1286202704443477000"
                            },
                            {
                                "rosterType": "0",
                                "hasRoster": true,
                                "rosterSource": "1",
                                "dateType": "A",
                                "lock": false,
                                "saveType": "1",
                                "holiday": "",
                                "rosterDateStr": "2021-11-05",
                                "rosterDate": "2021-11-05 00:00:00",
                                "id": "1286202704443477001"
                            }
                        ],
                    },
                ],
                "rosterShiftModelList": [
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
                                "dateType": {name:'啊啊啊', id:"A"},
                                "lock": true,
                                "saveType": "1",
                                "holiday": "",
                                holidayList: ['中秋999节', '中秋节', '中秋节1111111111ddddddddddddd'],
                                "rosterDateStr": "2021-11-01",
                                "rosterDate": "2021-11-01 00:00:00",
                                "id": "1286202704443476997",
                                lockPower: false,
                                planComplete: true
                            },
                            {
                                "rosterType": "0",
                                "hasRoster": true,
                                "rosterSource": "1",
                                "shiftId": null,
                                "shiftBoId": null,
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
                ],
                "shiftModelList": [
                    {
                        "firstBsed": '2021-11-03 00:00:00',
                        "endBsled": '2090-09-10 00:00:00',
                        "shiftColor": "#ddff8f",
                        "hasChange": false,
                        "name": "时段弹性",
                        "number": "A008876244567",
                        "shiftEntryList": [
                            {
                                "shiftStartDateStr": "08:30",
                                "workTimeStart": true,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 43200,
                                "shiftEndDateStr": "12:00",
                                "refStartDay": "D",
                                "shiftStartDate": 30600,
                                "refEndDay": "D",
                                "outWorkType": "W",
                                "workTimeEnd": false,
                                "workTime": 3.5,
                                "absoluteShiftEndDate": 1637050916447
                            }, {
                                "shiftStartDateStr": "12:00",
                                "workTimeStart": false,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 50400,
                                "shiftEndDateStr": "14:00",
                                "refStartDay": "D",
                                "shiftStartDate": 43200,
                                "refEndDay": "D",
                                "outWorkType": "B",
                                "workTimeEnd": false,
                                "workTime": 2,
                                "absoluteShiftEndDate": 1637050916447
                            }, {
                                "shiftStartDateStr": "14:00",
                                "workTimeStart": false,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 66600,
                                "shiftEndDateStr": "18:30",
                                "refStartDay": "D",
                                "shiftStartDate": 50400,
                                "refEndDay": "D",
                                "outWorkType": "W",
                                "workTimeEnd": true,
                                "workTime": 4.5,
                                "absoluteShiftEndDate": 1637050916447
                            }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1266525387970580480",
                        "boId": "1105007294938158080-bo",
                        "shiftType": "C"
                    },
                    {
                        "firstBsed": '2010-09-10 00:00:00',
                        "endBsled": '2021-11-04 00:00:00',
                        "shiftColor": "#99d92b",
                        "hasChange": false,
                        "name": "WJ-通用班次",
                        "number": "B876244567",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "09:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 43200,
                            "shiftEndDateStr": "12:00",
                            "refStartDay": "D",
                            "shiftStartDate": 32400,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": false,
                            "workTime": 3,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "12:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 50400,
                            "shiftEndDateStr": "14:00",
                            "refStartDay": "D",
                            "shiftStartDate": 43200,
                            "refEndDay": "D",
                            "outWorkType": "B",
                            "workTimeEnd": false,
                            "workTime": 2,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "14:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 64800,
                            "shiftEndDateStr": "18:00",
                            "refStartDay": "D",
                            "shiftStartDate": 50400,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 4,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1288493795414917120",
                        "boId": "1105007294938158080-bo",
                        "shiftType": "A"
                    },
                    {
                        "firstBsed": '2010-09-10 00:00:00',
                        "endBsled": '2090-09-10 00:00:00',
                        "shiftColor": "#ff854d",
                        "hasChange": false,
                        "name": "A公司中班",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "16:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 79200,
                            "shiftEndDateStr": "22:00",
                            "refStartDay": "D",
                            "shiftStartDate": 57600,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": false,
                            "workTime": 6,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "22:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 82800,
                            "shiftEndDateStr": "23:00",
                            "refStartDay": "D",
                            "shiftStartDate": 79200,
                            "refEndDay": "D",
                            "outWorkType": "B",
                            "workTimeEnd": false,
                            "workTime": 1,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "23:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 14400,
                            "shiftEndDateStr": "04:00",
                            "refStartDay": "D",
                            "shiftStartDate": 82800,
                            "refEndDay": "C",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 5,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1277404138602240000",
                        "boId": "1105007294938158080-bo",
                        "shiftType": "A"
                    },
                    {
                        "firstBsed": '2010-09-10 00:00:00',
                        "endBsled": '2090-09-10 00:00:00',
                        "shiftColor": "#ffe0a6",
                        "hasChange": false,
                        "name": "B公司早班",
                        "shiftEntryList": [
                            {
                                "shiftStartDateStr": "08:30",
                                "workTimeStart": true,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 43200,
                                "shiftEndDateStr": "12:00",
                                "refStartDay": "D",
                                "shiftStartDate": 30600,
                                "refEndDay": "D",
                                "outWorkType": "W",
                                "workTimeEnd": false,
                                "workTime": 3.5,
                                "absoluteShiftEndDate": 1637050916447
                            }, {
                                "shiftStartDateStr": "12:00",
                                "workTimeStart": false,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 46800,
                                "shiftEndDateStr": "13:00",
                                "refStartDay": "D",
                                "shiftStartDate": 43200,
                                "refEndDay": "D",
                                "outWorkType": "B",
                                "workTimeEnd": false,
                                "workTime": 1,
                                "absoluteShiftEndDate": 1637050916447
                            }, {
                                "shiftStartDateStr": "13:00",
                                "workTimeStart": false,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 63000,
                                "shiftEndDateStr": "17:30",
                                "refStartDay": "D",
                                "shiftStartDate": 46800,
                                "refEndDay": "D",
                                "outWorkType": "W",
                                "workTimeEnd": true,
                                "workTime": 4.5,
                                "absoluteShiftEndDate": 1637050916447
                            }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1277401533662630912",
                        "shiftType": "A"
                    },
                    {
                        "firstBsed": '2010-09-10 00:00:00',
                        "endBsled": '2090-09-10 00:00:00',
                        "shiftColor": "#d63c09",
                        "hasChange": false,
                        "name": "全天弹性",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "20:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 79200,
                            "shiftEndDateStr": "22:00",
                            "refStartDay": "D",
                            "shiftStartDate": 72000,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": false,
                            "workTime": 2,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "22:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 82800,
                            "shiftEndDateStr": "23:00",
                            "refStartDay": "D",
                            "shiftStartDate": 79200,
                            "refEndDay": "D",
                            "outWorkType": "B",
                            "workTimeEnd": false,
                            "workTime": 1,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "23:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 14400,
                            "shiftEndDateStr": "04:00",
                            "refStartDay": "D",
                            "shiftStartDate": 82800,
                            "refEndDay": "C",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 5,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1266527795928894464",
                        "shiftType": "B"
                    },
                    {
                        "shiftColor": "#ff5257",
                        "hasChange": false,
                        "name": "晚班班次",
                        "shiftEntryList": [
                            {
                                "shiftStartDateStr": "15:00",
                                "workTimeStart": true,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 65700,
                                "shiftEndDateStr": "18:15",
                                "refStartDay": "D",
                                "shiftStartDate": 54000,
                                "refEndDay": "D",
                                "outWorkType": "W",
                                "workTimeEnd": true,
                                "workTime": 3.25,
                                "absoluteShiftEndDate": 1637050916447
                            }, {
                                "shiftStartDateStr": "18:15",
                                "workTimeStart": false,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 68400,
                                "shiftEndDateStr": "19:00",
                                "refStartDay": "D",
                                "shiftStartDate": 65700,
                                "refEndDay": "D",
                                "outWorkType": "B",
                                "workTimeEnd": false,
                                "workTime": 0.75,
                                "absoluteShiftEndDate": 1637050916447
                            }, {
                                "shiftStartDateStr": "19:00",
                                "workTimeStart": true,
                                "absoluteShiftStartDate": 1637050916447,
                                "shiftEndDate": 82800,
                                "shiftEndDateStr": "23:00",
                                "refStartDay": "D",
                                "shiftStartDate": 68400,
                                "refEndDay": "D",
                                "outWorkType": "W",
                                "workTimeEnd": true,
                                "workTime": 4,
                                "absoluteShiftEndDate": 1637050916447
                            }],
                        "checkCardTimes": 4,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1269396516766748672",
                        "shiftType": "A"
                    },
                    {
                        "shiftColor": "#9a4dff",
                        "hasChange": false,
                        "name": "中班班次",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "09:30",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 43200,
                            "shiftEndDateStr": "12:00",
                            "refStartDay": "D",
                            "shiftStartDate": 34200,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 2.5,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "12:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 46800,
                            "shiftEndDateStr": "13:00",
                            "refStartDay": "D",
                            "shiftStartDate": 43200,
                            "refEndDay": "D",
                            "outWorkType": "B",
                            "workTimeEnd": false,
                            "workTime": 1,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "13:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 66600,
                            "shiftEndDateStr": "18:30",
                            "refStartDay": "D",
                            "shiftStartDate": 46800,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 5.5,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 4,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1266521592804937728",
                        "shiftType": "A"
                    },
                    {
                        "shiftColor": "#ff3a72",
                        "hasChange": false,
                        "name": "早班班次",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "07:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 43200,
                            "shiftEndDateStr": "12:00",
                            "refStartDay": "D",
                            "shiftStartDate": 25200,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": false,
                            "workTime": 5,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "12:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 46800,
                            "shiftEndDateStr": "13:00",
                            "refStartDay": "D",
                            "shiftStartDate": 43200,
                            "refEndDay": "D",
                            "outWorkType": "B",
                            "workTimeEnd": false,
                            "workTime": 1,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "13:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 54000,
                            "shiftEndDateStr": "15:00",
                            "refStartDay": "D",
                            "shiftStartDate": 46800,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 2,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1266520527258783744",
                        "shiftType": "A"
                    },
                    {
                        "shiftColor": "#ddff8f",
                        "hasChange": false,
                        "name": "时段弹性",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "08:30",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 43200,
                            "shiftEndDateStr": "12:00",
                            "refStartDay": "D",
                            "shiftStartDate": 30600,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": false,
                            "workTime": 3.5,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "12:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 50400,
                            "shiftEndDateStr": "14:00",
                            "refStartDay": "D",
                            "shiftStartDate": 43200,
                            "refEndDay": "D",
                            "outWorkType": "B",
                            "workTimeEnd": false,
                            "workTime": 2,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "14:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 66600,
                            "shiftEndDateStr": "18:30",
                            "refStartDay": "D",
                            "shiftStartDate": 50400,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 4.5,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1266525387970580480",
                        "shiftType": "C"
                    },
                    {
                        "shiftColor": "#9a4dff",
                        "hasChange": false,
                        "name": "休息日班次",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "08:30",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 64800,
                            "shiftEndDateStr": "18:00",
                            "refStartDay": "D",
                            "shiftStartDate": 30600,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 9.5,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": true,
                        "shiftAtttribute": "",
                        "id": "1281174588209775616",
                        "shiftType": "A"
                    },
                    {
                        "shiftColor": "#ff3a72",
                        "hasChange": false,
                        "name": "测试时段重叠-1",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "06:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 36000,
                            "shiftEndDateStr": "10:00",
                            "refStartDay": "D",
                            "shiftStartDate": 21600,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 4,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1290578849146344448",
                        "shiftType": "A"
                    },
                    {
                        "shiftColor": "#a1ecff",
                        "hasChange": false,
                        "name": "测试时段重叠",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "08:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 25200,
                            "shiftEndDateStr": "07:00",
                            "refStartDay": "D",
                            "shiftStartDate": 28800,
                            "refEndDay": "C",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 23,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1290578176723915776",
                        "shiftType": "A"
                    },
                    {
                        "shiftColor": "#45cdff",
                        "hasChange": false,
                        "name": "hky弹性",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "08:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 43200,
                            "shiftEndDateStr": "12:00",
                            "refStartDay": "D",
                            "shiftStartDate": 28800,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": false,
                            "workTime": 4,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "12:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 50400,
                            "shiftEndDateStr": "14:00",
                            "refStartDay": "D",
                            "shiftStartDate": 43200,
                            "refEndDay": "D",
                            "outWorkType": "B",
                            "workTimeEnd": false,
                            "workTime": 2,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "14:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 64800,
                            "shiftEndDateStr": "18:00",
                            "refStartDay": "D",
                            "shiftStartDate": 50400,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 4,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1289252578328068096",
                        "shiftType": "C"
                    },
                    {
                        "shiftColor": "#104ccc",
                        "hasChange": false,
                        "name": "hky0818",
                        "shiftEntryList": [{
                            "shiftStartDateStr": "09:00",
                            "workTimeStart": true,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 43200,
                            "shiftEndDateStr": "12:00",
                            "refStartDay": "D",
                            "shiftStartDate": 32400,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": false,
                            "workTime": 3,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "12:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 46800,
                            "shiftEndDateStr": "13:00",
                            "refStartDay": "D",
                            "shiftStartDate": 43200,
                            "refEndDay": "D",
                            "outWorkType": "B",
                            "workTimeEnd": false,
                            "workTime": 1,
                            "absoluteShiftEndDate": 1637050916447
                        }, {
                            "shiftStartDateStr": "13:00",
                            "workTimeStart": false,
                            "absoluteShiftStartDate": 1637050916447,
                            "shiftEndDate": 64800,
                            "shiftEndDateStr": "18:00",
                            "refStartDay": "D",
                            "shiftStartDate": 46800,
                            "refEndDay": "D",
                            "outWorkType": "W",
                            "workTimeEnd": true,
                            "workTime": 5,
                            "absoluteShiftEndDate": 1637050916447
                        }],
                        "checkCardTimes": 2,
                        "off": false,
                        "shiftAtttribute": "",
                        "id": "1279644338212586496",
                        "shiftType": "A"
                    }
                ],
                "showType": "SHOW_ALL",   // SHOW_ALL, SHOW_PLAN, SHOW_REAL, SHOW_NO
                "dateList": ["11-01 (周三)", "11-02 (周四)", "11-03 (周五)", "11-04 (周六)", "11-05 (周天)"],
                "rosterSum": {
                    "rosterSummaryList": [
                        {
                            "rosterDate": "2021-11-01 00:00:00",
                            "planRosterTime": 181.8,
                            "realRosterTime": 61,
                            "planRosterPersonNum": 21,
                            "realRosterPersonNum": 5
                        }, {
                            "rosterDate": "2021-11-02 00:00:00",
                            "planRosterTime": 176.8,
                            "realRosterTime": 21,
                            "planRosterPersonNum": 21,
                            "realRosterPersonNum": 4
                        }, {
                            "rosterDate": "2021-11-03 00:00:00",
                            "planRosterTime": 181.8,
                            "realRosterTime": 9,
                            "planRosterPersonNum": 21,
                            "realRosterPersonNum": 2
                        }, {
                            "rosterDate": "2021-11-04 00:00:00",
                            "planRosterTime": 182.8,
                            "realRosterTime": 17,
                            "planRosterPersonNum": 21,
                            "realRosterPersonNum": 2
                        }, {
                            "rosterDate": "2021-11-05 00:00:00",
                            "planRosterTime": 180.8,
                            "realRosterTime": 9,
                            "planRosterPersonNum": 21,
                            "realRosterPersonNum": 1
                        }],
                    "planRosterSumTime": 904,
                    "realRosterSumTime": 117,
                    "planRosterSumPersonNum": 105,
                    "realRosterSumPersonNum": 14
                },
                "paginationData": {
                    curPage: 1,
                    curPartPage: 20,
                    total: 0,
                    partPageList: [20, 50, 100, 200]
                },
                lockPower: true,  //锁定权限
                unlockPower: true,  //解锁权限
                showPlanRoster: true,  //根据系统参数是否显示计划排班
                datePicker: {
                    dateValue: [new Date('2023-03-01'), new Date()],
                    shortcuts: [
                        {
                            index:1,
                            text: '当前考勤期间',
                            enable: false,
                            dateValue: [new Date(2021, 6, 1, 0, 0), new Date(2021, 6, 30, 0, 0)],
                        },
                        {
                            index:2,
                            text: '上一个考勤期间',
                            enable: true,
                            dateValue: [new Date(2021, 5, 1, 0, 0), new Date(2021, 5, 30, 0, 0)],
                        }
                    ]
                }
            };
            props.data = {
                args: this.testData,
            };*/

            this.uniqueId = new Date().getTime();
            this.themeNum = props.themeNum;
            this.setHtml(this.model, props);
        },
        update: function (props) {
            console.log(props.data);
            if (props.data && props.data.event === 'onloadOrgPersonRoster') {
                this.roster_vue.onloadOrgPersonRoster(props.data.args)
            }
            if (props.data && props.data.event === 'save') {
                this.roster_vue.saveRoster()
            }
            if (props.data && props.data.event === 'timeOverlap') {
                /*props.data.args = [
                  {
                      attFileId:  "1478135240114402304",  //档案id（人员排班）
                      adminOrgId: "1",  //行政组织id（行政组织排班）
                      rosterDate: "2022-11-01",  //排班日期
                      rosterType: "0",   //排班类型：0计划班，1实际班
                  },
                  {
                      attFileId:  "1478135240114402304",  //档案id（人员排班）
                      adminOrgId: "1",  //行政组织id（行政组织排班）
                      rosterDate: "2022-11-02",  //排班日期
                      rosterType: "0",   //排班类型：0计划班，1实际班
                  },
                  {
                      attFileId:  "1423922715802262528",  //档案id（人员排班）
                      adminOrgId: "6",  //行政组织id（行政组织排班）
                      rosterDate: "2022-11-01",  //排班日期
                      rosterType: "1",   //排班类型：0计划班，1实际班
                  },
                  {
                      attFileId:  "1423922715802262528",  //档案id（人员排班）
                      adminOrgId: "6",  //行政组织id（行政组织排班）
                      rosterDate: "2022-11-02",  //排班日期
                      rosterType: "1",   //排班类型：0计划班，1实际班
                  }
              ];*/
                this.roster_vue.timeOverlap(props.data.args)
            }
            if (props.data && props.data.event === 'cancelUpdate') {
                this.roster_vue.cancelUpdate()
            }
            if (props.data && props.data.event === 'updatedata') {
                // console.log('updatedata start');
                this.roster_vue.refreshRoster(props.data.args)
            }
            // if (props.data && props.data.event === 'changeShowType') {
            //     this.roster_vue.showRoster(props.data.args.showType)
            // }
            if (props.data && props.data.event === 'opPower') {
                this.roster_vue.opPower(props.data.args)
            }
            if (props.data && props.data.event === 'dateRange') {
                this.roster_vue.changeDatePicker(props.data.args.date || []);
            }
        },

        setHtml(model, props) {
            let $this = this;
            // KDApi.loadFile(['./css/index.css', './src/myTool.js', './fonts/iconfont.css', '../wtcdatepicker/src/yearMonthPicker.js', '../wtcdatepicker/css/yearMonthPicker.css', '../wtcdatepicker/css/index.css'], model, () => {
            KDApi.loadFile(['./css/index.css', './js/myTool.js', './fonts/iconfont.css', '../wtcdatepicker/js/yearMonthPicker.js', '../wtcdatepicker/css/yearMonthPicker.css', '../wtcdatepicker/css/index.css'], model, () => {
                $this.myTool = new KdWtcMyTool();
                $this.roster_vue = new Vue({
                    el: model.dom,
                    template: `<index ref="index" :rosterData="rosterData" :paginationData="paginationData" :datePicker="datePicker"></index>`,
                    components: {
                        index
                    },
                    provide: {
                        model: model,
                        KDApi: KDApi,
                        themeNum: this.themeNum,
                        uniqueId: this.uniqueId,
                        myTool: this.myTool
                    },
                    data: {
                        rosterData: {
                            rosterview: props.data.args.rosterview,
                            shiftInfoMap: props.data.args.shiftInfoMap || {},
                            rosterShiftModelList: props.data.args.rosterShiftModelList || [],
                            rosterAdminOrgModelsList: props.data.args.rosterAdminOrgModelsList || [],
                            shiftModelList: props.data.args.shiftModelList || [],
                            showType: props.data.args.showType || "SHOW_ALL",
                            dateList: props.data.args.dateList || [],
                            rosterSum: props.data.args.rosterSum || [],
                            savePower: props.data.args.savePower === undefined ? true : props.data.args.savePower,
                            insertPower: props.data.args.insertPower === undefined ? true : props.data.args.insertPower,
                            copyPower: props.data.args.copyPower === undefined ? true : props.data.args.copyPower,
                            parsePower: props.data.args.parsePower === undefined ? true : props.data.args.parsePower,
                            delPower: props.data.args.delPower === undefined ? true : props.data.args.delPower,
                            lockPower: props.data.args.lockPower === undefined ? true : props.data.args.lockPower,
                            unlockPower: props.data.args.unlockPower === undefined ? true : props.data.args.unlockPower,
                            completePower: props.data.args.completePower === undefined ? true : props.data.args.completePower,
                            type: props.data.args.type === undefined ? 1 : props.data.args.type,  // 默认排班管理
                        },
                        paginationData: props.data.args.paginationData || {
                            curPage: 1,
                            curPartPage: 20,
                            total: 100,
                            partPageList: [20, 50, 100, 200]
                        },
                        datePicker: props.data.args.datePicker === undefined ? {} : props.data.args.datePicker,  // 当前选中的时间范围
                    },
                    mounted() {
                        this.yearMonthPicker = new window.KdWtcYearMonthPicker();
                        this.$root.$el.style.setProperty('--themeColor', $this.themeNum);
                        // 初始化
                        // model.dom = this.$refs.index.$el;
                        // this.myTool = new KdWtcMyTool();
                    },
                    methods: {
                        onloadOrgPersonRoster(personRoster) {
                            this.$refs.index.onloadOrgPersonRoster(personRoster);
                            this.$refs.index.showLoading = false;
                            if (personRoster.paginationData) this.paginationData = personRoster.paginationData;
                        },
                        saveRoster() {
                            this.$refs.index.saveRoster();
                            this.$refs.index.cancelAllActive();
                        },
                        timeOverlap(arrOverlapRoster) {
                            this.$refs.index.timeOverlap(arrOverlapRoster)
                        },
                        refreshRoster(rosterData) {
                            for (let key in rosterData) {
                                this.rosterData[key] = rosterData[key]
                            }

                            if (rosterData.paginationData) this.paginationData = rosterData.paginationData;
                            if (rosterData.datePicker) this.datePicker = rosterData.datePicker;

                            this.$refs.index.showLoading = false;
                            this.$refs.index.cancelAllActive();

                            $this.myTool.cancelTips();  // 防止刷新数据时，tips气泡不会消失（因为目标元素被刷掉，没有执行mouseleave事件）
                            $this.myTool.cancelPopover();  // 防止刷新数据时，Popover气泡不会消失（因为目标元素被刷掉，没有执行mouseleave事件）
                        },

                        opPower(args) {
                            this.$refs.index.opPower(args);
                            this.$refs.index.showLoading = false;
                        },
                        cancelUpdate() {
                            this.$refs.index.showLoading = false;
                        },
                        changeDatePicker(arrDate) {
                            this.$refs.index.changeDatePicker(arrDate);
                        }
                    }
                })
            })
        }
    };

    // 注册自定义组件
    KDApi.register('wtcroster', Roster, { isMulLang: true })
})(window.KDApi);