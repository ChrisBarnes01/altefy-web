import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { withFirebase } from '../Firebase';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Dropdown from 'react-bootstrap/Dropdown'
import './individualPatient.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RENDER_PHOTOS = 0; 
const RENDER_CHECK_INS = 1; 
const RENDER_PHOTOS_AND_CHECK_INS = 2; 

class IndividualPatient extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      patientEvents: [],
      uploadedPhotos: [], 
      checkins: [],
      startDate: new Date(),
      isOpen: false,
      toRender: RENDER_PHOTOS,
    };
  }

  
 

  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.onePatient(this.props.match.params.id).on('value', snapshot => {
      const user = snapshot.val();
      const hasBeenAccessed = user["hasBeenAccessed"];
      var photosList = [];
      var checkinList = [];
      if (hasBeenAccessed){
        const photosObject = user["photoSetList"];
        photosList = Object.keys(photosObject).map(key => ({
          date_taken:key, 
          alligner_number: 1, 
          photo_type: photosObject[key].photoSetType,
          photos: photosObject[key].photoReferences
        }));

        const checkInObject = user["checkInObjectList"];
        checkinList = Object.keys(checkInObject).map(key => ({
          checkInKey: key
        }));

        //For all objects, combine two lists and sort by date; 
        var allObjects = checkinList.concat(photosList)


      }
      
      this.setState({
        hasBeenAccessed: hasBeenAccessed,
        patientEvents: allObjects,
        uploadedPhotos: photosList, 
        checkins: checkinList,
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
    const { patientEvents, checkins, uploadedPhotos, loading, hasBeenAccessed, toRender } = this.state;
    var renderText = new Map(); 
    renderText[RENDER_PHOTOS] = "Rendering Photos"
    renderText[RENDER_PHOTOS_AND_CHECK_INS] = "Rendering Photos and Checkins"
    renderText[RENDER_CHECK_INS] = "Rendering CheckIns"

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
              onChange={date => this.setState({
                startDate: date
              })}
              locale="en"
              showTimeSelect
              timeFormat="p"
              timeIntervals={1}
              dateFormat="Pp"
            />

            <p>Date</p>
            <select name="appointment_length" id="appointment_length">
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
                <option value="75">1 hora 15 minutos</option>
                <option value="90">1 hora 30 minutos</option>
                <option value="105">1 hora 45 minutos</option>
                <option value="120">2 horas</option>
                <option value="135">2 horas 15 minutos</option>
                <option value="150">2 horas 30 minutos</option>
                <option value="165">2 horas 45 minutos</option>
                <option value="180">3 horas</option>
                </select>

            <select name="appointment_type" id="appointment_type">
                <option value="0">Pictures Due</option>
                <option value="1">Physical Appointment</option>
                </select>

            </Modal.Body>
            <Modal.Footer>
            <Button onClick={() => {
                this.props.firebase.createNewAppointment(this.props.match.params.id, document.getElementById('appointment_type').value, this.state.startDate,document.getElementById('appointment_length').value );
                return props.onHide()}
                }>Add Calendar Event</Button>
            </Modal.Footer>
        </Modal>
        );
    }

    const setTypeToRender = (renderType) => {
      console.log("WE CHANGED IT!!")
      this.setState({toRender: renderType})
    }

    return (
      <div className="mainBody">
        <div className="header">
          <h1>Patients/{this.props.match.params.id}</h1>
          <Button variant="primary" onClick={() => {this.setState({ isOpen: true })}}>
            Schedule Appointment
          </Button>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {renderText[toRender]}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick = {() => setTypeToRender(RENDER_PHOTOS)}>Show Photos</Dropdown.Item>
              <Dropdown.Item onClick ={() => setTypeToRender(RENDER_CHECK_INS)}>Show Checkins</Dropdown.Item>
              <Dropdown.Item onClick={() => setTypeToRender(RENDER_PHOTOS_AND_CHECK_INS)}>Show CheckIns and Photos</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <MyVerticallyCenteredModal
            show={this.state.isOpen}
            onHide={() => {this.setState({ isOpen: false })}}
          />

        </div>

        {loading && <div>Loading ...</div>}

        
        {hasBeenAccessed && (toRender == RENDER_PHOTOS) &&<div className="tableBackground">
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

        {uploadedPhotos.map(eventSet => (
        <div onClick={() => jumpToNextPage(eventSet.date_taken)}>{
        <div className="tableRow">
            <div className="tableLeft">
                <p className="tableText">{eventSet.date_taken}</p>
            </div>
            <div className="tableMid">
                <p className="tableText">{eventSet.alligner_number}</p>
            </div>
            <div className="tableMid">
                <p className="tableText">{pictureType(eventSet.photo_type)}</p>
            </div>
            <div className="tableRight">
            {eventSet.photos.map(photo =>(
                <div className="tableImageDiv">
                    <img className="tableImage" src={photo} />
                </div>
            ))}
            </div>
        </div>}</div>
        ))}
        </div>}

        {hasBeenAccessed && (toRender == RENDER_CHECK_INS) &&<div>
          <div>CheckIns</div>
          {checkins.map(object => (
            <div>
              {object["checkInKey"]}
            </div>
          ))}
          
          
          
          </div>}

        {hasBeenAccessed && (toRender == RENDER_PHOTOS_AND_CHECK_INS) &&<div>
          <div>Photos and CheckIns</div>
          {patientEvents.map(object => (
            <div>
              Hello! Object Here.
            </div>
          ))}
          </div>
          }


        
        {!hasBeenAccessed && <div>
            <p>The user has not uploaded any photos or checkins</p>
          </div>}
      </div>
    );
  }
}
 
export default withFirebase(IndividualPatient);