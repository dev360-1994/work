/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
//import 'react-native-gesture-handler';
import { FontAwesome, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useRoute, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import * as React from 'react';
import { ColorSchemeName, Pressable, StatusBar, Text } from 'react-native';
import { getSession, setSession } from "../services/common/Session";

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/Account/SignInScreen';
import ForgotPasswordScreen from '../screens/Account/ForgotPasswordScreen';


import DashboardScreen from '../screens/DashboardScreen';
import AboutScreen from '../screens/AboutScreen';

import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps, RootDrawerParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import DrawerComponent from './DrawerComponent';
import VideosScreen from '../screens/Film/Clips/VideoScreen';
import ClipsScreen from '../screens/Film/Clips/ClipsScreen';
import RecentPlaylistScreen from '../screens/Film/RecentPlaylistScreen';
import FavoritePlaylistScreen from '../screens/Film/FavoritePlaylistScreen';
import CurrentPlaylistScreen from '../screens/Film/CurrentPlaylistScreen';
import AllPlaylistScreen from '../screens/Film/AllPlaylistScreen';
import TrainingPlaylistScreen from '../screens/Film/TrainingPlaylistScreen';
import OtherPlaylistScreen from '../screens/Film/OtherPlaylistScreen';
import { PlaylistContext } from '../screens/Film/Component/PlaylistContext';
import { preferencesContext } from '../screens/PreferenceHelper';
import { Button, Menu, Title, useTheme } from 'react-native-paper';
import VideoRecorderScreen from '../screens/videoRecorder';
import ProfileScreen from '../screens/SettingsScreen';
import { VideoRecorderModal } from '../screens/Film/VideoRecorderModal';
import Svg, { Circle } from 'react-native-svg';
import CreateFilmScreen from '../screens/Film/CreateFilm/CreateFilmScreen';
import UploadFromDevice from '../screens/Film/CreateFilm/UploadFromDevice';
import GoogleDriveUpload from '../screens/Film/CreateFilm/GoogleDriveUpload';
import TransferFromHudl from '../screens/Film/CreateFilm/TransferFromHudl';
import CreateFilmModalScreen from '../screens/Film/CreateFilm/CreateFilmModalScreen';
import { getSecurityData, teamUserLayoutAction } from '../services/SecurityService';
import TeamDetailsScreen from '../screens/Settings/TeamDetailsScreen';
import HistoryScreen from '../screens/Settings/HistoryScreen';
import UsersScreen from '../screens/Settings/UsersScreen';
import { AddTeamUser } from '../screens/Settings/AddTeamUser';
//import VideoRecorderScreen from '../screens/VideoRecorder';
import { EditTeamUser } from '../screens/Settings/EditTeamUser';
import { TeamUserSecurity } from '../services/Model/TeamUserSecurity';
import EditFilmScreen from '../screens/Film/Clips/EditFilmScreen';
import InboxScreen from '../screens/Exchange/InboxScreen';
import CheckInScreen from '../screens/Exchange/CheckInScreen';
import CheckOutScreen from '../screens/Exchange/CheckOutScreen';
import LeagueScreen from '../screens/Exchange/LeagueScreen';
import TeamsScreen from '../screens/Exchange/TeamsScreen';
import OpenScreen from '../screens/Exchange/OpenScreen';
import ExchangeHistoryScreen from '../screens/Exchange/ExchangeHistoryScreen';
import CheckInForm from '../screens/Exchange/Component/FormComponent/CheckInForm';
import CheckOutForm from '../screens/Exchange/Component/FormComponent/CheckOutForm';
import LeagueForm from '../screens/Exchange/Component/FormComponent/LeagueForm';
import TeamForm from '../screens/Exchange/Component/FormComponent/TeamForm';
import OpenForm from '../screens/Exchange/Component/FormComponent/OpenForm';
import { getUserTeams } from '../services/DashboardService';
import { TeamModel } from '../services/Model/TeamModel';
import InboxForm from '../screens/Exchange/Component/FormComponent/InboxForm';
import SecurityScreen from '../screens/Settings/SecurityScreen';
import { Paymentcreen } from '../screens/Settings/PaymentScreen';
import UploadFromDeviceForViewFilmScreen from '../screens/Film/Clips/UploadFromDeviceForViewFilmScreen';
import { getTeamInfo } from '../services/UserService';
import { Ionicons } from "@expo/vector-icons";
import ContactLeagueTeam from '../screens/Exchange/Component/ContactLeagueTeam';

const sessionData = getSession();



export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 *
 *
 */

function getHeaderTitle(route: any) {
  const title = route["params"]["params"]["title"];
  return title;
}


const Stack = createNativeStackNavigator<RootStackParamList>();


function RootNavigator() {
  const { userContext } = preferencesContext();
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
  const [menuVisible, setMenuVisible] = React.useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false, title: 'Sign In' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: "Forgot Password" }} />
      <Stack.Screen name="Root" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name='RecordGame' component={VideoRecorderModal}
        options={{
          headerShown: false,
          orientation: 'default', title: "Record Film", headerTitleStyle: { color: "white" }, headerStyle: {
            backgroundColor: userTeamColor,
          }

        }} />
      {/* <Stack.Screen name='RecordGame' component={VideoRecorderModal} options={{ headerShown: false }} /> */}

      {/* <Stack.Screen name='CreateFilmModal' component={CreateFilmModalScreen} options={{
        orientation: 'default', title: "Record Film", headerTitleStyle: { color: "white" }, headerStyle: {
          backgroundColor: userTeamColor, headerTitleStyle: { fontWeight: 'bold' },
        }

      }} /> */}
      {/* <Stack.Screen name='CreateFilmModal' component={CreateFilmModalScreen} options={({ route }) => ({
        headerShown: true, headerStyle: {
          backgroundColor: userTeamColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })} /> */}




      <Stack.Screen name="ViewFilm" component={ViewFilmTabs} options={({ route }) => ({
        headerShown: true, headerTitle: getHeaderTitle(route), headerStyle: {
          backgroundColor: userTeamColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })} />

      <Stack.Screen name="EditViewFilm" component={EditFilmScreen} options={{ title: 'Edit Properties' }} />
      <Stack.Screen name="UploadFromDeviceForViewFilm" component={UploadFromDeviceForViewFilmScreen} options={{ title: 'Add Video Clips' }} />

      {/* <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} /> */}
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />


      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
        {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: "Forgot Password" }} /> */}
      </Stack.Group>
    </Stack.Navigator>
  );
}


const Tab = createMaterialTopTabNavigator();

function ViewFilmTabs({ route }: { route: any }) {
  const { userContext } = preferencesContext();
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
  return (
    <PlaylistContext.Provider value={route.params}>
      <Tab.Navigator screenOptions={
        {

          tabBarIndicatorStyle: { backgroundColor: userTeamColor }
        }
      }
      >
        <Tab.Screen name="VIDEO" component={VideosScreen} />
        <Tab.Screen name="CLIPS" component={ClipsScreen} />
      </Tab.Navigator>
    </PlaylistContext.Provider >
  );

}

function ViewPlaylistTabs() {

  const { userContext } = preferencesContext();
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
  const [current, setCurrent] = React.useState<boolean>(false);
  const [all, setAll] = React.useState(false);
  const [training, setTraining] = React.useState(false);
  const [other, setOther] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  async function getVisible() {

    const cur: TeamUserSecurity = await teamUserLayoutAction(userContext.userInfo.teamId, userContext.userInfo.userId, "seasons_current");
    const all: TeamUserSecurity = await teamUserLayoutAction(userContext.userInfo.teamId, userContext.userInfo.userId, "seasons_all");
    const train: TeamUserSecurity = await teamUserLayoutAction(userContext.userInfo.teamId, userContext.userInfo.userId, "film_training");
    const other: TeamUserSecurity = await teamUserLayoutAction(userContext.userInfo.teamId, userContext.userInfo.userId, "film_other");

    setCurrent(cur.value);
    setAll(all.value);
    setTraining(train.value);
    setOther(other.value);

  }
  //setIsSubmitting(true);
  getVisible();

  return (
    < Tab.Navigator screenOptions={
      { tabBarIndicatorStyle: { backgroundColor: userTeamColor } }
    }
    >
      <Tab.Screen name="Recent" component={RecentPlaylistScreen} options={
        {
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar" size={22} color={color} />
          ),
          tabBarShowLabel: false,
          // tabBarStyle:{width:0}
        }

      } />
      <Tab.Screen name="Favorite" component={FavoritePlaylistScreen} options={
        {
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-heart" size={22} color={color} />
          ),
          tabBarShowLabel: false,
        }
      } />
      {
        current &&
        <Tab.Screen name="Current" component={CurrentPlaylistScreen} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-range" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }

      {
        all &&
        <Tab.Screen name="All" component={AllPlaylistScreen} options={

          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-month" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }

      {
        training &&
        <Tab.Screen name="Training" component={TrainingPlaylistScreen} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-account" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }

      {
        other &&
        <Tab.Screen name="Other" component={OtherPlaylistScreen} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-question" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }

    </Tab.Navigator >
  );
}

function ExchangeFilm() {
  return <Stack.Navigator screenOptions={{ headerShown: false, }} >
    <Stack.Screen name="ExchangeFilmTab" component={ExchangeFilmTabs} />
    <Stack.Screen name="ExchangeHistory" component={ExchangeHistoryScreen} />
    <Stack.Screen name="ContactLeagueTeam" component={ContactLeagueTeam} />
    <Stack.Screen name="CheckInForm" component={CheckInForm} />
    <Stack.Screen name="CheckOutForm" component={CheckOutForm} />
    <Stack.Screen name="LeagueForm" component={LeagueForm} />
    <Stack.Screen name="TeamForm" component={TeamForm} />
    <Stack.Screen name="OpenForm" component={OpenForm} />
    <Stack.Screen name="InboxForm" component={InboxForm} />
  </Stack.Navigator>
}

function ExchangeFilmTabs() {
  const { userContext } = preferencesContext();
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
  const [checkInVisible, setCheckInVisible] = React.useState(true);
  const [checkOutVisible, setCheckOutVisible] = React.useState(true);
  const [leagueVisible, setLeagueVisible] = React.useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const closeMenu = () => setMenuVisible(false);
  const openMenu = () => setMenuVisible(true);


  async function setLeagueVisibility() {
    var userId = userContext.userInfo.userId;
    var teamId = userContext.userInfo.teamId;
    var result = await getTeamInfo(teamId, userId);
    if (result?.isleague == 0) {
      setCheckInVisible(false);
      setCheckOutVisible(false);
      setLeagueVisible(false);
    } else if (result?.isleague == 1) {
      if (result?.islocker == 0) {
        setCheckInVisible(false);
        setCheckOutVisible(false);
        setLeagueVisible(true);
      } else if (result.islocker == 1) {
        setCheckInVisible(true);
        setCheckOutVisible(true);
        setLeagueVisible(false);
      }
    }
  }

  setLeagueVisibility();

  return (
    <Tab.Navigator screenOptions={
      {
        tabBarIndicatorStyle: { backgroundColor: userTeamColor },

      }
    }
    >

      <Tab.Screen name="Inbox" component={InboxScreen} options={
        {
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="tray-full" size={22} color={color} />
          ),
          tabBarShowLabel: false,
          // tabBarStyle:{width:0}
        }

      } />
      {
        checkInVisible &&
        <Tab.Screen name="Locker In" component={CheckInScreen} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="sticker-plus-outline" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }

      {
        checkOutVisible &&
        <Tab.Screen name="Locker Out" component={CheckOutScreen} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="sticker-check-outline" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }
      {
        leagueVisible &&
        <Tab.Screen name="League" component={LeagueScreen} options={

          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-multiple" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }

      {

        <Tab.Screen name="Team" component={TeamsScreen} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }
      {

        <Tab.Screen name="Open" component={OpenScreen} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="link" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />


      }

      {false &&
        <Tab.Screen name="ExchangeH" component={ExchangeHistoryScreen} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="history" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }

      {false &&
        <Tab.Screen name="ContactLeagueTeam" component={ContactLeagueTeam} options={
          {
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="history" size={22} color={color} />
            ),
            tabBarShowLabel: false,
          }
        } />
      }

    </Tab.Navigator>
  );
}


function RecordVideoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }} >
      <Stack.Screen name="VideoRecord" component={VideoRecorderScreen} />
      <Stack.Screen name='RecorderTemp' component={VideoRecorderModal} options={{ orientation: 'default' }} />
    </Stack.Navigator >
  );
}
function CreateFilmStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }} >
      <Stack.Screen name="AddFilmHome" component={CreateFilmScreen} />
      <Stack.Screen name='UploadFromDevice' component={UploadFromDevice} />
      <Stack.Screen name='GoogleDriveUpload' component={GoogleDriveUpload} />
      <Stack.Screen name='TranferFromHudl' component={TransferFromHudl} />
      <Stack.Screen name="VideoRecord" component={VideoRecorderScreen} />
      <Stack.Screen name='CreateFilmModal' component={CreateFilmModalScreen} />
    </Stack.Navigator >
  );
}

function UsersScreenStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, }} >
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen name="AddTeamUser" component={AddTeamUser} />
      <Stack.Screen name="EditTeamUser" component={EditTeamUser} />
    </Stack.Navigator>
  )
}

function getUserRole(roleId: any) {
  let userRole = "";
  switch (roleId) {
    case 0:
      userRole = "Owner";
      break;
    case 1:
      userRole = "Administrator";
      break;
    case 2:
      userRole = "Coach";
      break;
    case 3:
      userRole = "Athlete";
      break;
    case 4:
      userRole = "Parent";
      break;
    case 5:
      userRole = "Referee";
      break;
    case 6:
      userRole = "Media";
      break;
    case 7:
      userRole = "Member";
      break;
  }
  return userRole;
}

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function DrawerNavigator() {
  const colorScheme = useColorScheme();
  const { userContext } = preferencesContext();
  const theme = useTheme();
  const [isDrawerVisible, setIsDrawerVisible] = React.useState(true);
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
  const [teamName, setTeamName] = React.useState("Updated Team New");
  const [roleId, setRoleId] = React.useState(-1);

  async function getValue() {
    const result: TeamUserSecurity = await teamUserLayoutAction(userContext.userInfo.teamId, userContext.userInfo.userId, "film_upload");
    setIsDrawerVisible(result.value);
    setRoleId(userContext.userInfo.userRole);
    if (userContext?.userInfo?.userId) {
      let responseUserTeams = await getUserTeams(userContext.userInfo.userId);
      if (responseUserTeams) {
        let result: TeamModel[] = JSON.parse(JSON.stringify(responseUserTeams));
        let name = result.filter(c => c.teamId === userContext.userInfo.teamId)[0];
        setTeamName(name.teamName);
      }
    }
  }
  getValue();

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props}
      teamName={teamName} security={isDrawerVisible} roleId={roleId} />}
      screenOptions={{
        drawerActiveBackgroundColor: userTeamColor,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: theme.colors.text,
        drawerLabelStyle: { marginLeft: -21, fontSize: 15, },
        unmountOnBlur: true,
      }}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={
        {
          drawerIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
          title: "Dashboard",
          headerStyle: {
            backgroundColor: userTeamColor,

          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

        }
      } />
      <Drawer.Screen name="About" component={AboutScreen} options={
        {
          drawerIcon: ({ color }) => (
            <Feather name="info" size={22} color={color} />
          ),
          title: "About",
          headerStyle: {
            backgroundColor: userTeamColor,

          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerItemStyle: { height: 0 }

        }
      } />
      <Drawer.Screen name="ViewPlaylist" component={ViewPlaylistTabs} options={
        {
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="playlist-play" size={22} color={color} />
          ),
          title: "View Film",
          headerStyle: {
            backgroundColor: userTeamColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
      } />

      <Drawer.Screen name="ExchangeFilm" component={ExchangeFilm} options={
        {
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="swap-horizontal-variant" size={22} color={color} />
          ),
          title: "Exchange Film",
          headerStyle: {
            backgroundColor: userTeamColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
      } />

      {
        isDrawerVisible &&
        <Drawer.Screen name='Record Game' component={RecordVideoStack}
          options={
            {
              drawerIcon: ({ color }) => (
                // <MaterialCommunityIcons name="record" size={22} color={color} />
                <MaterialIcons name="fiber-manual-record" size={22} color={color} />
              ),
              title: "Record Film",
              headerStyle: {
                backgroundColor: userTeamColor,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }
          }

        />

      }

      {/* <Drawer.Screen name="RecordGame" component={VideoRecorderModal} options={
        {
          drawerIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
          title: "Record Film",
          headerStyle: {
            backgroundColor: userTeamColor,

          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
      } /> */}

      {
        isDrawerVisible &&
        <Drawer.Screen name="CreateFilmModal" component={CreateFilmModalScreen} options={
          {
            drawerIcon: ({ color }) => (
              <Feather name="user" size={22} color={color} />
            ),
            title: "Record Film",
            headerStyle: {
              backgroundColor: userTeamColor,

            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }
        } />}
      {
        isDrawerVisible &&
        <Drawer.Screen name="AddFilm" component={CreateFilmStack} options={
          {
            drawerIcon: ({ color }) => (
              <Feather name="plus" size={22} color={color} />
            ),
            title: "Add Film",
            headerStyle: {
              backgroundColor: userTeamColor,

            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            // drawerItemStyle: { height: 0 }
          }
        } />
      }

      <Drawer.Screen name="Profile" component={ProfileScreen} options={
        {
          drawerIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
          title: "Profile",
          headerStyle: {
            backgroundColor: userTeamColor,

          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
      } />

      <Drawer.Screen name="UsersScreen" component={UsersScreenStack} options={
        {
          drawerIcon: ({ color }) => (
            <Feather name="users" size={22} color={color} />
          ),
          title: "Users",
          headerStyle: {
            backgroundColor: userTeamColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // drawerItemStyle: { height: 0 }
        }
      } />

      <Drawer.Screen name="SecurityScreen" component={SecurityScreen} options={
        {
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="shield-account-outline" size={22} color={color} />
          ),
          title: "Security",
          headerStyle: {
            backgroundColor: userTeamColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerItemStyle: { height: 0 }
        }
      } />

      <Drawer.Screen name="TeamDetails" component={TeamDetailsScreen} options={
        {
          drawerIcon: ({ color }) => (
            <Feather name="settings" size={22} color={color} />
          ),
          title: "Team Details",
          headerStyle: {
            backgroundColor: userTeamColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // drawerItemStyle: { height: 0 }
        }
      } />

      <Drawer.Screen name="History" component={HistoryScreen} options={
        {
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" size={22} color={color} />
          ),
          title: "History",
          headerStyle: {
            backgroundColor: userTeamColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // drawerItemStyle: { height: 0 }
        }
      } />

      <Drawer.Screen name="Payment" component={Paymentcreen} options={
        {
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" size={22} color={color} />
          ),
          title: "Payment",
          headerStyle: {
            backgroundColor: userTeamColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // drawerItemStyle: { height: 0 }
        }
      } />


    </Drawer.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
