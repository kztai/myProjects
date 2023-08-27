<template>
    <transition name="wtc-abnormalDeal-slide-bottom">
        <div class="wtc-calendar-abnormalDeal" @click.stop v-show="showWrap">
            <div class="wtc-calendar-abnormalDeal-btn-cancel kdfont kdfont-guanbi6" @click="cancelClick"
                @touchmove.prevent></div>
            <div class="wtc-calendar-abnormalDeal-title" @touchmove.prevent>
                {{KDApi.getLangMsg(model, 'abnormalDealMethod')}}
            </div>
            <div class="wtc-calendar-abnormalDeal-list" ref="abnormalDealList">
                <div class="wtc-calendar-abnormalDeal-item" v-for="(objMethod, index) in methodsList" :key="index"
                    @click="methodClick(objMethod.id, index)">
                    <div class="wtc-calendar-abnormalDeal-item-text">{{ objMethod.value }}</div>
                    <div class="wtc-calendar-abnormalDeal-item-icon kdfont kdfont-danliexuanze"
                        :class="selectMethod(index)"></div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "abnormalDeal",
        props: {
            showWrap: {
                type: Boolean,
                default: false
            },
            KDApi: {
                type: Object
            },
            model: {
                type: Object
            },
        },
        data() {
            return {
                methodsList: [],
                checkedMethod: -1,
                startY: null,
                timeIndex: 0,
                dateIndex: 0,
                cardType: 'on'
            };
        },
        watch: {},

        mounted() {
            let $this = this;
            // 解决滚动穿透问题：
            this.$refs.abnormalDealList.addEventListener('touchmove', function (e) {
                $this.moveHandle(this, $this.startY, e);
            }, false);

            this.$refs.abnormalDealList.addEventListener('touchstart', function (e) {
                var targetTouches = e.targetTouches || [];
                if (targetTouches.length > 0) {
                    var touch = targetTouches[0] || {};
                    $this.startY = touch.clientY;
                }
            }, false);
        },

        methods: {
            // 解决滚动穿透问题：
            moveHandle(target, startY, e) {
                const { offsetHeight, scrollHeight } = target;

                // 只有当弹窗可以滚动的时候才要处理
                if (scrollHeight > offsetHeight) {
                    var changedTouches = e.changedTouches, canMove = false;
                    var scrollTop = target.scrollTop;
                    // 判断手指是否在移动
                    if (changedTouches.length > 0) {
                        var touch = changedTouches[0] || {};
                        var moveY = touch.clientY;
                        // 如果手指在移动，则把canMove置位false
                        if (moveY > startY && scrollTop <= 0) {
                            canMove = false;
                        } else if (moveY < startY && scrollTop + offsetHeight >= scrollHeight) {
                            canMove = false;
                        } else {
                            canMove = true;
                        }
                        if (!canMove) {
                            e.preventDefault();
                        }
                    }
                } else {
                    e.preventDefault();
                }
            },

            // 点击异常处理item
            methodClick(id, index) {
                this.checkedMethod = index;
                this.$emit('confirmClick', {
                    methodId: id,
                    timeIndex: this.timeIndex,
                    dateIndex: this.dateIndex,
                    cardType: this.cardType,
                });
            },

            selectMethod(index) {
                return { "wtc-calendar-abnormalDeal-item-icon-checked ": index === this.checkedMethod };
            },

            cancelClick() {
                this.$emit('cancelClick')
            },
        },
    };
</script>

<style scoped>
    .wtc-calendar-abnormalDeal {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: 14px;
        color: #212121;
        background-color: #fff;
    }

    .wtc-calendar-abnormalDeal .wtc-calendar-abnormalDeal-btn-cancel {
        position: absolute;
        right: 12px;
        top: 15px;
        font-size: 16px;
        color: #999;
    }

    .wtc-calendar-abnormalDeal .wtc-calendar-abnormalDeal-title {
        font-size: 16px;
        font-weight: 700;
        padding: 12px;
    }

    .wtc-calendar-abnormalDeal-list {
        max-height: 300px;
        overflow: auto;
    }

    .wtc-calendar-abnormalDeal-list .wtc-calendar-abnormalDeal-item {
        display: flex;
        border-top: 1px solid #e5e5e5;
        padding: 12px;
        justify-content: space-between;
    }

    .wtc-calendar-abnormalDeal-list .wtc-calendar-abnormalDeal-item-icon {
        color: #fff;
        font-weight: 700;
    }

    .wtc-calendar-abnormalDeal-list .wtc-calendar-abnormalDeal-item-icon-checked {
        color: #276FF5;
    }

    .wtc-abnormalDeal-slide-bottom-enter-active,
    .wtc-abnormalDeal-slide-bottom-leave-active {
        transition: transform .5s;
    }

    .wtc-abnormalDeal-slide-bottom-enter,
    .wtc-abnormalDeal-slide-bottom-leave-to {
        transform: translateY(100%)
    }
</style>