import React from 'react';
import { StyleSheet,View } from 'react-native';
import AppSwitchNavigator from './src/Navigation/AppSwitchNavigator';
import { createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux';
import configureStore from "./src/Redux/configureStore";
import FlashMessage from "react-native-flash-message";
import axiosInterceptor from './src/axios/axiosInterceptor';
import { ScreenOrientation } from 'expo';
  
export default class App extends React.Component {
  
  componentDidMount = async()=> {
        await ScreenOrientation.unlockAsync(ScreenOrientation.Orientation.LANDSCAPE)
  }
  render() {
    console.disableYellowBox = true;
    const store = configureStore();
    return (
     <Provider store={store}>
        <AppContainer></AppContainer>
        <View style={styles.flashContainer}>
            <FlashMessage style={styles.flashMessage} floating={true} position="top" />
        </View>
      </Provider>
    );
  }
}
const AppContainer = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashContainer: {
    zIndex: 99999,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  flashMessage: {
    zIndex: 99999,
    position: 'relative',
  }
});
