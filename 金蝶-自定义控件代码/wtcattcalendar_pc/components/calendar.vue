<template>
    <div class="wtc-homePage-calendar">
        <div class="wtc-homePage-calendar-head">
            <div class="wtc-homePage-calendar-month-btn kdfont kdfont-qianfan"
                 :class="{'wtc-homePage-calendar-left-month-btn-disable': isEarliestMonth}" @click="preMonthClick">
            </div>
            <div class="wtc-homePage-calendar-cur-month" @click="showYearPicker">
                <a class="wtc-homePage-calendar-cur-month-text" href="#" @blur="hideYearPicker" @click.prevent>
                    <span>{{ selectYear }}-{{ selectMonth >9 ? selectMonth : '0'+selectMonth }}</span>
                    <i class="kdfont kdfont-riqixuanze"></i>
                    <selectYearMonth
                            ref="selectYearMonth"
                            :year="selectYear"
                            :month="selectMonth"
                            :earliestMonth="earliestMonth"
                            :showWrap="showWrap"
                            :model="model"
                            :KDApi="KDApi"
                            @confirmClick="yearPickerConfirm">
                    </selectYearMonth>
                </a>

                <!--<div class="wtc-homePage-calendar-year-month-dialog">-->

                <!--</div>-->
            </div>
            <div class="wtc-homePage-calendar-month-btn kdfont kdfont-houfan" @click="nextMonthClick"></div>
        </div>

        <div class="wtc-homePage-calendar-week">
            <div class="wtc-homePage-calendar-week-item" :class="{'wtc-homePage-calendar-week-weekend': index===5||index===6}" v-for="(item,index) in week" :key="item">
                {{ item }}
            </div>
        </div>

        <div
                class="wtc-homePage-calendar-content-wrap"
                :class="{
                'wtc-homePage-calendar-min': heightType === 'min',
                'wtc-homePage-calendar-middle': heightType === 'middle',
                'wtc-homePage-calendar-max': heightType === 'max',
                }"
                style="transform: translateX(-33.333%);">
            <div class="wtc-homePage-calendar-content content-pre-month">
                <div class="wtc-homePage-calendar-content-date-wrap" v-for="(item, index) in arrPreDate" :key="index"
                     :class="{'pre-date': item.type === 'pre','cur-date': item.type === 'cur',
          'next-date': item.type === 'next',}">
                    <div class="wtc-homePage-calendar-content-date">
                        <div class="wtc-homePage-calendar-content-date-top">
                            <div class="wtc-homePage-calendar-content-date-text"
                                 :class="{'wtc-homePage-calendar-content-date-text-today': item.today}">
                                {{ item.value }}
                            </div>
                        </div>
                        <div v-if="item.abnormal" class="wtc-homePage-calendar-content-date-middle"></div>
                        <div class="wtc-homePage-calendar-content-date-bottom"></div>
                    </div>
                </div>
            </div>

            <div class="wtc-homePage-calendar-content content-cur-month">
                <div class="wtc-homePage-calendar-content-date-wrap"
                     v-for="(item, index) in arrCurDate"
                     :key="index"
                     :class="[{
                        'pre-date': item.type === 'pre',
                        'cur-date': item.type === 'cur',
                        'next-date': item.type === 'next',
                        'checked-date': item.value === selectDate && item.type === 'cur',
                        },
                    `date-${item.date}`]"
                     @click="dateClick($event, item.date, item.type, item.dateAttribute)">
                    <div class="wtc-homePage-calendar-content-date" :class="{
          'wtc-calendar-date-actual-work': !item.off && (item.dateAttribute === 'OFFDAY' || item.dateAttribute === 'HOLIDAY'),
          'wtc-calendar-date-actual-off':(item.off && item.dateAttribute === 'WORKDAY') || item.dateAttribute === 'HOLIDAY',
          'wtc-calendar-date-restday': item.dateAttribute === 'OFFDAY' || item.dateAttribute === 'HOLIDAY', 'wtc-calendar-date-abnormal': item.abnormal
        }">
                        <div class="wtc-homePage-calendar-content-date-top">
                            <div class="wtc-homePage-calendar-content-date-text"
                                 :class="{'wtc-homePage-calendar-content-date-text-today': item.today}">
                                {{ item.value }}
                            </div>
                            <div class="wtc-homePage-calendar-content-date-right">
                                <div v-if="item.holiday" class="wtc-homePage-calendar-content-date-holiday"
                                     :title="item.holiday">
                                    {{ item.holiday }}
                                </div>
                                <div class="wtc-homePage-calendar-content-date-mark"
                                     v-if="item.off && (item.dateAttribute === 'WORKDAY' || item.dateAttribute === 'HOLIDAY')">
                                    {{KDApi.getLangMsg(model, 'rest')}}
                                </div>
                                <div class="wtc-homePage-calendar-content-date-mark"
                                     v-if="!item.off && (item.dateAttribute === 'OFFDAY' || item.dateAttribute === 'HOLIDAY')">
                                    {{KDApi.getLangMsg(model, 'work')}}
                                </div>
                            </div>
                        </div>

                        <div v-if="item.abnormal" class="wtc-homePage-calendar-content-date-middle"></div>

                        <div class="wtc-homePage-calendar-content-date-bottom">
                            <div v-show="item.noRoster"
                                 class="wtc-homePage-calendar-content-date-apply wtc-homePage-calendar-content-date-noRoster">
                                <i></i>
                                <span>无排班</span>
                            </div>
                            <div class="wtc-homePage-calendar-content-date-apply-list">
                                <ul v-if="item.billList.length>2" class="wtc-homePage-calendar-content-date-apply-list">
                                    <li class="wtc-homePage-calendar-content-date-apply">
                                        <i></i>
                                        <span>{{ item.billList[0] }}</span>
                                    </li>
                                    <li class="wtc-homePage-calendar-content-date-apply">
                                        <b class="wtc-homePage-calendar-content-date-apply-more-icon kdfont kdfont-gengduo3"
                                           :title="item.billListText"></b>
                                    </li>
                                </ul>
                                <ul v-else class="wtc-homePage-calendar-content-date-apply-list">
                                    <li class="wtc-homePage-calendar-content-date-apply"
                                        v-for="(billText, index) in item.billList" :key="index">
                                        <i></i>
                                        <span>{{ billText }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="wtc-homePage-calendar-content content-next-month">
                <div class="wtc-homePage-calendar-content-date-wrap" v-for="(item, index) in arrNextDate" :key="index"
                     :class="{'pre-date': item.type === 'pre','cur-date': item.type === 'cur',
          'next-date': item.type === 'next',}">
                    <div class="wtc-homePage-calendar-content-date">
                        <div class="wtc-homePage-calendar-content-date-top">
                            <div class="wtc-homePage-calendar-content-date-text"
                                 :class="{'wtc-homePage-calendar-content-date-text-today': item.today}">
                                {{ item.value }}
                            </div>
                        </div>
                        <div v-if="item.abnormal" class="wtc-homePage-calendar-content-date-middle"></div>
                        <div class="wtc-homePage-calendar-content-date-bottom"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import selectYearMonth from "./selectYearMonth.vue";

    export default {
        name: "HelloWorld",
        components: {
            selectYearMonth,
        },
        props: ["initDate", "model", 'earliestMonth', 'KDApi'],
        data() {
            return {
                week: [
                    this.KDApi.getLangMsg(this.model, 'mon'),
                    this.KDApi.getLangMsg(this.model, 'tue'),
                    this.KDApi.getLangMsg(this.model, 'wed'),
                    this.KDApi.getLangMsg(this.model, 'thu'),
                    this.KDApi.getLangMsg(this.model, 'fri'),
                    this.KDApi.getLangMsg(this.model, 'sat'),
                    this.KDApi.getLangMsg(this.model, 'sun'),
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
                timer: null,
                heightType: 'middle'
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
                    this.heightType = "max";
                } else if ($this.arrCurDate.length < 35) {
                    this.heightType = "min";
                } else {
                    this.heightType = "middle";
                }

                this.$emit('heightChange', this.heightType);
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
                if (fisrtDateWeek === 0) fisrtDateWeek = 7;  // 将 日一二三四五六 模式改为 一二三四五六日

                // 获取当前年月的最后一天对应是星期几：
                tempDate = year + "/" + month + "/" + curMonthLastDate;
                let lastDateWeek = new Date(tempDate).getDay(); //星期天是0，星期六是6
                if (lastDateWeek === 0) lastDateWeek = 7;  // 将 日一二三四五六 模式改为 一二三四五六日

                arrDate.length = 0; // 清空原数据
                for (let i = 1; i <= curMonthLastDate; i++) {
                    let istoday = this.isToday(year, month, i);
                    let formatDate = this.formatDate_zero(year, month, i);
                    let isWeekend = new Date(formatDate).getDay() === 0 || new Date(formatDate).getDay() === 6;
                    arrDate.push({
                        value: i,
                        type: "cur",
                        date: formatDate,
                        today: istoday,
                        isWeekend: isWeekend,
                        holiday: "",
                        dateAttribute: "",
                        off: false,
                        billList: [],
                        billListText: "",
                        abnormal: false,
                        noRoster: false,
                    });
                }

                for (let i = 0; i < fisrtDateWeek - 1; i++) {
                    let formatDate = this.formatDate_zero(preYearMonth.year, preYearMonth.month, preMonthLastDate - i);
                    let isWeekend = new Date(formatDate).getDay() === 0 || new Date(formatDate).getDay() === 6;
                    arrDate.unshift({
                        value: (preMonthLastDate - i),
                        type: "pre",
                        isWeekend: isWeekend,
                        date: formatDate,
                        today: this.isToday(preYearMonth.year, preYearMonth.month, preMonthLastDate - i),
                        holiday: "",
                        dateAttribute: "",
                        off: false,
                        billList: [],
                        billListText: "",
                        abnormal: false,
                        noRoster: false,
                    });
                }

                for (let i = 0; i < 7 - lastDateWeek; i++) {
                    let formatDate = this.formatDate_zero(nextYearMonth.year, nextYearMonth.month, i + 1);
                    let isWeekend = new Date(formatDate).getDay() === 0 || new Date(formatDate).getDay() === 6;
                    arrDate.push({
                        value: (i + 1),
                        type: "next",
                        date: formatDate,
                        isWeekend: isWeekend,
                        today: this.isToday(nextYearMonth.year, nextYearMonth.month, i + 1),
                        holiday: "",
                        dateAttribute: "",
                        off: false,
                        billList: [],
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
                this.$refs.selectYearMonth.curYear = this.selectYear;
                this.$refs.selectYearMonth.curMonth = this.selectMonth;
                this.$refs.selectYearMonth.showYearPanel = false;
                this.$refs.selectYearMonth.refreshYearPanel(this.selectYear - 7);
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
                // 获取当前日历中年月与后端传的数据中的年月：
                let curYearMonth = this.formatDate_zero(this.selectYear, this.selectMonth);
                let dataYearMonth = arrData[0] ? arrData[0].date.slice(0, 7) : curYearMonth;
                if(dataYearMonth !== curYearMonth) return;  // 如果当前日历中年月与后端传的数据中的年月不相等，则跳过（防止“无排班”被误渲染）

                for (let i = 0; i < this.arrCurDate.length; i++) {
                    if (this.arrCurDate[i].type === 'cur') {
                        this.arrCurDate[i].noRoster = true;
                        for (let j = 0; j < arrData.length; j++) {
                            if (this.arrCurDate[i].date === arrData[j].date) {
                                this.arrCurDate[i].holiday = arrData[j].holiday;
                                this.arrCurDate[i].dateAttribute = arrData[j].dateAttribute;
                                this.arrCurDate[i].off = arrData[j].off;
                                this.arrCurDate[i].billList = arrData[j].billList || [];
                                this.arrCurDate[i].billListText = arrData[j].billList ? arrData[j].billList.join("、") : '';
                                this.arrCurDate[i].abnormal = arrData[j].abnormal;
                                this.arrCurDate[i].noRoster = false;
                                break;
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
            dateClick($event, date, type, dateAttribute) {
                // if (type !== 'cur') return;  //TODO: 当前版本只需实现点击本月的日期，点击上月/下月保留，以防需求更改

                let $this = this;
                let tempArr = date.split("-");
                let tempYear = Number(tempArr[0]);
                let tempMonth = Number(tempArr[1]);
                let tempDate = Number(tempArr[2]);

                // 判断是否大于今天，大于则提示“不允许查看未来数据”
                let exceed = this.exceedToday(tempYear, tempMonth, tempDate);
                if (exceed) {
                    $this.$root.myTool.message({type: 'warn', message: this.KDApi.getLangMsg(this.model, 'msg2')})
                    // alert('不允许查看未来数据')
                } else {
                    if (type === "pre") {
                        if (!this.isEarliestMonth) {
                            this.selectDate = tempDate;
                            this.preMonthClick(function () {
                                let date_zero = $this.formatDate_zero($this.selectYear, $this.selectMonth, $this.selectDate);
                                $this.$nextTick(function () {
                                    $this.changeCheckedDate(date_zero);
                                });
                            });
                        }
                    } else if (type === "next") {
                        this.selectDate = tempDate;
                        this.nextMonthClick(function () {
                            let date_zero = $this.formatDate_zero($this.selectYear, $this.selectMonth, $this.selectDate);
                            $this.$nextTick(function () {
                                $this.changeCheckedDate(date_zero);
                            });
                        });
                    } else {
                        this.selectDate = tempDate;
                        let date_zero = this.formatDate_zero(this.selectYear, this.selectMonth, this.selectDate);
                        this.model.invoke("getAttRecord", date_zero, dateAttribute);
                        this.$emit('getAttRecord', dateAttribute, date_zero);
                        // 切换高亮的日期
                        this.changeCheckedDate(date);
                        // 未排班则tips提示：
                        if (this.isNoRoster(date)) {
                            $this.$root.myTool.message({type: 'warn', message: date + '未排班，请联系管理员。'})
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
                let dom_checkedDate = this.$el.querySelector(`.cur-date.date-${date}`);
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
                    $this.$root.myTool.message({type: 'warn', message: this.KDApi.getLangMsg(this.model, 'msg2')})
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
                    this.$root.myTool.message({type: 'warn', message: this.KDApi.getLangMsg(this.model, 'msg2')})
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
                    this.showWrap = false;
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
                if(date) {
                    date = date > 9 ? date : "0" + date;
                    return year + '-' + month + '-' + date;
                } else {
                    return year + '-' + month;
                }
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
        border-bottom: 1px solid #d9d9d9;
        border-right: 1px solid #d9d9d9;
        padding: 10px 0;
        color: #999;
        width: 99.4%;
    }


    .wtc-homePage-calendar-week .wtc-homePage-calendar-week-item {
        flex: 1;
        text-align: center;
        font-weight: 700;
        color: #212121;
        font-size: 14px;
    }
    .wtc-homePage-calendar-week .wtc-homePage-calendar-week-weekend {
        color: #999;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head {
        text-align: center;
        padding: 20px 0;
        width: 99.4%;
        /*border-bottom: 1px solid #d9d9d9;*/
        border-right: 1px solid #d9d9d9;
    }

    .wtc-homePage-calendar-cur-month {
        position: relative;
        display: inline-block;
        font-size: 14px;
        width: 120px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        text-align: left;
    }

    .wtc-homePage-calendar-cur-month:hover {
        border-color: var(--theme-color);
    }

    .wtc-homePage-calendar-cur-month > a {
        display: inline-block;
        margin-left: 6px;
        cursor: default;
    }
    .wtc-homePage-calendar-cur-month > a>span {
        display: inline-block;
        font-weight: 700;
        width: 86px;
    }

    .wtc-homePage-calendar-cur-month >a>i {
        color: #999;
        font-weight: 400;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head .wtc-homePage-calendar-month-btn {
        display: inline-block;
        padding: 0 10px;
        font-size: 16px;
        vertical-align: bottom;
        height: 30px;
        line-height: 30px;
        color: #999;
        cursor: pointer;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head .wtc-homePage-calendar-month-btn:hover {
        color: var(--theme-color);
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head .wtc-homePage-calendar-left-month-btn-disable:hover {
        color: #ddd;
        cursor: default;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-head .wtc-homePage-calendar-left-month-btn-disable {
        color: #ddd;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-year-month-dialog {
        position: absolute;
        top: 40px;
        left: 0;
    }

    .wtc-homePage-calendar .wtc-homePage-calendar-content-wrap {
        width: 300%;
        display: flex;
    }

    .wtc-homePage-calendar-min {
        height: 336px;
    }

    .wtc-homePage-calendar-middle {
        height: 420px;
    }

    .wtc-homePage-calendar-max {
        height: 504px;
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
        height: 84px;
        box-sizing: border-box;
        cursor: pointer;
        vertical-align: bottom;
        border-right: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
    }

    .wtc-homePage-calendar-content .checked-date .wtc-homePage-calendar-content-date {
        border: 2px solid var(--theme-color);
    }

    .wtc-homePage-calendar-content .wtc-homePage-calendar-content-date {
        position: relative;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        border: 2px solid #fff;
        padding-left: 8px;
    }

    .wtc-homePage-calendar-content .wtc-homePage-calendar-content-date-wrap .wtc-calendar-date-abnormal {
        background-color: #FFF2F4;
    }

    .wtc-homePage-calendar-content .pre-date .wtc-homePage-calendar-content-date,
    .wtc-homePage-calendar-content .next-date .wtc-homePage-calendar-content-date {
        opacity: 0.3;
    }

    .wtc-homePage-calendar-content-date-top {
        display: flex;
        justify-content: space-between;
    }

    .wtc-homePage-calendar-content-date .wtc-homePage-calendar-content-date-text {
        display: inline-block;
        font-size: 16px;
        font-weight: 700;
        margin-top: 6px;
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        border-radius: 50%;
    }

    .wtc-homePage-calendar-content-date-text-today {
        background-color: var(--theme-color);
        color: #fff;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-restday {
        background-color: #f5f5f5;
    }


    .wtc-homePage-calendar-content-date-right {
        margin-left: 4px;
        display: flex;
        overflow: hidden;
    }

    .wtc-homePage-calendar-content-date-holiday {
        flex: 1;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        margin-right: 4px;
        /*max-width: 60px;*/
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .wtc-homePage-calendar-content-date .wtc-homePage-calendar-content-date-mark {
        font-size: 12px;
        flex: 0 0 20px;
        width: 20px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        text-align: center;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-actual-off .wtc-homePage-calendar-content-date-mark {
        background-color: #FFDBE0;
        color: #FB2323;
    }

    .wtc-homePage-calendar-content .wtc-calendar-date-actual-work .wtc-homePage-calendar-content-date-mark {
        background-color: #DCF9E4;
        color: #1BA854;
    }

    .wtc-homePage-calendar-content-date .wtc-homePage-calendar-content-date-middle {
        width: 8px;
        height: 2px;
        overflow: hidden;
        background-color: #ff5257;
        margin: 2px 0 0 7px;
    }

    .wtc-homePage-calendar-content-date-bottom {
        margin-top: 2px;
    }

    .wtc-homePage-calendar-content-date .wtc-homePage-calendar-content-date-apply {
        margin-bottom: 4px;
    }

    .wtc-homePage-calendar-content-date-apply > i {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        overflow: hidden;
        background-color: #276FF5;
        vertical-align: middle;
    }

    .wtc-homePage-calendar-content-date-noRoster > i {
        background-color: #FF991C;
    }

    .wtc-homePage-calendar-content-date-off > i {
        background-color: #FF0000;
    }

    .wtc-homePage-calendar-content-date-apply > span {
        font-size: 12px;
        color: #212121;
        margin-left: 2px;
    }

    .wtc-homePage-calendar-content-date-apply-more-icon {
        cursor: pointer;
        margin-left: 10px;
    }

    a {
        text-decoration: none;
    }

    a:hover,
    a:visited,
    a:link,
    a:active {
        color: #212121;
    }
</style>