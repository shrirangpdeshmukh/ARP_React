import { createContext, useState, useEffect, useCallback } from 'react';
import { getAllSubjects } from '../API/studyResources';

export const SubjectsContext = createContext();

export const SubjectsContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [branchSubjectList, setBranchSubjectList] = useState([]);
  const [searchArray, setSearchArray] = useState([]);

  const fetchSubjects = useCallback(async () => {
    console.log('Called fetchSubjects');
    setLoading(true);
    try {
      const response = await getAllSubjects();
      setBranchSubjectList(response.branchSubjectList);
      setSearchArray(response.searchArray);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const SubjectsCtxValue = {
    loading,
    searchArray,
    branchSubjectList
  };

  return <SubjectsContext.Provider value={SubjectsCtxValue}>{children}</SubjectsContext.Provider>;
};
