import Cookies from 'js-cookie'

const AccessToken = 'access-token'

export function getAccessToken() {
  return Cookies.get(AccessToken)
}

export function setAccessToken(token: string, expires?: number) {
  return Cookies.set(AccessToken, token, { expires })
}

export function removeAccessToken() {
  return Cookies.remove(AccessToken)
}
