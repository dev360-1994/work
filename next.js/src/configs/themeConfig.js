/* eslint-disable global-require */
// You can customize the template with the help of this file

// Template config options
const themeConfig = {
  app: {
    appName: 'Laser Trader',
    appLogoImage: require('@src/assets/images/logos/logo.png').default,
    appLogoAdminImage: require('@src/assets/images/logos/logo-admin.png').default,
  },
  layout: {
    isRTL: false,
    skin: 'light', // light, dark, bordered, semi-dark
    routerTransition: 'none', // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: localStorage.getItem('layoutType', 'horizontal'), // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: false,
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'sticky', // static , sticky , floating, hidden
      backgroundColor: 'white', // BS color options [primary, success, etc]
    },
    footer: {
      type: 'static', // static, sticky, hidden
    },
    customizer: false,
    scrollTop: false, // Enable scroll to top button
  },
};

export default themeConfig;
