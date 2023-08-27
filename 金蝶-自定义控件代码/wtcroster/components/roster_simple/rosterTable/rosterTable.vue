<!--
 * @Author: kztai 1012049531@qq.com
 * @Date: 2023-06-15 16:28:08
 * @LastEditors: kztai 1012049531@qq.com
 * @LastEditTime: 2023-06-15 16:40:03
 * @FilePath: \learn\newCodeInKingdee\自定义控件代码\wtcroster\components\roster_simple\rosterTable\rosterTable.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="wtc_roster-simple-table-content-wrap">
        <personMainInfo ref="personMainInfo" @rowCellActive="rowCellActive"
            :shiftModelList="rosterData.rosterShiftModelList" :savePower="rosterData.savePower"></personMainInfo>

        <personDetailInfo ref="personDetailInfo" :shiftModelList="rosterData.rosterShiftModelList"></personDetailInfo>

        <planActualSpan :shiftModelList="rosterData.rosterShiftModelList" :showType="rosterData.showType"
            @tableLineSlide="tableLineSlide"></planActualSpan>

        <rosterCells ref="rosterCells" :allRosterData="rosterData"></rosterCells>
    </div>
</template>

<script>
    import personMainInfo from "./personMainInfo.vue";
    import personDetailInfo from "./personDetailInfo.vue";
    import planActualSpan from "./planActualSpan.vue";
    import rosterCells from "./rosterCells.vue";

    export default {
        name: "rosterTable",
        components: { personMainInfo, personDetailInfo, rosterCells, planActualSpan },
        props: ['rosterData'],
        inject: ['model', 'KDApi'],

        data() {
            return {
                infoDetailWidth: 'calc(100% - 90px - 40px)'
            };
        },

        mounted() {
            // 初始化子模块的单元格高度
            this.changeCellHeight();
        },

        methods: {
            tableLineSlide(newWidth) {
                this.$emit('tableLineSlide', newWidth);
            },
            infoDetailWidthChange(newWidth) {
                this.$refs.personDetailInfo.middleWidth = newWidth + 'px';
                this.$refs.rosterCells.rightWidth = `calc(100% - 90px - 40px - ${newWidth}px)`;
            },
            tableScroll(scrollLeft) {
                this.$refs.rosterCells.tableScroll(scrollLeft);
            },
            rowCellActive(index, clientX, clientY) {
                this.$refs.rosterCells.rowCellActive(index, clientX, clientY);
            },
            colCellActive(index, clientX, clientY) {
                this.$refs.rosterCells.colCellActive(index, clientX, clientY);
            },
            opPower(args) {
                this.$refs.rosterCells.opPower(args)
            },
            saveRoster() {
                this.$refs.rosterCells.saveRoster()
            },
            timeOverlap(arrOverlapRoster) {
                this.$refs.rosterCells.timeOverlap(arrOverlapRoster)
            },
            cancelAllActive() {
                this.$refs.rosterCells.cancelAllActive()
            },
            changeCellHeight() {
                if (this.rosterData.showType === 'SHOW_ALL') {
                    this.$refs.personMainInfo.cellHeight = '60px';
                    this.$refs.personDetailInfo.cellHeight = '60px';
                } else {
                    this.$refs.personMainInfo.cellHeight = '30px';
                    this.$refs.personDetailInfo.cellHeight = '30px';
                }
            }
        }
    };
</script>

<style scoped>
    /*表格内容*/
    .wtc_roster-simple-table-content-wrap {
        width: 100%;
        height: calc(100% - 50px);
        /*overflow-y: overlay;*/
        overflow-y: auto;
        overflow-x: hidden;
        font-size: 0;
    }
</style>