import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const Container = styled.div`
  display: flex;
  width: 95%;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, .1);
  padding: 1em;
`

export const NameInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  `

export const Date = styled.div`
  display: flex;
`

export const ButtonStyled = styled(Button)`
  margin: .5em;
  text-transform: lowercase;
`

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between
`
