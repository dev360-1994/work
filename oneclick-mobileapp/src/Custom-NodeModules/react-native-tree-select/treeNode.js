import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
const TochableFeedback = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
const checkIconNames = ['square-o', 'minus-square', 'check-square'];

export default class TreeNode extends React.Component {
  async  shouldComponentUpdate(nextProps) {
    return nextProps.check !== this.props.check
      || nextProps.expanded !== this.props.expanded;
  }
  render() {
    const {
      check, expanded, onExpand, onSelect, multiple, onlyCheckLeaf, predecessorsCount, addChild, valuedata,
      nodeData, nodeData: { key, label, isParent, children },
    } = this.props;
    const Tochable = hasChildren ? TouchableWithoutFeedback : TochableFeedback;
    const hasChildren = !!children;
   // const checkable = multiple || !onlyCheckLeaf || onlyCheckLeaf && !hasChildren;
    const checkable =!onlyCheckLeaf || onlyCheckLeaf && !hasChildren;
    return (
      <View style={[
        styles.container,
        { paddingLeft: predecessorsCount * 30, position: "relative" },
        !hasChildren && { backgroundColor: 'rgb(240,240,240)' },
      ]}>
        <View style={styles.plusBtnWrap}>
          {!hasChildren ? 
          <View>{isParent &&
          <TouchableOpacity style={styles.plusBtn} onPress={() => {!hasChildren && addChild(nodeData ,key); valuedata();}} >
            
              <Icon  
                name={hasChildren ? "minus-circle" :"plus-circle"}
                style={styles.caretIcon}
                size={16}
                  
                 />
          </TouchableOpacity> }
          </View>
          :
          <View>
          
          {isParent &&
          <TouchableOpacity style={styles.plusBtn} onPress={() => hasChildren && onExpand(key, expanded)} >
            <Icon  
            name={expanded ? "minus-circle" :"plus-circle"}
              style={styles.caretIcon}
              size={16}
              
               />
        </TouchableOpacity>}
        </View>
          }
        </View>

        <Tochable
          onPress={() => {
           // checkable &&
             onSelect(nodeData, check);
            valuedata();
          }}
          style={styles.tochable}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
            <View style={styles.icons}>
               <Icon
                name={checkIconNames[check || 0]}
                size={16}
                style={styles.checkIcon}
              />
            </View>
            <View style={styles.labelWrap}>
              <Text numberOfLines={2} style={styles.label}>{label}</Text>
            </View>
          </View>
        </Tochable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 1,
  },
  icons: {
    paddingLeft: 8,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusBtnWrap: { height: 50, width: 35, justifyContent: "center", alignItems: "center" },
  checkIcon: {
    width: 20,
    marginLeft: 6,
    marginRight: 6,
  },
  tochable: {
    flex: 1,
   maxWidth:"100%",
  },
  label: {
    paddingLeft: 0,
  },
  labelWrap: {
    width:"80%",
    paddingRight:10,
  },
  caretIcon: {
    width: 16,
  },
  chevronIcon: {
    padding: 10,
  },
  plusBtn: { height: "100%", width: "100%", alignItems: "center", justifyContent: "center",paddingLeft:10}
});