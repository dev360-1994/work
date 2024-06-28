import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Icon } from 'react-native-elements'
import { IncidentService, CommonService } from '../../../Services'
import { HeaderView, FooterView, ChoosePageMenu } from '../../../component/index'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment';
import message from '../../../Utility/Message'
import { connect } from 'react-redux'
import Constants from 'expo-constants'
import appStyles from '../../../../AppStyle';
import styles from './Style';
class ActionlistScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            incidentId: '0',
            data: [],
            unSavedChanges: false,
            pageName: '',
            IncidentLocked:'',
            item:[]
        }
    }
    //#region  Methods
    componentDidMount() {
        const { navigation } = this.props
        let id = navigation.state.params.id
        let pageName = navigation.state.params.pageName
        let IncidentLocked = navigation.state.params.IncidentLocked
        this.showHideSpinner(true);
        if (pageName !== undefined) this.setState({ pageName: pageName });
        if (IncidentLocked !== undefined) this.setState({ IncidentLocked: IncidentLocked });
        this.setState({ incidentId: id, isLoading: true })
        this.focusListener = navigation.addListener('willFocus', async (data) => {
            this.actionList(data.state.params && data.state.params.id)
            CommonService.handleAndroidBackButton(this.handleBackPress)
        })
    }
    handleBackPress = () => {
        const { navigation } = this.props
        this.props.navigation.navigate('Incident', { id: this.state.incidentId ,TenantIncidentId:navigation.state.params.TenantIncidentId ,lastPageName:this.state.pageName})
        return true
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        })
    }
    actionList = async (id) => {
        this.setState({ data: this.state.item, isLoading: false })
        this.showHideSpinner(true)
        try {
            await IncidentService.actionList(
                id,
                this.props.token,
            ).then(response => {
                const data = response['data']
                const result = data['Data']
                if (data['Success'] === true) {
                    this.setState({ data: [...this.state.data, ...result['Actions']], isLoading: false })
                    this.showHideSpinner(false)
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
    renderItem({ item, index }) {
        var DueDate = null
        var CompletedDate = null
        if (item.DueDate !== null) { DueDate = moment(item.DueDate).subtract(1, "days").format('DD-MMM-YYYY'); }
        if (item.CompletedDate !== null) { CompletedDate = moment(item.CompletedDate).format('DD-MMM-YYYY'); }
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ActionDetail', { id: this.state.incidentId, actionid: item.ActionID, pageName: 'ActionlistScreen', IncidentLocked: this.state.IncidentLocked,ActionType : 1 })}
                style={[{
                    paddingHorizontal: 15,
                    paddingBottom: 10,
                    borderBottomColor: '#e6e6e6',
                    borderBottomWidth: 1,
                }, (index % 2 == 0) ? { backgroundColor: '#fff' } : { backgroundColor: '#f5f5f5' }]}>
                <View style={styles.listHead}>
                    <Text numberOfLines={2} style={{ fontWeight: 'bold', color: '#424242' }}>
                        {item.Description}
                    </Text>
                    <TouchableOpacity
                        style={styles.descriptionBtn}
                        onPress={() => this.props.navigation.navigate('ActionDetail', { id: this.state.incidentId, actionid: item.ActionID, pageName: 'ActionlistScreen', IncidentLocked: this.state.IncidentLocked ,ActionType : 1  })}
                    >
                        <Icon
                            name='chevron-right'
                            type='octicon'
                            color='#c9c9c9'
                            size={25}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.listBody}>
                    <View style={styles.line}>
                        <View style={{ width: 100 }}>
                            <Text style={{ fontSize: 14, color: '#333' }}>Status</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 14, color: '#333' }}>{item.ActionStatus}</Text>
                        </View>
                    </View>
                    <View style={styles.line}>
                        <View style={{ width: 100 }}>
                            <Text style={{ fontSize: 14, color: '#333' }}>Due Date</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 14, color: '#333' }}>{DueDate} </Text>
                        </View>
                    </View>
                    <View style={styles.line}>
                        <View style={{ width: 100 }}>
                            <Text style={{ fontSize: 14, color: '#333' }}>Closed Date</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 14, color: '#333' }}>{CompletedDate} </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    ListEmptyView() {
        return (
            <View><Text style={{ fontSize: 16, color: "#d1d1d1", textAlign: "center", paddingVertical: 20 }}>No Actions have been added.</Text></View>
        );
    }
      goBack =()=>{
        let index = this.props.navigation.dangerouslyGetParent().state.index;
        if (index > 1) {
            this.props.navigation.goBack();
        } else {
            this.props.navigation.navigate('Incident', { id: this.state.incidentId,})
        }
    }
    //#endregion
    render() {
        const { spinner, incidentId ,IncidentLocked} = this.state
        const { navigation } = this.props
        if (this.state.isLoading) {
            return (
                <View style={appStyles.container}>
                    <HeaderView PropFunction={() => this.goBack()}
                        Title={navigation.state.params.TenantIncidentId ? 'Incident #' + `${navigation.state.params.TenantIncidentId}` : 'Incident #'}
                        Pagename={'incident'}
                    ></HeaderView>
                    <Spinner
                        visible={spinner}
                    />
                </View>
            )
        } else {
            return (
                <View style={appStyles.container}>
                    <HeaderView
                        PropFunction={() =>  this.goBack()}
                        Title={ navigation.state.params.TenantIncidentId ? 'Incident #' +  `${navigation.state.params.TenantIncidentId }`:'Incident #'}
                        Pagename={'incident'}
                    ></HeaderView>
                    <View>
                        <Spinner
                            visible={spinner}
                        />
                    </View>
              { IncidentLocked == false && <View style={styles.addActionWrap}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('ActionDetail', { id: incidentId , pageName: 'ActionlistScreen' ,IncidentLocked:IncidentLocked ,TenantIncidentId:navigation.state.params.TenantIncidentId,ActionType : 1  })}
                            style={{
                                borderWidth: 1,
                                borderColor: '#424242',
                                paddingHorizontal: 6,
                                paddingVertical: 5,
                                flexDirection:'row'
                            }}>
                            <Icon
                                name='plus-circle'
                                type='feather'
                                color='#c2c2c2'
                                size={20}
                                iconStyle={{marginRight:4}}
                            />
                            <Text style={{ color: '#424242' }}>Add New Action</Text>
                        </TouchableOpacity>

                    </View>}
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                        <View>
                            <FlatList
                                style={{ backgroundColor: '#FFF' }}
                                data={this.state.data}
                                renderItem={this.renderItem.bind(this)}
                                keyExtractor={(item, index) => index.toString()}
                                ListEmptyComponent={this.ListEmptyView}
                            />
                        </View>
                    </SafeAreaView>
                </View>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
    }
}
export default connect(mapStateToProps)(ActionlistScreen)