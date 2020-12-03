import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import './newHome.css'
import { withFirebase } from '../Firebase';
import { withRouter } from "react-router-dom";

const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];
 
const dayNames = ["domingo", "lunes", "martes", "meircoles", "jueves", "viernes", "sabado" ]

const getDateString = () => { 
  var d = new Date();
  var month = d.getMonth(); // Since getMonth() returns month from 0-11 not 1-12.
  var year = d.getFullYear();
  return monthNames[month] + " " + year;
}

const getDayPlus = (dayNumber) =>{
  var date = new Date();
  var datePlus = date.addDays(dayNumber)
  return dayNames[datePlus.getDay()];
}

//function to iterate days
Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}


const columns = [{
  dataField: 'notification',
  text: '', 
  headerAttrs: {
    hidden: true,
    width: '20px',
    textalign: 'left'
  }
}, {
  dataField: 'datetime',
  text: 'Product Price',
  headerAttrs: {
    hidden: true
  }
}];


class NewHome extends Component { 

  constructor(props) {
    super(props);
 
    console.log("ID HERE");
    console.log(props.authUserData.email);
    this.state = {
      doctorID: props.authUserData.email,
      firstName: props.name,
      loading: false,
      notifications: [],
      calendarEvents: new Map()
    };
  }

  getPicturesDue(message){
    return (
      <div className="picturesDue">
        <p>{ message }</p>
      </div>
    )
  }

  getAppointment(message, time){
    return (
      <div className="appointment">
        <p>{ message }</p>
        <p>{ time }</p>
      </div>
    )
  }

  getEventsForDay(dayNumber){
    var currentDate = new Date();
    var dateOfKey =  currentDate.addDays(dayNumber);
    const ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(dateOfKey);
    const mo = new Intl.DateTimeFormat('es', { month: '2-digit' }).format(dateOfKey);
    const da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(dateOfKey);

    var key = da+"-"+mo+"-"+ye;

    var eventsOnThisDate = this.state.calendarEvents[key];

    var final = [];
    if (eventsOnThisDate != undefined){
      for (var i = 0; i < eventsOnThisDate.length; i ++) {
        var type = eventsOnThisDate[i]["type"];
        var message = eventsOnThisDate[i]["message"];
        if (type == 1){
          var time = eventsOnThisDate[i]["time"];
          final.push(this.getAppointment(message, time));
        }
        else{
          final.push(this.getPicturesDue(message));
        }
    }
    }
    
    return (final);
  };

  async componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.patients().on('value', snapshot => {
      const usersObject = snapshot.val(); 
      this.setState({
        notifications: this.props.firebase.getNotificationsFromPatientList(usersObject, this.state.doctorID ),
        loading: false,
        calendarEvents: this.props.firebase.getCalendarFromDoctorList(usersObject, this.state.doctorID)
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.patients().off();
  }

  render() {
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        this.props.firebase.setPhotosAccessed(row["patientID"], row["photosID"]);
        this.props.history.push('/patients/' + row["patientID"] + "/" + row["photosID"]);
    
        console.log("WE CLICKED")
        console.log("e: ", e);
        console.log("ROW: ", row)
        console.log("RowIndex: ", rowIndex)
      }
    };

    return (
      <div className='newHomeBody'>
        <h1>Bienvenidos  { this.state.firstName }</h1>
        <h3>Notificaciones</h3>

        <div className="whiteBackground">
          <BootstrapTable keyField='id' 
            data={ this.state.notifications } 
            columns={ columns } 
            rowEvents={ rowEvents }         
            rowStyle={ {  } } 
            hover={ true }
            bordered={ false }
          />
        </div>
        <br/>

        <br/>
        <h3>Calendario: { getDateString() }</h3>

        <div className="calendarComponent">
          <div className="calendarBox">
            <p>{ getDayPlus(0) }</p>
            {this.getEventsForDay(0)}
          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(1) }</p>
            {/*Setup the requests of the day here */}
            {this.getEventsForDay(1)}
          </div>

          <div className="calendarBox">
            <p>{ getDayPlus(2) }</p>
            {this.getEventsForDay(2)}
          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(3) }</p>
            {this.getEventsForDay(3)}
          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(4) }</p>
            {this.getEventsForDay(4)}
          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(5) }</p>
            {this.getEventsForDay(5)}
          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(6) }</p>
            {this.getEventsForDay(6)}

          </div>
        </div>


      </div>
    )
  }
};
 
export default withRouter(withFirebase(NewHome));
