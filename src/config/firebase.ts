import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDJddTKPQWUpvmyFZSRDW51ulFbDn_zWOw",
  authDomain: "taxi-app-fedb3.firebaseapp.com",
  databaseURL: "https://taxi-app-fedb3-default-rtdb.firebaseio.com",
  projectId: "taxi-app-fedb3",
  storageBucket: "taxi-app-fedb3.appspot.com",
  messagingSenderId: "995642598549",
  appId: "1:995642598549:web:17479272bb00b7ce3b279c",
  measurementId: "G-12YH43K682"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
