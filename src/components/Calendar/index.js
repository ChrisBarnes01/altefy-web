import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import './calendar.css'

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


const Calendar = () => (
  <div className='newHomeBody'>
    <h1>{ getWelcomeMessage() }</h1>


    <br/>
    <h3> { getDateString() }</h3>

    <div className="calendarComponentPage">
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


  </div>
);
 
export default Calendar;