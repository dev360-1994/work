import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet } from 'react-native';
import { getSession } from "../../services/common/Session";
import { MessageModel } from "../../services/Model/MessageModel";
import { SessionInfoModel } from "../../services/Model/SessionInfoModel";
import { RootDrawerScreenProps } from "../../types";
import { TeamsComponent } from "./Component/TeamsComponent";
import { Menu } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";


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



export default function TeamsScreen({ navigation }: RootDrawerScreenProps<'TeamExchange'>) {
    const isMountedRef = useIsMountedRef();
    const [sessionData, setSessionData] = useState<SessionInfoModel | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());


    const [menuVisible, setMenuVisible] = React.useState(false);
    const closeMenu = () => setMenuVisible(false);
    const openMenu = () => setMenuVisible(true);



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

    useLayoutEffect(() => {
        navigation.getParent()?.getParent()?.setOptions({
            headerRight: () => (
                <Pressable onPress={openMenu}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={<Ionicons name="ellipsis-vertical" size={30} color="white" />}>
                        <Menu.Item onPress={() => { navigation.navigate("ExchangeHistory"); }} title={"History"} />
                        <Menu.Item onPress={() => { }} title={"Contact"} />
                    </Menu>
                </Pressable>
            ),
            headerShown: true,
        });
    });

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

    useLayoutEffect(() => {
        navigation.getParent()?.getParent()?.setOptions({
            headerShown: true
        });
    });



    return (
        <SafeAreaView style={styles.container}>
            {(isSubmitting) ? (
                <></>
            ) : (
                <TeamsComponent sessionData={sessionData ?? undefined} />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0, marginTop: -29
    },

});
