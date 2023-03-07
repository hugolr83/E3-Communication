import styled from 'styled-components'
import { Paper } from '@material-ui/core'
import { defaultColors } from '../../theme'

export const ActionsContainer = styled.div`
  display: flex;
`

export const TableTopContainer = styled(Paper)`
  background-color: ${defaultColors.background.second};
`
