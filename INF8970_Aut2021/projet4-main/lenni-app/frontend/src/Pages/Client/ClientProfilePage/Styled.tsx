import { InputLabel, makeStyles, Paper, Theme } from '@material-ui/core'
import Button from '@mui/material/Button/Button'
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
    color: 'black'
  }
  export const PaymentInfoForm = styled.div`
  margin: .5em 1em;
  display: flex;
  flex-direction: column;
  
  > div{
    margin: .5em 0;
  }
`

export const OtpRenewButton = styled(Button)`
  margin: 10px;
  flex:1;

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
  },
  section: {
      margin: theme.spacing(1),
      border: '1px solid #3f4d67',
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1)
  },
  saveButton: {
      marginTop: theme.spacing(2),
      flex: 1
  },
  cancelButton: {
      marginTop: theme.spacing(2),
      flex: 1
  }
}))
