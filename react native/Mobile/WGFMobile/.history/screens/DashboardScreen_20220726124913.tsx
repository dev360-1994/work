import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Platform, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootDrawerScreenProps } from '../types';
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { Chip, Switch, useTheme, Colors } from 'react-native-paper';
import { getSession, setSession } from '../services/common/Session';
import { SessionInfoModel } from '../services/Model/SessionInfoModel';

import { getUserRoles, getUserTeams, getDashboardAlerts, getTeamInfo, getSwitchUserTeams } from '../services/DashboardService';
import { UserRoleModel } from '../services/Model/UserRoleModel';
import ProcessingIndicator from '../components/ProcessingIndicator';
import { MessageModel } from '../services/Model/MessageModel';
import Toastbar from '../components/Toastbar';
import { TeamModel } from '../services/Model/TeamModel';
import { DashboardAlertsModel } from '../services/Model/DashboardAlertsModel';
import { Subheading } from 'react-native-paper';
import { PreferencesContext } from '../PreferencesContext';
import { color } from 'react-native-reanimated';
import { UserInfoModel } from '../services/Model/UserInfoModel';
import { SwitchUser } from '../services/Model/SwitchUserModel';
import OptionsMenu from "react-native-option-menu";

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

export default function DashboardScreen({ navigation }: RootDrawerScreenProps<'Dashboard'>) {
    const isMountedRef = useIsMountedRef();
    const theme = useTheme();


    //const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    const [sessionData, setSessionData] = useState<SessionInfoModel | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());

    const [roleName, setRoleName] = useState<string>("Coach");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [teams, setTeams] = useState([{ label: 'Select Team', value: '0' }]);
    const [dashboardAlerts, setDashboardAlerts] = useState<DashboardAlertsModel>(new DashboardAlertsModel());


    function toggleTheme() {
        let sesInfo = userContext;
        updateUserContext({
            ...userContext, token: sesInfo.token, tokenExpiryTime: sesInfo.tokenExpiryTime,
            isThemeDark: !sesInfo.isThemeDark, userInfo: sesInfo.userInfo
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    // onPress={() => navigation.navigate('Modal')}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>
                    <OptionsMenu
                        customButton={<FontAwesome
                            name="ellipsis-v"
                            size={30}
                            // color={Colors[colorScheme].text}
                            color="white"
                            style={{ marginRight: 20 }}
                        />}
                        // destructiveIndex={1}
                        options={[(userContext.isThemeDark ? "Light" : "Dark") + " Mode", "Cancel"]}
                        actions={[toggleTheme]} />
                </Pressable>
            ),
        })
    }, [navigation, toggleTheme, userContext]);

    async function fetchUserRoles(userSessionData: SessionInfoModel) {
        try {
            var resultPromise = await getUserRoles();

            if (resultPromise) {
                let result: UserRoleModel[] = JSON.parse(JSON.stringify(resultPromise));

                if (result.length > 0) {
                    setRoleName(result[0].roleValue);
                }
            }
        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: "fetchUserRoles " + error.toString() });
            }
        }
    }


    async function fetchUserTeams(userSessionData: SessionInfoModel) {
        try {
            let params = userSessionData.userInfo?.userId.toString() ?? "0";
            let curTeamId = userSessionData.userInfo?.teamId.toString() ?? "0";
            let responseUserTeams = await getUserTeams(params);

            if (responseUserTeams) {
                let result: TeamModel[] = JSON.parse(JSON.stringify(responseUserTeams));

                const teamList = result.map(x => ({
                    label: x.teamName,
                    value: x.teamId.toString()
                }))
                setTeams(teamList);
                setValue(curTeamId);
            }
        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: "fetchUserTeams " + error.toString() });
            }
        }


    }

    async function fetchUserTeamInfo(userSessionData: SessionInfoModel) {
        try {
            let params = userSessionData?.userInfo?.teamId.toString() ?? "0";
            params = params + "/" + userSessionData?.userInfo?.userId.toString() ?? "0";
            let responseUserTeamInfo = await getTeamInfo(params);

            if (responseUserTeamInfo) {
                let result: TeamModel = JSON.parse(JSON.stringify(responseUserTeamInfo));
                let curUserInfo = userSessionData.userInfo;
                curUserInfo.teamColor = result.teamColor;
                curUserInfo.teamName = result.teamName;
                userSessionData.userInfo = curUserInfo;
                updateUserContext({ ...userContext, token: userSessionData.token, tokenExpiryTime: userSessionData.tokenExpiryTime, isThemeDark: userSessionData.isThemeDark, userInfo: curUserInfo });
                // updateUserContext(userSessionData);
                //setSessionData({ ...sessionData, userInfo:curUserInfo });
            }
        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: "fetchUserTeamInfo " + error.toString() });
            }
        }
    }

    async function SwitchUserTeam(sessionInfo: SessionInfoModel, isShowLoading: boolean) {
        try {
            if (value.toString() != sessionInfo.userInfo.teamId.toString()) {
                setIsSubmitting(true);
                let teamId = value == "" ? sessionInfo?.userInfo?.teamId.toString() : value.toString()
                let params = sessionInfo?.userInfo?.userId.toString() ?? "0";
                params = params + "/" + teamId ?? "0";
                let updateUserTeam = await getSwitchUserTeams(params);

                if (updateUserTeam) {
                    let result: SwitchUser = JSON.parse(JSON.stringify(updateUserTeam));
                    let curUserInfo = sessionInfo.userInfo;
                    curUserInfo.teamColor = result.color;
                    curUserInfo.teamId = result.teamId;
                    curUserInfo.teamStatus = result.teamStatus;
                    curUserInfo.teamguid = result.teamGuid;
                    curUserInfo.dateExpiry = result.dateExpired

                    sessionInfo.userInfo = curUserInfo;
                    setSessionData({ ...sessionInfo, userInfo: curUserInfo });
                    fetchDashboardAlerts(sessionInfo).then(result => {
                        fetchUserTeamInfo(sessionInfo).then(result => {
                            setIsSubmitting(false);
                            //updateUserContext({ ...userContext, userInfo: curUserInfo });
                            updateUserContext({ ...userContext, token: sessionInfo.token, tokenExpiryTime: sessionInfo.tokenExpiryTime, isThemeDark: sessionInfo.isThemeDark, userInfo: curUserInfo });
                        });
                    });
                }
            }
        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: "switch user - " + error.toString() });
            }
        }
    }

    async function onDropdownChangeHandler(userSessionData: SessionInfoModel, isShowLoading: boolean) {
        try {
            getSession().then((s) => {
                let sessionInfo: SessionInfoModel = s;
                SwitchUserTeam(sessionInfo, isShowLoading);
            });

        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: "onDropdownChangeHandler - " + error.toString() });
            }
        }
    }



    const init = () => {
        try {

            setIsSubmitting(true);

            getSession().then((ses) => {
                let sessionInfo: SessionInfoModel = ses;

                //fetch uer roles
                fetchUserRoles(sessionInfo);

                //fetch user team info
                fetchUserTeamInfo(sessionInfo);

                //fetch user teams
                fetchUserTeams(sessionInfo);

                //fetch dashboard alerts
                fetchDashboardAlerts(sessionInfo);

            }).then(() => {
                setIsSubmitting(false);
            });
        }
        catch (error) {
            setIsSubmitting(false);
            if (error) {
                setNotification({ type: "error", text: "init " + error.toString() });
            }
        }

    };


    async function fetchDashboardAlerts(userSessionData: SessionInfoModel) {
        try {
            let params: string = userSessionData.userInfo?.teamId.toString() ?? "0";
            if (userSessionData.userInfo?.teamId) {
                params = params + "/" + userSessionData.userInfo?.userId.toString() ?? "0";
            }

            let alertResponse = await getDashboardAlerts(params);

            if (alertResponse) {
                let result: DashboardAlertsModel = JSON.parse(JSON.stringify(alertResponse));

                setDashboardAlerts(result);
            }
        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: "fetchDashboardAlerts " + error.toString() });
            }
        }

    }

    const unsubscribe = () => {
        // navigation.addListener("didFocus", () => {
        if (isMountedRef.current) {
            init();
        }
        //});
    };

    useEffect(() => {
        init();
        //unsubscribe();
    }, [isMountedRef]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // setIsTabFocused(true);
            setIsSubmitting(true);
            init();
        });
        return unsubscribe;

    }, [navigation]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView>
                {/* <ScrollView> */}
                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
                {

                    isSubmitting && isSubmitting == true ? (
                        <View style={styles.processingIndicator}>
                            <ProcessingIndicator isLoading={isSubmitting} indicatorColor={theme.colors.text} />
                        </View>
                    ) :
                        (
                            <View style={{ backgroundColor: theme.colors.background, paddingTop: 60 }}>
                                <View style={[
                                    styles.platformTheme, { backgroundColor: theme.colors.background, }
                                ]}>
                                    {/* // backgroundColor: theme.colors.background,
                                        // flexDirection: 'row', justifyContent: 'flex-end',
                                        // marginHorizontal: 10

                                        //}}> */}
                                    {/* <Text style={[styles.platformThemes, { paddingTop: 12, textAlign: 'right', color: theme.colors.text, }]}>Light</Text>
                                    <Switch
                                        // style={[{ backgroundColor: theme.colors.accent }]}
                                        color={theme.colors.primary}
                                        style={[styles.switchStyle]}
                                        onValueChange={() => {
                                            console.log(userContext.isThemeDark);
                                            toggleTheme();
                                        }}
                                        value={userContext.isThemeDark}
                                    />
                                    <Text style={[styles.platformThemes, { paddingTop: 12, color: theme.colors.text }]}>Dark</Text> */}
                                </View>

                                <View style={[styles.Names, { backgroundColor: theme.colors.background }]}>
                                    <Subheading style={styles.title}>Hello {userContext.userInfo.firstName}!</Subheading>
                                    <Chip style={[styles.chip, { backgroundColor: userTeamColor }]} textStyle={{ color: Colors.white }}>{roleName}</Chip>

                                </View>
                                <DropDownPicker style={styles.Dropdown}
                                    containerProps={{
                                        height: open === true ? 170 : null,
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
                                    onChangeValue={(status) => onDropdownChangeHandler(sessionData)}

                                />

                                {/* <View style={[styles.alertContainter, { backgroundColor: theme.colors.background }]}>

                                    {(dashboardAlerts.messagesUnread > 0) ? (
                                        <TouchableOpacity
                                            onPress={() => console.log("success")}>
                                            <View style={[styles.alert, styles.alertInfo]}>
                                                <Ionicons name="information-circle" size={32} color="#004085" />
                                                <Text lightColor='#004085' style={[styles.alertText]}>You have<Text style={{ fontWeight: 'bold', color: '#004085' }}> {dashboardAlerts.messagesUnread.toString()}</Text> unread message(s).
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (<></>)
                                    }

                                    {(dashboardAlerts.calendarDay > 0) ? (
                                        <TouchableOpacity
                                            onPress={() => console.log("success")}>
                                            <View style={[styles.alert, styles.alertWarning]}>
                                                <Ionicons name="warning" size={32} color="#856404" />
                                                <Text lightColor='#856404' style={[styles.alertText]}>You have<Text style={{ fontWeight: 'bold', color: '#856404' }}> {dashboardAlerts.calendarDay.toString()}</Text> event(s) in the 24 hours.</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (<></>)
                                    }

                                    {(dashboardAlerts.calendarWeek > 0) ? (
                                        <TouchableOpacity
                                            onPress={() => console.log("success")}>
                                            <View style={[styles.alert, styles.alertInfo]}>
                                                <Ionicons name="information-circle" size={32} color="#004085" />
                                                <Text lightColor='#004085' style={[styles.alertText]}>You have<Text style={{ fontWeight: 'bold', color: '#004085' }}> {dashboardAlerts.calendarWeek.toString()}</Text> event(s) in the next week.</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (<></>)
                                    }

                                    {(dashboardAlerts.exchangeInbox > 0) ? (
                                        <TouchableOpacity
                                            onPress={() => console.log("success")}>
                                            <View style={[styles.alert, styles.alertInfo]}>
                                                <Ionicons name="information-circle" size={32} color="#004085" />
                                                <Text lightColor='#004085' style={[styles.alertText]}>You have<Text style={{ fontWeight: 'bold', color: '#004085' }}> {dashboardAlerts.exchangeInbox.toString()}</Text> exchange(s) in your Inbox.</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (<></>)
                                    }
                                    {(dashboardAlerts.fileUpload > 0) ? (
                                        <TouchableOpacity
                                            onPress={() => console.log("success")}>
                                            <View style={[styles.alert, styles.alertSuccess]}>
                                                <Ionicons name="checkmark-circle-sharp" size={32} color="green" />
                                                <Text lightColor='#155724' style={[styles.alertText]}>You have<Text style={{ fontWeight: 'bold', color: '#155724' }}> {dashboardAlerts.fileUpload.toString()}</Text> film(s) recently uploaded.
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : (<></>)
                                    }
                                </View> */}
                            </View>
                        )}
                {/* </ScrollView> */}
            </SafeAreaView >
        </View >
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,

    },

    Names:
    {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: "center",
        marginHorizontal: 10,
        marginBottom: 10
    },
    chip:
    {
        fontSize: 20,
        height: 28,
        textAlign: 'center',
        justifyContent: 'center',
        color: Colors.white,
        // backgroundColor: Colors.black,
    },
    title: {
        fontSize: 20,
        fontWeight: 'normal',
    },

    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    Picker: {
        textAlign: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "grey",
        height: 40,
        display: 'flex',
    },

    Dropdown:
    {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 0,
    },

    alertContainter:
    {
        margin: 10,
        height: '70%',
    },
    alert: {
        borderRadius: 4,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row"
    },
    alertInfo: {
        backgroundColor: "#cce5ff",
        borderColor: '#b8daff',
    },
    alertWarning: {
        backgroundColor: "#fff3cd",
        borderColor: '#ffeeba',
    },
    alertSuccess: {
        backgroundColor: "#d4edda",
        borderColor: '#c3e6cb',
    },

    alertText: {
        paddingLeft: 10,
        paddingTop: 8
    },

    platformTheme: {
        ...Platform.select({
            android: {
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginHorizontal: 10
            },
            ios: {
                margin: 10,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginHorizontal: 10,
                backgroundColor: 'blue',
            },
            default: {
                // other platforms, web for example
                backgroundColor: 'blue'
            }

        })
    },


    platformThemes: {
        ...Platform.select({
            ios: {
                marginHorizontal: 4,
            },

        })
    },


    switchStyle: {
        ...Platform.select({
            ios: {
                marginTop: 4,
            },

        })
    },

    processingIndicator: {
        flex: 1,
        justifyContent: 'center',
        marginTop: '80%',
    }

});
