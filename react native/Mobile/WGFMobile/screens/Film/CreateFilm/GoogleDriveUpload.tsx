import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Divider, RadioButton, Subheading } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from "axios";
import { useTheme } from "@react-navigation/native";
import { PreferencesContext } from "../../../PreferencesContext";
import { Colors, TextInput } from 'react-native-paper';

import { Text } from '../../../components/Themed';
export default function GoogleDriveUpload({ navigation, route }) {
    const theme = useTheme();
    const [url, setUrl] = useState("");
    const [screenName, setScreenName] = useState("");
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [errorMessage, setErrorMessage] = useState("");
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

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
                            setErrorMessage("Error: Unable to access the video.Please check your Hudl download url.");
                        }
                    });

                } else {
                    setErrorMessage("Error: Unable to access the video.Please check your Hudl download url.");
                }
            } else {
                setErrorMessage("Error: Unable to access the video.Please check your Hudl download url.");
            }
        } else {
            setErrorMessage("Error: Unable to access the video.Please check your Hudl download url.");
        }
    }



    function uploadHandler() {
        validateHudlUrl();
    }

    const validateGoogleDriveLink = (url: string) => { return url.includes("folders"); }
    const validateGoogleSharedAccess = (url: string) => { return url.includes("usp=sharing"); }
    const getDriveFolderId = (url: string) => {
        let driveFolder = url.substring(url.indexOf('folders'), url.length);
        if (driveFolder.includes("usp=sharing"))
            driveFolder = driveFolder.replace("?usp=sharing", "");
        return driveFolder.split('/')[1].trim();
    }

    const GoogleDriveFiles = async (folderId: string) => {
        var result = [];
        try {
            var googleDriveApiKey = "AIzaSyDDEHkvrs1Wzn12U7xRjmGgbDqV9vr8NA4";
            var nextPageToken = "";
            do {
                var folderContentsUri = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${googleDriveApiKey}`;
                if (nextPageToken.length > 0) {
                    folderContentsUri += `&pageToken=${nextPageToken}`;
                }
                let apiData;
                await axios({
                    method: 'get',
                    url: folderContentsUri,
                }).then((response) => {
                    apiData = response.data?.files;
                });
                apiData?.forEach(function (value) {
                    result.push({
                        "id": value?.id,
                        "name": value?.name
                    });
                });
            } while (nextPageToken && nextPageToken.length > 0);

        } catch (ex) {
        }

        navigation.navigate("CreateFilmModal", {
            prevScreen: screenName,
            driveFiles: result
        })
    }


    const validateCloudUrl = () => {
        let cloudUrl = url;
        if (cloudUrl?.trim()) {
            if (cloudUrl.indexOf('drive.google.com') > -1) {
                const cloudURLType = "google";
                let isValidDriveLink = validateGoogleDriveLink(cloudUrl);
                if (isValidDriveLink) {
                    //To-do 
                    let isValidSharedLink = validateGoogleSharedAccess(cloudUrl);
                    if (!isValidSharedLink)
                        cloudUrl = cloudUrl + "?usp=sharing";
                    //Get list of all files located at provided address
                    let driveFolderId = getDriveFolderId(cloudUrl);

                    GoogleDriveFiles(driveFolderId);
                }
            }
            else {

                setErrorMessage("Enter URL");

            }
        }
        else {
            setErrorMessage("Enter URL");
        }
    }

    const getTextColor = () => {
        return theme.colors.background === "rgb(1, 1, 1)" ? "#fff" : "#fff";
    }
    return (
        <View style={styles.container}>
            <Card style={{ justifyContent: 'center', width: "100%", height: "90%" }}>

                <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
                    <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '600', marginBottom: 16 }}>Transfer from Google Drive</Text>
                    <Subheading style={{ color: Colors.grey500 }}>Provide the file share URL where your video is located.</Subheading>
                </View>
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>

                            <TextInput
                                mode="flat"
                                placeholder="URL"
                                placeholderTextColor={theme.colors.placeholder}
                                autoCapitalize="none"
                                activeUnderlineColor={Colors.blue700}
                                style={{ backgroundColor: theme.colors.background, width: 300 }}
                                error={(errorMessage && errorMessage.length > 0) ? true : false}
                                onChangeText={setUrl}
                            />
                            {
                                (errorMessage && errorMessage.length > 0) ?
                                    <Text style={{ color: "red" }}>{errorMessage}</Text> : null
                            }

                        </View>
                    </View>
                </Card.Content>
            </Card>

            <View style={{ width: "100%", marginTop: 20 }}>
                <Button
                    mode="contained"
                    style={{ width: "100%", paddingVertical: 10, backgroundColor: userTeamColor, }} onPress={() => { validateCloudUrl(); }}>
                    <Text style={{ color: '#ffffff' }} >Next</Text>
                </Button>

            </View>



        </View >


    )

}


const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     flexDirection: "column",
    //     alignItems: "center",
    //     margin: 50,
    //     marginBottom: "90%"
    // },
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