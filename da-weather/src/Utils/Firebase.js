import firebase from 'firebase';

const  config = {
    apiKey: process.env.REACT_APP_APIKEY_FIREBASE,
    authDomain: process.env.REACT_APP_AUTHDOMAIN_FIREBASE,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID_FIREBASE,
    storageBucket: "iotproject-446e7.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASSUREMENT_ID
};
//Initialize Firebase
firebase.initializeApp(config);

export default firebase;