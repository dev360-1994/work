import { createDrawerNavigator ,createStackNavigator } from 'react-navigation'
import HomeScreen from '../Screens/HomeScreen';
import Navigation from './Navigation'
import NewIncidentScreen from '../Screens/Incidents/NewIncidentScreen';
import SearchIncidentScreen from '../Screens/Incidents/SearchIncidentScreen';
import SearchActionScreen from '../Screens/Actions/SearchActionScreen';
import ImpactDetailScreen from '../Screens/Incidents/ImpactDetailScreen';
import ActionlistScreen from '../Screens/Incidents/ActionlistScreen';
import ActionDetailScreen from '../Screens/Incidents/ActionDetailScreen';
import AdditionalDetailScreen from '../Screens/Incidents/AdditionalDetailScreen';
import PeopleListScreen from '../Screens/Incidents/PeopleListScreen';
import AddPeopleScreen from '../Screens/Incidents/AddPeopleScreen';
import InvestigationDetailScreen from '../Screens/Incidents/InvestigationDetailScreen';
import InjuryAndIllnessDetailScreen from '../Screens/Incidents/InjuryAndIllnessDetailScreen';
import ChangePasswordScreen from '../Screens/ChangePassword';
import SettingScreen from '../Screens/Setting';
import DashboardScreen from '../Screens/Dashboard'
const Stack = createStackNavigator(
  {
    Incident: { screen: NewIncidentScreen },
    ImpactDetail :{screen:ImpactDetailScreen},
    Actionlist: { screen: ActionlistScreen },
    AdditionalDetail:{ screen: AdditionalDetailScreen},
    PeopleList: { screen: PeopleListScreen },
    AddPeople: { screen: AddPeopleScreen },
    InvestigationDetail: { screen: InvestigationDetailScreen },
    InjuryAndIllnessDetail: { screen: InjuryAndIllnessDetailScreen },
    ChangePassword: { screen: ChangePasswordScreen },
  },
  {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
}
);
const AppNavigator = createDrawerNavigator({
  Home: { screen: HomeScreen },
  ActionDetail: { screen: ActionDetailScreen, navigationOptions: { drawerLabel: () => null }, },
  Incident: { screen: Stack, },
  "Search Incident": { screen: SearchIncidentScreen },
  "Action Search": { screen: SearchActionScreen },
  Action: { screen: ActionDetailScreen },
  Setting:{screen:SettingScreen},
  ChangePassword: { screen: ChangePasswordScreen ,navigationOptions: { drawerLabel: () => null }, },
  DashBoard:{screen:DashboardScreen}


}, { contentComponent: Navigation });
export default AppNavigator;