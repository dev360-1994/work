/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
//import 'react-native-gesture-handler';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
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
import { Button, useTheme } from 'react-native-paper';
import VideoRecorderScreen from '../screens/videoRecorder';
import ProfileScreen from '../screens/SettingsScreen';
import { VideoRecorderModal } from '../screens/Film/CameraModal';
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
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { userContext } = preferencesContext();
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false, title: 'Sign In' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: true, title: "Forgot Password" }} />
      <Stack.Screen name="Root" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ViewFilm" component={ViewFilmTabs} options={{
        headerShown: true, title: "View Film", headerStyle: {
          backgroundColor: userTeamColor,

        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }} />

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
        { tabBarIndicatorStyle: { backgroundColor: userTeamColor } }
      }>
        <Tab.Screen name="VIDEO" component={VideosScreen} />
        <Tab.Screen name="CLIPS" component={ClipsScreen} />
      </Tab.Navigator>
    </PlaylistContext.Provider>
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
    <Stack.Navigator screenOptions={{ headerShown: false, defaultNavigationOptions: { gestureEnabled: false } }} >
      <Stack.Screen name="VideoRecord" component={VideoRecorderScreen} />
      <Stack.Screen name='RecorderTemp' component={VideoRecorderModal} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function DrawerNavigator() {
  const colorScheme = useColorScheme();
  const { userContext } = preferencesContext();
  const theme = useTheme();
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: userTeamColor,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: theme.colors.text,
        drawerLabelStyle: { marginLeft: -21, fontSize: 15, },
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
            <Feather name="video" size={22} color={color} />
          ),
          title: "View Playlist",
          headerStyle: {
            backgroundColor: userTeamColor,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
      } />
      <Drawer.Screen name='Record Game' component={RecordNested}
        options={
          {
            drawerIcon: ({ color }) => (
              <Feather name="video" size={22} color={color} />
            ),
            title: "Record Game",
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
