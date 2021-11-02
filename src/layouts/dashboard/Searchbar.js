import { Icon } from '@iconify/react';
import { useState } from 'react';
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
  minHeight: APPBAR_DESKTOP,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
                sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
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
          <SearchResultsStyle onClick={(e) => e.stopPropagation()}>
            <p>Search Results Here ...</p>
          </SearchResultsStyle>
        </Backdrop>
      </div>
    </ClickAwayListener>
  );
}