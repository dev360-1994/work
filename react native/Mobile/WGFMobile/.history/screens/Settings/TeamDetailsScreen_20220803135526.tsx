
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, TextInput, SafeAreaView, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Menu, Text, } from "react-native-paper"
import { getSession } from "../../services/common/Session";
import { TeamUserInfoModel } from "../../services/Model/TeamUserInfoResource";
import { getSettingsTeamUser } from "../../services/UserService";
import { RootDrawerScreenProps } from "../../types";


export default function TeamDetailsScreen({ navigation }: RootDrawerScreenProps<'TeamDetails'>) {
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [teamId, setTeamId] = useState(0);
    const [userId, setUserId] = useState(0);
    const [teamUserInfo, setTeamUserInfo] = useState<TeamUserInfoModel>();
    const [teamName, setTeamName] = useState("");
    const [menuVisible, setMenuVisible] = React.useState(false);

    const openMenu = () => setMenuVisible(true);

    const closeMenu = () => setMenuVisible(false);

    useLayoutEffect(() => {
        async function fetchTeamDetails() {
            const response = await getSettingsTeamUser();
            setTeamUserInfo(response[0]);
            // console.log(teamUserInfo?.teamName);
        }
        fetchTeamDetails();
        // console.log(teamId, userId);
        // console.log(teamUserInfo);
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={openMenu}
                    // onPress={() => navigation.navigate('Modal')}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>

                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <Ionicons name="ellipsis-vertical" size={30} color="white" />
                        }>
                        <Menu.Item onPress={() => { }} title={"Month Season Starts"} />
                        <Menu.Item onPress={() => { }} title={"Team Color"} />
                    </Menu>
                </Pressable>
            ),
        })
    }, [navigation]);


    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "white" : "black";
    }

    return <ScrollView>
        <SafeAreaView>
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
