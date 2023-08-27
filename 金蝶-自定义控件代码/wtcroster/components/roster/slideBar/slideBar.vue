<template>
    <div class="wtc_roster-table-slide-bar-wrap">
        <div class="wtc_roster-table-slide-bar-left"></div>

        <div class="wtc_roster-table-slide-bar-middle" :style="{'width': middleWidth}"></div>

        <div class="wtc_roster-table-slide-bar-right"></div>

        <div class="wtc_roster-table-slide-bar-content-wrap" :style="{'width': rightWidth}">
            <ul class="wtc_roster-table-slide-bar-content-list" @scroll="tableMove">
                <li class="wtc_roster-table-slide-bar-content-item" v-for="(date,index) in dateList" :key="index"></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "slideBar",
        props: ['dateList'],

        data() {
            return {
                middleWidth: '0px',
                rightWidth: 'calc(100% - 230px - 40px)',
            };
        },

        mounted() {

        },

        methods: {
            tableMove(e) {
                this.$emit('tableScroll', e.target.scrollLeft);
                //
                // $dom_rightList.scrollLeft($(this).scrollLeft()); //表格主体x位置调整
                // $dom_headerDateWrap.scrollLeft($(this).scrollLeft()); //表格头部x位置调整
                // $dom_totalContent.scrollLeft($(this).scrollLeft()); //统计部分x位置调整
            }
        }
    };
</script>

<style scoped>
    /*滚动条部分*/
    .wtc_roster-table-slide-bar-wrap {
        font-size: 0;
        z-index: 20;
        width: 100%;
        height: 8px;
        background-color: #fff;
        overflow: hidden;
    }

    .wtc_roster-table-slide-bar-wrap .wtc_roster-table-slide-bar-left {
        display: inline-block;
        vertical-align: top;
        width: 230px;
        box-sizing: border-box;
        z-index: 2;
    }

    .wtc_roster-table-slide-bar-wrap .wtc_roster-table-slide-bar-middle {
        display: inline-block;
        vertical-align: top;
        width: 0px;
        box-sizing: border-box;
        z-index: 2;
    }

    .wtc_roster-table-slide-bar-wrap .wtc_roster-table-slide-bar-right {
        display: inline-block;
        vertical-align: top;
        width: 40px;
        font-size: 12px;
        box-sizing: border-box;
        z-index: 2;
    }

    .wtc_roster-table-slide-bar-wrap .wtc_roster-table-slide-bar-content-wrap {
        display: inline-block;
        vertical-align: top;
        /*width: calc(100% - 230px - 40px);*/
        height: 100%;
        box-sizing: border-box;
    }

    .wtc_roster-table-slide-bar-content-wrap .wtc_roster-table-slide-bar-content-list {
        display: flex;
        box-sizing: border-box;
        overflow: auto;
        /*height: 84px;*/
    }

    .wtc_roster-table-slide-bar-content-wrap .wtc_roster-table-slide-bar-content-item {
        flex: 1;
        height: 1px;
        text-align: center;
        min-width: 150px;
        box-sizing: border-box;
    }
</style>