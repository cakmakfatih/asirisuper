import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDiRnA4tTlfCodB6ZoIxD-A8vcwAC6Vmjw",
    authDomain: "asirisuper-d61d7.firebaseapp.com",
    databaseURL: "https://asirisuper-d61d7.firebaseio.com",
    projectId: "asirisuper-d61d7",
    storageBucket: "asirisuper-d61d7.appspot.com",
    messagingSenderId: "452244538531"
  };
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
