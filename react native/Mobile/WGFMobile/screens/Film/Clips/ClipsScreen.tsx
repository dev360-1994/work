import React, { useEffect, useRef, useState } from "react";
import { Colors, DataTable, useTheme, withTheme } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, SafeAreaView, View, Text } from 'react-native';
import { ClipModel } from "../../../services/Model/ClipModel";
import { getPlaylistClips } from "../../../services/PlaylistClipService";
import { MessageModel } from "../../../services/Model/MessageModel";
import ProcessingIndicator from "../../../components/ProcessingIndicator";
import { useNavigation } from "@react-navigation/native";
import { PlaylistContext } from "../Component/PlaylistContext";
import { PreferencesContext } from '../../../PreferencesContext';
import { ScrollView } from "react-native-gesture-handler";



function ClipsScreen({ route }: { route: any }) {

    const navigation = useNavigation();
    const playlistContext = React.useContext(PlaylistContext);
    const theme = useTheme();
    const { updateUserContext, userContext } = React.useContext(PreferencesContext);
    const userTeamColor = userContext.userInfo.teamColor == undefined ? '#000000' : userContext.userInfo.teamColor;
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setNotification] = useState(new MessageModel);

    const [hasClips, setHasClips] = useState<boolean>(false);
    const [clipList, setClipList] = useState<ClipModel[]>([]);
    const [selectedClip, setClip] = useState<ClipModel>(new ClipModel());

    const onPressClipPlayHandler = (clip: ClipModel) => {

        playlistContext.params.clipId = clip.clipId;
        playlistContext.params.order = clip.clipOrder;

        setClip(clip);

        navigation.navigate('VIDEO', {
            screen: 'VIDEO',
            params: { playlist: playlistContext.params.playlist, view: playlistContext.params.view, clipId: clip.clipId, order: clip.clipOrder, clipList: clipList, title: playlistContext.title },
        });

    };

    async function fetchClips(playlist: number, view: number) {
        try {
            setIsSubmitting(true);
            let params = playlist.toString() ?? "0";
            params = params + "/" + view.toString() ?? "0";

            var resultPromise = await getPlaylistClips(params);

            if (resultPromise) {
                let result: ClipModel[] = JSON.parse(JSON.stringify(resultPromise));

                if (result && result.length > 0) {
                    setHasClips(true);
                    if (playlistContext.params.clipId <= 0) {
                        setClip(result[0]);
                        playlistContext.params.clipId = result[0].clipId;
                        playlistContext.params.order = result[0].clipOrder;
                    }
                    else {
                        let selClip: ClipModel = result.find((element) => {
                            console.log("==selClip==", element.clipOrder)
                            return (element.clipId === playlistContext.params.clipId && element.clipOrder === playlistContext.params.order);
                        }) ?? new ClipModel();
                        // let selClip: ClipModel = result.map((element, i) => {
                        //     console.log("==selClip==", element.clipOrder)
                        //     return (element.clipId === playlistContext.params.clipId && element.clipOrder === playlistContext.params.order);
                        // }) ?? new ClipModel();
                        setClip(selClip);
                    }
                }
                else {
                    setHasClips(false);
                }
                setClipList(result);
                setIsSubmitting(false);
            }
        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: error.toString() });
            }
            setIsSubmitting(false);
        }
    }

    const init = () => {
        try {
            //fetch clips list
            fetchClips(playlistContext.params.playlist, playlistContext.params.view);
        }
        catch (error) {
            setIsSubmitting(false);
            if (error) {
                setNotification({ type: "error", text: error.toString() });
            }
        }

    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setIsSubmitting(true);
            init();
        });


        if (playlistContext.params.clipId != selectedClip.clipId) {
            setIsSubmitting(true);
            init();
        }

        return unsubscribe;
    }, [hasClips, selectedClip, clipList, isSubmitting]);

    useEffect(() => {
        // setClipList([]);

        setHasClips(false);

        init();
    }, []);



    return (
        <SafeAreaView>

            {(isSubmitting) ? (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    marginTop: '80%',
                }}>
                    <ProcessingIndicator isLoading={isSubmitting} indicatorColor={theme.colors.text} />
                </View>
            ) : (

                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title textStyle={{ color: theme.colors.text }}>Order</DataTable.Title>
                        <DataTable.Title textStyle={{ color: theme.colors.text }}>QTR</DataTable.Title>
                        <DataTable.Title textStyle={{ color: theme.colors.text }}>ODK</DataTable.Title>
                        <DataTable.Title textStyle={{ color: theme.colors.text }}>Result</DataTable.Title>
                    </DataTable.Header>
                    <ScrollView>
                        {(hasClips) ? (
                            clipList.map((item) =>
                                <TouchableOpacity key={item.clipId.toString() + "_" + item.clipOrder.toString()} onPress={() => onPressClipPlayHandler(item)}>
                                    <DataTable.Row style={((playlistContext.params.clipId == item.clipId || playlistContext.params.clipId == 0) && playlistContext.params.order == item.clipOrder) ? { backgroundColor: userTeamColor } : styles(theme).normalRow}>
                                        <DataTable.Cell textStyle={((playlistContext.params.clipId == item.clipId || playlistContext.params.clipId == 0) && playlistContext.params.order == item.clipOrder) ? styles(theme).selectedCell : styles(theme).normalCell}>{item.clipOrder}</DataTable.Cell>
                                        <DataTable.Cell textStyle={((playlistContext.params.clipId == item.clipId || playlistContext.params.clipId == 0) && playlistContext.params.order == item.clipOrder) ? styles(theme).selectedCell : styles(theme).normalCell}>{item.footballQtr}</DataTable.Cell>
                                        <DataTable.Cell textStyle={((playlistContext.params.clipId == item.clipId || playlistContext.params.clipId == 0) && playlistContext.params.order == item.clipOrder) ? styles(theme).selectedCell : styles(theme).normalCell}>{item.footballOdk}</DataTable.Cell>
                                        <DataTable.Cell textStyle={((playlistContext.params.clipId == item.clipId || playlistContext.params.clipId == 0) && playlistContext.params.order == item.clipOrder) ? styles(theme).selectedCell : styles(theme).normalCell}>{item.footballResult}</DataTable.Cell>
                                    </DataTable.Row>
                                </TouchableOpacity>
                            )
                        )
                            : (
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>No clips found.</Text>
                                </View>
                            )}
                    </ScrollView>
                </DataTable>
            )}

        </SafeAreaView>
    );
}


const styles = (theme) => StyleSheet.create({
    selectedRow:
    {
        backgroundColor: Colors.black,
    },
    normalRow:
    {
        backgroundColor: theme.colors.surface,

    },
    selectedCell:
    {
        color: Colors.white,
    },
    normalCell: {
        color: theme.colors.text
    }
});
export default withTheme(ClipsScreen, styles);








