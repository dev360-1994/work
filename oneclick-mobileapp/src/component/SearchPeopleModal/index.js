import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, Keyboard, FlatList, Platform } from 'react-native';
import { IncidentService, CommonService } from '../../Services'
import appStyles from '../../../AppStyle';
import Constants from 'expo-constants'
import Spinner from 'react-native-loading-spinner-overlay'
import { Icon, CheckBox, Overlay } from 'react-native-elements'
import { connect } from 'react-redux'

class SearchPeopleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            FirstName: '',
            LastName: '',
            PersonName: '',
            Email: '',
            searchdata: [],
        }
    }
    addPerson = async () => {
        if (this.state.PersonName !== '') {
            this.selectedUserData(null, this.state.PersonName, false)
        }
    }
    selectedUserData(UserID, UserName, IsUser) {
        this.setState({
            searchdata: [],
            isLoading: true
        })
        this.props.selectedUserData(UserID, UserName, IsUser)
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        })
    }
    searchUsers = async () => {
        const { FirstName, LastName, Email } = this.state
        if (FirstName !== '' || LastName !== '' || Email !== '') {
            try {
                this.showHideSpinner(true)
                await IncidentService.searchUsers(
                    FirstName, LastName, Email, this.props.token,
                ).then(response => {
                    this.showHideSpinner(false)
                    const data = response['data']
                    const result = data['Data']
                    if (data['Success'] === true) {
                        this.setState({ searchdata: [...result], isLoading: false })
                    }
                    else {
                        this.showHideSpinner(false)
                        CommonService.handleError(response)
                    }
                })
                    .catch(error => {
                        this.showHideSpinner(false)
                        CommonService.showErrorNotification(error.message)
                    })
            } catch (ex) {
                this.showHideSpinner(false)
                CommonService.showErrorNotification(ex.Message)
            }
        }

    }
    renderItem({ item, index }) {
        return (
            <View style={index % 2 == 0 ? styles.resultList : appStyles.secondResult}>
                <TouchableOpacity style={appStyles.userListItem} onPress={() => this.selectedUserData(item.UserID, item.Name, true)}>
                    <View style={appStyles.listItemHeadWrap}>
                        <View>
                            <Text style={appStyles.headingText}>{item.Name}</Text>
                        </View>
                        <View>
                            <Icon name="navigate-next" color="#424242" />
                        </View>
                    </View>
                    <View style={appStyles.listItemContent}>
                        <View style={appStyles.contentLine}>
                            <Text style={appStyles.infoLabel}>Email</Text>
                            <Text style={appStyles.userinfo}>{item.EmailAddress}</Text>
                        </View>

                        <View style={appStyles.contentLine}>
                            <Text style={appStyles.infoLabel}>Business Unit</Text>
                            <Text style={appStyles.userinfo}>{item.BusinessUnit}</Text>
                        </View>

                        <View style={appStyles.contentLine}>
                            <Text style={appStyles.infoLabel}>Site</Text>
                            <Text style={appStyles.userinfo}>{item.Site}</Text>
                        </View>

                        <View style={appStyles.contentLine}>
                            <Text style={appStyles.infoLabel}>Position</Text>
                            <Text style={appStyles.userinfo}>{item.Position}</Text>
                        </View>

                        <View style={appStyles.contentLine}>
                            <Text style={appStyles.infoLabel}>Emp / Ref#</Text>
                            <Text style={appStyles.userinfo}>{item.Reference}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        const { modalVisible, spinner ,cancel ,showPersonField} = this.props
        return (
            <Modal
            visible={modalVisible}
            >
                <View style={styles.mapcontainer}>
                    <Spinner visible={spinner} />
                    <View style={{ width: '100%', position: "relative", justifyContent: "center", backgroundColor: "#f7f7f7", height: 40, alignItems: "center", marginTop: 10 }}>
                        <Text style={{ fontWeight: "bold", color: "#424242" }}>Search</Text>
                        <TouchableOpacity
                            onPress={() => { cancel() }}
                            style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", position: "absolute", right: 0, top: 0 }}>
                            <Icon name='close' color='#424242' size={22} />
                        </TouchableOpacity>
                    </View>
                    <KeyboardAvoidingView
                        //keyboardVerticalOffset={10}
                        behavior="padding" style={{ flex: 1 }} >
                        <SafeAreaView>
                            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                                <ScrollView>
                                    <View style={{ paddingHorizontal: 20 }}>

                                        <View style={styles.moddalInputWrap}>
                                            <View style={{ flexDirection: 'column', }}>
                                                <View style={{}}>
                                                    <CheckBox
                                                        title='Search for a Person'
                                                        size={20}
                                                        checkedIcon='dot-circle-o'
                                                        uncheckedIcon='circle-o'
                                                        containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                                                        checked={this.state.checkedSearch}
                                                        onPress={() => this.setState({ checkedPersonName: false, checkedSearch: true, checkedDetail: false })
                                                        }
                                                    />
                                                </View>
                                                <View style={{}}>
                                                    <CheckBox
                                                        title='Use my details'
                                                        checkedIcon='dot-circle-o'
                                                        uncheckedIcon='circle-o'
                                                        containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                                                        checked={this.state.checkedDetail}
                                                        onPress={() => this.selectedUserData(this.props.userId, this.props.firstName + " " + this.props.lastName, true)}
                                                    />
                                                </View>
                                                {showPersonField && <View style={{}}>
                                                    <CheckBox
                                                        title='Enter person name'
                                                        checkedIcon='dot-circle-o'
                                                        uncheckedIcon='circle-o'
                                                        containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                                                        checked={this.state.checkedPersonName}
                                                        onPress={() => this.setState({ checkedPersonName: true, checkedSearch: false, checkedDetail: false })
                                                        }
                                                    />
                                                </View>}
                                            </View>
                                        </View>
                                        {this.state.checkedSearch &&
                                            <View>
                                                <View style={styles.moddalInputWrap}>
                                                    <Text style={styles.inPutLabel}>First Name</Text>
                                                    <View style={styles.multiSelctinputPadding}>
                                                        <TextInput
                                                            scrollEnabled={false}
                                                            autoCapitalize='none'
                                                            style={styles.modalInput}
                                                            maxLength={50}
                                                            onChangeText={text => this.setState({
                                                                'FirstName': text,
                                                                unSavedChanges: true
                                                            })}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.moddalInputWrap}>
                                                    <Text style={styles.inPutLabel}>Last Name</Text>
                                                    <View style={styles.multiSelctinputPadding}>
                                                        <TextInput
                                                            scrollEnabled={false}
                                                            autoCapitalize='none'
                                                            style={styles.modalInput}
                                                            maxLength={50}
                                                            onChangeText={text => this.setState({
                                                                'LastName': text,
                                                                unSavedChanges: true
                                                            })
                                                            }
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.moddalInputWrap}>
                                                    <Text style={styles.inPutLabel}>Email</Text>
                                                    <View style={styles.multiSelctinputPadding}>
                                                        <TextInput
                                                            scrollEnabled={false}
                                                            autoCapitalize='none'
                                                            style={styles.modalInput}
                                                            keyboardType="email-address"
                                                            onChangeText={text => this.setState({
                                                                Email: text,
                                                                unSavedChanges: true
                                                            })
                                                            }
                                                        />
                                                    </View>
                                                </View>
                                                <TouchableOpacity onPress={() => this.searchUsers()}>
                                                    <Text style={[styles.textBox1, { fontSize: 15 }]}>
                                                        Search
                                                 </Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        {
                                           showPersonField && this.state.checkedPersonName &&
                                            <View>
                                                <View style={styles.moddalInputWrap}>
                                                    <Text style={styles.inPutLabel}>Person Name</Text>
                                                    <View style={styles.multiSelctinputPadding}>
                                                        <TextInput
                                                            autoCapitalize='none'
                                                            style={styles.modalInput}
                                                            maxLength={50}
                                                            onChangeText={text => this.setState({
                                                                'PersonName': text,
                                                                unSavedChanges: true
                                                            })}

                                                        />
                                                    </View>
                                                </View>
                                                <TouchableOpacity onPress={() => this.addPerson()}>
                                                    <Text style={[styles.textBox1, { fontSize: 15 }]}>
                                                        Add
                                            </Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        {this.state.checkedPersonName !== true && <View>
                                            {this.state.isLoading === false ?
                                                <View style={styles.tableWrap}>
                                                    {this.state.searchdata.length !== 0 ?
                                                        <View style={{ flexDirection: 'column', width: '100%' }}>
                                                            <View style={{ flexDirection: 'row', height: 25, }}>
                                                            </View>
                                                            <View style={{ width: '100%' }}>
                                                                <View style={styles.listWrapper}>
                                                                    <FlatList
                                                                        style={{ backgroundColor: '#FFF' }}
                                                                        data={this.state.searchdata}
                                                                        renderItem={this.renderItem.bind(this)}
                                                                        keyExtractor={(item, index) => index.toString()}
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                        :
                                                        <View><Text style={{ fontSize: 16, color: "#d1d1d1", textAlign: "center", paddingVertical: 20 }}>No data found.</Text></View>
                                                    }
                                                </View> : <View><Text style={{ fontSize: 16, color: "#d1d1d1", textAlign: "center", paddingVertical: 20 }}>Use the search options above to search for a person.</Text></View>
                                            }
                                        </View>
                                        }

                                    </View>
                                </ScrollView>
                            </TouchableWithoutFeedback>
                        </SafeAreaView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

        )
    }
}
const styles = StyleSheet.create({
    mapcontainer: {
        flex: 1,
        paddingTop: Constants.statusBarHeight + 10,
        backgroundColor: '#fff',
    },
    multiSelctinputPadding: {
        width: '100%',
        position: 'relative'
    },
    moddalInputWrap: {
        marginBottom: 10
    },
    modalInput: {
        paddingVertical: 4,
        paddingLeft: 5,
        borderRadius: 4,
        borderWidth: 1,
        fontSize: 12,
        borderColor: '#',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        borderColor: '#d1d1d1',
        marginTop: 4,
    },
    textBox1: {
        width: '69%',
        backgroundColor: '#ff9900',
        height: 32,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#c9c9c9',
        position: 'relative',
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
        paddingTop: 5
    },
    listWrapper: {
        borderTopWidth: 1,
        borderTopColor: '#efefef',
        marginBottom: 10
    },
    multiSelctinputPadding: {
        paddingHorizontal: 10,
        width: '100%',
        position: 'relative'
    },

})
function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        firstName: state.home.firstName,
        lastName: state.home.lastName,
        userId: state.home.userId,
    }
}
export default connect(mapStateToProps)(SearchPeopleModal);