import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../assets/fonts/fonts';

export default function NumberStepper({
  value = '',
  onChange,
  min = 0,
  max = 100,
}) {
  const number = value === '' ? null : Number(value);

  const increase = () => {
    if (number === null) {
      onChange('1');
      return;
    }
    if (number >= max) return;
    onChange(String(number + 1));
  };

  const decrease = () => {
    if (number === null) return;
    if (number <= min) return;
    onChange(String(number - 1));
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={(v) => onChange(v.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        maxLength={3}
        placeholder="0"
        placeholderTextColor={Colors.SUBTEXT}
        scrollEnabled={false}
        style={styles.input}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={increase} style={styles.button}>
          <Icon name="chevron-up" size={14} color={Colors.TEXT} />
        </TouchableOpacity>

        <TouchableOpacity onPress={decrease} style={styles.button}>
          <Icon name="chevron-down" size={14} color={Colors.TEXT} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 8,
  },

  input: {
    width: 40,                
    height: 42,                
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT,
    textAlign: 'center',
    includeFontPadding: false, 
  },

  controls: {
    justifyContent: 'center',
    marginLeft: 6,
  },

  button: {
    paddingVertical: 2,
  },
});
