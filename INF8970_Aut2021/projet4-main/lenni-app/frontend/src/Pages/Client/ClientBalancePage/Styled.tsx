import styled from 'styled-components'
import { Button, InputLabel, makeStyles, Paper, TextField, Theme } from '@material-ui/core'

export const PaperStyled = styled(Paper)`
flex: 1;
margin: 10px;
  background-color: #fff;
  backgroud-clip: border-box;
  padding: 1em;
  color: #888;

`
export const CenteringDiv = styled.div`
flex: 1;
`
export const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
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
  export const StyledButton = styled(Button)`
  margin: 10px;
  flex: 1;

`
export const RowContainer = styled.div`
  display: flex;

`
export const TextFieldStyled = styled(TextField)`


`
export const InputLabelStyled = styled(InputLabel)`
  margin: 10px;
  color: #3f4d67;
  font-size: 20px;
  font-weight: bold;
`

export const Separator = styled.div`
width:10px;
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
export const TableContainer = styled(Paper)`
  width: 100%;
  background-color: #fff;
  `
export const TableActions = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
`

export const selectStyle = makeStyles((theme: Theme) => ({
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
