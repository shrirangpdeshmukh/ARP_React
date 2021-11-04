import PropTypes from 'prop-types';
// react
import { useState, useEffect } from 'react';
// material
import { Box } from '@mui/material';

// -------------------------------------------------------------

PDFPreview.propTypes = {
  pdf: PropTypes.object
};
Preview.propTypes = {
  file: PropTypes.object
};
FilePreview.propTypes = {
  file: PropTypes.object
};

function PDFPreview({ pdf }) {
  // return (
  //   <img
  //     src={viewImage}
  //     alt="file preview"
  //     style={{ objectFit: 'cover', width: '100%', height: '100%' }}
  //   />
  // );

  return null;
}

function Preview({ file }) {
  if (file.type.startsWith('image'))
    return (
      <img
        src={URL.createObjectURL(file)}
        alt="file preview"
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    );
  if (file.type === 'application/pdf') return <PDFPreview pdf={file} />;
  return <>File Preview Here</>;
}

export default function FilePreview({ file }) {
  let name = '';
  if (file.name.length <= 24) name = file.name;
  else {
    const ext = file.name.split('.')[file.name.split('.').length - 1];
    name = file.name.substr(0, 21 - ext.length + 1);
    name += `....${ext}`;
  }

  return (
    <Box
      sx={{
        borderRadius: '20px',
        bgcolor: 'grey.200',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)'
      }}
    >
      <Box sx={{ width: '250px', height: '300px', textAlign: 'center' }}>
        <Preview file={file} />
      </Box>
      <Box
        sx={{
          width: '250px',
          height: '40px',
          position: 'absolute',
          bottom: 0,
          bgcolor: 'rgb(255, 72, 66)',
          borderRadius: '0px 0px 20px 20px',
          textAlign: 'center',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          px: 2,
          lineHeight: '40px'
        }}
      >
        {name}
      </Box>
    </Box>
  );
}
