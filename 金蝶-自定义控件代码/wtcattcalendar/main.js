// 在main.js上通过import引入Vue库和自己写的Vue组件库
import Vue from 'vue';
import homepage from './components/homepage.vue';

(function (KDApi) {
    function AttCalendar(model) {
        this._setModel(model)
    }

    AttCalendar.prototype = {
        _setModel: function (model) {
            this.model = model
        },
        init: function (props) {
            this.uniqueId = new Date().getTime();
            this.themeNum = props.themeNum;
        },
        update: function (props) {
            let $this = this;

            //git test1
            /* if(!props.data) props.data = {
                 event: 'init',
                 args: {
                     chooseDay: '2022-05-02',
                     earliestMonth: '2015-06',
                 }
             };*/
            // setTimeout(function () {
            //     // $this.homepage_vue ? $this.homepage_vue.$data.chooseDay = '2022-08-10' : $this.setHtml($this.model, props);
            //     $this.homepage_vue.addDateData({}, []);
            // }, 5000);
            let event = props.data.event;


            if (props.data && props.data.event === 'init') {
                // alert(props.data.args.chooseDay);
                $this.homepage_vue ? $this.homepage_vue.$data.chooseDay = props.data.args.chooseDay : this.setHtml(this.model, props);
            }

            if (props.data && props.data.event === 'dateData') {
                $this.homepage_vue.addDateData(props.data.args.dateList || [], props.data.args.attRecord || [], props.data.chosedate, props.data.details, props.data.abnormal);
            }

            if (props.data && props.data.event === 'attRecord') {
                $this.homepage_vue.refreshAttRecord(props.data || {})
            }
        },
        destoryed: function () {
        },

        setHtml(model, props) {
            let $this = this;

            KDApi.loadFile(['./css/index.css', './js/myTool.js'], model, () => {
                $this.homepage_vue = new Vue({
                    el: model.dom,
                    template: `<div>
                        <homepage ref="homepage" :chooseDay="chooseDay" :earliestMonth="earliestMonth" :model="model" :KDApi="KDApi"></homepage>
                    </div>`,
                    components: {
                        homepage
                    },
                    data: {
                        model: $this.model,
                        chooseDay: props.data && props.data.args ? props.data.args.chooseDay : '2022-06-01',
                        earliestMonth: props.data && props.data.args ? props.data.args.earliestMonth : '2015-01',
                        KDApi: KDApi,
                    },
                    mounted() {
                        this.myTool = new window.KdWtcMyTool();
                        this.$root.$el.style.setProperty('--themeColor', $this.themeNum)
                    },
                    methods: {
                        // testFunc() {
                        //     this.refreshAttRecord()
                        // },
                        addDateData: function (dateList, attRecord, chosedate, details, abnormal) {
                            /*attRecord.cardRecord = [
                                {
                                    workCardTime: '', //上班打卡时间（当天未打卡传””，缺卡传null）
                                    workCardPosition: '', //上班打卡地址（当天未打卡传””，缺卡传null）
                                    workCardStatus: 0, //打卡状态：0正常、1迟到、2早退、3缺卡、4旷工、5早来、6晚走
                                    offCardTime: "", //下班打卡时间（当天未打卡传””，缺卡传null）
                                    offCardPosition: "", //下班打卡地址（当天未打卡传””，缺卡传null）
                                    offCardStatus: 0, //打卡状态：0正常、1迟到、2早退、3缺卡、4旷工、5早来、6晚走
                                },
                                {
                                    workCardTime: '13:00', //上班打卡时间（当天未打卡传””，缺卡传null）
                                    workCardPosition: "广东省深圳市龙华区深圳市龙华区1111122222223333445555", //上班打卡地址（当天未打卡传””，缺卡传null）
                                    workCardStatus: 0, //打卡状态：0正常、1迟到、2早退、3缺卡、4旷工、5早来、6晚走
                                    offCardTime: "", //下班打卡时间（当天未打卡传””，缺卡传null）
                                    offCardPosition: "", //下班打卡地址（当天未打卡传””，缺卡传null）
                                    offCardStatus: 0, //打卡状态：0正常、1迟到、2早退、3缺卡、4旷工、5早来、6晚走
                                },
                            ];
                            attRecord.details = [
                                {billType: '休假', billList: [{bill: '病假', duration: '5小时呜呜呜呜呜呜呜呜无无无'}, {bill: '事假', duration: '5小时'}]},
                                {billType: '出差', billList: [{bill: '出差', duration: '2小时'}]},
                                {billType: '加班', billList: [{bill: '加班', duration: '12小时'}]},
                            ];
                            attRecord.existAtt = false;
                            dateList = [
                                {
                                    date: "2022-05-01",
                                    day: 1,
                                    holiday: "劳动节",
                                    dateAttribute: "HOLIDAY", //工作日WORKDAY, 节假日HOLIDAY, 休息日OFFDAY
                                    off: true, //是否off班
                                    billList: [],
                                    abnormal: false, // 是否考勤异常
                                },
                                {
                                    date: "2022-05-02",
                                    day: 2,
                                    holiday: "",
                                    dateAttribute: "WORKDAY", //工作日WORKDAY, 节假日HOLIDAY, 休息日OFFDAY
                                    off: true, //是否off班
                                    billList: ["出差", "补签", "补签", "补签"],
                                    abnormal: false, // 是否考勤异常
                                },
                                {
                                    date: "2022-05-03",
                                    day: 3,
                                    holiday: "",
                                    dateAttribute: "OFFDAY", //工作日WORKDAY, 节假日HOLIDAY, 休息日OFFDAY
                                    off: false, //是否off班
                                    billList: [],
                                    abnormal: true, // 是否考勤异常
                                },
                                {
                                    date: "2022-05-04",
                                    day: 4,
                                    holiday: "",
                                    dateAttribute: "OFFDAY", //工作日WORKDAY, 节假日HOLIDAY, 休息日OFFDAY
                                    off: true, //是否off班
                                    billList: [],
                                    abnormal: false, // 是否考勤异常
                                },
                                {
                                    date: "2022-05-05",
                                    day: 5,
                                    holiday: "",
                                    dateAttribute: "WORKDAY", //工作日WORKDAY, 节假日HOLIDAY, 休息日OFFDAY
                                    off: false, //是否off班
                                    billList: [],
                                    abnormal: true, // 是否考勤异常
                                },
                            ];*/

                            this.$refs.homepage.addDateData(dateList, attRecord, chosedate, details, abnormal);
                        },
                        refreshAttRecord(attRecord) {
                            /*attRecord = {
                                    date: "2022-05-02",
                                    existAtt: true, // 当天是否需要出勤
                                    abnormal: true, // 考勤是否异常
                                    workHours: "7小时30分钟", //工时
                                    shiftPeriod: ["09:00-12:00", "09:00-12:00", "09:00-12:00", "09:00-12:00", "09:00-12:00", "09:00-12:00"],
                                    cardRecord: [
                                    {
                                        workCardTime: '08:00', //上班打卡时间（当天未打卡传””，缺卡传null）
                                        workCardPosition: 'xxxxxxxxxx', //上班打卡地址（当天未打卡传””，缺卡传null）
                                        workCardStatus: '0', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                        workCardShould: true, //上班是否应打卡
                                        offCardTime: null, //下班打卡时间（当天未打卡传””，缺卡传null）
                                        offCardPosition: "", //下班打卡地址（当天未打卡传””，缺卡传null）
                                        offCardStatus: '1030_S', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                        offCardShould: true, //下班是否应打卡
                                    },
                                    {
                                        workCardTime: '08:00', //上班打卡时间（当天未打卡传””，缺卡传null）
                                        workCardPosition: undefined, //上班打卡地址（当天未打卡传””，缺卡传null）
                                        workCardStatus: '0', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                        workCardShould: false, //上班是否应打卡
                                        offCardTime: "11:10", //下班打卡时间（当天未打卡传””，缺卡传null）
                                        offCardPosition: "", //下班打卡地址（当天未打卡传””，缺卡传null）
                                        offCardStatus: '1010_S', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                        offCardShould: true, //下班是否应打卡
                                    },
                                ],
                                    details: [
                                    // {billType: '出差', billList: [{bill: '出差', duration: '2小时'}]},
                                ],
                                    abnormalDealMethods: [
                                    // {id: 1, value: '补签申请'},
                                    // {id: 2, value: '休假申请'},
                                    // {id: 3, value: '出差申请'},
                                ]
                            };*/

                            this.$refs.homepage.refreshAttRecord(attRecord);
                        }
                    }
                })
            })
        }
    };

    // 注册自定义组件
    KDApi.register('wtcattcalendar', AttCalendar, { isMulLang: true })
})(window.KDApi);