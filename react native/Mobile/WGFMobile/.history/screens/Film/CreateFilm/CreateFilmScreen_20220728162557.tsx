import React from "react";
import { View } from "react-native";
import { RootDrawerScreenProps } from "../../../types";
import { RadioButton, Text } from 'react-native-paper';




export default function CreateFilmScreen({ navigation }: RootDrawerScreenProps<'AddFilm'>) {

    const [value, setValue] = React.useState('first');

    return (

        <View style={{ flexDirection: "row", alignItems: 'center' }}>
            <View style={{ flex: 4 }}>
                <Text>Choose From The Below Options</Text>
            </View>
            <View style={{ flex: 1 }}>
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
        </View>


    )
}