import styled from 'styled-components'
import { Paper, Typography, TextField } from '@material-ui/core'

export const UsersBox = styled(Paper)`
  width: 49%;
  background-color: #fff;
`
export const PointsBox = styled(UsersBox)`
`
export const ChartPaper = styled(UsersBox)`
  display: flex;
  flex-direction: column;

`
export const GraphBox = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 1em 1em 1em 0;
`
export const Title = styled(Typography)`
  margin: 1em 1em 1em 0;
  padding-left: 1em;
  font-weight: 200;
  border-left: 4px solid rgba(62, 117, 105, .5);
  border-bottom: 3px solid rgba(62, 117, 105, .2);
  padding-bottom: 5px;
`

export const MiddleBox = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 55px 5px;
  
  `

  export const Container2 = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
  padding: 1em;
`

  export const CustomInput = styled(TextField)`
  width:27%;
  align-content: "center";
    margin: 1em;
    .MuiInputBase-root{
      color: black;
    }
  
    .MuiOutlinedInput-notchedOutline{
      border-color: black;
    }
  `

  export const CustomInput2 = styled(TextField)`
  width:42.5%;
  align-content: "center";
    margin: 1em;
    .MuiInputBase-root{
      color: black;
    }
  
    .MuiOutlinedInput-notchedOutline{
      border-color: black;
    }
  `
  export const CustomInput3 = styled(TextField)`
  width:89%;
  align-content: "center";
    margin: 1em;
    .MuiInputBase-root{
      color: black;
    }
  
    .MuiOutlinedInput-notchedOutline{
      border-color: black;
    }
  `
  export const Myscroll = styled.div`
  height: 85%;
  overflow-y: scroll;
  `
