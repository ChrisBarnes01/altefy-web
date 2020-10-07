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


const rowEvents = {
  onClick: (e, row, rowIndex) => {
    console.log("WE CLICKED")
    console.log("e: ", e);
    console.log("ROW: ", row)
    console.log("RowIndex: ", rowIndex)
  }
};

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
 
    this.state = {
      firstName: "must get firstname of doctor",
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
    //day-month-year
    var key = da+"-"+mo+"-"+ye;
    //console.logconsole.log("KEY FOR CALENDAR", key)

    var eventsOnThisDate = this.state.calendarEvents[key];
    //console.log("Events on Date", eventsOnThisDate)
    //console.log("CalendarEvents", this.state.calendarEvents)
    //console.log("CalendarEvents Keys", this.state.calendarEvents["04-10-2020"])
  
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

  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.patients().on('value', snapshot => {
      const usersObject = snapshot.val();
      
      var usersObjectKeys = Object.keys(usersObject); 
      var notificationsList = [];
      var calendarMap = new Map();
      for (var i = 0; i < usersObjectKeys.length; i++){
        var user = usersObject[usersObjectKeys[i]];
        //console.log(user)
        if (user["hasBeenAccessed"]){
          //Get Notifications for checkins
          var checkInNotificationArray = user["checkInObjectList"]
          var checkInKeys = Object.keys(checkInNotificationArray)
          for (var j = 0; j < checkInKeys.length; j++){
            var checkInObject = checkInNotificationArray[checkInKeys[j]]
            if (!checkInObject["viewedNofication"]){
              var notificationTemplate = user["firstName"] + " checked in";
              var dateTemplate = checkInObject["epochTime"]
              var date = new Date(dateTemplate)
              const ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(date);
              const mo = new Intl.DateTimeFormat('es', { month: 'short' }).format(date);
              const da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(date);
              var toAddNotfication = {"notification":notificationTemplate, "datetime":`${da}-${mo}-${ye}` }
              notificationsList.push(toAddNotfication)
            }
          }
          //Get Notifications for Photos Uploaded
          var photoNotificationArray = user["photoSetList"]
          //console.log("DOING PHOTOS ", user["firstName"])
          var photoKeys = Object.keys(photoNotificationArray)
          for (var k = 0; k < photoKeys.length; k++){
            var photoObject = photoNotificationArray[photoKeys[k]]
            //console.log("PHOTO OBJECT IS")
            //console.log(photoObject)
            //console.log(photoObject["viewedNotification"])
            if (!photoObject["viewedNotification"]){
              var notificationTemplate = user["firstName"] + " uploaded a set of photos";
              var dateTemplate = photoObject["epochTime"]
              //console.log(date)
              var date = new Date(dateTemplate)
              const ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(date);
              const mo = new Intl.DateTimeFormat('es', { month: 'short' }).format(date);
              const da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(date);
              var toAddNotfication = {"notification":notificationTemplate, "datetime":`${da}-${mo}-${ye}` }
              notificationsList.push(toAddNotfication)
            }
          }
          //Set Calendar for users
          var calendarArray = user["calendarObjectList"];
          console.log("calendarArray")
          console.log(calendarArray);
          var calendarArrayKeys = Object.keys(calendarArray);
          console.log("okay")
          for (var l = 0; l < calendarArrayKeys.length; l++){
            console.log("we went in")
            console.log(calendarArray[l]);
            var calendarEvent = calendarArray[calendarArrayKeys[l]];
            var calendarTime = calendarEvent["epochTime"]
            console.log(calendarEvent)
            var overallDate = new Date(calendarTime);
            var year = overallDate.getFullYear();
            console.log(year)
            var day = calendarEvent["appointment_date"]
            var type = calendarEvent["appointment_type"]
            const ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(overallDate);
            const mo = new Intl.DateTimeFormat('es', { month: '2-digit' }).format(overallDate);
            const da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(overallDate);
            //month-day-year
            //Add year+day key to 
            var key = da+"-"+mo+"-"+ye;
            console.log("key", key);
            //Check to see CalendarMapKey
            if (parseInt(type) == 1){
              var message = "appointment - " + user["firstName"]
            }
            else {
              var message = "pictures due - " + user["firstName"]
            }
            var minutes = overallDate.getMinutes();
            var timeOfDay = "am";
            if (minutes < 10){
              minutes = "0" + minutes
            }
            var hours = overallDate.getHours();
            if (hours > 11){
              hours = hours - 12; 
              timeOfDay = "pm"
            }
            if (hours == 0){
              hours = 12;
            }

            var time = hours + ":" + minutes + " " + timeOfDay;
            var toAdd = {"message": message, "type": type, "time":time};
            console.log(toAdd)
            if (calendarMap[key] != undefined){
              calendarMap[key].push(toAdd);
            }
            else{
              calendarMap[key] = [toAdd]
            }

          }


        }
        else{
          console.log("This user hasn't been checked")
        }
        
      }
      console.log(calendarMap)

      console.log(notificationsList)

      this.setState({
        notifications: notificationsList,
        loading: false,
        calendarEvents: calendarMap
      });

      console.log("State Set!!")
      console.log(this.state.calendarEvents)
    });
  }

  componentWillUnmount() {
    this.props.firebase.patients().off();
  }

  render() {
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
