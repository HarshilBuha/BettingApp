import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors } from '../../../assets/fonts/fonts';
import { Images } from '../../../assets/Images';
import GradientButton from '../GradientButton';
import { useNavigation } from '@react-navigation/native';

const ShareButton = ({ icon, label }) => {
  const isEmail = label === 'Email';

  return (
    <TouchableOpacity
      style={[
        styles.shareButton,
        isEmail && styles.emailShareButton,
      ]}
      activeOpacity={0.7}
    >
      <Image
        source={icon}
        resizeMode="contain"
        style={{ height: 25, width: 25 }}
      />
      <Text
        style={[
          styles.shareLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};


export default function PoolCreatedSuccess({
  initialData,
}) {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Confetti / Celebration Icon */}
        <Image
          source={Images.Party}
          style={styles.celebration}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Your Pool is Live !</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          <Text style={styles.poolName}>
            {initialData?.poolName || 'Your Pool'}
          </Text>{' '}
          has been created successfully.
        </Text>

        <Text style={styles.inviteText}>
          Time to invite your friends!
        </Text>

        {/* Share Title */}
        <Text style={styles.shareTitle}>Share with friends</Text>

        {/* Share Buttons */}
        <View style={styles.shareGrid}>
          <ShareButton
            icon={Images.Whatsapp}
            label="Whatsapp"
            color="#25D366"
          />
          <ShareButton
            icon={Images.Messenger}
            label="Messenger"
            color="#0084FF"
          />
          <ShareButton
            icon={Images.SMS}
            label="SMS"
            color="#F5A623"
          />
          <ShareButton
            icon={Images.Telegram}
            label="Telegram"
            color="#0088CC"
          />
          <ShareButton
            icon={Images.Email}
            label="Email"
            color="#E74C3C"
          />
        </View>


      </View>
      {/* Copy Pool Link */}
      <View style={{ marginHorizontal: "20%" }}>
        <GradientButton
          title="Copy Pool Link"
          img={Images.Copy}
        />

        {/* Go To Pool */}
        <TouchableOpacity style={styles.poolButton} onPress={() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'PoolStack',
                state: {
                  routes: [{ name: 'PoolMain' }],
                },
              },
            ],
          });
        }}
        >
          <Text style={styles.goToPool}>Go to My Pool</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.GREY,
  },

  celebration: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
    textAlign: 'center',
  },

  poolName: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
  },

  inviteText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
    marginTop: 4,
    marginBottom: 16,
  },

  shareTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
    marginBottom: 12,
  },

  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },

  shareButton: {
    width: '48%',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.GREY,
  },
  emailShareButton: {
    width:"100%"
  },
  shareLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },
  poolButton: {
    alignItems: "center",
  },

  copyText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
  },

  goToPool: {
    marginTop: 14,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    paddingBottom:100
  },

  backButton: {
    marginTop: 20,
    alignSelf: 'center',
  },

  backText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
  },
});
