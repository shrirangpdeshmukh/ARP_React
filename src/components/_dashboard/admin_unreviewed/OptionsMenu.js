import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import iDocumentsAccepted from '@iconify/icons-healthicons/i-documents-accepted';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

const OPTIONS_MENU = [
  { id: 'accept', label: 'Accept', icon: iDocumentsAccepted },
  { id: 'edit', label: 'Edit', icon: editFill },
  { id: 'delete', label: 'Delete', icon: trash2Outline }
];

// ----------------------------------------------------------------------

export default function OptionsMenu() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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
            <MenuItem sx={{ color: 'text.secondary' }} key={id}>
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
