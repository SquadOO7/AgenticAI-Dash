// // Import the functions you need from the SDKs you need
// import { initializeApp, getApps } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// // Validate required config
// const requiredKeys = [
//   "apiKey",
//   "authDomain",
//   "projectId",
//   "storageBucket",
//   "messagingSenderId",
//   "appId",
// ];
// const missingKeys = requiredKeys.filter(
//   (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
// );

// if (missingKeys.length > 0) {
//   console.error("Missing Firebase configuration keys:", missingKeys);
//   throw new Error(`Missing Firebase configuration: ${missingKeys.join(", ")}`);
// }

// // Initialize Firebase only if it hasn't been initialized yet
// const app =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// // Initialize Firebase services
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// // Initialize Google Auth Provider
// export const googleProvider = new GoogleAuthProvider();
// googleProvider.setCustomParameters({
//   prompt: "select_account",
// });

// // Initialize Analytics only in browser environment and when config is available
// export const analytics =
//   typeof window !== "undefined" && firebaseConfig.measurementId
//     ? getAnalytics(app)
//     : null;

// export default app;
