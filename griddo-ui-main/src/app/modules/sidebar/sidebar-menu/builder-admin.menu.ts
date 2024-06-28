import { RoleWiseMenu } from "./role-wise-menu";

export const builderAdmin: RoleWiseMenu = {
  links: [
    {
      title: 'Dashboard',
      link: '/builder-admin/dashboard',
      icon: 'dashboard',
      exactMatch: false,
      opened: false
    },
    {
      title: 'Projects',
      icon: 'assignment',
      exactMatch: true,
      link: '/builder-admin/projects',
      opened: false,
      // items: [{
      //   title: 'Lake View',
      //   link: '/builder-admin/projects',
      //   exactMatch: false
      // }]
    },
    // {
    //   title: 'Brokers',
    //   link: '/builder-admin/brokers',
    //   icon: 'people',
    //   exactMatch: false,
    //   opened: false
    // },
    {
      title: 'Agents',
      link: '/builder-admin/agents',
      icon: 'message',
      exactMatch: false,
      opened: false
    },
    {
      title: 'Agency',
      link: '/builder-admin/agency',
      icon: 'message',
      exactMatch: false,
      opened: false
    },
    {
      title: 'Worksheets',
      link: '/builder-admin/worksheets',
      icon: 'message',
      exactMatch: false,
      opened: false
    },
    {
      title: 'Deals',
      link: '/builder-admin/deals',
      icon: 'message',
      exactMatch: false,
      opened: false
    },
    // {
    //   title: 'My Subscriptions',
    //   link: '/builder-admin/my-subscriptions',
    //   icon: 'message',
    //   exactMatch: false,
    //   opened: false
    // }
  ],
  bottomlinks: [
    // {
    //   title: 'Main Settings',
    //   link: '/builder-admin',
    //   icon: 'settings',
    //   exactMatch: true,
    //   opened: false
    // },
    // {
    //   title: 'Notifications',
    //   link: '/builder-admin',
    //   icon: 'notifications',
    //   exactMatch: true,
    //   opened: false
    // }
  ]
}