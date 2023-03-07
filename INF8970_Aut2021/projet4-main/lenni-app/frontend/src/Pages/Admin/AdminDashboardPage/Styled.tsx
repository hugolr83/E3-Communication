import styled from 'styled-components'
import { Paper, Typography } from '@material-ui/core'

export const Box1 = styled(Paper)`
  width: 100%;
  background-color: #fff;
  `
export const UsersBox = styled(Paper)`
  width: 49%;
  background-color: #fff;
`
export const SuppliersBox = styled(UsersBox)`
`
export const Title = styled(Typography)`
  margin: 1em 1em 1em 0;
  padding-left: 1em;
  font-weight: 200;
  border-left: 4px solid #3e7569;
`
export const TopBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
`
export const SalesBox = styled(Paper)`
  width: 25%;
  display: flex;
  background-color: #fff;
  flex-direction: column;
  padding: 1em;
`

export const MiddleBox = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 55px 5px;
  `

export const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content:center;
  justify-content: space-space-around;

  `
export const BoxMetric = styled.div`
  display: flex;
  align-content: left;
  justify-content: left;
  width:100%;
  `
export const BoxValue = styled.div`
  display: flex;
  align-content: right;
  width:100%;
  justify-content: right;
  `
