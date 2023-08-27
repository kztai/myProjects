<template>
    <a href="#" ref="filterWrap" class="wtc_roster-header-filter" @blur="filterBlur">
        <i class="wtc_roster-header-filter-icon kdfont kdfont-guolv_mian"
            :class="{'wtc_roster-header-has-filter': hasFilter}" @click="showDialog"></i>
        <div class="wtc_roster-header-filter-dialog" v-show="filterShow">
            <div class="wtc_roster-header-filter-dialog-top">
                <i class="wtc_roster-header-filter-dialog-icon kdfont kdfont-guolv_mian"></i>
            </div>
            <ul class="wtc_roster-header-filter-condition-list">
                <li class="wtc_roster-header-filter-condition-item" :class="activeCondition(item.index)"
                    v-for="(item, index) in filterList" :key="item.index" @click="selectCondition(item.index)">
                    <span>{{ item.value }}</span><i class="kdfont kdfont-dagou"></i>
                </li>
            </ul>
            <input type="text" ref="input" class="wtc_roster-header-filter-dialog-input" v-model="inputValue"
                @blur="inputBlur">
            <div class="wtc_roster-header-filter-dialog-btns">
                <div class="wtc_roster-header-filter-dialog-reset-btn" @click="reset">重置</div>
                <div class="wtc_roster-header-filter-dialog-confirm-btn" @click="confirm">确定</div>
            </div>
        </div>
    </a>
</template>

<script>
    export default {
        name: "headerFilter",
        props: ['fieldName'],
        inject: ['model', 'KDApi'],

        data() {
            return {
                hasFilter: false,
                filterShow: false,
                inputValue: '',
                conditionIndex: '59',
                defaultInputValue: '',
                defaultConditionIndex: '59',
                filterList: [
                    { index: '59', value: "包含" },
                    { index: '58', value: "不包含" },
                    { index: '67', value: "等于" },
                    { index: '83', value: "不等于" },
                ]
            };
        },

        methods: {
            activeCondition(index) {
                return { "wtc_roster-header-filter-condition-item-active": index === this.conditionIndex };
            },
            selectCondition(index) {
                this.conditionIndex = index;
            },
            showDialog() {
                this.filterShow = true;
            },

            /*
            * 文本框失去焦点可能因为用户点击a标签外元素，也可能因为用户点击a标签内元素，需要区别判断
            * */
            inputBlur() {
                let $this = this;
                setTimeout(function () {
                    // 判断是不是a标签获得焦点，不是a标签则需要隐藏过滤框：
                    if (document.activeElement === $this.$refs.filterWrap) return;
                    $this.hideDialog();
                }, 10)
            },

            /*
            * a标签失去焦点可能因为用户点击a标签外元素，也可能因为用户点击a标签内文本框元素，需要区别判断
            * */
            filterBlur() {
                let $this = this;
                setTimeout(function () {
                    // 判断是不是文本框获得焦点（文本框获得焦点会导致a标签失去焦点）：
                    if (document.activeElement === $this.$refs.input) return;
                    $this.hideDialog()
                }, 10)
            },

            hideDialog() {
                if (this.hasFilter) {
                    // 数据变化
                    this.inputValue = this.defaultInputValue;
                    this.conditionIndex = this.defaultConditionIndex;
                } else {
                    // 数据重置
                    this.conditionIndex = '59';
                    this.inputValue = '';
                }

                this.filterShow = false;
            },
            reset() {
                let para = {
                    "FieldName": [this.fieldName],
                    "Value": [],
                    "Compare": []
                };
                console.log(para);
                if (this.defaultInputValue) {
                    this.$parent.$parent.$parent.showLoading = true;
                    this.model.invoke('getGridDataByFilter', para);
                }

                // 数据重置
                this.inputValue = '';
                this.conditionIndex = '59';
                this.defaultInputValue = '';
                this.defaultConditionIndex = '59';
                // 隐藏过滤框
                this.filterShow = false;
                // 当前是否有过滤条件
                this.hasFilter = false;
            },
            confirm() {
                this.filterShow = false; // 隐藏过滤框

                if (this.inputValue) {
                    this.hasFilter = true; // 当前是否有过滤条件
                    if (this.inputValue !== this.defaultInputValue || this.conditionIndex !== this.defaultConditionIndex) {
                        // 数据变化
                        this.defaultInputValue = this.inputValue;
                        this.defaultConditionIndex = this.conditionIndex;

                        let para = {
                            "FieldName": [this.fieldName],
                            "Value": [this.inputValue],
                            "Compare": [this.conditionIndex]
                        };
                        console.log(para);
                        this.$parent.$parent.$parent.showLoading = true;
                        this.model.invoke('getGridDataByFilter', para);
                    }
                } else {
                    if (this.inputValue !== this.defaultInputValue) {
                        let para = {
                            "FieldName": [this.fieldName],
                            "Value": [],
                            "Compare": []
                        };
                        console.log(para);
                        this.$parent.$parent.$parent.showLoading = true;
                        this.model.invoke('getGridDataByFilter', para);
                    }
                    // 数据重置
                    this.inputValue = '';
                    this.conditionIndex = '59';
                    this.defaultInputValue = '';
                    this.defaultConditionIndex = '59';
                    // 当前是否有过滤条件
                    this.hasFilter = false;
                }
            },
        }
    };
</script>

<style scoped>
    .wtc_roster-header-filter {
        display: inline-block;
        position: relative;
        padding: 4px 0;
        height: 23px;
        margin-left: -2px;
    }

    .wtc_roster-header-filter-icon {
        display: none;
        position: absolute;
        left: 0;
        top: 7px;
        color: #666;
        cursor: pointer;
        font-size: 12px;
        width: 14px;
        height: 24px;
        line-height: 26px;
        text-align: center;
    }

    .wtc_roster-header-filter-icon:hover {
        background-color: #e5e5e5;
    }

    .wtc_roster-header-has-filter {
        color: var(--theme-color);
        display: block;
    }

    .wtc_roster-header-filter-dialog {
        position: absolute;
        left: 0;
        top: 28px;
        width: 180px;
        background: #FFFFFF;
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.3);
        border-radius: 2px;
        overflow: hidden;
        z-index: 900;
        color: #212121;
        cursor: default;
        line-height: initial;
    }

    .wtc_roster-header-filter-dialog-top {
        background-color: rgb(235, 237, 241);
    }

    .wtc_roster-header-filter-dialog-icon {
        display: inline-block;
        vertical-align: bottom;
        padding: 8px 16px;
        background-color: #fff;
        color: #666;
        font-size: 12px;
    }

    .wtc_roster-header-filter-condition-list {
        padding: 6px 0 16px 0;
    }

    .wtc_roster-header-filter-condition-item {
        display: flex;
        justify-content: space-between;
        list-style: none;
        padding: 8px 10px;
        text-align: left;
        cursor: pointer;
    }

    .wtc_roster-header-filter-condition-item:hover {
        background-color: rgba(245, 245, 245, 0.4);
    }

    .wtc_roster-header-filter-condition-item>i {
        display: none;
        font-size: 14px;
    }

    .wtc_roster-header-filter-dialog .wtc_roster-header-filter-condition-item-active {
        color: var(--theme-color);
        background-color: rgba(245, 245, 245, 0.4);
    }

    .wtc_roster-header-filter-condition-item-active>i {
        display: inline;
    }

    .wtc_roster-header-filter-dialog-input {
        outline: none;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        background-color: #fafafa;
        margin-left: 10px;
        width: 160px;
        height: 26px;
        padding: 0 4px;
        color: #333;
    }

    .wtc_roster-header-filter-dialog-input:hover {
        border: 1px solid var(--theme-color);
    }

    .wtc_roster-header-filter-dialog-input:focus {
        border: 1px solid var(--theme-color);
    }

    .wtc_roster-header-filter-dialog-btns {
        margin: 12px 10px;
        display: flex;
        justify-content: space-between;
    }

    .wtc_roster-header-filter-dialog-reset-btn {
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        padding: 2px 18px;
        color: #999;
        cursor: pointer;
    }

    .wtc_roster-header-filter-dialog-reset-btn:hover {
        border: 1px solid var(--theme-color);
        color: var(--theme-color);
    }

    .wtc_roster-header-filter-dialog-confirm-btn {
        background-color: var(--theme-color);
        border-radius: 2px;
        padding: 2px 18px;
        color: #fff;
        cursor: pointer;
    }

    .wtc_roster-header-filter-dialog-confirm-btn:hover {
        opacity: 0.6;
    }


    /*a标签的处理*/
    .wtc_roster-header-filter:hover,
    .wtc_roster-header-filter:visited,
    .wtc_roster-header-filter:link,
    .wtc_roster-header-filter:active {
        color: #212121;
    }
</style>