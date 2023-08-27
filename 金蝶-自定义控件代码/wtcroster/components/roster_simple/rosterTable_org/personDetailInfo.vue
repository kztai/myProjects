<template>
    <ul class="wtc_roster-simple-table-middle-group-list" :style="{'width': middleWidth}">
        <li class="wtc_roster-simple-table-middle-group-item" v-for="(orgRosterData, index) in orgShiftModelList"
            :key="index" :groupid="orgRosterData.id">
            <ul class="wtc_roster-simple-table-middle-group-row">
                <li class="wtc_roster-simple-table-middle-group-row-item" v-for="(type, index3) in arrPersonInfo"
                    :key="index3"></li>
            </ul>
            <div class="wtc_roster-simple-table-middle-person-info">
                <ul class="wtc_roster-simple-table-middle-data-list"
                    v-for="(rosterData, index1) in rosterShiftModelList[index]" :key="index1">
                    <li class="wtc_roster-simple-table-middle-data-item" v-for="(type, index2) in arrPersonInfo"
                        :key="index2">
                        <span :title="rosterData.rosterPerson[type]">{{rosterData.rosterPerson[type]}}</span>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "personDetailInfoOrg",

        props: ['orgShiftModelList'],
        inject: ['model', 'KDApi'],

        data() {
            return {
                rosterShiftModelList: [],
                middleWidth: '0px',
                arrPersonInfo: [
                    'number',
                    'attFileBaseNumber',
                    'org',
                    'company',
                    'adminorg',
                    'affiliateadminorgname',
                    'group',
                    'job',
                    'position',
                    'realTime',
                    'planTime',
                ]
            };
        },

        watch: {
            orgShiftModelList(newValue) {
                this.initRosterShiftModelList(newValue.length);
            }
        },

        mounted() {
            this.initRosterShiftModelList(this.orgShiftModelList.length);
        },

        methods: {
            initRosterShiftModelList(orgRosterLen) {
                this.rosterShiftModelList = [];
                for (let i = 0; i < orgRosterLen; i++) {
                    this.rosterShiftModelList.push([]);
                }
            },
        }
    };
</script>

<style scoped>
    .wtc_roster-simple-table-middle-group-list {
        display: inline-block;
        width: 600px;
        box-sizing: border-box;
        background-color: #fff;
        vertical-align: top;
        font-size: 14px;
    }

    .wtc_roster-simple-table-middle-group-list .wtc_roster-simple-table-middle-group-row {
        display: flex;
        background-color: #f2f2f2;
    }

    .wtc_roster-simple-table-middle-group-list .wtc_roster-simple-table-middle-group-row-item {
        flex: 0 0 90px;
        width: 90px;
        height: 30px;
        border-bottom: 1px solid #D9D9D9;
        border-right: 1px solid #D9D9D9;
        box-sizing: border-box;
    }

    .wtc_roster-simple-table-middle-group-list .wtc_roster-simple-table-middle-person-info {
        /*max-height: 100px;*/
        /*overflow: hidden;*/
    }

    .wtc_roster-simple-table-middle-data-list {
        display: flex;
        background-color: #fbfbfb;
    }

    .wtc_roster-simple-table-middle-group-list .wtc_roster-simple-table-middle-data-item {
        display: flex;
        flex: 0 0 90px;
        width: 90px;
        height: 60px;
        box-sizing: border-box;
        border-bottom: 1px solid #D9D9D9;
        border-right: 1px solid #D9D9D9;
        word-break: break-all;
        padding: 0 4px;
        overflow: hidden;
        font-size: 12px;
        color: #666;
    }

    .wtc_roster-simple-table-middle-group-list .wtc_roster-simple-table-middle-data-item span {
        text-align: left;
        align-self: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
</style>