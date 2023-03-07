import './i18next'
// eslint-disable-next-line no-use-before-define
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles'
import './App.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import theme from './theme'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import {
  RecoilRoot
} from 'recoil'
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary'
import Spinner from './Components/Spinner/Spinner'
import DateFnsUtils from '@date-io/date-fns'

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <App />
              </MuiPickersUtilsProvider>
            </ThemeProvider>
          </StylesProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
