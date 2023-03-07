import { InputLabel, Paper } from '@material-ui/core'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  align-items: center;
`
export const PaperStyled = styled(Paper)`
  flex: 2;
  margin: 10px;
  background-color: #fff;
  backgroud-clip: border-box;
  padding: 1em;
  color: #888;
`
  export const RowContainer = styled.div`
  display: flex;
`
  export const Separator = styled.div`
  width:10px;
  `
  export const CenteringDiv = styled.div`
  flex: 1;
`
  export const InputLabelStyled = styled(InputLabel)`
  margin: 10px;
  color: #3f4d67;
  font-size: 20px;
  font-weight: bold;
`
export const InputLabelColor = {
  color: '#888'
}
