import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';

const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};

export default useAuthContext;
