import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';
import baselineRateReview from '@iconify/icons-ic/baseline-rate-review';
import bxsFlag from '@iconify/icons-bx/bxs-flag';
import plusCircleFilled from '@iconify/icons-ant-design/plus-circle-filled';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'upload',
    path: '/upload',
    icon: getIcon(cloudUploadFill)
  },
  {
    title: 'manage admin',
    path: '/admin/manage',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Add Course',
    path: '/admin/addCourse',
    icon: getIcon(plusCircleFilled)
  },
  {
    title: 'review resources',
    path: '/admin/unreviewed',
    icon: getIcon(baselineRateReview)
  },
  {
    title: 'review flags',
    path: '/admin/flagged',
    icon: getIcon(bxsFlag)
  }
];

export default sidebarConfig;
