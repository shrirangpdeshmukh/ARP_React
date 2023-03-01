/* eslint-disable no-plusplus */
import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  deleteDoc,
  collection,
  setDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

const MAX_FLAG_NUMBER = 30;

const addSubjectIfNotExistsList = async (branch, subjectCode, subjectName) => {
  const docRef = doc(db, 'check', 'list');
  const branches = await getDoc(docRef);
  const branchesData = branches.data();

  const subjects = branchesData[branch];

  console.log(subjects);

  let flag = false;
  for (let i = 0; i < subjects.length; i++) {
    const subCode = subjects[i].substring(0, 7);
    if (subCode === subjectCode) {
      flag = true;
      break;
    }
  }

  if (!flag) {
    console.log(`Adding subject! ${subjectCode}`);
    // push data to the check collection
    subjects.push(subjectCode + subjectName);
    await updateDoc(docRef, {
      [`${branch}`]: arrayUnion(`${subjectCode}${subjectName}`)
    });
    await getAllSubjects();
  }
};

export const getResourcesBySubjectCode = async (branch, subjectCode) => {
  const collectionRef = collection(db, 'branches', branch, subjectCode);
  const queryRef = query(collectionRef, where('review', '==', true));
  const resources = await getDocs(queryRef);

  const resourceList = [];
  resources.forEach((resource) => {
    resourceList.push(resource.data());
  });

  return resourceList;
};

export const getAllSubjects = async () => {
  try {
    console.log('Get all subjects!');

    const searchArray = [];
    const branchSubjectList = [];

    const docRef = doc(db, 'check', 'list');
    const branches = await getDoc(docRef);
    const branchesData = branches.data();

    for (let j = 0; j < branchesData.branches.length; j++) {
      const branchData = {};
      const list = [];
      const temp = branchesData.branches[j];
      for (let i = 0; i < branchesData[temp].length; i++) {
        const data = branchesData[temp][i];
        const subCode = data.substring(0, 7);
        const subName = data.substring(7);
        const obj = { subjectName: subName, subjectCode: subCode };
        searchArray.push({
          information: obj,
          searchID: `${subName}${subCode}`.toLowerCase()
        });
        list.push(obj);
      }
      branchData.branchName = temp;
      branchData.data = list;
      branchSubjectList.push(branchData);
    }

    console.log({ searchArray, branchSubjectList });

    localStorage.setItem('searchArray', JSON.stringify(searchArray));
    localStorage.setItem('branchSubjectList', JSON.stringify(branchSubjectList));

    return { searchArray, branchSubjectList };
  } catch (e) {
    console.log(e);
    window.alert('Something went wrong with fetching the resources!');
  }
};

export const getAllFlaggedResources = async () => {
  try {
    const globalList = [];

    const courseData = JSON.parse(localStorage.getItem('branchSubjectList'));
    await Promise.all(
      courseData.map(async (branch) => {
        const subjects = branch.data;
        await Promise.all(
          subjects.map(async (subject) => {
            const collectionRef = collection(
              db,
              'branches',
              branch.branchName,
              subject.subjectCode
            );
            const queryRef = query(collectionRef, where('flags', '>', 0));
            const resources = await getDocs(queryRef);
            resources.forEach((resource) => {
              globalList.push(resource.data());
            });
          })
        );
      })
    );
    return globalList;
  } catch (err) {
    throw new Error(`Error while fetching unreviewed resources: ${err.message}`);
  }
};

export const clearFlagsOfResource = async (branch, subjectCode, resourceId) => {
  const docRef = doc(db, 'branches', branch, subjectCode, resourceId);
  const clearedFlags = { flags: 0, flagReason: [], review: true };

  await updateDoc(docRef, clearedFlags);
  return true;
};

export const flagAResource = async (branch, subjectCode, resourceId, flagReason) => {
  const docRef = doc(db, 'branches', branch, subjectCode, resourceId);
  const resourceSnapshot = await getDoc(docRef);
  const resource = resourceSnapshot.data();

  const newFlags = resource.flags + 1;
  const flagArray = resource.flagReason;
  flagArray.push(flagReason);
  let reviewVar = resource.review;
  if (newFlags >= MAX_FLAG_NUMBER) reviewVar = false;

  const updateObj = { flags: newFlags, flagReason: flagArray, review: reviewVar };
  await updateDoc(docRef, updateObj);

  return true;
};

export const getAllUnreviewedResources = async () => {
  try {
    const globalList = [];

    const courseData = JSON.parse(localStorage.getItem('branchSubjectList'));
    await Promise.all(
      courseData.map(async (branch) => {
        const subjects = branch.data;
        await Promise.all(
          subjects.map(async (subject) => {
            const collectionRef = collection(
              db,
              'branches',
              branch.branchName,
              subject.subjectCode
            );
            const queryRef = query(collectionRef, where('review', '==', false));
            const resources = await getDocs(queryRef);
            resources.forEach((resource) => {
              globalList.push(resource.data());
            });
          })
        );
      })
    );
    return globalList;
  } catch (err) {
    throw new Error(`Error while fetching unreviewed resources: ${err.message}`);
  }
};

export const uploadStudyResource = async (reqBody, branch) => {
  const resourceObj = {
    emailId: reqBody.emailId,
    subjectName: reqBody.subjectName,
    type: reqBody.type,
    semester: reqBody.semester,
    flags: 0,
    subjectCode: reqBody.subjectCode,
    year: reqBody.year,
    review: false,
    downloadLink: reqBody.downloadLink,
    storageReference: reqBody.storageReference,
    description: reqBody.description,
    flagReason: []
  };

  const newResourceDocRef = doc(collection(db, 'branches', branch, reqBody.subjectCode));
  resourceObj.resourceId = newResourceDocRef.id;
  console.log({ resourceObj });
  await setDoc(newResourceDocRef, resourceObj);

  const branchDocRef = doc(db, 'branches', branch);
  await updateDoc(branchDocRef, { lastUpdated: Date.now() });

  await addSubjectIfNotExistsList(branch, reqBody.subjectCode, reqBody.subjectName);

  console.log('Done');
  return true;
};

export const acceptResource = async (branch, resourceId, reqBody) => {
  const { subjectCode, subjectName } = reqBody;
  const branchName = branch;

  await addSubjectIfNotExistsList(branchName, subjectCode, subjectName);

  const updateObj = {
    subjectName,
    subjectCode,
    semester: reqBody.semester,
    type: reqBody.type,
    year: reqBody.year,
    flags: 0,
    flagReason: [],
    review: true,
    description: reqBody.description
  };

  const resourceDocRef = doc(db, 'branches', branchName, subjectCode, resourceId);
  await updateDoc(resourceDocRef, updateObj);

  return true;
};

export const deleteResourcePaper = async (branch, subjectCode, resourceId) => {
  const resourceDocRef = doc(db, 'branches', branch, subjectCode, resourceId);
  const resource = await getDoc(resourceDocRef);

  const { storageReference } = resource.data();
  const str = storageReference;
  const pos = str.lastIndexOf('/');
  const name = `${subjectCode}:${str.substring(pos + 1)}.pdf`;

  await deleteDoc(resourceDocRef);
  console.log('Successfully deleted file');

  const resourceRef = ref(storage, name);
  await deleteObject(resourceRef);
  console.log('Deleted the file from storage');

  return true;
};
