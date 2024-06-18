import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { getSession } from "../../services/common/Session";
import { MessageModel } from "../../services/Model/MessageModel";
import { SessionInfoModel } from "../../services/Model/SessionInfoModel";
import { OnGetHistoryDataAsync } from "../../services/UserService";
import { RootDrawerScreenProps } from "../../types";

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

export default function HistoryScreen({ navigation }: RootDrawerScreenProps<'History'>) {
    const isMountedRef = useIsMountedRef();
    const [sessionData, setSessionData] = useState<SessionInfoModel | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());

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



    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const history = await OnGetHistoryDataAsync();
                console.log(history);
            } catch {
                console.log("error fetching history");
            }
        }
        fetchHistoryData();
    }, [])

    return (
        <SafeAreaView style={styles.container}>

            {(isSubmitting) ? (
                <></>
            ) : (
                <Text>History Screen</Text>
            )}



        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0, marginTop: -29
    },
});