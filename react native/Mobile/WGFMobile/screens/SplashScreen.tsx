import React, { useEffect } from "react";
import { StyleSheet,  Image } from 'react-native';

import { Text, View } from '../components/Themed';
import { getSession } from "../services/common/Session";
import { SessionInfoModel } from "../services/Model/SessionInfoModel";
import { RootStackScreenProps } from '../types';
import { FontAwesome } from '@expo/vector-icons';



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

export default function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
    const isMountedRef = useIsMountedRef();


    const checkIfLoggedIn = () => {
        getSession().then(function (value: SessionInfoModel) {
            if(value && value.token && value.token.length > 0 )
            {
                if (value.userInfo && value.userInfo.userId > 0)
                {
                    navigation.navigate("Root");    
                }
                else{
                    navigation.navigate("SignIn");
                }
            }
            else {
                navigation.navigate("SignIn");
            }
          });
        
    };

    useEffect(() => {
        checkIfLoggedIn();
    },[]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/splash.png')} />
            <View style={{ backgroundColor: 'black', paddingTop: 100 }}>
                <Text style={styles.title}>we <FontAwesome name="heart" size={24} color="red" style={{ marginHorizontal: 20 }} /> sports!</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#000000',

    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
