import { IAd, ApiResponse } from './Interfaces'

export const createAd = async (data: IAd) => {
  try {
      const response = await fetch('/nodeserver/api/clientAd/transaction', {
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
      console.log('🚀 ~ createAd ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getClientAds = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/clientAd/transaction', {
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
      console.log('🚀 ~ getClientAds ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getAllClientAds = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/clientAd/transaction/all', {
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
      console.log('🚀 ~ getAllClientAds ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const deleteAd = async (data: IAd) => {
  try {
      const response = await fetch(`/nodeserver/api/clientAd/transaction/remove/${data._id}`, {
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
      console.log('🚀 ~ deleteAd ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getClientBoughtAds = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/clientAd/transaction/bought', {
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
      console.log('🚀 ~ getClientBoughtAds ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const updateAd = async (id: string, data: any) => {
  try {
      const response = await fetch(`/nodeserver/api/clientAd/transaction/update/${id}`, {
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
      console.log('🚀 ~ updateAd ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
