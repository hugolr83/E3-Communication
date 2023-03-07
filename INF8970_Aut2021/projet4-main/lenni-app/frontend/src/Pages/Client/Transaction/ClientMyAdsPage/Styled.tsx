import styled from 'styled-components'
import { Button, Paper } from '@material-ui/core'

export const Box = styled(Paper)`
  width: 100%;
  background-color: #fff;
  `
export const Container = styled.div`
  display: flex;
  flex-direction: column;
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
export const TopBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
  width: 40%;
`
export const SalesBox = styled(Paper)`
  width: 50%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1em;
  color: #888;
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

export const CreateAdButton = styled(Button)`
  margin: 1em 0;
`
