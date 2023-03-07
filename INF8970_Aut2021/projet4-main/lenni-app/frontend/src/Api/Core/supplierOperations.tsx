import { ApiResponse } from './Interfaces'

export const getPromotionHistory = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/promotion/history`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer'
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ getPromotionHistory ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getActivePromotions = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/promotion/all`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer'
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ getActivePromotions ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
