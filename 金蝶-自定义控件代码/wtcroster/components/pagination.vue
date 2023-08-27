<template>
    <div class="wtc-pagination-wrap">
        <div class="wtc-pagination-total">
            共<span>{{maxPage}}</span>页
        </div>
        <div class="wtc-pagination-input-wrap">
            <span>第</span>
            <input type="number" class="wtc-pagination-input" :value="curPage" @blur="inputBlur">
            <span>页</span>
        </div>
        <div class="wtc-pagination-btns wtc-pagination-first-page icon iconfont icon-jiantou_shangyiye_o"
            :class="{'wtc-pagination-btns-disabled': firstPageBtnDisable}" @click="firstPageClick"></div>
        <div class="wtc-pagination-btns wtc-pagination-pre-page icon iconfont icon-xiangzuojiantou"
            :class="{'wtc-pagination-btns-disabled': prePageBtnDisable}" @click="prePageClick"></div>
        <div class="wtc-pagination-btns wtc-pagination-next-page icon iconfont icon-xiangyoujiantou"
            :class="{'wtc-pagination-btns-disabled': nextPageBtnDisable}" @click="nextPageClick"></div>
        <div class="wtc-pagination-btns wtc-pagination-last-page icon iconfont icon-jiantou_xiayiye_o"
            :class="{'wtc-pagination-btns-disabled': lastPageBtnDisable}" @click="lastPageClick"></div>
        <div class="wtc-pagination-part-wrap">
            <span class="wtc-pagination-curPartPage">{{curPartPage}}</span>
            <span>条/页</span>
            <i class="icon iconfont icon-xiangxiajiantou toBottom" style=""></i>
            <ul class="wtc-pagination-part-list">
                <li class="wtc-pagination-part-item" :class="{'wtc-pagination-active': selectedPartPage === index}"
                    v-for="(partPage, index) in data.partPageList" :key="index"
                    @click="partPageChange(partPage, index)">
                    {{partPage}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: ['data'],

        data() {
            return {
                curPage: 1,
                curPartPage: 20,
                maxPage: 100,
                selectedPartPage: -1,
                curRosterType: 'tabperson',

                firstPageBtnDisable: false,
                prePageBtnDisable: false,
                nextPageBtnDisable: false,
                lastPageBtnDisable: false,
            };
        },

        watch: {
            data() {
                this.init();
            }
        },

        mounted() {
            this.init();
        },

        methods: {
            init() {
                this.curPage = this.data.curPage;
                this.curPartPage = this.data.curPartPage;
                this.maxPage = Math.ceil(this.data.total / this.curPartPage);
                this.selectedPartPage = this.data.partPageList.indexOf(this.curPartPage);
                this.pageFormat();
            },

            // 判断用户输入的页码是否符合：
            inputBlur(event) {
                let curPage = event.target.value ? parseInt(event.target.value) : 0;
                if (curPage > this.maxPage) curPage = this.maxPage;
                if (curPage < 1) curPage = 1;
                event.target.value = this.curPage;
                if (curPage != this.curPage) {
                    this.$emit('pageChange', curPage, this.curPartPage);
                }
            },

            firstPageClick() {
                if (!this.firstPageBtnDisable) {
                    this.$emit('pageChange', 1, this.curPartPage);
                }
            },
            prePageClick() {
                if (!this.prePageBtnDisable) {
                    this.$emit('pageChange', this.curPage - 1, this.curPartPage);
                }
            },
            nextPageClick() {
                if (!this.nextPageBtnDisable) {
                    this.$emit('pageChange', this.curPage + 1, this.curPartPage);
                }
            },
            lastPageClick() {
                if (!this.lastPageBtnDisable) {
                    this.$emit('pageChange', this.maxPage, this.curPartPage);
                }
            },

            partPageChange(partPage) {
                // 从新计算最大页码
                let maxPage = Math.ceil(this.data.total / partPage);
                let curPage = this.curPage;
                if (curPage > maxPage) curPage = maxPage;

                this.$emit('pageChange', curPage, partPage);
            },

            // 判断当前页码是否到极限值
            pageFormat() {
                if (this.curPage === 1 && this.curPage === this.maxPage || this.maxPage === 0) {
                    this.firstPageBtnDisable = true;
                    this.prePageBtnDisable = true;
                    this.nextPageBtnDisable = true;
                    this.lastPageBtnDisable = true;
                } else if (this.curPage === 1) {
                    this.firstPageBtnDisable = true;
                    this.prePageBtnDisable = true;
                    this.nextPageBtnDisable = false;
                    this.lastPageBtnDisable = false;
                } else if (this.curPage === this.maxPage) {
                    this.firstPageBtnDisable = false;
                    this.prePageBtnDisable = false;
                    this.nextPageBtnDisable = true;
                    this.lastPageBtnDisable = true;
                } else {
                    this.firstPageBtnDisable = false;
                    this.prePageBtnDisable = false;
                    this.nextPageBtnDisable = false;
                    this.lastPageBtnDisable = false;
                }
            },
        }
    };
</script>
<style>
    .wtc-pagination-wrap {
        font-size: 12px;
        color: #666;
        user-select: none;
    }

    .wtc-pagination-wrap>div {
        display: inline-block;
        margin-left: 10px;
    }

    .wtc-pagination-part-wrap {
        position: relative;
    }

    .wtc-pagination-input-wrap .wtc-pagination-input {
        outline: none;
        border: 1px solid #d9d9d9;
        width: 36px;
        font-size: 12px;
        padding: 4px;
        color: #333;
        text-align: center;
        border-radius: 2px;
    }

    .wtc-pagination-input::-webkit-outer-spin-button,
    .wtc-pagination-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    .wtc-pagination-input[type="number"] {
        -moz-appearance: textfield;
    }

    .wtc-pagination-input:hover {
        border: 1px solid var(--themeColor, #276FF5);
    }

    .wtc-pagination-input:focus {
        border: 1px solid var(--themeColor, #276FF5);
    }

    .wtc-pagination-btns {
        cursor: pointer;
    }

    .wtc-pagination-btns:hover {
        color: var(--themeColor, #276FF5)
    }

    .wtc-pagination-btns-disabled {
        color: #ccc;
        cursor: not-allowed;
    }

    .wtc-pagination-btns-disabled:hover {
        color: #ccc;
    }

    .wtc-pagination-wrap .wtc-pagination-pre-page,
    .wtc-pagination-wrap .wtc-pagination-next-page {
        font-size: 12px;
    }

    .wtc-pagination-first-page,
    .wtc-pagination-last-page {
        vertical-align: text-bottom;
    }

    .wtc-pagination-part-wrap {
        cursor: pointer;
    }

    .wtc-pagination-part-wrap>i {
        font-size: 12px;
        display: inline-block;
        transform: rotate(0deg);
        transition: transform 0.3s;
    }

    .wtc-pagination-part-wrap:hover>i {
        color: var(--themeColor, #276FF5);
        transform: rotate(180deg);
    }

    .wtc-pagination-part-wrap:hover .wtc-pagination-part-list {
        max-height: 500px;
        opacity: 1;
        z-index: 900;
        background-color: #fff;
    }

    .wtc-pagination-part-list {
        position: absolute;
        top: 18px;
        right: 0;
        /*border: 1px solid #d9d9d9;*/
        box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px 0px;
        border-radius: 2px;
        min-width: 100px;
        overflow: hidden;
        max-height: 0px;
        opacity: 0;
        transition: all .3s;
    }

    .wtc-pagination-part-item {
        list-style: none;
        padding: 10px;
        text-align: center;
    }

    .wtc-pagination-part-item:hover {
        background-color: rgba(245, 245, 245, 0.4);
    }

    .wtc-pagination-part-list .wtc-pagination-active {
        color: #5582f3;
        background-color: #f2f8ff;
    }
</style>