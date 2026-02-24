import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../assets/fonts/fonts';
import { Images } from '../../../assets/Images';

export default function StepFour({
  initialData,
  onNext,
  onPrevious,

}) {
  return (
    <View style={styles.container}>
      {/* Card */}
      <View style={styles.section}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Image source={Images.True} resizeMode='contain' style={{ height: 20, width: 20 }} />
          <Text style={styles.sectionTitle}>Rules & Entry</Text>
        </View>

        {/* Summary Box */}
        <View style={styles.summaryBox}>
          <Text style={styles.poolTitle}>
            {initialData?.poolName || 'Untitled Pool'}
          </Text>

          {!initialData?.description && (
            <Text style={styles.mutedText}>No description Provided</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.infoText}>
            Category :{' '}
            <Text style={styles.infoValue}>
              {initialData?.category?.name || 'Not Selected'}
            </Text>
          </Text>

          <Text style={styles.infoText}>
            Points :{' '}
            <Text style={styles.infoValue}>
              {initialData?.pointsToAward || 'Not Set'}
            </Text>
          </Text>

          <Text style={styles.infoText}>
            Reward System :{' '}
            <Text style={styles.infoValue}>
              {initialData?.rewardSystem?.name || 'Not Set'}
            </Text>
          </Text>
        </View>

        {/* Info Note */}
        <View style={styles.noteBox}>
          <Image source={Images.GoldenTick} resizeMode='contain' style={{ height: 20, width: 20 }} />
          <Text style={styles.noteText}>
            Your pool is ready to publish! Once created, you’ll be able to invite friends and start collecting entries.
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
          onPress={onNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
  summaryBox: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 14,
  },
  poolTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.TEXT,
    marginBottom: 4,
  },
  mutedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.GREY,
    marginVertical: 8,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
    marginBottom: 6,
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
  },
  noteBox: {
    marginTop: 12,
    flexDirection: "row",
    gap: 0,
    padding: 10,       
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    lineHeight: 16,
    textAlign: "center",

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
