import React, { useState, useEffect } from 'react';
import { RootDrawerScreenProps } from "../types";
import { StyleSheet, Text, View, Button, Pressable, ToastAndroid, Modal, Platform, ActionSheetIOS, StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import DatePicker from 'react-native-datepicker';
import { createNewFilm, uploadVideo } from '../services/VideoUploadService';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoRecorderModal } from './Film/CameraModal';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from 'react-native-paper';


export default function VideoRecorderScreen({ navigation }: RootDrawerScreenProps<'VideoRecord'>) {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const [date, setDate] = useState("");
  let [sound, setSound] = React.useState(0);
  let [type, setType] = React.useState("Game");
  let [camera, setCamera] = React.useState(0);
  let [tag, setTag] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [filmTitle, setFilmTitle] = React.useState("");
  const [isIOS, setIsIOS] = React.useState(false);
  const [filmGuid, setFilmGuid] = React.useState("");
  const [playListid, setplayListid] = React.useState("");
  const [openSound, setOpenSound] = useState(false);
  const [soundItems, setSoundItems] = useState([
    { label: 'Remove Audio', value: 0 },
    { label: 'Keep Audio', value: 1 }
  ]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "ios") {
        setIsIOS(true);
      }
    })();
  }, []);

  const filmModal = { TeamId: 0, UserId: 0, Title: "", Date: "", Audio: 0, Group: "", Angle: 0, Tags: "" };

  const createFilmHandler = async () => {
    filmModal.Title = filmTitle;
    filmModal.Date = date;
    filmModal.Audio = parseInt(sound.toString());
    filmModal.Group = type;
    filmModal.Angle = parseInt(camera.toString());
    filmModal.Tags = tag;
    // console.log(filmModal);
    var result = await createNewFilm(filmModal);
    // console.log(result.data);
    console.log("create film complete");
    setFilmGuid(result.data["filmguid"]);
    setplayListid(result.data["playlistid"]);
    console.log(result.data["filmguid"]);
    // setModalVisible(true);
    // console.log("flimguid: " + filmGuid);
    navigation.navigate("RecorderTemp", {
      filmTitle: filmTitle,
      filmGuid: result.data["filmguid"],
      playListid: result.data["playlistid"]
    });
  }

  const onPressSoundDropdown = (options: [""]) => ActionSheetIOS.showActionSheetWithOptions(
    {
      options: options,
      destructiveButtonIndex: options.length - 1,
      cancelButtonIndex: options.length - 1,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === options.length - 1) {
        return;
      }
      setSound(buttonIndex);
    }
  )
  const onPressTypeDropdown = (options: [""]) => ActionSheetIOS.showActionSheetWithOptions(
    {
      options: options,
      destructiveButtonIndex: options.length - 1,
      cancelButtonIndex: options.length - 1,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === options.length - 1) {
        return;
      }
      setType(options[buttonIndex]);
    }
  )
  const onPressCameraDropdown = (options: [""]) => ActionSheetIOS.showActionSheetWithOptions(
    {
      options: options,
      destructiveButtonIndex: options.length - 1,
      cancelButtonIndex: options.length - 1,
      userInterfaceStyle: 'dark'
    },
    buttonIndex => {
      if (buttonIndex === options.length - 1) {
        return;
      }
      setCamera(buttonIndex);
    }
  )
  const getTextColor = () => {
    return theme.colors.background === "rgb(1, 1, 1)" ? "white" : "black";
  }

  return (
    isFocused && (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <View style={{ paddingBottom: 10, }}>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={[styles.text, { color: getTextColor() }]}>Title</Text>
                <TextInput
                  placeholder='Enter Film title'
                  onChangeText={(v) => { setFilmTitle(v) }}
                  style={styles.textInput}>
                </TextInput>
              </View>

            </View>

            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Date</Text>
              <View style={styles.datePickerContainer}>
                <DatePicker
                  style={styles.datePicker}
                  date={date}
                  mode="date"
                  placeholder="Enter Film Date"
                  format="YYYY-MM-DD"
                  minDate="1900-05-01"
                  maxDate="2090-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: styles.dateIcon,
                    dateInput: {
                      backgroundColor: '#ffffff',
                    },
                    placeholderText: {
                      // marginLeft: Platform.OS === "android" ? -84 : -50,
                      paddingRight: 75,
                      fontSize: 16,
                      color: "#8e8e8e"
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date: any) => { setDate(date) }}
                />
              </View>

            </View>

            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Sound</Text>

              {/* <DropDownPicker
                containerProps={{
                  height: openSound === true ? 170 : null,
                  backgroundColor: "#fff",
                }}
                open={openSound}
                value={0}
                items={soundItems}
                setOpen={setOpenSound}
                setValue={setSound}
                setItems={setSoundItems}
                dropDownDirection="BOTTOM"
                containerStyle={{ width: "65%" }}
              /> */}

              <View style={styles.pickerContainer}>
                {
                  !isIOS &&
                  <Picker
                    selectedValue={sound}
                    onValueChange={sou => setSound(sou)}
                    // style={{ width: 240, fontSize: 20 }}
                    mode="dropdown"
                    itemStyle={styles.pickerItemStyle}
                  >
                    <Picker.Item label="Remove Audio" value="0" />
                    <Picker.Item label="Keep Audio" value="1" />
                  </Picker>
                }
                {
                  isIOS &&
                  <Text
                    style={[styles.text, { paddingLeft: 10, paddingTop: 12, fontWeight: "400" }]}
                    onPress={() => onPressSoundDropdown(["Remove Audio", "Keep Audio", "Cancel"],)} >{sound}
                  </Text>
                }
              </View>
            </View>

            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Type</Text>
              <View style={styles.pickerContainer}>
                {
                  !isIOS &&
                  <Picker
                    selectedValue={type}
                    onValueChange={sou => setType(sou)}
                    // style={{ width: 240, fontSize: 10 }}
                    mode="dropdown"
                    itemStyle={styles.pickerItemStyle}>
                    {/* <Picker.Item style={{ color: "#8e8e8e", fontSize: 16, }} value='' label='Select Film Type' /> */}
                    <Picker.Item label="Game" value="Game" />
                    <Picker.Item label="Practice" value="Practice" />
                    <Picker.Item label="Scout" value="Scout" />
                    <Picker.Item label="Training" value="Training" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>

                }
                {
                  isIOS &&
                  <Text
                    style={[styles.text, { paddingLeft: 10, paddingTop: 12, fontWeight: "400" }]}
                    onPress={() =>
                      onPressTypeDropdown(["Game", "Practice", "Scout", "Training", "Other", "Cancel"])} >
                    {type}
                  </Text>
                }

              </View>
            </View>


            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>Camera</Text>
              <View style={styles.pickerContainer}>
                {
                  !isIOS &&
                  <Picker
                    selectedValue={camera}
                    onValueChange={cam => setCamera(cam)}
                    // style={{ width: 200, fontSize: 10 }}
                    mode="dropdown"
                  >
                    {/* <Picker.Item style={{ color: "#8e8e8e", fontSize: 16, }} value='' label='Select Camera Angle' /> */}
                    <Picker.Item label="SideLine" value="0" />
                    <Picker.Item label="Endzone" value="1" />
                    <Picker.Item label="Pressbox" value="2" />
                    <Picker.Item label="Drone" value="3" />
                    <Picker.Item label="Stands" value="4" />
                    <Picker.Item label="Body" value="5" />
                  </Picker>
                }

                {
                  isIOS &&
                  <Text
                    style={[styles.text, { paddingLeft: 10, paddingTop: 12, fontWeight: "400" }]}
                    onPress={() =>
                      onPressCameraDropdown(["SideLine", "Endzone", "Pressbox", "Drone", "Stands", "Body", "cancel"])
                    } >{camera}
                  </Text>
                }
              </View>
            </View>

            <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.text, { color: getTextColor() }]}>Tags</Text>
              <TextInput
                placeholder='Create or Select Tag'
                onChangeText={v => { setTag(v) }}
                style={styles.textInput}>
              </TextInput>
            </View>
            <View >

              <Pressable onPress={createFilmHandler}
                style={styles.pressableButton}>
                <Text style={{ color: 'white', fontSize: 20 }}>Create Film</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View >

    )
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 30,
    paddingBottom: 0,
    paddingTop: Platform.OS == "android" ? 100 : 50,
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 7,
  },
  textInput: {
    height: 40,
    width: Platform.OS == "android" ? 200 : 180,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    paddingLeft: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 50,
    marginBottom: "100%",
    width: 160,
    marginLeft: 120,
  },
  pressableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#6c757d",
    width: 140,
    height: 50,
    marginTop: 34,
    marginBottom: Platform.OS == "android" ? 150 : 80,
    borderRadius: 10,
    marginLeft: 105,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  datePicker: {
    width: Platform.OS == "android" ? 200 : 180,
  },
  dateIcon: {
    position: 'absolute',
    right: 10,
    top: 4,
    marginLeft: 160
  },
  datePickerContainer: {

  },
  pickerItemStyle: {
    flex: 1,
    fontWeight: '100',
    fontSize: 20,
    paddingTop: 57,
    marginRight: 100,
    height: 60,
    width: 200,
  },
  pickerContainer: {
    borderWidth: 1,
    height: 40,
    width: Platform.OS == "android" ? 200 : 180,
    borderColor: "#cccccc"
  }


})