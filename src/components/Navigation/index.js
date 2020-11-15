import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';
import Image from 'react-bootstrap/Image'
import './navigation.css'
import { withFirebase } from '../Firebase';


const Navigation = () => (
    <div>
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? <NavigationAuth/> : <NavigationNonAuth />
        }
      </AuthUserContext.Consumer>
      
    </div>
);

const ColoredLine = ({ color }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: 1,
          margin: 10
      }}
  />
);

const selectNav = (selectedInt) => {
  //var btn1 = 
  //var btn2 = document.getElementById("hilighted2")
  //var btn3 = document.getElementById("hilighted3")
  //var btn4 = document.getElementById("hilighted4")

  //rgba(183, 161,226, 0.302);

  /*
  switch (selectedInt){
    case 1: 
      document.getElementById("hilighted1").style.backgroundColor = "lightview";
      break; 
    case 2:
      document.getElementById("hilighted2").style.backgroundColor = "lightview";
      break;  
    case 3:
      document.getElementById("hilighted3").style.backgroundColor = "lightview";
      break; 
    case 4:
      document.getElementById("hilighted4").style.backgroundColor = "lightview";
      break; 
  }
  */
}



const NavigationAuth = () => (
  <div className="sidebarOverall">

    <Image className="circleImage" src="https://morrisinsurancegroup.com/wp-content/uploads/2018/01/blank-avatar.png" roundedCircle fluid   />

    <h1 className="titleSidebar">Altefy</h1>

    <ColoredLine color='#000000'/>

    <Link to={ROUTES.LANDING}>
      <div onClick={selectNav(1)} id="hilighted1" className="sidebarLink">
        <i className="fa fa-home"></i>
        <p>Home</p>
      </div>
    </Link>

    <Link to={ROUTES.PATIENTS}>
      <div onClick={selectNav(2)} id="hilighted2" className="sidebarLink">
        <i className="fa fa-users"></i>        
        <p>Patients</p>
      </div>
    </Link>

    <Link to={ROUTES.CALENDAR}>
      <div onClick={selectNav(3)} id="hilighted3" className="sidebarLink">
        <i className="fa fa-calendar"></i>
        <p>Calendar</p>
      </div>
    </Link>

    <Link to={ROUTES.HOME}>
      <div onClick={selectNav(4)} id="hilighted4" className="sidebarLink"> 
        <i className="fa fa-cog"></i>
        <p>Settings</p>
      </div>
    </Link>

    <div className="sidebarLink">
      <SignOutButton />
    </div>

  </div>
);

const NavigationNonAuth = () => (
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
);

export default withFirebase(Navigation);

