import { createTheme } from '@material-ui/core/styles'

export const defaultColors = {
  background: {
    main: '',
    second: '#5a6168',
    third: '',
    fourth: ''
  },
  foreground: {
    main: ''
  },
  text: {
    main: ''
  }
}

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#515866'
    },
    secondary: {
      main: '#a9b7d0',
      dark: '#8a95a8'
    },
    success: {
      main: '#119c36',
      dark: '#055e1d',
      light: '#bec7d4'
    },
    background: {
      paper: '#5a6168'
    },
    text: {
      primary: '#f3f2f2',
      secondary: '#000',
      disabled: 'rgba(104, 95, 95, 0.5)',
      hint: 'rgba(134, 214, 238, 0.5)'
    }
  },
  typography: {
    fontSize: 12,
    fontFamily: 'feather, Roboto, Helvetica, Arial, sans-serif'
  }
})

export default theme
