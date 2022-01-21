// react
import { useState, useEffect } from 'react';
// axios
import axios from 'axios';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
// ----------------------------------------------------------------------

const getAllSubjects = async () => {
  const searchArray = [];
  let branchSubjectList = [];
  let jsArray = [];
  axios
    .get('https://arpbackend-df561.firebaseapp.com/search')
    .then((res) => {
      jsArray = res.data;
      console.log(res);
      jsArray.forEach((subNameCodeObj) => {
        subNameCodeObj.data.forEach((obj) =>
          searchArray.push({
            information: obj,
            searchID: `${obj.subjectName}${obj.subjectCode}`.toLowerCase()
          })
        );
      });
      branchSubjectList = jsArray;

      console.log(branchSubjectList);

      console.log(searchArray);

      localStorage.setItem('searchArray', JSON.stringify(searchArray));
      localStorage.setItem('branchSubjectList', JSON.stringify(branchSubjectList));
    })
    .catch((error) => {
      console.error(error);
      window.alert(error.message);
    });
  // return jsArray;
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getAllSubjects();
  }, []);

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <Router
        user={user}
        updateUser={(el) => {
          setUser(el);
        }}
      />
    </ThemeConfig>
  );
}
