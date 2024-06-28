import { RoleWiseMenu } from "./role-wise-menu";

export const griddoMaster: RoleWiseMenu = {
  links: [
    {
      title: 'Dashboard',
      link: '/griddo-master/dashboard',
      icon: 'dashboard',
      exactMatch: false,
      opened: false
    },
    {
      title: 'Users',
      icon: 'people',
      exactMatch: false,
      opened: false,
      items: [{
        title: 'Builder',
        link: '/griddo-master/builders',
        exactMatch: false
      },{
        title: 'Agency',
        link: '/griddo-master/listing-agency',
        exactMatch: false,
      },
      {
        title: 'Agents',
        link: '/griddo-master/agents',
        exactMatch: false,
      },
      ]
    },
    {
      title: 'Projects',
      link: '/griddo-master/projects',
      icon: 'message',
      exactMatch: false,
      opened: false
    },
    // {
    //   title: 'Subscriptions',
    //   link: '/griddo-master/subscriptions',
    //   icon: 'message',
    //   exactMatch: false,
    //   opened: false
    // }
  ],
  bottomlinks: [
    // {
    //   title: 'Main Settings',
    //   link: '/griddo-master/dashboard',
    //   icon: 'settings',
    //   exactMatch: false,
    //   opened: false
    // },
    // {
    //   title: 'Notifications',
    //   link: '/griddo-master/subscriptions',
    //   icon: 'notifications',
    //   exactMatch: false,
    //   opened: false
    // }
  ]
}