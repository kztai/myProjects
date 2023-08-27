<template>
    <div class="wtc_roster-wrap">
        <!--<shiftDialog :shiftListAll="rosterData.shiftInfoMap.all" :shiftListPopular="rosterData.shiftInfoMap.popular"></shiftDialog>-->
        <div class="wtc_roster-simple-table">
            <tableHead ref="tableHead" :type="rosterData.type" :showType="rosterData.showType"
                :rosterview="rosterData.rosterview" :dateList="rosterData.dateList" :savePower="rosterData.savePower"
                @colCellActive="colCellActive" @infoDetailWidthChange="infoDetailWidthChange"></tableHead>
            <rosterTable v-if="rosterData.rosterview === 'tabperson'" ref="rosterTable" :rosterData="rosterData"
                :style="{'height': showTotal ? 'calc(100% - 118px)' : 'calc(100% - 50px)'}"
                @tableLineSlide="tableLineSlide">
            </rosterTable>
            <!-- todo 当前版本紧凑模式不需要兼容行政组织排班 -->
            <!--<rosterTable_org
                    v-if="rosterData.rosterview === 'taborg'"
                    ref="rosterTable_org"
                    :rosterData="rosterData"
                    :style="{'height': showTotal ? 'calc(100% - 118px)' : 'calc(100% - 50px)'}"
                    @tableLineSlide="tableLineSlide">
            </rosterTable_org>-->

            <slideBar ref="slideBar" :dateList="rosterData.dateList" @tableScroll="tableScroll"></slideBar>

            <!--rosterData.type：控件类型：0循环排班，1排班管理。循环排班不需要统计栏-->
            <total v-show="showTotal" ref="total" v-if="rosterData.type === 1" :rosterSum="rosterData.rosterSum"
                :showType1="rosterData.showType" :rosterview="rosterData.rosterview"></total>

            <div v-if="rosterData.type === 1" class="wtc_roster-simple-table-fold-btn"
                :style="{'bottom': showTotal ? '68px' : '0px'}" @click="toggleTotal">
                {{KDApi.getLangMsg(model, 'total')}}
                <i class="kdfont" :class="{'kdfont-shangla':!showTotal, 'kdfont-xiala':showTotal}"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import tableHead from "./header/header.vue";
    import rosterTable from "./rosterTable/rosterTable.vue";
    // import rosterTable_org from "./rosterTable_org/rosterTable_org.vue";
    import shiftDialog from "./shiftDialog/shiftDialog.vue";
    import slideBar from "./slideBar/slideBar.vue";
    import total from "./total/total.vue";

    export default {
        name: "roster",
        components: { tableHead, rosterTable, shiftDialog, slideBar, total },
        props: ['rosterData'],
        inject: ['model', 'KDApi'],

        data() {
            return {
                showTotal: false,
                showShiftDialog: false,
            };
        },

        mounted() {
        },

        methods: {
            /*
            * 获取各字段的过滤条件数据
            * */
            getFilterData() {
                return this.$refs.tableHead.getFilterData()
            },

            /*
            * 刷新各字段的过滤条件数据
            * */
            refreshFilterData(arrFilterData) {
                this.$refs.tableHead.refreshFilterData(arrFilterData)
            },

            tableScroll(scrollLeft) {
                // 表格部分宽度变化
                if (this.rosterData.rosterview === 'taborg') {
                    this.$refs.rosterTable_org.tableScroll(scrollLeft);
                } else {
                    this.$refs.rosterTable.tableScroll(scrollLeft);
                }

                this.$refs.tableHead.tableScroll(scrollLeft);
                if (this.$refs.total) this.$refs.total.tableScroll(scrollLeft);

            },

            /*
            * 用户拖动表格部分的线，整体宽度变化
            * */
            tableLineSlide(newWidth) {
                // 头部宽度变化
                this.$refs.tableHead.middleWidth = newWidth + 'px';
                this.$refs.tableHead.rightWidth = `calc(100% - 230px - 40px - ${newWidth}px)`;
                // 表格部分宽度变化
                this.infoDetailWidthChange(newWidth);
            },

            /*
            * 用户拖动头部的线，表格部分的宽度变化
            * */
            infoDetailWidthChange(newWidth) {
                // 表格部分宽度变化
                if (this.rosterData.rosterview === 'taborg') {
                    this.$refs.rosterTable_org.infoDetailWidthChange(newWidth);
                } else {
                    this.$refs.rosterTable.infoDetailWidthChange(newWidth);
                }
                // 滚动条部分宽度变化
                this.$refs.slideBar.middleWidth = newWidth + 'px';
                this.$refs.slideBar.rightWidth = `calc(100% - 90px - 40px - ${newWidth}px)`;
                // 统计栏部分宽度变化（预览模块没有统计栏）
                if (this.$refs.total) this.$refs.total.middleWidth = newWidth + 'px';
                if (this.$refs.total) this.$refs.total.rightWidth = `calc(100% - 90px - 40px - ${newWidth}px)`;
            },

            toggleTotal() {
                this.showTotal = !this.showTotal;
            },
            colCellActive(index, clientX, clientY) {
                if (this.rosterData.rosterview === 'taborg') {
                    this.$refs.rosterTable_org.colCellActive(index, clientX, clientY);
                } else {
                    this.$refs.rosterTable.colCellActive(index, clientX, clientY);
                }
            },
            opPower(args) {
                if (this.rosterData.rosterview === 'taborg') {
                    this.$refs.rosterTable_org.opPower(args)
                } else {
                    this.$refs.rosterTable.opPower(args)
                }
            },
            onloadOrgPersonRoster(personRoster) {
                this.$refs.rosterTable_org.onloadOrgPersonRoster(personRoster)
            },
            saveRoster() {
                if (this.rosterData.rosterview === 'taborg') {
                    this.$refs.rosterTable_org.saveRoster()
                } else {
                    this.$refs.rosterTable.saveRoster()
                }
            },
            timeOverlap(arrOverlapRoster) {
                if (this.rosterData.rosterview === 'taborg') {
                    this.$refs.rosterTable_org.timeOverlap(arrOverlapRoster)
                } else {
                    this.$refs.rosterTable.timeOverlap(arrOverlapRoster)
                }
            },
            cancelAllActive() {
                if (this.rosterData.rosterview === 'taborg') {
                    this.$refs.rosterTable_org.cancelAllActive()
                } else {
                    this.$refs.rosterTable.cancelAllActive()
                }
            },
            changeCellHeight() {
                this.$refs.rosterTable.changeCellHeight()
            }
        }
    };
</script>

<style scoped>
    .wtc_roster-wrap {
        position: relative;
        font-size: 14px;
        color: #212121;
        width: 100%;
        height: 100%;
        /*height: calc(100vh - 210px);*/
        overflow: hidden;
    }

    .wtc_roster-wrap .wtc_roster-simple-table {
        position: relative;
        overflow: hidden;
        border: 1px solid #d9d9d9;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }


    /*展开按钮*/
    .wtc_roster-simple-table .wtc_roster-simple-table-fold-btn {
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #8590A6;
        /*opacity: 0.6;*/
        color: #fff;
        padding: 2px 10px;
        border-radius: 4px;
        cursor: pointer;
        z-index: 6;
        font-size: 12px;
    }

    .wtc_roster-simple-table .wtc_roster-simple-table-fold-btn i {
        margin-left: 4px;
        vertical-align: sub;
    }

    .wtc_roster-simple-table .wtc_roster-simple-table-fold-btn:hover {
        opacity: 0.8;
    }


    /*右键菜单*/
    .wtc_roster_rightClickMenu-item input::-webkit-input-placeholder {
        color: #b2b2b2;
    }

    .wtc_roster_rightClickMenu-item input::-moz-input-placeholder {
        color: #b2b2b2;
    }

    .wtc_roster_rightClickMenu-item input::-ms-input-placeholder {
        color: #b2b2b2;
    }



    .wtc_roster-wrap .wtc_roster-simple-table .wtc_roster-size-large {
        flex-basis: 106px;
        width: 106px;
    }

    .wtc_roster-wrap .wtc_roster-simple-table .wtc_roster-size-middle {
        flex-basis: 80px;
        width: 80px;
    }

    .wtc_roster-wrap .wtc_roster-simple-table .wtc_roster-size-small {
        flex-basis: 50px;
        width: 50px;
    }
</style>