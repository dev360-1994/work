import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView, Alert, BackHandler } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { LoginService, CommonService } from '../../Services';
import Spinner from 'react-native-loading-spinner-overlay';
import { Left, Header, Body } from 'native-base';
import accountConstant from '../../constants/account';
import styles from './Style';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.scrollView = React.createRef()
        this.state = {
            spinner: false,
            menuOptions: [],
            customBorderWidth: 0,
            customBorderRightWidth: 0,
            orientation: ""
        }
    }
    //#region  Methods
    UNSAFE_componentWillMount = async () => {
        const { navigation } = this.props
        this.focusListener = navigation.addListener('didFocus', (data) => {
            this.userDashBoard()
            this.scrollView.current.scrollTo({ x: 0, y: 0, animated: false })
        })
    }
    userDashBoard= async () => {
        this.showHideSpinner(true);
        try {
            await LoginService.userDashBoard(this.props.token).then((response) => {
                const data = response["data"];
                if (data["Success"] == true && response.status == accountConstant.httpStatus.Ok)
                    this.state.menuOptions = data["Data"];

                else
                    CommonService.handleError(response);

            }).catch((error) => {
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
    componentDidMount() {
        this.showHideSpinner(false);
        this.getOrientation();
        Dimensions.addEventListener("change", () => {
            this.getOrientation();
        });
        this.didFocus = this.props.navigation.addListener("didFocus", () =>
            CommonService.handleAndroidBackButton(this.handleBackPress),
        );
        this.willBlur = this.props.navigation.addListener("willBlur", () =>
            CommonService.handleAndroidBackButton(this.handleBackPress),
        );
    }

    getOrientation = () => {
        if (this.refs.rootView) {
            if (Dimensions.get("window").width < Dimensions.get("window").height) {
                this.setState({ orientation: "portrait" });
            } else {
                this.setState({ orientation: "landscape" });
            }
        }
    };

    // componentWillUnmount() {
    //   //  CommonService.removeAndroidBackButtonHandler();
    // }

    showHideSpinner(spinnerstate) {
        this.setState({
            spinner: spinnerstate
        });
    }

    handleBackPress = () => {
        const { state } = this.props.navigation;
        if (state && state.routeName === 'Home') {
            Alert.alert(
                'Exit App',
                'Do you want to Quit App?', [{
                    text: 'Cancel',
                    onPress: () => console.log(''),
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: () => this.exitFromApp()
                },], {
                cancelable: false
            }
            )
            return true;
        }
        return false;
    }

    exitFromApp = () => {
        BackHandler.exitApp();
        return true;
    }
    //#endregion
    render() {
        return (
            <View ref="rootView" style={styles.welcomeContainer}>
                <View style={styles.container}>
                    <Spinner visible={this.state.spinner} textStyle={styles.spinnerTextStyle} />
                </View>
                <Header style={{ backgroundColor: '#eb8c3a', width: '100%', marginTop: 30, }}>
                    <Left style={styles.naviconContainer}  >
                        <TouchableOpacity style={styles.iconButton} onPress={() => this.props.navigation.openDrawer()}>

                            <Icon name='menu' type='material' color='white' size={24} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={styles.screenTitleContainer}>
                        <Image source={require('../../Images/logo.png')} style={styles.logoImage} />
                    </Body>
                </Header>
                <ScrollView
                ref={this.scrollView}
                >
                    <View style={styles.welcomeTop}>
                        <Text style={styles.welcomeText}>Welcome, {this.props.firstName} {this.props.lastName}. </Text>
                    </View>
                    <View style={styles.welcomeBottom}>

                        {this.state.menuOptions.length > 0 &&
                            <View style={styles.iconContainer}>
                                {this.state.menuOptions.map((data, key) => {
                                    this.state.customBorderWidth = key === 0 || key === 1 ? 1 : 0;
                                    this.state.customBorderRightWidth = key % 2 !== 0 ? 0 : 1;
                                    return (
                                        <View
                                            style={[
                                                styles.iconItem,
                                                {
                                                    borderTopWidth: this.state.customBorderWidth,
                                                    borderRightWidth: this.state.customBorderRightWidth,
                                                    width: (this.state.orientation == 'portrait') ? Dimensions.get("window").width / 2 : '50%'
                                                },
                                            ]}
                                            key={key}>
                                            <Icon
                                                name={data.IconName}
                                                onPress={() => data.Link !== "" || data.Link !== null ? this.props.navigation.navigate(data.Link, data.Link === 'Action' && { ActionType: 4, pageName: 'HomeScreen' }) : null}
                                                type={data.Id == 6 ? 'font-awesome' : 'material'}
                                                color='#eb8c3a' size={64} />
                                            <Text style={styles.iconText}>{data.Description}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        firstName: state.home.firstName,
        lastName: state.home.lastName,
        token: state.home.authorizeToken
    }
}

export default connect(mapStateToProps)(HomeScreen)