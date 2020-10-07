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

  createPatientAccount = (username, tempPassword) => {
    
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
        myRef.update({[username]: {hasBeenAccessed: false}});
      }
    })
  }

  createNewAppointment = (patientID, appointment_type, date, appointment_length) => {
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

  patients = () => this.db.ref('patients');

}
