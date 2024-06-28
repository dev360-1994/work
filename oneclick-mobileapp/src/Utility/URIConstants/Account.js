const SIGN_IN = "Account/Login";
const FORGETPASSWORD = "Account/ForgotPassword";
const CHCEKEMAILEXIST = "Account/IsEmailExist";
const EmailVerify = "Account/SendEmailVerificationCode";
const Add_USER = "Account/AddUser";
const MOBILE_SETTINGS = "Account/GetSettingValue";
const USER_DASHBOARD = "DashBoard/HomeIcons";
const INCIDENT_INTIALIZE = "Incident/IncidentInitialize";
const INCIDENT_SITES = "Incident/SeachSites";
const INCIDENT_BUNITS = "Incident/SeachBussinessunits";
const ADD_UPDATE_INCIDENT = "Incident/AddUpdateIncidents";
const INCIDENT_DOCS = "Incident/UploadFile";
const SEARCH_INCIDENT = "Incident/SearchIncident";
const GET_INCIDENT = "Incident/GetIncident";
const DELETE_DOCUMENT = "Incident/DeleteDocument";
const SEARCH_ACTION = "Action/GetActions";
const GET_CHILDBUSINESSUNITS = "Action/GetChildBusinessUnits";
const GET_CHILDSITES = "Action/GetChildSites";
const INCIDENT_CLOSED = "Incident/CloseIncident";
const IMPACT_DETAILS_DATA ="Incident/IncidentImapctData";
const ADD_UPDATE_IMPACT = "Incident/UpdateIncidentImpact";
const ACTION_LIST = "Action/ActionsList";
const ACTION_DATA = "Action/ActionData";
const GET_ACTION = "Action/GetAction";
const SEARCH_USER="Action/SearchUsers";
const ADD_ACTION="Action/AddAction";
const ADD_UPDATE_ACTIONPROGRESS="Action/UpdateActionProgress"
const GET_ADDITIONAL_DETAIL = "Incident/GetAdditionalDetail";
const ADD_ADDITIONAL_DETAIL ="Incident/AddUpdateAdditionalDetail";
const GET_INVOLVED_PERSONS ="Incident/GetInvolvedPersonList";
const GET__INVOLVED_PERSON_ROLES ="Incident/GetInvolvedPersonRoles";
const ADD_INVOLVED_PERSONS ="Incident/AddUpdateInvolvedPerson";
const SAVEVENDOR ="Incident/SaveVendor";
const INVESTIGATION_DATA = "Incident/InvestigationData";
const ADD_UPDATE_INVESTIGATION = "Incident/AddUpdateInvestigation";
const INJURYANDILLNESSUSER_LIST = "Incident/InjuryIllnessUserList";
const INJURYANDILLNESS_INTIALIZE = "Incident/InjuryIllnessData";
const GET_INJURYANDILLNESS = "Incident/GetInjuryIllness";
const ADD_UPDATE_INJURYANDILLNESS ="Incident/AddUpdateInjuryIllness"
const DELETE_INJURYANDILLNESSUSER ="Incident/DeleteInjuredUserDetail"
const EXPORT_EXCEL ="Incident/ExportExcel"
const ACTION_EXPORT_EXCEL ="Action/GetActionsExcel"
const CHANGE_PASSWORD ="Setting/ResetPassword"
const UPDATE_TENANT="Setting/UpdateTenant"
const UPDATE_MOBILE_USER="Setting/UpdateMobileUser"
const GET_USER_DETAILS="Setting/GetUserDetails"
const Delete_Account="Setting/DeleteAccount"
const GET_CLUSTER_MAP_INCIDENTS="Incident/GetClusterMapIncidents"
const GET_DASHBOARD_DATA = "DashBoard/GetDashboardData";
const Save_Error_Log= "Setting/SaveErrorLog";
const Get_Open_Action_Overdue= "Action/GetOpenActionOverdue"




export default {
   SIGN_IN, FORGETPASSWORD, EmailVerify, CHCEKEMAILEXIST, Add_USER, USER_DASHBOARD, MOBILE_SETTINGS, INCIDENT_INTIALIZE,
   INCIDENT_SITES, INCIDENT_BUNITS, ADD_UPDATE_INCIDENT, INCIDENT_DOCS, SEARCH_INCIDENT,DELETE_DOCUMENT, GET_INCIDENT,SEARCH_ACTION 
   ,INCIDENT_CLOSED ,IMPACT_DETAILS_DATA ,ADD_UPDATE_IMPACT,ACTION_LIST ,ACTION_DATA,GET_ACTION,SEARCH_USER,ADD_ACTION,
   GET_CHILDBUSINESSUNITS,GET_CHILDSITES ,ADD_UPDATE_ACTIONPROGRESS,GET_ADDITIONAL_DETAIL ,ADD_ADDITIONAL_DETAIL,
   GET_INVOLVED_PERSONS,GET__INVOLVED_PERSON_ROLES,ADD_INVOLVED_PERSONS,SAVEVENDOR,INVESTIGATION_DATA,ADD_UPDATE_INVESTIGATION ,
   INJURYANDILLNESSUSER_LIST ,INJURYANDILLNESS_INTIALIZE,GET_INJURYANDILLNESS,ADD_UPDATE_INJURYANDILLNESS ,
   DELETE_INJURYANDILLNESSUSER,EXPORT_EXCEL,ACTION_EXPORT_EXCEL,CHANGE_PASSWORD,UPDATE_TENANT,UPDATE_MOBILE_USER,GET_USER_DETAILS,Delete_Account,
   GET_CLUSTER_MAP_INCIDENTS,GET_DASHBOARD_DATA ,Save_Error_Log,Get_Open_Action_Overdue
}