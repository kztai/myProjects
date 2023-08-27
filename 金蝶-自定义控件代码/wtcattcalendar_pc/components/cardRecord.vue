<template>
    <!--当应打卡=true，或者应打卡=false同时又打了卡（周末加班）时显示-->
    <div class="wtc-homePage-calendar-card-record"
        v-if="cardType == 2 || (cardRecord.workCardShould || !cardRecord.workCardShould && cardRecord.workCardTime) || (cardRecord.offCardShould || !cardRecord.offCardShould && cardRecord.offCardTime)">
        <!-- 一次卡 或者 存在应打卡 或者 不存在应打卡但存在打卡记录 时显示：-->
        <div class="wtc-homePage-calendar-card-record-on"
            v-if="cardType == 2 || cardRecord.workCardShould || !cardRecord.workCardShould && cardRecord.workCardTime">
            <div class="wtc-homePage-calendar-card-record-text">
                <div class="wtc-homePage-calendar-card-record-on-work" :class="{
        'wtc-card-record-dot-warn': cardRecord.workCardStatus === '1010_S' || cardRecord.workCardStatus === '1020_S',
        'wtc-card-record-dot-danger': cardRecord.workCardStatus === '1030_S' || cardRecord.workCardStatus === '1040_S',
        'wtc-card-record-dot-future': cardRecord.workCardTime === ''}"></div>
                <div v-if="cardType == 2">上下班卡</div> <!--一次卡-->
                <div v-else>
                    <span>{{KDApi.getLangMsg(model, 'onWork')}}</span>
                    <span v-show="cardRecord.workShouldCardTime"> ({{ cardRecord.workShouldCardTime &&
                        cardRecord.workShouldCardTime.split(' ')[1].slice(0,5) }})</span>
                </div>
            </div>
            <div class="wtc-homePage-calendar-card-record-detail">
                <div class="wtc-homePage-calendar-card-record-detail-left">
                    <div v-if="cardRecord.workCardStatus === '1030_S' || cardRecord.workCardStatus === '1040_S'"
                        class="wtc-homePage-calendar-card-record-detail-strike">
                        <div class="wtc-homePage-calendar-card-record-detail-time">--:--</div>
                        <div class="wtc-homePage-calendar-card-record-detail-status wtc-card-record-status-danger">
                            {{ cardStatus_work }}
                        </div>
                    </div>
                    <div v-else>
                        <div class="wtc-homePage-calendar-card-record-detail-top">
                            <div class="wtc-homePage-calendar-card-record-detail-time">
                                {{ cardRecord.workCardTime === null ? KDApi.getLangMsg(model, 'offCard') :
                                cardRecord.workCardTime }}
                            </div>
                            <div class="wtc-homePage-calendar-card-record-detail-status" :class="{
              'wtc-card-record-status-warn': cardRecord.workCardStatus === '1010_S' || cardRecord.workCardStatus === '1020_S',
              'wtc-card-record-status-danger': cardRecord.workCardStatus === '1030_S' || cardRecord.workCardStatus === '1040_S'
            }" v-show="cardRecord.workCardStatus && cardRecord.workCardStatus != 0">
                                {{ cardStatus_work }}
                            </div>
                        </div>
                        <div class="wtc-homePage-calendar-card-record-detail-bottom">
                            {{ cardRecord.workCardTime && !cardRecord.workCardPosition ? '-' :
                            cardRecord.workCardPosition }}
                        </div>
                    </div>
                </div>
                <comSelectDialog class="wtc-homePage-calendar-card-record-detail-right" :cardType="'on'"
                    :timeIndex="num" :dateIndex="dateIndex" :methodsList="methodsList" @confirmClick="dealAbnormal"
                    v-show="cardRecord.workCardStatus && cardRecord.workCardStatus != 0 && showDealBtn">
                </comSelectDialog>
            </div>
        </div>

        <!--存在应打卡 或者 不存在应打卡但存在打卡记录 时显示：-->
        <div class="wtc-homePage-calendar-card-record-off"
            v-if="cardRecord.offCardShould || !cardRecord.offCardShould && cardRecord.offCardTime">
            <div class="wtc-homePage-calendar-card-record-text">
                <div class="wtc-homePage-calendar-card-record-off-work" :class="{
        'wtc-card-record-dot-warn': cardRecord.offCardStatus === '1010_S' || cardRecord.offCardStatus === '1020_S',
        'wtc-card-record-dot-danger': cardRecord.offCardStatus === '1030_S' || cardRecord.offCardStatus === '1040_S',
        'wtc-card-record-dot-future': cardRecord.offCardTime === ''}"></div>
                <div>
                    <span>{{KDApi.getLangMsg(model, 'offWork')}}</span>
                    <span v-show="cardRecord.offShouldCardTime"> ({{ cardRecord.offShouldCardTime &&
                        cardRecord.offShouldCardTime.split(' ')[1].slice(0,5) }})</span>
                </div>
            </div>
            <div class="wtc-homePage-calendar-card-record-detail">
                <div class="wtc-homePage-calendar-card-record-detail-left">
                    <div v-if="cardRecord.offCardStatus === '1030_S' || cardRecord.offCardStatus === '1040_S'"
                        class="wtc-homePage-calendar-card-record-detail-strike">
                        <div class="wtc-homePage-calendar-card-record-detail-time">--:--</div>
                        <div class="wtc-homePage-calendar-card-record-detail-status wtc-card-record-status-danger">
                            {{ cardStatus_off }}
                        </div>
                    </div>
                    <div v-else>
                        <div class="wtc-homePage-calendar-card-record-detail-top">
                            <div class="wtc-homePage-calendar-card-record-detail-time">
                                {{ cardRecord.offCardTime === null ? KDApi.getLangMsg(model, 'offCard') :
                                cardRecord.offCardTime }}
                            </div>
                            <div class="wtc-homePage-calendar-card-record-detail-status" :class="{
              'wtc-card-record-status-warn': cardRecord.offCardStatus === '1010_S' || cardRecord.offCardStatus === '1020_S',
              'wtc-card-record-status-danger': cardRecord.offCardStatus === '1030_S' || cardRecord.offCardStatus === '1040_S'
            }" v-show="cardRecord.offCardStatus && cardRecord.offCardStatus != 0">
                                {{ cardStatus_off }}
                            </div>
                        </div>
                        <div class="wtc-homePage-calendar-card-record-detail-bottom">
                            {{ cardRecord.offCardTime && !cardRecord.offCardPosition ? '-' : cardRecord.offCardPosition
                            }}
                        </div>
                    </div>
                </div>
                <!-- showDealBtn是团队首页的需求，只有异常列表有值才显示处理按钮 -->
                <comSelectDialog class="wtc-homePage-calendar-card-record-detail-right" :cardType="'off'"
                    :timeIndex="num" :dateIndex="dateIndex" :methodsList="methodsList" @confirmClick="dealAbnormal"
                    v-show="cardRecord.offCardStatus && cardRecord.offCardStatus != 0 && showDealBtn">
                </comSelectDialog>
            </div>
        </div>

        <div class="wtc-homePage-calendar-card-record-line"
            v-if="(cardRecord.workCardShould && cardRecord.offCardShould) || (!cardRecord.workCardShould && cardRecord.workCardTime && !cardRecord.offCardShould && cardRecord.offCardTime)">
        </div>
    </div>
</template>

<script>
    import comSelectDialog from "./com_selectDialog.vue";

    export default {
        name: "cardRecord1",
        components: {
            comSelectDialog
        },

        props: ["cardRecord", "num", 'model', 'KDApi', 'showDealBtn', 'methodsList', 'cardType', 'dateIndex'],
        data() {
            return {};
        },

        mounted() {
            console.log(this.cardRecord)
        },

        computed: {
            cardStatus_work() {
                return this.getStatus(this.cardRecord.workCardStatus);
            },

            cardStatus_off() {
                return this.getStatus(this.cardRecord.offCardStatus);
            },
        },

        methods: {
            dealAbnormal(para) {
                this.$emit('dealClick', para);
            },
            getStatus(type) {
                // 打卡状态："0"正常、1010_S迟到、1020_S早退、1040_S缺卡、1030_S旷工、1050_S早来、1060_S晚走
                let status;
                switch (type) {
                    case '1010_S':
                        status = "迟到";
                        break;
                    case '1020_S':
                        status = "早退";
                        break;
                    case '1040_S':
                        status = "缺卡";
                        break;
                    case '1030_S':
                        status = "旷工";
                        break;
                    case '1050_S':
                        status = "早来";
                        break;
                    case '1060_S':
                        status = "晚走";
                        break;
                    default:
                        status = "正常";
                        break;
                }

                return status;
            },
        },
    };
</script>

<style scoped>
    .wtc-homePage-calendar-card-record {
        position: relative;
        padding-bottom: 10px;
        border-bottom: 1px dashed #e5e5e5;
        color: #666;
    }

    .wtc-homePage-calendar-card-record:last-child {
        border-bottom: none;
    }

    .wtc-homePage-calendar-card-record .wtc-homePage-calendar-card-record-left {
        flex: 0 0 8px;
        margin-top: 14px;
    }

    .wtc-homePage-calendar-card-record-on-work,
    .wtc-homePage-calendar-card-record-off-work {
        /*display: inline-block;*/
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #276ff5;
        margin-right: 6px;
        margin-top: 6px;
    }

    .wtc-homePage-calendar-card-record-right {
        flex: 1;
        font-size: 12px;
        margin-left: 4px;
    }

    .wtc-homePage-calendar-card-record-text {
        display: flex;
        padding: 10px 0;
        font-size: 14px;
    }

    .wtc-homePage-calendar-card-record-detail {
        display: flex;
        background-color: #f5f5f5;
        /*overflow: hidden;*/
        padding: 8px 12px;
        height: 43px;
        box-sizing: content-box;
        margin-left: 18px;
    }

    .wtc-homePage-calendar-card-record-detail .wtc-homePage-calendar-card-record-detail-left {
        flex: 1;
    }

    .wtc-homePage-calendar-card-record-detail-strike {
        display: flex;
        margin-top: 12px;
    }

    .wtc-homePage-calendar-card-record-detail-left .wtc-homePage-calendar-card-record-detail-top {
        display: flex;
        margin-bottom: 2px;
    }

    .wtc-homePage-calendar-card-record-detail-left .wtc-homePage-calendar-card-record-detail-time {
        /* margin-top:3px; */
        font-size: 16px;
        color: #212121;
        font-weight: 700;
    }

    .wtc-homePage-calendar-card-record-detail-strike .wtc-homePage-calendar-card-record-detail-time {
        font-weight: 400;
        font-size: 14px;
    }

    .wtc-homePage-calendar-card-record-detail-left .wtc-homePage-calendar-card-record-detail-status {
        padding: 0 6px;
        margin-left: 14px;
        border-radius: 10px;
        color: #276ff5;
        border: 1px solid #276ff5;
        height: 19px;
        line-height: 19px;
        font-size: 12px;
    }

    .wtc-homePage-calendar-card-record-detail .wtc-homePage-calendar-card-record-detail-right {
        flex: 0 0 50px;
        /* padding: 6px 10px; */
        margin-top: 10px;
        outline: none;
        border: none;
        color: #276ff5;
        background-color: inherit;
        font-size: 14px;
    }

    .wtc-homePage-calendar-card-record-detail .wtc-homePage-calendar-card-record-detail-right>i {
        margin-right: 4px;
    }

    .wtc-homePage-calendar-card-record-detail-left .wtc-card-record-status-warn {
        color: #ff991c;
        border: 1px solid #ff991c;
    }

    .wtc-homePage-calendar-card-record-detail-left .wtc-card-record-status-danger {
        color: #ff5257;
        border: 1px solid #ff5257;
    }

    .wtc-homePage-calendar-card-record .wtc-card-record-dot-warn {
        background-color: #ff991c;
    }

    .wtc-homePage-calendar-card-record .wtc-card-record-dot-danger {
        background-color: #ff5257;
    }

    .wtc-homePage-calendar-card-record .wtc-card-record-dot-future {
        background-color: #999;
    }


    .wtc-homePage-calendar-card-record-line {
        position: absolute;
        left: 0;
        top: 25px;
        width: 0px;
        height: 88px;
        border-left: 1px solid #e5e5e5;
        margin-left: 4px;
    }
</style>