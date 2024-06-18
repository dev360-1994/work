
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from "react-native";
import { Searchbar, useTheme, Text, Colors } from "react-native-paper";
import Toastbar from "../../../components/Toastbar";
import { exchangeGridData, exchangeGridLockerOutData, exchangeLeaguePostData } from "../../../services/ExchangeService";
import { ExchangeModel, LockerOutGetModel } from "../../../services/Model/ExchangeModel";
import { MessageModel } from "../../../services/Model/MessageModel";
import { SessionInfoModel } from "../../../services/Model/SessionInfoModel";

export const TeamsComponent = ({ sessionData }: { sessionData?: SessionInfoModel }) => {
    const [searchPlaceHolder, setSearchPlaceHolder] = useState("Team Exchange");
    const theme = useTheme();
    const [filterdataSource, setFilterDataSource] = React.useState<ExchangeModel[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setNotification] = useState<MessageModel>(new MessageModel());
    const [dataSource, setDataSource] = React.useState<ExchangeModel[]>([]);
    const [search, setSearch] = useState('');
    const [hasData, setHasData] = useState<boolean>(false);
    const navigation = useNavigation();

    const EmptyMessage = () => {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background, }]}>
                <Text style={{ textAlign: 'center', color: theme.colors.text }}>No Record found.</Text>
            </View>

        );
    };

    const onChangeSearch = (text: any) => {
        searchData(text);
    }

    async function fetchPlaylists() {

        try {
            let params = sessionData?.userInfo?.teamId.toString() ?? "0";
            var resultPromise = await exchangeGridData(params);
            if (resultPromise) {
                let result: ExchangeModel[] = JSON.parse(JSON.stringify(resultPromise));
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
        catch (error: any) {
            setIsSubmitting(false);
            let errorText = error.toString();
            if (error) {
                if (errorText != "Error: 204") {
                    // setNotification({ type: "error", text: error.toString() });
                }
            }
        }
    }

    function searchData(searchText: string) {
        if (searchText != "") {
            const newData = dataSource.filter(
                function (item) {
                    const itemData = item.playlistname
                        ? item.playlistname.toUpperCase()
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

    const onPressViewFilmHandler = async (item: ExchangeModel) => {
        var result = await exchangeLeaguePostData(item.playlistguid);
        console.log(result);
        navigation.navigate('TeamForm', {
            title: item.playlistname, date: item.playlistdate, filmGuid: item.playlistguid, clips: result.clips, status: result.status
        });
    };

    const onRefreshHandler = () => {
        setIsSubmitting(true);
        fetchPlaylists();
    };

    const init = () => {
        setIsSubmitting(true);
        fetchPlaylists();
    }

    useEffect(() => {
        init();
    }, []);


    return (
        <View style={[styles.innerContainer, { backgroundColor: theme.colors.background }]}>

            <React.Fragment key={"I"}>
                <View style={[styles.Searchbar]} >
                    <Searchbar numberOfLines={1} inputStyle={{ height: 40, alignSelf: 'center' }}
                        placeholder={searchPlaceHolder}
                        onChangeText={onChangeSearch}
                        value={search}
                    />
                </View>
                <FlatList
                    key={"I"}
                    data={filterdataSource}
                    onRefresh={() => onRefreshHandler()}
                    refreshing={isSubmitting}
                    progressViewOffset={100}
                    ListEmptyComponent={(!isSubmitting) ? (<EmptyMessage />) : <></>}
                    keyExtractor={(item) => item?.playlistid?.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.wrapper, theme.dark ? styles.borderForDarkTheme : styles.borderForLightTheme, { backgroundColor: theme.colors.surface }]}>

                            <TouchableOpacity
                                style={{ flex: 1, flexDirection: 'column', margin: 10, zIndex: 0 }}
                                onPress={() => onPressViewFilmHandler(item)}
                            >
                                {
                                    item.playlistname != "" &&
                                    <Text style={{ color: theme.colors.text }}>{item.playlistname}</Text>
                                }
                                {
                                    item.playlistgroup != null &&
                                    <Text style={{ color: Colors.grey600 }}>{item.playlistgroup}</Text>
                                }
                                {
                                    item.playlisttags != "" &&
                                    <Text style={{ color: Colors.grey600 }}>{item.playlisttags}</Text>
                                }
                                {
                                    item.playlistdate &&
                                    <Text style={{ color: Colors.grey600 }}>{new Date(item.playlistdate).toDateString()}</Text>
                                }




                            </TouchableOpacity>
                        </View>
                    )}
                />
                <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />
            </React.Fragment>
        </View >
    )
}

const styles = StyleSheet.create({
    innerContainer: {
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