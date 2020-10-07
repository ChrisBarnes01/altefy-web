import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import './calendar.css'
import { Calendar, Views } from 'react-big-calendar'
import localizer from 'react-big-calendar/lib/localizers/moment'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

var dates = [];
let allViews = Object.keys(Views).map(k => Views[k])
let momentLocalizer = localizer(moment) // or globalizeLocalizer
var events = [
{
  id: 14,
  title: 'Today',
  start: new Date(new Date().setHours(new Date().getHours() - 3)),
  end: new Date(new Date().setHours(new Date().getHours() + 3)),
},]


const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
    },
  })


let MyCalendar = ({ localizer }) => (
  <Calendar
    events={events}
    views={allViews}
    step={60}
    showMultiDayTimes
    defaultDate={new Date()}
    components={{
      timeSlotWrapper: ColoredDateCellWrapper,
    }}
    localizer={localizer}
  />
)
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

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
  return "Calendario"
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


const Calendar1 = () => (
  <div className='newHomeBody'>
    <h1>{ getWelcomeMessage() }</h1>


    <br/>
    <h3> { getDateString() }</h3>

    <div className="calendarComponentPage">
    <MyCalendar localizer={momentLocalizer}/>

    </div>
      {/*
      <div className="calendarBox">
        <p>{ getDayPlus(0) }</p>
        <div className="picturesDue">
          <p>Pictures Due -Chris</p>
        </div>
        <div className="appointment">
          <p>Appointent - Chris</p>
        </div>
        <div className="picturesDue">
          <p>Pictures Due -Olga</p>
        </div>
        <div className="appointment">
          <p>Appointent - Olga</p>
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
        <div className="picturesDue">
          <p>Pictures Due -Thomas</p>
        </div>
        <div className="appointment">
          <p>Appointent - Thomas</p>
        </div>
      </div>
      <div className="calendarBox">
        <p>{ getDayPlus(5) }</p>

      </div>
      <div className="calendarBox">
        <p>{ getDayPlus(6) }</p>

      </div>
    </div>
*/}

  </div>
);
 
export default Calendar1;