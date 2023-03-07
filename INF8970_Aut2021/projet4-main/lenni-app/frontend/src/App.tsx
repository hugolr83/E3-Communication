import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ProvideAuth } from './Api/Auth/use-auth'
import AdminLoginPage from './Pages/Admin/AdminLoginPage/LoginPage'
import CustomSnackbar from './Components/Snackbar/Snackbar'
import SignInPage from './Pages/SignInPage/SignInPage'
import PrivateRoute from './Components/PrivateRoute/PrivateRoute'
import Navbar from './Containers/Navbar/Navbar'
import { Header } from './Containers/Header/Header'
import DashboardPage from './Pages/Dashboard/DashboardPage'
import ClientPage from './Pages/Client/ClientPage/ClientPage'
import AdminPage from './Pages/Admin/AdminPage/AdminPage'
import SupplierPage from './Pages/Supplier/SupplierPage/SupplierPage'
import SupplierSignUpPage from './Pages/Supplier/SupplierSignUp/SupplierSignUpPage'
import SignUpPage from './Pages/SignUp/SignUpPage'

function App () {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <DashboardPage />
          </PrivateRoute>
          <Route path="/login">
              <AdminLoginPage />
          </Route>
          <Route path="/signin">
              <SignInPage />
          </Route>
          <Route path="/signup/suppliers">
                <SupplierSignUpPage />
          </Route>
          <Route path="/signup">
              < SignUpPage/>
          </Route>
          <div className="main">
            <Navbar />
            <div className="content">
              <Header />
                <PrivateRoute path="/client">
                  <ClientPage />
                </PrivateRoute>
                <PrivateRoute path="/admin" admin>
                  <AdminPage />
                </PrivateRoute>
                <PrivateRoute path="/suppliers">
                  <SupplierPage />
                </PrivateRoute>
              <CustomSnackbar />
            </div>
          </div>
        </Switch>
      </Router>
    </ProvideAuth>
  )
}

export default App
