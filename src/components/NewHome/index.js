import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import './newHome.css'

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


const NewHome = () => (
  <div className='newHomeBody'>
    <h1>{ getWelcomeMessage() }</h1>
    <h3>Notificaciones</h3>

    <div className="whiteBackground">
      <BootstrapTable keyField='id' 
        data={ products } 
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
);
 
export default NewHome;
