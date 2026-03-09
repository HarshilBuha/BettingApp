import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../assets/fonts/fonts';

export default function Dropdown({
  label,
  value,
  onSelect,
  options,
  placeholder = 'Select category',
  required = false,
  error,
  isOpen = false,
  onToggle,
}) {
  const selectedItem = value;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.trigger,
          error && styles.errorBorder,
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedItem && styles.placeholder,
          ]}
        >
          {selectedItem ? selectedItem.name : placeholder}
        </Text>

        <Icon
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.SUBTEXT}
        />
      </TouchableOpacity>

      {/* 👇 CHANGED: ScrollView instead of FlatList */}
      {isOpen && (
        <View style={styles.dropdownWrapper}>
          <ScrollView
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            scrollEventThrottle={16}
          >
            {options.map((item) => {
              const selectedId = selectedItem?.id ?? selectedItem?._id;
              const itemId = item?.id ?? item?._id;

              const active = selectedId !== undefined && selectedId === itemId;

              return (
                <TouchableOpacity
                  key={itemId}
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                  }}
                >
                  {item.icon && (
                    <Image
                      source={
                        typeof item.icon === 'string'
                          ? { uri: item.icon }
                          : item.icon
                      }
                      style={{ width: 20, height: 20, marginRight: 10 }}
                      resizeMode="contain"
                    />
                  )}

                  <Text style={styles.optionText}>
                    {item.name}
                  </Text>

                  {active && (
                    <Icon
                      name="checkmark"
                      size={18}
                      color={Colors.TEXT}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    marginBottom: 5,
  },
  required: {
    color: Colors.ERROR,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  triggerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },
  placeholder: {
    color: Colors.SUBTEXT,
  },
  dropdownWrapper: {
    marginTop: 6,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GREY,
    overflow: 'hidden',
    maxHeight: 300,
    zIndex: 1000,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GREY,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
  },
  errorBorder: {
    borderColor: Colors.ERROR,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.ERROR,
    fontFamily: 'Inter-Regular',
  },
});
