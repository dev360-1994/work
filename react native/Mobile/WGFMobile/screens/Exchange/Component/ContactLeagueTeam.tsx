import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Button, Colors, Text, TextInput, useTheme } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { Formik } from "formik";
import { PreferencesContext } from "../../../PreferencesContext";
import * as yup from "yup";
import { exchangeTeamEmail, leagueTeam, sendLeagueTeamEmail } from "../../../services/ExchangeService";
import { TeamModel } from "../../../services/Model/TeamModel";
import { LeagueTeamEmailResource } from "../../../services/Model/ExchangeModel";
import { getProfileData } from "../../../services/ProfileService";
import { getUserTeams } from "../../../services/DashboardService";
import { useNavigation } from "@react-navigation/native";
import DropDown from "react-native-paper-dropdown";


const initialState = {
    mailBody: "",
    isSubmitting: false,
};

const validateSchema = yup.object({

    mailBody: yup.string().required(),

});


export default function ContactLeagueTeam() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const theme = useTheme();
    const navigation = useNavigation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(1);
    const [emails, setEmails] = useState([]);
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

    const [teams, setTeams] = useState([{ label: 'Select Team', value: '0' }]);

    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerShown: false,
        });
    });


    async function fetchUserTeams() {
        try {
            let teamId = userContext.userInfo?.teamId.toString() ?? "0";
            var result = await leagueTeam(teamId);
            // console.log(result);
            if (result) {
                const teamList = result.map(x => ({
                    label: x.teamname,
                    value: x.teamid.toString()
                }))
                setTeams(teamList);
                setValue(teamList[0]?.value);

                //set initial emails 
                var result: [] = await exchangeTeamEmail(teamList[0]?.value);
                setEmails(result);
            }
        }
        catch (error) {
            if (error) {

            }
        }


    }


    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.navigate("ExchangeFilmTab");
    }


    async function onDropdownChangeHandler(status: any) {

        try {
            var result: [] = await exchangeTeamEmail(status);
            // console.log(result);
            setEmails(result);
            console.log(emails);
        } catch (error) {
            console.log(error);
        }
    }

    async function sendEmail(values: any) {

        try {
            var teamEmails = await exchangeTeamEmail(value);
            // console.log(teamEmails);
            var teamName = "";
            if (userContext?.userInfo?.userId) {
                let responseUserTeams = await getUserTeams(userContext.userInfo.userId);
                if (responseUserTeams) {
                    let result: TeamModel[] = JSON.parse(JSON.stringify(responseUserTeams));
                    let name = result.filter(c => c.teamId === userContext.userInfo.teamId)[0];
                    teamName = name.teamName;
                }
            }
            const userProfileData = await getProfileData();
            let leagueTeamModel: LeagueTeamEmailResource = {
                senderFirstName: userContext?.userInfo?.firstName,
                senderLastName: userContext?.userInfo?.lastName,
                senderEmailAddress: userProfileData?.email,
                mailBody: values?.mailBody,
                teamEmailAddresses: teamEmails,
                teamName: teamName
            };

            // console.log(leagueTeamModel);
            // console.log(leagueTeamModel);

            // leagueTeamModel.teamEmailAddresses = [
            //     "aruntdev@gmail.com",
            //     "arielamitc9@gmail.com"
            // ]

            var promiseResult = await sendLeagueTeamEmail(leagueTeamModel);
            if (promiseResult == true) {
                navigation.navigate("ExchangeFilmTab");
            }

        } catch (error) {
            console.log(error);
        }


    }

    useEffect(() => {
        fetchUserTeams();
    }, [userContext])


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


                <Text style={{
                    fontSize: 20,
                    color: theme.colors.placeholder,
                    paddingLeft: 6,
                }}
                >Contact League Team</Text>
            </View>
            {(isSubmitting) ? (
                <></>
            ) : (
                <View style={styles.innerContainer}>
                    <Text style={{ fontWeight: "normal", fontSize: 15, padding: 20 }}>Select a team from the list below to contact their coaching staff</Text>

                    {/* <Text style={{ paddingHorizontal: 40, }}>Send To</Text> */}



                    {/* <DropDownPicker style={styles.Dropdown}
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
                    /> */}

                    <View style={{ backgroundColor: theme.colors.background }}>
                        <Formik
                            initialValues={initialState}
                            validationSchema={validateSchema}
                            onSubmit={
                                (values) => sendEmail(values)
                            }

                        >
                            {(props) => (

                                < View style={{ height: "100%" }}>
                                    <View style={{ margin: 20, paddingTop: 10 }}>

                                        <DropDown
                                            label={"Send To"}
                                            mode={"flat"}
                                            visible={open}
                                            showDropDown={() => setOpen(true)}
                                            onDismiss={() => setOpen(false)}
                                            value={value}
                                            setValue={setValue}
                                            list={teams}
                                            activeColor={userTeamColor}

                                        />

                                        <Text></Text>


                                        <TextInput
                                            ref={(input: any) => {
                                                props.mailBody = input;
                                            }}
                                            error={
                                                props.touched.mailBody && props.errors.mailBody
                                                    ? true
                                                    : false
                                            }

                                            blurOnSubmit={false}
                                            mode="flat"
                                            // autoComplete='password*'
                                            placeholder="Enter your message here..."
                                            placeholderTextColor={theme.colors.placeholder}
                                            returnKeyType="next"
                                            multiline={true}
                                            activeUnderlineColor={userTeamColor}
                                            onChangeText={props.handleChange("mailBody")}
                                            value={props.values.mailBody}
                                            onBlur={props.handleBlur("mailBody")}
                                        />


                                        <Text style={{ color: theme.colors.error }}>
                                            {/* {props.touched.mailBody && props.errors.mailBody} */}
                                        </Text>



                                        <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background }]} >
                                            <Button
                                                disabled={isSubmitting}
                                                loading={isSubmitting}
                                                mode="contained"
                                                onPress={props.handleSubmit}
                                                style={{ backgroundColor: userTeamColor, width: '100%', paddingVertical: 10 }}
                                            >
                                                <Text style={{ color: 'white' }}>Send Email</Text>
                                            </Button>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>

                </View>


            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0
    },
    innerContainer: {
        flex: 1,
        margin: 20
    },
    Dropdown: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 0,
    },
    buttonContainter:
    {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
});
