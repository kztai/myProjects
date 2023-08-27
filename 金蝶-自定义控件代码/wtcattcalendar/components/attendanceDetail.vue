<template>
    <div class="wtc-homePage-calendar-detail">
        <div class="wtc-homePage-calendar-detail-first">
            <div class="wtc-homePage-calendar-detail-first-left">
                <div class="wtc-homePage-calendar-detail-date">{{ attRecord.chosedate }}</div>
                <div class="wtc-homePage-calendar-detail-abnormal" v-show="attRecord.abnormal">{{KDApi.getLangMsg(model,
                    'abnormal')}}
                </div>
            </div>
        </div>

        <div class="wtc-homePage-calendar-detail-no-att" v-if="attRecord.noRoster">
            <img :src="imgUrl_nodata" width="200" alt="">
            <div class="wtc-homePage-calendar-detail-no-att-text">{{attRecord.chosedate}}无排班，请联系管理员</div>
        </div>
        <ul class="wtc-homePage-calendar-detail-hasRoster" v-else>
            <li class="wtc-homePage-calendar-detail-second" v-for="(cardList, index1) in attRecord.attRecord"
                :key="index1">
                <div class="wtc-homePage-calendar-detail-second-list">
                    {{cardList.shiftPeriod && cardList.shiftPeriod.length>0 ? '班次时段：' : '班次时段：无'}}
                    <span v-for="(time, index2) in cardList.shiftPeriod || []" :key="index2">{{ time }}</span>
                </div>
                <div class="wtc-homePage-calendar-detail-no-att" v-if="!cardList.existAtt">
                    <img :src="imgUrl_nodata" width="200" alt="">
                    <div class="wtc-homePage-calendar-detail-no-att-text">{{KDApi.getLangMsg(model, 'msg1')}}</div>
                </div>
                <div class="wtc-homePage-calendar-detail-no-att" v-else-if="cardList.cardType==3">
                    <img :src="imgUrl_nocard" width="150" alt="">
                    <div class="wtc-homePage-calendar-detail-no-att-text">员工免打卡</div>
                </div>

                <div class="wtc-homePage-calendar-detail-card-list" v-else>
                    <cardRecord v-for="(item, index) in cardList.cardRecord || []" :key="index" :cardRecord="item"
                        :cardType="cardList.cardType" :model="model"
                        :showDealBtn="cardList.abnormalDealMethods && cardList.abnormalDealMethods.length>0"
                        :KDApi="KDApi" :num="index" :dateIndex="index1" @dealClick="showAbnormalWrap">
                    </cardRecord>
                </div>
            </li>
        </ul>

        <div class="wtc-homePage-calendar-detail-card-daily-detail" v-show="attRecord.details.length > 0">
            <div class="wtc-homePage-calendar-daily-detail-title">
                {{KDApi.getLangMsg(model, 'dailyDetail')}}
            </div>
            <div class="wtc-homePage-calendar-daily-detail-list">
                <div class="wtc-homePage-calendar-daily-detail-item" v-for="(item, index) in attRecord.details"
                    :key="index">
                    <div class="wtc-homePage-calendar-daily-detail-item-type">
                        <img :src="billType_img(item.billType)" alt="">
                        {{ item.billType }}
                    </div>
                    <div class="wtc-homePage-calendar-daily-detail-item-billList">
                        <div class="wtc-homePage-calendar-daily-detail-item-duration"
                            v-for="(objBill, index1) in item.billList" :key="index1">
                            {{ objBill.bill }}: {{ objBill.duration }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <dialog-wrap @hideDialog="abnormalWrapCancel" :showWrap="abnormalWrap">
            <abnormal-deal ref="AbnormalDeal" :showWrap="abnormalWrap" :model="model" :KDApi="KDApi"
                @cancelClick="abnormalWrapCancel" @confirmClick="abnormalWrapConfirm"></abnormal-deal>
        </dialog-wrap>
    </div>
</template>

<script>
    import cardRecord from "./cardRecord.vue";
    import dialogWrap from "./dialogWrap.vue";
    import AbnormalDeal from "./abnormalDeal.vue";

    export default {
        name: "card-record",
        components: {
            AbnormalDeal,
            cardRecord,
            dialogWrap
        },
        props: ['model', 'KDApi'],
        data() {
            return {
                // imgUrl: '../assets/noAtt.png',
                imgUrl_nodata: this.KDApi.getNameSpace(this.model) + 'imgs/noData.png',
                // imgUrl_nodata: '',
                imgUrl_nocard: this.KDApi.getNameSpace(this.model) + 'imgs/noCard.png',
                attRecord: {
                    chosedate: "2022-05-02",
                    abnormal: false, // 考勤是否异常
                    attRecord: [
                        {
                            workHours: "", //工时
                            existAtt: true, // 当天是否需要出勤
                            shiftPeriod: [],
                            cardRecord: [
                                // {
                                //     workCardTime: '08:00', //上班打卡时间（当天未打卡传””，缺卡传null）
                                //     workCardPosition: 'xxxxxxxxxx', //上班打卡地址（当天未打卡传””，缺卡传null）
                                //     workCardStatus: '0', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                //     workCardShould: true, //上班是否应打卡
                                //     offCardTime: null, //下班打卡时间（当天未打卡传””，缺卡传null）
                                //     offCardPosition: "", //下班打卡地址（当天未打卡传””，缺卡传null）
                                //     offCardStatus: '1030_S', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                //     offCardShould: true, //下班是否应打卡
                                // },
                                // {
                                //     workCardTime: '08:00', //上班打卡时间（当天未打卡传””，缺卡传null）
                                //     workCardPosition: undefined, //上班打卡地址（当天未打卡传””，缺卡传null）
                                //     workCardStatus: '0', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                //     workCardShould: false, //上班是否应打卡
                                //     offCardTime: "11:10", //下班打卡时间（当天未打卡传””，缺卡传null）
                                //     offCardPosition: "", //下班打卡地址（当天未打卡传””，缺卡传null）
                                //     offCardStatus: '1010_S', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                //     offCardShould: true, //下班是否应打卡
                                // },
                            ],
                            abnormalDealMethods: [
                                // {id: 1, value: '补签申请'},
                                // {id: 2, value: '休假申请'},
                                // {id: 3, value: '出差申请'},
                            ]
                        }
                    ],
                    details: [
                        // {billType: '出差', billList: [{bill: '出差', duration: '2小时'}]},
                    ],

                },
                abnormalWrap: false
            };
        },

        methods: {
            // 显示异常处理弹窗：
            showAbnormalWrap(index, type, dateIndex) {
                this.$refs.AbnormalDeal.timeIndex = index;
                this.$refs.AbnormalDeal.dateIndex = dateIndex;
                this.$refs.AbnormalDeal.cardType = type;
                this.$refs.AbnormalDeal.checkedMethod = -1;
                this.abnormalWrap = true;
                this.$refs.AbnormalDeal.methodsList = this.attRecord.attRecord[dateIndex].abnormalDealMethods || [];
            },

            // 隐藏异常处理弹窗：
            abnormalWrapCancel() {
                this.abnormalWrap = false;
            },

            /*
            * 异常处理弹窗点击确认：
            * para.methodId  用户点击的处理方式id
            * para.timeIndex  用户点击的处理方式对应的时段索引
            * para.cardType  用户点击的处理方式对应的时段打卡类型：on/off
            * */
            abnormalWrapConfirm(para) {
                // 需传：点击的异常（时段 、处理方式、上下班标识 、异常对应时段点、异常类型）；以及其他的异常数据
                this.abnormalWrap = false;
                let arrOtherAbnormal = [];

                for (let i = 0; i < this.attRecord.attRecord[para.dateIndex].cardRecord.length; i++) {
                    let cardRecord = this.attRecord.attRecord[para.dateIndex].cardRecord[i];
                    let shiftPeriod = this.attRecord.attRecord[para.dateIndex].shiftPeriod[i];

                    if (i !== para.timeIndex) {
                        if (cardRecord.workCardStatus && cardRecord.workCardStatus != 0) {
                            arrOtherAbnormal.push({
                                timeRange: shiftPeriod,
                                cardType: 'on',
                                abnormalTime: cardRecord.workCardTime,
                                abnormalStatus: cardRecord.workCardStatus,
                                shouldCardTime: cardRecord.workShouldCardTime,
                            });
                        }
                        if (cardRecord.offCardStatus && cardRecord.offCardStatus != 0) {
                            arrOtherAbnormal.push({
                                timeRange: shiftPeriod,
                                cardType: 'off',
                                abnormalTime: cardRecord.offCardTime,
                                abnormalStatus: cardRecord.offCardStatus,
                                shouldCardTime: cardRecord.offShouldCardTime,
                            });
                        }
                    } else {
                        if (para.cardType === 'on') {
                            if (cardRecord.offCardStatus && cardRecord.offCardStatus != 0) {
                                arrOtherAbnormal.push({
                                    timeRange: shiftPeriod,
                                    cardType: 'off',
                                    abnormalTime: cardRecord.offCardTime,
                                    abnormalStatus: cardRecord.offCardStatus,
                                    shouldCardTime: cardRecord.offShouldCardTime,
                                });
                            }
                        } else {
                            if (cardRecord.workCardStatus && cardRecord.workCardStatus != 0) {
                                arrOtherAbnormal.push({
                                    timeRange: shiftPeriod,
                                    cardType: 'on',
                                    abnormalTime: cardRecord.workCardTime,
                                    abnormalStatus: cardRecord.workCardStatus,
                                    shouldCardTime: cardRecord.workShouldCardTime,
                                });
                            }
                        }
                    }
                }

                let arrShiftPeriod = this.attRecord.attRecord[para.dateIndex].shiftPeriod;
                let arrCardRecord = this.attRecord.attRecord[para.dateIndex].cardRecord;
                this.model.invoke('abnormalDeal', {
                    abnormalDate: this.attRecord.chosedate,
                    methodId: para.methodId,
                    allTimeRange: arrShiftPeriod,
                    selectedAbnormal: {
                        timeRange: arrShiftPeriod[para.timeIndex],
                        cardType: para.cardType,
                        abnormalTime: para.cardType === 'on' ? arrCardRecord[para.timeIndex].workCardTime : arrCardRecord[para.timeIndex].offCardTime,
                        abnormalStatus: para.cardType === 'on' ? arrCardRecord[para.timeIndex].workCardStatus : arrCardRecord[para.timeIndex].offCardStatus,
                        shouldCardTime: para.cardType === 'on' ? arrCardRecord[para.timeIndex].workShouldCardTime : arrCardRecord[para.timeIndex].offShouldCardTime,
                    },
                    otherAbnormal: arrOtherAbnormal
                });
            },

            billType_img(type) {
                switch (type) {
                    case '休假':
                        return this.KDApi.getNameSpace(this.model) + 'imgs/xiujia_16_16.png';
                    case '出差':
                        return this.KDApi.getNameSpace(this.model) + 'imgs/chuchai_16_16.png';
                    case '加班':
                        return this.KDApi.getNameSpace(this.model) + 'imgs/jiaban_16_16.png';
                    case '出勤':
                        return this.KDApi.getNameSpace(this.model) + 'imgs/chuqin_16_16.png';
                }
            },

            // 刷新考勤数据
            changeAttRecord(attRecord) {
                this.attRecord.chosedate = attRecord.chosedate;
                this.attRecord.abnormal = attRecord.abnormal;
                this.attRecord.workHours = attRecord.workHours || '0小时';
                this.attRecord.attRecord = attRecord.attRecord || [];
                this.attRecord.details = attRecord.details || [];
                this.attRecord.noRoster = this.$parent.isNoRoster(this.attRecord.chosedate);
            },

            changeHeight(heightType) {
                this.heightType = heightType;
            }
        }
    };
</script>

<style>
    .wtc-homePage-calendar-detail {
        position: relative;
        padding: 0 13px;
        border-top: 1px solid #f1f1f1;
        overflow: hidden;
    }

    /*.wtc-homePage-calendar-detail::after {*/
    /*content: '';*/
    /*width: 200%;*/
    /*height: 200%;*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*border-top: 1px solid #e5e5e5;*/
    /*-webkit-transform: scale(0.5,0.5);*/
    /*transform: scale(0.5,0.5);*/
    /*-webkit-transform-origin: top left;*/
    /*}*/

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-first {
        justify-content: space-between;
        padding-top: 8px;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-date {
        display: inline-block;
        font-size: 16px;
        font-weight: 700;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-abnormal {
        display: inline-block;
        border: 1px solid #FC808B;
        text-align: center;
        font-size: 12px;
        border-radius: 2px;
        color: #FB2323;
        background-color: #FFF2F4;
        margin-left: 4px;
        padding: 0 6px;
        height: 20px;
        line-height: 18px;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-time {
        flex: 1;
        text-align: right;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-time>span {
        color: #276FF5;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-second {
        padding: 6px 0 10px 0;
        /*border-bottom: 1px solid #ddd;*/
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-second-list {
        line-height: 22px;
        font-size: 12px;
        color: #999;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-second-list>span {
        margin-right: 6px;
        word-break: break-all;
    }

    .wtc-homePage-calendar-detail-no-att {
        width: 100%;
        text-align: center;
        padding: 40px 0;
    }

    /*.wtc-homePage-calendar-detail-no-att > img {*/
    /*width: 70%;*/
    /*}*/

    .wtc-homePage-calendar-detail-no-att .wtc-homePage-calendar-detail-no-att-text {
        font-size: 14px;
        color: #999;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-card-list {
        /*min-height: 60px;*/
    }

    .wtc-homePage-calendar-detail-card-daily-detail {
        padding: 10px 0;
        border-top: 1px dashed #e5e5e5;
    }

    .wtc-homePage-calendar-detail-card-daily-detail .wtc-homePage-calendar-daily-detail-title {
        margin-bottom: 6px;
        font-weight: 700;
    }

    .wtc-homePage-calendar-detail-card-daily-detail .wtc-homePage-calendar-daily-detail-item {
        display: flex;
        padding: 10px;
        background-color: #f5f5f5;
        margin-bottom: 10px;
    }

    .wtc-homePage-calendar-detail-card-daily-detail .wtc-homePage-calendar-daily-detail-item-type {
        margin-right: 10px;
        color: #276FF5;
        flex: 0 0 50px;
    }

    .wtc-homePage-calendar-detail-card-daily-detail .wtc-homePage-calendar-daily-detail-item-type>img {
        vertical-align: middle;
        width: 16px;
        height: 16px;
    }

    .wtc-homePage-calendar-detail-card-daily-detail .wtc-homePage-calendar-daily-detail-item-duration {
        margin-bottom: 6px;
    }

    .wtc-homePage-calendar-detail-card-daily-detail .wtc-homePage-calendar-daily-detail-item-duration:last-child {
        margin-bottom: 0;
    }
</style>