import { Feather } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Card, RadioButton } from "react-native-paper";
import { BASE_URL } from "../../../const";


export default function TransferFromHudl({ navigation, route }) {
    const [url, setUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [screenName, setScreenName] = useState("");

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
                    console.log(hudlUrl);

                    await axios({
                        method: 'post',
                        url: `https://2f39-103-99-202-239.in.ngrok.io/api/UploadFilm/ValidateHudlUrl`,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: hudlUrl
                    }).then((response) => {
                        console.log(response.data);
                        if (response?.status == 200) {
                            hudlUrl = response.data;

                            navigation.navigate("CreateFilmModal", {
                                prevScreen: screenName,
                                hudlUrl: hudlUrl
                            })

                        } else {
                            setErrorMessage("Error: Unable to access the video.Please check your Hudl download url.");
                        }
                    });

                }
            }
        }
    }



    function uploadHandler() {
        validateHudlUrl();
    }

    return (
        <View style={styles.container}>
            <Card style={{ width: "100%" }}>
                <Card.Title title="Transfer from Hudl" />
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <Text style={{ paddingBottom: 20 }} >Please provide the download link you received in email from Hudl</Text>
                        <View style={{ justifyContent: "space-between" }}>
                            <Text>Hudl URL: </Text>
                            <TextInput
                                placeholder="Url..."
                                style={{ borderWidth: 1, width: "100%", paddingRight: 10, paddingLeft: 5, height: 40 }}
                                onChangeText={setUrl}
                            />
                        </View>

                    </View>
                </Card.Content>
                <Card.Actions>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                        <Button mode="contained" style={{ width: 100, }} color={"grey"} onPress={() => navigation.goBack()} >
                            <Text style={{ color: "#fff" }}>Cancel</Text>
                        </Button>
                        <Button mode="contained" style={{ width: 100 }} color="#337ab7" onPress={() => uploadHandler()}>
                            <Text style={{ color: "#fff" }}>Next</Text>
                        </Button>
                    </View>

                </Card.Actions>
            </Card>

        </View>


    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        margin: 50,
        marginBottom: "90%"
    },
    header: {
        marginBottom: 30
    },
    radioButtonContainer: {
        paddingTop: 20,
        paddingBottom: 100,
    },
    radioButtonInput: {


    }
});