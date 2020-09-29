import React, { Component } from 'react';
 
import { withFirebase } from '../Firebase';
 
class HomePage extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      users: [],
    };
  }
 
  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.patients().on('value', snapshot => {
      const usersObject = snapshot.val();
      
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));
      
      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.patients().off();
  }

  updateCharacter = () => {
    
    /*this.props.firebase
      .user(authUser.user.uid)
      .set({
        username,
        email,
      });*/
    console.log("We updated character!! Two")
    this.props.firebase.user().on('value', snapshot => {
      const usersObject = snapshot.val();
      console.log(usersObject);
      /*const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));*/
      
    });
  }

  
  

 
  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Home Page (Edit The Parameters)</h1>

        {loading && <div>Loading ...</div>}
        
        <UserList users={users} />
        <h1>Current User: {}</h1>


        <button onClick={this.updateCharacter()}>Click to Add Character</button>

      </div>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <br/>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <br/>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);
 
export default withFirebase(HomePage);