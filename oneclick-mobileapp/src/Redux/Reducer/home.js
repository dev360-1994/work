import actionType from './actionType';

const NewIncident = {
  descripion: '',
  selectedDate: '',
  selectedTime: '',
  selectedSite: '',
  selectedBUNIT: '',
  selectedImpacts: '',
  selectedActivities: ''
}

// Configured initial state for home screen
const initialState = {
  firstName: '',
  lastName: '',
  tenantId: 0,
  email: '',
  languageId: '',
  isMobileUser: false,
  userId: '',
  forgetEmail: '',
  authorizeToken: '',
  signupEmail: '',
  signupPassword: '',
  tenantName: '',
  Incident: NewIncident,
  isIncidentScreenRefresh:false,
  isActionScreenRefresh:false,
  updateRedux:false
};

// Creating home reducer with initial state
export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.Save_User:
      return {
        ...state,
        firstName: action.data["FirstName"],
        lastName: action.data["LastName"],
        tenantId: action.data["TenantId"],
        email: action.data["email"],
        isMobileUser: action.data["IsMobileUser"] == "True" ? true : false,
        userId: action.data["UserId"],
        languageId: action.data["LanguageId"],
      };
    case actionType.Save_AuthToken:
      return {
        ...state,
        authorizeToken: action.data,
      };
    case actionType.SignUp_Email:
      return {
        ...state,
        signupEmail: action.data
      };
    case actionType.SignUp_Password:
      return {
        ...state,
        signupPassword: action.data
      };
    case actionType.Forget_Email:
      return {
        ...state,
        forgetEmail: action.data
      };
    case actionType.SignUp_Details:
      return {
        ...state,
        firstName: action.data[0],
        lastName: action.data[1],
        tenantName: action.data[2],
      };
      case actionType.Change_UserInfo:
        return{
          ...state,
          firstName: action.firstName,
          lastName: action.lastName,
          tenantName: action.tenantName,
          email: action.email,
        }
        case actionType.Save_IsIncidentScreenRefresh:
          debugger;
          return{
            ...state,
            updateRedux:!state.updateRedux,
            isIncidentScreenRefresh: action.data,
          }
          case actionType.Save_IsActionScreenRefresh:
            debugger;
            return{
              ...state,
              updateRedux:!state.updateRedux,
              isActionScreenRefresh: action.data,
            }
    default:
      return state;
  }
};