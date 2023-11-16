import router from '@/router'

export function redirectToLogin() {
  if (router.currentRoute.name !== 'login') { // 避免无限跳转
    // 退出登录，关闭所有的弹窗
    router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
  }
}
