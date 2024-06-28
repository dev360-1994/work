// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'dev',
  api: 'https://localhost:5001/api/',
  superAdminDashboard:'https://dev.pentaho.griddo.co:8443/pentaho/api/repos/%3Ahome%3AGriddoDashboard%3AGriddoSuperAdminDashboard.wcdf/generatedContent?ts=1651684487807&userid=griddo_user&password=griddo@04052022',
  builderDashboard:'https://dev.pentaho.griddo.co:8443/pentaho/api/repos/%3Ahome%3AGriddoDashboard%3ABuilderDashboard.wcdf/generatedContent?ts=1651684487807&userid=griddo_user&password=griddo@04052022',
  agentDashboard:'https://dev.pentaho.griddo.co:8443/pentaho/api/repos/%3Ahome%3AGriddoDashboard%3AProjectAgentDashboard.wcdf/generatedContent?ts=1651684807652&userid=griddo_user&password=griddo@04052022'
};
// export const environment = {
//   production: false,
//   api: 'https://localhost:5001/api/'
// };
 

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

 