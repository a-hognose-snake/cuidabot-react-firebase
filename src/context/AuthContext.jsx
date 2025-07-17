import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createUserDocument, getUserDocument } from '../services/firestoreService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(userCredential.user, email);
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      try {
        if (user) {
          const userProfile = await getUserDocument(user.uid);
          if (userProfile) {
            setCurrentUser({ ...user, ...userProfile });
          } else {
            setCurrentUser(user);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setCurrentUser(user || null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
