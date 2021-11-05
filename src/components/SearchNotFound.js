import PropTypes from 'prop-types';
// material
import { Paper, Typography, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
  loading: PropTypes.bool
};

export default function SearchNotFound({ searchQuery = '', loading, ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {loading ? 'Fetching Courses ...' : 'Not found'}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="body2" align="center">
          No results found for &nbsp;
          <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos or using complete
          words.
        </Typography>
      )}
    </Paper>
  );
}
