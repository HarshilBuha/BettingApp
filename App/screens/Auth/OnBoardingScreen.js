import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { Images } from '../../../assets/Images';
import { Colors } from '../../../assets//fonts/fonts'
import GradientButton from '../../components/GradientButton'

export default function OnBoardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.WHITE}/>
      <View style={styles.logoContainer}>
        <Image source={Images.Logo} style={styles.logoIcon} />
        <Text style={styles.logoText}>Porralia</Text>
      </View>

      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Create betting pools with friends and{'\n'}
        make every game more exciting
      </Text>

      <Image source={Images.Poster} style={styles.poster} />

      {/* Primary */}
      <GradientButton
        title="Sign In"
        onPress={() => navigation.navigate('Auth', { mode: 'signin' })}
      />

      {/* Secondary */}
      <GradientButton
        title="Sign Up"
        onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
        variant="secondary"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  logoText: {
    fontSize: 18,
    color: Colors.TEXT,
    fontFamily: 'Inter-SemiBold'
  },
  poster: {
    width: 300,
    height: 260,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: Colors.TEXT,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold'
  },
  subtitle: {
    fontSize: 12,
    color: Colors.TEXT,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 35,
    lineHeight: 20,
  },
});
