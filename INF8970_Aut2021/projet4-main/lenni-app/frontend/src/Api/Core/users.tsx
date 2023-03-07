import { ApiResponse, IClient, IUser } from './Interfaces'

export const fetchAllUsers = async () => {
  try {
    const response = await fetch('/nodeserver/api/user/all', {
      method: 'GET',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    return await response.json()
  } catch (err: any) {
    console.error(err)
  }
}

export const updatePendingUser = async (user: IUser): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/user/update/${user.userID}`, {
      method: 'POST',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    const resAsText = await response.text()

    if (resAsText === "Cannot update client using TOTP") {
      return { hasErrors: true, errors: [{ msg: resAsText }] }
    }

    const res = JSON.parse(resAsText)
    if (res.errors) {
      console.log('🚀 ~ deleteUser ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const addPointsToClient = async (user: IUser): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/points/add/byClient/${user.userID}`, {
      method: 'POST',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ addPointsToClient ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const deleteUser = async (user: IUser): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/user/delete/${user.userID}`, {
      method: 'DELETE',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ deleteUser ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
export const fetchCurrentClient = async () => {
  try {
    const response = await fetch('/nodeserver/api/user/current', {
      method: 'GET',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    return await response.json()
  } catch (err: any) {
    console.error(err)
  }
}

export const fetchClientPoints = async (user: IUser): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/user/points/byUser/${user.userID}`, {
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
      console.log('🚀 ~ fetchClientPoints ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getClientPoints = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/user/points', {
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
      console.log('🚀 ~ getClientPoints ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const getClientFunds = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/user/funds', {
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
      console.log('🚀 ~ getClientFunds ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
export const validatePaymentInfo = async (data:Object): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/user/validatePaymentInfo', {
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
      console.log('🚀 ~ validatePaymentInfo ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
export const validateAddressInfo = async (data:Object): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/user/validateAddress', {
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
      console.log('🚀 ~ validateAddressInfo ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
export const updateCurrentClient = async (data:IClient): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/user/updateCurrent', {
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
      console.log('🚀 ~ updateCurrentClient ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
// Call the route to create a new list of one-time password
export const generateNewOtp = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/nodeserver/api/user/generateOTP', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer'
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ generateNewOtp ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return res
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
