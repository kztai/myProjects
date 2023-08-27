<template>
    <div class="wtc_roster-table-middle-group-list" :style="{'width': middleWidth}">
        <ul class="wtc_roster-table-middle-data-list" v-for="(rosterData, index) in shiftModelList" :key="index">
            <li class="wtc_roster-table-middle-data-item">
                <span :title="rosterData.rosterPerson.number">{{rosterData.rosterPerson.number}}</span>
            </li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.attFileBaseNumber">{{rosterData.rosterPerson.attFileBaseNumber}}</span>
            </li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.org">{{rosterData.rosterPerson.org}}</span></li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.company">{{rosterData.rosterPerson.company}}</span></li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.adminorg">{{rosterData.rosterPerson.adminorg}}</span></li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.affiliateadminorgname">{{rosterData.rosterPerson.affiliateadminorgname}}</span>
            </li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.group">{{rosterData.rosterPerson.group}}</span></li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.job">{{rosterData.rosterPerson.job}}</span></li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.position">{{rosterData.rosterPerson.position}}</span></li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.realTime">{{rosterData.rosterPerson.realTime}}</span></li>
            <li class="wtc_roster-table-middle-data-item"><span
                    :title="rosterData.rosterPerson.planTime">{{rosterData.rosterPerson.planTime}}</span></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "personDetailInfo",

        props: ['shiftModelList'],
        inject: ['model', 'KDApi'],

        data() {
            return {
                middleWidth: '0px'
            };
        },

        mounted() {
            // console.log('人员详情信息：');
            // console.log(this.rosterData.rosterPerson);
        },

        methods: {}
    };
</script>

<style scoped>
    .wtc_roster-table-middle-group-list {
        display: inline-block;
        width: 600px;
        box-sizing: border-box;
        background-color: #fff;
        vertical-align: top;
        font-size: 14px;
    }

    .wtc_roster-table-middle-group-list .wtc_roster-table-middle-group-row {
        display: flex;
        background-color: #f2f2f2;
    }

    .wtc_roster-table-middle-group-list .wtc_roster-table-middle-group-row-item {
        flex: 0 0;
        height: 30px;
        border-bottom: 1px solid #D9D9D9;
        border-right: 1px solid #D9D9D9;
        box-sizing: border-box;
    }

    .wtc_roster-table-middle-group-list .wtc_roster-table-middle-person-info {
        /*max-height: 100px;*/
        /*overflow: hidden;*/
    }

    .wtc_roster-table-middle-data-list {
        display: flex;
        background-color: #fbfbfb;
    }

    .wtc_roster-table-middle-group-list .wtc_roster-table-middle-data-item {
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

    .wtc_roster-table-middle-group-list .wtc_roster-table-middle-data-item span {
        text-align: left;
        align-self: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
</style>