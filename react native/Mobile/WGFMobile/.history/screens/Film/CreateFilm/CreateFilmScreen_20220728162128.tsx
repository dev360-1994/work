import React from "react";
import { View } from "react-native";
import { RootDrawerScreenProps } from "../../../types";
import { RadioButton, Text } from 'react-native-paper';




export default function CreateFilmScreen({ navigation }: RootDrawerScreenProps<'AddFilm'>) {
    return <View>
        <Text>Create Film +</Text>
    </View>
}