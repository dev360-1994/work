import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Colors, Text, useTheme } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";



export default function ContactLeagueTeam({ navigation }) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(1);


    const [teams, setTeams] = useState([
        { label: 'Administrator Role Settings', value: 1 },
        { label: 'Coach Role Settings', value: 2 },
        { label: 'Athlete Role Settings', value: 3 },
        { label: 'Parent Role Settings', value: 4 },
        { label: 'Referee Role Settings', value: 5 },
        { label: 'Press Role Settings', value: 6 }
    ]);

    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            headerShown: false,
        });
    });




    function goBack() {
        navigation.getParent()?.setOptions({
            headerShown: true,
        });
        navigation.navigate("ExchangeFilmTab");
    }


    async function onDropdownChangeHandler(status: any) {
        setLabel(teams.filter(c => c.value === 1)[0].label.toLowerCase());
        onRefreshHandler();
    }



    return (
        <SafeAreaView style={styles.container}>
            <View style={[{
                // marginTop: 100,
            },
            {
                backgroundColor: theme.colors.background, width: '100%', padding: 20, marginTop: Platform.OS === "ios" ? 0 : 0, zIndex: 1,
                paddingTop: Platform.OS === "ios" ? 50 : 20,
                flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#cacaca',
            }
            ]}>
                <MaterialIcons name="arrow-back" size={24} style={{ color: theme.colors.text }} onPress={() => goBack()} />


                <Text style={{
                    fontSize: 20,
                    color: theme.colors.placeholder,
                    paddingLeft: 6,
                }}
                >Contact League Team</Text>
            </View>
            {(isSubmitting) ? (
                <></>
            ) : (
                <View>
                    <Text style={{ padding: 20 }}>Select a team from the list below to contact their coaching staff</Text>

                    <Text style={{ paddingHorizontal: 40, }}>Send To</Text>

                    <DropDownPicker style={styles.Dropdown}
                        containerProps={{
                            // height: "100%",
                            // backgroundColor: "#ffffff",
                        }}
                        open={open}
                        value={value}
                        items={teams}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setTeams}
                        multiple={false}
                        containerStyle={{ margin: 10, width: '95%' }}
                        onChangeValue={(status) => onDropdownChangeHandler(status)}
                    />
                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 0, margin: 0
    },
    Dropdown: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 0,
    },
});
