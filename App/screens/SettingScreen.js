import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../assets/fonts/fonts';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from '../components/ModalComponent';
import { useDeleteAccount } from '../api/AuthApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../contexts/AuthContext';

export default function SettingScreen({ }) {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'logout' | 'delete'
  const deleteAccountMutation = useDeleteAccount()
  const { signOut } = useContext(AuthContext);
  const handleLogout = async () => {
    setShowModal(false);
    const token = await AsyncStorage.getItem('userToken');
    await signOut(token)
  };

  const handleDelete = async () => {
    setShowModal(false);

    deleteAccountMutation.mutate(
      {},
      {
        onSuccess: async (data) => {
          console.log('Delete Account SUCCESS', data);

          const token = await AsyncStorage.getItem('userToken');
          await signOut(token);
        },
        onError: (error) => {
          Alert.alert(
            'Delete Account Failed',
            error.message || 'Something went wrong'
          );
          console.log(error.message);
          
        },
      }
    );
  };

  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton hideRight={true} />

      <Text style={styles.title}>Setting</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Forgot")}>
          <Text style={styles.cardText}>Password Change</Text>
          <Icon name="chevron-forward" size={20} color={Colors.SUBTEXT} />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardText}>Notification</Text>
          <Switch
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
            trackColor={{ false: '#E5E5E5', true: Colors.CYAN }}
            thumbColor={Colors.WHITE}
          />
        </View>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Help Center</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            setModalType('delete');
            setShowModal(true);
          }}
        >
          <Text style={styles.cardText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.logoutCard]}
          onPress={() => {
            setModalType('logout');
            setShowModal(true);
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </View>
      <ModalComponent
        visible={showModal}
        type={modalType}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10
  },

  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
    textAlign: 'center',
    marginVertical: 12,
  },

  cardContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  cardText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },

  logoutCard: {
    borderColor: '#F2DADA',
  },

  logoutText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.ERROR,
  },
});
