<template>
  <!-- 智能续写 -->
  <div class="content">
    <!-- <div class="title">智能续写</div>
    <el-input
      ref="elInputRef"
      v-model="aiText"
      :disabled="loading"
      type="textarea"
      resize="none"
      :autosize="{
        minRows: 20,
        maxRows: 30
      }"
      :placeholder="loading ? '文本生成中...' : '没有续写内容'"
    />
    <div class="footer">
      <el-button
        type="primary"
        @click="continueSuggest"
        :disabled="loading"
        :loading="insertLoading"
      >{{ loading ? '文本生成中...' : '继续续写' }}</el-button>
      <br>
      <el-button
        type="primary"
        @click="handleInsert"
        :disabled="loading"
        :loading="insertLoading"
      >插入</el-button>
      <br>
      <el-button @click="handleBack">返回</el-button>
    </div> -->
  </div>
</template>
<script lang="ts">
// import {
//   defineComponent,
//   nextTick,
//   onUnmounted,
//   ref,
//   shallowRef,
// } from 'vue'
// import { ElInput, ElMessage } from 'element-plus'
// import { SelectTextMaxLimit } from './config'
// import { getBaseUrlAsync } from '@/renderer/utils/auth'
// import { fetchEventSource } from '@microsoft/fetch-event-source'

// export default defineComponent({
//   props: {
//     tabLabel: {
//       type: String,
//       required: true
//     }
//   },
//   components: {
//   },
//   emits: ['back-default', 'append-text'],
//   setup (props, { emit }) {
//     const aiText = ref('')
//     const loading = ref(true)
//     const insertLoading = ref(false)

//     const elInputRef = shallowRef<InstanceType<typeof ElInput>>()
//     let ctrl: AbortController | undefined
//     onUnmounted(() => {
//       ctrl?.abort()
//     })
//     /**
//      * 获取智能续写结果
//      */
//     async function getSuggest (txt: string) {
//       loading.value = true
//       const baseUrl = await getBaseUrlAsync()
//       ctrl = new AbortController()
//       fetchEventSource(`${baseUrl}/api/official/document/suggest`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ content: txt }),
//         signal: ctrl.signal,
//         openWhenHidden: true,
//         async onopen (response) {
//           if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
//             return Promise.resolve()
//           } else {
//             return Promise.reject(await response.json())
//           }
//         },
//         onmessage (res) {
//           try {
//             const resData = JSON.parse(res.data)
//             aiText.value += resData.result?.response ?? ''
//             if (elInputRef.value?.textarea) {
//               elInputRef.value.textarea.scrollTop = elInputRef.value.textarea.scrollHeight
//             }
//           } catch (error) {
//             console.log(error)
//           }
//         },
//         onclose () {
//           loading.value = false
//           ctrl = undefined
//         },
//         onerror (e) {
//           ctrl?.abort()
//           ctrl = undefined
//           const errMsg = e?.message ?? '续写失败'
//           ElMessage.error(errMsg)
//           loading.value = false
//           throw Error(errMsg)
//         },
//       })
//     }

//     // 继续续写
//     async function continueSuggest () {
//       loading.value = true
//       let text = aiText.value
//       if (text.length > SelectTextMaxLimit) {
//         text = text.substring(text.length - SelectTextMaxLimit)
//       }
//       aiText.value += '\n'
//       getSuggest(text)
//     }

//     /**
//      * 返回
//      */
//     function handleBack () {
//       emit('back-default')
//       if (ctrl) {
//         ctrl.abort()
//       }
//     }

//     /**
//      * 插入续写内容到onlyoffice操作
//      */
//     async function handleInsert () {
//       const rs = aiText.value.split('\n')
//       emit('append-text', rs)
//       nextTick(() => {
//         handleBack()
//       })
//     }

//     return {
//       aiText,
//       loading,
//       insertLoading,
//       elInputRef,

//       continueSuggest,
//       handleBack,
//       handleInsert,
//       getSuggest
//     }
//   }
// })
</script>

<style lang="scss" scoped>
.content {
  margin: 12px;
}

.title {
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.footer {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 12px;
}
</style>
