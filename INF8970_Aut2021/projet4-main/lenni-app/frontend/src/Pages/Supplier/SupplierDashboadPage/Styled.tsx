import styled from 'styled-components'
import { Paper, Table, TableCell, Typography } from '@material-ui/core'

export const Title = styled(Typography)`
  margin: 1em 1em 1em 0;
  padding-left: 1em;
  font-weight: 200;
  border-left: 4px solid #3e7569;
`
export const TopBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1em;
`
export const SalesBox = styled(Paper)`
  width: 28%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1em;
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
export const MiddleBox = styled.div`
  display: flex;
  justify-content: space-around;
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 55px 5px;
  `
  export const UsersBox = styled(Paper)`
  width: 49%;
  background-color: #fff;
`
export const MyTable = styled(Table)`
  minWidth: 650;
  aria-label: 'simple table';
  background-color: #fff;
`
export const MyTableCellHead = styled(TableCell)`
  background-color: #3f4d67;
  color: white;
`
export const MyTableCellBody = styled(TableCell)`
  color: #888;
`
