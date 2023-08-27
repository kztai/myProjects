<template>
    <div>
        <!--todo 这期暂不使用-->
        <div class="wtc_personnelSchedule-dialog-icon kdfont kdfont-gongzuorili wtc_personnelSchedule-dialog-active">
        </div>
        <div class="wtc_personnelSchedule-dialog">
            <div class="wtc_personnelSchedule-dialog-close kdfont kdfont-guanbi6"></div>
            <div class="wtc_personnelSchedule-dialog-move"></div>
            <div class="wtc_personnelSchedule-dialog-tab">
                <div class="wtc_personnelSchedule-dialog-tab-usual">{{KDApi.getLangMsg(model, 'popularShift')}}</div>
                <div class="wtc_personnelSchedule-dialog-tab-all wtc_personnelSchedule-dialog-tab-active">
                    {{KDApi.getLangMsg(model, 'allShift')}}
                </div>
            </div>
            <div class="wtc_personnelSchedule-dialog-input-wrap">
                <div class="wtc_personnelSchedule-dialog-input-icon kdfont kdfont-sousuo2"></div>
                <input type="text" :placeholder="KDApi.getLangMsg(model, 'placeholder1')"
                    class="wtc_personnelSchedule-dialog-input">
            </div>
            <div class="wtc_personnelSchedule-dialog-radio-wrap"></div>
            <ul class="wtc_personnelSchedule-dialog-shift-list"></ul>
        </div>
    </div>
</template>

<style scoped>
    /*班次面板弹窗*/
    .wtc_personnelSchedule-dialog-icon {
        position: fixed;
        right: 40px;
        top: 280px;
        z-index: 9999;
        display: none;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(52, 56, 72, 0.70);
        color: #fff;
        text-align: center;
        line-height: 48px;
        font-size: 30px;
        cursor: pointer;
    }

    .wtc_personnelSchedule-dialog-icon:hover {
        background: rgba(106, 111, 133, 0.70);
    }

    .wtc_personnelSchedule-dialog {
        position: fixed;
        top: 280px;
        display: none;
        background-color: #fff;
        width: 240px;
        height: 560px;
        box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.20);
        border-radius: 2px;
        z-index: 9999;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-move {
        width: 100%;
        height: 30px;
        cursor: move;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-tab {
        width: 100%;
        display: flex;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-tab div {
        flex: 1;
        padding: 4px 10px;
        text-align: center;
        border-bottom: 1px solid #d9d9d9;
        color: #666;
        cursor: pointer;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-tab .wtc_personnelSchedule-dialog-tab-active {
        color: #276FF5;
        border-bottom: 1px solid #276FF5;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-input-wrap {
        display: flex;
        border: 1px solid #d9d9d9;
        background-color: #fafafa;
        color: #666;
        box-sizing: border-box;
        padding: 6px 10px;
        margin: 16px 10px;
        font-size: 12px;
        border-radius: 2px;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-input-wrap .wtc_personnelSchedule-dialog-input-icon {
        flex: 0 0 16px;
        margin-right: 10px;
        cursor: pointer;
        color: var(--themeColor, #276FF5);
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-input-wrap .wtc_personnelSchedule-dialog-input {
        flex: 1;
        outline: none;
        border: none;
        background-color: #fafafa;
    }

    .wtc_personnelSchedule-dialog-input-wrap .wtc_personnelSchedule-dialog-input::-webkit-input-placeholder {
        color: #b2b2b2;
    }

    .wtc_personnelSchedule-dialog-input-wrap .wtc_personnelSchedule-dialog-input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #b2b2b2;
    }

    .wtc_personnelSchedule-dialog-input-wrap .wtc_personnelSchedule-dialog-input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #b2b2b2;
    }

    .wtc_personnelSchedule-dialog-input-wrap .wtc_personnelSchedule-dialog-input:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #b2b2b2;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-radio-wrap {
        display: flex;
        padding: 0 10px 16px 10px;
        color: #212121;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-radio-wrap label {
        flex: 1;
        cursor: pointer;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-radio-wrap label input {
        width: 16px;
        height: 16px;
        vertical-align: bottom;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-shift-list {
        padding: 0 10px;
        height: 406px;
        overflow: auto;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-shift-list .wtc_personnelSchedule-dialog-shift-item {
        display: flex;
        margin-bottom: 10px;
        border: 1px solid #fff;
        border-radius: 2px;
        overflow: hidden;
        height: 44px;
        line-height: 44px;
        cursor: pointer;
        background-color: #eee;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-shift-list .wtc_personnelSchedule-dialog-shift-item-active {
        border: 1px solid #276FF5;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-shift-list .wtc_personnelSchedule-dialog-shift-item-color {
        flex: 0 0 2px;
        width: 2px;
        height: 100%;
        margin-right: 10px;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-shift-list .wtc_personnelSchedule-dialog-shift-item-icon {
        flex: 0 0 24px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        color: #fff;
        margin: 10px 10px 0 0;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-shift-list .wtc_personnelSchedule-dialog-shift-item-value {
        flex: 1;
        padding-right: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .wtc_personnelSchedule-dialog .wtc_personnelSchedule-dialog-close {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }

    .wtc_personnelSchedule-dialog-active {
        display: block;
    }
</style>