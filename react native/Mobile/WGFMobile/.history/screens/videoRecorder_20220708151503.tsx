import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { RootDrawerScreenProps } from "../types";
import { StyleSheet, Text, View, Button, Pressable, ToastAndroid } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import DatePicker from 'react-native-datepicker'

import { uploadVideo } from '../services/VideoUploadService';
import { TextInput } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import { Box, CheckIcon, NativeBaseProvider, Select } from 'native-base';
import { Picker } from '@react-native-picker/picker';



export default function VideoRecorderScreen({ navigation }: RootDrawerScreenProps<'VideoRecord'>) {

  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState(true);
  const isFocused = useIsFocused();
  const [image, setImage] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [date, setDate] = useState("");
  let [sound, setSound] = React.useState("");
  let [type, setType] = React.useState(0);
  let [cameraDropDown, setCameraDropDown] = React.useState(0);
  let [tag, setTag] = React.useState(0);


  const soundList = [
    "Remove Audio", "Keep Audio"
  ]
  const typeList = [
    "Game", "Practice", "Scout", "Training", "Other"
  ]
  const CameraList = [
    "SideLine", "Endzone", "Pressbox", "Drone", "Stands", "Body"
  ]
  const tagList = [
    "Test Game", "Multi Angle"
  ]


  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');

      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");

    })();
  }, []);


  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     base64: true,
  //     // mediaTypes: ImagePicker.MediaTypeOptions.Videos
  //   });

  //   // console.log(result);
  //   return result;


  // };


  const takeVideo = async () => {
    setStatus(false);
    if (camera) {
      const { uri, codec = "mp4" } = await camera.recordAsync({
        maxDuration: 60,
      });

      const extension = `.${codec}`;

      //for video id
      var a = uri.split("/");
      var videoId = a[a.length - 1].split(".")[0];


      // MediaLibrary.saveToLibraryAsync(uri).then(() => {
      //   //saves video to gallary
      // });

      console.log("Before base64");
      const fsRead = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });

      // const imgBase64 = await pickImage(); //pick file from gallary

      const response = await uploadVideo(fsRead, videoId, extension);
      console.log(response);
      if (response == "200") {
        uploadSuccesfulToastr();
      } else {
        uploadFailedToastr();
      }

      // const queryString = new URLSearchParams(JSON.stringify(vidData)).toString();

      // let fileUri = FileSystem.documentDirectory + "log2.txt";
      // await FileSystem.writeAsStringAsync(fileUri, fsRead, { encoding: FileSystem.EncodingType.UTF8 });
      // const asset = await MediaLibrary.createAssetAsync(fileUri);
      // await MediaLibrary.createAlbumAsync("Download", asset, false);

    }


  }

  const uploadSuccesfulToastr = () => {
    ToastAndroid.showWithGravity(
      "Upload Complete",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };
  const uploadFailedToastr = () => {
    ToastAndroid.showWithGravity(
      "Upload Failed",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };



  const stopVideo = async () => {
    setStatus(true);
    camera.stopRecording();
  }


  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    isFocused && (

      <View style={{ flexGrow: 1 }}>

        <View style={styles.container}>
          <View style={{ paddingBottom: 10, }}>
            <Text style={styles.paragraph}>
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Title</Text>
              <TextInput
                placeholder='Enter Film title'
                onChangeText={(v) => { }}
                style={{ height: 35, width: 240, borderColor: '#cccccc', borderWidth: 1, paddingLeft: 8 }}>
              </TextInput>
            </View>


          </View>

          <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.text}>Date</Text>
            {/* <TextInput
              placeholder='Enter Film Date'
              onChangeText={(v) => { }}
              style={{ height: 35, width: 240, borderColor: '#cccccc', borderWidth: 1, paddingLeft: 8 }}>
            </TextInput> */}
            <DatePicker
              style={{ width: 200 }}
              date={date}
              mode="date"
              placeholder="Enter Film Date"
              format="YYYY-MM-DD"
              minDate="1900-05-01"
              maxDate="2090-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 160
                },
                dateInput: {
                  marginLeft: -40,
                },
                placeholderText: {
                  marginLeft: -120
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date: any) => { setDate(date) }}
            />

          </View>

          <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.text}>Sound</Text>

            <View style={{ borderWidth: 1, height: 50, width: 240, borderColor: "#cccccc" }}>
              <Picker
                selectedValue={sound}
                onValueChange={sou => setSound(sou)}
                style={{ width: 240, fontSize: 10 }}
                mode="dropdown"
                itemStyle={{ color: 'red', fontWeight: '900', fontSize: 18, padding: 30 }}>
                <Picker.Item label="Remove Audio" value="removeAudio" />
                <Picker.Item label="Keep Audio" value="keepAudio" />
              </Picker>
            </View>

          </View>


          <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.text}>Type</Text>
            <View style={{ borderWidth: 1, height: 50, width: 240, borderColor: "#cccccc" }}>

              <Picker
                selectedValue={type}
                onValueChange={sou => setType(sou)}
                style={{ width: 240, fontSize: 10 }}
                mode="dropdown"
                itemStyle={{ color: 'red', fontWeight: '900', fontSize: 18, padding: 30 }}>
                <Picker.Item label="Game" value="Game" />
                <Picker.Item label="Practice" value="Practice" />
                <Picker.Item label="Scout" value="Scout" />
                <Picker.Item label="Training" value="Training" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>


          <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.text}>Camera</Text>
            <View style={{ borderWidth: 1, height: 50, width: 240, borderColor: "#cccccc" }}>
              <Picker
                selectedValue={cameraDropDown}
                onValueChange={sou => setCameraDropDown(sou)}
                style={{ width: 240, fontSize: 10 }}
                mode="dropdown"
                itemStyle={{ color: 'red', fontWeight: '900', fontSize: 18, padding: 30 }}>
                <Picker.Item label="SideLine" value="SideLine" />
                <Picker.Item label="Endzone" value="Endzone" />
                <Picker.Item label="Pressbox" value="Pressbox" />
                <Picker.Item label="Drone" value="Drone" />
                <Picker.Item label="Stands" value="Stands" />
                <Picker.Item label="Body" value="Body" />
              </Picker>
            </View>
          </View>


          <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.text}>Tags</Text>
            <View style={{ borderWidth: 1, height: 50, width: 240, borderColor: "#cccccc" }}>
              <Picker
                selectedValue={cameraDropDown}
                onValueChange={sou => setCameraDropDown(sou)}
                style={{ width: 240, fontSize: 10 }}
                mode="dropdown"
                itemStyle={{ color: 'red', fontWeight: '900', fontSize: 18, padding: 30 }}>
                <Picker.Item label="Test Game" value="TestGame" />
                <Picker.Item label="Multi Angle" value="MultiAngle" />
                <Picker.Item label="Pressbox" value="Pressbox" />
              </Picker>
            </View>
          </View>


          <View >

            <View style={styles.button}>
              <Button onPress={() => { }} color={"#6c757d"} title='Create Film' />
            </View>


          </View>

        </View>

      </View>



      // <View style={{ flex: 1 }}>
      //   <View style={styles.cameraContainer}>
      //     <Camera
      //       ref={ref => setCamera(ref)}
      //       style={styles.fixedRatio}
      //       cameraType={type}
      //       ratio={'4:3'}
      //     />
      //   </View>



      //   <View style={{ flexDirection: 'row' }}>
      //     <Pressable onPress={() => takeVideo()}
      //       style={{ height: 50, backgroundColor: '#000', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
      //       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Start Rec</Text>
      //     </Pressable>
      //     <Pressable onPress={() => stopVideo()}
      //       style={{ height: 50, backgroundColor: 'red', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
      //       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Stop Rec</Text>
      //     </Pressable>

      //     {!status ?
      //       <Pressable
      //         style={{ height: 50, backgroundColor: 'pink', width: '33.3%', alignItems: 'center', justifyContent: 'center' }}>
      //         <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Live</Text>
      //       </Pressable> : undefined
      //     }

      //   </View>

      // </View>
    )
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,

  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 30,
    backgroundColor: '#ffffff',
    marginBottom: 10
  },
  paragraph: {
    marginTop: 60,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "left",
    color: '#34495e',

  },

  text: {
    fontWeight: "bold",
    fontSize: 20
  },
  button: {
    marginTop: 50,
    marginBottom: "100%",
    width: 140,
    marginLeft: 100,


  }

})