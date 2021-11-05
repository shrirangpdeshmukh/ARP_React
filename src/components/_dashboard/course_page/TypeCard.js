import PropTypes from 'prop-types';
// material
import {
  Card,
  Table,
  Box,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  CardHeader,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
// iconify
import { Icon } from '@iconify/react';
import flag from '@iconify/icons-bi/flag';
// components
import Scrollbar from '../../Scrollbar';
//

const ColorButton = styled(IconButton)(({ theme, color = 'primary' }) => ({
  backgroundColor: theme.palette[color].lighter,
  '&:hover': {
    backgroundColor: theme.palette[color].light
  }
}));

export default function TypeCard({ details, flagFileSet, handleOpen }) {
  if (details.array.length > 0) {
    return (
      <Grid item xs={12} sm={6} md={6} padding={1} mb={5}>
        <Card>
          <CardHeader title={details.title} />
          <Box style={{ maxHeight: '200px', overflow: 'auto' }}>
            <Scrollbar style={{ maxHeight: '200px' }}>
              <Table stickyHeader style={{ width: '100%', tableLayout: 'fixed' }}>
                <TableBody>
                  {details.array.map((row, index) => {
                    const { semester, year, description, downloadLink } = row;

                    return (
                      <TableRow
                        hover
                        key={`${details.title}-${index + 1}`}
                        tabIndex={-1}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          window.open(downloadLink);
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            width: 'calc(100% - 200px)'
                          }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {`${semester}-${year}`}
                          </Typography>
                          <Typography variant="subtitle3" noWrap>
                            {description}
                          </Typography>
                        </TableCell>
                        <TableCell align="left" style={{ width: '120px' }}>
                          {year}
                        </TableCell>

                        <TableCell align="left" style={{ width: '80px' }} tabIndex={-1}>
                          <Tooltip title="Report resource" placement="right">
                            <ColorButton
                              onClick={(event) => {
                                event.stopPropagation();
                                // event.preventDefault();
                                flagFileSet(row);
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
            </Scrollbar>
          </Box>
        </Card>
      </Grid>
    );
  }
  return null;
}

TypeCard.propTypes = {
  details: PropTypes.object.isRequired,
  flagFileSet: PropTypes.func,
  handleOpen: PropTypes.func
};
