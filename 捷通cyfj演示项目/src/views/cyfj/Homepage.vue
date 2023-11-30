<template>
  <div class="cyfj">
    <div class="title">笔录内容</div>
    <div class="container">
      <div class="container-left">
        <div class="toolbar">
          <div class="btn">
            <el-button type="text" :disabled="btnLoading" @click="newRecord">新增笔录</el-button>
          </div>
          <div class="btn">
            <el-button type="text" :disabled="btnLoading" @click="normalizeRecord">笔录规整</el-button>
          </div>
          <div class="btn">
            <el-button type="text" :disabled="btnLoading" @click="analysisRecord">笔录分析</el-button>
          </div>
          <div class="select">
            <Select :disabled="isEdit" @optionChange="changeRecordType"></Select>
          </div>
        </div>
        <el-scrollbar v-show="isEdit" class="record-input space-base">
          <el-input class="record-textarea" type="textarea" :autosize="{ minRows: 27 }" placeholder="请输入内容"
            v-model="textareaValue"></el-input>
        </el-scrollbar>

        <el-scrollbar v-show="!isEdit" ref="normalizeScrollRef" class="record-input-view record-input space-base">
          <ul class="nomalize-record-list">
            <li v-for="(objRecord, index) in normalizeRecordList" :key="index">
              <div v-show="objRecord.show" class="nomalize-record-item">
                <div class="item-img" :class="[objRecord.type === '问' ? 'question-item' : 'answer-item']">{{
                  objRecord.type
                }}
                </div>
                <div class="item-right">
                  <div class="item-original item-wrap yellow-color" v-show="recordShowType !== optionIndex.correct">
                    <div class="original-date text-date">原始结果</div>
                    <div class="original-content text-content">{{ objRecord.originalData }}</div>
                  </div>
                  <div class="item-normalize item-wrap green-color" v-show="recordShowType !== optionIndex.original">
                    <div class="normalize-date text-date">规整结果</div>
                    <div class="normalize-content text-content">{{ objRecord.normalizeData }}</div>
                    <div v-show="!objRecord.isComplete" class="normalize-loading el-icon-loading"></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div class="container-right">
        <div class="case-provision">
          <div class="base-case brief-case">
            <h3 class="kzt-loading-test">简要案情 <i v-show="briefCaseLoading" class="el-icon-loading"></i></h3>
            <el-scrollbar class="space-base" ref="briefCaseScrollRef">
              <p class="content-text">{{ briefCaseContent }}</p>
            </el-scrollbar>
          </div>
          <div class="base-case apply-provision">
            <h3>适用法条 <i v-show="applyProvisionLoading" class="el-icon-loading"></i></h3>
            <el-scrollbar class="space-base" ref="provisionScrollRef">
              <p class="content-text">{{ applyProvisionContent }}</p>
            </el-scrollbar>
          </div>
        </div>
        <div class="base-case case-info">
          <h3>案情关键信息 <i v-show="caseInfoLoading" class="el-icon-loading"></i></h3>
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
import { ref, reactive, onUnmounted } from 'vue'
import { Message } from 'element-ui'

import { getCaseInfoResult, getSuggest } from '@/apis/cyfj/index'
import type { nerRequestParam, llmRequestParam } from '@/apis/cyfj/type'
import { type caseInfo, type nomalizeRecord, optionIndex } from './type'
import Select from './Select.vue'

// 显示类型
const recordShowType = ref<number>(optionIndex.originalAndCorrect)
// 用户输入笔录文本
const textareaValue = ref<string>('')
// 简要案情文本
const briefCaseContent = ref<string>('')
// 适用法条文本
const applyProvisionContent = ref<string>('')
// 笔录是否为编辑态
const isEdit = ref<boolean>(true)
// 按钮loading态
const btnLoading = ref<boolean>(false)
// 规整loading态
const normalizeLoading = ref<boolean>(true)
// 简要案情loading态
const briefCaseLoading = ref<boolean>(false)
// 适用法条loading态
const applyProvisionLoading = ref<boolean>(false)
// 案情关键信息loading态
const caseInfoLoading = ref<boolean>(false)
// 案情关键信息数据：
const caseInfoList = reactive<caseInfo[]>([
  { key: '嫌疑人', like: ['嫌疑人'], content: '' },
  { key: '被害人', like: ['被害人'], content: '' },
  { key: '案发时间', like: ['案发时间'], content: '' },
  { key: '案发地点', like: ['案发地点'], content: '' },
  { key: '案发经过', like: ['案发过程', '案发经过'], content: '' },
  { key: '手段', like: ['手段', '作案手段'], content: '' },
  { key: '案发结果', like: ['案发结果', '案件后果'], content: '' },
  { key: '涉案物品', like: ['涉案物品', '涉案金额', '淫秽物品', '淫秽物品内容', '作案工具', '毒品', '赃物'], content: '' },
])
// 规整后笔录数据：
const normalizeRecordList = ref<nomalizeRecord[]>([])
// 用于中断SSE：
let ctrl: AbortController | undefined
// 笔录规整框的ref
const normalizeScrollRef: any = ref()
// 简要案情框的ref
const briefCaseScrollRef: any = ref()
// 适用法条框的ref
const provisionScrollRef: any = ref()

onUnmounted(() => {
  ctrl?.abort()
})

function changeRecordType(index: number) {
  recordShowType.value = index
}

// 新增笔录，需要清空原来数据：
function newRecord() {
  isEdit.value = true
  textareaValue.value = ''
  briefCaseContent.value = ''
  applyProvisionContent.value = ''
  normalizeRecordList.value.splice(0)
  caseInfoList.forEach((item) => {
    item.content = ''
  })
}

// 获取规整后笔录数据，并渲染：
async function normalizeRecord() {
  // 前置操作：
  if (textareaValue.value === '') {
    Message.error('请先输入笔录。')
    return
  }
  normalizeRecordList.value.splice(0)
  btnLoading.value = true
  isEdit.value = false

  const recordList = normalizeRecordSplit()
  const arrPromise: any = []
  let timer: number | null = null

  // 开启定时器，定时将滚动条滚到底：
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  timer = setInterval(() => {
    normalizeScrollRef.value.wrap.scrollTop = normalizeScrollRef.value.wrap.scrollHeight
  }, 500)

  recordList.forEach((record, index) => {
    normalizeLoading.value = true
    // 组织好调接口前的数据结构：
    normalizeRecordList.value.push({
      type: record.slice(0, 1),
      show: index === 0,
      isComplete: false,
      originalData: record.slice(2),
      normalizeData: '',
    })
    // 发送请求：
    const data: llmRequestParam = {
      config: {
        streamOutput: true,
      },
      // text: '简述犯罪嫌疑人本次违法犯罪经历，以犯罪时间开头，说明地点和行为。以违法犯罪经历：开头。\n笔录如下：\n```\n' + record + '\n```',
      // text: record,
      text: `现在假设你是一名会议记录人员，需要你对一段会议记录的每一句话依次进行文本规整化，并直接返回规整化后的文本，回答的文本中不要增加任何额外内容。要求：1、规整化后的文本要忠于原始会议记录，保留会议记录中全部的有用信息；2、去除原文中明显的无意义表达；3、如果原文中存在明显的错别字，也需要进行改正。4、不要删除任何有用的信息。5、请用中文进行回答。6、不允许在回答中添加编造成分。7、如果原始会议记录中存在明显重复的表达，需用清晰通顺的方式改写。8、需注意原文中的数值不得擅自修改。原始会议记录为：“${record.slice(2)}“`,
    }

    arrPromise.push(
      new Promise((resolve, reject) => {
        getSuggest(ctrl, normalizeRecordList, index, data, (res: any) => {
          resolve(res)
        }, (err: any) => {
          reject(err)
        })
      }),
    )
  })

  return Promise.all(arrPromise).then((res) => {
    normalizeLoading.value = false
    btnLoading.value = false
    if (timer) clearInterval(timer)
    timer = null
  }).catch((err: any) => {
    normalizeLoading.value = false
    btnLoading.value = false
    if (timer) clearInterval(timer)
    timer = null
    Message({
      type: 'error',
      message: `获取规整数据失败. ErrCode: ${err?.code}; ErrorMessage: ${err?.message}`,
    })
  })
}

// 笔录数据分割：
function normalizeRecordSplit(): string[] {
  return textareaValue.value.split(/\n/g)
}

// 获取分析笔录后的数据，并渲染：
async function analysisRecord() {
  if (textareaValue.value === '') {
    Message.error('请先输入笔录。')
    return
  }

  btnLoading.value = true
  // 清空原数据：
  briefCaseContent.value = ''
  applyProvisionContent.value = ''
  caseInfoList.forEach((item) => {
    item.content = ''
  })

  Promise.all([analysisBriefCase(), analysisApplyProvision(), analysisCaseInfo()]).then((res) => {
    btnLoading.value = false
  }).catch((err) => {
    Message({
      type: 'error',
      message: `获取数据失败. ErrCode: ${err?.code}; ErrorMessage: ${err?.message}`,
    })
    btnLoading.value = false
  })
}

// 获取简要案情数据：
function analysisBriefCase() {
  let timer: number | null = null

  // 开启定时器，定时将滚动条滚到底：
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  timer = setInterval(() => {
    briefCaseScrollRef.value.wrap.scrollTop = briefCaseScrollRef.value.wrap.scrollHeight
  }, 50)

  briefCaseLoading.value = true
  const data: llmRequestParam = {
    config: {
      streamOutput: true,
    },
    text: '简述犯罪嫌疑人本次违法犯罪经历，以犯罪时间开头，说明地点和行为。以违法犯罪经历：开头。\n笔录如下：\n```\n' + textareaValue.value + '\n```',
  }

  return new Promise((resolve, reject) => {
    getSuggest(ctrl, briefCaseContent, null, data, (res: any) => {
      briefCaseLoading.value = false
      if (timer) clearInterval(timer)
      timer = null
      resolve(res)
    }, (err: any) => {
      if (timer) clearInterval(timer)
      timer = null
      reject(err)
    })
  })

  // getLLMResult(data).then((res) => {
  //   briefCaseContent.value = res.result.response
  // })
}

// 获取适用法条数据：
function analysisApplyProvision() {
  let timer: number | null = null

  // 开启定时器，定时将滚动条滚到底：
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  timer = setInterval(() => {
    provisionScrollRef.value.wrap.scrollTop = provisionScrollRef.value.wrap.scrollHeight
  }, 50)

  applyProvisionLoading.value = true
  const data: llmRequestParam = {
    config: {
      streamOutput: true,
    },
    text: '假设你是一名公安警察，根据笔录和中华人民共和国法律，说明犯罪嫌疑人涉嫌哪些犯罪。以根据笔录开头。以根据《中华人民共和国刑事诉讼法》第xx条之规定，拟提请对犯罪嫌疑人XX（刑事拘留、取保候审、延长拘留期限至、提请逮捕等等）结尾。笔录如下：\n```\n' + textareaValue.value + '\n```',
  }

  return new Promise((resolve, reject) => {
    getSuggest(ctrl, applyProvisionContent, null, data, (res: any) => {
      applyProvisionLoading.value = false
      if (timer) clearInterval(timer)
      timer = null
      resolve(res)
    }, (err: any) => {
      if (timer) clearInterval(timer)
      timer = null
      reject(err)
    })
  })

  // getLLMResult(data).then((res) => {
  //   applyProvisionContent.value = res.result.response
  // })
}

// 获取案情关键信息数据：
function analysisCaseInfo() {
  caseInfoLoading.value = true
  const recordList = textareaValue.value.split(/\n/g)
  const arrPromise = []
  const config = {
    config: {
      containTypes: caseInfoList.map((item) => item.like).flat(),
    },
  }

  for (let i = 0; i < recordList.length; i += 2) {
    const data = {
      ...config,
      text: recordList[i] + '\t' + recordList[i + 1],
    }
    arrPromise.push(getCaseInfoResult(data as nerRequestParam))
  }

  return Promise.all(arrPromise).then((res) => {
    // console.log(res)
    for (let i = 0; i < res.length; i++) {
      const { result } = res[i]
      for (let j = 0; j < result.entities.length; j++) {
        const nerEntity = result.entities[j]
        caseInfoList.forEach((item) => {
          if (item.like?.includes(nerEntity.tag)) {
            item.content = nerEntity.word
            // item.content += nerEntity.word + '；'
          }
        })
      }
    }

    caseInfoLoading.value = false
  })
}

</script>

<style lang="scss">
$theme-color: #00f0ff;

.cyfj {
  width: 100vw;
  height: 100vh;
  background-color: #011a4f;

  .title {
    padding: 20px 56px;
    font-family: "PingFang SC-Medium", "PingFang SC";
    font-size: 24px;
    font-weight: 500;
    color: $theme-color;
    background-image: url("../../assets/images/Group\ 41.png");
    background-size: 100% 100%;
  }

  .container {
    display: flex;
    height: calc(100% - 76px);
    padding: 20px;
    overflow: hidden;

    .container-left {
      display: flex;
      flex: 4;
      flex-direction: column;

      .toolbar {
        position: relative;
        margin-bottom: 10px;

        .btn {
          display: inline-block;
          margin-right: 10px;
          background-image: url("../../assets/images/Group\ 44.png");
          background-size: 100% 100%;

          .el-button--text {
            padding: 8px 24px;
            font-family: "PingFang SC-Medium", "PingFang SC";
            font-size: 16px;
            font-weight: 500;
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

      .record-input-view {
        position: relative;
        padding-bottom: 30px;

        .normalize-loading {
          margin-left: 6px;
          // position: absolute;
          // bottom: 6px;
          // left: 50%;
          color: #fff;
        }
      }

      .record-input {
        flex: 1;
        overflow: hidden;

        .record-textarea {
          .el-textarea__inner {
            overflow: hidden;
            color: #fff;
            background-color: #01153f;
            border: none;
          }
        }

        .nomalize-record-list {
          padding: 20px 20px 0;

          .nomalize-record-item {
            display: flex;
            padding-bottom: 32px;

            // &:last-child {
            //   margin-bottom: 0;
            // }

            .item-img {
              flex: 0 0 32px;
              width: 32px;
              height: 32px;
              line-height: 32px;
              text-align: center;
              border-radius: 50%;
            }

            .question-item {
              color: #7440b7;
              background-color: #f4dcff;
            }

            .answer-item {
              color: #0072f7;
              background-color: #d4f2ff;
            }

            .item-right {
              flex: 1;
              margin-left: 10px;

              .item-wrap {
                padding-left: 10px;
                margin-bottom: 12px;
                font-size: 14px;
                border-left-style: solid;
                border-left-width: 4px;

                .text-date {
                  margin-bottom: 4px;
                  font-size: 12px;
                  opacity: 0.8;
                }
              }
            }
          }
        }
      }
    }

    .container-right {
      display: flex;
      flex: 6;
      flex-direction: column;
      margin-left: 25px;
      overflow: hidden;

      // 右侧各个块的样式（公共）：
      .base-case {
        display: flex;
        flex: 1;
        flex-direction: column;
        color: #fff;

        h3 {
          margin-bottom: 10px;
          font-family: "PingFang SC-Medium", "PingFang SC";
          font-size: 24px;
          font-weight: 500;
          color: $theme-color;
        }
      }

      .case-provision {
        display: flex;
        flex: 3;

        .brief-case {
          margin-right: 10px;
        }

        .space-base {
          height: 160px;
          padding: 20px;
          color: #fff;

          .content-text {
            font-family: "PingFang SC-Regular", "PingFang SC";
            font-size: 16px;
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
            width: 110px;
            height: 40px;
            margin-right: 10px;
            font-family: "PingFang SC-Medium", "PingFang SC";
            font-size: 16px;
            line-height: 40px;
            color: #fff;
            text-align: center;
            background-image: url("../../assets/images/Group\ 70.png");
            background-size: 100% 100%;
          }

          .item-content {
            overflow: hidden;
            font-family: "PingFang SC-Regular", "PingFang SC";
            font-size: 16px;
            font-weight: 400;
            // line-height: 40px;
            // text-overflow: ellipsis;
            // white-space: nowrap;
          }
        }

        .space-base {
          flex: 1;
        }
      }
    }

    .space-base {
      overflow: hidden;
      background: rgba(0, 0, 0, 20%);
      border: 1px solid #4bb3ff;
      border-radius: 16px;
      box-shadow: 0 0 8px 0 rgba(0, 240, 255, 40%);
      opacity: 1;

      .el-scrollbar__wrap {
        margin-right: 0 !important;
        margin-bottom: 0 !important;
      }
    }
  }

  .yellow-color {
    color: #d4ad4b;
    border-color: #d4ad4b;
  }

  .theme-color {
    color: $theme-color;
    border-color: $theme-color;
  }

  .green-color {
    color: #37de70;
    border-color: #37de70;
  }
}
</style>
