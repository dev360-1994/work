import React from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { RootDrawerScreenProps } from "../../../types";
import { Button, Divider, RadioButton, Text } from 'react-native-paper';




export default function CreateFilmScreen({ navigation }: RootDrawerScreenProps<'AddFilm'>) {

    const [value, setValue] = React.useState('first');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20 }}>Choose From the Below options</Text>
                <Divider style={{}} />
            </View>
            <View style={styles.radioButtonContainer}>
                <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                    <View style={styles.radioButtonInput}>
                        <Text>Upload from Device</Text>
                        <RadioButton value="device" />
                    </View>
                    <View style={styles.radioButtonInput}>
                        <Text>Transfer from Google Drive</Text>
                        <RadioButton value="google" />
                    </View>
                    <View style={styles.radioButtonInput}>
                        <Text>Transfer from Hudl</Text>

                        <RadioButton value="hudl" />


                    </View>
                </RadioButton.Group>
            </View>

            <View>
                <Button mode="contained" style={{ width: 100 }} color="#4BB543" onPress={() => console.log('Pressed')}>
                    <Text style={{ color: "#fff" }}>Next</Text>
                </Button>
            </View>

        </View>


    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        margin: 50,
        borderRadius: 2,
    },
    header: {
        marginBottom: 30
    },
    radioButtonContainer: {
        paddingBottom: 30
    },
    radioButtonInput: {
        flexDirection: "row"

    }
});