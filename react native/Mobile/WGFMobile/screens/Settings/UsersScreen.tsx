import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet } from 'react-native';
import { getSession } from "../../services/common/Session";
import { MessageModel } from "../../services/Model/MessageModel";
import { SessionInfoModel } from "../../services/Model/SessionInfoModel";
import { RootDrawerScreenProps } from "../../types";
import UsersComponent from "../Film/Component/UsersComponent";
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


export default function UsersScreen({ navigation }: RootDrawerScreenProps<'Users'>) {
    const isMountedRef = useIsMountedRef();
    const [sessionData, setSessionData] = useState<SessionInfoModel | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const [menuVisible, setMenuVisible] = React.useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const init = () => {

        try {

            getSession().then((s) => {
                let sessionInfo: SessionInfoModel = s;
                setSessionData(sessionInfo);

                setIsSubmitting(false);
            });
        }
        catch (error) {
            setIsSubmitting(false);
            if (error) {
                setNotification({ type: "error", text: error.toString() });
            }
        }

    };


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
    function addPageNavigationHandler() {
        navigation.getParent()?.setOptions({
            headerRight: () => null,
        });
        navigation.navigate("AddTeamUser");
    }


    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.getParent()?.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={openMenu}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <Ionicons name="ellipsis-vertical" size={30} color="white" />
                        }>
                        <Menu.Item onPress={() => { closeMenu(); addPageNavigationHandler(); }} title="Add User" />
                    </Menu>
                </Pressable>
            ),
            title: "Users"
        })
    });


    return (
        <SafeAreaView style={styles.container}>
            {(isSubmitting) ? (
                <></>
            ) : (
                <UsersComponent sessionData={sessionData ?? undefined} />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0, marginTop: -29
    },
});