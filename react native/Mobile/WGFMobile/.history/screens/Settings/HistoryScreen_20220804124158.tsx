import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { OnGetHistoryDataAsync } from "../../services/UserService";
import { RootDrawerScreenProps } from "../../types";



export default function HistoryScreen({ navigation }: RootDrawerScreenProps<'History'>) {


    useEffect(() => {
        const fetchHistoryData = async () => {
            const history = await OnGetHistoryDataAsync();
            console.log(history);
        }
    })

    return (
        <View>
            <Text>History Screen</Text>
        </View>
    )
}