<template>
    <div class="wtc-homePagePC-calendar-wrap">
        <div class="wtc-homePagePC-left">
            <calendar ref="calendar" :initDate="chooseDay" :earliestMonth="earliestMonth" :model="model" :KDApi="KDApi"
                @heightChange="heightChange" @getAttRecord="changeAttribute">
            </calendar>
        </div>
        <attendanceDetail ref="attendanceDetail" :model="model" :KDApi="KDApi"></attendanceDetail>
    </div>
</template>

<script>
    import attendanceDetail from "./attendanceDetail.vue";
    import calendar from "./calendar.vue";

    export default {
        name: "attendanceCalendar_pc",
        components: {
            attendanceDetail,
            calendar,
        },
        props: ['model', 'chooseDay', 'earliestMonth', 'KDApi'],

        data() {
            return {

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
            addDateData(dateList, attRecord, chosedate, abnormal) {
                this.$refs.calendar.addDateData(dateList);
                this.$refs.attendanceDetail.changeAttRecord({ attRecord, chosedate, abnormal });
                // 修改日期属性：
                for (let i = 0; i < dateList.length; i++) {
                    if (dateList[i].date === chosedate) {
                        this.changeAttribute(dateList[i].dateAttribute, chosedate);
                        return;
                    }
                }
            },
            refreshAttRecord(attRecord) {
                this.$refs.attendanceDetail.changeAttRecord(attRecord);
            },
            isNoRoster(date) {
                return this.$refs.calendar.isNoRoster(date);
            },
            changeAttribute(dateAttribute, date_zero) {
                let attribute;
                switch (dateAttribute) {
                    case 'WORKDAY':
                        attribute = '工作日';
                        break;
                    case 'HOLIDAY':
                        attribute = '节假日';
                        break;
                    case 'OFFDAY':
                        attribute = '休息日';
                        break;
                }
                this.$refs.attendanceDetail.dateAttribute = attribute;
                // this.$emit('dateChange', date_zero);
            },
            heightChange(heightType) {
                this.$refs.attendanceDetail.changeHeight(heightType);
            },

            testFunc() {
                // this.$emit('test')
            }
        }
    };
</script>

<style scoped>
    .wtc-homePagePC-calendar-wrap {
        display: flex;
        font-family: PingFang SC;
        width: 100%;
        font-size: 14px;
        color: #212121;
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #d9d9d9;
    }

    .wtc-homePagePC-calendar-wrap .wtc-homePagePC-left {
        flex: 7;
    }
</style>