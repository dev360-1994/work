import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { PreferencesContext } from './PreferencesContext';
import { DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { StatusBar, Platform, View } from 'react-native';
import { SessionInfoModel } from './services/Model/SessionInfoModel';
import { setSession } from './services/common/Session';


//const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
// const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export default function App() {
  const isLoadingComplete = useCachedResources();
  //const [isThemeDark, setIsThemeDark] = React.useState(false);
  const [userContext, setUserContext] = React.useState<SessionInfoModel>(new SessionInfoModel());


  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 20 : 0;
  const HEADER_HEIGHT = Platform.OS === "ios" ? 0 : 0;


  //let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
  let theme = userContext.isThemeDark ? PaperDarkTheme : PaperDefaultTheme;
  const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;


  const updateUserContext = React.useCallback((context) => {
    setSession(context)?.then(() => {
      return setUserContext(context);
    });
  }, [userContext]);

  const preferences = React.useMemo(
    () => ({
      updateUserContext, userContext,
    }),
    [userContext]
  );

  if (!isLoadingComplete) {
    return null;
  } else {
    return (

      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: userTeamColor }}>
            <StatusBar
              translucent
              backgroundColor={userTeamColor}
              barStyle="light-content"
            />
          </View>
          <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: userTeamColor }}>
          </View>
          {/* <StatusBar barStyle={Platform.OS == "ios" ? "light-content" : "default"} hidden={false} backgroundColor="#000" translucent={true} /> */}
          <PreferencesContext.Provider value={preferences}>
            <PaperProvider theme={theme}>

              <Navigation colorScheme={(userContext.isThemeDark ? 'dark' : 'light')} />
              {/* <StatusBar style={(isThemeDark ? 'dark' : 'light')} /> */}

            </PaperProvider>
          </PreferencesContext.Provider>
        </View>

      </SafeAreaProvider>
    );
  }
}
registerRootComponent(App);