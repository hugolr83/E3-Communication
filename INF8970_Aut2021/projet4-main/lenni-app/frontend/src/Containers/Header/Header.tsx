// eslint-disable-next-line no-use-before-define
import React from 'react'
import {
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import SettingsSharpIcon from '@material-ui/icons/SettingsSharp'
import ExitToApp from '@material-ui/icons/ExitToApp'
import '../../App.css'
import { HeaderStyled, LoginContainer, TitleContainer, ToolbarStyled } from './Styled'
import { useAuth } from '../../Api/Auth/use-auth'

export const Header = () => {
  const [anchor, setAnchor] = React.useState({ setting: null, notification: null, action: null })
  const history = useHistory()
  const auth = useAuth()
  const role = auth.checkUserRole()

  const handleClose = (type: string) => {
    setAnchor(prev => ({ ...prev, [type]: null }))
  }

  const handleSignOut = async () => {
    await auth.signOut()
    handleClose('setting')
    if (role === 'ADMIN') {
      history.push('/login')
    } else {
      history.push('/')
    }
  }

  const handleSettings = () => {
    handleClose('setting')
    if (role === 'SUPPLIER') {
      history.push('/suppliers/settings')
    } else if (role === 'USER') {
      history.push('/client/profile')
    }
  }

  const handleProfile = () => {
    handleClose('setting')
    history.push('/profile')
  }

  return (
    <HeaderStyled className="header">
      <ToolbarStyled>
        <TitleContainer>
          <Menu
            id="simple-menu"
            anchorEl={anchor.setting}
            keepMounted
            open={Boolean(anchor.setting)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </Menu>
        </TitleContainer>

        <LoginContainer>
          <div>
            {role !== 'ADMIN' &&
              <IconButton
                size="medium"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="primary"
                onClick={handleSettings}
              >
                <SettingsSharpIcon color="secondary" fontSize="medium" />
              </IconButton>}
            <IconButton
              size="medium"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="primary"
              onClick={handleSignOut}
            >
              <ExitToApp color="secondary" fontSize="medium" />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchor.setting}
              keepMounted
              open={Boolean(anchor.setting)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleSignOut}>Logout</MenuItem>
            </Menu>
          </div>

        </LoginContainer>
      </ToolbarStyled>
    </HeaderStyled>
  )
}
