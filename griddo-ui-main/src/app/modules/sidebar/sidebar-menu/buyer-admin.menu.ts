import { RoleWiseMenu } from "./role-wise-menu";

export const buyerAdmin: RoleWiseMenu = {
  find_replace_from_params: 'projectId',
  heading:'buyer-admin',
  links: [

  ],
  bottomlinks: []
}
export const agencyAdmin: RoleWiseMenu = {
    links: [
      {
        title: 'Dashboard',
        link: '/agency-admin/dashboard',
        icon: 'dashboard',
        exactMatch: false,
        opened: false
      },

      {
        title: 'Projects',
        icon: 'assignment',
        exactMatch: true,
        link: '/agency-admin/projects',
        opened: false,
      },


      // {
      //   title: 'Brokers',
      //   link: '/builder-admin/brokers',
      //   icon: 'people',
      //   exactMatch: false,
      //   opened: false
      // },
      // {
      //   title: 'Worksheets',
      //   link: '/agency-admin/worksheets',
      //   icon: 'message',
      //   exactMatch: false,
      //   opened: false
      // },
      {
        title: 'Agent',
        link: '/agency-admin/agents',
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
      //   link: '/agency-admin',
      //   icon: 'settings',
      //   exactMatch: true,
      //   opened: false
      // },
      // {
      //   title: 'Notifications',
      //   link: '/agency-admin',
      //   icon: 'notifications',
      //   exactMatch: true,
      //   opened: false
      // }
    ]
  }