import { Button, InputLabel, makeStyles, Paper, TextField, Theme } from '@material-ui/core'
import styled from 'styled-components'
export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  `
export const InputLabelStyled = styled(InputLabel)`
  
  color: #3f4d67;
  font-size: 20px;
  font-weight: bold;
`
export const PaperStyled = styled(Paper)`

  flex: 1;
  margin: 10px;
  background-color: #fff;
  backgroud-clip: border-box;
  padding: 1em;
  color: #888;
`
export const TransferButton = styled(Button)`
  margin: 10px;
  flex:1;

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

export const TableContainer = styled(Paper)`
  width: 100%;
  background-color: #fff;
  `
export const TableActions = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
`

export const RowContainer = styled.div`
  display: flex;

`
export const ContentDiv = styled.div`
flex: 2;

`
export const CenteringDiv = styled.div`

flex: 1;
`
export const newStyle = makeStyles((theme: Theme) => ({
  select1: {

      color: '#888',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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
