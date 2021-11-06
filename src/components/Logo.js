import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';
// logo
import collegeLogo from '../assets/images/collegelogo2.png';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return <Box component="img" src={collegeLogo} sx={{ width: 40, height: 40, ...sx }} />;
}
