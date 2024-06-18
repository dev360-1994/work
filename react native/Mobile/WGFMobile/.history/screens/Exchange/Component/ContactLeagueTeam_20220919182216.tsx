import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Button, Colors, Text, TextInput, useTheme } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { Formik } from "formik";
import { PreferencesContext } from "../../../PreferencesContext";
import * as yup from "yup";
import { leagueTeam } from "../../../services/ExchangeService";
import { TeamModel } from "../../../services/Model/TeamModel";


const initialState = {
    mailBody: "",
    isSubmitting: false,
};

const validateSchema = yup.object({

    mailBody: yup.string().required(),

});


export default function ContactLeagueTeam({ navigation }) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(1);
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
                console.log(teamList);
                setTeams(teamList);
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

    }

    async function sendEmail() {

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
                <View>
                    <Text style={{ padding: 20 }}>Select a team from the list below to contact their coaching staff</Text>

                    <Text style={{ paddingHorizontal: 40, }}>Send To</Text>

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



                                        <View style={[styles.buttonContainter, { backgroundColor: theme.colors.background, paddingLeft: 20, paddingRight: 20 }]} >
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
        marginVertical: 20,
    },
});
