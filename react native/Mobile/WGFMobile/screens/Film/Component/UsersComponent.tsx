import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Text, View, Dimensions, Platform, Pressable } from 'react-native';
import { Colors, useTheme, Searchbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MessageModel } from '../../../services/Model/MessageModel';
import { SessionInfoModel } from '../../../services/Model/SessionInfoModel';
import Toastbar from '../../../components/Toastbar';
import { GetTeamUsers, OnGetHistoryDataAsync } from '../../../services/UserService';
import { TeamUserSetting } from '../../../services/Model/TeamModel';
import { getUserRoles } from '../../../services/DashboardService';
import { UserRoleModel } from '../../../services/Model/UserRoleModel';
import { Ionicons } from '@expo/vector-icons';

const UsersComponent = ({ sessionData }: { sessionData?: SessionInfoModel }) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [message, setNotification] = useState(new MessageModel);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [dataSource, setDataSource] = React.useState<TeamUserSetting[]>([]);
    const [userRoles, setUserRoles] = React.useState<UserRoleModel[]>([]);
    const [filterdataSource, setFilterDataSource] = React.useState<TeamUserSetting[]>([]);
    const [hasData, setHasData] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const [menuVisible, setMenuVisible] = React.useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const EmptyMessage = () => {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background, }]}>
                <Text style={{ textAlign: 'center', color: theme.colors.text }}>No Users found.</Text>
            </View>
        );
    };



    const onChangeSearch = text => {
        searchData(text);
    }

    function searchData(searchText: string) {
        if (searchText != "") {
            const newData = dataSource.filter(
                function (item) {
                    const itemData = item.firstName
                        ? item.fullName.toUpperCase()
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



    async function fetchHistory() {

        try {
            let params = sessionData?.userInfo?.teamId.toString() ?? "0";
            var userPromise = await GetTeamUsers(params);
            var resultPromise = await getUserRoles();
            if (resultPromise) {
                let result: UserRoleModel[] = JSON.parse(JSON.stringify(resultPromise));
                setUserRoles(result);
            }
            if (userPromise) {
                let result: TeamUserSetting[] = userPromise;
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





    const init = () => {
        setIsSubmitting(true);
        fetchHistory();


    }
    const onRefreshHandler = () => {
        setIsSubmitting(true);
        fetchHistory();
    };

    useEffect(() => {

    }, [hasData, dataSource]);

    useEffect(() => {
        init();
    }, []);

    const onPressUserHandler = (item: any) => {
        // console.log(item);
        navigation.navigate("EditTeamUser", {
            params: item
        });
    }







    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>


            <View style={[styles.Searchbar]} >
                <Searchbar numberOfLines={1} inputStyle={{ height: 40, alignSelf: 'center' }}
                    placeholder="Search Users"
                    onChangeText={onChangeSearch}
                    value={search}
                />
            </View>
            <FlatList
                // key={typeName}
                data={filterdataSource}
                onRefresh={() => onRefreshHandler()}
                refreshing={isSubmitting}
                progressViewOffset={100}
                ListEmptyComponent={(!isSubmitting) ? (<EmptyMessage />) : <></>}
                keyExtractor={(item) => item.userId.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.wrapper, theme.dark ? styles.borderForDarkTheme : styles.borderForLightTheme, { backgroundColor: theme.colors.surface }]}>

                        <TouchableOpacity
                            style={{ flex: 1, flexDirection: 'column', margin: 10, zIndex: 0 }}
                            onPress={() => { onPressUserHandler(item) }}
                        >

                            <Text style={{ color: theme.colors.text }}>{item.firstName} {item.lastName}</Text>

                            <Text style={{ color: Colors.grey600 }}>{userRoles[item.teamRole].roleValue}</Text>

                            <Text style={{ color: Colors.grey600 }}>{item.emailAddress} {item.phone}</Text>

                            {
                                item.dateExpired &&
                                <Text style={{ color: Colors.grey600 }}>{new Date(item.dateExpired?.toString()).toDateString()}</Text>

                            }





                        </TouchableOpacity>
                    </View>
                )}
            />
            <Toastbar message={message} onClose={() => setNotification({ type: "", text: "" })} />

        </View >


    );
}
export default UsersComponent;

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







