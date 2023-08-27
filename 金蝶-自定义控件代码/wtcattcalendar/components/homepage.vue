<!--
 * @Author: kztai 1012049531@qq.com
 * @Date: 2023-06-15 17:06:04
 * @LastEditors: kztai 1012049531@qq.com
 * @LastEditTime: 2023-06-15 17:08:32
 * @FilePath: \learn\newCodeInKingdee\自定义控件代码\wtcattcalendar\components\homepage.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="wtc-homePage-calendar-wrap">
        <calendar ref="calendar" :initDate="chooseDay" :earliestMonth="earliestMonth" :model="model" :KDApi="KDApi">
        </calendar>
        <div @click="showDetail = !showDetail" class="wtc-homePage-calendar-fold-btn">
            <span class="kdfont" :class="{ 'kdfont-xiala': !showDetail, 'kdfont-shangla': showDetail }"></span>
        </div>
        <transition name="wtc-calendar-slide">
            <attendanceDetail ref="attendanceDetail" v-show="showDetail" :model="model" :KDApi="KDApi">
            </attendanceDetail>
        </transition>
    </div>
</template>

<script>
    import attendanceDetail from "./attendanceDetail.vue";
    import calendar from "./calendar.vue";

    export default {
        name: "attendanceCalendar",
        components: {
            attendanceDetail,
            calendar,
        },
        props: ['model', 'chooseDay', 'earliestMonth', 'KDApi'],

        data() {
            return {
                showDetail: false,

                attRecord: {
                    date: "2022-05-01",
                    existAtt: true, // 当天是否需要出勤
                    abnormal: false, // 考勤是否异常
                    workHours: "7小时30分钟", //工时
                    shiftPeriod: ["09:00-12:00"],
                    cardRecord: [],
                    details: []
                },
            };
        },

        methods: {
            addDateData(dateList, attRecord, chosedate, details, abnormal) {
                this.$refs.calendar.addDateData(dateList);
                this.$refs.attendanceDetail.changeAttRecord({ attRecord, chosedate, details, abnormal });
            },
            refreshAttRecord(attRecord) {
                this.$refs.attendanceDetail.changeAttRecord(attRecord);
                this.showDetail = true;
            },
            isNoRoster(date) {
                return this.$refs.calendar.isNoRoster(date);
            },

            testFunc() {
                // this.$emit('test')
            }
        }
    };
</script>

<style scoped>
    .wtc-homePage-calendar-wrap {
        font-family: PingFang SC;
        width: 100%;
        font-size: 14px;
        color: #212121;
        overflow: hidden;
        background-color: #fff;
    }

    .wtc-homePage-calendar-wrap .wtc-homePage-calendar-fold-btn {
        text-align: center;
        padding: 6px 0;
    }

    .wtc-homePage-calendar-wrap .wtc-homePage-calendar-fold-btn>span {
        font-size: 22px;
        color: #999;
        font-weight: 700;
    }

    .wtc-calendar-slide-enter-active,
    .wtc-calendar-slide-leave-active {
        transition: max-height .5s;
    }

    .wtc-calendar-slide-enter,
    .wtc-calendar-slide-leave-to {
        max-height: 0;
    }

    .wtc-calendar-slide-enter-to,
    .wtc-calendar-slide-leave {
        max-height: 40rem;
    }
</style>