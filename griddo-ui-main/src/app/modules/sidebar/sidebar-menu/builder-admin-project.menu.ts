import { RoleWiseMenu } from "./role-wise-menu";

export const builderAdminProjectMenu: RoleWiseMenu = {
  find_replace_from_params: 'projectId',
  heading: 'project',
  links: [
    {
      title: 'Project Sales Grid',
      link: '/builder-admin/projects/${projectId}/sales-grid',
      icon: 'dashboard',
      exactMatch: true,
      opened: false,
    },
    // {
    //   title: 'Projects',
    //   icon: 'assignment',
    //   exactMatch: true,
    //   opened: false,
    //   items: [{
    //     title: 'Lake View',
    //     link: '/builder-admin/projects/${projectId}/Projects',
    //     exactMatch: true
    //   }]
    // },
    {
      title: 'Brokers',
      link: '/builder-admin/projects/${projectId}/brokers',
      icon: 'people',
      exactMatch: true,
      opened: false
    },
    {
      title: 'Worksheets',
      link: '/builder-admin/projects/${projectId}/worksheets',
      icon: 'message',
      exactMatch: true,
      opened: false
    },
    {
      title: 'Deals',
      link: '/builder-admin/projects/${projectId}/deals',
      icon: 'message',
      exactMatch: true,
      opened: false
    }
    // {
    //   title: 'My Subscriptions',
    //   link: '/builder-admin/projects/${projectId}/my-subscriptions',
    //   icon: 'message',
    //   exactMatch: true,
    //   opened: false
    // }
  ],
  bottomlinks: [
    {
      title: 'Back',
      link: '/builder-admin/dashboard',
      icon: 'arrow_back',
      exactMatch: true,
      opened: false
    },
    // {
    //   title: 'Project Settings',
    //   link: '/builder-admin/projects/${projectId}',
    //   icon: 'settings',
    //   exactMatch: true,
    //   opened: false
    // },
    // {
    //   title: 'Notifications',
    //   link: '/builder-admin/projects/${projectId}',
    //   icon: 'notifications',
    //   exactMatch: true,
    //   opened: false
    // }
  ]
}