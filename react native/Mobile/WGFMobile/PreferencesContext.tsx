import React from 'react';
import { getSession } from './services/common/Session';
import { SessionInfoModel } from './services/Model/SessionInfoModel';


function getUserContext()
{
  getSession().then((value) => {
    return value;
  });
  return new SessionInfoModel;
}

const defaultPreferenceState = {
  userContext: getUserContext(),
  updateUserContext: (context: SessionInfoModel) => {},
};

export const PreferencesContext = React.createContext(defaultPreferenceState);

// export const PreferencesContext = React.createContext({
//   // toggleTheme: () => {},
//   // isThemeDark: false,
//   updateUserContext: (context: ContextModel) => {},
//   userContext: new ContextModel(),
// });


