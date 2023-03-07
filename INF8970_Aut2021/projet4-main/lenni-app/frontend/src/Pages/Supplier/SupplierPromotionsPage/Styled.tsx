import { Box, Button, Paper, TextField, Table, TableCell, Typography } from '@material-ui/core'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 55px 5px;
`
  export const MiddleBox = styled.div`
  display: flex;
  justify-content: space-around;
`
  export const Form = styled.form`
  margin: .5em 1em;
  display: flex;
  flex-direction: column;
  > div{
    margin: .5em 0;
  }
`
export const ConnectButton = styled(Button)`
  margin: 1em 0;
  background-color: #3f4d67;
`
export const TextFieldStyled = styled(TextField)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: .25rem;
  color: #888;
  TextStyle {color: #888;}
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
export const Title = styled(Typography)`
  margin: 0 auto;
  font-weight: 600;
  color: #0a0a0a;
`
export const TableContainer = styled(Box)`
  width: 100%;
`
export const TopBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1em;
`
export const TitleBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1em;
  align: center;
`
export const PromotionsBox = styled(Paper)`
  width: 48%;
  background-color: #fff;
`
