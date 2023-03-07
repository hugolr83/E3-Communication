import { IExchangeAd, ApiResponse } from './Interfaces'

export const createExchangeAd = async (data: IExchangeAd) => {
  try {
      const response = await fetch('/nodeserver/api/clientAd/exchange', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ createExchangeAd ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getClientExchangeAds = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/clientAd/exchange', {
      method: 'GET',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ getClientExchangeAds ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getAllClientExchangeAds = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/clientAd/exchange/all', {
      method: 'GET',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ getAllClientExchangeAds ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const validateExchangeAd = async (data: IExchangeAd) => {
  try {
        const response = await fetch(`/nodeserver/api/clientAd/exchange/validateID`, {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
      })
      const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ updateExchangeAd ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const deleteExchangeAd = async (data: IExchangeAd) => {
  try {
      const response = await fetch(`/nodeserver/api/clientAd/exchange/remove/${data._id}`, {
        method: 'DELETE',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
      })
      const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ deleteExchangeAd ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getClientBoughtExchangeAds = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/clientAd/exchange/bought', {
      method: 'GET',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ getClientBoughtExchangeAds ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const updateExchangeAd = async (id: string, data: any) => {
  try {
      const response = await fetch(`/nodeserver/api/clientAd/exchange/update/${id}`, {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ updateExchangeAd ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
