const path = require('path');

module.exports = {
  distDir: 'build',
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@src'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@styles'] = path.resolve(__dirname, 'styles');
    return config;
  },
  images: {
    domains: ['sl-it-whappeastus-02.azurewebsites.net', 'www.thelasertrader.com'],
  },
  env: {
    APP_SERVER_URL: process.env.APP_SERVER_URL,
    APP_GOOGLE_CAPTCHA_KEY: process.env.APP_GOOGLE_CAPTCHA_KEY,
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  async rewrites() {
    return [
      { source: '/robots.txt', destination: '/api/robots' },
      { source: "/about", destination: "/views/dashboard/about" },

      { source: "/sell", destination: "/views/dashboard/sells" },
      { source: "/sell/listdevice", destination: "/views/dashboard/sells/listdevice" },

      { source: "/products", destination: "/views/dashboard/buys" },
      { source: "/product-details", destination: "/views/dashboard/buys/detailView" },
      { source: "/product-details/:inventoryId", destination: "/views/dashboard/buys/detailView" },
      { source: "/product-comparison", destination: "/views/dashboard/buys/compareView" },
      { source: "/buy-lasers-inventory-search", destination: "/views/dashboard/buys/advancedSearchView" },
      { source: "/product-hotdeal", destination: "/views/dashboard/buys/hotDeal" },
      { source: "/product-daily", destination: "/views/dashboard/buys/dailyArrivals" },

      { source: "/contact-us", destination: "/views/dashboard/contactUs" },
      
      { source: "/service", destination: "/views/dashboard/services" },
      { source: "/service/assuredcertification", destination: "/views/dashboard/services/assuredCertification" },
      { source: "/service/repair", destination: "/views/dashboard/services/repair" },
      { source: "/service/financing", destination: "/views/dashboard/services/financing" },
      { source: "/service/clinical-training", destination: "/views/dashboard/services/clinicaltrain" },
      { source: "/service/practice-development", destination: "/views/dashboard/services/practice" },
      { source: "/service/assuredcertification", destination: "/views/dashboard/services/assuredCertification" },
      { source: "/service/maintenance", destination: "/views/dashboard/services/maintenance" },
      { source: "/service/training-inquiry", destination: "/views/dashboard/services/inquiry" },
      { source: "/service/warranty", destination: "/views/dashboard/services/warranty" },

      { source: "/watchlist", destination: "/views/dashboard/watchList" },
      { source: "/unwatch", destination: "/views/dashboard/watchList/unwatchlist" },

      { source: "/admin/login", destination: "/views/auth/Login" },

      { source: "/admin/activity", destination: "/views/admin/activitys/list" },

      { source: "/admin/contacts", destination: "/views/admin/contacts/list" },
      { source: "/admin/contacts/add", destination: "/views/admin/contacts/add" },
      { source: "/admin/contacts/edit/:id", destination: "/views/admin/contacts/edit" },

      { source: "/admin/products", destination: "/views/admin/products/list" },
      { source: "/admin/products/add", destination: "/views/admin/products/add" },
      { source: "/admin/products/edit/:id", destination: "/views/admin/products/edit" },

      { source: "/admin/warranty", destination: "/views/admin/warranty/list" },
      { source: "/admin/warranty/edit/:id", destination: "/views/admin/warranty/edit" },

      { source: "/admin/inventorys", destination: "/views/admin/inventorys/list" },
      { source: "/admin/inventorys/add", destination: "/views/admin/inventorys/add" },
      { source: "/admin/inventorys/edit/:id", destination: "/views/admin/inventorys/edit" },

      { source: "/admin/reports", destination: "/views/admin/reports/list" },
      { source: "/admin/reports/add", destination: "/views/admin/reports/add" },
      { source: "/admin/reports/edit/:id", destination: "/views/admin/reports/edit" },
    ];
  }
};
