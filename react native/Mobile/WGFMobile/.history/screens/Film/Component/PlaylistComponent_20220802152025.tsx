import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Text, View, Dimensions, Platform } from 'react-native';
import { Colors, useTheme, Searchbar } from 'react-native-paper';
import { FavoriteStatusModel, PlaylistModel } from '../../../services/Model/PlaylistModel';
import { useNavigation } from '@react-navigation/native';
import { MessageModel } from '../../../services/Model/MessageModel';
import { SessionInfoModel } from '../../../services/Model/SessionInfoModel';
import { getTeamPlaylists, updatePlaylistFavoriteStatus } from '../../../services/PlaylistService';
import Toastbar from '../../../components/Toastbar';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { getSecurityData } from '../../../services/SecurityService';

const PlaylistComponent = ({ typeCode, typeName, sessionData }: { typeCode: string, typeName: string, sessionData?: SessionInfoModel }) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [message, setNotification] = useState(new MessageModel);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [dataSource, setDataSource] = React.useState<PlaylistModel[]>([]);
    const [filterdataSource, setFilterDataSource] = React.useState<PlaylistModel[]>([]);
    const [hasData, setHasData] = useState<boolean>(false);
    const [searchPlaceHolder, setSearchPlaceHolder] = useState("Search");
    // console.log(sessionData);
    const [search, setSearch] = useState('');
    const [showVideoMenu, setShowVideoMenu] = useState(true);

    const EmptyMessage = () => {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background, }]}>
                <Text style={{ textAlign: 'center', color: theme.colors.text }}>No {typeName} playlist found.</Text>
            </View>

        );
    };
    function getUserRole(roleId: any) {
        let userRole = "";
        switch (roleId) {
            case 0:
                userRole = "Owner";
                break;
            case 1:
                userRole = "Administrator";
                break;
            case 2:
                userRole = "Coach";
                break;
            case 3:
                userRole = "Athlete";
                break;
            case 4:
                userRole = "Parent";
                break;
            case 5:
                userRole = "Referee";
                break;
            case 6:
                userRole = "Media";
                break;
            case 7:
                userRole = "Member";
                break;
        }
        return userRole;
    }

    const getUserSecurityData = async () => {
        // console.log("sessionData: ", sessionData);
        // console.log(sessionData);
        const result = await getSecurityData(sessionData?.userInfo?.teamId);
        const userRole = getUserRole(sessionData?.userInfo.userRole).toLowerCase();
        // console.log(result);
        result.forEach(element => {
            if (element.categoryDesc === "Film" && element.actionDesc == "Upload") {
                console.log(element);
                setShowVideoMenu(element[userRole] == 1);
            }
        });
    }





    const onChangeSearch = text => {
        searchData(text);
    }

    function searchData(searchText: string) {
        if (searchText != "") {
            const newData = dataSource.filter(
                function (item) {
                    const itemData = item.name
                        ? item.name.toUpperCase()
                        : ''.toUpperCase();
                    const textData = searchText.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
            setFilterDataSource(newData);
            setSearch(searchText);
        } else {
            setFilterDataSource(dataSource);
            setSearch(searchText);
        }
    }

    async function updateFavoriteStatus(item: PlaylistModel, listSource: PlaylistModel[]) {
        try {
            setNotification({
                type: "",
                text: "",
            })

            setIsSubmitting(true);

            let favoriteStatusData: FavoriteStatusModel = {
                playlist: item.playlist,
                user: sessionData?.userInfo?.userId,
                isFavorite: (item.favourite) ? 1 : 0
            }

            let resultPromise = await updatePlaylistFavoriteStatus(favoriteStatusData);
            if (resultPromise == true) {
                setIsSubmitting(true);
                fetchPlaylists();

                setDataSource(listSource);
                setFilterDataSource(listSource);
                if (listSource.length == 1 && listSource[0].favourite == false) {
                    setDataSource([]);
                    setFilterDataSource([]);
                }

                setNotification({
                    type: "info",
                    text: "Favorite status updated.",
                });


            }
        } catch (error) {
            setIsSubmitting(false);

            if (error) {
                setNotification({
                    type: "error",
                    text: error,
                });
            }
            // }
        }
    }

    async function fetchPlaylists() {

        try {
            let params = sessionData?.userInfo?.teamId.toString() ?? "0";
            params = params + "/" + sessionData?.userInfo?.userId.toString() ?? "0";
            params = params + "/" + typeCode;

            var resultPromise = await getTeamPlaylists(params);

            if (resultPromise) {
                let result: PlaylistModel[] = JSON.parse(JSON.stringify(resultPromise));

                if (result && result.length > 0) {
                    setHasData(true);
                }
                else {
                    setHasData(false);
                }

                setDataSource(result);
                if (search != "") {
                    searchData(search);
                } else {
                    setFilterDataSource(result);
                }

                setIsSubmitting(false);
            }
        }
        catch (error) {
            setIsSubmitting(false);
            let errorText = error.toString();
            if (error) {
                if (errorText != "Error: 204") {
                    setNotification({ type: "error", text: error.toString() });
                }
            }
        }
    }


    function handleFavoriteBoxPress(item: PlaylistModel, isChecked: boolean) {
        let newDataSource = [...dataSource];
        const dataIndex = newDataSource.map(function (x) { return x.playlist; }).indexOf(item.playlist);
        newDataSource[dataIndex].favourite = isChecked;

        updateFavoriteStatus(item, newDataSource);

    }

    const onPressViewFilmHandler = (item: PlaylistModel) => {
        // console.log(item.playlist)
        getUserSecurityData();
        console.log(showVideoMenu);
        navigation.navigate('ViewFilm', {
            screen: 'VIDEO',
            params: { playlist: item.playlist, view: item.view, clipId: 0, order: 1, title: item.name, showMenu: showVideoMenu },
        });
    };


    const init = () => {
        setIsSubmitting(true);
        fetchPlaylists();


    }
    const onRefreshHandler = () => {
        setIsSubmitting(true);
        fetchPlaylists();
    };

    useEffect(() => {

    }, [hasData, dataSource, typeCode]);

    useEffect(() => {
        init();
    }, []);

    useLayoutEffect(() => {
        if (typeName == "Recent") {
            setSearchPlaceHolder("Search Recent Film");
        } else if (typeName == "Favorite") {
            setSearchPlaceHolder("Search My Favorites");
        } else if (typeName == "Current") {
            setSearchPlaceHolder("Search Current Season");
        } else if (typeName == "All") {
            setSearchPlaceHolder("Search All Seasons");
        } else if (typeName == "Training") {
            setSearchPlaceHolder("Search Training Film");
        } else if (typeName == "Other") {
            setSearchPlaceHolder("Search Other Film");
        }
    }, [typeName]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

            <React.Fragment key={typeName}>
                <View style={[styles.Searchbar]} >
                    <Searchbar numberOfLines={1} inputStyle={{ height: 40, alignSelf: 'center' }}
                        placeholder={searchPlaceHolder}
                        onChangeText={onChangeSearch}
                        value={search}
                    />
                </View>
                <FlatList
                    key={typeName}
                    data={filterdataSource}
                    onRefresh={() => onRefreshHandler()}
                    refreshing={isSubmitting}
                    progressViewOffset={100}
                    ListEmptyComponent={(!isSubmitting) ? (<EmptyMessage />) : <></>}
                    keyExtractor={(item) => item.playlist.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.wrapper, theme.dark ? styles.borderForDarkTheme : styles.borderForLightTheme, { backgroundColor: theme.colors.surface }]}>

                            <View style={[styles.checkbox, { backgroundColor: theme.colors.surface }]}>
                                <MaterialIcon
                                    name={
                                        item.favourite == true ? "check-box" : "check-box-outline-blank"
                                    }
                                    color={theme.colors.text}
                                    style={styles.MaterialCheckbox}
                                    onPress={() => {
                                        handleFavoriteBoxPress(item, !item.favourite);
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{ flex: 1, flexDirection: 'column', margin: 10, zIndex: 0 }}
                                onPress={() => onPressViewFilmHandler(item)}
                            >
                                {
                                    item.name != "" &&
                                    <Text style={{ color: theme.colors.text }}>{item.name}</Text>
                                }
                                {
                                    item.dateExpiry != null &&
                                    <Text style={{ color: Colors.grey600 }}>{item.dateExpiry}</Text>
                                }
                                {
                                    item.group != "" &&
                                    <Text style={{ color: Colors.grey600 }}>{item.group}</Text>
                                }
                                {
                                    item.tags != "" &&
                                    <Text style={{ color: Colors.grey600 }}>{item.tags}</Text>
                                }




                            </TouchableOpacity>
                        </View>
                    )}
                />
                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
            </React.Fragment>
        </View >


    );
}
export default PlaylistComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    wrapper: {
        //padding: 10,
        borderTopWidth: 1,
        borderRadius: 0,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    borderForDarkTheme:
    {
        borderColor: Colors.grey900
    },
    borderForLightTheme:
    {
        borderColor: Colors.grey300
    },
    checkbox:
    {
        justifyContent: 'center',
        textAlign: 'center',
        paddingHorizontal: 0,
        paddingRight: 10,
    },
    MaterialCheckbox:
    {
        fontSize: 30
    },

    emptyContainer: {
        justifyContent: 'center', //Centered horizontally
        alignItems: 'center', //Centered vertically
        flex: 1,
        marginTop: Dimensions.get('window').height / 4,
    },

    Searchbar: {
        ...Platform.select({
            android: {
                margin: 10,
            },
            ios: {
                marginTop: 20,
                margin: 10,
            },
            default: {
                // other platforms, web for example
                margin: 10,
            }

        })
    },

});







