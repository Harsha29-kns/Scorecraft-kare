import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where, orderBy, onSnapshot
} from 'firebase/firestore';
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut,
} from 'firebase/auth';
import axios from 'axios';

// Get Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth();

// --- IMAGE UPLOAD SERVICE (CLOUDINARY) ---
export const imageUploader = {
  upload: async (file, folder = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  },
};

// --- GENERIC FIRESTORE HELPER ---
const getAllFromCollection = async (collectionName) => {
  const q = query(collection(db, collectionName), orderBy('title', 'asc')); // Assuming you want to order by title
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

// --- API MODULES ---

export const coreTeam = {
  getAll: () => getAllFromCollection('core_team'),
  create: (memberData) => addDoc(collection(db, 'core_team'), memberData),
  update: (id, updates) => updateDoc(doc(db, 'core_team', id), updates),
  delete: (id) => deleteDoc(doc(db, 'core_team', id)),
};

export const mentors = {
  getAll: () => getAllFromCollection('mentors'),
  create: (mentorData) => addDoc(collection(db, 'mentors'), mentorData),
  update: (id, updates) => updateDoc(doc(db, 'mentors', id), updates),
  delete: (id) => deleteDoc(doc(db, 'mentors', id)),
};

export const events = {
  getAll: () => getAllFromCollection('events'),
  getUpcoming: async () => {
    const q = query(collection(db, 'events'), where('endTime', '>=', new Date().toISOString()), orderBy('endTime', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  getById: async (id) => {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  create: (eventData) => addDoc(collection(db, 'events'), eventData),
  update: (id, updates) => updateDoc(doc(db, 'events', id), updates),
  delete: (id) => deleteDoc(doc(db, 'events', id)),
};

export const registrations = {
    create: (data) => addDoc(collection(db, 'registrations'), data),
    
    // ✅ RENAMED: For real-time updates (e.g., in the admin panel's modal)
    listenByEventId: (eventId, callback) => {
      const q = query(collection(db, 'registrations'), where('eventId', '==', eventId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const regs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(regs);
      });
      return unsubscribe;
    },

    // ✅ RENAMED & FIXED: For real-time updates of only verified registrations
    listenVerifiedByEventId: (eventId, callback) => {
      const q = query(collection(db, 'registrations'), where('eventId', '==', eventId), where('verified', '==', true));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const regs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(regs);
      });
      return unsubscribe;
    },
    
    // ✅ NEW: For one-time fetching of verified registrations (for admin panel counts)
    getVerifiedByEventIdOnce: async (eventId) => {
        const q = query(collection(db, 'registrations'), where('eventId', '==', eventId), where('verified', '==', true));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    verify: (id) => updateDoc(doc(db, 'registrations', id), { verified: true }),
    
    // ✅ NEW: Added missing function
    updateEmailStatus: (id, status) => updateDoc(doc(db, 'registrations', id), { emailStatus: status }),
};

export const contactSubmissions = {
  create: (submissionData) => addDoc(collection(db, 'contact_submissions'), submissionData),
};

export const adminAuth = {
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
  onAuthChange: (callback) => onAuthStateChanged(auth, callback),
};
