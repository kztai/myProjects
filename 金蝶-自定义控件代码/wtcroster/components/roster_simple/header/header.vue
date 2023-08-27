<template>
    <div class="wtc_roster-simple-table-header-wrap">
        <div class="wtc_roster-simple-table-left-name">
            <span>{{ nameText }}</span>
            <filterCondition ref="filterCondition0" :fieldName="'name'"></filterCondition>
        </div>
        <div class="wtc_roster-simple-table-middle-header-list-wrap" :style="{'width': middleWidth}">
            <ul class="wtc_roster-simple-table-middle-header-list">
                <li class="wtc_roster-simple-table-middle-header-item" v-for="(info, index) in infoList" :key="index">
                    <span>{{ info.value }}</span>
                    <filterCondition ref="filterCondition" :fieldName="info.fieldName"></filterCondition>
                </li>
                <li class="wtc_roster-simple-table-middle-header-item">{{ rosterTime }}</li>
                <li class="wtc_roster-simple-table-middle-header-item">{{ planRosterTime }}</li>
            </ul>
        </div>
        <div class="wtc_roster-simple-table-header-slide">
            <div class="wtc_roster-simple-table-slide-line" @mousedown="slideStart"></div>
            <div class="wtc_roster-simple-table-header-slide-btns">
                <i class="wtc_roster-simple-table-header-slide-btn-left kdfont kdfont-left"></i>
                <i class="wtc_roster-simple-table-header-slide-btn-right kdfont kdfont-right"></i>
            </div>
        </div>
        <div ref="rightHeaderWrap" class="wtc_roster-simple-table-right-header-wrap" :style="{'width': rightWidth}">
            <ul class="wtc_roster-simple-table-right-header">
                <li class="wtc_roster-simple-table-right-header-item" @mousedown="colCellActive($event, index)"
                    v-for="(date,index) in dateList" :key="index" :index="index">
                    <p>{{ date.split(' ')[0] }}</p>
                    <p class="wtc_roster-simple-table-right-header-week">({{ date.split(' ')[1].slice(2,3) }})</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import filterCondition from "./filter.vue";
    export default {
        name: "tableHead",
        props: ['dateList', 'rosterview', 'type', 'showType', 'savePower'],
        inject: ['model', 'KDApi'],
        components: { filterCondition },

        data() {
            return {
                personInfoWidth: 0,
                middleWidth: '0px',
                rightWidth: 'calc(100% - 90px - 40px)',
                nameText: this.rosterview === 'taborg' ? this.KDApi.getLangMsg(this.model, 'department') : this.KDApi.getLangMsg(this.model, 'name'),
                infoList: [
                    { fieldName: 'attperson.number', value: this.KDApi.getLangMsg(this.model, 'number') },  //工号
                    { fieldName: 'number', value: this.KDApi.getLangMsg(this.model, 'fileNo') },  //档案编号
                    { fieldName: 'org.name', value: this.KDApi.getLangMsg(this.model, 'attGroup') }, //考勤组织
                    { fieldName: 'company.name', value: this.KDApi.getLangMsg(this.model, 'company') },  //所属公司
                    { fieldName: 'adminorg.name', value: this.KDApi.getLangMsg(this.model, 'department') },  //行政组织
                    { fieldName: 'affiliateadminorg.name', value: this.KDApi.getLangMsg(this.model, 'affiliateadminorgname') },  //挂靠行政组织
                    { fieldName: 'empgroup.name', value: this.KDApi.getLangMsg(this.model, 'group') },  //考勤人员组
                    { fieldName: 'job.name', value: this.KDApi.getLangMsg(this.model, 'job') },  //职位
                    { fieldName: 'position.name', value: this.KDApi.getLangMsg(this.model, 'position') },  //岗位
                ],
                rosterTime: this.KDApi.getLangMsg(this.model, 'rosterTime'),  //实际时数
                planRosterTime: this.KDApi.getLangMsg(this.model, 'planRosterTime'),  //计划时数
            };
        },

        watch: {
            showType(newValue) {
                // 循环排班与排班管理的字段个数不一致；显示计划，还是显示计划+实际也会导致字段个数不一致：
                this.showRoster(newValue);
            }
        },

        mounted() {
            // 循环排班与排班管理的字段个数不一致；显示计划，还是显示计划+实际也会导致字段个数不一致：
            this.showRoster(this.showType);
        },

        methods: {
            /*
            * 获取各字段的过滤条件数据
            * */
            getFilterData() {
                let arrFilterData = [];

                for (let i = -1; i < this.$refs.filterCondition.length; i++) {
                    let ele_field = i === -1 ? this.$refs.filterCondition0 : this.$refs.filterCondition[i];
                    arrFilterData.push({
                        field: ele_field.fieldName,
                        value: [ele_field.inputValue],
                        compare: [ele_field.conditionIndex],
                    })
                }
                return arrFilterData;
            },

            /*
            * 刷新各字段的过滤条件数据
            * 注意：这里用字段去匹配保险点，但是如果可以保证字段顺序的话，也能这样写。
            * */
            refreshFilterData(arrFilterData) {
                for (let i = 0; i < arrFilterData.length; i++) {
                    if (arrFilterData[i].value[0]) {
                        let ele_field = i === 0 ? this.$refs.filterCondition0 : this.$refs.filterCondition[i - 1];
                        ele_field.inputValue = arrFilterData[i].value[0];
                        ele_field.defaultInputValue = arrFilterData[i].value[0];
                        ele_field.conditionIndex = arrFilterData[i].compare[0];
                        ele_field.defaultConditionIndex = arrFilterData[i].compare[0];
                        ele_field.hasFilter = true;
                    }
                }
            },

            /*列批量*/
            colCellActive(event, index) {
                if (this.savePower && event.which === 3) {
                    // 如果是行政组织模式，则跳过
                    // if (this.rosterview === 'taborg') return;

                    this.$emit('colCellActive', index, event.clientX, event.clientY);
                }
            },

            slideStart(e) {
                const $this = this;
                const $dom_middleHeaderList = $('.wtc_roster-simple-table-middle-header-list-wrap', this.$root.$el);

                //防止默认事件发生
                e.preventDefault();
                //按下元素后，计算当前鼠标与对象计算后的坐标
                this.startX = e.clientX;
                this.preX = e.clientX;
                this.oldWidth = parseInt($dom_middleHeaderList.css('width'));

                $(document).on('mousemove.slideMove', function (ev) {
                    $this.slideing(ev)
                });
                $(document).on('mouseup.slideUp', function () {
                    $this.slideEnd()
                });
            },

            slideing(ev) {
                const $this = this;
                var endX = ev.clientX;
                var newWidth = this.oldWidth + (endX - this.startX);
                newWidth = newWidth > $this.personInfoWidth ? $this.personInfoWidth : newWidth;
                newWidth = newWidth < 0 ? 0 : newWidth;

                // 判断拖动方向：
                // if (endX - this.preX > 0) {  // 向右
                //     $dom_slideBtnLeft.css('color', '#999');
                //     $dom_slideBtnRight.css('color', $this.themeNum);
                // } else {
                //     $dom_slideBtnRight.css('color', '#999');
                //     $dom_slideBtnLeft.css('color', $this.themeNum);
                // }

                this.preX = endX;  // 重置当前x坐标位置

                // 设置排班列的宽度（通过整表宽度-固定的几个宽度，因为浏览器的分辨率会变化，所以导致右侧排班类的宽度需要动态变化）：
                this.middleWidth = newWidth + 'px';
                this.rightWidth = `calc(100% - 90px - 40px - ${newWidth}px)`;
                this.$emit('infoDetailWidthChange', newWidth);
            },

            slideEnd() {
                // $dom_slideBtnLeft.css('color', '#999');
                // $dom_slideBtnRight.css('color', '#999');

                $(document).unbind("mousemove.slideMove").unbind("mouseup.slideUp");
            },

            showRoster(showType) {
                // 循环排班与排班管理的字段个数不一致；显示计划，还是显示计划+实际也会导致字段个数不一致：
                // type: 0循环排班，1排班管理
                if (this.type === 0) {
                    this.personInfoWidth = 90 * 9;
                } else {
                    switch (showType) {
                        case 'SHOW_ALL':  //show all
                            this.personInfoWidth = 90 * 11;
                            break;
                        case 'SHOW_PLAN': //show plan
                        case 'SHOW_REAL': //show actual
                            this.personInfoWidth = 90 * 10;
                            break;
                        case 'SHOW_NO':  //show no
                            this.personInfoWidth = 90 * 9;
                            break;
                    }
                }
            },

            tableScroll(scrollLeft) {
                this.$refs.rightHeaderWrap.scrollLeft = scrollLeft;
            }
        }
    };
</script>

<style>
    /*表格头部*/
    .wtc_roster-simple-table-header-wrap {
        font-size: 0;
        background-color: #f2f2f2;
        border-bottom: 1px solid #D9D9D9;
        box-sizing: border-box;
    }

    .wtc_roster-simple-table-left-name {
        display: inline-block;
        width: 90px;
        border-right: 1px solid #D9D9D9;
        padding-left: 12px;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        vertical-align: top;
        font-size: 12px;
    }

    .wtc_roster-simple-table-left-name:hover .wtc_roster-header-filter-icon {
        display: block;
    }

    .wtc_roster-simple-table-middle-header-list-wrap {
        display: inline-block;
        width: 0px;
        vertical-align: top;
        font-size: 14px;
        /*overflow: hidden;*/
        box-sizing: border-box;
    }

    .wtc_roster-simple-table-middle-header-list {
        display: flex;
        height: 40px;
        line-height: 40px;
    }

    .wtc_roster-simple-table-middle-header-list .wtc_roster-simple-table-middle-header-item {
        flex: 0 0 90px;
        width: 90px;
        box-sizing: border-box;
        border-right: 1px solid #D9D9D9;
        padding: 0 4px;
        font-size: 12px;
    }

    .wtc_roster-simple-table-middle-header-item:hover .wtc_roster-header-filter-icon {
        display: block;
    }

    .wtc_roster-simple-table-header-slide {
        display: inline-block;
        position: relative;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-left: 1px solid #d9d9d9;
        border-right: 1px solid #D9D9D9;
        box-sizing: border-box;
        /*cursor: move;*/
        vertical-align: top;
        font-size: 14px;
        background-color: #f2f2f2;
    }

    .wtc_roster-simple-table-slide-line {
        /*拖动的线*/
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        /*background-color: #ccc;*/
        cursor: col-resize;
        z-index: 2;
    }

    /*.wtc_roster-simple-table-header-slide:hover .wtc_roster-simple-table-header-slide-btn-right {*/
    /*color: var(--themeColor, #276FF5);*/
    /*}*/
    .wtc_roster-simple-table-header-slide .wtc_roster-simple-table-header-slide-btns {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -18px;
    }

    .wtc_roster-simple-table-header-slide .wtc_roster-simple-table-header-slide-btns i {
        color: #999;
    }

    .wtc_roster-simple-table-right-header-wrap {
        position: relative;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        /*width: calc(100% - 90px - 40px);*/
        overflow: hidden;
    }

    .wtc_roster-simple-table-right-header {
        display: flex;
        padding-right: 6px;
    }

    .wtc_roster-simple-table-right-header .wtc_roster-simple-table-right-header-item {
        flex: 1;
        min-width: 48px;
        height: 40px;
        /*line-height: 40px;*/
        text-align: center;
        box-sizing: border-box;
        font-size: 12px;
        background-color: #f2f2f2;
        padding-top: 6px;
    }

    .wtc_roster-simple-table-right-header .wtc_roster-simple-table-right-header-item .wtc_roster-simple-table-right-header-week {
        font-size: 12px;
        color: #666;
        /*margin-left: 2px;*/
        font-weight: 400;
    }
</style>