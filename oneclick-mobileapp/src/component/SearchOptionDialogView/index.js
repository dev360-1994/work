import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native'
import { Icon, CheckBox } from 'react-native-elements'
import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog'
import { ScrollView } from 'react-native-gesture-handler'
import DateRangePicker from '../../Custom-NodeModules/date-range'
import TreeSelect from '../../Custom-NodeModules/react-native-tree-select';

class SearchOptionDialogView extends Component {
  render() {
    const { pageName, isMobileUser, visible, onCancel, visibleFalse, searchApplyFilter,
      businessUnit, businessUnitsColor, IscheckBusinessUnit,
      allMyAction, IscheckAction, Actions, myActionColor, IscheckActionFunction,
      siteColor, IscheckSite, site, date, startDate, IscheckdateFunction, Ischeckdate, today, lastWeek, thisMonth, lastMonth,Next30days,Last30days ,ThisYear ,Next7days, endDate, selectDate, selectCustomDate,status, statusColor, IscheckstatusFunction, Ischeckstatus, allStatus,handleArrayCheckbox,checkboxListType,keywordState, keywordValue, onChangeTextKeyword,incidentId, incidentState, onChangeTextIncident,impact, allImpacts,spinner, significantArr,significant, searchModal,hazardType ,injuryType,Category,closeTab ,actionTypes,IscheckActionTypes,ActionsTypes,myActionTypesColor } = this.props
    return (
      <View>
        <Dialog
          containerStyle={styles.dialogContainer}
          width={0.8}
          height={0.8}
          style={styles.listModal}
          visible={visible}>
          <View style={styles.dialogHead}>
            <View style={styles.btnContainerLeft}>
              <TouchableOpacity
                style={styles.leftbtn}
                onPress={() => {
                  visibleFalse(), onCancel()
                }}
              >
                <Icon name='close' size={18} color='#000' />
                <Text style={styles.headBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.dialogTitle}>Filters</Text>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.rightbtn}
                onPress={() => searchApplyFilter()}>
                <Icon
                  name='filter'
                  type='font-awesome'
                  size={18}
                  color='#000'
                  iconStyle={{ marginRight: 3 }}
                />
                <Text style={styles.headBtnText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
          <DialogContent style={styles.filterDialog}>
            <ScrollView>
              <View style={styles.innerContainer}>
                {
                  pageName == 'SearchIncidentScreen' &&
                  <View>
                    <View style={styles.CollapselistItem}>
                      <HeadingReturnView
                        name={'Keyword'}
                        showTextColor={() => { keywordState() }}
                        selectFilter={() => { closeTab("IscheckKeyword") }}
                        check={searchModal.IscheckKeyword}
                        color={keywordValue.length}
                      />
                      {searchModal.IscheckKeyword && (
                        <View style={styles.listItemBody}>
                          <TextInput
                            style={styles.listTextInput}
                            placeholder='Enter text to search'
                            value={keywordValue}
                            onChangeText={text => { onChangeTextKeyword(text) }}
                          ></TextInput>
                        </View>
                      )}
                    </View>
                    <View style={styles.CollapselistItem}>
                      <HeadingReturnView
                        name={'Incident #'}
                        showTextColor={() => { incidentState() }}
                        selectFilter={() => { closeTab("Ischeckincident") }}
                        check={searchModal.Ischeckincident}
                        color={incidentId}
                      />
                      {searchModal.Ischeckincident && (
                        <View style={styles.listItemBody}>
                          <TextInput
                            style={styles.listTextInput}
                            placeholder='Search'
                            keyboardType='numeric'
                            value={String(incidentId)}
                            onChangeText={id => onChangeTextIncident(id)}
                          ></TextInput>
                        </View>
                      )}
                    </View>
                  </View>
                }
                {pageName =='SearchActionScreen' &&
                  <View style={styles.CollapselistItem}>
                  <HeadingReturnView
                    name={'Action Type'}
                    showTextColor={() => { ActionsTypes() }}
                    selectFilter={() => { closeTab("IscheckActionTypes") }}
                    check={IscheckActionTypes}
                    color={myActionTypesColor}
                  />
                    {IscheckActionTypes && (
                      <View style={styles.listItemBody}>
                        {actionTypes.map((prop, key) => {
                          return (
                            <TouchableOpacity key={key} style={{ flexDirection: 'row', alignItems: 'center' }}
                              onPress={() => handleArrayCheckbox(key, actionTypes, 'myActionTypesColor', myActionTypesColor)} >
                              <CheckBox
                                size={22}
                                containerStyle={{
                                  padding: 0,
                                  backgroundColor: 'transparent',
                                  width: 15,
                                }}
                                iconType='material'
                                checkedIcon='done'
                                uncheckedIcon='check-box-outline-blank'
                                checkedColor='#069ebd'
                                checked={prop.checked}
                                onPress={() => handleArrayCheckbox(key, actionTypes, 'myActionTypesColor', myActionTypesColor)}
                              />
                              <Text numberOfLines={1}
                                style={{ color: 'black', fontSize: 13 }}>
                                {prop.Name}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    )}
                  </View>
                }
                <View style={styles.CollapselistItem}>
                <HeadingReturnView
                      name={'Business Unit'}
                      showTextColor={() => { businessUnit(); this.treeSelectRef.open() }}
                      selectFilter={() => {  }}
                      check={IscheckBusinessUnit}
                      color={businessUnitsColor}
                    />
                </View>

                <View style={styles.CollapselistItem}>
                <HeadingReturnView
                      name={'Site'}
                      showTextColor={() => { site(); this.treeSelectRef.open() }}
                      selectFilter={() => {  }}
                      check={IscheckSite}
                      color={siteColor}
                    />
                </View>

                <View style={styles.CollapselistItem}>
                  <TouchableOpacity
                    style={styles.toggelBtn}
                    onPress={() => date()}>
                    <View style={styles.listItemHeader}>
                      <Text
                        style={{
                          color:
                            startDate.length == 0
                              ? '#000000'
                              : '#eb8c3a',
                          fontWeight: 'bold'
                        }}
                        onPress={() => IscheckdateFunction()} >
                        {pageName == 'SearchActionScreen'
                          ?
                          "Due Date" : "Incident Date"
                        }
                      </Text>
                      <Icon
                        name={
                          Ischeckdate
                            ? 'keyboard-arrow-up'
                            : 'keyboard-arrow-down'
                        }
                        type='material'
                        size={22}
                      />
                    </View>
                  </TouchableOpacity>
                  {Ischeckdate && (
                    <View style={styles.listItemBody}>
                      <View style={styles.rangeButtons}>
                        <TouchableOpacity
                          style={
                            today
                              ? styles.rangebtn
                              : [styles.rangebtn, styles.onSelect]
                          }
                          onPress={() => selectCustomDate('Today', 'Today')}
                        >
                          <Text style={styles.rangeBtnText}>Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={
                            lastWeek
                              ? styles.rangebtn
                              : [styles.rangebtn, styles.onSelect]
                          }
                          onPress={() => selectCustomDate('LastWeek', 'Last 7 Days')}
                        >
                          <Text style={styles.rangeBtnText}>{
                            pageName == 'SearchActionScreen'
                              ?
                              'Last 7 Days' : 'Last Week'
                          }

                          </Text>
                        </TouchableOpacity>
                      </View>
                      {pageName == 'SearchActionScreen' &&
                        <View>
                          <View style={styles.rangeButtons}>
                            <TouchableOpacity
                              style={
                                Next30days
                                  ? styles.rangebtn
                                  : [styles.rangebtn, styles.onSelect]
                              }
                              onPress={() => selectCustomDate('Next30days', 'Next 30 Days')}
                            >
                              <Text style={styles.rangeBtnText}>Next 30 Days</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={
                                Last30days
                                  ? styles.rangebtn
                                  : [styles.rangebtn, styles.onSelect]
                              }
                              onPress={() => selectCustomDate('Last30days', 'Last 30 Days')}
                            >
                              <Text style={styles.rangeBtnText}>Last 30 Days</Text>
                            </TouchableOpacity>
                          </View>

                          <View style={styles.rangeButtons}>
                            <TouchableOpacity
                              style={
                                ThisYear
                                  ? styles.rangebtn
                                  : [styles.rangebtn, styles.onSelect]
                              }
                              onPress={() => selectCustomDate('ThisYear', 'This Year')}
                            >
                              <Text style={styles.rangeBtnText}>This Year</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={
                                Next7days
                                  ? styles.rangebtn
                                  : [styles.rangebtn, styles.onSelect]
                              }
                              onPress={() => selectCustomDate('Next7days', 'Next 7 Days')}
                            >
                              <Text style={styles.rangeBtnText}>Next 7 Days
                          </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      }
                      {pageName == 'SearchIncidentScreen' &&
                        <View style={styles.rangeButtons}>
                          <TouchableOpacity
                            style={
                              thisMonth
                                ? styles.rangebtn
                                : [styles.rangebtn, styles.onSelect]
                            }
                            onPress={() => selectCustomDate('ThisMonth', 'This Month')}
                          >
                            <Text style={styles.rangeBtnText}>This Month </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={
                              lastMonth
                                ? styles.rangebtn
                                : [styles.rangebtn, styles.onSelect]
                            }
                            onPress={() => selectCustomDate('LastMonth', 'Last Month')}
                          >
                            <Text style={styles.rangeBtnText}>Last Month</Text>
                          </TouchableOpacity>
                        </View>
                      }
                      <View style={styles.rangeContainer}>
                        <DateRangePicker
                          onSuccess={(fromDate, toDate) =>
                            selectDate(fromDate, toDate, 'Custom Range')
                          }
                          markedDates={[
                            startDate,
                            endDate
                          ]}
                          theme={{
                            markColor: '#069ebd',
                            markTextColor: 'white'
                          }}
                        />
                      </View>
                    </View>
                  )}
                </View>
                <View style={styles.CollapselistItem}>
                  <HeadingReturnView
                    name={'Status'}
                    showTextColor={() => { status() }}
                    selectFilter={() => { IscheckstatusFunction() }}
                    check={Ischeckstatus}
                    color={statusColor}
                  />
                  {Ischeckstatus && (
                    <View style={[styles.listItemBody, pageName == 'SearchActionScreen' ?
                      { paddingHorizontal: 0 } : { paddingHorizontal: 10 }
                    ]}>
                      {allStatus.map((prop, key) => {
                        return (
                          <View key={key}>
                            {
                              pageName == 'SearchActionScreen' ?
                                <TouchableOpacity key={key} style={{ flexDirection: 'row', alignItems: 'center' }}
                                  onPress={() => handleArrayCheckbox(key, allStatus, 'statusColor', statusColor)}>
                                  <CheckBox
                                    size={22}
                                    containerStyle={{
                                      padding: 0,
                                      backgroundColor: 'transparent',
                                      width: 15,
                                    }}
                                    iconType='material'
                                    checkedIcon='done'
                                    uncheckedIcon='check-box-outline-blank'
                                    checkedColor='#069ebd'
                                    checked={prop.checked}
                                    onPress={() => handleArrayCheckbox(key, allStatus, 'statusColor', statusColor)}
                                  />
                                  <Text numberOfLines={1}
                                    style={{ color: 'black', fontSize: 13 }}>
                                    {prop.Name}
                                  </Text>
                                </TouchableOpacity>
                                :
                                <CheckBoxReturnView prop={prop} key={key} name={prop.name} handleArrayCheckbox={() => { handleArrayCheckbox(key, allStatus, 'statusColor' ,statusColor) }} />
                            }
                          </View>
                        )
                      })}
                    </View>
                  )}
                </View>
                {
                  pageName == 'SearchIncidentScreen' &&
                  <View style={styles.CollapselistItem}>
                    <HeadingReturnView
                      name={'Impacts'}
                      showTextColor={() => { impact() }}
                      selectFilter={() => { closeTab("Ischeckimpacts") }}
                      check={searchModal.Ischeckimpacts}
                      color={searchModal.impactColor}
                    />
                    {searchModal.Ischeckimpacts && (
                      <View style={[styles.listItemBody, { paddingHorizontal: 10 }]}>
                        {allImpacts.map((prop, key) => {
                          var name = prop.name
                          return (
                            <View key={key}>
                              <CheckBoxReturnView prop={prop} key={key} name={name} handleArrayCheckbox={() => {handleArrayCheckbox(key, allImpacts, 'impactColor' ,searchModal.impactColor)}} />
                            </View>
                          )
                        })}
                      </View>
                    )}
                  </View>
                }
                {isMobileUser == false &&
                //pageName =='SearchActionScreen' &&
                //isMobileUser == false &&
                  <View style={styles.CollapselistItem}>
                    <TouchableOpacity
                      style={styles.toggelBtn}
                      onPress={() => Actions()}
                    >
                      <View style={styles.listItemHeader}>
                        <Text
                          style={{
                            color: myActionColor == 0
                              ? '#000000'
                              : '#eb8c3a',
                            fontWeight: 'bold'
                          }}
                          onPress={() => IscheckActionFunction()}
                        >
                          My Actions
                              </Text>
                        <Icon
                          name={
                            IscheckAction
                              ? 'keyboard-arrow-up'
                              : 'keyboard-arrow-down'
                          }
                          type='material'
                          size={22}
                        />
                      </View>
                    </TouchableOpacity>
                    {IscheckAction && (
                      <View style={styles.listItemBody}>
                        {allMyAction.map((prop, key) => {
                          return (
                          //   <View key={key}>
                          //   <CheckBoxReturnView prop={prop} key={key} name={name} handleArrayCheckbox={() => {
                          //     handleArrayCheckbox(key, allMyAction, 'myActionColor', myActionColor)}} />
                         // </View>
                            <TouchableOpacity key={key} style={{ flexDirection: 'row', alignItems: 'center' }}
                              onPress={() => handleArrayCheckbox(key, allMyAction, 'myActionColor', myActionColor)} >
                              <CheckBox
                                size={22}
                                containerStyle={{
                                  padding: 0,
                                  backgroundColor: 'transparent',
                                  width: 15,
                                }}
                                iconType='material'
                                checkedIcon='done'
                                uncheckedIcon='check-box-outline-blank'
                                checkedColor='#069ebd'
                                checked={prop.checked}
                                onPress={() => handleArrayCheckbox(key, allMyAction, 'myActionColor', myActionColor)}
                              />
                              <Text numberOfLines={1}
                                style={{ color: 'black', fontSize: 13 }}>
                                {prop.Name}
                              </Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    )}
                  </View>
                }
                {
                  pageName == 'SearchIncidentScreen' &&
                  <View>
                    <View style={styles.CollapselistItem}>
                      <HeadingReturnView
                        name={'Significant'}
                        showTextColor={() => { significant() }}
                        selectFilter={() => { closeTab("IscheckSignificant") }}
                        check={searchModal.IscheckSignificant}
                        color={searchModal.significantColor}
                      />
                      {searchModal.IscheckSignificant && (
                        <View style={[styles.listItemBody, { paddingHorizontal: 10 }
                        ]}>
                          {significantArr.map((prop, key) => {
                            var name = prop.Name
                            return (
                                <View key={key}>
                                  <CheckBoxReturnView prop={prop} key={key} name={name} handleArrayCheckbox={() => { 
                                    handleArrayCheckbox(key, significantArr, 'significantColor' ,searchModal.significantColor)  }} />
                                </View>
                            )
                          })}
                        </View>
                      )}
                    </View>
                    <View style={styles.CollapselistItem}>
                      <HeadingReturnView
                        name={'Injury Type'}
                        showTextColor={() => { injuryType() }}
                        selectFilter={() => { closeTab("IscheckInjury") }}
                        check={searchModal.IscheckInjury}
                        color={searchModal.injuryColor}
                      />

                      {searchModal.IscheckInjury &&
                        <View style={[styles.listItemBody, { paddingHorizontal: 10 }
                        ]}>
                          {searchModal.injuryandIllnessType.map((prop, key) => {
                            var name = prop.Name
                            return (
                              <View key={key}>
                                <CheckBoxReturnView prop={prop} key={key} name={name} handleArrayCheckbox={() => { handleArrayCheckbox(key, searchModal.injuryandIllnessType, 'injuryColor', searchModal.injuryColor) }} />
                              </View>
                            )
                          })}
                        </View>
                      }
                    </View>
                    <View style={styles.CollapselistItem}>
                      <HeadingReturnView
                        name={'Injury Category'}
                        showTextColor={() => { Category() }}
                        selectFilter={() => { closeTab("IscheckCategory") }}
                        check={searchModal.IscheckCategory}
                        color={searchModal.categoryColor}
                      />
                      {searchModal.IscheckCategory &&
                        <View style={[styles.listItemBody, { paddingHorizontal: 10 }
                        ]}>
                          {searchModal.category.map((prop, key) => {
                            var name = prop.Name
                            return (
                              <View key={key}>
                                <CheckBoxReturnView prop={prop} key={key} name={name} handleArrayCheckbox={() => { handleArrayCheckbox(key, searchModal.category, 'categoryColor', searchModal.categoryColor) }} />
                              </View>
                            )
                          })}
                        </View>
                      }
                    </View>
                    <View style={styles.CollapselistItem}>
                      <HeadingReturnView
                        name={'Hazards'}
                        showTextColor={() => { hazardType(); this.treeSelectRef.open() }}
                        selectFilter={() => { closeTab("IscheckHazardType") }}
                        check={searchModal.IscheckHazardType}
                        color={searchModal.hazardColor}
                      />
                    </View>
                  </View>
                }
              </View>
            </ScrollView>
          </DialogContent>

          <TreeSelect
            ref={node => this.treeSelectRef = node}
            onComfirm={(value) => { this.props.onComfirm(value) }}
            onClose={() => this.props.onClose()}
            valuedata={(value) => { this.props.valuedata(value) }}
            treeData={
              pageName == 'SearchIncidentScreen' ?
                checkboxListType == "BusinessUnit" ? this.props.allBusinessUnit : checkboxListType == "Site" ? this.props.allSite : searchModal.allHazards
                :
                checkboxListType == "BusinessUnit" ? this.props.allBusinessUnit : this.props.allSite
            }
            value={this.props.value}
            onlyCheckLeaf={true}
            multiple={true}
            addChild={(val, key) => this.props.addChild(val, key)}
            removeChild={(val, key) => this.props.removeChild(val, key)}
            spinner={spinner}
            addNew={false}
            treeDefaultExpandAll={false}
          />
        </Dialog>
      </View>
    )
  }
}
function HeadingReturnView(props) {
  return ( 
    <TouchableOpacity
    style={styles.toggelBtn}
    onPress={() => props.showTextColor()}>
    <View style={styles.listItemHeader}>
      <Text
        style={{
          color:
          props.color == 0
              ? '#000000'
              : '#eb8c3a',
          fontWeight: 'bold'
        }}
      onPress={() => props.selectFilter()} >{props.name}</Text>
      <Icon
        name={
          props.check
            ? 'keyboard-arrow-up'
            : 'keyboard-arrow-down'
        }
        type='material'
        size={22}
      />
    </View>
  </TouchableOpacity>
   );
}
function CheckBoxReturnView(props) {
  return (
    <TouchableOpacity  style={{ flexDirection: 'row', alignItems: 'center' }}
      onPress={() => props.handleArrayCheckbox()} >
      <CheckBox
        size={22}
        containerStyle={{
          padding: 0,
          backgroundColor: 'transparent',
          width: 15,
        }}
        iconType='material'
        checkedIcon='done'
        uncheckedIcon='check-box-outline-blank'
        checkedColor='#069ebd'
        checked={props.prop.checked}
        onPress={() => props.handleArrayCheckbox()}
      />
      <Text numberOfLines={1}
        style={{ color: 'black', fontSize: 13 }}>
        {props.name}
      </Text>
    </TouchableOpacity>
    // <TouchableOpacity
    //   onPress={() => props.handleArrayCheckbox()}>
    //   <View style={styles.statusCheckBox}>
    //     <Text style={styles.checkBoxTitle}>
    //       {props.name}
    //     </Text>
    //     <CheckBox
    //       right
    //       iconRight
    //       iconType='material'
    //       checkedIcon='done'
    //       uncheckedIcon='check-box-outline-blank'
    //       checkedColor='#069ebd'
    //       checked={props.prop.checked}
    //       onPress={() => props.handleArrayCheckbox()}
    //     />
    //   </View>
    // </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkBoxTitle: {
    width:'80%',
    color: 'black'
  },
  statusCheckBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d6d7da',
    padding: 6
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    margin: 6
  },
  container: { flex: 1, backgroundColor: '#ffffff', paddingTop: 25 },
  dialogHead: {
    backgroundColor: '#ededed',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  btnContainer: {
    width: '45%'
  },
  btnContainerLeft: {
    width: '30%'
  },
  leftbtn: {
    width: '100%',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000'
  },
  rightbtn: {
    alignSelf: 'flex-end',
    width: '100%',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000'
  },
  filterDialog: {
    height: '93%'
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ededed',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 2
  },
  innerContainer: { marginTop: 10 },
  listItemBody: {
    paddingVertical: 10,
  },
  rangeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5
  },
  rangebtn: {
    backgroundColor: '#41a1f1',
    width: '48%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  onSelect: { backgroundColor: '#88c5f6' },
  rangeContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  rangeBtnText: {
    color: '#fff'
  },
  collapseList: {
    backgroundColor: '#fff',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: "relative",
    paddingLeft: 20,
  },
  listTextInput: {
    borderColor: '#000',
    borderWidth: 1,
    paddingHorizontal: 4,
    height: 30,
    borderRadius: 5,
    alignItems: 'center'
  },
})
export default SearchOptionDialogView;