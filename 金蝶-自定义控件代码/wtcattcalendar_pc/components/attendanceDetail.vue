<template>
    <div class="wtc-homePage-calendar-detail" v-show="attRecord.chosedate">
        <div class="wtc-homePage-calendar-detail-first">
            <div class="wtc-homePage-calendar-detail-first-left">
                <div class="wtc-homePage-calendar-detail-date">{{ attRecord.chosedate }}</div>
                <div class="wtc-homePage-calendar-detail-abnormal" v-show="attRecord.abnormal">{{KDApi.getLangMsg(model,
                    'abnormal')}}
                </div>
            </div>
        </div>
        <div :class="{
                'wtc-homePage-detail-list-min': heightType === 'min',
                'wtc-homePage-detail-list-middle': heightType === 'middle',
                'wtc-homePage-detail-list-max': heightType === 'max',
             }">
            <div class="wtc-homePage-calendar-detail-no-att" v-if="attRecord.noRoster">
                <img :src="imgUrl_nodata" width="200" alt="">
                <div class="wtc-homePage-calendar-detail-no-att-text">{{attRecord.chosedate}}无排班，请联系管理员</div>
            </div>
            <ul class="wtc-homePage-calendar-detail-hasRoster" v-else>
                <li class="wtc-homePage-calendar-detail-card-item" v-for="(cardList, index1) in attRecord.attRecord"
                    :key="index1">
                    <div class="wtc-homePage-calendar-detail-shiftPeriod-wrap">
                        <div class="wtc-homePage-calendar-detail-attribute" v-show="dateAttribute">{{dateAttribute}}
                        </div>
                        <div class="wtc-homePage-calendar-detail-shiftPeriod">
                            {{cardList.shiftPeriod && cardList.shiftPeriod.length>0 ? '班次时段：' : '班次时段：无'}}
                            <span v-for="(time, index2) in cardList.shiftPeriod || []" :key="index2">{{ time }}</span>
                        </div>
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
                        <cardRecord
                                v-for="(item, index) in cardList.cardRecord || []"
                                :key="index"
                                :cardRecord="item"
                                :cardType="cardList.cardType"
                                :methodsList="cardList.abnormalDealMethods || []"
                                :model="model"
                                :showDealBtn="cardList.abnormalDealMethods && cardList.abnormalDealMethods.length>0"
                                :KDApi="KDApi"
                                :num="index"
                                :dateIndex="index1"
                                @dealClick="abnormalWrapConfirm">
                        </cardRecord>
                    </div>
                </li>
            </ul>

        </div>

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
                imgUrl_nodata: this.KDApi.getNameSpace(this.model) + 'imgs/noData.png',
                imgUrl_nocard: this.KDApi.getNameSpace(this.model) + 'imgs/noCard.png',
                attRecord: {
                    chosedate: "",
                    abnormal: false, // 考勤是否异常
                    workHours: "", //工时
                    attRecord: [
                        {
                            existAtt: true, // 当天是否需要出勤
                            shiftPeriod: [],
                            cardRecord: [
                                /*{
                                    workCardTime: '08:00', //上班打卡时间（当天未打卡传””，缺卡传null）
                                    workCardPosition: 'xxxxxxxxxx', //上班打卡地址（当天未打卡传””，缺卡传null）
                                    workCardStatus: '0', //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                    workCardShould: true, //上班是否应打卡
                                    offCardTime: '', //下班打卡时间（当天未打卡传””，缺卡传null）
                                    offCardPosition: "", //下班打卡地址（当天未打卡传””，缺卡传null）
                                    offCardStatus: 0, //"0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                                    offCardShould: true, //下班是否应打卡
                                    workShouldCardTime: '2023-01-31 09:10',   //上班应打卡时间
                                    offShouldCardTime: '2023-01-31 18:10'   //下班应打卡时间
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
                                    workShouldCardTime: '2023-01-31 09:10',   //上班应打卡时间
                                    offShouldCardTime: '2023-01-31 18:10'   //下班应打卡时间
                                },*/
                            ],
                            abnormalDealMethods: [
                                {id: 1, value: '补签申请'},
                                {id: 2, value: '休假申请'},
                                {id: 3, value: '出差申请'},
                            ],
                        }
                    ]
                },
                abnormalWrap: false,
                dateAttribute: null,
                heightType: 'middle'
            };
        },

        methods: {
            /*
            * 异常处理弹窗点击确认：
            * para.methodId  用户点击的处理方式id
            * para.dateIndex  用户点击的处理方式对应的日期索引（打卡详情里面不只当天的打卡记录）
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
                this.attRecord.noRoster = this.$parent.isNoRoster(this.attRecord.chosedate);
            },

            changeHeight(heightType) {
                this.heightType = heightType;
            }
        }
    };
</script>

<style scoped>
    .wtc-homePage-calendar-detail {
        flex: 3;
        position: relative;
        padding: 0 13px;
        border-top: 1px solid #f1f1f1;
        /*overflow: hidden;*/
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-first {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-first-left {

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

    .wtc-homePage-calendar-detail-card-item {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
    }

    .wtc-homePage-calendar-detail-card-item:last-child {
        border-bottom: none;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-shiftPeriod-wrap {
        display: flex;
        font-size: 12px;
        color: #999;
        flex: 1;
        padding-bottom: 10px;
        border-bottom: 1px dashed #d9d9d9;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-attribute {
        flex: 0 0 44px;
        height: 16px;
        margin-top: 3px;
        font-size: 12px;
        color: #999;
        border-right: 1px solid #ddd;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-shiftPeriod {
        line-height: 22px;
        margin-left: 6px;
    }

    .wtc-homePage-calendar-detail .wtc-homePage-calendar-detail-shiftPeriod > span {
        margin-right: 6px;
        word-break: break-all;
    }

    .wtc-homePage-calendar-detail-no-att {
        width: 100%;
        text-align: center;
        margin-top: 90px;
    }

    .wtc-homePage-calendar-detail-no-att > img {
        /*width: 150px;*/
    }

    .wtc-homePage-calendar-detail-no-att .wtc-homePage-calendar-detail-no-att-text {
        font-size: 14px;
        color: #999;
    }

    .wtc-homePage-detail-list-min {
        max-height: 400px;
        overflow: auto;
    }

    .wtc-homePage-detail-list-middle {
        max-height: 486px;
        overflow: auto;
    }

    .wtc-homePage-detail-list-max {
        max-height: 566px;
        overflow: auto;
    }
</style>