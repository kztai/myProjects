<template>
    <transition name="wtc-yearMonth-slide-bottom">
        <div class="wtc-calendar-yearMonth" @click.stop @touchmove.prevent v-show="showWrap">
            <div class="wtc-calendar-yearMonth-btns">
                <div class="wtc-calendar-yearMonth-btn-cancel" @click="cancelClick">
                    {{KDApi.getLangMsg(model, 'cancel')}}
                </div>
                <div class="wtc-calendar-yearMonth-btn-confirm" @click="confirmClick">
                    {{KDApi.getLangMsg(model, 'confirm')}}
                </div>
            </div>
            <div class="wtc-calendar-yearMonth-year">
                <div class="wtc-calendar-yearMonth-year-left kdfont kdfont-qianfan"
                    :class="{ 'wtc-calendar-yearMonth-year-left-disable': leftYearDisable }" @click="leftYearClick">

                </div>
                <div class="wtc-calendar-yearMonth-year-text">{{ curYear }}</div>
                <div class="wtc-calendar-yearMonth-year-right kdfont kdfont-houfan" @click="rightYearClick">

                </div>
            </div>
            <div class="wtc-calendar-yearMonth-months">
                <div class="wtc-calendar-yearMonth-month-item" :class="[
          selectMonth(index),
          disableMonth(index),
        ]" v-for="(month, index) in arrMonth" :key="index" @click="monthClick(index)">
                    {{ month }}
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "yearMonth",
        props: ["year", "month", 'showWrap', 'earliestMonth', 'KDApi', 'model'],
        data() {
            return {
                arrMonth: [
                    "1月",
                    "2月",
                    "3月",
                    "4月",
                    "5月",
                    "6月",
                    "7月",
                    "8月",
                    "9月",
                    "10月",
                    "11月",
                    "12月",
                ],
                checkedMonth: -1,
                curYear: this.year,
                curMonth: this.month,
                earlyMonth: 0,
                earlyYear: 0,
                leftYearDisable: false,
                monthDisable: false,
            };
        },
        watch: {
            year(newValue, oldValue) {
                this.curYear = newValue
            },
            month(newValue, oldValue) {
                this.curMonth = newValue;
                this.checkedMonth = newValue - 1;
            },
        },

        mounted() {
            this.earlyYear = Number(this.earliestMonth.split('-')[0]);
            this.earlyMonth = Number(this.earliestMonth.split('-')[1]);

            if (this.earlyYear === this.curYear) this.leftYearDisable = true;
        },

        methods: {
            monthClick(index) {
                if (this.leftYearDisable && index + 1 < this.earlyMonth) return;

                this.checkedMonth = index;
                this.curMonth = index + 1;
            },
            selectMonth(index) {
                return { "wtc-yearMonth-month-checked": index === this.checkedMonth };
            },
            disableMonth(index) {
                return { "wtc-calendar-yearMonth-month-item-disable": this.leftYearDisable && index + 1 < this.earlyMonth };
            },
            leftYearClick() {
                if (this.leftYearDisable) return;

                --this.curYear;
                if (this.earlyYear === this.curYear) {
                    if (this.checkedMonth < this.earlyMonth - 1) {
                        this.checkedMonth = this.earlyMonth - 1;
                        this.curMonth = this.earlyMonth;
                    }
                    this.leftYearDisable = true;
                }
            },
            rightYearClick() {
                ++this.curYear;
                this.leftYearDisable = false;
            },
            cancelClick() {
                this.$emit('cancelClick')
            },
            confirmClick() {
                this.$emit('confirmClick', {
                    year: this.curYear,
                    month: this.curMonth,
                });
            },
        },
    };
</script>

<style scoped>
    .wtc-calendar-yearMonth {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: 14px;
        color: #212121;
        background-color: #fff;
    }

    .wtc-calendar-yearMonth-btns {
        display: flex;
        padding: 10px 0;
    }

    .wtc-calendar-yearMonth-btns>div {
        flex: 1;
        color: #276ff5;
        text-align: center;
    }

    .wtc-calendar-yearMonth-year {
        text-align: center;
        padding: 10px 0 6px 0;
        border-top: 1px solid #e5e5e5;
    }

    .wtc-calendar-yearMonth-year>div {
        display: inline-block;
        padding: 4px;
        vertical-align: bottom;
    }

    .wtc-calendar-yearMonth-months {
        width: 100%;
        padding-bottom: 6px;
    }

    .wtc-calendar-yearMonth-months .wtc-calendar-yearMonth-month-item {
        display: inline-block;
        width: 25%;
        padding: 10px 0;
        text-align: center;
        box-sizing: border-box;
    }

    .wtc-calendar-yearMonth-months .wtc-yearMonth-month-checked {
        color: #276ff5;
    }

    .wtc-calendar-yearMonth .wtc-calendar-yearMonth-year-left-disable {
        color: #ccc;
    }

    .wtc-calendar-yearMonth .wtc-calendar-yearMonth-month-item-disable {
        color: #ccc;
    }

    .wtc-yearMonth-slide-bottom-enter-active,
    .wtc-yearMonth-slide-bottom-leave-active {
        transition: transform .5s;
    }

    .wtc-yearMonth-slide-bottom-enter,
    .wtc-yearMonth-slide-bottom-leave-to {
        transform: translateY(100%)
    }
</style>