import React from 'react';
import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


const config = {
  // Paste your web app's Firebase configuration here
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

Firebase.initializeApp(config);

export const UserContext = React.createContext({ user: null });
