import { DateTimePicker } from '@material-ui/pickers'
import styled from 'styled-components'

export const DateContainer = styled(DateTimePicker)`
  color: black;
  margin: 0 1em;
  border-bottom: 1px solid black;
  width: 150px;
  svg{
    fill: black;
  }
  input{
    color: black;
  }
`
