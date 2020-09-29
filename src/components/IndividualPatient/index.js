import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import './individualPatient.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class IndividualPatient extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      users: [],
      startDate: new Date(),
      isOpen: false,
    };
  }
 

  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.patientPhotos(this.props.match.params.id).on('value', snapshot => {
      const usersObject = snapshot.val();
      
      const usersList = Object.keys(usersObject).map(key => ({
        date_taken:key, 
        alligner_number: 1, 
        photo_type: usersObject[key].photoSetType,
        photos: usersObject[key].photoReferences
      }));

      this.setState({
        users: usersList,
        startDate: new Date(),
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
        console.log("WE CLICKED")
        console.log("e: ", e);
        console.log("ROW: ", row)
        console.log("RowIndex: ", rowIndex)
      }
    };


    const createAppointment = (patientID, appointment_type, day, date) => {
        this.props.firebase.createNewAppointment(patientID, appointment_type, day, date);
        console.log("YEp, we creating appointment")
    
      }

    const handleChange = date => {
        this.setState({
          startDate: date
        });
      };

      var pictureTypes = ["Alligner Photos", "Check In Photos"]
    const pictureType = (pictureInt) => {
      return pictureTypes[pictureInt];

    }
    
    const jumpToNextPage = (specificImage) => {
      this.props.history.push('/patients/' + this.props.match.params.id +'/' + specificImage);

    }


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
            <h2>Schedule Appointment</h2>  

            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleChange}
            />

            <p>Date</p>
            <input id="fname" className="inputLine"></input>

            <select name="appointment_type" id="appointment_type">
                <option value="pictures_due">Pictures Due</option>
                <option value="physical_appointment">Physical Appointment</option>
                </select>

            </Modal.Body>
            <Modal.Footer>
            <Button onClick={() => {
                console.log("WE DOING THIS!!")
                createAppointment(this.props.match.params.id, "appointment_type", "day", "date")
                return props.onHide()}
                }>Add Patient</Button>
            </Modal.Footer>
        </Modal>
        );
    }

    return (
      <div className="mainBody">
        <div className="header">
          <h1>Patients/{this.props.match.params.id}</h1>
          <Button variant="primary" onClick={() => {this.setState({ isOpen: true })}}>
            Schedule Appointment
          </Button>

          <MyVerticallyCenteredModal
            show={this.state.isOpen}
            onHide={() => {this.setState({ isOpen: false })}}
          />

        </div>
        

        {loading && <div>Loading ...</div>}


        <div className="tableBackground">
            <div className="tableLeft">
                <p className="tableText"><strong>DATE TAKEN</strong></p>
            </div>
            <div className="tableMid">
                <p className="tableText"><strong>ALLIGNER NUMBER</strong></p>
            </div>
            <div className="tableMid">
                <p className="tableText"><strong>PHOTO TYPE</strong></p>
            </div>
        <div className="tableRight">
            <p className="tableText"><strong>PHOTOS</strong></p>
        </div>

        {users.map(user => (
        <div onClick={() => jumpToNextPage(user.date_taken)}>{
        <div>
            <div className="tableLeft">
                <p className="tableText">{user.date_taken}</p>
            </div>
            <div className="tableMid">
                <p className="tableText">{user.alligner_number}</p>
            </div>
            <div className="tableMid">
                <p className="tableText">{pictureType(user.photo_type)}</p>
            </div>
            <div className="tableRight">
            {user.photos.map(photo =>(
                <div className="tableImageDiv">
                    <img className="tableImage" src={photo} />
                </div>
            ))}
            </div>
        </div>}</div>
        ))}
        </div>

      </div>
    );
  }
}
 
export default withFirebase(IndividualPatient);