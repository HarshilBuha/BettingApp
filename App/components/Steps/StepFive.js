import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../assets/fonts/fonts';
import { Images } from '../../../assets/Images';
import PoolCreatedSuccess from '../../components/Steps/PoolCreatedSuccess';


export default function StepFive({ onDataChange, onSubmit, onPrevious, initialData, onShowSuccess }) {
  const [friends, setFriends] = useState(initialData?.friends || []);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    onDataChange({ friends });
  }, [friends]);

  const validateEmail = (em) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(em);
  };
  const validatePhone = (ph) => /^[6-9]\d{9}$/.test(ph);

  const validateName = (name) => /^[a-zA-Z ]{2,50}$/.test(name);

  const addFriend = () => {
    const value = email.trim();
    const newErrors = {};

    if (!value) {
      newErrors.email = 'Value is required';
    } else if (
      !validateEmail(value) &&
      !validatePhone(value) &&
      !validateName(value)
    ) {
      newErrors.email = 'Enter valid email, phone or name';
    }

    if (friends.length >= 15) {
      Alert.alert('Limit reached', 'You can add only 5 friends');
      return;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Duplicate check
    const isDuplicate = friends.some((f) =>
      f.email === value ||
      f.phone === value ||
      f.name?.toLowerCase() === value.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Error', 'This friend already exists');
      return;
    }

    let friendObj = {};
    if (validateEmail(value)) friendObj = { email: value };
    else if (validatePhone(value)) friendObj = { phone: value };
    else friendObj = { name: value };

    setFriends(prev => [...prev, friendObj]);
    setEmail('');
    setErrors({});

  };


  const removeFriend = (index) => {
    setFriends(prev => prev.filter((_, i) => i !== index));
  };




  const handleSubmitPool = async () => {
    await onSubmit({ ...initialData, friends });
  };



  return (
    <ScrollView style={styles.container}>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Image source={Images.Message} resizeMode='contain' style={{ height: 20, width: 20 }} />
          <Text style={styles.sectionTitle}>Invite Friends</Text>
        </View>
        <View style={styles.addEmailContainer}>
          <TextInput
            style={[styles.emailInput, errors.email && styles.inputError]}
            placeholder="Enter Email, Name or Phone No."
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={Colors.SUBTEXT}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addFriend}
            activeOpacity={0.7}
          >
            <Icon name="add" size={25} color={Colors.TEXT} />
          </TouchableOpacity>
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.friendsList}>
          <FlatList
            data={friends}
            renderItem={({ item, index }) => {
              const displayValue = item.email || item.phone || item.name;

              return (
                <View style={styles.friendCard}>
                  <View style={styles.friendInfo}>
                    <Icon name="person-circle" size={32} color={Colors.TEXT} />
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendEmail}>{displayValue}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeFriend(index)}
                    activeOpacity={0.7}
                  >
                    <Icon name="close-circle" size={24} color={Colors.ERROR} />
                  </TouchableOpacity>
                </View>
              );
            }}

            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.helperTitle}>
          What happens next?
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20, alignItems: 'center' }}>
          <Image source={Images.True} resizeMode='contain' style={{ height: 20, width: 20 }} />
          <Text style={styles.helperText}>Your Pool will be created and go live</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <Image source={Images.True} resizeMode='contain' style={{ height: 20, width: 20 }} />
          <Text style={styles.helperText}>Friends can join using your pool link</Text>
        </View>
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
          onPress={handleSubmitPool}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Create Pool</Text>
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
  addEmailContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  emailInput: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
  },
  inputError: {
    borderColor: Colors.ERROR,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.ERROR,
    marginBottom: 8,
  },
  friendsList: {
    marginBottom: 12,
    maxHeight: 250,
  },
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  friendDetails: {
    flex: 1,
  },
  friendEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
  },
  innerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  helperTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
    marginVertical: 16,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
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