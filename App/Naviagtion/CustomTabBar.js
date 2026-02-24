/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Images } from '../../assets/Images'; // ✅ adjust path if needed
import { Colors } from '../../assets/fonts/fonts';

const CustomTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // ✅ Tab config — MUST match Tab.Screen names
  const tabs = [
    { name: 'Home', icon: Images.Home },
    { name: 'PoolStack', icon: Images.Pool },
    { name: 'ProfileStack', icon: Images.Profile },
  ];

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // 🔒 Hide tab bar when keyboard is open
  if (isKeyboardVisible) return null;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              activeOpacity={0.7}
              style={[
                styles.tabItem,
                isFocused && styles.activeTab,
              ]}
            >
              <Image
                source={tab.icon}
                resizeMode="contain"
                style={[
                  styles.icon,
                  {
                    tintColor: isFocused ? Colors.CYAN : Colors.TEXT,
                    transform: [{ scale: isFocused ? 1 : 1 }],
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position:"absolute",
    bottom:0,
    justifyContent:"space-between",
    width:"100%",
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 65,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    borderColor: Colors.GREY,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    padding: 12,
    borderRadius: 14,
  },
  activeTab: {
  },
  icon: {
    width: 26,
    height: 26,
    top:-5
  },
});
