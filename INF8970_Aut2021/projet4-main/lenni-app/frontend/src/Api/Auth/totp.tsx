import { ApiResponse, IUser } from '../Core/Interfaces'

export const fetchInitTotp = async (user: IUser): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/totp/init/${user.userID}`, {
      method: 'POST',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    const res = await response.json()
    console.log(res)
    return { hasErrors: false, payload: res }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const sendTotpVerify = async (user: IUser, code: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/totp/verify/${user.userID}`, {
      method: 'POST',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      body: JSON.stringify({ code: code }),
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    const res = await response.text()
    return { hasErrors: false, payload: [{ msg: res }] }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
