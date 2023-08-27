<template>
    <div class="wtc_roster-shift-info-wrap">
        <div class="wtc_roster-first-page-shift-list">
            <div class="wtc_roster-shift-item wtc_roster-shift-item-inline" v-for="(shift, index) in firstPageShift"
                :key="index">
                <div class="wtc_roster-shift-item-color" :style="{background: shift.shiftColor}"></div>
                <div class="wtc_roster-shift-item-text" :title="shift.name">{{shift.name}}</div>
            </div>
        </div>
        <!-- type：0表示预览模块， 1表示排班模块 -->
        <div class="wtc_roster-shift-info-all"
            v-if="type === 0 && arrShowShift.length>3 || type === 1 && arrShowShift.length>2">
            <i class="wtc_roster-shift-info-icon kdfont kdfont-gengduo"></i>
            <div class="wtc_roster-shift-info-all-list-wrap">
                <div class="wtc_roster-shift-info-all-list">
                    <div class="wtc_roster-shift-item" v-for="(shift, index) in arrShowShift" :key="index">
                        <div class="wtc_roster-shift-item-color" :style="{background: shift.shiftColor}"></div>
                        <div class="wtc_roster-shift-item-text" :title="shift.name">{{shift.name}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "shiftInfo",
        components: {
        },
        props: ['type', 'shiftListId'],
        inject: ['model'],

        data() {
            return {
                firstPageShift: [],
                arrShowShift: []
            };
        },

        watch: {
            shiftListId(newValue) {
                this.init(newValue)
            }
        },

        mounted() {
            this.init(this.shiftListId)
        },

        methods: {
            init(shiftListId) {
                // type=0循环排班，1排班管理
                this.firstPageShift = [];
                this.arrShowShift = [];

                let firstPageShiftCount = this.type === 0 ? 3 : 2;
                // this.firstPageShift = this.type === 0 ? this.shiftList.slice(0,3) : this.shiftList.slice(0,3);
                for (let i = 0; i < shiftListId.length; i++) {
                    for (let j = 0; j < this.$parent.rosterData.shiftModelList.length; j++) {
                        let objShift = this.$parent.rosterData.shiftModelList[j];
                        if (objShift.id === shiftListId[i]) {
                            if (this.firstPageShift.length < firstPageShiftCount) {
                                this.firstPageShift.push({
                                    name: objShift.name,
                                    shiftColor: objShift.shiftColor
                                })
                            }
                            this.arrShowShift.push({
                                name: objShift.name,
                                shiftColor: objShift.shiftColor
                            });
                            break;
                        }
                    }
                }
            },
            saveRoster() {
                this.$refs.roster.roster.saveRoster()
            },
            refreshRoster(rosterData) {
                this.$refs.roster.roster.refreshRoster(rosterData)
            },
            showRoster(showType) {
                this.$refs.roster.roster.showRoster(showType)
            },
            onloadOrgPersonRoster(personRoster) {
                this.$refs.roster.roster.onloadOrgPersonRoster(personRoster)
            },
            pageChange(curPage, curPartPage) {
                this.model.invoke('pageChange', {
                    curPage: curPage,
                    curPartPage: curPartPage,
                    rosterview: this.$refs.roster.roster.rosterData.rosterview,
                    groupId: this.$refs.roster.roster.rosterData.rosterview === 'taborg' ? this.$refs.roster.roster.showGroupId : undefined
                })
            }
        }
    };
</script>

<style scoped>
    .wtc_roster-shift-info-wrap {
        display: flex;
        font-size: 12px;
        color: #333;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-first-page-shift-list {
        /*max-width: 100px;*/
        display: flex;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-info-all {
        position: relative;
        padding: 10px 0;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-info-all:hover .wtc_roster-shift-info-all-list-wrap {
        display: block;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-info-all .wtc_roster-shift-info-icon {
        cursor: pointer;
        color: #999;
        font-size: 16px;
        /*vertical-align: -webkit-baseline-middle;*/
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-info-all .wtc_roster-shift-info-all-list-wrap {
        display: none;
        position: absolute;
        left: -290px;
        top: 24px;
        padding: 10px;
        z-index: 1000;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-info-all .wtc_roster-shift-info-all-list {
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
        background-color: #fff;
        width: 300px;
        border-radius: 4px;
        max-height: 300px;
        overflow: auto;
        padding-left: 8px;
    }

    /*班次*/
    .wtc_roster-shift-info-wrap .wtc_roster-shift-item {
        width: 33.3%;
        padding: 10px 4px 10px 12px;
        display: inline-block;
        box-sizing: border-box;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-item-inline {
        width: 100%;
        display: flex;
        line-height: 20px;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-item .wtc_roster-shift-item-color {
        flex: 0 0 8px;
        width: 8px;
        height: 8px;
        display: inline-block;
        margin-right: 2px;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-item-inline .wtc_roster-shift-item-color {
        margin-top: 6px;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-item .wtc_roster-shift-item-text {
        display: inline-block;
        width: 80%;
        /*flex:1;*/
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: bottom;
    }

    .wtc_roster-shift-info-wrap .wtc_roster-shift-item-inline .wtc_roster-shift-item-text {
        width: auto;
        flex: 1;
        max-width: 80px;
    }
</style>