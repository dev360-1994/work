import React from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { RootDrawerScreenProps } from "../../../types";
import { Button, RadioButton, Text } from 'react-native-paper';




export default function CreateFilmScreen({ navigation }: RootDrawerScreenProps<'AddFilm'>) {

    const [value, setValue] = React.useState('first');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20 }}>Choose From the Below options</Text>
            </View>
            <View style={styles.radioButtonContainer}>
                <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                    <View>
                        <Text>Upload from Device</Text>
                        <RadioButton value="device" />
                    </View>
                    <View>
                        <Text>Transfer from Google Drive</Text>
                        <RadioButton value="google" />
                    </View>
                    <View>
                        <Text>Transfer from Hudl</Text>
                        <RadioButton value="hudl" />
                    </View>
                </RadioButton.Group>
            </View>

            <View>
                <Button mode="contained" onPress={() => console.log('Pressed')}>
                    Press me
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
    }
});