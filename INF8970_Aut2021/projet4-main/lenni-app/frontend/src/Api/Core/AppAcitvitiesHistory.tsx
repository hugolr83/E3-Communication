export const fetchAllHistoryAdExchanges = async (IDValidationPending: boolean) => {
    try {
        const response = await fetch(`/nodeserver/api/history-app/adExchanges/all/${IDValidationPending}`, {
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

export const fetchAllHistoryAds = async () => {
    try {
        const response = await fetch('/nodeserver/api/history-app/ads/all', {
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

export const fetchAllHistoryExchanges = async () => {
    try {
        const response = await fetch('/nodeserver/api/history-app/exchanges/all', {
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

export const fetchAllHistoryFundings = async () => {
    try {
        const response = await fetch('/nodeserver/api/history-app/fundings/all', {
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

export const fetchAllHistoryPromotions = async () => {
    try {
        const response = await fetch('/nodeserver/api/history-app/promotions/all', {
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

export const fetchAllHistoryTransactions = async () => {
    try {
        const response = await fetch('/nodeserver/api/history-app/transactions/all', {
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

export const fetchAllHistoryTransfers = async () => {
    try {
        const response = await fetch('/nodeserver/api/history-app/transfers/all', {
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
