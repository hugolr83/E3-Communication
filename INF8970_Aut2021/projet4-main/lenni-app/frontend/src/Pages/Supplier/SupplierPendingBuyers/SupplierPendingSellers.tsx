import { useEffect, useState } from 'react'
import { Container, TableActions, TableContainer } from './Styled'
import { clientPendingExchangeAdsState, errorState } from '../../../Recoil/GlobalState'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { Severity } from '../../../Api/Core/Interfaces'
import PendingAdTable from '../../../Components/PendingAdTable/PendingAdTable'
import SearchInput from '../../../Components/SearchInput/SearchInput'
import { fetchAllHistoryAdExchanges } from '../../../Api/Core/AppAcitvitiesHistory'

const SupplierPendingSellers = () => {
    const setCurrentErrorState = useSetRecoilState(errorState)

    const [currentAds, setCurrentClientAds] = useRecoilState(clientPendingExchangeAdsState)
    const [searchClientAds, setSearchClientAds] = useState(currentAds)

    useEffect(() => {
    let disposed = false;
    (async () => {
        try {
        const response = await fetchAllHistoryAdExchanges(true)
        if (disposed) return
        if (!response.hasErrors) {
            setCurrentClientAds(response.payload)
            setSearchClientAds(response.payload)
        } else {
            setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: 'Error while fetching ads',
            severity: Severity.Error
            }))
        }
        } catch (err: any) {
        console.error(err.msg)
        setCurrentErrorState((prev) => ({
            ...prev,
            open: true,
            message: err.msg,
            severity: Severity.Error
        }))
        }
    })()
    return () => {
        disposed = true
    }
    }, [])

    const changeCurrentClientAds = (newSearchValue: string) => {
    if (newSearchValue === '') setSearchClientAds(currentAds)
    if (newSearchValue !== '') { setSearchClientAds(currentAds.filter((ad) => ad.sellerUsername.toLowerCase().includes(newSearchValue.toLowerCase()))) }
    }

    return (
        <Container>
            <TableContainer>
              <TableActions>
                <SearchInput
                  changeCurrentData={changeCurrentClientAds}
                />
              </TableActions>
              <PendingAdTable
                setCurrentAds={setSearchClientAds}
                currentAds={searchClientAds} />
            </TableContainer>
        </Container>
      )
}

export default SupplierPendingSellers
