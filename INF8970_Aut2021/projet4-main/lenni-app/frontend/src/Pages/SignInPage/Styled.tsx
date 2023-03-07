import styled from 'styled-components'
import { Button, Paper, TextField } from '@material-ui/core'

export const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: #3f4d67;
  `
export const Form = styled.form`
  margin: .5em 1em;
  display: flex;
  flex-direction: column;

  > div{
    margin: .5em 0;
  }
`

export const PaperStyled = styled(Paper)`
justify-content: center;
display: flex;
align-items: center;
flex-direction: column;
  background-color: #fff;
  backgroud-clip: border-box;
  padding: 1em;
  color: #888;
`

export const ConnectButton = styled(Button)`
  margin: 1em 0;
  background-color: #3f4d67;
  // background-color: #04a9f5;
  // &:hover{
  //   background-color: #68caf7;
  // }
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
