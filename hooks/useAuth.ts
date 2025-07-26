// "use client";

// import { useEffect, useState } from "react";
// import type { User } from "firebase/auth";

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [initialized, setInitialized] = useState(false);
//   const [authMethods, setAuthMethods] = useState<any>(null);

//   useEffect(() => {
//     // Dynamically import Firebase Auth to avoid SSR issues
//     const initAuth = async () => {
//       try {
//         const { onAuthStateChanged, signInWithPopup, signOut } = await import(
//           "firebase/auth"
//         );
//         const { auth, googleProvider } = await import("@/lib/firebase.client");

//         // Store auth methods in state instead of window
//         const methods = {
//           signInWithPopup: () => signInWithPopup(auth, googleProvider),
//           signOut: () => signOut(auth),
//           auth,
//           googleProvider,
//         };
//         setAuthMethods(methods);

//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//           setUser(user);
//           setLoading(false);
//           setInitialized(true);
//         });

//         return unsubscribe;
//       } catch (error) {
//         console.error("Firebase Auth initialization error:", error);
//         setLoading(false);
//         setInitialized(true);
//       }
//     };

//     const unsubscribePromise = initAuth();

//     return () => {
//       unsubscribePromise.then((unsubscribe) => {
//         if (unsubscribe) unsubscribe();
//       });
//     };
//   }, []);

//   const signInWithGoogle = async () => {
//     try {
//       if (!authMethods) {
//         throw new Error("Firebase Auth not initialized");
//       }

//       const result = await authMethods.signInWithPopup();
//       return { user: result.user, error: null };
//     } catch (error: any) {
//       console.error("Google sign-in error:", error);
//       return { user: null, error: error.message };
//     }
//   };

//   const logout = async () => {
//     try {
//       if (!authMethods) {
//         throw new Error("Firebase Auth not initialized");
//       }

//       await authMethods.signOut();
//       return { error: null };
//     } catch (error: any) {
//       console.error("Logout error:", error);
//       return { error: error.message };
//     }
//   };

//   return {
//     user,
//     loading,
//     initialized: initialized && authMethods !== null,
//     signInWithGoogle,
//     logout,
//   };
// }
