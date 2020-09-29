import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import './signUp.css' 

const SignUpPage = () => (
  <div className="signUpWrapper">
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  firstname: '',
  lastname: '',
  clinicname: '',
  whatsappnumber: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};
 
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { firstname, email, passwordOne } = this.state;
 
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            firstname,
            email,
          });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  }
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const {
      firstname,
      lastname,
      clinicname,
      whatsappnumber,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstname === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="firstname"
          value={firstname}
          onChange={this.onChange}
          type="text"
          placeholder="First Name"
        />

        <input
          name="lastname"
          value={lastname}
          onChange={this.onChange}
          type="text"
          placeholder="Last Name"
        />
        <input
          name="clinicname"
          value={clinicname}
          onChange={this.onChange}
          type="text"
          placeholder="Clinic Name"
        />
        <input
          name="whatsappnumber"
          value={whatsappnumber}
          onChange={this.onChange}
          type="text"
          placeholder="WhatsApp Number"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <button disabled={isInvalid} type="submit">Sign Up</button>
 
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
 
const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;
 
export { SignUpForm, SignUpLink };