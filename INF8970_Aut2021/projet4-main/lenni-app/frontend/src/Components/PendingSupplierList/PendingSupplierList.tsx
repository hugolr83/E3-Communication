// eslint-disable-next-line no-use-before-define
import React, { Fragment } from 'react'
import StoreIcon from '@material-ui/icons/Store'
import { Date, ButtonsContainer, Container, NameInfo, ButtonStyled } from './Styled'
import { ISuppliers } from '../../Api/Core/Interfaces'
import { Typography } from '@material-ui/core'
import { addPointsBySupplier, deleteSupplier, updatePendingSupplier } from '../../Api/Core/suppliers'

interface PendingSupplierListProps {
  setCurrentSuppliers: React.Dispatch<React.SetStateAction<ISuppliers[]>>
  currentSuppliers: ISuppliers[]
}

const PendingSupplierList = ({ currentSuppliers, setCurrentSuppliers }: PendingSupplierListProps) => {
    const handleUpdatePending = (supplier: ISuppliers) => async (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        setCurrentSuppliers(currentSuppliers.filter((s) => s.businessName !== supplier.businessName))
        const { errors, hasErrors } = await updatePendingSupplier(supplier)
        if (hasErrors) {
            console.log(errors)
          } else {
            const { errors, hasErrors } = await addPointsBySupplier(supplier)
            if (hasErrors) {
              console.log(errors)
            }
          }
    }

    const handleDeleteButton = (supplier: ISuppliers) => async (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        setCurrentSuppliers(currentSuppliers.filter((s) => s.businessName !== supplier.businessName))
        const { errors, hasErrors } = await deleteSupplier(supplier)
        if (hasErrors) {
            console.log(errors)
        }
    }

    return (
    <Fragment>
        {currentSuppliers
            .map((supplier, index) => {
                return (
                    supplier.pending &&
                    <Container>
                        <StoreIcon color="secondary" fontSize="large" />
                        <NameInfo>
                            <Typography color="textSecondary">
                                {supplier.businessName}
                            </Typography>

                            <Typography color="secondary">
                                {supplier.userInfo.email}
                            </Typography>
                        </NameInfo>

                        <Date>
                            <Typography color="secondary">
                                {supplier.userInfo.registrationDate}
                            </Typography>
                        </Date>

                        <ButtonsContainer>
                            <ButtonStyled size="medium" variant="contained" onClick={handleUpdatePending(supplier)}>
                                <Typography color="textSecondary">
                                    accept
                                </Typography>
                            </ButtonStyled>
                            <ButtonStyled size="medium" variant="contained" color="secondary" onClick={handleDeleteButton(supplier)}>
                                <Typography color="textSecondary">
                                    reject
                                </Typography>
                            </ButtonStyled>
                        </ButtonsContainer>
                    </Container>
                )
            })}
        </Fragment>
    )
}
export default PendingSupplierList
