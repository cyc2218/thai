
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 提示：使用者需將自己的 Firebase Config 填入此處
// 在實際開發中，這些資料通常來自環境變數
const firebaseConfig = {
  apiKey: "AIzaSyDzGnQPZEx7gLBtUTlj4eKjpQAc9VwHQnw",
  authDomain: "changsis-thai-trip.firebaseapp.com",
  projectId: "changsis-thai-trip",
  storageBucket: "changsis-thai-trip.firebasestorage.app",
  messagingSenderId: "868536827556",
  appId: "1:868536827556:web:bf961e2bff90b28452f031"
};

// 避免在 Config 未設定時報錯
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const loginWithGithub = async () => {
  if (!auth) {
    return null;
  }
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("GitHub Login Error:", error);
    return null;
  }
};

export const logout = async () => {
  if (auth) await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  if (!auth) return () => { };
  return onAuthStateChanged(auth, callback);
};
