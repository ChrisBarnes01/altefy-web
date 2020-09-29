import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import './signIn.css';
 
const SignInPage = () => (
  <div className="signInWrapper">
    <div>
      <h1 className="centerText">Bienvenidos a Altefy</h1>
      <p>Hola! Bienvenido a Altefy! ¡Estamos muy contentos de tenerte aquí! Esta aplicación fue diseñada para hacer que tu tratamiento ortodóncico sea tan fácil y divertido como sea posible</p>
      <SignInForm />
      <SignUpLink/>
    </div>
  </div>
);
 
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
 
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    console.log("Button even pushed??")
    const { email, password } = this.state;
    console.log("Yes??")

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("did we pussh it 2?")
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        console.log("did we pussh it - error?")
        console.log(error)
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { email, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
      <form onSubmit={this.onSubmit}>
        <p>EMAIL</p>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <p>PASSWORD</p>
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <br></br>
        <button className="centerText" disabled={isInvalid} type="submit">
          Sign In
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
 
const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);
 
export default SignInPage;
 
export { SignInForm };