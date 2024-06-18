import { ThemeProvider, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Pressable, StyleSheet } from 'react-native';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { CLIP_SERVER_NAME } from '../../../const';
import { ClipModel } from '../../../services/Model/ClipModel';
import { MessageModel } from '../../../services/Model/MessageModel';
import { getPlaylistClips } from '../../../services/PlaylistClipService';
import { Video, AVPlaybackStatus, VideoFullscreenUpdateEvent } from 'expo-av';
import { Colors, Menu } from 'react-native-paper';
import * as ScreenOrientation from 'expo-screen-orientation';

import { VideoModel } from '../../../services/Model/VideoModel';
import { PlaylistContext } from '../Component/PlaylistContext';
import ProcessingIndicator from '../../../components/ProcessingIndicator';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { uploadVideo } from '../../../services/VideoUploadService';


const videoQuality = "standard-definition";

const initialVideoStatus = {
    androidImplementation: '',
    didJustFinish: false,
    durationMillis: 0,
    isBuffering: false,
    isLoaded: false,
    isLooping: false,
    isMuted: false,
    isPlaying: false,
    playableDurationMillis: 0,
    positionMillis: 0,
    progressUpdateIntervalMillis: 0,
    rate: 0,
    shouldCorrectPitch: false,
    shouldPlay: false,
    uri: '',
    volume: 1
}


export default function VideoScreen({ route }: { route: any }) {
    const navigation = useNavigation();
    const playerRef = React.useRef(null);
    const playlistContext = React.useContext(PlaylistContext);

    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [message, setNotification] = React.useState(new MessageModel);

    const [videoStatus, setVideoStatus] = React.useState<VideoModel>(initialVideoStatus);
    const [isBuffering, setIsBuffering] = React.useState<boolean>(false);
    const [videoUrl, setVideoUrl] = React.useState<string>('');
    const [hasClips, setHasClips] = React.useState<boolean>(false);
    const [clipList, setClipList] = React.useState<ClipModel[]>();
    const [selectedClip, setClip] = React.useState<ClipModel>(new ClipModel());
    const [isPreloading, setPreloading] = React.useState<boolean>(false);

    const [orientation, setOrientation] = React.useState(ScreenOrientation.Orientation.PORTRAIT_UP);

    const [menuVisible, setMenuVisible] = React.useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [filmGuild, setFilmGuid] = useState("");
    const [playlistId, setPlaylistId] = useState(0);



    const openDeviceMediaHandler = async () => {
        const response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1
        })
        if (!response?.cancelled) {
            console.log(response?.uri);
            const uri = response?.uri;
            const data = new FormData();
            data.append("videoFile", {
                name: response?.uri.split("/").pop(),
                type: "video/mp4",
                uri
            });
            data.append("filmGuid", filmGuild);
            data.append("playlistId", playlistId);
            data.append("clipOrder", `${0}`);

            const response = await uploadVideo(data);
            if (response.status == 200) {
                console.log("uploaded 200");
            }

        }

        // console.log(response); // return obj{cancelled: boolean}

    }

    navigation.getParent()?.setOptions({

        headerRight: () => (
            <Pressable onPress={openMenu}
                // onPress={() => navigation.navigate('Modal')}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}>

                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <FontAwesome
                            name="ellipsis-v"
                            size={30}
                            color="white"
                            style={{ marginRight: 20 }} />
                    }>
                    <Menu.Item onPress={() => {
                        closeMenu(); navigation.navigate("RecordGame", {
                            filmTitle: route[0].params.title,
                            filmGuid: filmGuild,
                            playListid: playlistId
                        })
                    }} title={"Record More"} />
                    <Menu.Item onPress={() => { closeMenu(); openDeviceMediaHandler(); }} title={"Upload from Device"} />
                </Menu>

            </Pressable>
        )
    });


    const onFullscreenUpdate = async ({ fullscreenUpdate }: VideoFullscreenUpdateEvent) => {

        // switch (fullscreenUpdate) {
        //     case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
        //         await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
        //         //await ScreenOrientation.unlockAsync(); // only on Android required
        //         break;
        //     case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
        //         //await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) // only on Android required
        //         await ScreenOrientation.unlockAsync(); // only on Android required
        //         break;
        // }
    }

    // console.log(route);



    function getAzureBlobURLForClip(filmServerUrl: string, videoQuality: string, clip: ClipModel) {
        let resultUrl: string = filmServerUrl + "/" + clip.teamId + "/" + clip.filmGuid;

        switch (videoQuality) {
            case "high-definition":
                resultUrl = resultUrl + "/1080p/" + clip.clipClientName;
                break;
            case "standard-definition":
                resultUrl = resultUrl + "/480p/" + clip.clipClientName;
                break;
            default:
                resultUrl = resultUrl + "/480p/" + clip.clipClientName;
                break;
        }
        return resultUrl;

    }


    function getFileServerURLForClip(videoQuality: string, clip: ClipModel) {

        let resultUrl: string = "https://" + clip.teamServer + "/" + clip.teamDisk + "/" + clip.teamGuid + "/mp4";

        switch (videoQuality) {
            case "high-definition":
                resultUrl = resultUrl + "/1080p/" + clip.clipGuid + ".1080p.mp4";
                break;
            case "standard-definition":
                resultUrl = resultUrl + "/480p/" + clip.clipGuid + ".480p.mp4";
                break;
            default:
                resultUrl = resultUrl + "/480p/" + clip.clipGuid + ".480p.mp4";
                break;
        }

        return resultUrl;
    }


    function getClipSourceUrl(videoQuality: string, clip: ClipModel) {
        let resultUrl: string = "";

        if (clip) {
            if (clip.clipServerName == CLIP_SERVER_NAME) {
                resultUrl = getAzureBlobURLForClip("", videoQuality, clip);
            }
            else {
                resultUrl = getFileServerURLForClip(videoQuality, clip);
            }
        }

        return resultUrl;
    }


    function updateContext(clip: ClipModel) {
        playlistContext.params.clipId = clip.clipId;
        playlistContext.params.order = clip.clipOrder;
    }

    async function fetchSelectedClip(playlist: number, view: number, clipId: number, order: number) {
        let url = '';
        let restartFilm = false;
        try {


            if (clipList) {
                if (clipId <= 0) {
                    const clipIndex = clipList.findIndex(x => x.clipId === playlistContext.params.clipId && x.clipOrder === playlistContext.params.order);


                    setClip(clipList[clipIndex]);
                    setFilmGuid(clipList[clipIndex]?.filmGuid);
                    setPlaylistId(clipList[clipIndex]?.playlistId);
                    // console.log(route);
                    url = getClipSourceUrl(videoQuality, clipList[clipIndex]);
                    updateContext(clipList[clipIndex]);
                }
                else {
                    //const clipIndex = clipList.map(function (x) { return x.clipId; }).indexOf(clipId);
                    const clipIndex = clipList.findIndex(x => x.clipId === clipId && x.clipOrder === order);


                    if (selectedClip.clipId == clipId && selectedClip.clipOrder != order) {
                        restartFilm = true;
                    }

                    setClip(clipList[clipIndex]);
                    url = getClipSourceUrl(videoQuality, clipList[clipIndex]);
                    updateContext(clipList[clipIndex]);

                    if (restartFilm === true) {
                        playerRef.current.setStatusAsync({ shouldPlay: true, positionMillis: 0 });
                    }
                }
                setVideoUrl(url);
            }


        }
        catch (error) {
            // if (error) {
            //     setNotification({ type: "error", text: error.toString() });
            // }
        }
    }



    function fetchNextClip() {
        let url = '';
        try {

            let localClipId = route.params.clipId;
            let localOrderNo = route.params.order;

            let currentClipIndex = -1;

            if (clipList) {
                currentClipIndex = clipList?.findIndex(x => x.clipId === selectedClip.clipId && x.clipOrder === selectedClip.clipOrder);
            }
            let nextClipIndex = (currentClipIndex ?? -1) + 1;
            let playlistLength = (clipList) ? clipList.length : 0;

            if (nextClipIndex >= playlistLength) {
                nextClipIndex = 0;
            }

            if (clipList) {

                setClip(clipList[nextClipIndex]);
                url = getClipSourceUrl(videoQuality, clipList[nextClipIndex]);
                updateContext(clipList[nextClipIndex]);
            }
            else {
                setClip(new ClipModel());
                url = '';
            }



            setVideoUrl(url);


            playerRef.current.setStatusAsync({ shouldPlay: true, positionMillis: 0 })



        }
        catch (error) {
            setVideoUrl('');
            if (error) {
                setNotification({ type: "error", text: error.toString() });
            }
        }
    }


    function onPlaybackStatusUpdateHandler(status: any) {
        try {

            if (status.didJustFinish == true) {
                fetchNextClip();
            }
            if (status.isLoaded == true && status.isPlaying == false && status.isBuffering == true) {

                if (status.shouldPlay == true) {
                    setIsBuffering(true);
                }
                else {
                    setIsBuffering(false);
                }
            }
            else {

                setIsBuffering(false);
            }

            setVideoStatus(status)

            if (status.error) {
                setNotification({ type: "error", text: status.error.toString() });
                setIsBuffering(false);
                setIsSubmitting(false);
            }
        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: error.toString() });
            }
        }
    }




    async function fetchClips(playlist: number, view: number, clipId: number, order: number) {
        let result: ClipModel[] = [];
        try {
            setIsSubmitting(true);
            let params = playlist.toString() ?? "0";
            params = params + "/" + view.toString() ?? "0";

            var resultPromise = await getPlaylistClips(params);
            if (resultPromise) {
                result = JSON.parse(JSON.stringify(resultPromise));

                if (result && result.length > 0) {
                    setHasClips(true);
                }
                else {
                    setHasClips(false);
                }

                setClipList(result);
            }

            setIsSubmitting(false);

        }
        catch (error) {
            if (error) {
                setNotification({ type: "error", text: error.toString() });
            }
            setIsSubmitting(false);
        }
    }

    async function changeOrientationHandler(orientationUpdate: any) {
        switch (orientationUpdate) {
            case ScreenOrientation.Orientation.PORTRAIT_UP:
                //await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) // only on Android required
                //ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) 
                playerRef.current.dismissFullscreenPlayer();

                break;
            default:
                //await ScreenOrientation.unlockAsync() // only on Android required
                //ScreenOrientation.unlockAsync()
                playerRef.current.presentFullscreenPlayer();
                break;
        }

        setOrientation(orientationUpdate);
    }

    function subscibeScreenOrientation() {
        ScreenOrientation.unlockAsync();

        // set initial orientation
        ScreenOrientation.getOrientationAsync()
            .then((info) => {
                setOrientation(info);
            });

        // subscribe to future changes
        const subscription = ScreenOrientation.addOrientationChangeListener((evt) => {
            changeOrientationHandler(evt.orientationInfo.orientation);
        });

        // return a clean up function to unsubscribe from notifications
        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        }

    }

    const init = () => {
        try {

            setNotification(new MessageModel())
            if (!clipList && clipList != []) {
                //fetch clip list 
                fetchClips(route.params.playlist, route.params.view, route.params.clipId, route.params.order);
            }

            //fetch video for first clip / selected clip
            fetchSelectedClip(route.params.playlist, route.params.view, route.params.clipId, route.params.order);

            //setIsSubmitting(false);


        }
        catch (error) {
            setIsSubmitting(false);
            // if (error) {
            //     setNotification({ type: "error", text: error.toString() });
            // }
        }

    };

    // useEffect(() => {
    //     navigation.getParent()?.setOptions({

    //         headerRight: () => (
    //             <Pressable onPress={openMenu}
    //                 // onPress={() => navigation.navigate('Modal')}
    //                 style={({ pressed }) => ({
    //                     opacity: pressed ? 0.5 : 1,
    //                 })}>

    //                 <Menu
    //                     visible={menuVisible}
    //                     onDismiss={closeMenu}
    //                     anchor={
    //                         <FontAwesome
    //                             name="ellipsis-v"
    //                             size={30}
    //                             color="white"
    //                             style={{ marginRight: 20 }} />
    //                     }>
    //                     <Menu.Item onPress={closeMenu} title={"Record More"} />
    //                     <Menu.Item onPress={closeMenu} title={"Upload from Device"} />
    //                 </Menu>

    //             </Pressable>
    //         )
    //     });
    // }, [navigation.getParent()]);

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            setIsSubmitting(true);
            subscibeScreenOrientation();
            init();
        });


        navigation.addListener('blur', () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        });

        navigation.addListener('beforeRemove', () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        });

        if (route.params.playlist != selectedClip?.playlistId
        ) {
            setIsSubmitting(true);
            subscibeScreenOrientation();
            init();
        }

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation, clipList, hasClips, videoUrl, selectedClip]);


    useEffect(() => {
        subscibeScreenOrientation();
        init();

    }, []);


    return (

        <SafeAreaView style={styles.container}>
            <ProcessingIndicator isLoading={(isSubmitting || isBuffering) ? true : false} indicatorColor={Colors.grey200} />
            {
                (videoUrl != null && videoUrl != '' && message.text == '')
                    ? (
                        <Video
                            ref={playerRef}
                            //positionMillis={videoStatus.positionMillis}
                            style={styles.video}
                            shouldPlay
                            source={{
                                uri: videoUrl
                            }}
                            useNativeControls
                            resizeMode={Video.RESIZE_MODE_CONTAIN}
                            //usePoster={true}
                            onPlaybackStatusUpdate={status => onPlaybackStatusUpdateHandler(status)}
                            onFullscreenUpdate={val => onFullscreenUpdate(val)}
                            onLoadStart={() => setIsSubmitting(true)}
                            onReadyForDisplay={() => setIsSubmitting(false)}
                        />

                    )
                    :
                    (
                        <Text style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>Video not found.</Text>
                    )
            }
            {(message && message.text) ?
                <View style={styles.container}>
                    <Text style={{ color: Colors.red700, fontSize: 20 }}>
                        {message.text}
                    </Text>
                </View>
                : <></>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black,
    },
    video: {
        alignSelf: 'center',
        width: '100%',
        height: 250,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
