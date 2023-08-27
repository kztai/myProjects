<!--
 * @Author: kztai 1012049531@qq.com
 * @Date: 2022-06-08 19:48:37
 * @LastEditors: kztai 1012049531@qq.com
 * @LastEditTime: 2023-06-15 17:13:55
 * @FilePath: \vue-cli\src\components\dialogWrap.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
    <transition name="wtc-dialog-fade">
        <div class="wtc-dialog-wrap" ref="DialogWrap" @click="toggleWrap" v-show="showWrap"
            @touchmove.self="preventMove">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "dialogWrap",
        props: ['showWrap'],

        data() {
            return {
            };
        },

        mounted() {
            // var node = this.$refs.DialogWrap;
            // node.addEventListener('touchmove', function (e) {
            //   e.preventDefault();
            // }, false);
        },

        methods: {
            toggleWrap() {
                this.$emit('hideDialog');
            },
            preventMove(e) {
                // 阻止滚动穿透
                e.preventDefault();
            }
        }
    };
</script>

<style scoped>
    .wtc-dialog-wrap {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
        z-index: 9999;
    }

    .wtc-dialog-fade-enter-active,
    .wtc-dialog-fade-leave-active {
        transition: opacity .5s;
    }

    .wtc-dialog-fade-enter,
    .wtc-dialog-fade-leave-to {
        opacity: 0
    }
</style>