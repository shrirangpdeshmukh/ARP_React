import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const SUPER_ADMIN_EMAIL = 'secyprogsoc.sg@iitbbs.ac.in';

export const googleLogin = async () => {
  try {
    const googleProvider = new GoogleAuthProvider(auth);
    const response = await signInWithPopup(auth, googleProvider);
    if (response) {
      console.log("You're now signed in !");
      return response;
    }
    return false;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const googleLogout = async () => {
  try {
    await signOut(auth);
    console.log('Sign-out successful');
    return true;
  } catch (error) {
    console.error(error);
    throw new Error(error);
    // An error happened.
  }
};

export const getUserRole = async (email) => {
  let role = 'user';
  if (email === SUPER_ADMIN_EMAIL) {
    role = 'superAdmin';
  } else {
    const docRef = doc(db, 'admins', email);
    const document = await getDoc(docRef);

    if (document.exists()) {
      role = 'admin';
    }
  }
  return role;
};
