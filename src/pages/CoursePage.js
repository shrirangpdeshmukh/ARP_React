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
  Tooltip
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

const ColorButton = styled(IconButton)(({ theme, color = 'primary' }) => ({
  backgroundColor: theme.palette[color].lighter,
  '&:hover': {
    backgroundColor: theme.palette[color].light
  }
}));

const TypeCard = ({ details }) => {
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
                        <Typography variant="subtitle3" noWrap>
                          {description}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">{date}</TableCell>

                      <TableCell padding={0} align="left">
                        <Tooltip title="Click here to report this file." placement="right">
                          <ColorButton>
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
              return <TypeCard details={details} key={key} />;
            })}
          </Grid>
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
