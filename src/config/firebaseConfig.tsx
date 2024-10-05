// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAJzbNub1-Q3iLF1ixHFV8gq-5j-8XIkl8",
  authDomain: "app-05-afe8a.firebaseapp.com",
  databaseURL: "https://app-05-afe8a-default-rtdb.firebaseio.com",
  projectId: "app-05-afe8a",
  storageBucket: "app-05-afe8a.appspot.com",
  messagingSenderId: "631202241463",
  appId: "1:631202241463:web:32d39d5e157a975009e632"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

 export const dbRealTime = getDatabase(app);