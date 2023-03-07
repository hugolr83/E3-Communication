import { getApiAddress } from './../Core/apiAddress'
import { ApiResponse, ISuppliers } from './../Core/Interfaces'

export const addPromotion = async (pointsToLennis:string, dollarsToPoints:string, pointsToDollars:string, expirationDate:Date) => {
    try {
        const response = await fetch(`${getApiAddress()}api/promotion/addPromotion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ pointsToLennis, dollarsToPoints, pointsToDollars, expirationDate }),
            referrerPolicy: 'no-referrer'
        })
        const data: ApiResponse = await response.json()
        console.log(data)
        return data
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export const deletePromotion = async () => {
    try {
        const response = await fetch(`${getApiAddress()}api/promotion/deletePromotion`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            },
            referrerPolicy: 'no-referrer'
        })
        const data: ApiResponse = await response.json()
        console.log(data)
        return data
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export const getPromotion = async () => {
    try {
        const response = await fetch(`${getApiAddress()}api/promotion/getPromotion`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            },
            referrerPolicy: 'no-referrer'
        })
        const data: ApiResponse = await response.json()
        console.log(data)
        return data
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export const getPoints = async () => {
    try {
        const response = await fetch(`${getApiAddress()}api/points/all`, {
        method: 'GET',
            cache: 'no-cache',
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') || ''
            },
            referrerPolicy: 'no-referrer'
        })
        const data: ApiResponse = await response.json()
        return data
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export const getPointsById = async (supplier: ISuppliers): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${getApiAddress()}api/points/all/${supplier.supplierID}`, {
        method: 'GET',
            cache: 'no-cache',
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') || ''
            },
            referrerPolicy: 'no-referrer'
        })
        const data: ApiResponse = await response.json()
        return data
    } catch (err: any) {
        console.error(err)
        throw err
    }
    }

export const updatePoints = async (userId: string, quantity: number) => {
    try {
        const response = await fetch(`${getApiAddress()}api/points/add/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ userId, quantity }),
            referrerPolicy: 'no-referrer'
            })
        const data: ApiResponse = await response.json()
        console.log(data)
        return data
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export const getSupplier = async () => {
    try {
        const response = await fetch(`${getApiAddress()}api/supplier/getParams`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer'
        })
        const data: ApiResponse = await response.json()
        return data
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export const updateSupplier = async (businessName: String, businessNumber: String, username: String, email: String, pointsToLennis: String, dollarsToPoints: String, pointsToDollars: String, street: String, city: String, province: String, postalCode: String) => {
    try {
        const response = await fetch(`${getApiAddress()}api/supplier/updateParams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify(
                { businessName, businessNumber, username, email, pointsToLennis, dollarsToPoints, pointsToDollars, street, city, province, postalCode }),
            referrerPolicy: 'no-referrer'
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

export const getTransfersHistory = async () => {
    try {
        const response = await fetch(`${getApiAddress()}api/transfers/supplier`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token') || ''
        },
        referrerPolicy: 'no-referrer'
        })
        const data: ApiResponse = await response.json()
        console.log('get transfer history ~ ', data)
        return data
    } catch (err: any) {
        console.error(err)
        throw err
    }
}
