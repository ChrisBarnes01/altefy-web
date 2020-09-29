import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import PatientsPage from '../PatientsPage';
import NewHome from '../NewHome'

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import { Sidebar } from '../SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './app.css'
import IndividualPatient from '../IndividualPatient';
import { AuthUserContext } from '../Session';
import Calendar from '../Calendar';
import IndividualPhotos from '../IndividualPhotos'



const App = () => (  
  <Router>
    <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <AuthorizedAccount/> : <NonAuth />
        }
      </AuthUserContext.Consumer>
  </Router>
 );


 const NonAuth = () => (
   <div className="non-auth">
    <Route exact path={ROUTES.LANDING} component={NewHome} />
    <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
    <Route path={ROUTES.SIGN_IN} component={SignInPage} />
   </div>
  
);

const AuthorizedAccount = () => (
  <div className="split-sidear">
        <div>
          <Navigation />
        </div>
        <div className="mainBox">
          <Route exact path={ROUTES.LANDING} component={NewHome} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={NewHome} />
          <Route path={ROUTES.CALENDAR} component={Calendar} />
          <Route exact path={ROUTES.PATIENTS} component={PatientsPage} />
          <Route exact path={ROUTES.PATIENTS + "/:id"} component={IndividualPatient} />
          <Route exact path={ROUTES.PATIENTS + "/:id" + "/:photoID"} component={IndividualPhotos} />
        </div>
    </div>
);

 
export default withAuthentication(App);