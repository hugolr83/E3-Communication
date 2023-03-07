import { ApiResponse, IFundingData, ITransfer } from './Interfaces'

export const transferPoints = async (data: ITransfer) => {
    try {
        const response = await fetch('/nodeserver/api/operations/transferPoints', {
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
        console.log('🚀 ~ addTransfer ~ res.errors', res.errors)
        return { hasErrors: true, errors: res.errors, type: res.type }
      }
      return { hasErrors: false }
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message)
    }
}

export const buyPoints = async (adID: string) => {
  try {
      const response = await fetch('/nodeserver/api/operations/transaction', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ adID: adID }) // body data type must match "Content-Type" header
      })
      const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ buyPoints ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getTransactionHistory = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/operations/transaction', {
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
      console.log('🚀 ~ getTransactionHistory ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const exchangePoints = async (adID: string) => {
  try {
      const response = await fetch('/nodeserver/api/operations/exchange', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ adID: adID }) // body data type must match "Content-Type" header
      })
      const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ exchangePoints ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getExchangeHistory = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/operations/exchange', {
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
      console.log('🚀 ~ getExchangeHistory ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
export const getTransferHistory = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/operations/transferHistory', {
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
      console.log('🚀 ~ getTransactionHistory ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
export const addFunds = async (data:IFundingData): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/operations/addFunds', {
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
      console.log('🚀 ~ getClientPoints ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getFundingHistory = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/operations/fundingHistory', {
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
      console.log('🚀 ~ getTransactionHistory ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
