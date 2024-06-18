import React, { useState, } from 'react';
import { StyleSheet, Image, Text, } from 'react-native';
import { View } from '../components/Themed';
import { RootDrawerScreenProps } from '../types';
import { useTheme, Colors, Button } from 'react-native-paper';
import { PreferencesContext } from '../PreferencesContext';
import Constants from "expo-constants";
import * as WebBrowser from 'expo-web-browser';

const useIsMountedRef = () => {
    const isMountedRef = React.useRef(false);
    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    });
    return isMountedRef;
};

export default function AboutScreen({ navigation }: RootDrawerScreenProps<'About'>) {
    const isMountedRef = useIsMountedRef();
    const theme = useTheme();

    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    const [sessionData, setSessionData] = useState<SessionInfoModel | null>(null);


    onPressLearnMoreHandler
    function onPressLearnMoreHandler() {
        WebBrowser.openBrowserAsync(
            'https://watchgamefilm.com/'
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: '#212529', }]}>
            <View style={{
                flex: 1,
                backgroundColor: '#212529',
                justifyContent: 'flex-end',
                marginBottom: 100,
            }}>
                <View style={{
                    backgroundColor: '#212529',
                }}>
                    <View style={[{ backgroundColor: '#212529', width: '100%', padding: 15 }]}>
                        <Image source={require('../assets/images/wgflogoonly.png')} />
                    </View>
                    <View style={[{ backgroundColor: '#212529', width: '100%', padding: 15 }]}>
                        <Text style={{ color: '#ffffff', fontSize: 40, fontWeight: 'bold' }}>
                            WatchGameFilm
                        </Text>
                        <Text style={{ color: '#ccc', fontSize: 18, paddingTop: 20 }}>
                            Building the ideal video platform for all levels of competition.
                        </Text>
                    </View>
                    <View style={[{ backgroundColor: '#212529', width: '100%', padding: 15, marginTop: 10 }]}>
                        <Button
                            mode="contained"
                            style={{ backgroundColor: Colors.yellow900, width: '100%', paddingVertical: 10, }}
                            onPress={() => onPressLearnMoreHandler()}
                        >
                            <Text>Learn More</Text>
                        </Button>
                    </View>
                    <View style={[{ backgroundColor: '#212529', width: '100%', padding: 15, alignItems: 'center' }]}>
                        <Text style={{ color: '#ccc', fontSize: 14, paddingTop: 20, textAlign: 'center' }}>
                            Build
                            {" "}
                            {Constants.manifest?.version}
                        </Text>
                    </View>
                </View>
            </View>

        </View >
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,

    },

});
