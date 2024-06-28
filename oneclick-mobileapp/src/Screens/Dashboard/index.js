import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ScrollView, } from 'react-native';
import { Icon, CheckBox } from 'react-native-elements'
import { HeaderView } from '../../component'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import styles from './Style';
import appStyles from '../../../AppStyle';
import { DashBoardService, CommonService } from '../../Services'
import { Card } from 'react-native-elements';
class DashboardScreen extends Component {
    constructor(props) {
        super(props);
        this.scrollView = React.createRef()
        this.state = {
            unSavedChanges: false,
            spinner: false,
            Kpis: [],
        }
    }
    //#region  Methods
    UNSAFE_componentWillMount() {
        this.showHideSpinner(true);
        const { navigation } = this.props
        this.focusListener = navigation.addListener('didFocus', async (data) => {
            this.getDashBoardData();
            CommonService.handleAndroidBackButton(this.handleBackPress)
          // this.scrollView.current.scrollTo({ x: 0, y: 0, animated: false })
        })
    }
    handleBackPress = () => {
        this.props.navigation.navigate('Home')
        return true
    }
    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        });
    }
    getDashBoardData = async () => {
        this.showHideSpinner(true);
        try {
            await DashBoardService.getDashBoardData(this.props.token).then((response) => {
                const data = response["data"];
                if (data["Success"] == true)
                    this.setState({
                        Kpis: [...response.data.Data]
                    })
                else CommonService.handleError(response);
                this.showHideSpinner(true);
            }).catch((error) => {
                this.showHideSpinner(true);
                CommonService.showErrorNotification(error.message);
            });
        } catch (ex) {
            this.showHideSpinner(true);
            CommonService.showErrorNotification(ex.Message);
        }
        finally {
            this.showHideSpinner(false);
        }
    }
    getSearchScreen = async (key ,Column) => {
        this.props.navigation.navigate(key !== 2  ? 'Search Incident' : 'Action Search', { pageLoad: false, DashboardView: true , filterName : key == 0 ? "openIncident":Column})
    }
    //#endregion
    render() {
        const { spinner } = this.state
        return (
            <View style={appStyles.container}>
                <HeaderView PropFunction={() => this.props.navigation.navigate('Home')}
                    Title={'Dashboard'}
                    Pagename={'incident'} />
                <View>
                    <Spinner visible={spinner} />
                </View>
                {this.state.Kpis.length > 0 &&
                    <ScrollView ref={this.scrollView}>
                        <View style={styles.container}>
                            {/* <Card containerStyle={[styles.card, styles.cardblue]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardHeaderText}>Open Incident</Text>
                                </View>
                                <View style={styles.cardBody}>
                                    <Text style={[styles.bodyText, styles.alignCenter]}>10</Text>
                                </View>
                                <View style={styles.cardFooter}>
                                    <TouchableOpacity style={[styles.footerText, styles.alignCenter]} onPress={() => this.getSearchScreen("Incident")}>
                                        <Text style={styles.linkText}>View</Text>
                                    </TouchableOpacity>
                                </View>
                            </Card> */}
                            {this.state.Kpis.map((Kpi, key) => {
                                return (
                                    key !== 4 ?
                                        <Card key={key} containerStyle={[styles.card, { backgroundColor: Kpi.Colour }]}>
                                            <View style={styles.cardHeader}>
                                                <Text style={styles.cardHeaderText}>{key == 2 ? "Open Actions" : Kpi.Heading}</Text>
                                            </View>
                                            <View style={styles.cardBody}>
                                                {key == 0 ?
                                                    <Text style={[styles.bodyText, styles.alignCenter]}>{Kpi.ChartData[0].OpenIncidents}</Text> :
                                                    <View style={styles.cardinner}>
                                                        <View style={styles.halfwidth}>
                                                            <Text style={styles.cardHeaderText}>{Kpi.SubHeading1}</Text>
                                                            <Text style={[styles.bodyText, styles.alignCenter]}> {Kpi.ChartData[0].Column1} </Text>
                                                        </View>
                                                        <View style={styles.halfwidth}>
                                                            <Text style={styles.cardHeaderText}>{Kpi.SubHeading2}</Text>
                                                            <Text style={[styles.bodyText, styles.alignCenter]}>{Kpi.ChartData[0].Column2} </Text>
                                                        </View>
                                                    </View>}
                                            </View>
                                            
                                                {key == 0 ?
                                                    <View style={styles.cardFooter}>
                                                    <TouchableOpacity style={[styles.footerText, styles.alignCenter]} onPress={() => this.getSearchScreen(key)}>
                                                        <Text style={styles.linkText}>View</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                    : 
                                                    key == 1 ?<View></View>:
                                                 <View style={[styles.cardFooter, styles.cardinner]}>
                                                    <View style={styles.halfwidth}>
                                                        <TouchableOpacity onPress={() =>this.getSearchScreen(key ,key == 2 ?"totalAction":"last7days")}
                                                            style={[styles.footerText, styles.alignCenter]}>
                                                            <Text style={styles.linkText}>View</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={styles.halfwidth}>
                                                        <TouchableOpacity onPress={() =>this.getSearchScreen(key,key == 2 ?"OverDueAction":"Last30days")}
                                                            style={[styles.footerText, styles.alignCenter]}>
                                                            <Text style={styles.linkText}>View</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                }
                                           
                                        </Card>
                                        : <View></View>
                                );
                            })}

                        </View>
                    </ScrollView>
                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        token: state.home.authorizeToken,
        email: state.home.email,
        firstName: state.home.firstName,
        lastName: state.home.lastName,
        tenantName: state.home.tenantName,
        tenantId: state.home.tenantId,
        userId: state.home.userId,
    }
}
export default connect(mapStateToProps)(DashboardScreen)
