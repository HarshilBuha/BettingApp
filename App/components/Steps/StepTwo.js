import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Colors } from '../../../assets/fonts/fonts';
import { Images } from '../../../assets/Images';

export default function StepTwo({ onNext, onPrevious, initialData, onDataChange }) {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [options, setOptions] = useState(initialData?.options || ['', '']);

  console.log(question);
  console.log(options);


  const handleNext = () => {
    onDataChange({
      question,
      options,
    });
    onNext();
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (text, index) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  return (
    <ScrollView style={styles.container}  showsVerticalScrollIndicator={false}>
      {/* Main Card */}
      <View style={styles.section}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Image source={Images.Message} resizeMode='contain' style={{ height: 20, width: 20 }} />
          <Text style={styles.sectionTitle}>Create Your Bet</Text>
        </View>

        {/* Question */}
        <View style={styles.subsection}>
          <Text style={styles.label}>
            What are participants betting on? *
          </Text>

          <TextInput
            style={styles.textArea}
            placeholder="eg., Who will score the first goal in the Champion League Final?"
            placeholderTextColor={Colors.SUBTEXT}
            multiline
            value={question}
            onChangeText={setQuestion}
          />
        </View>

        {/* Answer Choice */}
        <View style={styles.subsection}>
          <Text style={styles.label}>Answer Choice *</Text>

          {options.map((opt, index) => (
            <TextInput
              key={index}
              style={styles.optionInput}
              placeholder={`Option ${index + 1}`}
              placeholderTextColor={Colors.SUBTEXT}
              value={opt}
              onChangeText={(text) => updateOption(text, index)}
            />
          ))}

          <TouchableOpacity
            style={styles.addChoiceButton}
            onPress={addOption}
            activeOpacity={0.7}
          >
            <Text style={styles.addChoiceText}>+ Add Choice</Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>
            Participants will choose from these options when making their predictions.
          </Text>
        </View>
      </View>

      {/* Footer Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.previousButton}
          onPress={onPrevious}
          activeOpacity={0.7}
        >
          <Text style={styles.previousText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextText}>Next</Text>
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
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal:10
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT,
  },

  subsection: {
    backgroundColor: Colors.GREY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 14,
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    marginBottom: 8,
  },

  textArea: {
    borderWidth: 1,
    borderColor: Colors.WHITE,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
    textAlignVertical: 'top',
  },

  optionInput: {
    borderWidth: 1,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
    marginBottom: 10,
  },

  addChoiceButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.TEXT,
    marginTop: 4,
  },

  addChoiceText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },

  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    textAlign: 'center',
    marginTop: 10,
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

  previousText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },

  nextText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.WHITE,
  },
});