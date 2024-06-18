import React from "react";
import { View } from "react-native";
import { RootDrawerScreenProps } from "../../../types";
import { RadioButton, Text } from 'react-native-paper';




export default function CreateFilmScreen({ navigation }: RootDrawerScreenProps<'AddFilm'>) {

    const [value, setValue] = React.useState('first');

    return (
        <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
            <View>
                <Text>First</Text>
                <RadioButton value="first" />
            </View>
            <View>
                <Text>Second</Text>
                <RadioButton value="second" />
            </View>
        </RadioButton.Group>
    )
}