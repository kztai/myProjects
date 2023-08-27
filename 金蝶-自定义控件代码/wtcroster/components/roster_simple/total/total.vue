<template>
    <div class="wtc_roster-simple-table-total-wrap">
        <div class="wtc_roster-simple-table-total-list">
            <ul class="wtc_roster-simple-table-total-list-wrap">
                <li class="wtc_roster-simple-table-total-both wtc_roster-simple-table-total-time">
                    <div class="wtc_roster-simple-table-total-both-top">
                        <span class="wtc_roster-simple-table-total-left-text"
                            v-show="showType === 'SHOW_ALL' || showType === 'SHOW_PLAN'">{{langText_planTime}}</span>
                        <span class="wtc_roster-simple-table-total-left-text" v-show="showType === 'SHOW_ALL'">(</span>
                        <span class="wtc_roster-simple-table-total-left-text"
                            v-show="showType === 'SHOW_ALL' || showType === 'SHOW_REAL'">{{langText_actualTime}}</span>
                        <span class="wtc_roster-simple-table-total-left-text" v-show="showType === 'SHOW_ALL'">)</span>
                    </div>
                    <div class="wtc_roster-simple-table-total-both-bottom">
                        <span class="wtc_roster-simple-table-total-left-text"
                            v-show="showType === 'SHOW_ALL' || showType === 'SHOW_PLAN'">{{ rosterSum.planRosterSumTime
                            }}</span>
                        <span class="wtc_roster-simple-table-total-left-text" v-show="showType === 'SHOW_ALL'">(</span>
                        <span class="wtc_roster-simple-table-total-left-text" style="color: #FA3232;"
                            v-show="showType === 'SHOW_ALL' || showType === 'SHOW_REAL'">{{ rosterSum.realRosterSumTime
                            }}</span>
                        <span class="wtc_roster-simple-table-total-left-text" v-show="showType === 'SHOW_ALL'">)</span>
                    </div>
                </li>
                <li class="wtc_roster-simple-table-total-both wtc_roster-simple-table-total-num"
                    v-if="rosterview === 'tabperson'">
                    <div class="wtc_roster-simple-table-total-both-top">
                        <span class="wtc_roster-simple-table-total-left-text"
                            v-show="showType === 'SHOW_ALL' || showType === 'SHOW_PLAN'">{{langText_planPeople}}</span>
                        <span class="wtc_roster-simple-table-total-left-text" v-show="showType === 'SHOW_ALL'">(</span>
                        <span class="wtc_roster-simple-table-total-left-text"
                            v-show="showType === 'SHOW_ALL' || showType === 'SHOW_REAL'">{{langText_actualPeople}}</span>
                        <span class="wtc_roster-simple-table-total-left-text" v-show="showType === 'SHOW_ALL'">)</span>
                    </div>
                    <div class="wtc_roster-simple-table-total-both-bottom">
                        <span class="wtc_roster-simple-table-total-left-text"
                            v-show="showType === 'SHOW_ALL' || showType === 'SHOW_PLAN'">{{
                            rosterSum.planRosterSumPersonNum }}</span>
                        <span class="wtc_roster-simple-table-total-left-text" v-show="showType === 'SHOW_ALL'">(</span>
                        <span class="wtc_roster-simple-table-total-left-text" style="color: #FA3232;"
                            v-show="showType === 'SHOW_ALL' || showType === 'SHOW_REAL'">{{
                            rosterSum.realRosterSumPersonNum }}</span>
                        <span class="wtc_roster-simple-table-total-left-text" v-show="showType === 'SHOW_ALL'">)</span>
                    </div>
                </li>
            </ul>
        </div>

        <div class="wtc_roster-simple-table-total-middle-wrap" :style="{'width': middleWidth}"></div>

        <div class="wtc_roster-simple-table-total-plan-actual"></div>

        <div ref="totalContent" class="wtc_roster-simple-table-total-content-wrap" :style="{'width': rightWidth}">
            <ul class="wtc_roster-simple-table-total-content">
                <li class="wtc_roster-simple-table-total-content-item"
                    v-for="(objSummary, index) in rosterSum.rosterSummaryList" :key="index">
                    <div class="wtc_roster-simple-table-total-content-item-time"
                        :title="`${objSummary.planRosterTime}(${objSummary.realRosterTime})`">
                        <span v-show="showType === 'SHOW_ALL' || showType === 'SHOW_PLAN'">{{ objSummary.planRosterTime
                            }}</span>
                        <span v-show="showType === 'SHOW_ALL'">(</span>
                        <span style="color: #5AC328;" v-show="showType === 'SHOW_ALL' || showType === 'SHOW_REAL'">{{
                            objSummary.realRosterTime }}</span>
                        <span v-show="showType === 'SHOW_ALL'">)</span>
                    </div>
                    <div class="wtc_roster-simple-table-total-content-item-num" v-if="rosterview === 'tabperson'"
                        :title="`${objSummary.planRosterPersonNum}(${objSummary.realRosterPersonNum})`">
                        <span v-show="showType === 'SHOW_ALL' || showType === 'SHOW_PLAN'">{{
                            objSummary.planRosterPersonNum }}</span>
                        <span v-show="showType === 'SHOW_ALL'">(</span>
                        <span style="color: #5AC328;" v-show="showType === 'SHOW_ALL' || showType === 'SHOW_REAL'">{{
                            objSummary.realRosterPersonNum }}</span>
                        <span v-show="showType === 'SHOW_ALL'">)</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "total",
        props: ['rosterSum', 'showType1', 'rosterview'],
        inject: ['model', 'KDApi'],

        data() {
            return {
                showType: 'SHOW_REAL',
                middleWidth: '0px',
                rightWidth: 'calc(100% - 90px - 40px)',

                langText_actualTime: this.KDApi.getLangMsg(this.model, 'actualTime'),
                langText_actualPeople: this.KDApi.getLangMsg(this.model, 'actualPeople'),
                langText_planTime: this.KDApi.getLangMsg(this.model, 'planTime'),
                langText_planPeople: this.KDApi.getLangMsg(this.model, 'planPeople')
            }
        },

        watch: {
            showType1(newValue) {
                this.initSowType(newValue);
            }
        },

        mounted() {
            this.initSowType(this.showType1);
        },

        methods: {
            initSowType(showType) {
                this.showType = this.rosterview === 'tabperson' ? showType : 'SHOW_REAL';
            },
            tableScroll(scrollLeft) {
                // todo 待解决：当隐藏时，滚动不生效
                $(this.$refs.totalContent).scrollLeft(scrollLeft);
                // this.$refs.totalContent.scrollLeft = scrollLeft;
            }
        }
    };
</script>

<style scoped>
    /*统计部分*/
    .wtc_roster-simple-table-total-wrap {
        /*visibility: hidden;*/
        /*position: absolute;*/
        /*bottom:7px;*/
        /*left:0;*/
        /*display: none;*/
        z-index: 20;
        width: 100%;
        height: 68px;
        background-color: #fff;
        /*display: flex;*/
        overflow: hidden;
        border-top: 1px solid #D9D9D9;
        /*box-shadow: 0 1px 7px 3px rgba(0, 0, 0, 0.3);*/
        /*margin-top: 10px;*/
        font-size: 0;
    }

    .wtc_roster-simple-table-total-wrap .wtc_roster-simple-table-total-list {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        width: 90px;
        box-sizing: border-box;
        z-index: 2;
    }

    .wtc_roster-simple-table-total-list-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 68px;
    }

    .wtc_roster-simple-table-total-list .wtc_roster-simple-table-total-both {
        height: 34px;
        box-sizing: border-box;
        text-align: center;
        /*background-color: #f5f6f7;*/
    }

    .wtc_roster-simple-table-total-both-bottom {
        margin-top: -2px;
    }

    .wtc_roster-simple-table-total-both-top {
        white-space: nowrap;
    }

    .wtc_roster-simple-table-total-list .wtc_roster-simple-table-total-both .wtc_roster-simple-table-total-left-text {
        color: #666;
        font-size: 12px;
        white-space: nowrap;
    }

    .wtc_roster-simple-table-total-list .wtc_roster-simple-table-total-both-num {
        margin-left: 4px;
    }

    .wtc_roster-simple-table-total-wrap .wtc_roster-simple-table-total-middle-wrap {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        width: 0px;
        box-sizing: border-box;
        background-color: #fff;
        z-index: 2;
    }

    .wtc_roster-simple-table-total-wrap .wtc_roster-simple-table-total-plan-actual {
        display: inline-block;
        vertical-align: top;
        width: 40px;
        font-size: 12px;
        box-sizing: border-box;
        background-color: #fff;
        z-index: 2;
    }

    .wtc_roster-simple-table-total-wrap .wtc_roster-simple-table-total-content-wrap {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        height: 100%;
        /*width: calc(100% - 90px - 40px);*/
        /*overflow-x: auto;*/
        /*overflow-y: hidden;*/
        box-sizing: border-box;
        overflow: hidden;
    }

    .wtc_roster-simple-table-total-content {
        display: flex;
        box-sizing: border-box;
        height: 68px;
    }

    .wtc_roster-simple-table-total-content-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        min-width: 48px;
        box-sizing: border-box;
    }

    .wtc_roster-simple-table-total-content-item>div {
        height: 34px;
        line-height: 34px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0px;
    }

    .wtc_roster-simple-table-total-content-item>div>span {
        font-size: 12px;
    }
</style>