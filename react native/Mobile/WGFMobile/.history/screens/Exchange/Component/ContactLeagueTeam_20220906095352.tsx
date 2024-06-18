import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { getSession } from "../../services/common/Session";
import { MessageModel } from "../../services/Model/MessageModel";
import { SessionInfoModel } from "../../services/Model/SessionInfoModel";
import { RootDrawerScreenProps } from "../../types";
import { ExchangeHistoryComponent } from "./Component/ExchangeHistoryComponent";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text, useTheme } from "react-native-paper";


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





export default function ExchangeHistoryScreen({ navigation }: RootDrawerScreenProps<'ExchangeHistory'>) {
    const isMountedRef = useIsMountedRef();
    const [sessionData, setSessionData] = useState<SessionInfoModel | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const theme = useTheme();

    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerShown: false,
        });
    });


    const init = () => {
        try {
            getSession().then((s) => {
                let sessionInfo: SessionInfoModel = s;
                setSessionData(sessionInfo);

                setIsSubmitting(false);
            });
        }
        catch (error: any) {
            setIsSubmitting(false);
            if (error) {
                setNotification({ type: "error", text: error.toString() });
            }
        }

    };

    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.navigate("ExchangeFilmTab");
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsSubmitting(true);
            init();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        setIsSubmitting(true);
        init();
    }, []);



    return (
        <SafeAreaView style={styles.container}>
            <View style={[{
                // marginTop: 100,
            },
            {
                backgroundColor: theme.colors.background, width: '100%', padding: 20, marginTop: Platform.OS === "ios" ? 0 : 0, zIndex: 1,
                paddingTop: Platform.OS === "ios" ? 50 : 20,
                flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#cacaca',
            }
            ]}>
                <MaterialIcons name="arrow-back" size={24} style={{ color: theme.colors.text }} onPress={() => goBack()} />

                <MaterialCommunityIcons name="history" style={{ marginLeft: 20 }} size={22} color={theme.colors.text} />
                <Text style={{
                    fontSize: 20,
                    color: theme.colors.placeholder,
                    paddingLeft: 6,
                }}
                >Exchange History</Text>
            </View>
            {(isSubmitting) ? (
                <></>
            ) : (
                <ExchangeHistoryComponent sessionData={sessionData ?? undefined} />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0
    },

});
