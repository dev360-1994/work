import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { OnGetHistoryDataAsync } from "../../services/UserService";
import { RootDrawerScreenProps } from "../../types";



export default function HistoryScreen({ navigation }: RootDrawerScreenProps<'History'>) {


    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const history = await OnGetHistoryDataAsync();
                console.log(history);
            } catch {
                console.log("error fetching history");
            }
        }
        fetchHistoryData();
    }, [])

    return (
        <View>
            <Text>History Screen</Text>
        </View>
    )
}