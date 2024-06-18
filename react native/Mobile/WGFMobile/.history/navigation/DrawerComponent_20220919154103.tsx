import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import {
  View,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { getSession, setSession } from "../services/common/Session";
import { SessionInfoModel } from "../services/Model/SessionInfoModel";
import { PreferencesContext } from "../PreferencesContext";
import { Chip, Switch, useTheme, Colors, List } from 'react-native-paper';
import { UserInfoModel } from "../services/Model/UserInfoModel";
import { background } from "native-base/lib/typescript/theme/styled-system";
import ProfileScreen from "../screens/SettingsScreen";
import { teamUserLayoutAction } from "../services/SecurityService";


const DrawerComponent = (props: any) => {
  const { updateUserContext, userContext } = React.useContext(PreferencesContext);
  const [sessionData, setSessionData] = useState<SessionInfoModel | null>(null);
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
  const [uploadTab, setUploadTab] = React.useState(false);

  const theme = useTheme();
  const handleSignOutPress = () => {
    // reset to new / empnty
    //updateUserContext({ ...userContext, token: sessionData?.token, tokenExpiryTime: sessionData?.tokenExpiryTime, isThemeDark: sessionData?.isThemeDark,  userInfo: new UserInfoModel() });
    //updateUserContext(new SessionInfoModel());
    setSessionData({ ...userContext, token: sessionData?.token, tokenExpiryTime: sessionData?.tokenExpiryTime, isThemeDark: sessionData?.isThemeDark, userInfo: new UserInfoModel() });
    //setSessionData(new SessionInfoModel());
    props.navigation.closeDrawer();
    // // reset session to new / empnty
    // setSession(new SessionInfoModel())?.then(function () {
    props.navigation.navigate('SignIn');
    //});

  };


  // const [film, setFilm] = useState(false);
  // const [setting, setSetting] = useState(false);
  // const [help, setHelp] = useState(false);



  // const handleFilmClick = () => {
  //   console.log("Hello Film")
  //   useState({ setFilm: true, setSetting: false, setHelp: false })
  // };

  // const handleSettingClick = () => {
  //   console.log("Hello setting")
  //   useState({ setFilm: false, setSetting: true, setHelp: false })
  // };

  // const handleHelpClick = () => {
  //   console.log("Hello Help")
  //   useState({ setFilm: true, setSetting: false, setHelp: false })
  // };


  const handlePageNavigation = (toScreen: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate(toScreen);
  };


  const init = () => {
    try {
      getSession().then(async (s) => {
        //let sessionInfo: SessionInfoModel = s;
        //setSessionData(sessionInfo);
      });

    }
    catch (error) {
    }
  };


  useEffect(() => {
    init();

  }, []);



  function handleHelpPress() {
    WebBrowser.openBrowserAsync(
      'https://help.watchgamefilm.com/categories/15709'
    );
  }

  function handleAboutPress() {
    props.navigation.navigate('About');
  }



  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, }}>
      <View style={{ backgroundColor: userTeamColor, height: 85, marginTop: 4 }}>
        <Text style={{ color: '#fff', marginHorizontal: 10, fontWeight: 'bold', fontSize: 16, paddingTop: 46, }}>{props.teamName}</Text>
        {/* <Text style={{ color: '#fff', marginHorizontal: 10, fontWeight: 'bold', fontSize: 16, paddingTop: 44 }}>{userContext.userInfo?.teamName}</Text> */}
      </View>
      <DrawerContentScrollView {...props}>

        {/* <DrawerItemList {...props} /> */}
        <TouchableOpacity onPress={() => handlePageNavigation('Dashboard')}>
          <List.Item title="Dashboard" titleStyle={{ marginLeft: -10, color: theme.colors.text }}
            style={{ marginLeft: 10 }}
            left={props => <List.Icon {...props} icon="view-dashboard-outline" color={theme.colors.text} />} />
        </TouchableOpacity>

        <List.Section style={{ backgroundColor: 'transparent', marginTop: 0 }}>

          <List.Accordion
            title="Film"
            //onPress={handleFilmClick}
            titleStyle={{ color: theme.colors.text }}
            left={props => <List.Icon {...props} icon="movie-open-outline" color={theme.colors.text} />}
          >

            <View style={[theme.dark ? styles.backgroundForDarkTheme : styles.backgroundForLightTheme, { marginLeft: -40 }]}>
              <TouchableOpacity onPress={() => handlePageNavigation('ViewPlaylist')}>
                <List.Item title="View Film"
                  titleStyle={{ marginLeft: -10 }}
                  left={props => <List.Icon {...props} icon="playlist-play" color={theme.colors.text}
                  />}
                />
              </TouchableOpacity>
              {
                props.roleId <= 2 &&
                <TouchableOpacity onPress={() => handlePageNavigation('ExchangeFilm')}>
                  <List.Item title="Exchange Film"
                    titleStyle={{ marginLeft: -10 }}
                    left={props => <List.Icon {...props} icon="swap-horizontal-variant" color={theme.colors.text}
                    />}
                  />
                </TouchableOpacity>
              }

              {
                props.security &&
                <TouchableOpacity onPress={() => handlePageNavigation('CreateFilmModal')}>
                  <List.Item title="Record Film"
                    titleStyle={{ marginLeft: -10 }}
                    left={props => <List.Icon {...props} icon="record" color={theme.colors.text}
                    />}
                  />
                </TouchableOpacity>
              }
              {
                props.security &&
                <TouchableOpacity onPress={() => handlePageNavigation('AddFilm')}>
                  <List.Item title="Add Film"
                    titleStyle={{ marginLeft: -10 }}
                    left={props => <List.Icon {...props} icon="plus" color={theme.colors.text}
                    />}
                  />
                </TouchableOpacity>
              }

            </View>

          </List.Accordion>

          <List.Accordion
            title="Settings"
            // onPress={handleSettingClick}
            titleStyle={{ color: theme.colors.text }}
            left={props => <List.Icon {...props} icon="tune" color={theme.colors.text} />}
          >
            <View style={[theme.dark ? styles.backgroundForDarkTheme : styles.backgroundForLightTheme, { marginLeft: -40 }]}>
              <TouchableOpacity onPress={() => handlePageNavigation('Profile')}>
                <List.Item title="Profile"
                  titleStyle={{ marginLeft: -10 }}
                  left={props => <List.Icon {...props} icon="account-box-outline" color={theme.colors.text}
                  />}
                />
              </TouchableOpacity>
              {/* {
                props.roleId <= 2 &&
                <TouchableOpacity onPress={() => handlePageNavigation('UsersScreen')} >
                  <List.Item title="Users"
                    titleStyle={{ marginLeft: -10 }}
                    left={props => <List.Icon {...props} icon="account-multiple-outline" color={theme.colors.text}
                    />}
                  />
                </TouchableOpacity>
              }

              {
                props.roleId <= 2 &&
                <TouchableOpacity onPress={() => handlePageNavigation('SecurityScreen')}>
                  <List.Item title="Security"
                    titleStyle={{ marginLeft: -10 }}
                    left={props => <List.Icon {...props} icon="shield-account-outline" color={theme.colors.text}
                    />}
                  />
                </TouchableOpacity>
              }

              <TouchableOpacity onPress={() => handlePageNavigation('TeamDetails')}>
                <List.Item title="Team"
                  titleStyle={{ marginLeft: -10 }}
                  left={props => <List.Icon {...props} icon="cog-outline" color={theme.colors.text}
                  />}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePageNavigation('History')}>
                <List.Item title="History"
                  titleStyle={{ marginLeft: -10 }}
                  left={props => <List.Icon {...props} icon="history" color={theme.colors.text}
                  />}
                />
              </TouchableOpacity>
              {
                (props.roleId <= 2 || props.roleId == 4) &&
                <TouchableOpacity onPress={() => handlePageNavigation('Payment')}>
                  <List.Item title="Payment"
                    titleStyle={{ marginLeft: -10 }}
                    left={props => <List.Icon {...props} icon="credit-card-outline" color={theme.colors.text}
                    />}
                  />
                </TouchableOpacity> 
              }*/}


            </View>
          </List.Accordion>

          <List.Accordion
            title="Help"
            // onPress={handleHelpClick}
            titleStyle={{ color: theme.colors.text }}
            left={props => <List.Icon {...props} icon="help-circle-outline" color={theme.colors.text} />}
          >

            <View style={[theme.dark ? styles.backgroundForDarkTheme : styles.backgroundForLightTheme, { marginLeft: -40 }]}>
              <TouchableOpacity onPress={() => handleHelpPress()}>
                <List.Item title="Documentation"
                  titleStyle={{ marginLeft: -10 }}
                  left={props => <List.Icon {...props} icon="book-open-outline" color={theme.colors.text}
                  />}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAboutPress()} style={{ paddingVertical: 15 }}>
                <List.Item title="About"
                  titleStyle={{ marginLeft: -10 }}
                  left={props => <List.Icon {...props} icon="alert-circle-outline" color={theme.colors.text}
                  />}
                />
              </TouchableOpacity>
              {/* <List.Item title="Contact Us"
                titleStyle={{ marginLeft: -10 }}
                left={props => <List.Icon {...props} icon="lifebuoy" color={theme.colors.text}
                />} 
              />*/}
            </View>
          </List.Accordion>
          <TouchableOpacity onPress={() => handleSignOutPress()} >
            <List.Item title="Logout" titleStyle={{ marginLeft: -5, color: theme.colors.text }}
              left={props => <List.Icon {...props} style={{ marginLeft: 10 }} icon="logout" color={theme.colors.text} />} />
          </TouchableOpacity>
        </List.Section >

      </DrawerContentScrollView>

      {/* <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: theme.colors.text }}>
        <TouchableOpacity onPress={() => handleHelpPress()} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="help-circle" size={22} color={theme.colors.text} />
            <Text style={{ fontSize: 15, marginLeft: 5, fontWeight: 'bold', color: theme.colors.text }}>Help</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAboutPress()} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="info" size={22} color={theme.colors.text} />
            <Text style={{ fontSize: 15, marginLeft: 5, fontWeight: 'bold', color: theme.colors.text }}>About</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSignOutPress()} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="log-out" size={22} color={theme.colors.text} />
            <Text style={{ fontSize: 15, marginLeft: 5, fontWeight: 'bold', color: theme.colors.text }}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
       */}
    </View >
  );
};
export default DrawerComponent;


const styles = StyleSheet.create({

  backgroundForDarkTheme:
  {
    backgroundColor: Colors.grey900
  },
  backgroundForLightTheme:
  {
    backgroundColor: Colors.grey300
  }

});







