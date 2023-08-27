<template>
    <div class="wtc_roster-table-plan-actual-group-list-wrap">
        <div class="wtc_roster-table-slide-line" @mousedown="slideStart"></div>
        <ul class="wtc_roster-table-plan-actual-group-list">
            <li class="wtc_roster-table-plan-actual-item" v-for="(rosterData, index) in shiftModelList" :key="index">
                <div class="wtc_roster-table-right-plan-text"
                    v-show="showType === 'SHOW_ALL' || showType === 'SHOW_PLAN'">计划</div>
                <div class="wtc_roster-table-right-actual-text"
                    v-show="showType === 'SHOW_ALL' || showType === 'SHOW_REAL'">实际</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "planActualSpan",

        props: ['shiftModelList', 'showType'],
        inject: ['model', 'KDApi'],

        data() {
            return {

            };
        },

        mounted() {

        },

        methods: {
            slideStart(e) {
                const $this = this;
                // const $dom_middleHeaderList = $('.wtc_roster-table-middle-header-list-wrap', this.$root.$el);

                //防止默认事件发生
                e.preventDefault();
                //按下元素后，计算当前鼠标与对象计算后的坐标
                this.startX = e.clientX;
                this.preX = e.clientX;
                this.oldWidth = parseInt(this.$parent.$refs.personDetailInfo.middleWidth);
                // this.oldWidth = parseInt($dom_middleHeaderList.css('width'));

                $(document).on('mousemove.slideMove', function (ev) {
                    $this.slideing(ev)
                });
                $(document).on('mouseup.slideUp', function () {
                    $this.slideEnd()
                });
            },

            slideing(ev) {
                const $this = this;
                var endX = ev.clientX;
                var newWidth = this.oldWidth + (endX - this.startX);
                var personInfoWidth = $this.$parent.$parent.$refs.tableHead.personInfoWidth;

                newWidth = newWidth > personInfoWidth ? personInfoWidth : newWidth;
                newWidth = newWidth < 0 ? 0 : newWidth;

                // 判断拖动方向：
                // if (endX - this.preX > 0) {  // 向右
                //     $dom_slideBtnLeft.css('color', '#999');
                //     $dom_slideBtnRight.css('color', $this.themeNum);
                // } else {
                //     $dom_slideBtnRight.css('color', '#999');
                //     $dom_slideBtnLeft.css('color', $this.themeNum);
                // }

                this.preX = endX;  // 重置当前x坐标位置

                // 表格部分拖动线，需要通知父，整体调整宽度：
                this.$emit('tableLineSlide', newWidth);
            },

            slideEnd() {
                // $dom_slideBtnLeft.css('color', '#999');
                // $dom_slideBtnRight.css('color', '#999');

                $(document).unbind("mousemove.slideMove").unbind("mouseup.slideUp");
            },
        }
    };
</script>

<style scoped>
    .wtc_roster-table-plan-actual-group-list-wrap {
        position: relative;
        display: inline-block;
        width: 40px;
        font-size: 12px;
        box-sizing: border-box;
        z-index: 3;
        background-color: #fff;
        vertical-align: top;
    }

    .wtc_roster-table-plan-actual-group-list .wtc_roster-table-plan-actual-group-row {
        height: 30px;
        border-left: 1px solid #D9D9D9;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #D9D9D9;
        border-bottom: 1px solid #D9D9D9;
    }

    .wtc_roster-table-plan-actual-list {
        /*overflow: hidden;*/
        /*max-height: 100px;*/
    }

    .wtc_roster-table-plan-actual-group-list .wtc_roster-table-plan-actual-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-left: 1px solid #D9D9D9;
        box-sizing: border-box;
        height: 60px;
        background-color: #fff;
    }

    .wtc_roster-table-plan-actual-group-list .wtc_roster-table-plan-actual-item div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #D9D9D9;
        box-sizing: border-box;
    }

    .wtc_roster-table-plan-actual-group-list .wtc_roster-table-plan-actual-item .wtc_roster-table-right-actual-text {
        border-bottom: 1px solid #D9D9D9;
    }
</style>