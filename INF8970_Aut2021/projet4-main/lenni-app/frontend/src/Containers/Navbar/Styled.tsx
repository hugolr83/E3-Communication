import styled from 'styled-components'
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@material-ui/core'

export const Container = styled.div`
    display: flex;
    z-index: 1029;
    position: absolute;
    flex-direction: column;
    -webkit-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
    box-shadow: 1px 0 20px 0 #3f4d67;
    width: 264px;
    height: 100vh;
    background: #3f4d67;
    color: #9fa4ad;
    justify-content: flex-start;
    align-items: center;
`

export const Icon = styled.img`
    width: 40px;
    height: 40px;
    margin-right: .5em;
    color: wheat;
    padding: .5em;
`
export const Logo = styled.a`
  display: flex;
  text-decoration: none;
  color: #9fa4ad;
  align-items: center;
  margin: 0 .5em;
`
export const Top = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
  justify-content: space-between;
  margin: 1em 1em;

  & .MuiButtonBase-root{
    margin-right: 0;
  }

`
export const Bottom = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  margin: 1em 1em;
`

interface ButtonProps {
  selected: boolean;
}

export const ButtonText = styled(Typography) <ButtonProps>`
  color: ${(props) => props.selected ? '#1DD9CC' : '#a9b7d0'}
`

export const RouteButton = styled(Button)`
  width: 100%;
  margin: .5em 0;
  height: 50px;
  position:relative;
  &:hover{
    color: #1dc4e9;
  }

  & .MuiButton-endIcon{
    position:absolute;
    right: 20px;
  }

  & .MuiButton-startIcon{
    position:absolute;
    left: 20px;
  }

  & .MuiTypography-root{
    position: absolute;
    text-transform: none;
    font-size: 16px;
    left: 50px;
    top: 14px;
  }
  
  &:hover .MuiButton-startIcon{
    color: #1dc4e9;
  }
`

export const Categorie = styled(Typography)`
    align-self: flex-start;
    margin-top: 1em;
    margin-bottom: .2em;
    margin-left: 20px;
    font-size: 12px;
    color: #e8edf7;
    font-weight: 800;
    text-transform: uppercase;
`
interface ButtonContainerProps {
  selected: boolean;
}

export const ButtonContainer = styled.div<ButtonContainerProps>`
  border-left: 3px solid ${(props) => props.selected ? '#1dc4e9' : 'none'};
  width: 100%;
`
export const SectionAccordion = styled(Accordion)`
    background: #3f4d67;
    margin: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
`

export const SectionAccordionSummary = styled(AccordionSummary)`
  margin: 0px;
  padding-left: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  &:hover{
      color: #1dc4e9;
    }
`

export const SectionAccordionDetails = styled(AccordionDetails)`
    margin: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
`
