import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView from 'react-native-map-clustering';
import MapView1 ,{ Marker } from 'react-native-maps';

export default class AutoCompleteScreen extends Component {
  constructor(props)  {
    super(props)
    this.mapView = React.createRef()
    this.state = {
  }}


  render() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});






