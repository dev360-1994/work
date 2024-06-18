
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform, Pressable, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Searchbar, useTheme, Text, Colors, Switch, Menu } from "react-native-paper";
import Toastbar from "../../../components/Toastbar";
import { PreferencesContext } from "../../../PreferencesContext";
import { getSession } from "../../../services/common/Session";
import { getUserRoles, getUserTeams } from "../../../services/DashboardService";
import { SessionInfoModel } from "../../../services/Model/SessionInfoModel";
import { TeamModel } from "../../../services/Model/TeamModel";
import { SecurityPost, TeamSecurity } from "../../../services/Model/TeamUserSecurity";
import { UserRoleModel } from "../../../services/Model/UserRoleModel";
import { getAllSecurityData, resetTeamSecurity, updateTeamSecurity } from "../../../services/SecurityService";

export const SecurityComponent = ({ sessionData }: { sessionData?: SessionInfoModel }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [filterdataSource, setFilterDataSource] = React.useState<TeamSecurity[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setNotification] = useState<TeamSecurity>(new TeamSecurity());
    const [dataSource, setDataSource] = React.useState<TeamSecurity[]>([]);
    const [hasData, setHasData] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(1);
    const [label, setLabel] = useState("");
    const [menuVisible, setMenuVisible] = React.useState(false);
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const [teams, setTeams] = useState([
        { label: 'Administrator Role Settings', value: 1 },
        { label: 'Coach Role Settings', value: 2 },
        { label: 'Athlete Role Settings', value: 3 },
        { label: 'Parent Role Settings', value: 4 },
        { label: 'Referee Role Settings', value: 5 },
        { label: 'Press Role Settings', value: 6 }
    ]);


    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const getRoleName = (value: number) => teams.filter(c => c.value === value)[0].label.toLowerCase().split(' ')[0];

    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

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
                        <Menu.Item onPress={resetSecurityHandler} title="Reset Security" />
                    </Menu>
                </Pressable>
            ),
        })
    });

    const resetSecurityHandler = async () => {
        closeMenu();
        const teamId = sessionData?.userInfo.teamId ?? 0;
        const userId = sessionData?.userInfo.userId ?? 0;

        Alert.alert(
            "Reset Security", "Are you sure you want to reset your team's security settings to the default value?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            var result = await resetTeamSecurity(teamId, userId);
                            if (result) {
                                setNotification({ type: "success", text: "Successfully Updated" });
                            }
                            setIsSubmitting(true);
                            fetchPlaylists();
                        } catch (error) {
                            console.log(error);
                        }
                        // setNotification({ type: "success", text: "" });
                    },
                },
                {
                    text: "No",
                },
            ]
        );


    }

    const onToggleSwitch = async (status: boolean, item: TeamSecurity) => {
        setIsSwitchOn(!isSwitchOn);
        item[getRoleName(value)] = status ? 1 : 0;
        let data: SecurityPost = new SecurityPost;
        data.teamId = item.teamId;
        data.userId = sessionData?.userInfo.userId ?? 0;
        data.teamSecurityId = item.teamSecurityId;
        data.actionDesc = item.actionDesc;
        data.coach = item.coach;
        data.administrator = item.administrator;
        data.athlete = item.athlete;
        data.parent = item.parent;
        data.press = item.press;
        data.referee = item.referee;
        try {
            var result = await updateTeamSecurity(data);
            if (result) {
                setNotification({ type: "success", text: "Successfully Updated" });
            }
        } catch (error) {
            console.log(error);
        }
        setIsSubmitting(true);
        fetchPlaylists();
    }

    const EmptyMessage = () => {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background, }]}>
                <Text style={{ textAlign: 'center', color: theme.colors.text }}>No Record found.</Text>
            </View>

        );
    };


    // useLayoutEffect(() => {
    //     setValue(1); //Administrator
    //     setLabel(teams.filter(c => c.value === 1)[0].label.toLowerCase());
    // }, [value]);



    async function fetchPlaylists() {

        try {
            let params = sessionData?.userInfo?.teamId.toString() ?? "0";
            var resultPromise = await getAllSecurityData(params);
            if (resultPromise) {
                // console.log(resultPromise);
                let result: TeamSecurity[] = JSON.parse(JSON.stringify(resultPromise));
                if (result && result.length > 0) {
                    setHasData(true);
                }
                else {
                    setHasData(false);
                }

                setDataSource(result);
                setIsSubmitting(false);
                setLabel(getRoleName(value));
            }
            setIsSubmitting(false);
        }
        catch (error: any) {
            setIsSubmitting(false);
            let errorText = error.toString();
            if (error) {
                if (errorText != "Error: 204") {
                    // setNotification({ type: "error", text: error.toString() });
                }
            }
        }
    }


    async function onDropdownChangeHandler(status: any) {
        setLabel(teams.filter(c => c.value === 1)[0].label.toLowerCase());
        onRefreshHandler();
    }

    const onPressViewFilmHandler = async (item: TeamSecurity) => {

    };

    function toggleSecurity() {

    }

    const onRefreshHandler = () => {
        setIsSubmitting(true);
        fetchPlaylists();
    };

    const init = () => {
        setIsSubmitting(true);
        fetchPlaylists();
    }

    useEffect(() => {
        init();
    }, []);


    return (
        <View style={[styles.innerContainer, { backgroundColor: theme.colors.background }]}>

            <React.Fragment key={"I"}>
                <View style={[styles.Searchbar]} >
                    <DropDownPicker style={styles.Dropdown}
                        containerProps={{
                            // height: "100%",
                            // backgroundColor: "#ffffff",
                        }}
                        open={open}
                        value={value}
                        items={teams}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setTeams}
                        multiple={false}
                        containerStyle={{ margin: 10, width: '95%' }}
                        onChangeValue={(status) => onDropdownChangeHandler(status)}
                    />
                </View>
                <FlatList
                    key={"I"}
                    data={dataSource}
                    onRefresh={() => onRefreshHandler()}
                    refreshing={isSubmitting}
                    progressViewOffset={100}
                    ListEmptyComponent={(!isSubmitting) ? (<EmptyMessage />) : <></>}
                    keyExtractor={(item) => item.teamSecurityId.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.wrapper, theme.dark ? styles.borderForDarkTheme : styles.borderForLightTheme, { backgroundColor: theme.colors.surface }]}>

                            <View
                                style={{ flex: 1, flexDirection: 'row', margin: 10, zIndex: 0, }}

                            >
                                {
                                    item.categoryDesc != "" &&
                                    <Text style={{ color: theme.colors.text }}>{item.categoryDesc}: </Text>
                                }
                                {
                                    item.actionDesc != null &&
                                    <Text style={{ color: Colors.grey600 }}>{item.actionDesc}</Text>
                                }




                            </View>

                            <View>
                                <Switch
                                    color={userTeamColor}
                                    style={[styles.switchStyle]}
                                    value={item[label] == 1}
                                    onValueChange={(value) => onToggleSwitch(value, item)}
                                />
                            </View>
                        </View>
                    )}
                />
                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
            </React.Fragment>
        </View >
    )
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,

    },

    wrapper: {
        //padding: 10,
        borderTopWidth: 1,
        borderRadius: 0,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    borderForDarkTheme:
    {
        borderColor: Colors.grey900
    },
    borderForLightTheme:
    {
        borderColor: Colors.grey300
    },
    checkbox:
    {
        justifyContent: 'center',
        textAlign: 'center',
        paddingHorizontal: 0,
        paddingRight: 10,
    },
    MaterialCheckbox:
    {
        fontSize: 30
    },

    emptyContainer: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex: 1,
        marginTop: Dimensions.get('window').height / 4,
    },
    Dropdown: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 0,
    },
    switchStyle: {
        ...Platform.select({
            ios: {
                marginTop: 4,
            },

        })
    },

    Searchbar: {
        ...Platform.select({
            android: {
                margin: 10,
            },
            ios: {
                marginTop: 20,
                margin: 10,
            },
            default: {
                // other platforms, web for example
                margin: 10,
            }

        })
    },
});