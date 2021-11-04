import PropTypes from 'prop-types';
// react
import { useState, useEffect } from 'react';
// material
import { Box, CircularProgress, Typography } from '@mui/material';
// icons
import { Icon } from '@iconify/react';
import fileTextOutline from '@iconify/icons-eva/file-text-outline';

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
  const [thumbnail, setThumbnail] = useState(null);

  const getThumb = async () => {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      '//cdn.jsdelivr.net/npm/pdfjs-dist@2.6.347/build/pdf.worker.js';

    const doc = await pdfjsLib.getDocument(URL.createObjectURL(pdf)).promise;
    const page = await doc.getPage(1);

    const viewport = page.getViewport({ scale: 1 });

    const outputScale = window.devicePixelRatio || 1;

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    await page.render({
      canvasContext: canvas.getContext('2d'),
      transform,
      viewport
    }).promise;

    setThumbnail(canvas.toDataURL());
  };

  useEffect(() => {
    getThumb();
  }, []);

  if (thumbnail)
    return <img src={thumbnail} alt="pdf-thumbnail" style={{ position: 'absolute', top: 0 }} />;

  return <CircularProgress />;
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
  return (
    <Box>
      <Icon icon={fileTextOutline} width={40} height={40} />
      <Typography>File Preview Unavailable</Typography>
    </Box>
  );
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
      <Box
        sx={{
          width: '250px',
          height: '300px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
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
