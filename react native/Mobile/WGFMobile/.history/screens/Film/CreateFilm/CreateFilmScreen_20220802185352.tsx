import React from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { RootDrawerScreenProps } from "../../../types";
import { Button, Card, Divider, Paragraph, RadioButton, Text, Title } from 'react-native-paper';




export default function CreateFilmScreen({ navigation }: RootDrawerScreenProps<'AddFilm'>) {

    const [value, setValue] = React.useState('first');

    const radioButtonHandler = () => {
        if (value === "device") {
            navigation.navigate("UploadFromDevice");
        } else if (value === "google") {
            navigation.navigate("GoogleDriveUpload");
        } else if (value === "hudl") {
            navigation.navigate("TranferFromHudl");
        }
    }

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title title="Select Source" />
                <Card.Content>
                    <View style={styles.radioButtonContainer}>
                        <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                            <View style={styles.radioButtonInput}>
                                <RadioButton.Item label="Upload from Device" value="device" />
                            </View>
                            <View style={styles.radioButtonInput}>
                                <RadioButton.Item label="Transfer from Google Drive" value="google" />
                            </View>
                            <View style={styles.radioButtonInput}>
                                <RadioButton.Item label="Transfer from Hudl" value="hudl" />
                            </View>
                        </RadioButton.Group>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                        <Button mode="contained" style={{ width: "100%" }} color="#337ab7" onPress={() => radioButtonHandler()}>
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
        paddingBottom: 20,
    },
    radioButtonInput: {


    }
});