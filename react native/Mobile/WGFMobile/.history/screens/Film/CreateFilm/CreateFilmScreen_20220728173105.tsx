import React from "react";
import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { RootDrawerScreenProps } from "../../../types";
import { Button, Card, Divider, Paragraph, RadioButton, Text, Title } from 'react-native-paper';




export default function CreateFilmScreen({ navigation }: RootDrawerScreenProps<'AddFilm'>) {

    const [value, setValue] = React.useState('first');

    return (
        <View style={styles.container}>
            <Card>
                <Card.Title title="Card Title" subtitle="Card Subtitle" />
                <Card.Content>
                    <Title>Card title</Title>
                    <Paragraph>Card content</Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button mode="contained" style={{ width: 100 }} color="#4BB543" onPress={() => console.log('Pressed')}>
                        <Text style={{ color: "#fff" }}>Cancel</Text>
                    </Button>
                    <Button mode="contained" style={{ width: 100 }} color="#4BB543" onPress={() => console.log('Pressed')}>
                        <Text style={{ color: "#fff" }}>Next</Text>
                    </Button>
                </Card.Actions>
            </Card>
            <View style={styles.header}>
                <Text style={{ fontSize: 20 }}>Select Source</Text>
                <Divider style={{}} />
            </View>
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
    },
    header: {
        marginBottom: 30
    },
    radioButtonContainer: {
        paddingBottom: 30
    },
    radioButtonInput: {


    }
});