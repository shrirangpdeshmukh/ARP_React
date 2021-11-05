import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';
import baselineRateReview from '@iconify/icons-ic/baseline-rate-review';
// import bxsFlag from '@iconify/icons-bx/bxs-flag';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'user',
    path: '/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'upload',
    path: '/upload',
    icon: getIcon(cloudUploadFill)
  },
  {
    title: 'product',
    path: '/products',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'blog',
    path: '/blog',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon(personAddFill)
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon(alertTriangleFill)
  },
  {
    title: 'Review Resources',
    path: '/admin/unreviewed',
    icon: getIcon(baselineRateReview)
  }
  // {
  //   title: 'Review Flags',
  //   path: '/admin/flagged',
  //   icon: getIcon(bxsFlag)
  // }
];

export default sidebarConfig;
