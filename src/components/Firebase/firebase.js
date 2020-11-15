import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

export default class Firebase {
  constructor(){
    app.initializeApp(firebaseConfig)

    this.auth = app.auth();
    this.db = app.database();
  }

  //Making Auth API HERE
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();
  
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
  
  //USER API
  onePatient = patientID => this.db.ref(`patients/${patientID}`);

  patientPhotos = patientID => this.db.ref(`patients/${patientID}/photoSetList`)

  particularPhotos = (patientID, photosID) => this.db.ref(`patients/${patientID}/photoSetList/${photosID}`)


  //GetNotifications 



  //GetCalendar(Map with Date)

  createPatientAccount = (username, tempPassword, firstName, lastName) => {
    this.doCreateUserWithEmailAndPassword(username + "@test.com", tempPassword).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
  		var errorMessage = error.message;
  		console.log(errorCode);
  	})
    var myRef = this.patients();
    myRef.once('value').then(function(snapshot)
    {
      var data = snapshot.val();	
      //if the userName already exists in the DataBase
      if(data[username] !== undefined){
      }
      //If the doctor does not exist, create them on the DataBase!
      else{
        myRef.update({[username]: {hasBeenAccessed: false, firstName: firstName, lastName: lastName, identifier: username}});
      }
    })
  }

  createDoctorAccount = (username, firstname, lastname, clinicname, whatsappnumber, email, passwordOne) => {
    var myRef = this.doctors();
    myRef.once('value').then(function(snapshot)
    {
      var data = snapshot.val();	
      //if the userName already exists in the DataBase
      if(data[username] !== undefined){
      }
      //If the doctor does not exist, create them on the DataBase!
      else{
        myRef.update({[username]: {firstname:firstname,lastname:lastname,clinicname:clinicname,whatsappnumber:whatsappnumber,email:email,passwordOne:passwordOne }});
      }
    })
  }

  createNewAppointment = (patientID, appointment_type, date, appointment_length) => {
    console.log("WE HAVE ADDED A NEW APPOINTMENT");
    var myPatientRef = this.onePatient(patientID);
    var epochTime = date.getTime()
    var calendarEvent = {appointment_date: epochTime, appointment_type: appointment_type, epochTime: epochTime, appointment_length: appointment_length}
    console.log(calendarEvent);
    myPatientRef.once('value').then(function(snapshot)
    {
      var data = snapshot.val();	
      console.log(data);
      //if the calendarList already exists in the DataBase
      
      myPatientRef.child("calendarObjectList").push(calendarEvent);

      /*if(data[] !== undefined){

      }
      //If the doctor does not exist, create them on the DataBase!
      else{
        myRef.update({[username]: {hasBeenAccessed: false}});
      }*/
    })

    console.log("OK, Successfully transfered data to createAppointment!!")
    
  }

  getPatientsForParticularDoctor = (doctorId) => {
    return []; 
  } 

  setPhotosAccessed(patientID, photosID){
    var myPatientRef = this.particularPhotos(patientID, photosID);
    myPatientRef.once('value').then(function(snapshot)
    {
      myPatientRef.update({viewedNotification:true})
    })
  }
  
  patients = () => this.db.ref('patients');
  doctors = () => this.db.ref('doctors');


  getCalendarFromDoctorList = (usersObject) =>{
    var usersObjectKeys = Object.keys(usersObject); 
    var calendarMap = new Map();
    for (var i = 0; i < usersObjectKeys.length; i++){
      var user = usersObject[usersObjectKeys[i]];
      console.log("USER KEY:", usersObjectKeys[i]);
      if (user["calendarObjectList"]){
        //Set Calendar for users
        var calendarArray = user["calendarObjectList"];
        var calendarArrayKeys = Object.keys(calendarArray);
        for (var l = 0; l < calendarArrayKeys.length; l++){
          var calendarEvent = calendarArray[calendarArrayKeys[l]];
          var calendarTime = calendarEvent["epochTime"]
          var overallDate = new Date(calendarTime);
          var year = overallDate.getFullYear();
          var day = calendarEvent["appointment_date"]
          var type = calendarEvent["appointment_type"]
          const ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(overallDate);
          const mo = new Intl.DateTimeFormat('es', { month: '2-digit' }).format(overallDate);
          const da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(overallDate);
          //month-day-year
          //Add year+day key to 
          var key = da+"-"+mo+"-"+ye;
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
          var toAdd = {"id": i, "title": message, "start": overallDate, "end": overallDate.setHours(overallDate.getHours + 1), "message": message, "type": type, "time":time, "calendarTime": calendarTime};
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
        console.log("user is:", user)
      }
  }
    return calendarMap;
  }

  getNotificationsFromPatientList = (usersObject) =>{
    var usersObjectKeys = Object.keys(usersObject); 
    var notificationsList = [];
    for (var i = 0; i < usersObjectKeys.length; i++){
      var user = usersObject[usersObjectKeys[i]];
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
            var toAddNotfication = {"notification":notificationTemplate, "datetime":`${da}-${mo}-${ye}`, "patientID":usersObjectKeys[i], "photosID":photoKeys[k] }
            notificationsList.push(toAddNotfication)
          }
        }
      }
      else{
        console.log("This user hasn't been accessed")
      }
    }
    return notificationsList; 
  }
}
