import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Colors } from '../../../assets/fonts/fonts';
import Dropdown from '../Dropdown';
import { Images } from '../../../assets/Images';
import { useGetCategories } from '../../api/PoolApis';


export default function StepOne({ onNext, onPrevious, initialData, onDataChange }) {
  const [poolName, setPoolName] = useState(initialData?.poolName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || null);
  const [errors, setErrors] = useState({});
  const { data: categories = [] } = useGetCategories();
  const [openDropdown, setOpenDropdown] = useState(null);  
  const handleDropdownToggle = (dropdownName) => {
    const newState = openDropdown === dropdownName ? null : dropdownName;
    setOpenDropdown(newState);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!poolName.trim()) newErrors.poolName = 'Pool name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onDataChange({
        poolName,
        description,
        category,
      });
      onNext();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image source={Images.Trophy} resizeMode='contain' style={{ height: 20, width: 20 }} />
          <Text style={styles.sectionTitle}>Pool Details</Text>
        </View>

        <Text style={styles.inputTitle}>Pool Name *</Text>
        <TextInput
          style={[styles.input, errors.poolName && styles.inputError]}
          placeholder="Pool Name"
          value={poolName}
          onChangeText={setPoolName}
          placeholderTextColor={Colors.SUBTEXT}
        />
        {errors.poolName && <Text style={styles.errorText}>{errors.poolName}</Text>}

        <Text style={styles.inputTitle}>Description</Text>
        <TextInput
          style={[styles.textArea, errors.description && styles.inputError]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={Colors.SUBTEXT}
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Dropdown
          label="Category / Event Type *"
          value={category}
          onSelect={(item) => {
            setCategory(item);
            setOpenDropdown(null);
          }}
          options={categories}
          placeholder="Select category"
          error={errors.category}
          isOpen={openDropdown === 'category'}
          onToggle={() => handleDropdownToggle('category')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.previousButton}
          onPress={onPrevious}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { color: Colors.TEXT }]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.GREY,
    paddingHorizontal: 30,
    paddingVertical: 20,
    margin: 20,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT,
  },
  inputTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
    marginBottom: 12,
  },
  inputError: {
    borderColor: Colors.ERROR,
  },
  textArea: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    maxHeight: 95,
    minHeight: 95,
    color: Colors.TEXT,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.ERROR,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: "space-between",
    gap: 12,
    marginHorizontal: 5,
    marginBottom: "20%"
  },
  previousButton: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: Colors.TEXT,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: Colors.TEXT,
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.WHITE,
  },
});