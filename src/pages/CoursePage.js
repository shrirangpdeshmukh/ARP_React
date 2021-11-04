import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import flag from '@iconify/icons-bi/flag';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';

//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'company', label: 'Uploaded On' },
  { id: '' }
];

const FLAG_OPTIONS = [
  { value: 'irrelevant', label: 'The file is irrelevant' },
  { value: 'duplicate', label: 'The file is duplicated' },
  { value: 'unclear', label: 'The file is not clear' },
  { value: 'explict', label: 'The file is explict' }
];

const ColorButton = styled(IconButton)(({ theme, color = 'primary' }) => ({
  backgroundColor: theme.palette[color].lighter,
  padding: '7px',
  '&:hover': {
    backgroundColor: theme.palette[color].light
  }
}));

const FlagDialog = ({ flagFile, handleClose, open }) => {
  const [reason, setReason] = useState('');

  if (open && flagFile && flagFile.title && flagFile.file) {
    return (
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setReason('');
        }}
      >
        <DialogTitle>Flag File</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">{`${flagFile.title}: ${flagFile.file.sem}`}</Typography>
          <br />
          <Box py={1} sx={{ display: 'flex' }}>
            <FormControl fullWidth required>
              <InputLabel id="">Flag Reason</InputLabel>
              <Select
                autoWidth
                displayEmpty
                variant="filled"
                labelId="flag-reason"
                id="flagReason"
                value={reason}
                label="Reason"
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              >
                {FLAG_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              setReason('');
            }}
          >
            OK
          </Button>
          <Button
            onClick={() => {
              handleClose();
              setReason('');
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return null;
};

const TypeCard = ({ details, flagFileSet, handleOpen }) => {
  if (details.array.length > 0) {
    return (
      <Grid item xs={12} sm={6} md={6} padding={1}>
        <Card>
          <CardHeader title={details.title} />
          <TableContainer style={{ maxHeight: '200px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((headCell) => (
                    <TableCell key={headCell.id} align="left">
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {details.array.map((row) => {
                  const { id, sem, date, description } = row;

                  return (
                    <TableRow hover key={id} tabIndex={-1}>
                      <TableCell component="th" scope="row">
                        <Typography variant="subtitle2" noWrap>
                          {sem}
                        </Typography>
                        <Typography variant="subtitle3">{description}</Typography>
                      </TableCell>
                      <TableCell align="left" noWrap>
                        {date}
                      </TableCell>

                      <TableCell padding="none" align="center">
                        <Tooltip title="Click here to report this file." placement="right">
                          <ColorButton
                            onClick={() => {
                              flagFileSet({ title: details.title, file: row });
                              handleOpen();
                            }}
                          >
                            <Icon icon={flag} width={18} height={18} />
                          </ColorButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    );
  }
  return null;
};

// ----------------------------------------------------------------------

export default function CoursePage({
  branchCode = 'CSE',
  courseCode = 'CS1L001',
  courseName = 'Introduction to Prgoramming and Data Structures'
}) {
  const [cards, setCards] = useState({
    endsem: { array: [], title: 'End Semester' },
    midsem: { array: [], title: 'Mid Semester' },
    quiz: { array: [], title: 'Quiz' },
    tutorial: { array: [], title: 'Tutorials' },
    other: { array: [], title: 'Others' }
  });
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagFile, setFlagFile] = useState({ title: null, file: null });

  const openDialog = () => {
    setFlagDialogOpen(true);
  };
  const closeDialog = () => {
    setFlagDialogOpen(false);
    setFlagFile({ title: null, file: null });
  };

  const flagFileSet = (newFlagFile) => {
    setFlagFile(newFlagFile);
  };

  const seperatePapers = () => {
    const newCards = { ...cards };
    USERLIST.forEach((paper) => newCards[paper.type].array.push(paper));
    setCards(newCards);
  };

  useEffect(() => {
    seperatePapers();
  }, []);

  return (
    <Page title={`${branchCode} | ${courseCode} | ARP`}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {courseName}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/upload"
            startIcon={<Icon icon={plusFill} />}
          >
            Add
          </Button>
        </Stack>
        <Scrollbar>
          <Grid container>
            {Object.entries(cards).map((type) => {
              const details = type[1];
              const key = type[0];
              return (
                <TypeCard
                  details={details}
                  key={key}
                  handleOpen={openDialog}
                  flagFileSet={flagFileSet}
                />
              );
            })}
          </Grid>
          <FlagDialog open={flagDialogOpen} handleClose={closeDialog} flagFile={flagFile} />
        </Scrollbar>
      </Container>
    </Page>
  );
}

TypeCard.propTypes = {
  details: PropTypes.object.isRequired
};

CoursePage.propTypes = {
  branchCode: PropTypes.string.isRequired,
  courseCode: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired
};
