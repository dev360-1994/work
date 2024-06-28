import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Animated,
    Modal
} from 'react-native'
import { Icon } from 'react-native-elements'
import { IncidentService, CommonService } from '../../../Services'
import { ScrollView } from 'react-native-gesture-handler'
import { HeaderView, FooterView, ChoosePageMenu,SectionedMultiView } from '../../../component/index'
import Spinner from 'react-native-loading-spinner-overlay'
import message from '../../../Utility/Message'
import SectionedMultiSelect from '../../../Custom-NodeModules/react-native-sectioned-multi-select'
import { connect } from 'react-redux'
import styles from './Style';
import appStyles from '../../../../AppStyle';
class ImpactDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageName: '',
            spinner: false,
            incidentId: '0',
            initialStop: false,
            unSavedChanges: false,
            nextPagedialog: false,
            ImpactModal: {
                'impactsModel': [],
                'actualConsequences': [],
                'consequences': [],
                'likeLihoods': [],
                'nonCompliances': [],
                'riskMatrix': [],
                'consequenceslist': [],
            },
            Health: false,
            Safety: false,
            Environment: false,
            Community: false,

            Quality: false,
            Process: false,
            Security: false,
            actualConsequence: {
                'Health': [],
                'Safety': [],
                'Environment': [],
                'Community': [],
                'Quality': [],
                'Process': [],
                'Security': [],
            },
            MRC: {
                'Health': [],
                'Safety': [],
                'Environment': [],
                'Community': [],
                'Quality': [],
                'Process': [],
                'Security': [],
            },
            MRL: {
                'Health': [],
                'Safety': [],
                'Environment': [],
                'Community': [],
                'Quality': [],
                'Process': [],
                'Security': [],
            },
            subTypes: {
                'Health': [],
                'Safety': [],
                'Environment': [],
                'Community': [],
                'Quality': [],
                'Process': [],
                'Security': [],
            },
            outComeResult: {
                'Health': {
                    'color': '',
                    'forecolor': '',
                    'Rating': '',
                    'RatingID': '',
                },
                'Safety': {
                    'color': '',
                    'forecolor': '',
                    'Rating': '',
                    'RatingID': '',
                },
                'Environment': {
                    'color': '',
                    'forecolor': '',
                    'Rating': '',
                    'RatingID': '',
                },
                'Community': {
                    'color': '',
                    'forecolor': '',
                    'Rating': '',
                    'RatingID': '',
                },
                'Quality': {
                    'color': '',
                    'forecolor': '',
                    'Rating': '',
                    'RatingID': '',
                },
                'Process': {
                    'color': '',
                    'forecolor': '',
                    'Rating': '',
                    'RatingID': '',
                },
                'Security': {
                    'color': '',
                    'forecolor': '',
                    'Rating': '',
                    'RatingID': '',
                },
            },
            showImpactData: {
                Health: true,
                Safety: true,
                Environment: true,
                Community: true,
                Quality: true,
                Process: true,
                Security: true,
            }
        };
    }
    //#region  Methods
    componentDidMount() {
        const { navigation } = this.props
        let id = navigation.state.params.id
        let pageName = navigation.state.params.pageName
        this.showHideSpinner(true)
        if (pageName !== undefined) this.setState({ pageName: pageName });
        this.setState({ incidentId: id })
        this.screenIntialize(id)
        this.focusListener = navigation.addListener('didFocus', () => {
            CommonService.handleAndroidBackButton(this.handleBackPress)
        })
    }
    handleBackPress = () => {
        this.checkUnSavedData('goback')
        return true
    }
    screenIntialize(id) {
        this.setState({ incidentId: id })
        if (id > 0) {
            this.initializeData(
                this.props.token, id
            )
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { navigation } = this.props
        if (
            navigation.state.params === undefined ||
            nextProps.navigation.state.params.id !== navigation.state.params.id
        ) {
            this.setState({ initialStop: true })
            this.screenIntialize(nextProps.navigation.state.params.id)
        }
        this.setState({ initialStop: true })
        this.screenIntialize(nextProps.navigation.state.params.id)
    }
    initializeData = async (token, id) => {
        this.showHideSpinner(true)
        try {
            await IncidentService.impactDetailData(
                this.props.token,
                id
            ).then(response => {
                const data = response['data']
                const resultData = data["Data"];
                const Impact = resultData['ImpactModel']
                if (data['Success'] === true) {
                    for (let i = 0; i < Impact.Impacts.length; i++) {
                        Impact.Impacts[i].SubTypes1 = []
                        Impact.Impacts[i].Sub = []
                        var selectedsubtypes = []
                        for (let j = 0; j < Impact.Impacts[i].SubTypes.length; j++) {
                            Impact.Impacts[i].SubTypes1[j] =
                            {
                                id: Impact.Impacts[i].SubTypes[j].Id,
                                name: Impact.Impacts[i].SubTypes[j].name
                            }
                            if (Impact.Impacts[i].SubTypes[j].Checked == true)
                                selectedsubtypes.push(Impact.Impacts[i].SubTypes[j].Id)
                        }
                        if (selectedsubtypes.length > 0) {
                            this.onSelected(selectedsubtypes, Impact.Impacts[i].ImpactName, 'nochange', 'subTypes')
                        }
                        Impact.Impacts[i].Sub.push(
                            {
                                name: 'Select Sub types',
                                id: 0,
                                children: Impact.Impacts[i].SubTypes1
                            },
                        )
                    }
                    this.setState({
                        ImpactModal: {
                            'TenantIncidentId':resultData.TenantIncidentId,
                            'IncidentLocked': Impact.Incident.IncidentLocked,
                            'impactsModel': Impact['Impacts'],
                            'consequenceslist': resultData['Consequences'],
                            'actualConsequences':
                                [{
                                    name: 'Select Actual Consequence',
                                    id: 0,
                                    children: resultData['ActualConsequences']
                                }],
                            'consequences':
                                [{
                                    name: 'Select Maximum Reasonable Consequence',
                                    id: 0,
                                    children: resultData['Consequences']
                                }],
                            'likeLihoods':
                                [{
                                    name: 'Select Maximum Reasonable Likelihood',
                                    id: 0,
                                    children: resultData['LikeLihoods']
                                }],
                            'nonCompliances': resultData['NonCompliances'],
                            'riskMatrix': Impact['RiskMatrix']
                        },
                    })
                    for ( let i in Impact.Impacts) {
                        if (Impact.Impacts[i].ActualConsequenceID !== null) {
                            var id = []
                            id.push((Impact.Impacts[i].ActualConsequenceID).toString())
                            this.onSelected(id, Impact.Impacts[i].ImpactName, 'nochange', 'actualConsequence')
                        }
                        if (Impact.Impacts[i].ConsequenceID !== null) {
                            var id = []
                            id.push((Impact.Impacts[i].ConsequenceID).toString())
                            this.onSelected(id, Impact.Impacts[i].ImpactName, 'nochange', 'MRC')

                        }
                        if (Impact.Impacts[i].LikelihoodID !== null) {
                            var id = []
                            id.push((Impact.Impacts[i].LikelihoodID).toString())
                            this.onSelected(id, Impact.Impacts[i].ImpactName, 'nochange', 'MRL')
                        }
                    }
                }
                else CommonService.handleError(response)

            })
                .catch(error => {
                    CommonService.showErrorNotification(error.message)
                })
        } catch (ex) {
            CommonService.showErrorNotification(ex.Message)
        } finally {
            this.showHideSpinner(false)
        }
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        })
    }

    onSelected = (selectedItems, type, Changes, stateType) => {
        if (Changes === 'Change') { this.setState({ unSavedChanges: true }) }
        this.setState({
            [stateType]: {
                ...this.state[stateType],
                [type]: selectedItems
            }
        });
        if (stateType === 'MRC' || stateType === 'MRL') {
            setTimeout(() => {
                this.calculateOutcomeResult(this.state.MRC[type], this.state.MRL[type], type)
            }, 10)
        }
    }
    calculateOutcomeResult = (ConsequenceID, LikelihoodID, type) => {
        var matrixArray = this.state.ImpactModal['riskMatrix'];
        var consequenceId = ConsequenceID;
        var likelihoodID = LikelihoodID;
        if (likelihoodID.length > 0 && consequenceId.length > 0) {
            var consequences = this.getListByProperty(matrixArray, "LikelihoodID", likelihoodID)[0].Consequences;
            var outcome = this.getListByProperty(consequences, "ConsequenceID", consequenceId)[0];
            this.showOutcomeResult(type, outcome)
        }
    }
    getListByProperty = function (list, property, value) {
        var categoryList = [];
        for (let index in list) {
            if ((list[index])[property] == value) {
                categoryList.push(list[index]);
            }
        }
        if (categoryList.length > 0) {
            return categoryList;
        }
        return null;
    }
    showOutcomeResult = (type, outcome) => {
        this.setState({
            outComeResult: {
                ...this.state.outComeResult,
                [type]: {
                    'color': outcome.Color,
                    'forecolor': outcome.Rating == "Critical" ? "#fff" : "#4d4d4d",
                    'Rating': outcome.Rating,
                    'RatingID': outcome.RatingID,
                }
            }
        })
    }
    OutcomeMatrix = (data, value, type) => {
        var LikelihoodID = []
        var ConsequenceID = []
        ConsequenceID.push((value.ConsequenceID).toString())
        LikelihoodID.push((data.LikelihoodID).toString())
        this.onSelected(ConsequenceID, type, 'Change', 'MRC')
        this.onSelected(LikelihoodID, type, 'Change', 'MRL')
        this.setState({ [type]: false, unSavedChanges: true });
    }
    checkCondition(actualConsequences, consequences) {
        var ActualConsequences;
        var Consequences;
        for (let i in this.state.ImpactModal.actualConsequences[0].children) {
            if (actualConsequences == this.state.ImpactModal.actualConsequences[0].children[i].id) {
                ActualConsequences = this.state.ImpactModal.actualConsequences[0].children[i].name.substring(0, 1)
            }
        }
        for (let j in this.state.ImpactModal.consequences[0].children) {
            if (consequences == this.state.ImpactModal.consequences[0].children[j].id) {
                Consequences = this.state.ImpactModal.consequences[0].children[j].name.substring(0, 1)
            }
        }
        if (ActualConsequences <= Consequences) return true
        else return false
    }
    saveImpact = async (page ,listingPage) => {
        const { ImpactModal } = this.state
        var errorStatus = false;
        var check;
        var Impactmodelvalues = []
        try {
            for ( let index in ImpactModal["impactsModel"]) {
                if (this.state.actualConsequence[ImpactModal.impactsModel[index].ImpactName] == undefined || this.state.actualConsequence[ImpactModal.impactsModel[index].ImpactName].length == 0) {
                    CommonService.showErrorNotification(ImpactModal.impactsModel[index].ImpactName + " " + message.impactMessage.actualConsequence)
                    errorStatus = true
                    break;
                } else if (this.state.MRC[ImpactModal.impactsModel[index].ImpactName] == undefined || this.state.MRC[ImpactModal.impactsModel[index].ImpactName].length == 0) {
                    CommonService.showErrorNotification(ImpactModal.impactsModel[index].ImpactName + " " + message.impactMessage.consequence)
                    errorStatus = true
                    break;
                } else if (this.state.MRL[ImpactModal.impactsModel[index].ImpactName] == undefined || this.state.MRL[ImpactModal.impactsModel[index].ImpactName].length == 0) {
                    CommonService.showErrorNotification(ImpactModal.impactsModel[index].ImpactName + " " + message.impactMessage.likehood)
                    errorStatus = true
                    break;
                } else {
                    var check = this.checkCondition(this.state.actualConsequence[ImpactModal.impactsModel[index].ImpactName][0], this.state.MRC[ImpactModal.impactsModel[index].ImpactName][0])
                    if (check == true) {
                        Impactmodelvalues.push({
                            IncidentImpactID: ImpactModal.impactsModel[index].IncidentImpactID,
                            IncidentID: ImpactModal.impactsModel[index].IncidentID,
                            ActualConsequenceID: this.state.actualConsequence[ImpactModal.impactsModel[index].ImpactName][0],
                            ConsequenceID: this.state.MRC[ImpactModal.impactsModel[index].ImpactName][0],
                            LikelihoodID: this.state.MRL[ImpactModal.impactsModel[index].ImpactName][0],
                            RatingID: this.state.outComeResult[ImpactModal.impactsModel[index].ImpactName].RatingID,
                            SubTypes: this.state.subTypes[ImpactModal.impactsModel[index].ImpactName],
                        })

                    } else {
                        CommonService.showErrorNotification(ImpactModal.impactsModel[index].ImpactName + " " + message.impactMessage.actualConsequenceCheck)
                        errorStatus = true
                        break;
                    }
                }
                if (errorStatus) {
                    break
                }
            }
        } catch (ex) {
        }
        if (!errorStatus) {
            this.showHideSpinner(true)
            try {
                await IncidentService.saveImpact(
                    this.props.token, Impactmodelvalues, this.state.incidentId
                ).then(response => {
                    const data = response['data']
                    const data1 = data['Data']
                    if (data['Success'] === true) {
                        this.showHideSpinner(false)
                        CommonService.showSuccessNotification("Incident Impact details is successfully updated ")
                        page !== undefined ?this.navigationBack(page ,listingPage):
                        this.props.navigation.navigate('Incident', {
                           id: this.state.incidentId
                        })
                    }
                    else CommonService.handleError(response)
                })
                    .catch(error => {
                        CommonService.showErrorNotification(error.message)
                    })
            } catch (ex) {
                CommonService.showErrorNotification(ex.Message)
            } finally {
                this.showHideSpinner(false)
            }
        }
    }
    close = async () => {
        const isNewIncident = this.state.incidentId == 0 ? true : false
        isNewIncident
            ? this.props.navigation.navigate('Home')
            : this.props.navigation.navigate('Incident', {
               id: this.state.incidentId
            })

    }
    matrixSelector(type) {
        this.setState({ unSavedChanges: true })
        this.setState({ [type]: true });
    }
    showImpactData(type) {
        this.setState({
            showImpactData: {
                ...this.state.showImpactData,
                [type]: !(this.state.showImpactData[type])
            }
        });
    }
    matrixSelectorView = (ImpactName) => {
        return (
            <View style={styles.tableWrap}>
                <View style={{ flexDirection: 'column', width: '100%' }}>
                    <View style={styles.tableHead}>
                        <View style={{ width: "16.66666666666667%", opacity: 0 }}>
                            <Text style={styles.thadText}>Likelihood </Text>
                        </View>
                        <View style={{ borderWidth: 1, borderBottomWidth: 0, flex: 1 }}>
                            <Text style={styles.thadText}>Consequence</Text>
                        </View>
                    </View>
                    {this.state.ImpactModal['riskMatrix'] &&
                        <View style={styles.tBody}>
                            <View style={styles.tRow}>
                                <View style={{ borderRightWidth: 1, width: "16.66666666666667%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity>
                                        <Text style={styles.cellText1}>Likelihood</Text>
                                    </TouchableOpacity>
                                </View>
                                {this.state.ImpactModal["consequenceslist"].map((data, index) => {
                                    return (
                                        <View key={index} style={{ borderRightWidth: 1, width: "16.66666666666667%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={styles.cellHeading}> {data.name} </Text>
                                        </View>
                                    )
                                })}
                            </View>
                            {this.state.ImpactModal["riskMatrix"].map((riskMatrix, index) => {
                                return (
                                    <View style={styles.tRow} key={index}>
                                        <View style={{ borderRightWidth: 1, width: "16.66666666666667%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={styles.cellText1}> {riskMatrix.Likelihood} </Text>
                                        </View>
                                        {riskMatrix.Consequences.map((value, index1) => {
                                            return (
                                                <View key={index1} style={{ borderRightWidth: 1, height: 30, width: "16.66666666666667%", backgroundColor: value.Color, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                                    <TouchableOpacity onPress={() => { this.OutcomeMatrix(riskMatrix, value, ImpactName) }} >
                                                        <Text style={[styles.cellHeading, { color: 'black' }]}> {value.Rating} </Text>
                                                    </TouchableOpacity>
                                                </View>);
                                        })}
                                    </View>
                                );
                            })}
                        </View>
                    }
                </View>
            </View>
        )
    }
    mroOutcomeView = (outComeResult) => {
        return (
            <View style={{ paddingHorizontal: 10 }}>
                <View style={[styles.inputPadding, {
                    flexDirection: "row", justifyContent: "flex-start", alignItems: "center", borderWidth: 1,
                    borderColor: '#c9c9c9', height: 40, backgroundColor: outComeResult.color ? outComeResult.color : "#eee8aa"
                }]}>
                    <Text style={{ color: "black" }}>{outComeResult.Rating}</Text>
                </View>
            </View>
        )
    }
    sectionedMultiView = (items, type, statetype, selectedItem, selectText, single) => {
        return (
            <SectionedMultiSelect
                chipRemoveIconComponent={this.state.ImpactModal["IncidentLocked"] && this.props.isMobileuser == false}
                disabled={this.state.ImpactModal["IncidentLocked"] && this.props.isMobileuser == false}
                items={items}
                confirmText='Close'
                uniqueKey='id'
                subKey='children'
                selectText={selectText}
                hideSearch={false}
                showDropDowns={true}
                single={single}
                readOnlyHeadings={true}
                expandDropDowns={true}
                onSelectedItemsChange={(selectedItems) => this.onSelected(selectedItems, type, 'Change', statetype)}
                selectedItems={selectedItem}
                styles={
                    this.state.ImpactModal["IncidentLocked"] && this.props.isMobileuser == false ?
                        {
                            chipContainer: {
                                width: '40%'
                            }
                        } : {
                            chipContainer: {}
                        }
                }
            />
        )
    }
    checkUnSavedData(page,listingPage) {
        const { navigation } = this.props
        if (this.state.unSavedChanges) {
            Alert.alert(
                'Unsaved Changes',
                'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
                [
                    { text: 'Save Changes', onPress: () =>{this.saveImpact(page ,listingPage)}},
                    { text: 'Undo Changes', onPress: () =>{ this.navigationBack(page ,listingPage) }},
                    {text: 'Cancel',style: 'cancel',onPress: () => this.setState({ nextPagedialog: false})},
                ],
                { cancelable: false }
            )
        } else this.navigationBack(page ,listingPage)
    }
       navigationBack(page ,listingPage) {
           const { navigation } = this.props
        this.setState({ nextPagedialog: false })
        if (page !== 'goback') { 
            this.props.navigation.navigate(page, {listingPage:listingPage,  id: this.state.incidentId, pageName: 'ImpactDetail', IncidentLocked: this.state.ImpactModal["IncidentLocked"] && this.props.isMobileuser == false ,TenantIncidentId:navigation.state.params.TenantIncidentId ,}) }
        else {
            let index = this.props.navigation.dangerouslyGetParent().state.index;
            if (index > 1) {
                this.props.navigation.goBack();
            } else {
                this.props.navigation.navigate('Incident', { id: this.state.incidentId,})
            }
        }
    }
    //#endregion
    render() {
        const { spinner, incidentId, nextPagedialog,ImpactModal } = this.state
        const { navigation } = this.props
        return (
            <View style={appStyles.container}>
                 <HeaderView PropFunction={() => this.checkUnSavedData('goback')}
                     Title={ navigation.state.params.TenantIncidentId ? 'Incident #' +  `${navigation.state.params.TenantIncidentId }`:'Incident #'}
                    Pagename={'incident'}
                ></HeaderView>
                <View style={styles.spinnercontainer}>
                    <Spinner
                        visible={spinner}
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>
                <ScrollView>
                    {this.state.ImpactModal &&
                        <View>
                            {this.state.ImpactModal["impactsModel"].map((data, index) => {
                                return (
                                    <View key={index}>
                                        <View style={{ marginBottom: 10 }}>
                                            <View style={styles.headWrap}>
                                                <Text style={{ fontSize: 30, color: '#444', paddingVertical: 3,marginBottom:4,textAlign:"center" }}>
                                                {data.ImpactName}
                                                    </Text>
                                                <View style={{ position:"absolute", right:10,top:10 }}>
                                                    <Icon
                                                        style={{}}
                                                        onPress={() => this.showImpactData(data.ImpactName)}
                                                        name={this.state.showImpactData[data.ImpactName] ? 'angle-up' : 'angle-down'}
                                                        type='font-awesome'
                                                        color='#444'
                                                        size={25}
                                                    />
                                                </View>
                                            </View>

                                        </View>
                                        {this.state.showImpactData[data.ImpactName] &&
                                            <View>
                                                <View style={styles.fieldPadding}>
                                                    <Text style={styles.textLabel}>Actual Consequence</Text>
                                                    <View
                                                        style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                        <View style={appStyles.multiSec}>
                                                            {this.sectionedMultiView(this.state.ImpactModal['actualConsequences'], data.ImpactName, 'actualConsequence', this.state.actualConsequence[data.ImpactName], 'Choose Actual Concequence', true)}
                                                        </View>
                                                        <View style={appStyles.fieldIcon}>
                                                            <Icon name='search' color='#c9c9c9' size={30} />
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.fieldPadding}>
                                                    <View>
                                                        <Text
                                                            style={{
                                                                fontSize: 14,
                                                                textAlign: 'center',
                                                                color: '#444',
                                                                marginVertical: 5,
                                                            }}>
                                                            Risk Matrix
                                                 </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 5, }}>
                                                        <View><Text
                                                            style={{
                                                                fontSize: 12,
                                                                textAlign: 'center',
                                                                color: '#444',

                                                            }}>
                                                            Select the MRC and MRL individually, or use the{' '}</Text></View>
                                                        <View>
                                                            <TouchableOpacity onPress={() =>{!(this.state.ImpactModal["IncidentLocked"]  && this.props.isMobileuser == false) &&
                                                                 this.matrixSelector(data.ImpactName)}
                                                                }
                                                                 >
                                                                <Text style={{ fontSize: 12, color: 'blue', textDecorationLine: 'underline' }}>
                                                                    Risk Matrix Selector
                                             </Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </View>
                                                    {this.state[data.ImpactName] && this.matrixSelectorView(data.ImpactName)}
                                                    <View style={styles.secField}>
                                                        <Text style={styles.textLabel}>Maximum Reasonable Consequence (MRC)</Text>
                                                        <View
                                                            style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                            <View style={appStyles.multiSec}>
                                                                {this.sectionedMultiView(this.state.ImpactModal['consequences'], data.ImpactName, 'MRC', this.state.MRC[data.ImpactName], 'Choose Maximum Reasonable Consequence', true)}
                                                            </View>
                                                            <View style={appStyles.fieldIcon}>
                                                                <Icon name='search' color='#c9c9c9' size={30} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.secField}>
                                                        <Text style={styles.textLabel}>Maximum Reasonable Likelihood (MRL)</Text>
                                                        <View
                                                            style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                            <View style={appStyles.multiSec}>
                                                                {this.sectionedMultiView(this.state.ImpactModal['likeLihoods'], data.ImpactName, 'MRL', this.state.MRL[data.ImpactName], 'Choose Maximum Reasonable Likelihood', true)}
                                                            </View>
                                                            <View style={appStyles.fieldIcon}>
                                                                <Icon name='search' color='#c9c9c9' size={30} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.secField}>
                                                        <Text style={styles.textLabel}>Maximum Reasonable Outcome (MRO)</Text>
                                                        {this.mroOutcomeView(this.state.outComeResult[data.ImpactName])}
                                                    </View>
                                                    <View style={styles.secField}>
                                                        <Text style={styles.textLabel}>Sub Types</Text>
                                                        <View
                                                            style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}>
                                                            <View style={appStyles.multiSec}>
                                                                {this.sectionedMultiView(data.Sub, data.ImpactName, 'subTypes', this.state.subTypes[data.ImpactName], 'Choose Sub Types', false)}

                                                            </View>
                                                            <View style={appStyles.fieldIcon}>
                                                                <Icon name='search' color='#c9c9c9' size={30} />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>}
                                    </View>
                                );
                            })
                            }
                        </View>
                    }

                </ScrollView>
                <FooterView PropFunction={() => this.saveImpact()}
                    ChoosePage={() => this.setState({ nextPagedialog: true })}
                    IncidentLocked={this.state.ImpactModal["IncidentLocked"] && this.props.isMobileuser == false}
                    Close={()=> this.props.navigation.navigate('Incident', {
                      id: this.state.incidentId
                    })}
                ></FooterView>
                {nextPagedialog &&
                    <ChoosePageMenu ClosePage={() => this.setState({ nextPagedialog: false })} navpage='ImpactDetailScreen'
                    newIncidentNavigationfunction={() => this.checkUnSavedData('Incident')}
                    additionalDetailNavigationfunction={() =>this.checkUnSavedData('AdditionalDetail')}
                    investigationDetailNavigationfunction={()=>this.checkUnSavedData('InvestigationDetail')}
                      actionNavigationfunction={() => this.checkUnSavedData('Actionlist')}
                    nextPagedialog={nextPagedialog}
                    peopleListNavigationfunction={() => this.checkUnSavedData('PeopleList' ,'PeopleList')}
                    InjuryAndIllnessListNavigationfunction={() => this.checkUnSavedData('PeopleList' ,'InjuryAndIllnessList')}
                    />
                }

            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        isMobileuser: state.home.isMobileUser
        
    }
}
export default connect(mapStateToProps)(ImpactDetailScreen)