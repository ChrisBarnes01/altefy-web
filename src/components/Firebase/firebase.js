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





  createNewAppointment = (patientID, appointment_type, day, date) => {
    console.log(appointment_type, day, date, patientID);
  }

  patients = () => this.db.ref('patients');

}
