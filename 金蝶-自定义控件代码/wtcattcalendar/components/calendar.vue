<!--
 * @Author: kztai 1012049531@qq.com
 * @Date: 2022-05-30 11:26:24
 * @LastEditors: kztai 1012049531@qq.com
 * @LastEditTime: 2023-06-15 17:07:32
 * @FilePath: \vue-cli\src\components\calendar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="wtc-homePage-calendar">
        <div class="wtc-homePage-calendar-head">
            <div class="wtc-homePage-calendar-month-btn kdfont kdfont-qianfan"
                :class="{'wtc-homePage-calendar-left-month-btn-disable': isEarliestMonth}" @click="preMonthClick">
            </div>
            <div class="wtc-homePage-calendar-cur-month" @click="showYearPicker">
                {{ selectYear }}{{KDApi.getLangMsg(model, 'year')}}{{ selectMonth >9 ? selectMonth : '0'+selectMonth
                }}{{KDApi.getLangMsg(model, 'month')}}
            </div>
            <div class="wtc-homePage-calendar-month-btn kdfont kdfont-houfan" @click="nextMonthClick"></div>
        </div>

        <div class="wtc-homePage-calendar-week">
            <div class="wtc-homePage-calendar-week-item" v-for="item in week" :key="item">
                {{ item }}
            </div>
        </div>
        <div class="wtc-homePage-calendar-content-wrap" style="transform: translateX(-33.333%);">
            <div class="wtc-homePage-calendar-content content-pre-month">
                <div class="wtc-homePage-calendar-content-date-wrap" v-for="(item, index) in arrPreDate" :key="index"
                    :class="{'pre-date': item.type === 'pre','cur-date': item.type === 'cur',
          'next-date': item.type === 'next',}">
                    <div class="wtc-homePage-calendar-content-date">
                        <div class="wtc-homePage-calendar-content-date-mark"></div>
                        <div class="wtc-homePage-calendar-content-date-text">
                            {{ item.value }}
                        </div>
                        <div class="wtc-homePage-calendar-content-date-apply"></div>
                    </div>
                </div>
            </div>
            <div class="wtc-homePage-calendar-content content-cur-month">
                <div class="wtc-homePage-calendar-content-date-wrap" v-for="(item, index) in arrCurDate" :key="index"
                    :class="[
        {
          'pre-date': item.type === 'pre',
          'cur-date': item.type === 'cur',
          'next-date': item.type === 'next',
          'checked-date': item.value === selectDate,
        },
        `date-${item.date}`,
      ]" @click="dateClick($event, item.date, item.type)">
                    <div class="wtc-homePage-calendar-content-date" :class="{
          'wtc-calendar-date-actual-work': !item.off && (item.dateAttribute === 'OFFDAY' || item.dateAttribute === 'HOLIDAY'),
          'wtc-calendar-date-actual-off':(item.off && item.dateAttribute === 'WORKDAY') ||item.dateAttribute === 'HOLIDAY',
          'wtc-calendar-date-rest': item.dateAttribute === 'OFFDAY',
          'wtc-calendar-date-today': item.today,
        }">
                        <div class="wtc-homePage-calendar-content-date-mark"
                            v-if="item.off && (item.dateAttribute === 'WORKDAY' || item.dateAttribute === 'HOLIDAY')">
                            {{KDApi.getLangMsg(model, 'rest')}}
                        </div>
                        <div class="wtc-homePage-calendar-content-date-mark"
                            v-if="!item.off && (item.dateAttribute === 'OFFDAY' || item.dateAttribute === 'HOLIDAY')">
                            {{KDApi.getLangMsg(model, 'work')}}
                        </div>
                        <div class="wtc-homePage-calendar-content-date-text">
                            {{ item.today ? KDApi.getLangMsg(model, 'today'): item.value }}
                        </div>
                        <div v-if="item.abnormal" class="wtc-homePage-calendar-content-date-apply">
                            <div class="wtc-homePage-calendar-content-date-apply-inner"></div>
                        </div>
                        <div v-else-if="item.holiday" class="wtc-homePage-calendar-content-date-apply">
                            {{ item.holiday }}
                        </div>
                        <div v-else-if="item.noRoster" class="wtc-homePage-calendar-content-date-apply">
                            无排班
                        </div>
                        <div v-else class="wtc-homePage-calendar-content-date-apply" :title="item.billListText">
                            {{ item.billListText }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="wtc-homePage-calendar-content content-next-month">
                <div class="wtc-homePage-calendar-content-date-wrap" v-for="(item, index) in arrNextDate" :key="index"
                    :class="{'pre-date': item.type === 'pre','cur-date': item.type === 'cur',
          'next-date': item.type === 'next',}">
                    <div class="wtc-homePage-calendar-content-date">
                        <div class="wtc-homePage-calendar-content-date-mark"></div>
                        <div class="wtc-homePage-calendar-content-date-text">
                            {{ item.value }}
                        </div>
                        <div class="wtc-homePage-calendar-content-date-apply"></div>
                    </div>
                </div>
            </div>
        </div>
        <dialogWrap ref="dialogWrap" @hideDialog="hideYearPicker" :showWrap="showWrap">
            <selectYearMonth :year="selectYear" :month="selectMonth" :earliestMonth="earliestMonth" :showWrap="showWrap"
                :model="model" :KDApi="KDApi" @cancelClick="hideYearPicker" @confirmClick="yearPickerConfirm">
            </selectYearMonth>
        </dialogWrap>
    </div>
</template>

<script>
    import selectYearMonth from "./selectYearMonth.vue";
    import dialogWrap from "./dialogWrap.vue";

    export default {
        name: "HelloWorld",
        components: {
            selectYearMonth,
            dialogWrap,
        },
        props: ["initDate", "model", 'earliestMonth', 'KDApi'],
        data() {
            return {
                week: [
                    this.KDApi.getLangMsg(this.model, 'sun'),
                    this.KDApi.getLangMsg(this.model, 'mon'),
                    this.KDApi.getLangMsg(this.model, 'tue'),
                    this.KDApi.getLangMsg(this.model, 'wed'),
                    this.KDApi.getLangMsg(this.model, 'thu'),
                    this.KDApi.getLangMsg(this.model, 'fri'),
                    this.KDApi.getLangMsg(this.model, 'sat'),
                ],
                selectYear: 2022,
                selectMonth: 10,
                selectDate: 1,
                standardDate: new Date(), // 默认显示年月
                arrCurDate: [],
                arrPreDate: [],
                arrNextDate: [],
                today: "",
                showWrap: false,  // 控制年月选择器的显示与隐藏
                isEarliestMonth: false,
                timer: null
            };
        },

        mounted() {
            try {
                this.today = this.formatDate(new Date(), "date");
                this.init(this.initDate);
            } catch (e) {
                alert(JSON.stringify({
                    months: this.initDate,
                    earliestMonth: this.earliestMonth,
                    error: e.message
                }));
            }

        },

        watch: {
            initDate(newValue, oldValue) {
                try {
                    this.init(newValue);
                } catch (e) {
                    alert(JSON.stringify({
                        months: newValue,
                        error: e.message
                    }));
                }

            }
        },

        methods: {
            init(date) {
                this.standardDate = new Date(date);
                this.refreshCalendar();
            },

            refreshCalendar() {
                let $this = this;
                this.selectYear = this.getYear(this.standardDate);
                this.selectMonth = this.getMonth(this.standardDate);
                this.selectDate = this.getDate(this.standardDate);

                // 渲染当前月日期
                this.getMonthDate(this.selectYear, this.selectMonth, this.arrCurDate);

                // 渲染上个月日期
                let temp = this.getPreMonth(this.selectYear, this.selectMonth);
                this.getMonthDate(temp.year, temp.month, this.arrPreDate);

                // 渲染下个月日期
                temp = this.getNextMonth(this.selectYear, this.selectMonth);
                this.getMonthDate(temp.year, temp.month, this.arrNextDate);

                // 设置当前月的日期面板的高度：
                if ($this.arrCurDate.length > 35) {
                    this.$el.style.height = "410px";
                } else if ($this.arrCurDate.length < 35) {
                    this.$el.style.height = "302px";
                } else {
                    this.$el.style.height = "356px";
                }

                this.dateInvoke();
            },

            /*
             * 组织好需要获取考勤记录的日期
             */
            dateInvoke() {
                let arrTemp = [];
                let date_zero = this.formatDate_zero(this.selectYear, this.selectMonth, this.selectDate);

                // 组织返回给后台的数据：
                for (let i = 0; i < this.arrCurDate.length; i++) {
                    if (this.arrCurDate[i].type === 'cur') {
                        arrTemp.push(this.arrCurDate[i].date);
                    }
                }

                this.model.invoke("getDateData", {
                    dateList: arrTemp,
                    chooseDay: date_zero,
                });
            },

            /*
             * 计算出当前年月对应的所有需显示日期
             */
            getMonthDate(year, month, arrDate) {
                let preYearMonth = this.getPreMonth(year, month);
                let nextYearMonth = this.getNextMonth(year, month);

                // 获取上个月最后一天
                let preMonthLastDate = this.getPreMonthLastDate(year, month);
                // 获取本月最后一天
                let curMonthLastDate = this.getPreMonthLastDate(nextYearMonth.year, nextYearMonth.month);

                // 获取当前年月的第一天对应是星期几：
                let tempDate = year + "/" + month + "/01";
                let fisrtDateWeek = new Date(tempDate).getDay(); //星期天是0，星期六是6

                // 获取当前年月的最后一天对应是星期几：
                tempDate = year + "/" + month + "/" + curMonthLastDate;
                let lastDateWeek = new Date(tempDate).getDay(); //星期天是0，星期六是6

                arrDate.length = 0; // 清空原数据
                for (let i = 1; i <= curMonthLastDate; i++) {
                    let istoday = this.isToday(year, month, i);

                    arrDate.push({
                        value: i,
                        type: "cur",
                        date: this.formatDate_zero(year, month, i),
                        today: istoday,
                        holiday: "",
                        dateAttribute: "",
                        off: false,
                        billListText: "",
                        abnormal: false,
                        noRoster: false,
                    });
                }

                for (let i = 0; i < fisrtDateWeek; i++) {
                    arrDate.unshift({
                        value: '-' + (preMonthLastDate - i),
                        type: "pre",
                        date: this.formatDate_zero(preYearMonth.year, preYearMonth.month, preMonthLastDate - i),
                        today: this.isToday(preYearMonth.year, preYearMonth.month, preMonthLastDate - i),
                        holiday: "",
                        dateAttribute: "",
                        off: false,
                        billListText: "",
                        abnormal: false,
                        noRoster: false,
                    });
                }

                for (let i = 0; i < 6 - lastDateWeek; i++) {
                    arrDate.push({
                        value: '+' + (i + 1),
                        type: "next",
                        date: this.formatDate_zero(nextYearMonth.year, nextYearMonth.month, i + 1),
                        today: this.isToday(nextYearMonth.year, nextYearMonth.month, i + 1),
                        holiday: "",
                        dateAttribute: "",
                        off: false,
                        billListText: "",
                        abnormal: false,
                        noRoster: false,
                    });
                }
            },

            showYearPicker() {
                this.showWrap = true;
            },

            hideYearPicker() {
                this.showWrap = false;
            },

            isNoRoster(date) {
                for (let i = 0; i < this.arrCurDate.length; i++) {
                    if (this.arrCurDate[i].date === date && this.arrCurDate[i].noRoster) {
                        return true;
                    }
                }
                return false
            },

            addDateData(arrData) {

                for (let i = 0; i < this.arrCurDate.length; i++) {
                    if (this.arrCurDate[i].type === 'cur') {
                        this.arrCurDate[i].noRoster = true;
                        for (let j = 0; j < arrData.length; j++) {
                            if (this.arrCurDate[i].date === arrData[j].date) {
                                this.arrCurDate[i].holiday = arrData[j].holiday;
                                this.arrCurDate[i].dateAttribute = arrData[j].dateAttribute;
                                this.arrCurDate[i].off = arrData[j].off;
                                this.arrCurDate[i].billListText = arrData[j].billList ? arrData[j].billList.join(",") : '';
                                this.arrCurDate[i].abnormal = arrData[j].abnormal;
                                this.arrCurDate[i].noRoster = false;
                            }
                        }
                    }
                }
            },

            /*
            * 年月日[string] 不需要自己补充0
            * */
            isToday(year, month, date) {
                month = month > 9 ? month : "0" + month;
                date = date > 9 ? date : "0" + date;
                return year + "-" + month + "-" + date === this.today;
            },

            /*
             * 点击日期，如果点击的是下一个月的日期，则切换到下一个月
             */
            dateClick($event, date, type) {
                if (type !== 'cur') return;  //TODO: 当前版本只需实现点击本月的日期，点击上月/下月保留，以防需求更改

                let $this = this;
                let tempDate = Number(date.split("-")[2]);

                // 判断是否大于今天，大于则提示“不允许查看未来数据”
                let exceed = this.exceedToday($this.selectYear, $this.selectMonth, tempDate);
                if (exceed) {
                    $this.$root.myTool.message_soft({ type: 'warn', message: this.KDApi.getLangMsg(this.model, 'msg2') })
                    // alert('不允许查看未来数据')
                } else {
                    this.selectDate = tempDate;
                    if (type === "pre") {
                        this.preMonthClick(function () {
                            date =
                                $this.selectYear + "-" + $this.selectMonth + "-" + $this.selectDate;
                            $this.$nextTick(function () {
                                $this.changeCheckedDate(date);
                            });
                        });
                    } else if (type === "next") {
                        this.nextMonthClick(function () {
                            date =
                                $this.selectYear + "-" + $this.selectMonth + "-" + $this.selectDate;
                            $this.$nextTick(function () {
                                $this.changeCheckedDate(date);
                            });
                        });
                    } else {
                        let date_zero = this.formatDate_zero(this.selectYear, this.selectMonth, this.selectDate);
                        this.model.invoke("getAttRecord", date_zero);
                        // this.$emit('test');
                        // 切换高亮的日期
                        this.changeCheckedDate(date);
                        // 未排班则tips提示：
                        if (this.isNoRoster(date)) {
                            $this.$root.myTool.message_soft({ type: 'warn', message: date + '未排班，请联系管理员。' })
                        }
                    }
                }
            },

            /*
            * 是否超出今天
            * */
            exceedToday(year, month, date) {
                let destTimestamp = new Date(year + '/' + month + '/' + date + ' 00:00').getTime();
                let temp = (this.today + ' 00:00').replace(/-/g, '/');
                let todayTimestamp = new Date(temp).getTime();
                return destTimestamp > todayTimestamp;
            },

            /*
             * 切换高亮的日期
             */
            changeCheckedDate(date) {
                let $this = this;
                // 取消所有选中
                let arrDom_contentDate = this.$el.querySelectorAll(
                    ".content-cur-month .wtc-homePage-calendar-content-date-wrap"
                );
                arrDom_contentDate.forEach(function (item) {
                    $this.removeClass(item, "checked-date");
                });

                // 高亮当前选中
                let dom_checkedDate = this.$el.querySelector(`.date-${date}`);
                dom_checkedDate.className = dom_checkedDate.className + " checked-date";
            },

            /*
             * 点击向前一月按钮
             */
            preMonthClick(callback) {
                if (this.isEarliestMonth) return;   // 已是可点击的最早月份
                if (this.timer) return;  // 上一个点击动画还没有结束，不允许再点击

                let $this = this;
                let temp = this.getPreMonth(this.selectYear, this.selectMonth);

                let temp1 = (this.earliestMonth + "/01 00:00").replace(/-/g, '/');
                // 判断是否达到最早的月份
                if (new Date(temp.year + "/" + temp.month + "/01 00:00").getTime() === new Date(temp1).getTime()) this.isEarliestMonth = true;

                // 还需判断该日期是否存在：
                let tempDate = this.toExistDate(temp.year, temp.month, this.selectDate);
                this.standardDate = new Date(tempDate);

                this.moveAnimation('left', function () {
                    $this.refreshCalendar();
                    $this.$el.querySelector(".wtc-homePage-calendar-content-wrap").style.transform = "translateX(-33.333%)";
                    if (callback && typeof callback === 'function') callback();
                });
            },

            /*
             * 点击向后一月按钮
             */
            nextMonthClick(callback) {
                if (this.timer) return;  // 上一个点击动画还没有结束，不允许再点击

                let $this = this;
                let temp = this.getNextMonth(this.selectYear, this.selectMonth);

                this.isEarliestMonth = false;

                // 判断是否超过本月，大于则提示“不允许查看未来数据”
                let exceedMonth = this.exceedToday(temp.year, temp.month, 1);
                if (exceedMonth) {
                    $this.$root.myTool.message_soft({ type: 'warn', message: this.KDApi.getLangMsg(this.model, 'msg2') })
                    // alert('不允许查看未来数据')
                } else {
                    // 判断是否大于今天，大于则定位到今天，否则定位到selectDate：
                    let exceedToday1 = this.exceedToday(temp.year, temp.month, this.selectDate);
                    if (exceedToday1) {
                        this.standardDate = new Date();
                    } else {
                        // 还需判断该日期是否存在：
                        let tempDate = this.toExistDate(temp.year, temp.month, this.selectDate);
                        this.standardDate = new Date(tempDate);
                    }

                    this.moveAnimation('right', function () {
                        $this.refreshCalendar();
                        $this.$el.querySelector(".wtc-homePage-calendar-content-wrap").style.transform = "translateX(-33.333%)";
                        if (callback && typeof callback === 'function') callback();
                    });
                }
            },

            /*
            * 年月弹窗点击确定后，刷新当前日历
            * */
            yearPickerConfirm(yearMonth) {
                let temp1 = (this.earliestMonth + "/01 00:00").replace(/-/g, '/');
                // 判断是否达到最早的月份
                if (new Date(yearMonth.year + "/" + yearMonth.month + "/01 00:00").getTime() === new Date(temp1).getTime()) {
                    this.isEarliestMonth = true;
                } else {
                    this.isEarliestMonth = false;
                }

                // 判断是否超过本月，大于则提示“不允许查看未来数据”
                let exceedMonth = this.exceedToday(yearMonth.year, yearMonth.month, 1);
                if (exceedMonth) {
                    this.$root.myTool.message_soft({ type: 'warn', message: this.KDApi.getLangMsg(this.model, 'msg2') })
                    // alert('不允许查看未来数据')
                } else {
                    // 判断是否大于今天，大于则定位到今天，否则定位到selectDate：
                    let exceedToday1 = this.exceedToday(yearMonth.year, yearMonth.month, this.selectDate);
                    if (exceedToday1) {
                        this.standardDate = new Date();
                    } else {
                        // 还需判断该日期是否存在：
                        let tempDate = this.toExistDate(yearMonth.year, yearMonth.month, this.selectDate);
                        this.standardDate = new Date(tempDate);
                    }
                    this.refreshCalendar();
                    this.hideYearPicker();
                }
            },

            /*
            * 给定年月日可能不存在，将其转化为存在的日期
            * */
            toExistDate(year, month, date) {
                // 先判断该日期是否存在：
                if (new Date(year + "/" + month + "/" + date).getDate() === date) {
                    return year + "/" + month + "/" + date;
                } else {
                    let nextYearMonth = this.getNextMonth(year, month);
                    let lastDay = this.getPreMonthLastDate(nextYearMonth.year, nextYearMonth.month);
                    return year + "/" + month + "/" + lastDay;
                }
            },

            /*
             * 获取当前年月对应的上一个年月
             */
            getPreMonth(year, month) {
                return month === 1
                    ? {
                        year: --year,
                        month: 12,
                    }
                    : {
                        year: year,
                        month: --month,
                    };
            },

            /*
             * 获取当前年月对应的下一个年月
             */
            getNextMonth(year, month) {
                return month === 12
                    ? {
                        year: ++year,
                        month: 1,
                    }
                    : {
                        year: year,
                        month: ++month,
                    };
            },

            /*
             * 渲染向前向后一个月的动画效果
             */
            moveAnimation(type, callback) {
                let $this = this;
                let dom_contentWrap = this.$el.querySelector(".wtc-homePage-calendar-content-wrap");
                let num = -33;
                this.timer = setInterval(function () {
                    type === 'left' ? ++num : --num;
                    dom_contentWrap.style.transform = `translateX(${num}%)`;
                    if (type === 'left' ? num >= 0 : num <= -66) {
                        clearInterval($this.timer);
                        $this.timer = null;
                        callback();
                    }
                }, 2);
            },

            /*
             * 返回上个月最后一天
             */
            getPreMonthLastDate(year, month) {
                let tempDate = year + "/" + month + "/01 00:00:00";
                let timestamp = new Date(tempDate).getTime() - 1;
                return new Date(timestamp).getDate();
            },

            /*
             * 格式化日期
             * date 支持字符串型'2022-09-09'，支持Date型，也支持其他型（其他型会用new Date()代替）
             * type 显示格式：支持'date'，'time'
             * */
            formatDate(date, type) {
                let year = this.getYear(date);
                let month = this.getMonth(date);
                let date1 = this.getDate(date);
                let hours = this.getHours(date);
                let minutes = this.getMinutes(date);

                month = month > 9 ? month : "0" + month;
                date1 = date1 > 9 ? date1 : "0" + date1;
                hours = hours > 9 ? hours : "0" + hours;
                minutes = minutes > 9 ? minutes : "0" + minutes;

                return type === "date"
                    ? year + "-" + month + "-" + date1
                    : year + "-" + month + "-" + date1 + " " + hours + ":" + minutes;
            },

            formatDate_zero(year, month, date) {
                month = month > 9 ? month : "0" + month;
                date = date > 9 ? date : "0" + date;
                return year + '-' + month + '-' + date;
            },

            getYear(date) {
                return date.getFullYear();
            },
            getMonth(date) {
                return date.getMonth() + 1;
            },
            getDate(date) {
                return date.getDate();
            },
            getHours(date) {
                return date.getHours();
            },
            getMinutes(date) {
                return date.getMinutes();
            },

            removeClass(target, className) {
                let arr = target.className.split(" ");
                let index = arr.indexOf(className);
                if (index !== -1) {
                    arr.splice(index, 1);
                    target.className = arr.join(" ");
                }
            },
        },
    };
</script>


<style scoped>
    .wtc-homePage-calendar {
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-week {
        position: relative;
        display: flex;
        font-size: 12px;
        /*border-top: 1px solid #e5e5e5;*/
        padding: 10px 0;
        color: #999;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-week::after {
        content: '';
        width: 200%;
        height: 200%;
        position: absolute;
        top: 0;
        left: 0;
        border-top: 1px solid #e5e5e5;
        -webkit-transform: scale(0.5, 0.5);
        transform: scale(0.5, 0.5);
        -webkit-transform-origin: top left;
    }


    .wtc-homePage-calendar-week .wtc-homePage-calendar-week-item {
        flex: 1;
        text-align: center;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head {
        text-align: center;
        padding: 10px 0;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head .wtc-homePage-calendar-cur-month {
        display: inline-block;
        font-weight: 700;
        font-size: 16px;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head .wtc-homePage-calendar-month-btn {
        display: inline-block;
        padding: 0 10px;
        font-size: 16px;
        vertical-align: bottom;
        line-height: 20px;
        color: #999;
        font-weight: 700;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head .wtc-homePage-calendar-left-month-btn-disable {
        color: #ccc;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-content-wrap {
        width: 300%;
        display: flex;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-content {
        font-size: 0;
        width: 100%;
    }

    .wtc-homePage-calendar-content .wtc-homePage-calendar-content-date-wrap {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 14.2%;
        height: 54px;
        padding: 2px;
        box-sizing: border-box;
        cursor: pointer;
        vertical-align: bottom;
    }

    .wtc-homePage-calendar-content .pre-date,
    .wtc-homePage-calendar-content .next-date {
        opacity: 0.5;
        color: #fff;
    }

    .wtc-homePage-calendar-content .checked-date .wtc-homePage-calendar-content-date {
        border: 1px solid #276ff5;
        background-color: #f2f9ff;
        color: #276ff5;
    }

    /* .wtc-homePage-calendar-content .wtc-homePage-calendar-content-date {
          width: 24px;
          height: 24px;
          line-height: 24px;
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -12px;
          margin-top: -12px;
          border-radius: 50%;
          overflow: hidden;
          text-align: center;
        } */

    .wtc-homePage-calendar-content .wtc-homePage-calendar-content-date {
        position: relative;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #fff;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-today .wtc-homePage-calendar-content-date-text {
        color: #276ff5;
    }

    .pre-date .wtc-calendar-date-today .wtc-homePage-calendar-content-date-text {
        color: #fff;
    }

    .next-date .wtc-calendar-date-today .wtc-homePage-calendar-content-date-text {
        color: #fff;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-actual-off {
        color: #999;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-rest {
        color: #999;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-actual-work {
        color: #212121;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-actual-off .wtc-homePage-calendar-content-date-mark {
        background-color: #ff854d;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-actual-work .wtc-homePage-calendar-content-date-mark {
        background-color: #16b8b1;
    }

    .wtc-homePage-calendar-content-date .wtc-homePage-calendar-content-date-mark {
        position: absolute;
        right: 0;
        top: 8px;
        /* height: 18px; */
        font-size: 12px;
        transform: scale(0.8);
        width: 16px;
        height: 16px;

        color: #fff;
        border-radius: 2px;
        text-align: center;
    }

    .wtc-homePage-calendar-content-date .wtc-homePage-calendar-content-date-text {
        height: 31px;
        line-height: 46px;
        text-align: center;
        font-size: 16px;
        font-weight: 700;
    }

    .wtc-homePage-calendar-content-date .wtc-homePage-calendar-content-date-apply {
        height: 14px;
        text-align: center;
        font-size: 12px;
        transform: scale(0.8);
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .wtc-homePage-calendar-content-date .wtc-homePage-calendar-content-date-apply .wtc-homePage-calendar-content-date-apply-inner {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #ff5257;
    }
</style>