<template>
  <div class="steps-ctrl">
    <h1 class="title">{{getLangMsg("steps.key0001")}}</h1>
    <div class="steps-wrap">
      <div v-for="(step, index) in stepsArr" :key="step" :class="{
        'steps-item': true,
        active: activeIndex - 0 >= index,
        wait: activeIndex + 1 === index
      }">
        <span class="round">{{index+1}}</span>
        <span class="stepsTxt">{{step}}</span>
      </div>
    </div>
    <button
      class="toNextBtn"
      @click="handleToNextStep()"
    >{{getLangMsg("steps.key0003")}}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: -1,
      stepsArr: [1, 2, 3]
    };
  },
  created() {
    const self = this
    this.activeIndex = this.activeInd
    this.stepsArr = [1, 2, 3].map(item => {
      return self.getLangMsg("steps.key0002") + item;
    })
  },
  watch: {
    activeInd: function(newValue, oldValue) {
      console.log(`activeInd new: ${newValue}, activeInd old: ${oldValue}`)
      this.activeIndex = newValue
    }
  },
  props: {
    activeInd: Number,
    model: Object,
    getLangMsg: Function,
    invoke: Function
  },
  methods: {
    handleToNextStep: function () {
      let index = this.activeIndex
      if (index >= this.stepsArr.length - 1) {
        index = -2;
      }
      this.invoke('click', index)
    }
  }
};
</script>
<style  lang="less"  scoped>
 .steps-ctrl {
  width: 100%;
  font-size: 12px;
  margin-left: 25px;
  .title {
    color: #333;
  }
  .steps-wrap {
    height: 57px;
    display: flex;
    align-items: center;
    .steps-item {
      display: flex;
      flex-direction: column;
      color: #c0c4cc;
      margin-left: 381px;
      &:first-child {
        margin-left: 0;
        .round:before {
          display: none;
        }
      }
      &.active {
        .stepsTxt,
        .round {
          color: #1989fa;
          font-weight: 500;
        }
        .round {
          border-color: #1989fa;
          &:before {
            background-color: #1989fa;
          }
        }
      }
      &.wait {
        .stepsTxt,
        .round {
          color: #303133;
          font-weight: 500;
        }
        .round {
          border-color: #303133;
        }
      }
      .round {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid;
        border-color: #c0c4cc;
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        &:before {
          display: block;
          content: "";
          width: 388px;
          height: 2px;
          background-color: #c0c4cc;
          position: absolute;
          right: 22px;
          top: 9px;
        }
      }
      .stepsTxt {
        color: #c0c4cc;
      }
    }
  }
  .toNextBtn {
    margin-top: 12px;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;
  }
} 

</style>