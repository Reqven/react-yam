import React from 'react';
import FirebaseSDK from '@firebase/app';
import '@firebase/database';


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

class Firebase {

  setup() {
    const initialize = () => {
      try {
        FirebaseSDK.initializeApp(config);
        FirebaseSDK.database();
        return this.isReadable();
      } catch(e) {
        console.log('Error: Unable to initialize Firebase, please check your config', e);
        return Promise.resolve(false);
      }
    }
    if (!this.isInitialized()) {
      return initialize();
    }
    return FirebaseSDK
      .app().delete()
      .then(() => initialize());
  }

  isInitialized() {
    return Boolean(FirebaseSDK.apps.length);
  }

  isReadable() {
    return fetch(config.databaseURL + '/data.json')
      .then(response => Promise.resolve(response.ok))
      .catch(() => Promise.resolve(false));
  }
}

export default Firebase;
export const FirebaseContext = React.createContext(null);
