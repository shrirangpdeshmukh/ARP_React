import { getDocs, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const checkOrg = (email) => {
  const index = email.indexOf('@');
  const domain = email.substr(index);
  if (domain !== '@iitbbs.ac.in') return false;
  return true;
};

export const getAdmins = async () => {
  const globalList = [];
  const collectionRef = collection(db, 'admins');
  const admins = await getDocs(collectionRef);

  admins.forEach((admin) => {
    globalList.push(admin.data());
  });
  return globalList;
};

export const addAdminToDB = async (name, email) => {
  const adminObj = { name, email };
  const docRef = doc(db, 'admins', email);

  await setDoc(docRef, adminObj);
  return true;
};

export const removeAdminFromDB = async (email) => {
  const docRef = doc(db, 'admins', email);
  await deleteDoc(docRef);
  return true;
};
