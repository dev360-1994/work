import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card, RadioButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';


export default function UploadFromDevice({ navigation, route }) {
    const [screenName, setScreenName] = useState("");

    function uploadHandler() {
        // navigation.navigate("Record Game", {
        //     prevScreen: "screenName",
        //     data: "data"
        // });

        navigation.navigate({
            routeName: 'Record Game',
            params: { prevScreen: "screenName", }
        });

        navigation.dispatch(navigation.navigate({ routeName: 'Record Game', params: { sport: 'x' }, }))

    }

    const browseFile = async () => {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3],
        })
        console.log(response);
        console.log(route.name);
        setScreenName(route.name);

    }

    return (
        <View style={styles.container}>
            <Card style={{ width: "80%" }}>
                <Card.Title title="Upload From Device" />
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <Button mode="contained" style={{ width: "100%", }} color={"#4BB543"} onPress={() => { browseFile() }}>
                            <Text style={{ color: "#fff" }}>Browse File</Text>
                        </Button>
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