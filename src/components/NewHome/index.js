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

const getWelcomeMessage = () => {
  return "Bienvenidos Username"
}



const getDayPlus = (dayNumber) =>{
    var d = new Date();
    var day = d.getDay() + dayNumber
    if (day > 6){
      day = day - 7
    }

    return dayNames[day];

}



const rowEvents = {
  onClick: (e, row, rowIndex) => {
    console.log("WE CLICKED")
    console.log("e: ", e);
    console.log("ROW: ", row)
    console.log("RowIndex: ", rowIndex)
  }
};

const products = [ {"notification":"This is a notification. It will be longer than most text of cource because of legacy.", "datetime":"My name"}, 
{"notification":"This is a notification. It will be longer than most text of cource because of legacy.", "datetime":"10/28/1997"},
{"notification":"This is a notification. It will be longer than most text of cource because of legacy.", "datetime":"10/28/1997"},
{"notification":"This is a notification. It will be longer than most text of cource because of legacy.", "datetime":"10/28/1997"},  
{"notification":"This is a notification. It will be longer than most text of cource because of legacy.", "datetime":"10/28/1997"},
{"notification":"This is a notification. It will be longer than most text of cource because of legacy.", "datetime":"10/28/1997"},
{"notification":"This is a notification. It will be longer than most text of cource because of legacy.", "datetime":"10/28/1997"}  ];
const columns = [{
  dataField: 'notification',
  text: '', 
  headerAttrs: {
    hidden: true,
    width: '20px',
    textAlign: 'left'
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
      loading: false,
      notifications: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.patients().on('value', snapshot => {
      const usersObject = snapshot.val();
      
      /*const usersList = Object.keys(usersObject).map(key => ({
        notification:key, 
        datetime:usersObject[key].whatsAppNumber  
      }));*/
      var usersObjectKeys = Object.keys(usersObject); 
      var notificationsList = [];
      var calendarMap = new Map();
      for (var i = 0; i < usersObjectKeys.length; i++){
        var user = usersObject[usersObjectKeys[i]];
        console.log(user)
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
          console.log("DOING PHOTOS ", user["firstName"])
          var photoKeys = Object.keys(photoNotificationArray)
          for (var k = 0; k < photoKeys.length; k++){
            var photoObject = photoNotificationArray[photoKeys[k]]
            console.log("PHOTO OBJECT IS")
            console.log(photoObject)
            console.log(photoObject["viewedNotification"])
            if (!photoObject["viewedNotification"]){
              var notificationTemplate = user["firstName"] + " uploaded a set of photos";
              var dateTemplate = photoObject["epochTime"]
              console.log(date)
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
          for (var l = 0; l < calendarArray.length; l++){
            console.log(calendarArray[l]);
            var calendarEvent = calendarArray[l];
            var calendarTime = calendarEvent["epochTime"]
            console.log(calendarEvent)
            var overallDate = new Date(calendarTime);
            var year = overallDate.getFullYear();
            console.log(year)
            var day = calendarEvent["appointment_date"]
            var type = calendarEvent["appointment_type"]
            //Add year+day key to 
            var key = day + year;
            console.log("key", key);
            //Check to see CalendarMapKey
            var toAdd = "hello " + user["firstName"]
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
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.patients().off();
  }

  render() {
    return (
      <div className='newHomeBody'>
        <h1>{ getWelcomeMessage() }</h1>
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
            <div className="picturesDue">
              <p>Pictures Due</p>
            </div>
            <div className="appointment">
              <p>Appointent</p>
            </div>
            

          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(1) }</p>
            <div className="picturesDue">
              <p>Pictures Due</p>
            </div>

          </div>

          <div className="calendarBox">
            <p>{ getDayPlus(2) }</p>
            <div className="picturesDue">
              <p>Pictures Due</p>
            </div>
            <div className="appointment">
              <p>Appointent</p>
            </div>

          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(3) }</p>

          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(4) }</p>

          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(5) }</p>

          </div>
          <div className="calendarBox">
            <p>{ getDayPlus(6) }</p>

          </div>
        </div>


      </div>
    )
  }
};
 
export default withRouter(withFirebase(NewHome));
