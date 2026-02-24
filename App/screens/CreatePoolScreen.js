import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../assets/fonts/fonts';
import { useCreatePool } from '../api/PoolApis';
import Header from '../components/Header';
import StepOne from '../components/Steps/StepOne';
import StepTwo from '../components/Steps/StepTwo';
import StepThree from '../components/Steps/StepThree';
import StepFour from '../components/Steps/StepFour';
import StepFive from '../components/Steps/StepFive';
import PoolCreatedSuccess from '../components/Steps/PoolCreatedSuccess';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function CreatePoolScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutateAsync: createPool, isPending: isCreating } = useCreatePool();
  const [poolData, setPoolData] = useState({
    poolName: '',
    description: '',
    category: null,
    question: '',
    pointsToAward: '1',
    winningCriteria: null,
    customRules: '',
    rewardSystem: null,
    winner: 70,
    runnerUp: 20,
    secondRunnerUp: 10,
    friends: [],
  });

  console.log(poolData);


  const handleBackPress = () => {
    if (showSuccess) {
      setShowSuccess(false);
      setCurrentStep(5);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const merged = { ...poolData };

      // build payload exactly as backend expects
      const payload = {
        poolName: merged.poolName,
        description: merged.description,
        category: merged.category?._id ?? null,
        question: merged.question,
        options: merged.options ?? [],
        pointsToJoin: Number(merged.pointsToAward) || 0,
        winningCriteria: merged.winningCriteria?.name ?? null,
        customRules: merged.customRules ?? '',
        rewardSystem: merged.rewardSystem?.name ?? null,
        winner: Number(merged.winner) || 0,
        runnerUp: Number(merged.runnerUp) || 0,
        secondRunnerUp: Number(merged.secondRunnerUp) || 0,
        friends: merged.friends ?? [],
      };

      console.log('Payload to API:', payload);

      const res = await createPool(payload);

      Alert.alert('Success', 'Pool created successfully!');
      setShowSuccess(true);
    } catch (error) {
      console.log('Create pool error:', error);
      Alert.alert(
        'Error',
        error?.message || 'Failed to create pool. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDataChange = (newData) => {
    setPoolData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const calculateProgress = () => {
    return Math.round((currentStep / 5) * 100);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            onNext={handleNext}
            initialData={poolData}
            onDataChange={handleDataChange}
          />
        );
      case 2:
        return (
          <StepTwo
            onNext={handleNext}
            onPrevious={handlePrevious}
            initialData={poolData}
            onDataChange={handleDataChange}
          />
        );
      case 3:
        return (
          <StepThree
            onNext={handleNext}
            onPrevious={handlePrevious}
            initialData={poolData}
            onDataChange={handleDataChange}
          />
        );
      case 4:
        return (
          <StepFour
            onNext={handleNext}
            onPrevious={handlePrevious}
            initialData={poolData}
            onDataChange={handleDataChange}
          />
        );
      case 5:
        return (
          <StepFive
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            onShowSuccess={setShowSuccess}
            initialData={poolData}
            onDataChange={handleDataChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header - Always Shown */}
      <Header
        showBackButton={true}
        onBackPress={handleBackPress}
      />

      {/* Title and Progress - Only when not showing success */}
      {!showSuccess && (
        <>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Inter-SemiBold',
              color: Colors.TEXT,
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            Create a New Pool
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressText}>
              <Text style={styles.progressLabel}>
                Steps {currentStep} of 5
              </Text>
              <Text style={styles.progressPercent}>
                {calculateProgress()}%
              </Text>
            </View>

            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#01C2A8', '#315453', '#353737']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: `${calculateProgress()}%` },
                ]}
              />


              {/* 
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculateProgress()}%` },
                ]}
              /> */}
            </View>
          </View>
        </>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.TEXT} />
          <Text style={styles.loadingText}>Creating your pool...</Text>
        </View>
      )}

      {/* Step Content */}
      {showSuccess ? (
        <PoolCreatedSuccess
          initialData={poolData}
          onPrevious={() => {
            setShowSuccess(false);
            setCurrentStep(5);
          }}
          onSubmit={() => {
            // Already submitted, just navigate
            handleSubmit(poolData);
          }}
        />
      ) : (
        renderStep()
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10
  },
  progressContainer: {
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.GREY,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.TEXT,
    borderRadius: 3,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 5
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.Grey,
  },
  progressPercent: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.TEXT,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.WHITE,
    marginTop: 12,
  },
});