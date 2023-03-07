import styled from 'styled-components'
import { Paper } from '@material-ui/core'

export const Box = styled(Paper)`
  width: 100%;
  background-color: #fff;
`
export const Container = styled.div`
  display: flex;
  justify-content : space-between; 
`
export const TableActions = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
`

export const TableContainer = styled(Box)`
  width: 100%;
`
