// 弹窗相关的方法
import { MessageBox } from 'element-ui'
import { redirectToLogin } from '@/utils'
import router from '@/router'
import { useAuth } from '@/stores/auth'

export let isMsgBoxOpened = false

/**
 * 控制弹窗是否已经开启的方法
 * 用于全局保持只有一个 MessageBox 开启
 * @param v  true: 开启了新 MessageBox false: MessageBox 已关闭
 */
export function toggleMsgBoxOpen(v: boolean) {
  isMsgBoxOpened = v
}

/**
 * 全局打开唯一弹窗, 用户确认或关闭弹窗后退出登录, 重定向到登录页
 * @param text 提示文字
 */
export function openLogoutMsgBox(text?: string) {
  const auth = useAuth()
  if (router.currentRoute.name !== 'login') {
    if (!isMsgBoxOpened) {
      toggleMsgBoxOpen(true)
      MessageBox.confirm(
        text ?? '登录已经失效，请重新登录',
        '提示',
        {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning',
        },
      )
        .finally(() => {
          auth.logout()
        })
        .finally(() => {
          redirectToLogin()
          toggleMsgBoxOpen(false)
        })
    }
  }
}
