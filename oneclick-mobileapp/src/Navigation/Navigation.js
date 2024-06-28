import { ScrollView, SafeAreaView, StyleSheet, Text, View,TouchableOpacity, AsyncStorage } from 'react-native';
import { DrawerItems } from 'react-navigation'
import React, { Component } from 'react';
import { connect } from 'react-redux';
const search_Incident = "Search Incident";
const search_Action = "Action Search";
class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fInitial: '',
      lInitial: '',
    }
  }
  componentDidMount() {
    this.state.fInitial = this.props.firstName.charAt(0);
    this.state.lInitial = this.props.lastName.charAt(0);
  }
  Logout = () => {
    AsyncStorage.removeItem("userData");
    AsyncStorage.removeItem("savelatlong");
    this.props.navigation.navigate('Login')
  }
  handleDrawerPressed(route) {
    debugger
    if (route.route.routeName === search_Incident) this.props.saveIsIncidentScreenRefresh(true);
    else if (route.route.routeName === search_Action) this.props.saveIsActionScreenRefresh(true);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.navigationHeader}>
          <Text style={styles.initials}>{this.state.fInitial}{this.state.lInitial}</Text>
          <Text style={styles.userName}>{this.props.firstName} {this.props.lastName}</Text>
        </View>
        <ScrollView>
          {/* <DrawerItems  {...this.props}>
          </DrawerItems> */}
          <DrawerItems
            {...this.props}
            onItemPress={(route) => {
              this.handleDrawerPressed(route)
              this.props.onItemPress(route, { paramName: 'value' });
            }} />

          <TouchableOpacity onPress={() => this.Logout()}>
            <Text style={{ margin: 16, fontWeight: 'bold', }}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  navigationHeader: {
    paddingTop: 45,
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 23,
    backgroundColor: '#eb8c3a',
  },
  initials: {
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 44,
    textAlign: 'center',
    marginRight: 6,
    color: '#eb8c3a',
    fontSize: 18
  },
  userName: {
    fontSize: 18,
    marginLeft: 10,
    flexWrap: 'wrap',
    flex: 1,
    color: '#fff'
  }
});

function mapStateToProps(state) {
  return {
    firstName: state.home.firstName,
    lastName: state.home.lastName,
    isActionScreenRefresh:state.home.isActionScreenRefresh,
    isIncidentScreenRefresh:state.home.isIncidentScreenRefresh,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    saveIsIncidentScreenRefresh: (value) => dispatch({ type: "SaveIsIncidentScreenRefresh", data: value }),
    saveIsActionScreenRefresh: (value) => dispatch({ type: "SaveIsActionScreenRefresh", data: value })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);