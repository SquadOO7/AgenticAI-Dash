// import { initializeApp, getApps, cert } from "firebase-admin/app"
// import { getFirestore } from "firebase-admin/firestore"
// import { getAuth } from "firebase-admin/auth"

// // Initialize Firebase Admin SDK
// const firebaseAdminConfig = {
//   credential: cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//   }),
// }

// // Initialize admin app if it doesn't exist
// const adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig, "admin") : getApps()[0]

// // Export admin services
// export const adminDb = getFirestore(adminApp)
// export const adminAuth = getAuth(adminApp)

// export default adminApp
