import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
import Calendar1 from '../Calendar';
import IndividualPhotos from '../IndividualPhotos'



const App = () => (  
  <Router>
    <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <AuthorizedAccount authUserData={authUser}/> : <NonAuth />
        }
      </AuthUserContext.Consumer>
  </Router>
 );


 const NonAuth = () => (
   <div className="non-auth">
     <Switch>
      <Route exact path={ROUTES.LANDING} component={SignInPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route component={SignInPage} />
     </Switch>
   </div>
  
);

const AuthorizedAccount = (props) => (
  <div className="split-sidear">
        <div>
          <Navigation />
        </div>
        <div className="mainBox">
          <Switch>
            <Route exact path={ROUTES.LANDING} render={() => <NewHome authUserData={props.authUserData} name="myName"/>} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.HOME} render={() => <NewHome authUserData={props.authUserData} name="myName"/>} />
            <Route path={ROUTES.CALENDAR} render={() => <Calendar1 authUserData={props.authUserData} />}/>
            <Route exact path={ROUTES.PATIENTS} render={() => <PatientsPage authUserData={props.authUserData} />} />
            <Route exact path={ROUTES.PATIENTS + "/:id"} component={IndividualPatient} />
            <Route exact path={ROUTES.PATIENTS + "/:id" + "/:photoID"} component={IndividualPhotos} />
            <Route render={() => <h1>404: page not found</h1>} />
          </Switch>
        </div>
    </div>
);

 
export default withAuthentication(App);