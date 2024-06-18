import { Feather } from "@expo/vector-icons";
import axios from "axios";
//import { theme } from "native-base";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, Colors, TextInput, RadioButton, Subheading, useTheme } from "react-native-paper";
import { BASE_URL } from "../../../const";
import { PreferencesContext } from "../../../PreferencesContext";

export default function TransferFromHudl({ navigation, route }) {
    const [url, setUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [screenName, setScreenName] = useState("");
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    const theme = useTheme();
    const isValidGuid = (stringToTest: any) => {
        if (stringToTest[0] === "{") {
            stringToTest = stringToTest.substring(1, stringToTest.length - 1);
        }
        let regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
        return regexGuid.test(stringToTest);
    }

    useEffect(() => {
        setScreenName(route.name);
    });

    const validateHudlUrl = async () => {
        let hudlUrl = url;
        if (hudlUrl !== "") {
            var domain = hudlUrl.trim().replace(/(^\w+:|^)\/\//, '').split('/');
            if (domain.length == 4) {
                var isGuidValid = isValidGuid(domain[3]);
                if (domain[0] == "www.hudl.com" && domain[1] == "download" && domain[2] == "file" && domain.length == 4 && isGuidValid) {

                    await axios({
                        method: 'post',
                        url: `${BASE_URL}/api/UploadFilm/ValidateHudlUrl`,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: hudlUrl
                    }).then((response) => {
                        if (response?.status == 200) {
                            hudlUrl = response.data;
                            navigation.navigate("CreateFilmModal", {
                                prevScreen: screenName,
                                hudlUrl: hudlUrl
                            })

                        } else {
                            setErrorMessage("Error: Unable to access the video. Please check your Hudl download url.");
                        }
                    });

                } else {
                    setErrorMessage("Error: Unable to access the video. Please check your Hudl download url.");
                }
            } else {
                setErrorMessage("Error: Unable to access the video. Please check your Hudl download url.");
            }
        } else {
            setErrorMessage("Error: Unable to access the video. Please check your Hudl download url.");
        }
    }



    function uploadHandler() {
        validateHudlUrl();
    }

    return (
        <View style={styles.container}>
            <Card style={{ justifyContent: 'center', width: "100%", height: "90%" }}>
                <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
                    <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '600', marginBottom: 16 }}>Transfer from Hudl</Text>
                    <Subheading style={{ color: Colors.grey500 }}>Please provide the download link you received in email from Hudl.</Subheading>
                </View>
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <View style={{ width: '100%' }}>
                            <TextInput
                                placeholder="Hudl URL:"
                                activeUnderlineColor={Colors.blue700}
                                placeholderTextColor={theme.colors.placeholder}
                                style={{ backgroundColor: theme.colors.background, }}
                                onChangeText={setUrl}
                                error={(errorMessage && errorMessage.length > 0) ? true : false}
                                onChange={() => { setErrorMessage("") }}
                            />
                            {
                                (errorMessage && errorMessage.length > 0) ?
                                    <Text style={{ color: "red" }}>{errorMessage}</Text> : null
                            }
                        </View>

                    </View>
                </Card.Content>
            </Card>

            <View style={{ width: "100%", margin: 20 }}>
                <Button
                    mode="contained"
                    style={{ width: "100%", paddingVertical: 10, backgroundColor: userTeamColor, }} onPress={() => { uploadHandler(); }}>
                    <Text style={{ color: '#ffffff' }}>Next</Text>
                </Button>

            </View>



        </View>


    )

}


const styles = StyleSheet.create({

    container:
    {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        margin: 20,

    },

    header: {
        marginBottom: 20
    },
    radioButtonContainer: {
        height: "80%",
        alignItems: "center",
        justifyContent: "center",

    },

});