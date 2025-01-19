import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from './api';

export const registerWithEmail = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseToken = await userCredential.user.getIdToken();
  
  // Register user in our backend
  const response = await api.post('/auth/register', {
    name,
    email,
    firebaseUid: userCredential.user.uid,
  }, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });

  return response.data;
};

export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await userCredential.user.getIdToken();
  
  // Get user data from our backend
  const response = await api.post('/auth/login', {}, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });

  return {
    user: response.data.user,
    token: firebaseToken,
  };
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const firebaseToken = await userCredential.user.getIdToken();

  // Get or create user in our backend
  const response = await api.post('/auth/google', {
    name: userCredential.user.displayName,
    email: userCredential.user.email,
    firebaseUid: userCredential.user.uid,
  }, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`,
    },
  });

  return {
    user: response.data.user,
    token: firebaseToken,
  };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
