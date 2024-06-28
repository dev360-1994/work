import { RoleWiseMenu } from "./role-wise-menu";

export const agentAdmin: RoleWiseMenu = {
  links: [
    {
      title: 'Dashboard',
      link: '/griddo-master/dashboard',
      icon: 'dashboard',
      exactMatch: false,
      opened: false
    },
    // {
    //   title: 'Users',
    //   icon: 'people',
    //   exactMatch: false,
    //   opened: false,
    //   items: [{
    //     title: 'Builder',
    //     link: '/agent-admin/builders',
    //     exactMatch: false
    //   },
    //   {
    //     title: 'Agents',
    //     link: '/agent-admin/agents',
    //     exactMatch: false,
    //   }, {
    //     title: 'Worksheet',
    //     link: '/agent-admin/worksheets',
    //     exactMatch: false,
    //   }]
    // },
    {
      title: 'Worksheet',
      link: '/agent-admin/worksheets',
      icon: 'dashboard',
      exactMatch: false,
      opened: false
    },
    {
      title: 'Projects',
      link: '/agent-admin/projects',
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