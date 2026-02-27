import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Pressable,
  Alert,
} from 'react-native';
import { Colors } from '../../assets/fonts/fonts';
import LinearGradient from 'react-native-linear-gradient';
import { Images } from '../../assets/Images';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNotificationRespond } from '../api/NotificationApi';
import Loader from './Loader';

export default function PoolCard({ pool, item, onViewPool, mode = 'normal' }) {
  const handleCopyPress = () => {
    if (!pool?.inviteLink) {
      ToastAndroid.showWithGravity(
        "Invite link not available",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      return;
    }

    Clipboard.setString(pool.inviteLink);

    ToastAndroid.showWithGravity(
      "Link copied to clipboard",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };
  const NotificationRespond = useNotificationRespond()
  const loading = NotificationRespond.isPending

  const handleSubmit = ({ action, id }) => {
    NotificationRespond.mutate(
      { action, id },
      {
        onSuccess: () => {
        },
        onError: (error) => {
          Alert.alert(
            'Action Failed',
            error.message || 'Something went wrong'
          );
        },
      }
    );
  };

  return (
    <Pressable
      style={styles.poolCardContainer}
      onPress={mode === 'normal' ? () => onViewPool(pool) : undefined}
    >
      <Loader visible={loading} />
      <View
        style={styles.poolCard}

      >
        {/* Header: Category Badge + Open Button */}
        {mode === 'invited' && item.message && (
          <Text style={styles.inviteMessage}>
            {item.message}
          </Text>
        )}

        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <Image source={{ uri: pool.category?.icon }} style={styles.categoryIcon} />
            <Text style={styles.categoryText}>{pool.category?.name}</Text>
          </View>
          <TouchableOpacity style={pool.poolStatus === "active" ? styles.openButton : styles.completeButton} activeOpacity={0.7}>
            <Text style={styles.openButtonText}>{pool.poolStatus}</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}


        {/* ===== Middle Two Column Section ===== */}
        <View style={styles.middleRow}>

          {/* LEFT SIDE */}
          <View style={styles.leftColumn}>
            <Text style={styles.poolTitle}>{pool.title}</Text>

            {/* Description */}
            <Text style={styles.poolDescription}>{pool.question}</Text>
            <View style={styles.infoRow}>
              <Image source={Images.Prize} style={styles.smallIcon} />

              <View>
                <Text style={styles.infoText}>{pool.betAmount} pts to bet</Text>
                <Text style={styles.infoText}>{pool.totalPot} pts total pot</Text>
                <Text style={styles.infoText}>{pool.maxWin} pts max win</Text>
              </View>
            </View>
          </View>

          {/* RIGHT SIDE */}
          <View style={styles.rightColumn}>
            <View style={styles.infoRow}>
              <Image source={Images.Person} style={styles.smallIcon} />
              <Text style={styles.highlightText}>By {pool.createdBy?.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Image source={Images.Personss} style={styles.smallIcon} />
              <Text style={styles.poolDescription}>{pool.players} Players</Text>
            </View>

            <View style={styles.infoRow}>
              <Image source={Images.Person} style={styles.smallIcon} />
              <Text style={styles.poolDescription} numberOfLines={1}>
                {pool.participants?.length > 0
                  ? typeof pool.participants[0] === 'string'
                    ? pool.participants.join(', ')
                    : pool.participants.map(p => p.playerName).join(', ')
                  : 'No participants'}
              </Text>
            </View>
          </View>

        </View>

        {/* ===== Points Scored ===== */}
        <Text style={styles.pointsCenter}>
          Points Scored: {pool.result?.userPointsEarned || 0} pts
        </Text>
        {/* Copy Link Button */}
        {mode === 'invited' ? (
          <View style={styles.inviteActionRow}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() =>
                handleSubmit({ action: 'accept', id: item.pool.id })
              }
            >
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() =>
                handleSubmit({ action: 'reject', id: item.pool.id })
              }
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleCopyPress}>
            <LinearGradient colors={Colors.GRADIENT} style={styles.copyLinkButton}>
              <Image source={Images.Copy} resizeMode='contain' style={{ height: 18, width: 18 }} />
              <Text style={styles.copyLinkText}>Copy Link to Invite</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  poolCardContainer: {
    marginBottom: 12,
    paddingHorizontal: 0,
  },
  poolCard: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // ✅ HEADER: Category Badge + Open Button
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
  },
  openButton: {
    backgroundColor: "#CCF3EE",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.CYAN,
  },
  completeButton: {
    backgroundColor: "#f3b9b9ff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.ERROR,
  },
  openButtonText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },

  // ✅ TITLE
  poolTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
  },

  // ✅ DESCRIPTION
  poolDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
  },

  // ✅ PLAYERS COUNT
  playersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  playersText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
  },

  // ✅ PLAYER NAMES
  playerNamesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  playerNamesText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
  },

  // ✅ BETTING DETAILS BOX
  bettingBox: {
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
    flexDirection: "row"
  },
  bettingRow: {
    alignItems: 'center',
    gap: 8,
  },
  bettingLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.DARKGREY,
  },

  // ✅ POINTS SCORED
  pointsScoredSection: {
    marginBottom: 6,
  },
  pointsScoredLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    fontWeight: 800,
    color: Colors.DARKGREY,
  },

  // ✅ SCORED BY
  scoredBySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  scoredByText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftColumn: {
    flex: 1,
    gap: 5,
  },

  rightColumn: {
    flex: 1,
    gap: 6,
    paddingLeft: 10,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 6,
  },

  smallIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',

  },

  infoText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
  },

  highlightText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.CYAN,
  },

  pointsCenter: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
    marginVertical: 12,
  },

  // ✅ CREATED BY
  createdBySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  createdByText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.CYAN,
  },

  // ✅ COPY LINK BUTTON
  copyLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.TEXT,
    paddingVertical: 10,
    paddingHorizontal: 1,
    borderRadius: 9,
  },
  copyLinkText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.GREY,
  },
  inviteActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },

  acceptBtn: {
    flex: 1,
    backgroundColor: Colors.CYAN,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  acceptText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: Colors.WHITE,
  },

  declineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.ERROR,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  declineText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: Colors.ERROR,
  },
  inviteMessage: {
    marginBottom: 6,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
  },

});