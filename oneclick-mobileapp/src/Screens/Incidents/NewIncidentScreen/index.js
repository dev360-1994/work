import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Alert, TextInput, Platform, Animated, Linking, AsyncStorage } from 'react-native'
import { Icon } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import { IntentLauncherAndroid as IntentLauncher } from 'expo'
import { IncidentService, CommonService, ActionService } from '../../../Services'
import { ScrollView } from 'react-native-gesture-handler'
import { ImageViewer, ImageWatermark, HeaderView, MapViewer, FooterView, ChoosePageMenu, DatePicker } from '../../../component/index'
import Video from 'react-native-video';
import Spinner from 'react-native-loading-spinner-overlay'
import message from '../../../Utility/Message'
import SectionedMultiSelect from '../../../Custom-NodeModules/react-native-sectioned-multi-select'
import { connect } from 'react-redux'
import moment from 'moment'
import Validation from '../../../Utility/Validation'
import * as Location from 'expo-location';
import marker from '../../../../assets/Marker.png'
import styles from './Style';
import appStyles from '../../../../AppStyle';
import TreeSelect from '../../../Custom-NodeModules/react-native-tree-select';
import { joinValueInArray} from '../../../Utility/constants';
class NewIncidentScreen extends Component {
  constructor(props) {
    super(props)
    this.scrollView = React.createRef()
    this.state = {
      model: {
        '1description': '',
        '2selectedSite': '',
        '3selectedBussinessUnit': '',
        '4selectedImpacts': [],
      },
      selectedActivities: [],
      date: '',
      time: '',
      spinner: false,
      maxDate: new Date(),
      sitename: 'Select Sites',
      BUnit: 'Select Business Unit',
      impacts: [],
      acitivites: [],
      isSiteSelected: false,
      IsNewSite: false,
      IsNewBUnit: false,
      IsNewActivity: false,
      ActivityName: '',
      imageName: 'Browse Image',
      docName: 'Add Document',
      documents: new FormData(),
      incidentId: '0',
      imagePicker: false,
      unSavedChanges: false,
      isDateTimePickerVisible: false,
      searchText: '',
      initialStop: false,
      addOption: false,
      attachments: [],
      uploadedFiles: [],
      uri: '',
      imageIndex: 0,
      itemType: '',
      modalVisible: false,
      mapRegion: null,
      latitude: 0,
      longitude: 0,
      latitude1: 0,
      longitude1: 0,
      imagewatermark: false,
      blackscreen: false,
      noOfUploadedPhoto: 0,
      incidentModal: {
        'lockedStatus': true
      },
      nextPagedialog: false,
      emptyarr: [],
      allBusinessUnit: [],
      allSite: [],
      valueBunit: [],
      valueSite: [],
      ParentBusinessUnitID: 0,
      ParentSiteID: 0
    }
  }
  //#region  Methods 
  UNSAFE_componentWillMount() {
    this.makeFeildEmpty()
    const { navigation } = this.props
    let id = 0
    this.showHideSpinner(true)
    this.focusListener = navigation.addListener('willFocus', async (data) => {
      if (navigation.state.params == undefined) {
        if (data.action.params == undefined) id = 0
        else id = data.action.params.id
      } else {
        id = navigation.state.params.id
      }
      this.screenIntialize(id)
      CommonService.handleAndroidBackButton(this.handleBackPress)
      this.scrollView.current.scrollTo({ x: 0, y: 0, animated: false })
    })
  }
  componentWillUnmount() {
    this.focusListener.remove()
  }
  screenIntialize(id) {
    if (id > 0) {
      this.makeFeildEmpty()
      this.getIncidentById(id)
    } else {
      this.makeFeildEmpty()
      this.initializeIntialize(
        this.props.token,
        this.props.tenantId,
        this.props.langaugeId
      )
    }
  }
  handleBackPress = () => {
    this.navigation();
    return true
  }
  initializeIntialize = async () => {
    this.showHideSpinner(true)
    try {
      await IncidentService.inidentIntialzie(
        this.props.token,
        this.props.tenantId,
        this.props.langaugeId,
        this.props.userId
      )
        .then(response => {
          const data = response['data']
          if (data['Success'] == true) {
            const inidentModel = data['Data']
            for (var i = 0; i < inidentModel['BUnitList'].length; i++) {
              inidentModel['BUnitList'][i].endNode = true
            }
            for (var i = 0; i < inidentModel['SiteList'].length; i++) {
              inidentModel['SiteList'][i].endNode = true
            }
            this.setState({
              attachments: [], uploadedFiles: [],
              acitivites: [
                {
                  name: 'Select Activites',
                  id: 0,
                  children: inidentModel['ActivitiesList']
                }
              ]
            })
            this.setState({
              impacts: [
                {
                  name: 'Select Impacts',
                  id: 0,
                  children: inidentModel['ImpactsList']
                }
              ]
            })
            this.setState({
              allBusinessUnit: inidentModel['BUnitList'],
              allSite: inidentModel['SiteList'],
              attachments: [], uploadedFiles: []
            })
          } else CommonService.handleError(response)
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
  handleDatePicked = dateTime => {
    const dateTimeArray = moment(dateTime).format('DD-MMM-YYYY HH:mm').split(' ')
    this.setState({ date: dateTimeArray[0], time: dateTimeArray[1] })
    this.setState({ isDateTimePickerVisible: false, unSavedChanges: true })
  }
  async getIncidentById(id, NoLoader) {
    this.setState({ incidentId: id })
    NoLoader !== "NoLoader" && this.showHideSpinner(true)
    try {
      await IncidentService.getIncidentById(id, this.props.token)
        .then(response => {
          const result = response['data']
          if (result['Success'] === true) {
            const data = result['Data']
            for (let index = 0; index < data.SelectedImpacts.length; index++) {
              this.state.model['4selectedImpacts'][
                index
              ] = data.SelectedImpacts[index].id.toString()
            }
            for (let index = 0; index < data.SelectedActivities.length; index++) {
              this.state.selectedActivities[
                index
              ] = data.SelectedActivities[index].id.toString()
            }
            for (var i = 0; i < data['BUnitList'].length; i++) {
              data['BUnitList'][i].endNode = true
            }
            for (var i = 0; i < data['SiteList'].length; i++) {
              data['SiteList'][i].endNode = true
            }
            this.setState({
              latitude: data['Latitude'] !== null ?data['Latitude']:0,
              latitude1:data['Latitude'] !== null ? data['Latitude']:0,
              longitude: data['Longitude'] !== null ?data['Longitude']:0,
              longitude1: data['Longitude'] !== null ?data['Longitude']:0,
              valueSite: {
                key: (data['SiteId']).toString(),
                label: data['SiteName'],
                isLeaf: true
              },
              valueBunit:{
                key: (data['BusinessUnitId']).toString(),
                label: data['BusinessUnitName'],
                isLeaf: true
              },
              incidentModal: result['Data'],
              acitivites: [
                {
                  name: 'Select Activites',
                  id: 0,
                  children: data.ActivitiesList
                }
              ],
              impacts: [
                { name: 'Select Impacts', id: 0, children: data.ImpactsList }
              ],
              BUnit: this.getChildName(data['BusinessUnitName']),
              sitename: this.getChildName(data['SiteName']),
              time: data.IncidentTime.substring(0, 5),
              date: moment(data.Date).format('DD-MMM-YYYY'),
              allBusinessUnit: data['BUnitList'],
              allSite: data['SiteList'],
              model: {
                ...this.state.model,
                '1description': data.ShortDescription,
                '2selectedSite': data['SiteId'],
                '3selectedBussinessUnit': data['BusinessUnitId']
              },
            });
            if (data && (data.Attachments && data.Attachments.length > 0)) {
              const noOfImages = data.Attachments.filter((item, index) => {
                if (item.thumbnailUrl !== "" && (item.type == 'image/jpeg' || item.type == 'image/png' || item.type == 'image/jpg')) {
                  return item
                }
              })
              this.setState({ noOfUploadedPhoto: noOfImages.length, attachments: noOfImages }
                , function () {
                  this.showHideSpinner(false)
                });
            }
            else {
              this.setState({ attachments: this.state.emptyarr }, function () {
                this.showHideSpinner(false)
              });
            }
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
    } catch (error) {
      this.showHideSpinner(false)
      CommonService.showErrorNotification(ex.Message)
    }
  }
 findByIdRecursive(array, id) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.isParent == true) {
        this.GetChildBusinessUnits(parseInt(element.key))
        setTimeout(() => {
          if (element.children) {
             this.findByIdRecursive(element.children, id);
          }
        }, 10);
      } else {

      }
    }
  }
  getChildName(data) {
    const array = data.split('>')
    //return array.length > 1 ? array[array.length - 1] : array[0]
    return data
  }
  makeFeildEmpty() {
    this.setState({
      model: {
        ...this.state.model,
        '1description': '',
        '2selectedSite': '',
        '3selectedBussinessUnit': '',
        '4selectedImpacts': [],
      },
      selectedActivities: [],
      sitename: 'Select Sites',
      BUnit: 'Select Business Unit',
      imageName: 'Browse Image',
      docName: 'Add Document',
      documents: new FormData(),
      impacts: [],
      acitivites: [],
      uploadedFiles: [],
      IsNewActivity: false,
      IsNewSite: false,
      IsNewBUnit: false,
      ActivityName: '',
      imagewatermark: false,
      uri: '', incidentModal: {},
      valueBunit: [],
      valueSite: [],
      latitude: 0,
      longitude: 0,
      latitude1: 0,
      longitude1: 0,
    })
    this.state.uploadedFiles.splice();
  }
  navigation() {
    this.setState({ unSavedChanges: false })
    this.props.navigation.state.params = undefined
    this.makeFeildEmpty()
    if (this.state.incidentId === '0') {
      this.setState({ incidentId: '0' })
      this.props.navigation.navigate('Home')
    } else {
      this.setState({ incidentId: '0' })
      this.props.navigation.navigate('Search Incident', { pageLoad: false, id: null })
    }
  }
  checkUnSavedData() {
    if (this.state.unSavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
        [
          { text: 'Save Changes', onPress: () => { this.saveIncident() } },
          { text: 'Undo Changes', onPress: () => { this.navigation() } },
          { text: 'Cancel', style: 'cancel', },
        ],
        { cancelable: false }
      )
    } else this.navigation()
  }
  showPopUp(fieldname) {
    this.treeSelectRef.open()
    if (fieldname === 'Sites')
     this.setState({
        checkboxListType: "Site",
        isSiteSelected: true,
        searchText: ''
      })
    else
    this.setState({
        checkboxListType: "BusinessUnit",
        isSiteSelected: false,
        searchText: '',
      })
  }
  _pickImage = async () => {
    const { uploadedFiles } = this.state;
    if ((uploadedFiles.length) < 6) {
      this.setState({ imagePicker: true })
    } else {
      CommonService.showWarningNotification("Can not upload more then 6 images at a time.");
    }
  }
  pickGalleryImage = async () => {
    this.setState({ blackscreen: true })
    var permission = await this.checkPermissions()
    if (!permission) return false
    this.setState({ imagePicker: false })
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All
    })
    if (!result.cancelled) {
      let file = result.uri.substring(
        result.uri.lastIndexOf('/') + 1,
        result.uri.length
      )
      let fileext = file.split('.')[1]
      if (fileext == 'mov' || fileext == 'mp4') {
        var arr = this.state.uploadedFiles;
        arr.push(result.uri + "," + file)
        this.setState({ uploadedFiles: arr, blackscreen: false })

      } else {
        this.setState({
          imagewatermark: true,
          uri_image: result.uri
        })
      }
    }
    else {
      this.setState({ blackscreen: false, })
    }

  }
  pickCameraImage = async () => {
    this.setState({ blackscreen: true })
    var permission = this.checkPermissions()
    if (!permission) return false
    this.setState({ imagePicker: false })
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true
    })

    if (!result.cancelled) {
      let file = result.uri.substring(
        result.uri.lastIndexOf('/') + 1,
        result.uri.length
      )
      let fileext = file.split('.')[1]
      if (fileext == 'mov' || fileext == 'mp4') {
        var arr = this.state.uploadedFiles;
        arr.push(result.uri + "," + file)
        this.setState({ uploadedFiles: arr, blackscreen: false })

      } else {
        this.setState({
          imagewatermark: true,
          uri_image: result.uri
        })
      }
    }
    else {
      this.setState({ blackscreen: false })
    }
  }
  async checkPermissions() {
    const warning_message = message.permissionErrors.custom_Permission
    const per = await CommonService.appPermissions()
    if (per === 'granted') return true
    else if (per === 'denied') {
      CommonService.showWarningNotification(warning_message)
      Alert.alert(
        'OneClickHse App Permissions',
        type === 'Access Image and Camera Roll Permission',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: () =>
              Platform.OS == 'android'
                ? IntentLauncher.startActivityAsync(
                  IntentLauncher.ACTION_APPLICATION_SETTINGS
                )
                : Linking.openURL('app-settings:')
          }
        ],
        { cancelable: false }
      )
      return false
    }
  }
  manageImage = async () => {
    this.state.uploadedFiles.forEach((element, index) => {
      let arr = element.split(',');
      let extension = arr[1].split('.')[1];
      this.state.documents.append('file_' + index, {
        uri: arr[0],
        name: arr[1],
        type: 'image/' + extension
      })
    });
  }
  uploadFile = async (isNewIncident, incidentId) => {
    try {
      this.showHideSpinner(true)
      await this.manageImage();
      await IncidentService.uploadIncidentDocuments(
        incidentId,
        this.state.documents,
        this.props.userId,
        this.props.tenantId
      )
        .then(response => {
          const data = response['data']
          if (data['Success'] == true) {
            this.setState({ documents: new FormData() })
            this.showHideSpinner(false)
            CommonService.showSuccessNotification(data['Message'])
          } else {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(data['Message'])
            return
          }
        })
        .catch(error => {
          this.showHideSpinner(false)
          CommonService.showErrorNotification(error.message)
        })
    } catch (error) {
      this.showHideSpinner(false)
      CommonService.showErrorNotification(error['Message'])
    }
  }
  showHideSpinner(spinnerstate) {
    this.setState({
      spinner: spinnerstate
    })
  }
  saveIncident = async (page, listingPage) => {
    this.scrollView.current.scrollTo({ x: 0, y: 0, animated: false })
    const savelatlong = await AsyncStorage.getItem("savelatlong")
    const result = Validation.checkFieldIsNullOrEmpty(this.state.model)
    const { selectedActivities, ActivityName } = this.state;
    if (result.status === false)
      CommonService.showErrorNotification(result.message)
    else if (selectedActivities.length == 0 && ActivityName.length === 0) {
      CommonService.showErrorNotification('Activity is requried field.')
      return false;
    }
    else {
      this.showHideSpinner(true)
      try {
        const isNewIncident = this.state.incidentId == 0 ? true : false
        await IncidentService.saveIncident(
          this.state.incidentId,
          this.props.token,
          this.state.model['1description'],
          this.state.date,
          this.state.time,
          this.state.model['2selectedSite'],
          this.state.model['3selectedBussinessUnit'],
          this.state.model['4selectedImpacts'],
          this.state.selectedActivities,
          this.state.IsNewSite,
          this.state.IsNewBUnit, this.state.IsNewActivity, this.state.ActivityName,
          this.state.latitude == 0 ? savelatlong !== null ? JSON.parse(savelatlong)[0].latitude : null : this.state.latitude,
          this.state.longitude == 0 ? savelatlong !== null ? JSON.parse(savelatlong)[0].longitude : null : this.state.longitude,
          this.state.ParentBusinessUnitID,
          this.state.ParentSiteID,
          this.state.latitude == 0 ? savelatlong !== null ? true : false : true
        )
          .then(response => {
            const data = response['data']
            if (data['Success'] == true) {
              if (this.state.incidentId == 0) {
              }
              this.setState({ incidentId: data['Data'], unSavedChanges: false, IsNewActivity: false, ActivityName: '', selectedActivities: [], })
              if (this.state.nextPagedialog) {
                this.navigationBack(page, listingPage)
              }


              if (this.state.uploadedFiles.length > 0) {
                CommonService.showSuccessNotification(
                  data['Message'] + ' ' + message.incidentMessages.upload_docs
                )
                this.uploadFile(isNewIncident, data['Data'])
                this.showHideSpinner(false)
                // this.setState({ incidentId: '0' })
                // isNewIncident
                //   ? this.props.navigation.navigate('Home')
                //   : this.props.navigation.navigate('Search Incident', {
                //     pageLoad: false, id: null
                //   })
                //   isNewIncident == false ? this.props.navigation.navigate('Search Incident', {pageLoad: false, id: null }):this.getIncidentById(parseInt(data['Data']))
              } else {
                this.showHideSpinner(false)
                CommonService.showSuccessNotification(data['Message'])
                //  this.setState({ incidentId: '0' })
                // isNewIncident
                //   ? this.props.navigation.navigate('Home')
                //   : this.props.navigation.navigate('Search Incident', {
                //     pageLoad: false, id: null
                //   })
                //  isNewIncident == false ? this.props.navigation.navigate('Search Incident', {pageLoad: false, id: null }) :this.getIncidentById(parseInt(data['Data']))
              }
              this.getIncidentById(data['Data'], "NoLoader")

            } else {
              this.showHideSpinner(false)
              CommonService.handleError(response)
            }
          })
          .catch(err => {
            this.showHideSpinner(false)
            CommonService.showErrorNotification(err.message)
          })
      } catch (error) {
        this.showHideSpinner(false)
        CommonService.showErrorNotification(error['message'])
      }
    }
  }
  close = async () => {
    const isNewIncident = this.state.incidentId == 0 ? true : false
    isNewIncident
      ? this.props.navigation.navigate('Home')
      : this.props.navigation.navigate('Search Incident', {
        pageLoad: false, id: null
      })
  }
  addNewOption = (text, value) => {
    const { checkboxListType } = this.state
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    if (format.test(this.state.searchText)) {
      CommonService.showWarningNotification(
        message.incidentMessages.special_keyword
      )
      return false
    }
    var key = (Math.random()).toString()
    var val = [{ key: key, label: text, isLeaf: true }]
    var displayValue = text;
    if (value !== undefined) {
      var arr = [];
      this.findParent(this.state.checkboxListType == "BusinessUnit" ? this.state.allBusinessUnit : this.state.allSite, parseInt(value.key), arr)
      arr.splice(0, 0, text);
      displayValue = joinValueInArray(arr.reverse());
    }
    if (this.state.isSiteSelected) {
      this.setState({ sitename: displayValue, IsNewSite: true })
      this.setState({
        model: {
          ...this.state.model,
          ['2selectedSite']: text
        },
        valueSite: val[0],
        unSavedChanges: true
      })
    } else {
      this.setState({ BUnit: displayValue, IsNewBUnit: true })
      this.setState({
        model: {
          ...this.state.model,
          ['3selectedBussinessUnit']: text
        },
        valueBunit: val[0],
        unSavedChanges: true
      })
    }
    var arr = []
    arr.push({
      key: key,
      label: text,
      isParent: false,
    })
    if (value !== undefined) {
      checkboxListType == "BusinessUnit" ? this.GetChildBusinessUnits(parseInt(value.key), arr) : this.GetChildSites(parseInt(value.key), arr)
    } else {
      checkboxListType == "BusinessUnit" ? this.setState({ allBusinessUnit: [...this.state.allBusinessUnit, ...arr], }) : this.setState({ allSite: [...this.state.allSite, ...arr], })
    }
  }
  onSelectedImpactsChange = selectedImpacts => {
    this.setState({
      model: { ...this.state.model, ['4selectedImpacts']: selectedImpacts },
      unSavedChanges: true
    })
  }
  onSelectedActivityChange = selectedActivities => {
    this.setState({ selectedActivities, unSavedChanges: true })
  }
  onNewActivity = (status, name) => {
    this.setState({
      IsNewActivity: status,
      ActivityName: status ? name : '',
      unSavedChanges: true
    })
  }
  _removeImage = (index, itemType) => {
    if (itemType === 'attachFile') {
      const attachFiles = this.state.attachments;
      const removeItem = attachFiles.filter((item, i) => index === i)[0];
      Alert.alert(
        'Are You Sure',
        'This Will Delete the Image from Database?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          { text: 'OK', onPress: () => this.deleteImage(index, removeItem) }
        ],
        { cancelable: false }
      )
    } else {
      const arr = this.state.uploadedFiles;
      arr.splice(index, 1)
      this.setState({ uploadedFiles: arr, uri: '' })
    }
  }
  deleteImage = async (index, item) => {
    try {
      this.showHideSpinner(true)
      await IncidentService.deleteIncidentDocuments(item.IncidentDocumentID, item.DocumentID, this.props.token)
        .then(response => {
          const data = response['data']
          if (data['Success'] == true) {
            CommonService.showSuccessNotification(data['Message'])
            setTimeout(() => {
              this.showHideSpinner(false)
              const arr = this.state.attachments;
              arr.splice(index, 1)
              this.setState({ uri: '', attachments: arr })
            }, 500)
          } else {
            this.setState({ uri: '' })
            this.showHideSpinner(false)
            CommonService.showErrorNotification(data['Message'])
            return
          }
        })
        .catch(error => {
          this.showHideSpinner(false)
          CommonService.showErrorNotification(error.message)
        })
    } catch (error) {
      this.showHideSpinner(false)
      CommonService.showErrorNotification(error['Message'])
    }
  }
  viewImage = (uri, index, itemType) => {
    this.setState({ uri, imageIndex: index, itemType })
  }
  closeImageViewer = () => {
    this.setState({ uri: '' })
  }
  loadmap() {
    this.showHideSpinner(true)
    this.getLocationAsync();
  }
  async getLocationAsync() {
    const per = await CommonService.appPermissions()
    if (per == 'granted') {
      this.getCurrentloc()
    }
    else if (per == 'denied') {
      CommonService.showWarningNotification(warning_message)
      Alert.alert(
        'OneClickHse App Permissions',
        type === 'Access Location Permission',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: () =>
              Platform.OS == 'android'
                ? IntentLauncher.startActivityAsync(
                  IntentLauncher.ACTION_APPLICATION_SETTINGS
                )
                : Linking.openURL('app-settings:')
          }
        ],
        { cancelable: false }
      )
      return false
    }
  }
  getCurrentloc = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const savelatlong = await AsyncStorage.getItem("savelatlong")
    this.showHideSpinner(false)
    this.setState({
      modalVisible: true,
      latitude1:this.state.latitude == 0 ? savelatlong !== null ? JSON.parse(savelatlong)[0].latitude : location.coords.latitude : this.state.latitude,
      longitude1: this.state.longitude == 0 ? savelatlong !== null ? JSON.parse(savelatlong)[0].longitude : location.coords.longitude : this.state.longitude,
      mapRegion: {
        latitude:this.state.latitude == 0 ? savelatlong !== null ? JSON.parse(savelatlong)[0].latitude : location.coords.latitude : this.state.latitude,
        longitude: this.state.longitude == 0 ? savelatlong !== null ? JSON.parse(savelatlong)[0].longitude : location.coords.longitude : this.state.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    })
  }
  savelatlong = () => {
    CommonService.showSuccessNotification("Longitude and Lattitude saved.")
    this.setState({
      latitude: this.state.latitude1,
      longitude: this.state.longitude1,
      modalVisible: false,
      unSavedChanges: true
    })
  }
  onClick = (img) => {
    if (img != undefined) {
      let file = img.substring(
        img.lastIndexOf('/') + 1,
        img.length
      )
      let fileext = file.split('.')[1]
      if (message.image_extension.indexOf(fileext.toLowerCase()) !== -1) {
        var arr = this.state.uploadedFiles;
        arr.push(img + "," + file)
        this.setState({
          uploadedFiles: arr,
          imagewatermark: false,
          blackscreen: false,
          unSavedChanges: true

        })
      }
      else CommonService.showErrorNotification(message.invalid_image)
    } else return
  }
  IncidentClosed = async () => {
    const { incidentModal } = this.state
    this.showHideSpinner(true)
    if (incidentModal["OpenActionCount"] == 0) {
      await IncidentService.IncidentClosed(this.state.incidentId, this.props.token).then(response => {
        if (response.data.Success) {
          this.showHideSpinner(false)
          this.setState({ incidentId: '0' })
          CommonService.showSuccessNotification(response.data.Message)
          setTimeout(() => {
            this.props.navigation.navigate('Search Incident', {
              pageLoad: false, id: null
            })
          }, 100);
        } else {
          this.showHideSpinner(false)
          CommonService.showSuccessNotification(response.data.Message)
        }
      }).catch(error => {
        this.showHideSpinner(false)
        CommonService.showSuccessNotification(error)
      })
    } else {
      this.showHideSpinner(false)
      CommonService.showWarningNotification('This incident has one or more actions.To close this incident, close all open actions')
    }
  }
  choosePage = (pageName, listingPage) => {
    const { incidentId } = this.state
    if (incidentId === '0') {
      this.setState({ nextPagedialog: false })
      CommonService.showWarningNotification("Please save Incident first.")
    } else this.showAlert(pageName, listingPage)
  }
  showAlert(page, listingPage) {

    if (this.state.unSavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Your changes have not been saved yet. Do you want to save your changes before navigating to the next page?',
        [
          { text: 'Save Changes', onPress: () => { this.saveIncident(page, listingPage) } },
          { text: 'Undo Changes', onPress: () => { this.navigationBack(page, listingPage) } },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => this.setState({ nextPagedialog: false })
          },
        ],
        { cancelable: false }
      )
    } else this.navigationBack(page, listingPage)
  }
  navigationBack(page, listingPage) {
    const { incidentId } = this.state
    this.setState({ nextPagedialog: false })
    this.props.navigation.navigate(page, {
      listingPage: listingPage,
      id: incidentId,
      pageName: 'Incident',
      IncidentLocked: this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false, TenantIncidentId: this.state.incidentModal.TenantIncidentId, lastPageName: 'Incident'
    })
  }
  sectionedMultiView = (items, selectText, onSelectedItemsChange, selectedItems, showAddOption, Activities) => {
    return (
      <SectionedMultiSelect
        chipRemoveIconComponent={this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false}
        disabled={this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false}
        items={items}
        uniqueKey='id'
        confirmText='Close'
        subKey='children'
        selectText={selectText}
        alwaysShowSelectText={false}
        showDropDowns={true}
        readOnlyHeadings={true}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        onChangeText={() => this.setState({ unSavedChanges: true })}
        expandDropDowns={true}
        maxLength={10}
        showAddOption={showAddOption}
        // onAddOption={ Activities == "Activities" && this.onNewActivity}
        // newOption={ Activities == "Activities" && this.state.IsNewActivity ? this.state.ActivityName : ""}
        styles={
          this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false ?
            {
              chipContainer: {
                width: '40%'
              }
            } : {
              chipContainer: {}
            }
        }
      />
    );
  }
  addChild(value, key) {
    this.showHideSpinner(true)
    if (this.state.checkboxListType === "BusinessUnit") {
      this.GetChildBusinessUnits(parseInt(key))
    } else {
      this.GetChildSites(parseInt(key))
    }
  }
  getParent(root, id, data, arr) {
    var i, node;
    for (var i = 0; i < root.length; i++) {
      node = root[i];
      if (parseInt(node.key) === id || node.children && (node = this.getParent(node.children, id, data, arr))) {
        root[i].children = []
        if (arr !== undefined) root[i].isParent = true
        root[i].children.push(...data)
      }
    }
    return null;
  }
  GetChildBusinessUnits = async (id, arr) => {
    try {
      await ActionService.GetChildBusinessUnits(id, this.props.token)
        .then((response) => {
          const result = response['data']
          if (result['Success'] === true) {
            for (var i = 0; i < result['Data'].length; i++) {
              result['Data'][i].parentId = id
            }
            if (this.state.allBusinessUnit) {
              arr !== undefined && result['Data'].splice(-1, 0, ...arr)
              this.getParent(this.state.allBusinessUnit, id, result['Data'], arr)
            }
            this.showHideSpinner(false)

          }
          else {
            this.showHideSpinner(false)
            CommonService.handleError(response)
          }
        })
    } catch (error) {
      this.showHideSpinner(false)
      CommonService.showErrorNotification(message.internal_error)
    }
  }
  GetChildSites = async (id, arr) => {
    try {
      await ActionService.GetChildSites(id, this.props.token)
        .then((response) => {
          const result = response['data']
          if (result['Success'] === true) {
            for (var i = 0; i < result['Data'].length; i++) {
              result['Data'][i].parentId = id
            }
            if (this.state.allSite) {
              arr !== undefined && result['Data'].splice(-1, 0, ...arr)
              this.getParent(this.state.allSite, id, result['Data'], arr)
            }
            this.showHideSpinner(false)

          }
          else {
            this.showHideSpinner(false)
            CommonService.handleError(response)
          }
        })
    } catch (error) {
      this.showHideSpinner(false)
      CommonService.showErrorNotification(message.internal_error)
    }
  }
  onComfirm(value, addItem) {
    this.setState({ a: true })
    const { checkboxListType } = this.state
    if (value !== undefined) {
      checkboxListType == "BusinessUnit" ?
        this.setState({ valueBunit: value }) :
        this.setState({ valueSite: value })
        var arr =[];
        this.findParent(this.state.checkboxListType == "BusinessUnit" ? this.state.allBusinessUnit : this.state.allSite ,parseInt(value.key) ,arr)
        var displayValue = joinValueInArray(arr.reverse());
      if (addItem == false) {
        if (checkboxListType == "BusinessUnit") {
          this.setState({
            model: { ...this.state.model, ['3selectedBussinessUnit']: (value.key) },
            BUnit: displayValue,
            IsNewSite: false,
            unSavedChanges: true
          })
        } else {
          this.setState({
            model: { ...this.state.model, ['2selectedSite']: (value.key) },
            sitename: displayValue,
            IsNewSite: false,
            unSavedChanges: true
          })
        }
      }
      else {
        if (checkboxListType == "BusinessUnit") {
          this.setState({
            ParentBusinessUnitID: (value.key),
          })
        } else {
          this.setState({
            ParentSiteID: (value.key),
          })
        }
      }
    }
  }
  onClose() {
    const { checkboxListType } = this.state
    checkboxListType == "BusinessUnit" ? this.setState({ valueBunit: [] }) : this.setState({ valueSite: [] })
  }

  findParent(root, id ,arr) {
    var i, node;
    for (var i = 0; i < root.length; i++) {
      node = root[i];
      if (parseInt(node.key) === id || node.children && (node = this.findParent(node.children, id,arr))) {
       if(root[i].parentId){
        arr.push(root[i].label)
        this.findParent(this.state.checkboxListType == "BusinessUnit" ? this.state.allBusinessUnit : this.state.allSite, root[i].parentId,arr)
       }
       else if(root[i].endNode){
        arr.push(root[i].label)
       }
      }
    }
    return null;
  }


  //#endregion
  render() {
    const { date, time, incidentId, attachments, uploadedFiles, uri, imagewatermark, uri_image, itemType, noOfUploadedPhoto, blackscreen, incidentModal, nextPagedialog } = this.state
    var lock = this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false ? false : true
    return (
      <View style={{ flex: 1 }} ref={this.myRef}>
        {imagewatermark ?
          <ImageWatermark uri={uri_image}
            onClick={this.onClick}
            onClose={() => this.setState({ imagewatermark: false, blackscreen: false })}
            itemType={itemType} /> : blackscreen == false ?
            <View style={appStyles.container}>
              {uri === '' ?
                <View style={{ flex: 1 }}>
                  <HeaderView PropFunction={() => this.checkUnSavedData()}
                    Title={incidentId && incidentId > 0
                      ? incidentModal.TenantIncidentId ? 'Incident #' + `${incidentModal.TenantIncidentId}` : 'Incident #'
                      : 'New Incident'}
                    Pagename={'incident'}
                  ></HeaderView>
                  <View style={styles.spinnercontainer}>
                    <Spinner
                      visible={this.state.spinner}
                      textStyle={styles.spinnerTextStyle}
                    />
                  </View>
                  <ScrollView
                    ref={this.scrollView}
                    style={{ height: '100%' }}
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode={true}
                  >
                    <View style={styles.fieldContainer}>
                      {
                        incidentId && incidentId > 0 &&
                        <View style={styles.fieldPadding}>
                          <View style={styles.inputPadding}>
                            <View style={{ paddingTop: 10 }}>
                              <View style={styles.statusLine} >
                                <Text style={styles.statusLabel} >Incident Status</Text>

                                {incidentModal["Status"] &&
                                  <View>
                                    {incidentModal["Status"] == "Completed" ?
                                      <Text style={[styles.statusOC, { color: "green" }]} >Completed</Text> :
                                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={[styles.statusOC, { color: "red" }]} >Open</Text>
                                        {incidentModal["Status"] !== "Completed"

                                          &&
                                          <TouchableOpacity style={styles.closeInciBtn} onPress={() => this.IncidentClosed()}>
                                            <Text style={{ color: "#fff" }}>Close Incident</Text></TouchableOpacity>}
                                      </View>
                                    }
                                  </View>
                                }
                              </View>
                              {
                                this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false &&
                                <Text style={[styles.statusLabel, { color: 'red' }]} >Incident Locked</Text>}


                              <View style={styles.statusLine} >
                                <Text style={styles.statusLabel}>No. of Actions:</Text>
                                <Text style={styles.numStatus} >{incidentModal["ActionCount"]}</Text>
                                <Text style={styles.numStatus} >Open Actions: {incidentModal["OpenActionCount"]}</Text>

                              </View>
                            </View>
                          </View>
                        </View>
                      }

                      <View style={styles.fieldPadding}>
                        <Text style={styles.textLabel}>
                          Provide a short description of what happened{' '}
                        </Text>
                        <View style={styles.inputPadding}>
                          <TextInput
                            editable={lock}
                            multiline={true}
                            autoCapitalize='none'
                            clearButtonMode='always'
                            value={this.state.model['1description']}
                            style={styles.textArea}
                            maxLength={200}
                            onChangeText={text =>
                              this.setState({
                                model: { ...this.state.model, ['1description']: text },
                                unSavedChanges: true
                              })
                            }
                          ></TextInput>
                        </View>
                      </View>

                      <View style={styles.fieldPadding}>
                        <Text style={styles.textLabel}>When did the incident occur?</Text>
                        <View style={styles.inputPadding}>
                          <View style={styles.dateTimeContainer}>
                            <View style={styles.dateAndTimeCont}>
                              <TouchableOpacity onPress={() => {
                                !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                  this.setState({ isDateTimePickerVisible: true })
                              }}>
                                <Text style={styles.datePickerPlaceHolder}>
                                  {date + ' ' + time}
                                </Text>
                                <DatePicker
                                  pagename={'incident'}
                                  mode={'datetime'}
                                  is24Hour={false}
                                  locale='en_IN'
                                  Visible={this.state.isDateTimePickerVisible}
                                  handleDatePicker={(date) => this.handleDatePicked(date)}
                                  cancelDatePicker={() => this.setState({ isDateTimePickerVisible: false })}
                                  maximumDate={this.state.maxDate}
                                  minimumDate={message.min_Date} />
                              </TouchableOpacity>
                            </View>
                            <View style={styles.dateAndTimeIcon}>
                              <Icon
                                name='calendar'
                                type='font-awesome'
                                color='#c9c9c9'
                                size={25}
                              />
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={styles.fieldPadding}>
                        <Text style={styles.textLabel}>
                          At what site did the incident occur?{' '}
                        </Text>
                        <View>
                          <View style={[appStyles.forfieldIcon, {
                            paddingHorizontal: 10,
                            width: '100%',
                            marginBottom: 10,
                            position: 'relative'
                          }]}>
                            <TouchableOpacity onPress={() => {
                              !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                this.showPopUp('Sites')
                            }}>
                              <Text
                                style={[styles.textBox, styles.top ,this.state.sitename.length < 21 ? { height: 40}:{height: 'auto'}]}
                                onChangeText={text =>
                                  this.setState({ unSavedChanges: true })
                                }
                              >
                                {this.state.sitename}
                              </Text>
                            </TouchableOpacity>
                            <View style={appStyles.fieldIcon}>
                              <Icon name='search' color='#c9c9c9' size={30} />
                            </View>
                          </View>
                        </View>
                        <View>
                          <View style={[styles.inputPadding, appStyles.forfieldIcon]}>
                            <TouchableOpacity
                              onPress={() =>
                                !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                this.loadmap()}
                            >
                              <Text style={[styles.textBox1, styles.top1]}>
                                Set / View the Location
                      </Text>
                            </TouchableOpacity>

                          </View>
                        </View>

                      </View>

                      <View style={styles.fieldPadding}>
                        <Text style={styles.textLabel}>
                          What business unit is responsible for the incident?{' '}
                        </Text>
                        <View>
                          <View style={[styles.inputPadding, appStyles.forfieldIcon]}>
                            <TouchableOpacity
                              onPress={() => {
                                !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                  this.showPopUp('Business Unit')
                              }
                              }
                            >
                              <Text
                                style={[styles.textBox, styles.top ,this.state.BUnit.length < 21 ? { height: 40}:{height: 'auto'}]  }
                                placeholder='Select Business Unit'
                                onChangeText={text =>
                                  this.setState({ unSavedChanges: true })
                                }
                              >
                                {this.state.BUnit}
                              </Text>
                            </TouchableOpacity>
                            <View style={appStyles.fieldIcon}>
                              <Icon name='search' color='#c9c9c9' size={30} />
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={styles.fieldPadding}>
                        <Text style={styles.textLabel}>
                          What impacts did the incident have?{' '}
                        </Text>
                        <View
                          style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}
                        >
                          <View style={appStyles.multiSec}>
                            {this.sectionedMultiView(this.state.impacts, "Choose Impacts", this.onSelectedImpactsChange, this.state.model['4selectedImpacts'], false)}
                          </View>
                          <View style={appStyles.fieldIcon}>
                            <Icon name='search' color='#c9c9c9' size={30} />
                          </View>
                        </View>
                      </View>

                      <View style={styles.fieldPadding}>
                        <Text style={styles.textLabel}>
                          What activity Was being undertaken at the time of the incident?{' '}
                        </Text>
                        <View
                          style={[appStyles.multiSelctinputPadding, appStyles.forfieldIcon]}
                        >
                          <View style={appStyles.multiSec}>
                            <SectionedMultiSelect
                              chipRemoveIconComponent={this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false}
                              disabled={this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false}
                              items={this.state.acitivites}
                              confirmText='Close'
                              uniqueKey='id'
                              subKey='children'
                              selectText='Choose Activities'
                              searchPlaceholderText={this.props.isMobileuser === false ? "Search Categories..." : "Add New / Search..."}
                              showDropDowns={true}
                              readOnlyHeadings={true}
                              onSelectedItemsChange={this.onSelectedActivityChange}
                              selectedItems={this.state.selectedActivities}
                              showAddOption={this.props.isMobileuser === false ? false : true}
                              onChangeText={() => this.setState({ unSavedChanges: true })}
                              expandDropDowns={true}
                              onAddOption={this.onNewActivity}
                              newOption={this.state.IsNewActivity ? this.state.ActivityName : ""}
                              styles={
                                this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false ?
                                  {
                                    chipContainer: {
                                      width: '40%'
                                    }
                                  } :
                                  {
                                    chipContainer: {}
                                  }
                              }
                            />
                          </View>
                          <View style={appStyles.fieldIcon}>
                            <Icon name='search' color='#c9c9c9' size={30} />
                          </View>
                        </View>
                      </View>
                      {(attachments.length > 0 || uploadedFiles.length > 0) &&
                        <View style={styles.fieldPadding}>
                          <Text style={styles.textLabel}>Attachments</Text>
                          <View style={styles.attachmentsContainer}>
                            {attachments.map((item, index) => {
                              return (item.type == 'image/png' ||
                                'image/jpg' ||
                                'image/jpeg')
                                ?
                                <View style={styles.thumbnailView} key={index}>
                                  <TouchableOpacity onPress={() =>
                                    !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                    this.viewImage(`data:image/png;base64,${item.thumbnailUrl}`, index, "attachFile")}>
                                    {(item.type == 'image/png' ||
                                      'image/jpg' ||
                                      'image/jpeg') &&
                                      item.thumbnailUrl !== '' && (
                                        <ImageBackground
                                          resizeMode='cover'
                                          source={{
                                            uri: `data:image/png;base64,${item.thumbnailUrl}`
                                          }}
                                          style={{
                                            width: 80,
                                            height: 80,
                                            marginBottom: 10
                                          }}
                                        >
                                          <TouchableOpacity onPress={() =>
                                            !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                            this._removeImage(index, "attachFile")}>
                                            <Icon
                                              name='close'
                                              type='material'
                                              color='#444444'
                                              size={14}
                                              containerStyle={styles.imageRemoveIcon}
                                            />
                                          </TouchableOpacity>
                                        </ImageBackground>
                                      )}
                                  </TouchableOpacity>
                                  <Text numberOfLines={1} style={styles.fileNameText}>Photo</Text>
                                </View> :
                                <View style={styles.thumbnailView} key={index}>
                                  <TouchableOpacity onPress={() =>
                                    !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                    this.viewImage(`data:image/png;base64,${item.thumbnailUrl}`, index, "attachFile")}>
                                    {(item.type == 'image/png' ||
                                      'image/jpg' ||
                                      'image/jpeg') &&
                                      item.thumbnailUrl !== '' && (
                                        <ImageBackground
                                          resizeMode='cover'
                                          source={{
                                            uri: `data:image/png;base64,${item.thumbnailUrl}`
                                          }}
                                          style={{
                                            width: 80,
                                            height: 80,
                                            marginBottom: 10
                                          }}
                                        >
                                          <TouchableOpacity >
                                            <Icon
                                              name='video-camera'
                                              type='font-awesome'
                                              color='#444444'
                                              size={14}
                                              containerStyle={styles.imageRemoveIcon}
                                            />
                                          </TouchableOpacity>

                                        </ImageBackground>
                                      )}
                                  </TouchableOpacity>
                                </View>

                            })}

                            {uploadedFiles.map((item, index) => {
                              const arr = item.split(',')
                              const fileExt = arr[1].split('.')[1]
                              return (fileExt == 'png' || fileExt === 'jpg' || fileExt === 'jpeg') ?
                                <View style={styles.thumbnailView} key={index}>

                                  <TouchableOpacity onPress={() =>
                                    !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                    this.viewImage(arr[0], index, item, "uploadingFiles")}>
                                    <ImageBackground
                                      resizeMode='cover'
                                      source={{
                                        uri: arr[0]
                                      }}
                                      style={{
                                        width: 80,
                                        height: 80,
                                        marginBottom: 10
                                      }}
                                    >
                                      <TouchableOpacity onPress={() =>
                                        !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                        this._removeImage(index)}>
                                        <Icon
                                          name='close'
                                          type='material'
                                          color='#444444'
                                          size={14}
                                          containerStyle={styles.imageRemoveIcon}
                                        />
                                      </TouchableOpacity>
                                    </ImageBackground>
                                  </TouchableOpacity>

                                  <Text numberOfLines={1} style={styles.fileNameText}>Photo </Text>
                                </View> :
                                <View style={styles.thumbnailView} key={index}>

                                  <TouchableOpacity onPress={() =>
                                    !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                    this.viewImage(arr[0], index, item, "uploadingFiles")}>
                                    <Video source={{ uri: arr[0] }}
                                      ref={(ref) => {
                                        this.player = ref
                                      }}
                                      style={styles.backgroundVideo}
                                      muted={true}
                                    // paused={true}
                                    // audioOnly={true}
                                    />
                                    <TouchableOpacity >
                                      <Icon
                                        name='video-camera'
                                        type='font-awesome'
                                        color='#444444'
                                        size={14}
                                        containerStyle={styles.imageRemoveIcon}
                                      />
                                    </TouchableOpacity>
                                  </TouchableOpacity>
                                  <Text numberOfLines={1} style={styles.fileNameText}>Video</Text>
                                </View>
                            })}
                          </View>
                        </View>
                      }
                      <View style={styles.LastfieldPadding}>
                        <View style={styles.fileUploader}>
                          <TouchableOpacity style={styles.upLoadIconCont}
                            onPress={() => {
                              !(this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false) &&
                                this._pickImage()
                            }
                            }
                          >
                            <Icon
                              name="cloud-upload"
                              type='material'
                              color='#eb8c3a'
                              size={70}
                            />
                            <Text style={styles.upLoadTagline}>Select Image To Upload</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                  <FooterView
                    PropFunction={() => this.saveIncident()}
                    ChoosePage={() => this.setState({ nextPagedialog: true })}
                    IncidentLocked={this.state.incidentModal["IncidentLocked"] && this.props.isMobileuser == false}
                    Close={() => this.close()}
                    pageName={'saveAndClose'}
                  ></FooterView>
                  {nextPagedialog &&
                    <ChoosePageMenu ClosePage={() => this.setState({ nextPagedialog: false })} navpage='NewIncidentScreen'
                      impactDetailNavigationfunction={() => this.choosePage('ImpactDetail')}
                      additionalDetailNavigationfunction={() => this.choosePage('AdditionalDetail')}
                      investigationDetailNavigationfunction={() => this.choosePage('InvestigationDetail')}
                      actionNavigationfunction={() => this.choosePage('Actionlist')}
                      peopleListNavigationfunction={() => this.choosePage('PeopleList', 'PeopleList')}
                      InjuryAndIllnessListNavigationfunction={() => this.choosePage('PeopleList', 'InjuryAndIllnessList')}
                      nextPagedialog={nextPagedialog} />
                  }
                </View> :
                <ImageViewer index={this.state.imageIndex} uri={this.state.uri} onDelete={this._removeImage}
                  onReturn={this.closeImageViewer} itemType={this.state.itemType}></ImageViewer>}
              {this.state.modalVisible == true &&
                <View style={{ marginTop: 22, borderWidth: 1 }}>
                  <MapViewer
                    modalVisible={this.state.modalVisible}
                    SetLatLong={() =>
                      this.setState({  modalVisible: false })
                    }
                    savelatlong={() => this.savelatlong()}
                    mapRegion={this.state.mapRegion}
                    region={this.state.mapRegion}
                    onDragEnd={(data) => this.setState({
                      mapRegion: {
                        latitude: data.nativeEvent.coordinate.latitude,
                        longitude: data.nativeEvent.coordinate.longitude,
                      },
                      latitude: data.nativeEvent.coordinate.latitude,
                      longitude: data.nativeEvent.coordinate.longitude,
                      latitude1: data.nativeEvent.coordinate.latitude,
                      longitude1: data.nativeEvent.coordinate.longitude,
                    })}
                    marker={marker}
                  />
                </View>
              }
            </View> : <View style={{ flex: 1, backgroundColor: 'black' }}></View>
        }
        {this.state.imagePicker && (
          <Animated.View style={[StyleSheet.absoluteFill, styles.cover, { zIndex: 999 }]}>
            <View style={styles.card}>
              <View style={styles.btnGroup}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => this.pickCameraImage()}
                >
                  <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.closeButton, styles.centerButton]}
                  onPress={() => this.pickGalleryImage()}
                >
                  <Text style={styles.buttonText}>Photo Library</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.singlebtn}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => this.setState({ imagePicker: false })}
                >
                  <Text style={[styles.buttonText, styles.bold]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        <TreeSelect
          ref={node => this.treeSelectRef = node}
          onComfirm={(value, addItem) => { this.onComfirm(value, addItem) }}
          onClose={() => {console.log("")}}
          valuedata={(value) => { this.valuedata(value) }}
          treeData={this.state.checkboxListType == "BusinessUnit" ? this.state.allBusinessUnit : this.state.allSite}
          value={this.state.checkboxListType == "BusinessUnit" ? this.state.valueBunit : this.state.valueSite}
          onlyCheckLeaf={true}
          multiple={false}
          addChild={(val, key) => this.addChild(val, key)}
          removeChild={(val, key) => this.removeChild(val, key)}
          spinner={this.state.spinner}
          addNew={this.props.isMobileuser}
          addNewOption={(text, value) => this.addNewOption(text, value)}
          selectedParent={(value, index) => this.selectedParent(value, index)}
          additemname={this.state.checkboxListType == "BusinessUnit" ? 'Business Unit name' : 'Site name'}
          addMode={() => this.onClose()}
        />
      </View>
    )
  }
}
function mapStateToProps(state) {
  return {
    firstName: state.home.firstName,
    lastName: state.home.lastName,
    token: state.home.authorizeToken,
    userId: state.home.userId,
    tenantId: state.home.tenantId,
    langaugeId: state.home.languageId,
    isMobileuser: state.home.isMobileUser,
    latitude: state.home.latitude,
    longitude: state.home.longitude,

  }
}
export default connect(mapStateToProps)(NewIncidentScreen)
