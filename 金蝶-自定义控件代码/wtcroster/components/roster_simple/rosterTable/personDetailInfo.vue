<!--
 * @Author: kztai 1012049531@qq.com
 * @Date: 2023-06-15 16:28:08
 * @LastEditors: kztai 1012049531@qq.com
 * @LastEditTime: 2023-06-15 16:38:37
 * @FilePath: \learn\newCodeInKingdee\自定义控件代码\wtcroster\components\roster_simple\rosterTable\personDetailInfo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="wtc_roster-simple-table-middle-group-list" :style="{'width': middleWidth}">
        <ul class="wtc_roster-simple-table-middle-data-list" v-for="(rosterData, index) in shiftModelList" :key="index">
            <li class="wtc_roster-simple-table-middle-data-item" v-for="(field, index1) in arrPersonField" :key="index1"
                :style="{'height': cellHeight}">
                <span :title="rosterData.rosterPerson[field]">{{ rosterData.rosterPerson[field] }}</span>
            </li>
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
                middleWidth: '0px',
                cellHeight: '60px',
                arrPersonField: [
                    'number', 'attFileBaseNumber', 'org', 'company', 'adminorg', 'affiliateadminorgname', 'group', 'job', 'position', 'realTime', 'planTime'
                ]
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
    .wtc_roster-simple-table-middle-group-list {
        display: inline-block;
        width: 600px;
        box-sizing: border-box;
        background-color: #fff;
        vertical-align: top;
        font-size: 14px;
    }

    .wtc_roster-simple-table-middle-data-list {
        display: flex;
        background-color: #fbfbfb;
    }

    .wtc_roster-simple-table-middle-group-list .wtc_roster-simple-table-middle-data-item {
        display: flex;
        flex: 0 0 90px;
        width: 90px;
        box-sizing: border-box;
        border-bottom: 1px solid #D9D9D9;
        border-right: 1px solid #D9D9D9;
        word-break: break-all;
        padding: 0 4px;
        overflow: hidden;
        font-size: 12px;
        color: #666;
    }

    .wtc_roster-simple-table-middle-group-list .wtc_roster-simple-table-middle-data-item>span {
        text-align: left;
        align-self: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
</style>