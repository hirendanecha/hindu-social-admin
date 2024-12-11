import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },
  {
    name: 'Community',
    url: '/community',
    iconComponent: { name: 'cil-bookmark' },
  },
  {
    name: 'Pages',
    url: '/pages',
    iconComponent: { name: 'cil-layers' },
  },
  {
    name: 'News Feed',
    url: '/newsfeed',
    iconComponent: { name: 'cil-notes' },
  },
  {
    name: 'Research',
    url: '/research',
    iconComponent: { name: 'cil-control' },
  },
  // {
  //   name: 'Post List',
  //   url: '/post-list',
  //   iconComponent: { name: 'cil-basket' },
  // },
  // {
  //   name: 'Community Post List',
  //   url: '/community-post',
  //   iconComponent: { name: 'cil-library' },
  // },
  {
    name: 'Search End User',
    url: '/user',
    iconComponent: { name: 'cil-user' },
  },
  {
    name: 'Marketing page',
    url: '/marketing',
    iconComponent: { name: 'cil-https' },
  },
  {
    name: 'FT Channels',
    url: '/channels',
    iconComponent: { name: 'cil-screen-desktop' },
  },
  {
    name: 'Support ticket page',
    url: '/report-bugs',
    iconComponent: { name: 'cil-list' },
  },
  {
    name: 'Advertisement page',
    url: '/advertisements',
    iconComponent: { name: 'cil-playlist-add' },
  },
];
