// eslint-disable-next-line no-use-before-define
import React, { useState, useContext, createContext } from 'react'
import { getApiAddress } from '../Core/apiAddress'
import { ApiResponse, ClientData, SupplierData } from '../Core/Interfaces'

const authContext = createContext({
  signIn: (username: string, password: string, isAdmin: boolean): Promise<ApiResponse> => new Promise((res, rej) => ({ hasErrors: false })),
  signUpSupplier: (supplierData: SupplierData): Promise<ApiResponse> => new Promise((res, rej) => ({ hasErrors: false })),
  changePassword: (username: string, newPassword: string): Promise<ApiResponse> => new Promise((res, rej) => ({ hasErrors: false })),
  addClient: (data: ClientData): Promise<ApiResponse> => new Promise((res, rej) => ({ hasErrors: false })),
  signOut: () => { },
  checkConnected: (): Promise<boolean> => new Promise((res, rej) => false),
  checkUserRole: (): string => String('')
})
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth ({ children }: any) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth () {
  const [isConnected, setConnected] = useState(false)

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signIn = async (username: string, password: string, isAdmin: boolean) => {
    const response = await fetch(`${getApiAddress()}api/auth`, {
      method: 'POST',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ username, password }) // body data type must match "Content-Type" header
    })

    const res = await response.json()

    if (!res.hasErrors) {
      if ((!isAdmin && (res.payload.role === 'ADMIN')) || (isAdmin && (res.payload.role !== 'ADMIN'))) {
        return { hasErrors: true }
      }
      localStorage.setItem('token', res.payload.token)
      localStorage.setItem('role', res.payload.role)
      setConnected(true)
    }
    return res
  }

  const signUpSupplier = async (data: SupplierData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${getApiAddress()}api/supplier/add`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
      })

      const res = await response.json()
      if (res.errors) {
        return { hasErrors: true, errors: res.errors, type: res.type }
      }
      return { hasErrors: false }
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message)
    }
  }

  const addClient = async (data: ClientData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${getApiAddress()}api/user/add`, {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })

      const res = await response.json()
      if (res.errors) {
        return { hasErrors: true, errors: res.errors, type: res.type }
      }
      return { hasErrors: false }
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message)
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string): Promise<ApiResponse> => {
    try {
      const response = await fetch('/nodeserver/api/auth/changePassword', {
        method: 'POST',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ oldPassword, newPassword }) // body data type must match "Content-Type" header

      })
      return await response.json()
    } catch (err: any) {
      console.error('changePassword: ', err.message)
      throw err
    }
  }

  const checkConnected = async (): Promise<boolean> => {
    if (isConnected) {
      return true
    }

    try {
      const response = await fetch('/nodeserver/api/auth', {
        method: 'GET',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      })

      const res = await response.json()

      if (res.hasErrors) {
        return false
      }

      if (!res.payload) {
        throw new Error('no_payload')
      }
      setConnected(true)
      return true
    } catch (err: any) {
      console.error('🚀 ~ checkConnected ~ err', err.message)
      setConnected(false)
      return false
    }
  }

  const checkUserRole = () => {
    return localStorage.getItem('role') || ''
  }

  const signOut = async () => {
    try {
      const response = await fetch('/nodeserver/api/auth/logout', {
        method: 'PUT',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

      })

      await response.json()
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      setConnected(false)
    } catch (err: any) {
      console.error('signOut: ', err.message)
      throw err
    }
  }
  return {
    signIn,
    signUpSupplier,
    addClient,
    signOut,
    checkConnected,
    changePassword,
    checkUserRole
  }
}
