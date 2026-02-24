import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors } from '../../assets/fonts/fonts';
import { Images } from '../../assets/Images';
import { useNavigation } from '@react-navigation/native';
import { useGetProfile } from '../api/ProfileApis';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Header({
  title = '',
  showBackButton = false,
  hideRight = false,
  showNotificationIcon = true,
  label = ""
}) {
  const navigation = useNavigation();
  const { data: userData = [], isLoading: isProfileLoading } = useGetProfile()
  
  return (
    <View style={styles.header}>
      {/* LEFT */}
      <View style={styles.left}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.7}
          >
            <Image
              source={Images.Back}
              style={styles.backIcon}
              resizeMode='contain'
            />
            <Text style={styles.backText}>{title}</Text>
          </TouchableOpacity>
        ) : (
          <Image
            source={Images.Logo}
            style={styles.logo}
            resizeMode='contain'
          />
        )}
      </View>
      <Text style={styles.backText}>{label}</Text>

      {/* RIGHT */}
      {hideRight ?
        null
        :
        <View style={styles.right}>
          {showNotificationIcon &&
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("Notification")}>
              <Image
                source={Images.Bell}
                style={[styles.avatar, { height: 20 }]}
                resizeMode='contain'
              />
              <View style={styles.notificationDot} />
            </TouchableOpacity>}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              navigation.navigate('Tabs', {
                screen: 'ProfileStack',
                params: { screen: 'ProfileMain' },
              })
            }
          >
            {userData?.profile ? (
              <View style={{borderWidth:1,padding:2,borderRadius:100}}>
              <Image
                source={{ uri: userData.profile }}
                style={[styles.avatar]}
                resizeMode="cover"
              />
              </View>
            ) : (
              <Icon
                name="person-circle"
                size={32}
                color={Colors.TEXT}
              />
            )}

          </TouchableOpacity>
        </View>
      }

    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20
  },

  /* LEFT */
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  backIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  backText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },

  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  /* RIGHT */
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconBtn: {
    padding: 6,
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: "35%",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C80202',
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
});
