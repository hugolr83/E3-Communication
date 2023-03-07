import { ApiResponse, ISuppliers } from './Interfaces'

export const fetchAllSuppliers = async () => {
  try {
    const response = await fetch('/nodeserver/api/supplier/all', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || ''
      },
      referrerPolicy: 'no-referrer'
    })

    return await response.json()
  } catch (err: any) {
    console.error(err)
  }
}

export const updatePendingSupplier = async (supplier: ISuppliers): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/supplier/update/${supplier.supplierID}`, {
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
      console.log('🚀 ~ UpdateSupplier ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
export const addPointsBySupplier = async (supplier: ISuppliers): Promise<ApiResponse> => {
  try {
    const response = await fetch(`/nodeserver/api/points/add/bySupplier/${supplier.supplierID}`, {
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
      console.log('🚀 ~ addPointsBySupplier ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}

export const deleteSupplier = async (supplier: ISuppliers): Promise<ApiResponse> => {
  try {
    console.log(JSON.stringify(supplier))
    const response = await fetch(`/nodeserver/api/supplier/delete/${supplier.supplierID}`, {
      method: 'DELETE',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      referrerPolicy: 'no-referrer'
    })

    const res = await response.json()
    if (res.errors) {
      console.log('🚀 ~ deleteSupplier ~ res.errors', res.errors)
      return { hasErrors: true, errors: res.errors, type: res.type }
    }
    return { hasErrors: false }
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message)
  }
}
