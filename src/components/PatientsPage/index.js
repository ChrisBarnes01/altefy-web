import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { withRouter } from "react-router-dom";

import './patients.css'
 
class PatientsPage extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      users: [],
      isOpen: false,
    };
  }
 

  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.patients().on('value', snapshot => {
      const usersObject = snapshot.val();
      
      const usersList = Object.keys(usersObject).map(key => ({
        patient_name:key, 
        last_alligner_number:usersObject[key].whatsAppNumber, 
        last_retractor_change:"9/15/20",
        next_retractor_change:"56463"
  
      }));

      this.setState({
        users: usersList,
        loading: false,
        modalShow: false, 
        setModalShow: false
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.patients().off();
  }

  render() {
    const { users, loading } = this.state;

    //NEW STUFF 

    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        this.props.history.push('/patients/' + row["patient_name"]);
      }
    };

  const columns = [{
    dataField: 'patient_name',
    text: 'Patient Name', 
    headerAttrs: {
      textAlign: 'center'
    }
  }, {
    dataField: 'last_alligner_number',
    text: 'Alligner Number',
    headerAttrs: {
      textAlign: 'center'
    }
  },
  {
    dataField: 'last_retractor_change',
    text: 'Last Retractor Change',
    headerAttrs: {
      textAlign: 'center'
    }
  },
  {
    dataField: 'next_retractor_change',
    text: 'Next Retractor Change',
    headerAttrs: {
      textAlign: 'center'
    }
  }];

  const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h2>New Patient Profile</h2>
          <p>PATIENT ID</p>
          <input id="patientID" className="inputLine"></input>
          <p>After the patient profile is created you will not be able to change the patient ID</p>
          <p>FIRST Name</p>
          <input id="fname" className="inputLine"></input>
          <p>LAST Name</p>
          <input id="lname" className="inputLine"></input>
          <p>TEMPORARY PASSWORD</p>
          <input id="password" className="inputLine"></input>
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {
            console.log("WE DOING THIS!!")
            var username = document.getElementById("patientID").value;
            var tempPassword = document.getElementById("password").value;
            var firstName = document.getElementById("fname").value;
            var lastName = document.getElementById("lname").value;
            this.props.firebase.createPatientAccount(username, tempPassword, firstName, lastName);
            return props.onHide()}
            }>Add Patient</Button>
        </Modal.Footer>
      </Modal>
    );
  }

    return (
      <div className="mainBody">
        <div className="header">
          <h1>Patients</h1>

          <Button variant="primary" onClick={() => {this.setState({ isOpen: true })}}>
            Create Patient
          </Button>

          <MyVerticallyCenteredModal
            show={this.state.isOpen}
            onHide={() => {this.setState({ isOpen: false })}}
          />

        </div>
        

        {loading && <div>Loading ...</div>}


        <div className="whiteBackground">
          <BootstrapTable keyField='id' 
            
        
            data={ users } 
            columns={ columns } 
            rowEvents={ rowEvents }         
            rowStyle={ {  } } 
            hover={ true }
            bordered={ false }
          />
        </div>

      </div>
    );
  }
}
 
export default withRouter(withFirebase(PatientsPage));