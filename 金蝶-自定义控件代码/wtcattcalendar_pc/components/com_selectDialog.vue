<template>
    <a href="#" class="kzt_dialog-select">
        <div class="kzt_dialog-select-btn" ref="selectBtn" @click="toggleOptions">
            <span class="kzt_dialog-select-btn-text">处理</span>
            <i class="kzt_dialog-select-btn-icon kdfont"
                :class="{'kdfont-shouqi7':!showOptions, 'kdfont-zhankai4': showOptions}"></i>
        </div>
    </a>
</template>

<script>
    export default {
        name: "dialogSelect",
        props: {
            methodsList: {
                type: Array,
                default: []
            },
            cardType: {
                type: String
            },
            timeIndex: {
                type: Number
            },
            dateIndex: {
                type: Number
            },
        },
        data() {
            return {
                showOptions: false,
            };
        },
        watch: {},

        mounted() {
            let $this = this;

        },

        methods: {
            selectMethod(id) {
            },
            toggleOptions() {
                let $this = this;
                let position = this.getPosition(this.$refs.selectBtn, null);

                let data = {
                    themeColor: this.$root.themeNum,
                    positionX: position.left - 60,
                    positionY: position.top + 50,
                    data: [
                        [],  // 组
                    ],
                    callback: function (id) {
                        $this.showOptions = false;
                        $this.$emit('confirmClick', {
                            methodId: id,
                            timeIndex: $this.timeIndex,
                            dateIndex: $this.dateIndex,
                            cardType: $this.cardType,
                        });
                    },
                    cancelCallback() {
                        $this.showOptions = false
                    }
                };

                for (let i = 0; i < this.methodsList.length; i++) {
                    data.data[0].push({
                        value: this.methodsList[i].value,
                        iconLeft: '',
                        iconRight: '',
                        disabled: false,
                        index: this.methodsList[i].id,
                        isHtml: false,
                        children: []
                    })
                }

                this.$root.myTool.rightClickMenu(data);
                this.showOptions = true
            },


            /*获取一个元素到目标元素的距离*/
            getPosition(node, targetNode) {
                var left = node.offsetLeft - node.scrollLeft;
                var top = node.offsetTop - node.scrollTop;
                var parent = node.offsetParent;
                while (parent && parent !== targetNode) {
                    left += parent.offsetLeft - parent.scrollLeft;
                    top += parent.offsetTop - parent.scrollTop;
                    parent = parent.offsetParent;
                }
                return { "left": left, "top": top };
            }
        },
    };
</script>

<style scoped>
    .kzt_dialog-select {
        position: relative;
        text-decoration: none;
        color: #212121;
    }

    .kzt_dialog-select-btn {
        position: relative;
        display: inline-block;
        width: 48px;
        border: 1px solid var(--theme-color);
        border-radius: 2px;
        padding: 2px 6px;
        color: var(--theme-color);
        cursor: pointer;
    }

    .kzt_dialog-select .kzt_dialog-select-btn-text {
        font-size: 12px;

    }

    .kzt_dialog-select-btn-icon {
        margin-left: 4px;
        font-size: 12px;
    }

    .kzt_dialog-select .kzt_dialog-select-options {
        position: absolute;
        right: 0;
        bottom: 40px;
        width: 80px;
        background: #FFFFFF;
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.3);
        border-radius: 2px;
        overflow: hidden;
        z-index: 900;
    }

    .kzt_dialog-select-item {
        list-style: none;
        padding: 10px;
        text-align: left;
        color: #212121;
        cursor: pointer;
    }

    .kzt_dialog-select-item:hover {
        background-color: rgba(245, 245, 245, 0.4);
    }

    .kzt_dialog-select:hover,
    .kzt_dialog-select:visited,
    .kzt_dialog-select:link,
    .kzt_dialog-select:active {
        color: #212121;
    }
</style>