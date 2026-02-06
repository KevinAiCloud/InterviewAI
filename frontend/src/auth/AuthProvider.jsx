// AuthProvider - SOLE OWNER of auth state
// onAuthStateChanged exists ONLY HERE.
// NO navigation inside this file.

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    // Initialize with current user for optimistic hydration
    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ref to track if loading has been set to false once
    const hasResolved = useRef(false);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleProvider = new GoogleAuthProvider();
    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        return signOut(auth);
    };

    // Helper to fetch user role (non-blocking)
    const fetchUserRole = async (user) => {
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                // Create new user document
                await setDoc(userRef, {
                    email: user.email,
                    role: "user",
                    createdAt: serverTimestamp()
                });
                return "user";
            } else {
                return userSnap.data().role || "user";
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return "user"; // Default role on error
        }
    };

    useEffect(() => {
        // SINGLE onAuthStateChanged listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                // Fetch role in background - doesn't block loading
                const role = await fetchUserRole(user);
                setUserRole(role);
            } else {
                setCurrentUser(null);
                setUserRole(null);
            }

            // Loading resolves EXACTLY ONCE
            if (!hasResolved.current) {
                hasResolved.current = true;
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        isAdmin: userRole === 'admin'
    };

    // ALWAYS render children - no blocking
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
