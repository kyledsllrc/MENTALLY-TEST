import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBPdikZ-AyD4LYK_6TCg03Qz_Pn333CUVc",
  authDomain: "mentally-d266c.firebaseapp.com",
  projectId: "mentally-d266c",
  storageBucket: "mentally-d266c.firebasestorage.app",
  messagingSenderId: "1012506248517",
  appId: "1:1012506248517:web:f7d2a3b78545ed31a7aa2c",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Set custom parameters so it always prompts account chooser if multiple Google accounts exist
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const db = getFirestore(app);

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase Firestore is currently offline or unreachable.");
      return false;
    }
    // Any other error (like permission-denied) still means server was contacted successfully
    return true;
  }
}
