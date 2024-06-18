
import { Feather, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, TextInput, SafeAreaView, Pressable, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Dialog, Menu, Paragraph, Portal, Text, } from "react-native-paper"
import ProcessingIndicator from "../../components/ProcessingIndicator";
import { PreferencesContext } from "../../PreferencesContext";
import { getSession } from "../../services/common/Session";
import { TeamUserInfoModel } from "../../services/Model/TeamUserInfoResource";
import { getSettingsTeamUser, getTeamSessionStart, OnGetUpdateTeamColor, OnPutTeamSessionAsync } from "../../services/UserService";
import { RootDrawerScreenProps } from "../../types";


export default function TeamDetailsScreen({ navigation }: RootDrawerScreenProps<'TeamDetails'>) {
    const theme = useTheme();
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [teamId, setTeamId] = useState(0);
    const [userId, setUserId] = useState(0);
    const [teamUserInfo, setTeamUserInfo] = useState<TeamUserInfoModel>();
    const [teamName, setTeamName] = useState("");
    const [menuVisible, setMenuVisible] = React.useState(false);
    const [sessionStartMonth, setSessionStartMonth] = useState("");
    const [isTeamMenuPopupVisible, setIsTeamMenuPopupVisible] = React.useState(false);
    const [isSeasonStartsPopupVisible, setIsSeasonStartsPopupVisible] = React.useState(false);

    const showColorDialog = () => setIsTeamMenuPopupVisible(true);

    const hideColorDialog = () => setIsTeamMenuPopupVisible(false);

    const showSeasonDialog = () => setIsSeasonStartsPopupVisible(true);

    const hideSeasonDialog = () => setIsSeasonStartsPopupVisible(false);

    const openMenu = () => setMenuVisible(true);

    const closeMenu = () => setMenuVisible(false);

    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const init = () => {

    }

    useLayoutEffect(() => {
        async function fetchTeamDetails() {
            try {
                setIsSubmitting(true);
                const response = await getSettingsTeamUser();
                setTeamUserInfo(response[0]);
                const response2 = await getTeamSessionStart();
                setSessionStartMonth(monthList[response2 - 1]);
            } catch (error) {
                setIsSubmitting(false);
                console.log(error);
            }

        }
        fetchTeamDetails();
        setIsSubmitting(false);
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={openMenu}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>

                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <Ionicons name="ellipsis-vertical" size={30} color="white" />
                        }>
                        <Menu.Item onPress={() => { closeMenu(); showSeasonDialog(); }} title={
                            <View>
                                <Text

                                    // color="#000"
                                    color={userContext.isThemeDark ? "#fff" : "#000"}
                                >Season Starts: {sessionStartMonth} adakssss</Text>
                            </View>

                        } />
                        <Menu.Item onPress={() => { closeMenu(); showColorDialog(); }} title={
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Button
                                    // color={teamUserInfo?.teamColor}
                                    color={userContext.isThemeDark ? "#fff" : "#000"}
                                >Team Color</Button>
                                {/* <FontAwesome name="circle" size={50} color={teamUserInfo?.teamColor} /> */}
                            </View>} />
                    </Menu>
                </Pressable>
            ),
        })
    }, [navigation, openMenu, closeMenu]);


    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "white" : "black";
    }

    const colorChangeHandler = async (teamColor: any) => {
        hideColorDialog();
        let data = {
            "TeamId": teamUserInfo?.teamId,
            "TeamColor": teamColor
        }
        // console.log(data);
        await OnGetUpdateTeamColor(data);

    }

    async function sessionChangeHandler(month: any) {
        hideSeasonDialog();
        let data = {
            "UserId": teamUserInfo?.userId,
            "TeamId": teamUserInfo?.teamId,
            "Month": month
        }
        await OnPutTeamSessionAsync(data);

    }


    return <ScrollView>
        <SafeAreaView>
            <Portal>
                <Dialog visible={isTeamMenuPopupVisible} onDismiss={hideColorDialog}>
                    <Dialog.Title style={{ textAlign: "center" }} >Team Color</Dialog.Title>
                    <Dialog.Content>
                        <View style={{ paddingHorizontal: "30%" }}>
                            <TouchableOpacity onPress={() => colorChangeHandler("#000000")} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <FontAwesome name="circle" size={40} color={"#000000"} /><Text style={{ textAlignVertical: "center", fontSize: 20 }}>Black</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => colorChangeHandler("#6330CC")} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <FontAwesome name="circle" size={40} color={"#6330CC"} /><Text style={{ textAlignVertical: "center", fontSize: 20 }}>Purple</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => colorChangeHandler("#432475")} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <FontAwesome name="circle" size={40} color={"#432475"} /><Text style={{ textAlignVertical: "center", fontSize: 20 }}>Indigo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => colorChangeHandler("#224A8D")} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <FontAwesome name="circle" size={40} color={"#224A8D"} /><Text style={{ textAlignVertical: "center", fontSize: 20 }}>Blue</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => colorChangeHandler("#0D87B8")} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <FontAwesome name="circle" size={40} color={"#0D87B8"} /><Text style={{ textAlignVertical: "center", fontSize: 20 }}>Cyan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { closeMenu(); colorChangeHandler("#239D59") }} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <FontAwesome name="circle" size={40} color={"#239D59"} /><Text style={{ textAlignVertical: "center", fontSize: 20 }}>Green</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => colorChangeHandler("#C84B2B")} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <FontAwesome name="circle" size={40} color={"#C84B2B"} /><Text style={{ textAlignVertical: "center", fontSize: 20 }}>Orange</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => colorChangeHandler("#C3233D")} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <FontAwesome name="circle" size={40} color={"#C3233D"} /><Text style={{ textAlignVertical: "center", fontSize: 20 }}>Red</Text>
                            </TouchableOpacity>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        {/* <Button onPress={hideDialog}>Done</Button> */}
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Dialog visible={isSeasonStartsPopupVisible} onDismiss={hideSeasonDialog}>
                    <Dialog.Title style={{ textAlign: "center", fontSize: 20 }} >Select Month Season Starts:</Dialog.Title>
                    <Dialog.Content>
                        <View style={{ alignItems: "center" }}>
                            <TouchableOpacity onPressIn={() => sessionChangeHandler(1)} style={{ paddingBottom: 10, }} onPress={() => { }} >
                                <Text style={{ fontSize: 20 }}>January</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(2) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>February</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(3) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>March</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(4) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>April</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(5) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>May</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(6) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>June</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(7) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>July</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(8) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>August</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(9) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>September</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(10) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>October</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(11) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>November</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sessionChangeHandler(12) }} style={{ paddingBottom: 10, }}  >
                                <Text style={{ fontSize: 20 }}>December</Text>
                            </TouchableOpacity>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        {/* <Button onPress={hideDialog}>Done</Button> */}
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {

                isSubmitting && isSubmitting == true ? (
                    <View style={styles.processingIndicator}>
                        <ProcessingIndicator isLoading={isSubmitting} indicatorColor={theme.colors.text} />
                    </View>
                ) : (

                    <View style={styles.container}>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Team</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.teamName}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Level</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.teamLevel}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Owner</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.ownerName}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Created</Text>
                            <TextInput
                                editable={false}
                                value={new Date(`${teamUserInfo?.dateCreated}`).toDateString()}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Films</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.film_Count.toString()}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Video Clips</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.clip_Count.toString()}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Docs</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.doc_Count.toString()}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Photos</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.photo_Count.toString()}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Roku Channel</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.rokuChannel}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Sport</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.teamSport}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Email</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.ownerEmail}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Users</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.user_Count.toString()}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Film Storage</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.filmStatus}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Video Storage</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.clip_Space.toString() + " GB"}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Doc Storage</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.doc_Space.toString() + " MB"}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Photo Storage</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.photo_Space.toString() + " MB"}
                                style={styles.inputText}>
                            </TextInput>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[{ color: getTextColor() }, styles.text]}>Roku Status</Text>
                            <TextInput
                                editable={false}
                                value={teamUserInfo?.rokuSatus}
                                style={styles.inputText}>
                            </TextInput>
                        </View>


                    </View>
                )
            }
        </SafeAreaView>

    </ScrollView>
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "column",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingTop: "10%"
    },
    rowContainer: {
        flexDirection: "column",
        marginBottom: 20,
        justifyContent: "space-between"
    },
    text: {
        fontWeight: "bold",
        flex: 1,
        // textAlign: "center",
        textAlignVertical: "center",
    },
    inputText: {
        height: 48,
        borderColor: '#cccccc',
        borderRadius: 6,
        borderWidth: 1,
        paddingLeft: 8,
        backgroundColor: '#ffffff',
        width: "100%"
    },
    processingIndicator: {
        flex: 1,
        justifyContent: 'center',
        marginTop: '80%',
    },

});

