
import { Feather, FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, TextInput, SafeAreaView, Pressable, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Dialog, Menu, Paragraph, Portal, Text, } from "react-native-paper"
import { getSession } from "../../services/common/Session";
import { TeamUserInfoModel } from "../../services/Model/TeamUserInfoResource";
import { getSettingsTeamUser, getTeamSessionStart, OnGetUpdateTeamColor } from "../../services/UserService";
import { RootDrawerScreenProps } from "../../types";


export default function TeamDetailsScreen({ navigation }: RootDrawerScreenProps<'TeamDetails'>) {
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [teamId, setTeamId] = useState(0);
    const [userId, setUserId] = useState(0);
    const [teamUserInfo, setTeamUserInfo] = useState<TeamUserInfoModel>();
    const [teamName, setTeamName] = useState("");
    const [menuVisible, setMenuVisible] = React.useState(false);
    const [sessionStartMonth, setSessionStartMonth] = useState("");
    const [visible, setVisible] = React.useState(false);
    const [reload, setReload] = useState();

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const openMenu = () => setMenuVisible(true);

    const closeMenu = () => setMenuVisible(false);

    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    useLayoutEffect(() => {
        async function fetchTeamDetails() {
            const response = await getSettingsTeamUser();
            setTeamUserInfo(response[0]);
            const response2 = await getTeamSessionStart();
            setSessionStartMonth(monthList[response2]);
        }
        fetchTeamDetails();
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => { openMenu(); console.log("pressed") }}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>

                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <Ionicons name="ellipsis-vertical" size={30} color="white" />
                        }>
                        <Menu.Item onPress={() => { closeMenu(); }} title={
                            <View>
                                <Text>Month Season Starts: {sessionStartMonth}</Text>
                            </View>

                        } />
                        <Menu.Item onPress={() => { closeMenu(); showDialog(); }} title={
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Button color={teamUserInfo?.teamColor} >Team Color</Button>
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
        hideDialog();
        let data = {
            "TeamId": teamUserInfo?.teamId,
            "TeamColor": teamColor
        }
        // console.log(data);
        await OnGetUpdateTeamColor(data);

    }

    useEffect(() => {

    }, [reload]);


    return <ScrollView>
        <SafeAreaView>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Team Color</Dialog.Title>
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
                        value={teamUserInfo?.dateCreated}
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


});

