import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import iDocumentsAccepted from '@iconify/icons-healthicons/i-documents-accepted';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// prop-types
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function OptionsMenu({ clearFlags, deleteFile, details }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const OPTIONS_MENU = [
    { id: 'clear', label: 'Clear Flags', icon: iDocumentsAccepted, action: clearFlags },
    { id: 'delete', label: 'Delete File', icon: trash2Outline, action: deleteFile }
  ];

  return (
    <>
      <IconButton
        ref={ref}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={(event) => {
          event.stopPropagation();
          setIsOpen(false);
        }}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {OPTIONS_MENU.map((option) => {
          const { id, label, icon } = option;
          return (
            <MenuItem
              sx={{ color: 'text.secondary' }}
              key={id}
              onClick={(event) => {
                event.stopPropagation();
                option.action(details.subjectCode, details.resourceId);
                setIsOpen(false);
              }}
            >
              <ListItemIcon>
                <Icon icon={icon} width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

OptionsMenu.propTypes = {
  clearFlags: PropTypes.func,
  deleteFile: PropTypes.func,
  details: PropTypes.object
};
