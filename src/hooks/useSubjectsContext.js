import { useContext } from 'react';
import { SubjectsContext } from '../contexts/subjectsContext';

const useSubjectsContext = () => {
  const subjectsContext = useContext(SubjectsContext);
  return subjectsContext;
};

export default useSubjectsContext;
