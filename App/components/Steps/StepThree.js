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
import Dropdown from '../Dropdown';
import { Images } from '../../../assets/Images';
import NumberStepper from './NumberStepper';


export default function StepThree({
  onNext,
  onPrevious,
  initialData,
  onDataChange,
}) {
  const [pointsToAward, setPointsToAward] = useState(
  );
  const [winningCriteria, setWinningCriteria] = useState(
    initialData?.winningCriteria || null
  );
  console.log(pointsToAward);

  const [customRules, setCustomRules] = useState(
    initialData?.customRules || ''
  );
  const [rewardSystem, setRewardSystem] = useState(
    initialData?.rewardSystem || null
  );

  console.log(rewardSystem);

  const [winner, setWinner] = useState(
    initialData?.winner?.toString() || ''
  );
  const [runnerUp, setRunnerUp] = useState(
    initialData?.runnerUp?.toString() || ''
  );
  const [secondRunnerUp, setSecondRunnerUp] = useState(
    initialData?.secondRunnerUp?.toString() || ''
  );
  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null); 
  const handleDropdownToggle = (dropdownName) => {
    const newState = openDropdown === dropdownName ? null : dropdownName;
    setOpenDropdown(newState);
  };


  const winningCriteriaOptions = [
    { id: 1, name: 'Correct Score' },
    { id: 2, name: 'Most Accurate Prediction' },
    { id: 3, name: 'Custom Rules' },
  ];


  const rewardSystemOptions = [
    { id: 1, name: 'Points Awards', icon: Images.ColorTrophy },
    { id: 2, name: 'Podium', icon: Images.Competition },
  ];


  const updatePercentage = (value, field) => {
    let newValue = Math.max(0, Math.min(100, parseInt(value) || 0));

    let w = parseInt(winner) || 0;
    let r = parseInt(runnerUp) || 0;
    let s = parseInt(secondRunnerUp) || 0;

    if (field === 'winner') w = newValue;
    if (field === 'runnerUp') r = newValue;
    if (field === 'secondRunnerUp') s = newValue;

    const total = w + r + s;

    if (total > 100) {
      const excess = total - 100;

      if (field !== 'winner' && w > 0) w = Math.max(0, w - excess);
      else if (field !== 'runnerUp' && r > 0) r = Math.max(0, r - excess);
      else if (field !== 'secondRunnerUp' && s > 0) s = Math.max(0, s - excess);
    }

    setWinner(String(w));
    setRunnerUp(String(r));
    setSecondRunnerUp(String(s));
    setErrors({});
  };

  // 🔒 DIRECT VALIDITY CHECK - No useMemo, recalculates every render
  const isFormValid = (() => {
    const points = parseInt(pointsToAward);
    if (!points || points < 0) return false;

    if (!winningCriteria) return false;
    if (winningCriteria.id === 3 && !customRules.trim()) return false;

    if (!rewardSystem) return false;

    // ✅ Points Awards → no percentage validation
    if (rewardSystem?.id === 1) return true;

    // ✅ Podium → percentages must total 100
    const total =
      (parseInt(winner) || 0) +
      (parseInt(runnerUp) || 0) +
      (parseInt(secondRunnerUp) || 0);

    return total === 100;
  })();


  // ❗ Validation WITH setState (only called on press)
  const validateForm = () => {
    const newErrors = {};

    const points = parseInt(pointsToAward);
    if (!points || points < 1) {
      newErrors.pointsToAward = 'Minimum points should be 10';
    }

    if (!winningCriteria) {
      newErrors.winningCriteria = 'Please select a winning criteria';
    }

    if (winningCriteria?.id === 3 && !customRules.trim()) {
      newErrors.customRules = 'Please describe your custom rules';
    }

    if (!rewardSystem) {
      newErrors.rewardSystem = 'Please select a reward system';
    }

    const total =
      (parseInt(winner) || 0) +
      (parseInt(runnerUp) || 0) +
      (parseInt(secondRunnerUp) || 0);

    if (rewardSystem?.id === 2 && total !== 100) {
      newErrors.percentages = 'Total percentage must equal 100%';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onDataChange({
        pointsToAward,
        winningCriteria,
        customRules: winningCriteria?.id === 3 ? customRules : null,
        rewardSystem,
        winner: rewardSystem?.id === 2 ? parseInt(winner) : 0,
        runnerUp: rewardSystem?.id === 2 ? parseInt(runnerUp) : 0,
        secondRunnerUp: rewardSystem?.id === 2 ? parseInt(secondRunnerUp) : 0,
      });
      onNext();
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Image source={Images.Pot} resizeMode='contain' style={{ height: 20, width: 20 }} />
          <Text style={styles.sectionTitle}>Rules & Entry</Text>
        </View>

        {/* Points */}
        <View style={styles.subsection}>
          <Text style={styles.inputTitle}>Points to Award/Spend *</Text>
          <TextInput
            style={[styles.input, errors.pointsToAward && styles.inputError]}
            value={pointsToAward}
            onChangeText={(text) => {
              setPointsToAward(text);
              setErrors({});
            }}
            keyboardType="numeric"
            placeholder='100 Points'
            placeholderTextColor={Colors.SUBTEXT}
          />
          <Text style={styles.helperText}>
            Specify how many points participants will be awarded for winning or need to spend to participate
          </Text>
          {errors.pointsToAward && (
            <Text style={styles.errorText}>{errors.pointsToAward}</Text>
          )}
        </View>

        {/* Winning Criteria */}
        <View style={styles.subsection}>
          <Dropdown
            label="Winning Criteria *"
            value={winningCriteria}
            onSelect={(value) => {
              setWinningCriteria(value);
              setOpenDropdown(null);
              setErrors({});
            }}
            options={winningCriteriaOptions}
            placeholder="Select Winning Criteria"
            error={errors.winningCriteria}
            isOpen={openDropdown === 'winningCriteria'}
            onToggle={() => handleDropdownToggle('winningCriteria')}
          />
        </View>

        {/* Custom Rules & Reward System */}
        {winningCriteria && (
          <View style={styles.subsection}>
            {winningCriteria?.id === 3 && (
              <>
                <Text style={styles.inputTitle}>Custom Rules *</Text>
                <TextInput
                  style={[styles.textArea, errors.customRules && styles.inputError]}
                  value={customRules}
                  onChangeText={(text) => {
                    setCustomRules(text);
                    setErrors({});
                  }}
                  multiline
                />
                {errors.customRules && (
                  <Text style={styles.errorText}>{errors.customRules}</Text>
                )}
              </>
            )}

            <Dropdown
              label="Reward System *"
              value={rewardSystem}
              onSelect={(value) => {
                setRewardSystem(value);
                setErrors({});
                setOpenDropdown(null);
              }}
              options={rewardSystemOptions}
              placeholder="Select Reward System"
              error={errors.rewardSystem}
              isOpen={openDropdown === 'rewardSystem'}
              onToggle={() => handleDropdownToggle('rewardSystem')}
            />
          </View>
        )}

        {/* Percentages */}
        {rewardSystem?.id == 2 ? (
          <View style={styles.subsection}>
            <Text style={styles.sectionSubtitle}>Top 3 participants split the pot. For example: 1st place gets 70%, 2nd gets 20%, 3rd gets 10%. If there's a tie, tied players share the combined prizes for their positions.</Text>

            <View style={styles.percentageGrid}>
              <View>
                <NumberStepper
                  value={winner}
                  onChange={(v) => updatePercentage(v, 'winner')}
                />
              </View>

              <View>
                <NumberStepper
                  value={runnerUp}
                  onChange={(v) => updatePercentage(v, 'runnerUp')}
                />
              </View>

              <View>
                <NumberStepper
                  value={secondRunnerUp}
                  onChange={(v) => updatePercentage(v, 'secondRunnerUp')}
                />
              </View>
            </View>

            {errors.percentages && (
              <Text style={styles.errorText}>{errors.percentages}</Text>
            )}
          </View>
        ) :
          <View style={styles.subsection}>
            <Text style={styles.sectionSubtitle}>Every participant who meets the winning condition shares the pot equally.</Text>
          </View>
        }
      </View>

      {/* Footer */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.previousButton} onPress={onPrevious}>
          <Text style={[styles.buttonText, { color: Colors.TEXT }]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !isFormValid && styles.buttonDisabled,
          ]}
          onPress={handleNext}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    margin: 20,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT,
  },
  subsection: {
    backgroundColor: Colors.GREY,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 12,
    paddingBottom: 14,
    paddingHorizontal:14
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
    marginBottom: 8,
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
    color: Colors.TEXT,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
    marginBottom: 0,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    marginBottom: 16,
    lineHeight: 16,
    textAlign: 'center',
  },
  percentageGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  percentageLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    marginBottom: 6,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: Colors.GREY,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  totalValid: {
    color: Colors.TEXT,
  },
  totalInvalid: {
    color: Colors.ERROR,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.ERROR,
    marginBottom: 0,
    textAlign: "center"
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.WHITE,
  },
});
