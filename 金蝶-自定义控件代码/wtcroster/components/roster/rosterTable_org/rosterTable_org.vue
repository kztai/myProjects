<template>
    <div class="wtc_roster-table-content-wrap">
        <personMainInfo ref="personMainInfo" @foldPerson="foldPerson" @rowCellActive="rowCellActive"
            :orgShiftModelList="rosterData.rosterAdminOrgModelsList" :savePower="rosterData.savePower"></personMainInfo>

        <personDetailInfo ref="personDetailInfo" :orgShiftModelList="rosterData.rosterAdminOrgModelsList">
        </personDetailInfo>

        <planActualSpan ref="planActualSpan" :orgShiftModelList="rosterData.rosterAdminOrgModelsList"
            :showType="rosterData.showType" @tableLineSlide="tableLineSlide"></planActualSpan>

        <rosterCells ref="rosterCells" :allRosterData="rosterData"></rosterCells>
    </div>
</template>

<script>
    import Vue from 'vue';
    import personMainInfo from "./personMainInfo.vue";
    import personDetailInfo from "./personDetailInfo.vue";
    import planActualSpan from "./planActualSpan.vue";
    import rosterCells from "./rosterCells.vue";

    export default {
        name: "rosterTableOrg",
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
            /*
            * 人员信息详情块拖动导致的宽度变化
            * */
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

            /*
            * 隐藏行政组织下的人员
            * */
            foldPerson(index) {
                if (index === -1) return;

                // this.$refs.personMainInfo.showPerson = false;
                this.$root.$refs.index.showPagination = false;

                Vue.set(this.$refs.personMainInfo.arrShowPerson, index, false);
                Vue.set(this.$refs.personMainInfo.rosterShiftModelList, index, []);
                Vue.set(this.$refs.personDetailInfo.rosterShiftModelList, index, []);
                Vue.set(this.$refs.planActualSpan.rosterShiftModelList, index, []);
                Vue.set(this.$refs.rosterCells.rosterShiftModelList, index, []);
                // this.$refs.personMainInfo.rosterShiftModelList[index] = [];
                // this.$refs.personDetailInfo.rosterShiftModelList[index] = [];
                // this.$refs.planActualSpan.rosterShiftModelList[index] = [];
                // this.$refs.rosterCells.rosterShiftModelList[index] = [];
            },

            /*
            * 加载行政组织中的人员排班
            * */
            onloadOrgPersonRoster(personRoster) {
                if (personRoster.existRoster) {

                    // 获取groupId对应的组织行索引：
                    for (let i = 0; i < this.rosterData.rosterAdminOrgModelsList.length; i++) {
                        if (this.rosterData.rosterAdminOrgModelsList[i].id === personRoster.groupId) {
                            this.rosterData.shiftModelList_orgPerson = personRoster.shiftModelList;
                            if (this.$refs.personMainInfo.curShowIndex !== i) {
                                // 先隐藏其他已展开组织下的人员列表：
                                this.foldPerson(this.$refs.personMainInfo.curShowIndex);
                                this.$refs.personMainInfo.curShowIndex = i;
                            }
                            break;
                        }
                    }
                    this.$root.$refs.index.showPagination = true;
                    // this.$refs.personMainInfo.arrShowPerson = true;

                    Vue.set(this.$refs.personMainInfo.arrShowPerson, this.$refs.personMainInfo.curShowIndex, true);
                    Vue.set(this.$refs.personMainInfo.rosterShiftModelList, this.$refs.personMainInfo.curShowIndex, personRoster.rosterShiftModelList);
                    Vue.set(this.$refs.personDetailInfo.rosterShiftModelList, this.$refs.personMainInfo.curShowIndex, personRoster.rosterShiftModelList);
                    Vue.set(this.$refs.planActualSpan.rosterShiftModelList, this.$refs.personMainInfo.curShowIndex, personRoster.rosterShiftModelList);
                    Vue.set(this.$refs.rosterCells.rosterShiftModelList, this.$refs.personMainInfo.curShowIndex, personRoster.rosterShiftModelList);
                    // this.$refs.personMainInfo.rosterShiftModelList[this.$refs.personMainInfo.curShowIndex] = personRoster.rosterShiftModelList;
                    // this.$refs.personDetailInfo.rosterShiftModelList[this.$refs.personMainInfo.curShowIndex] = personRoster.rosterShiftModelList;
                    // this.$refs.planActualSpan.rosterShiftModelList[this.$refs.personMainInfo.curShowIndex] = personRoster.rosterShiftModelList;
                    // this.$refs.rosterCells.rosterShiftModelList[this.$refs.personMainInfo.curShowIndex] = personRoster.rosterShiftModelList;
                }
            }
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