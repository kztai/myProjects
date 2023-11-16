<template>
  <div class="cyfj">
    <div class="title">笔录内容</div>
    <div class="container">
      <div class="container-left">
        <div class="toolbar">
          <div class="btn">
            <el-button type="text" :disabled="loading" @click="newRecord">新增笔录</el-button>
          </div>
          <div class="btn">
            <el-button type="text" :disabled="loading" @click="normalizeRecord">笔录规整</el-button>
          </div>
          <div class="btn">
            <el-button type="text" :disabled="loading" @click="analysisRecord">笔录分析</el-button>
          </div>
          <div class="select">
            <Select :disabled="loading" @optionChange="changeRecordType"></Select>
          </div>
        </div>
        <el-scrollbar v-show="isEdit" class="record-input space-base">
          <el-input class="record-textarea" type="textarea" :autosize="{ minRows: 27 }" placeholder="请输入内容"
            v-model="textareaValue"></el-input>
        </el-scrollbar>
        <el-scrollbar v-show="!isEdit" class="record-input space-base">
          <ul class="nomalize-record-list">
            <li class="nomalize-record-item" v-for="(objRecord, index) in normalizeRecordList" :key="index">
              <div class="item-img" :class="[objRecord.type === '问' ? 'question-item' : 'answer-item']">{{ objRecord.type
              }}
              </div>
              <div class="item-right">
                <div class="item-original item-wrap yellow-color" v-show="recordShowType !== optionIndex.correct">
                  <div class="original-date text-date">原始结果：{{ objRecord.originalData.date }}</div>
                  <div class="original-content text-content">{{ objRecord.originalData.content }}</div>
                </div>
                <div class="item-normalize item-wrap green-color" v-show="recordShowType !== optionIndex.original">
                  <div class="normalize-date text-date">规整结果：{{ objRecord.normalizeData.date }}</div>
                  <div class="normalize-content text-content">{{ objRecord.normalizeData.content }}</div>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>

      </div>
      <div class="container-right">
        <div class="case-provision">
          <div class="base-case brief-case">
            <h3>简要案情</h3>
            <el-scrollbar class="space-base">
              <p class="content-text">{{ briefCaseContent }}</p>
            </el-scrollbar>
          </div>
          <div class="base-case apply-provision">
            <h3>适用法条</h3>
            <el-scrollbar class="space-base">
              <p class="content-text">{{ applyProvisionContent }}</p>
            </el-scrollbar>
          </div>
        </div>
        <div class="base-case case-info">
          <h3>案情关键信息</h3>
          <el-scrollbar class="space-base">
            <ul class="info-list">
              <li class="info-item" v-for="(obj, index) in caseInfoList" :key="index">
                <div class="item-key">{{ obj.key }}</div>
                <div class="item-content" :title="obj.content">{{ obj.content }}</div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Message } from 'element-ui'

import { getCaseInfoResult, getLLMResult } from '@/apis/cyfj/index'
import { type caseInfo, type nomalizeRecord, optionIndex } from './type'
import Select from './Select.vue'

// 用户输入笔录文本
const recordShowType = ref<number>(optionIndex.originalAndCorrect)
// 用户输入笔录文本
const textareaValue = ref<string>('')
// 简要案情文本
const briefCaseContent = ref<string>('')
// 适用法条文本
const applyProvisionContent = ref<string>('')
// 笔录是否为编辑态
const isEdit = ref<boolean>(true)
// loading态
const loading = ref<boolean>(false)
// 案情关键信息数据：
const caseInfoList = reactive<caseInfo[]>([
  { key: '嫌疑人', content: 'xxxxxx' },
  { key: '被害人', content: '' },
  { key: '案发时间', content: '' },
  { key: '案发地点', content: '凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群' },
  { key: '案发经过', content: '' },
  { key: '手段', content: '' },
  { key: '案发结果', content: '' },
  { key: '涉案物品', content: '' },
])
// 规整后笔录数据：
const normalizeRecordList = reactive<nomalizeRecord[]>([
  {
    type: '问',
    originalData: {
      date: '2023-11-10 12:00',
      content: 'xxxxxxx',
    },
    normalizeData: {
      date: '2023-11-10 12:00',
      content: 'aaaaaaaaaaaa',
    },
  },
  {
    type: '答',
    originalData: {
      date: '2023-11-10 12:00',
      content: '凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群',
    },
    normalizeData: {
      date: '2023-11-10 12:00',
      content: '少时诵诗书所所所所所所凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群凄凄切切群群群群群群群群群群',
    },
  },
])

function changeRecordType(index: number) {
  recordShowType.value = index
}

// 新增笔录，需要清空原来数据：
function newRecord() {
  isEdit.value = true
  textareaValue.value = ''
  briefCaseContent.value = ''
  applyProvisionContent.value = ''
  normalizeRecordList.splice(0)
  caseInfoList.forEach((item, index) => {
    item.content = ''
  })
}

// 获取规整后笔录数据，并渲染：
async function normalizeRecord() {
  loading.value = true
  isEdit.value = false
  // 发送请求：
  loading.value = false

  // try {
  //   const res = await getLLMResult()
  //   debugger
  // } catch (err: any) {
  //   debugger
  //   Message({
  //     type: 'error',
  //     message: `获取失败. ErrCode: ${err.code}; ErrorMessage: ${err.message}`,
  //   })
  // }
}

// 获取分析笔录后的数据，并渲染：
async function analysisRecord() {
  loading.value = true
  Message.error('请先输入笔录。')

  // const res = await getCaseInfoResult()

  // try {
  //   const res = await getCaseInfoResult()
  //   debugger
  // } catch (err: any) {
  //   debugger
  //   Message({
  //     type: 'error',
  //     message: `获取失败. ErrCode: ${err.code}; ErrorMessage: ${err.message}`,
  //   })
  // }

  loading.value = false
}

</script>

<style lang="scss">
$theme-color: #00F0FF;

.cyfj {
  width: 100vw;
  height: 100vh;
  background-color: #011A4F;

  .title {
    padding: 20px 56px;
    font-size: 24px;
    font-family: PingFang SC-Medium, PingFang SC;
    font-weight: 500;
    color: $theme-color;
    background-image: url('../../assets/images/Group\ 41.png');
    background-size: 100% 100%;
    // background: rgba(0,0,0,0.2) url('../assets/images/Group\ 41.png') repeat 100% 100%;
  }

  .container {
    display: flex;
    padding: 20px;
    height: calc(100% - 76px);
    overflow: hidden;

    .container-left {
      display: flex;
      flex-direction: column;
      flex: 4;

      .toolbar {
        position: relative;
        margin-bottom: 10px;

        .btn {
          display: inline-block;
          margin-right: 10px;
          background-image: url('../../assets/images/Group\ 44.png');
          background-size: 100% 100%;

          .el-button--text {
            font-size: 20px;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            padding: 8px 24px;
            color: $theme-color;
          }

          .el-button.is-disabled {
            opacity: 0.3;
          }
        }

        .select {
          position: absolute;
          top: 0;
          right: 0;
        }
      }

      .record-input {
        flex: 1;
        padding: 4px;

        .nomalize-record-list {
          padding: 20px;

          .nomalize-record-item {
            margin-bottom: 32px;
            display: flex;

            .item-img {
              flex: 0 0 32px;
              width: 32px;
              height: 32px;
              line-height: 32px;
              text-align: center;
              border-radius: 50%;
            }

            .question-item {
              background-color: #F4DCFF;
              color: #7440B7;
            }

            .answer-item {
              background-color: #D4F2FF;
              color: #0072F7;
            }

            .item-right {
              flex: 1;
              margin-left: 10px;

              .item-wrap {
                padding-left: 10px;
                border-left-width: 4px;
                border-left-style: solid;
                margin-bottom: 12px;
                font-size: 14px;

                .text-date {
                  margin-bottom: 4px;
                  opacity: 0.8;
                  font-size: 12px;
                }

                .text-content {
                  // line-height: 20px;
                }
              }
            }
          }
        }

        .el-textarea__inner {
          background-color: #01153f;
          border: none;
          color: #fff;
        }

        .el-scrollbar__view {
          height: 100%;
        }
      }
    }

    .container-right {
      flex: 6;
      display: flex;
      flex-direction: column;
      margin-left: 25px;
      overflow: hidden;

      // 右侧各个块的样式（公共）：
      .base-case {
        flex: 1;
        display: flex;
        flex-direction: column;
        color: #fff;

        h3 {
          margin-bottom: 10px;
          font-size: 24px;
          font-family: PingFang SC-Medium, PingFang SC;
          font-weight: 500;
          color: $theme-color;
        }
      }

      .case-provision {
        flex: 3;
        display: flex;

        .brief-case {
          margin-right: 10px;
        }

        .apply-provision {}

        .space-base {
          height: 160px;
          padding: 20px;
          color: #fff;

          .content-text {
            font-size: 16px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
          }
        }
      }

      .case-info {
        flex: 7;
        margin-top: 10px;
        overflow: hidden;

        .info-item {
          display: flex;
          padding: 10px 20px;

          .item-key {
            flex: 0 0 110px;
            margin-right: 10px;
            background-image: url('../../assets/images/Group\ 70.png');
            background-size: 100% 100%;
            width: 110px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-family: PingFang SC-Medium, PingFang SC;
            font-size: 16px;
            color: #fff;
          }

          .item-content {
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
          }
        }

        .space-base {
          flex: 1;
        }
      }
    }

    .space-base {
      background: rgba(0, 0, 0, 0.2);
      box-shadow: 0px 0px 8px 0px rgba(0, 240, 255, 0.4);
      border-radius: 16px 16px 16px 16px;
      opacity: 1;
      border: 1px solid #4BB3FF;
      overflow: auto;

      .el-scrollbar__wrap {
        margin-bottom: 0 !important;
        margin-right: 0 !important;
      }
    }
  }

  .yellow-color {
    color: #D4AD4B;
    border-color: #D4AD4B;
  }

  .theme-color {
    color: $theme-color;
    border-color: $theme-color;
  }

  .green-color {
    color: #37DE70;
    border-color: #37DE70;
  }
}
</style>
