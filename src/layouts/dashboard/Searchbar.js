import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// iconify
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Input,
  Slide,
  Button,
  InputAdornment,
  ClickAwayListener,
  IconButton,
  Backdrop
} from '@mui/material';

import Scrollbar from '../../components/Scrollbar';
import useSubjectsContext from '../../hooks/useSubjectsContext';

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 99,
  width: 'calc(100% - 40px)',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  margin: '20px 20px',
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 1)}`,
  borderRadius: '20px',
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

const SearchResultsStyle = styled('div')(({ theme }) => ({
  left: 0,
  zIndex: 99,
  width: 'calc(100% - 40px)',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  margin: '20px 20px',
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 1)}`,
  borderRadius: '20px',
  color: 'black',
  textAlign: 'center',
  height: '40%',
  minHeight: APPBAR_DESKTOP,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 5)
  }
}));

// console.log('searchArray', searchArray);

// ----------------------------------------------------------------------

export default function Searchbar() {
  const { searchArray } = useSubjectsContext();

  const [isOpen, setOpen] = useState(false);

  const [searchStr, setSearchStr] = useState('');
  const [results, setResults] = useState([]);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const search = () => {
    if (searchStr === '') setResults([]);
    else {
      // search
      let query = searchStr;
      const searchResult = [];
      query = query.toLowerCase();
      searchArray.forEach((item) => {
        if (item.searchID.includes(query)) {
          searchResult.push(item);
        }
      });
      setResults(searchResult);
    }
  };

  useEffect(() => {
    search();
  }, [searchStr]);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isOpen && (
          <IconButton onClick={handleOpen}>
            <Icon icon={searchFill} width={20} height={20} />
          </IconButton>
        )}

        <Backdrop
          sx={{ color: '#fff', zIndex: 50, height: '100vh' }}
          open={isOpen}
          onClick={handleClose}
        >
          <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
            <SearchbarStyle onClick={(e) => e.stopPropagation()}>
              <Input
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Search…"
                startAdornment={
                  <InputAdornment position="start">
                    <Box
                      component={Icon}
                      icon={searchFill}
                      sx={{ color: 'text.disabled', width: 20, height: 20 }}
                    />
                  </InputAdornment>
                }
                sx={{ mr: 1, fontWeight: 700, fontSize: 18 }}
                value={searchStr}
                onChange={(e) => {
                  let text = e.target.value;
                  text = text.replace(/\s\s+/g, ' ');
                  setSearchStr(text.trimStart());
                }}
              />
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  // Search function
                }}
              >
                Search
              </Button>
            </SearchbarStyle>
          </Slide>

          {/* Must be visible only when result count > 0 */}
          {results.length > 0 && (
            <SearchResultsStyle onClick={(e) => e.stopPropagation()}>
              <Scrollbar>
                {results.map((result) => (
                  <Button
                    key={result.searchID}
                    fullWidth
                    onClick={() => {
                      setOpen(false);
                      setSearchStr('');
                      // navigate();
                    }}
                    component={Link}
                    to={`/course/${result.information.subjectCode}`}
                  >{`${result.information.subjectCode} ${result.information.subjectName}`}</Button>
                ))}
              </Scrollbar>
            </SearchResultsStyle>
          )}
        </Backdrop>
      </div>
    </ClickAwayListener>
  );
}
