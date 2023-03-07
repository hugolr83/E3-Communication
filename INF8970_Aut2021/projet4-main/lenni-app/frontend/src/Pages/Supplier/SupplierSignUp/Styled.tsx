import styled from 'styled-components'
import { Button, makeStyles, Paper, TextField, Theme } from '@material-ui/core'

export const InputLabelColor = {
  color: '#888'
}
export const SelectColor = {
  color: '#888'
}
export const BusinessContainer = styled.div`
  width: 100%;
  justify-content: center;
  position: relative;
  display: flex;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  color: #888;
  TextStyle {color: #888;}
`
export const AddressContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`
export const ExchangeRateContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`
export const Separator = styled.div`
  width:10px;
`
export const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  align-items: center;
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
export const RegisterButton = styled(Button)`
  margin: 1em 0;
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
export const newStyle = makeStyles((theme: Theme) => ({
  select1: {

      color: '#888',
      margin: theme.spacing(2),
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'black'
      }

  },
  label: {
      background: 'white',
      color: 'black',
      marginLeft: theme.spacing(2),
      marginTop: 0
  },
  select2: {

      color: '#888',
      marginTop: theme.spacing(2),
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'black'
      }

  },
  textField: {
      flexDirection: 'column',

      wordWrap: 'break-word',
      backgroundColor: '#fff',
      backgroundClip: 'border-box',
      color: '#888',
      TextStyle: { color: '#888' },
      width: '100%',
      '& .MuiInputBase-root': {
          color: '#888'
      },
      marginTop: theme.spacing(2),
      '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'black'
      }
  },
  icon: {
      fill: '#b8b8b8'
  }

}))
