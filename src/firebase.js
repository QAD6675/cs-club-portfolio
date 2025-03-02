import { initializeApp } from "@firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyzEGEwMyhlyZwSKwOHyZ2JppggvxXoqQ",
  authDomain: "cs-club-portfolio.firebaseapp.com",
  projectId: "cs-club-portfolio",
  storageBucket: "cs-club-portfolio.firebasestorage.app",
  messagingSenderId: "244011281108",
  appId: "1:244011281108:web:3aee165999b609aed1a941",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

// Auth Operations
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("Login successful:", userCredential.user.email);
    return userCredential;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    await signOut(auth);
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Projects Collection Operations
export const getProjects = async () => {
  const projectsCollection = collection(db, "projects");
  const snapshot = await getDocs(projectsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateProject = async (id, data) => {
  const projectRef = doc(db, "projects", id);
  await updateDoc(projectRef, data);
};

export const deleteProject = async (id) => {
  const projectRef = doc(db, "projects", id);
  await deleteDoc(projectRef);
};

export const addProject = async (data) => {
  const projectsCollection = collection(db, "projects");
  return await addDoc(projectsCollection, data);
};

// Activities Collection Operations
export const getActivities = async () => {
  const activitiesCollection = collection(db, "activities");
  const snapshot = await getDocs(activitiesCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateActivity = async (id, data) => {
  const activityRef = doc(db, "activities", id);
  await updateDoc(activityRef, data);
};

export const deleteActivity = async (id) => {
  const activityRef = doc(db, "activities", id);
  await deleteDoc(activityRef);
};

export const addActivity = async (data) => {
  const activitiesCollection = collection(db, "activities");
  return await addDoc(activitiesCollection, data);
};
