/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
//import 'react-native-gesture-handler';
import { FontAwesome, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
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
import ViewPlaylistScreen from '../screens/Film/x__ViewPlaylistScreen_NIU';
import ViewFilmScreen from '../screens/Film/Clips/x__ViewFilmScreen_NIU';

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
import { VideoRecorderModal } from '../screens/Film/CameraModal';
import Svg, { Circle } from 'react-native-svg';
import CreateFilmScreen from '../screens/Film/CreateFilm/CreateFilmScreen';
import UploadFromDevice from '../screens/Film/CreateFilm/UploadFromDevice';
import GoogleDriveUpload from '../screens/Film/CreateFilm/GoogleDriveUpload';
import TransferFromHudl from '../screens/Film/CreateFilm/TransferFromHudl';
import CreateFilmModalScreen from '../screens/Film/CreateFilm/CreateFilmModalScreen';
import { getSecurityData } from '../services/SecurityService';
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
  // console.log(title);
  return title;
}

function videoClipsHeaderRight() {

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
      <Stack.Screen name='RecordGame' component={VideoRecorderModal} options={{
        orientation: 'default', title: "Record Game", headerTitleStyle: { color: "white" }, headerStyle: {
          backgroundColor: userTeamColor,
        }

      }} />
      <Stack.Screen name="ViewFilm" component={ViewFilmTabs} options={({ route }) => ({
        headerShown: true, headerTitle: getHeaderTitle(route), headerStyle: {
          backgroundColor: userTeamColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // headerRight: () => (
        //   <Pressable onPress={openMenu}
        //     // onPress={() => navigation.navigate('Modal')}
        //     style={({ pressed }) => ({
        //       opacity: pressed ? 0.5 : 1,
        //     })}>

        //     <Menu
        //       visible={menuVisible}
        //       onDismiss={closeMenu}
        //       anchor={
        //         <FontAwesome
        //           name="ellipsis-v"
        //           size={30}
        //           color="white"
        //           style={{ marginRight: 20 }} />
        //       }>
        //       <Menu.Item onPress={closeMenu} title={"Record More"} />
        //       <Menu.Item onPress={closeMenu} title={"Upload from Device"} />
        //     </Menu>

        //   </Pressable>
        // )
      })} />

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
  return (
    <Tab.Navigator screenOptions={
      { tabBarIndicatorStyle: { backgroundColor: userTeamColor } }
    }
    >
      <Tab.Screen name="Recent" component={RecentPlaylistScreen} options={
        {
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar" size={22} color={color} />
          ),
          tabBarShowLabel: false,
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
      <Tab.Screen name="Current" component={CurrentPlaylistScreen} options={
        {
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-range" size={22} color={color} />
          ),
          tabBarShowLabel: false,
        }
      } />
      <Tab.Screen name="All" component={AllPlaylistScreen} options={
        {
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-month" size={22} color={color} />
          ),
          tabBarShowLabel: false,
        }
      } />
      <Tab.Screen name="Training" component={TrainingPlaylistScreen} options={
        {
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-account" size={22} color={color} />
          ),
          tabBarShowLabel: false,
        }
      } />
      <Tab.Screen name="Other" component={OtherPlaylistScreen} options={
        {
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-question" size={22} color={color} />
          ),
          tabBarShowLabel: false,
        }
      } />
    </Tab.Navigator>
  );
}

function RecordNested() {
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
  let isDrawerVisible = true;
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

  console.log(getUserRole(userContext.userInfo.userRole));
  const run = async () => {
    const result = await getSecurityData(userContext.userInfo.teamId);
    console.log("result", result);
  }
  run();

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}
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

      {
        true &&
        <Drawer.Screen name='Record Game' component={RecordNested}
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
        }
      } />

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
