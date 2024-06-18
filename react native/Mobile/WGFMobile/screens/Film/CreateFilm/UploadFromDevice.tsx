import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, Alert, Image, Platform } from "react-native";
import { Button, Card, RadioButton, Subheading, Title, useTheme, Divider } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { PreferencesContext } from "../../../PreferencesContext";
import { Colors } from 'react-native-paper';
import { Text } from '../../../components/Themed';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { ScrollView } from "react-native-gesture-handler";
import { transparent } from "react-native-paper/lib/typescript/styles/colors";
import * as VideoThumbnails from 'expo-video-thumbnails';
import ProcessingIndicator from "../../../components/ProcessingIndicator";

export default function UploadFromDevice({ navigation, route }) {

    const theme = useTheme();
    const [screenName, setScreenName] = useState("");
    const [counter, setCounter] = useState(0);
    const [videoUri, setVideoUri] = useState<ImagePicker.ImageInfo[] | undefined>(undefined);
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setloading] = useState(false);

    function uploadHandler() {
        if (videoUri == null || videoUri.length == 0) {

            setErrorMessage("Please select at least one video.");
        }

        if (videoUri && videoUri.length <= 0 && videoUri != null) return;

        // videoUri.sort((a, b) => {
        //     let fa = a.videoUri.uri?.split("/").pop().toLowerCase(),
        //         fb = b.videoUri.uri?.split("/").pop().toLowerCase();

        //     if (fa < fb) {
        //         return -1;
        //     }
        //     if (fa > fb) {
        //         return 1;
        //     }
        //     return 0;
        // });

        if (videoUri != null) {
            setErrorMessage("");
            navigation.navigate("CreateFilmModal", {
                prevScreen: screenName,
                multiUri: videoUri
            });
        }
    }

    useEffect(() => {
        setScreenName(route.name);
    }, []);

    useEffect(() => {
        //value of state is used here therefore must be passed as a dependency
    }, [videoUri, counter])



    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;

    const browseFile = async () => {
        setloading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsMultipleSelection: true,
            //allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: 5
        });

        setErrorMessage('');
        if (!result.cancelled && result.cancelled === false) {
            if (result.selected) {

                if (videoUri && videoUri.length > 0) {
                    let selectedVideos = videoUri;
                    // result.selected.forEach(function (item) {
                    //     item.fileName = item.uri;
                    //     selectedVideos.push(item);
                    // })

                    for (let i = 0; i < result.selected.length; i++) {
                        if (Platform.OS === 'ios') {
                            const { uri } = await VideoThumbnails.getThumbnailAsync(
                                result.selected[i].uri
                            );
                            result.selected[i].fileName = uri;
                        } else {
                            result.selected[i].fileName = result.selected[i].uri;
                        }
                        selectedVideos.push(result.selected[i]);
                    }
                    setVideoUri(selectedVideos);
                }
                else {
                    //setVideoUri(result.selected);
                    for (let i = 0; i < result.selected.length; i++) {
                        if (Platform.OS === 'ios') {
                            const { uri } = await VideoThumbnails.getThumbnailAsync(
                                result.selected[i].uri
                            );
                            result.selected[i].fileName = uri;
                        } else {
                            result.selected[i].fileName = result.selected[i].uri;
                        }
                    }
                    // let selectedVideos = videoUri;
                    // result.selected.forEach(function (item) {
                    //     item.fileName = item.uri;
                    //     selectedVideos.push(item);
                    // });
                    setVideoUri(result.selected);
                }
            } else {
                if (videoUri && videoUri.length > 0) {
                    let selectedVideos = videoUri;
                    if (Platform.OS === 'ios') {
                        const { uri } = await VideoThumbnails.getThumbnailAsync(
                            result.uri
                        );
                        result.fileName = uri;
                    } else {
                        result.fileName = result.uri;
                    }
                    selectedVideos.push(result);
                    setVideoUri(selectedVideos);
                }
                else {
                    let selected = new Array();
                    if (Platform.OS === 'ios') {
                        const { uri } = await VideoThumbnails.getThumbnailAsync(
                            result.uri
                        );
                        result.fileName = uri;
                    } else {
                        result.fileName = result.uri;
                    }
                    selected.push(result);
                    setVideoUri(selected);
                }
            }
            setCounter(counter + 1);
        }
        setloading(false);
    }




    function deleteUri(id: number) {
        setVideoUri(undefined);
        let videoUriList = videoUri;
        for (var i = 0; i < videoUriList.length; i++) {
            var obj = videoUriList[i];

            if (obj.assetId === id) {
                videoUriList.splice(i, 1);
                i--;
            }
        }
        setVideoUri(videoUriList);
    }

    //const uri = videoUri?.split("/").pop()
    function deleteFilmMenuHandler(id: number) {
        return Alert.alert(
            "Remove Film",
            `Are you sure you want to remove from selection?`,
            [
                {
                    text: "Yes",
                    onPress: async () => { deleteUri(id) }
                },
                {
                    text: "No",
                },
            ]
        );
    }

    return (

        <View style={styles.container}>
            <Card style={{ justifyContent: 'center', width: "100%", height: "88%" }}>
                <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
                    <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '600', marginBottom: 16 }}>Upload from Device</Text>
                    <Subheading style={{ color: Colors.grey500 }}>Please select the video files from your device for upload.</Subheading>
                </View>
                <Card.Content>
                    <View
                        style={styles.subContainer}>

                        <TouchableOpacity

                            onPress={() => { browseFile() }}>
                            <Button mode="contained" style={[styles.browseButton]} >
                                <Text style={{ color: theme.colors.text }}>Browse File</Text>

                            </Button>
                        </TouchableOpacity>


                        {

                            (videoUri?.length != undefined || videoUri?.length != 0) &&
                            //                     <View style={styles.UrlBox}>
                            //                         {loading === true ?
                            //                             <View style={{ marginTop: '50%' }}>
                            //                                 <ProcessingIndicator isLoading={loading} indicatorColor={theme.colors.text} />
                            //                             </View> :

                            //                             <FlatList
                            //                                 error={(errorMessage && errorMessage.length > 0) ? true : false}
                            //                                 onChange={() => { setErrorMessage("") }}
                            //                                 key={"VideoList"}
                            //                                 data={videoUri}
                            //                                 progressViewOffset={100}
                            //                                 contentContainerStyle={{ width: '100%' }}
                            //                                 //style={{ display: 'flex', flexDirection: 'row', borderColor: 'blue', borderWidth: 2 }}
                            //                                 numColumns={2}
                            //                                 renderItem={({ item }) => (
                            //                                     <View style={[styles.wrapper, theme.dark ? styles.borderForDarkTheme : styles.borderForLightTheme, { backgroundColor: "transparent", width: '50%' }]}>
                            //                                         <View
                            //                                             style={{ margin: 7 }}
                            //                                         >
                            //                                             {
                            //                                                 // item.fileName != "" &&
                            //                                                 // <Text style={{ color: theme.colors.text }}>
                            //                                                 //     {/* {item.fileName} */}
                            //                                                 //     {videoUri && <Image source={{ uri: item.fileName }} style={{ width: 200, height: 200 }} />}
                            //                                                 // </Text>
                            //                                                 item.fileName != "" && <Image source={{ uri: item.fileName }} style={{ width: 150, height: 150 }} />
                            //                                             }
                            //                                             <View style={{ backgroundColor: '#4b4b4b', width: 30, borderRadius: 100, position: 'absolute', alignSelf: 'flex-end', marginTop: 7, right: 7 }}>
                            //                                                 <MaterialIcon
                            //                                                     size={20}
                            //                                                     name={"delete"}
                            //                                                     color='#ffffff'
                            //                                                     style={{ margin: 5 }}
                            //                                                     onPress={() => {
                            //                                                         deleteFilmMenuHandler(item.assetId);
                            //                                                     }}
                            //                                                 /></View>
                            //                                         </View>

                            //                                         {/* <View style={[styles.Icon, { backgroundColor: "transparent" }]}>
                            //                                             <MaterialIcon
                            //                                                 size={30}
                            //                                                 name={"delete"}
                            //                                                 color={theme.colors.text}
                            //                                                 onPress={() => {
                            //                                                     deleteFilmMenuHandler(item.assetId);
                            //                                                 }}
                            //                                             />
                            //                                         </View> */}

                            //                                     </View>
                            //                                 )}
                            //                             />
                            //                         }
                            //                         {
                            //                             (errorMessage && errorMessage.length > 0) ?
                            //                                 <Text style={{ color: "red" }}>{errorMessage}</Text> : null
                            //                         }
                            //                     </View>
                            //                 }
                            //             </View>
                            //         </Card.Content>
                            //     </Card>




                            <View style={styles.UrlBox}>
                                <FlatList
                                    key={"VideoList"}
                                    data={videoUri}
                                    error={(errorMessage && errorMessage.length > 0) ? true : false}
                                    onChange={() => { setErrorMessage("") }}
                                    progressViewOffset={100}
                                    renderItem={({ item }) => (
                                        <View style={[styles.wrapper, theme.dark ? styles.borderForDarkTheme : styles.borderForLightTheme, { backgroundColor: "transparent" }]}>
                                            <View
                                                style={{ flex: 1, margin: 10, }}
                                            >
                                                {
                                                    item.name != "" &&
                                                    <Text style={{ color: theme.colors.text }}>
                                                        {item.uri?.split("/").pop()}
                                                    </Text>
                                                }

                                            </View>

                                            <View style={[styles.Icon, { backgroundColor: "transparent" }]}>
                                                <MaterialIcon
                                                    size={30}
                                                    name={"delete"}
                                                    color={theme.colors.text}
                                                    onPress={() => {
                                                        deleteFilmMenuHandler(item.assetId);
                                                    }}
                                                />

                                            </View>

                                        </View>
                                    )}
                                />
                                {
                                    (errorMessage && errorMessage.length > 0) ?
                                        <Text style={{ color: "red" }}>{errorMessage}</Text> : null
                                }
                            </View>
                        }
                    </View>
                </Card.Content>
            </Card>
            <View style={{ width: "100%", margin: 30 }}>
                <Button
                    mode="contained"
                    style={{ width: "100%", paddingVertical: 10, backgroundColor: userTeamColor, }} onPress={() => uploadHandler()}>
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
        marginTop: 20
    },
    subContainer:
    {
        marginTop: 20,
        height: "auto",
        justifyContent: "center",
        width: '100%',
    },
    header: {
        marginBottom: 30
    },
    browseButton: {
        width: "100%",
        height: 120,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderStyle: 'dashed',
        borderRadius: 5,
        shadowColor: 'transparent',
        borderColor: Colors.grey500,
        borderWidth: 1,

    },
    UrlBox: {
        width: '100%',
        // height: '90%',
        maxHeight: '67%',
        marginVertical: 10,
    },
    wrapper: {
        display: "flex",
        flexDirection: "row",
    },
    Icon: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    }
});