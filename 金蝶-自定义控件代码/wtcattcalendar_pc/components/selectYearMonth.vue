<template>
    <div class="wtc-calendar-yearMonth" @click.stop v-show="showWrap">
        <div class="wtc-yearMonth-year-wrap" v-show="showYearPanel">
            <div class="wtc-yearMonth-year-title">
                <span class="wtc-yearMonth-btn-left kdfont kdfont-shuangjiantou_zuo" @click="getPreYears"></span>
                <span class="wtc-yearMonth-year-text1">{{ yearPanelTitle }}</span>
                <span class="wtc-yearMonth-btn-right kdfont kdfont-shuangjiantou" @click="getNextYears"></span>
            </div>
            <ul class="wtc-yearMonth-year-list">
                <li class="wtc-calendar-yearMonth-option-item" :class="[
          selectYear(year1),
          disableYear(year1),
        ]" v-for="(year1, index) in arrYear" :key="index" @click="yearClick(year1)">
                    <div>{{ year1 }}</div>
                </li>
            </ul>
        </div>
        <div class="wtc-yearMonth-month-wrap" v-show="!showYearPanel">
            <div class="wtc-yearMonth-year-title">
                <span class="wtc-yearMonth-btn-left kdfont kdfont-shuangjiantou_zuo" @click="leftYearClick"></span>
                <span class="wtc-yearMonth-year-text" @click="showYearPanel = true">{{ curYear }}年</span>
                <span class="wtc-yearMonth-btn-right kdfont kdfont-shuangjiantou" @click="rightYearClick"></span>
            </div>
            <div class="wtc-calendar-yearMonth-months">
                <div class="wtc-calendar-yearMonth-option-item" :class="[
          selectMonth(index),
          disableMonth(index),
        ]" v-for="(month, index) in arrMonth" :key="index" @click="monthClick(index)">
                    <div>{{ month }}</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "yearMonth",
        props: ["year", "month", 'showWrap', 'earliestMonth', 'KDApi', 'model'],
        data() {
            return {
                arrYear: [],
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
                curYear: this.year,
                curMonth: this.month,
                earlyMonth: 0,
                earlyYear: 0,
                leftYearDisable: false,
                monthDisable: false,
                showYearPanel: false,
                yearPanelTitle: ''
            };
        },
        watch: {
            year(newValue, oldValue) {
                this.curYear = newValue
            },
            month(newValue, oldValue) {
                this.curMonth = newValue;
            },
        },

        mounted() {
            this.earlyYear = Number(this.earliestMonth.split('-')[0]);
            this.earlyMonth = Number(this.earliestMonth.split('-')[1]);

            if (this.earlyYear === this.curYear) this.leftYearDisable = true;
            this.refreshYearPanel(this.curYear - 7);
            this.yearPanelTitle = (this.curYear - 7) + '-' + (this.curYear + 8) + '年';
        },

        methods: {
            getPreYears() {
                this.refreshYearPanel(this.arrYear[0] - 16);
            },
            getNextYears() {
                this.refreshYearPanel(this.arrYear[0] + 16);
            },
            refreshYearPanel(firstYear) {
                this.arrYear = [];
                for (let i = firstYear; i <= firstYear + 15; i++) {
                    this.arrYear.push(i);
                }
                this.yearPanelTitle = this.arrYear[0] + '-' + this.arrYear[this.arrYear.length - 1] + '年';
            },
            yearClick(year) {
                if (year < this.earlyYear) return;

                this.showYearPanel = false;
                this.curYear = year;
            },
            selectYear(year) {
                return { "wtc-yearMonth-month-checked": year === this.curYear };
            },
            disableYear(year) {
                return { "wtc-calendar-yearMonth-option-item-disable": year < this.earlyYear };
            },


            monthClick(index) {
                if (this.curYear < this.earlyYear || this.curYear === this.earlyYear && index < this.earlyMonth - 1) return;

                this.curMonth = index + 1;

                this.$emit('confirmClick', {
                    year: this.curYear,
                    month: this.curMonth,
                });
            },

            selectMonth(index) {
                return { "wtc-yearMonth-month-checked": this.year === this.curYear && index === this.curMonth - 1 };
            },
            disableMonth(index) {
                return { "wtc-calendar-yearMonth-option-item-disable": this.curYear < this.earlyYear || this.curYear === this.earlyYear && index < this.earlyMonth - 1 };
            },
            leftYearClick() {
                --this.curYear;
                if (this.earlyYear === this.curYear) {
                    if (this.curMonth < this.earlyMonth) {
                        this.curMonth = this.earlyMonth;
                    }
                }
                this.refreshYearPanel(this.curYear - 7)
            },
            rightYearClick() {
                ++this.curYear;
                this.refreshYearPanel(this.curYear - 7)
            },

        },
    };
</script>

<style scoped>
    .wtc-calendar-yearMonth {
        position: absolute;
        top: 33px;
        left: 0;
        width: 250px;
        color: #212121;
        background-color: #fff;
        z-index: 2;
        font-weight: 400;
        /*border: 1px solid #d9d9d9;*/
        border-radius: 2px;
        box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.20);
        font-size: 14px;
        cursor: default;
    }

    .wtc-yearMonth-year-title {
        display: flex;
        justify-content: space-between;
        padding: 0 6px;
        border-bottom: 1px solid #d9d9d9;
        background-color: #fafafa;
    }

    .wtc-yearMonth-year-title>span {
        padding: 0 4px;
        vertical-align: bottom;
        cursor: pointer;
    }

    .wtc-yearMonth-year-title>span:hover {
        color: var(--theme-color);
    }

    .wtc-calendar-yearMonth .wtc-yearMonth-year-text1 {
        cursor: default;
    }

    .wtc-calendar-yearMonth .wtc-yearMonth-year-text1:hover {
        color: #212121;
    }

    .wtc-yearMonth-btn-left,
    .wtc-yearMonth-btn-right {
        color: #999;
    }

    .wtc-calendar-yearMonth-months,
    .wtc-yearMonth-year-list {
        width: 100%;
        padding-bottom: 6px;
    }

    .wtc-calendar-yearMonth-option-item {
        display: inline-block;
        width: 25%;
        padding: 10px;
        text-align: center;
        box-sizing: border-box;
    }

    .wtc-calendar-yearMonth-option-item>div {
        border-radius: 2px;
        font-size: 12px;
        cursor: pointer;
    }

    .wtc-calendar-yearMonth-option-item:hover>div {
        background-color: #eee;
    }

    .wtc-yearMonth-month-checked>div {
        color: #fff;
        background-color: var(--theme-color);
    }

    .wtc-yearMonth-month-checked:hover>div {
        background-color: var(--theme-color);
    }

    .wtc-calendar-yearMonth-option-item-disable {
        opacity: 0.3;
    }

    .wtc-calendar-yearMonth-option-item-disable:hover>div {
        background-color: #fff;
        cursor: default;
    }

    .wtc-yearMonth-month-checked.wtc-calendar-yearMonth-option-item-disable:hover>div {
        background-color: var(--theme-color);
    }
</style>