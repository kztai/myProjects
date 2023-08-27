<template>
    <div class="wtc_roster-table-content-wrap">
        <personMainInfo @rowCellActive="rowCellActive" :shiftModelList="rosterData.rosterShiftModelList"
            :savePower="rosterData.savePower"></personMainInfo>

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
                infoDetailWidth: 'calc(100% - 230px - 40px)'
            };
        },

        mounted() {

        },

        methods: {
            tableLineSlide(newWidth) {
                this.$emit('tableLineSlide', newWidth);
            },
            infoDetailWidthChange(newWidth) {
                this.$refs.personDetailInfo.middleWidth = newWidth + 'px';
                this.$refs.rosterCells.rightWidth = `calc(100% - 230px - 40px - ${newWidth}px)`;
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
        }
    };
</script>

<style scoped>
    /*表格内容*/
    .wtc_roster-table-content-wrap {
        width: 100%;
        height: calc(100% - 50px);
        /*overflow-y: overlay;*/
        overflow-y: auto;
        overflow-x: hidden;
        font-size: 0;
    }
</style>