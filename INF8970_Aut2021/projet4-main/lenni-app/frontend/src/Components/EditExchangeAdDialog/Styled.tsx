import { Button, InputLabel, Paper, TextField } from '@material-ui/core'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  `
export const InputLabelColor = {
  color: '#3f4d67',
  backgroundColor: 'white'
}
export const SelectColor = {
  color: '#888',
  backgroundColor: 'white'
}
export const SelectInputLabelStyled = styled(InputLabel)`
  
  color: #3f4d67;
  font-size: 20px;
  font-weight: bold;
`

export const InputLabelStyled = styled(InputLabel)`
  
  color: #3f4d67;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 25px;
`

export const SelectContainer = styled.div`
  display: flex;

`
export const SuplierSelector = styled(Paper)`

  flex: 1;
  margin: 10px;
  background-color: #fff;
  backgroud-clip: border-box;
  padding: 1em;
  color: #888;
`
export const CreateButton = styled(Button)`
  margin: 10px;

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
width: 100%;
`
