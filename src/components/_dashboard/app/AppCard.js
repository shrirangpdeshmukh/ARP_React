import { Icon } from '@iconify/react';

import outlineComputer from '@iconify/icons-ic/outline-computer';
import processorIcon from '@iconify/icons-uil/processor';
import toolFilled from '@iconify/icons-ant-design/tool-filled';
import lightningChargeFill from '@iconify/icons-bi/lightning-charge-fill';
import buildingIcon from '@iconify/icons-uil/building';
import bxMeteor from '@iconify/icons-bx/bx-meteor';
import scienceOutlined from '@iconify/icons-eos-icons/science-outlined';
import earthAmericaO from '@iconify/icons-gis/earth-america-o';
import humanResoruces from '@iconify/icons-healthicons/human-resoruces';
import bookIcon from '@iconify/icons-bi/book';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
//
import { useNavigate } from 'react-router-dom';
// prop type
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme, color }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette[color].darker,
  backgroundColor: theme.palette[color].lighter,
  transition: 'all 0.2s',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)'
  }
}));

const IconWrapperStyle = styled('div')(({ theme, color }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette[color].dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
    theme.palette[color].dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const iconMap = new Map([
  ['cse', outlineComputer],
  ['ee', lightningChargeFill],
  ['ece', processorIcon],
  ['me', toolFilled],
  ['mme', bxMeteor],
  ['ce', buildingIcon],
  ['sbs', scienceOutlined],
  ['seocs', earthAmericaO],
  ['shssm', humanResoruces],
  ['others', bookIcon]
]);

// ----------------------------------------------------------------------

export default function AppCard({ color, icon, title, subtitle }) {
  const navigate = useNavigate();

  return (
    <RootStyle
      color={color}
      onClick={() => {
        navigate(`/branch/${title.toLowerCase()}`);
      }}
    >
      <IconWrapperStyle color={color}>
        <Icon icon={iconMap.get(icon)} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{title}</Typography>
      <Typography
        variant="subtitle2"
        sx={{ opacity: 0.72, height: '30px', paddingLeft: '10px', paddingRight: '10px' }}
      >
        {subtitle}
      </Typography>
    </RootStyle>
  );
}

AppCard.propTypes = {
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string
};
