import { Toolbar } from '@material-ui/core'
import styled from 'styled-components'

export const ToolbarStyled = styled(Toolbar)`
display: flex;
/* flex-direction: row; */
justify-content: space-between;
align-items: center;
width: 100%;
/* padding: 1em; */
/* height: 50px */
`

export const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5em;
  height: 50px
`

export const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    img{
        width: 40px;
        height: 40px;
        margin-right: 0.3em;
    }
    a{
        margin-left: .5em;
        text-decoration: none;
    }
    `

export const LoginContainer = styled.div`
    display: flex;
    align-items: center;
    
    `
