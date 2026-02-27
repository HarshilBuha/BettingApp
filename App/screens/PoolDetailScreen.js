import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Colors } from '../../assets/fonts/fonts';
import { Images } from '../../assets/Images';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../components/Loader';
import { useGetProfile } from '../api/ProfileApis';
import { useDeclareResult, useGetPools, usePoolReopen, usePrediction } from '../api/PoolApis';
import ConfirmModal from '../components/ConfirmModal';
import Icon from 'react-native-vector-icons/Ionicons';

const RankDropdown = ({ visible, options, onSelect }) => {
  if (!visible) return null;

  return (
    <View style={styles.dropdown}>
      {options.map((rank, index) => (
        <>
          <TouchableOpacity
            key={rank.id}
            style={styles.option}
            onPress={() => onSelect(rank)}
          >
            <Image source={rank.icon} style={styles.icon} resizeMode='contain' />
            <Text style={styles.text}>{rank.label}</Text>
          </TouchableOpacity>
          {index !== options.length - 1 && <View style={{ width: "70%", height: 2, backgroundColor: Colors.GREY, alignSelf: "center" }} />}

        </>
      ))}
    </View>
  );
};
export default function PoolDetailScreen({ navigation, route }) {
  const { pool: initialPool } = route.params || {};
  const poolId = initialPool?.id;

  const { data: pools = [], isLoading: poolLoading } = useGetPools();
  const { data: userData = [], isLoading: userLoading } = useGetProfile();
  const { mutate: createPrediction, isPending: predictionLoading } = usePrediction()
  const { mutate: poolReopen, isPending: reopenLoading } = usePoolReopen()
  const isLoading = poolLoading || userLoading || predictionLoading || reopenLoading;

  const pool = pools.find(p => p.id === poolId) || initialPool;

  const [correctAnswer, setCorrectAnswer] = useState(pool.result?.correctPrediction || null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCorrectOption, setPendingCorrectOption] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(pool?.yourPrediction || "NA");
  const [answerRanks, setAnswerRanks] = useState({});
  const [activeRankPicker, setActiveRankPicker] = useState(null);
  const options = Array.isArray(pool?.options) ? pool.options : [];
  const isPodiumReady =
    pool.rewardSystem === "Podium" &&
    answerRanks[1] &&
    answerRanks[2] &&
    answerRanks[3];


  const handleRankSelect = (option, rankId) => {
    setAnswerRanks(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(r => {
        if (updated[r] === option) {
          delete updated[r];
        }
      });
      updated[rankId] = option;
      return updated;
    });

    setActiveRankPicker(null);
  };

  const handleSuggestCustomOptions = () => {
    navigation.navigate('SuggestCustomOptions', {
      poolId: pool.id,
      title: pool.title,
      options: pool.options,
    });
  };

  const handlePrediction = () => {
    if (!selectedAnswer) {
      Alert.alert("Please select an answer first");
      return;
    }
    console.log(selectedAnswer);

    createPrediction(
      {
        id: pool.id,
        prediction: selectedAnswer,
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Prediction submitted successfully");
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      }
    );
  };
  const handlePoolReopen = () => {
    poolReopen(
      { id: pool.id },
      {
        onSuccess: () => {
          Alert.alert("Success", "Pool Reopened successfully");
          setCorrectAnswer(null);
          setPendingCorrectOption(null);
          setSelectedAnswer(null);
        },
        onError: (error) =>
          Alert.alert("Error", error?.message || "Something went wrong"),
      }
    );
  };

  const declareResult = useDeclareResult()
  const handleDeclareResult = (correctPrediction) => {
    declareResult.mutate(
      { id: pool.id, correctPrediction },
      {
        onSuccess: () => Alert.alert("Success", "Result declared successfully"),
        onError: (error) =>
          Alert.alert("Error", error?.message || "Something went wrong"),
      }
    );
  };


  const rankOptions = [
    { id: 1, label: 'Rank 1', icon: Images.Competition },
    { id: 2, label: 'Rank 2', icon: Images.Competition },
    { id: 3, label: 'Rank 3', icon: Images.Competition },
  ];



  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title='Back to Pools' showBackButton={true} />
      <Loader visible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.section}>
          <View style={styles.infoHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Image source={{ uri: pool.category?.icon }} style={styles.icon} resizeMode='contain' />
              <Text style={styles.infoTitle}>{pool.title}</Text>
            </View>
            <TouchableOpacity style={pool.poolStatus === "active" ? styles.openButton : styles.completeButton} activeOpacity={0.7}>
              <Text style={styles.openButtonText}>{pool.poolStatus}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.infoQuestion}>{pool.description}</Text>
          <View style={styles.innerContainer}>
            <Image source={Images.PrizePot} style={styles.icon} resizeMode='contain' />
            <View>
              <Text style={styles.pointsText}>Points to Award</Text>
              <Text style={styles.noParticipants}>{pool.maxWin}</Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <Image source={Images.Persons} style={styles.icon} resizeMode='contain' />
            <View>
              <Text style={styles.pointsText}>No. of Participants</Text>
              <Text style={styles.noParticipants}>{pool.players}</Text>
            </View>
          </View>
        </View>

        {/* Participants Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={Images.Persons} style={styles.icon} resizeMode='contain' />
            <Text style={styles.sectionTitle}>Participants</Text>
          </View>
          <View style={styles.participantsList}>
            {pool.participants?.length > 0 ? (
              pool.participants.map((participant, index) => (
                <View key={index} style={styles.participantCard}>
                  {typeof participant.playerAvatar === 'string' && participant.playerAvatar.trim() !== '' ? (
                    <Image
                      source={{ uri: participant.playerAvatar }}
                      style={styles.participantAvatar}
                      resizeMode="contain"
                    />
                  ) : (
                    <Icon
                      name="person-circle"
                      size={styles.leaderboardAvatar.width || 32}
                      color={Colors.TEXT}
                    />
                  )}
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>
                      {participant.playerName}
                    </Text>

                    <Text style={styles.participantDate}>
                      Joined {participant.playerJoinedDate}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: 'center', color: Colors.SUBTEXT }}>
                No participants yet
              </Text>
            )}
          </View>
        </View>

        {/* Leaderboard Section */}
        {pool.poolStatus == "completed" && pool.leaderboard?.length > 0 && <>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={Images.LeaderBoard} style={styles.icon} resizeMode='contain' />
              <Text style={styles.sectionTitle}>Leaderboard</Text>
            </View>
            <View style={styles.leaderboardList}>
              {pool.leaderboard?.length > 0 && (
                pool.leaderboard.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <View style={styles.leaderboardItem}>
                      <View style={styles.floatingRank}>
                        <Image
                          source={
                            item.rank === 1
                              ? Images.Rank1
                              : item.rank === 2
                                ? Images.Rank2
                                : Images.Rank3
                          }
                          resizeMode='contain'
                          style={{ height: 40, width: 40 }} />
                      </View>
                      {typeof item.playerAvatar === 'string' && item.playerAvatar.trim() !== '' ? (
                        <Image
                          source={{ uri: item.playerAvatar }}
                          style={styles.leaderboardAvatar}
                          resizeMode="contain"
                        />
                      ) : (
                        <Icon
                          name="person-circle"
                          size={40}
                          color={Colors.TEXT}
                        />
                      )}

                      <View style={styles.leaderboardInfo}>
                        <Text style={styles.leaderboardName}>{item.playerName}</Text>
                        <Text style={styles.leaderboardDate}>{item.playerJoinedDate}</Text>
                      </View>
                    </View>
                    <View style={styles.rewardBox}>
                      <Text style={styles.rewardLabel}>Reward System: <Text style={styles.rewardValue}>{item.rewardSystem}</Text></Text>
                      <Text style={styles.rewardLabel}>Reward Amount: <Text style={styles.rewardValue}>{item.rewardAmount}</Text></Text>
                      <Text style={styles.rewardLabel}>Total No. of Points: <Text style={styles.rewardValue}>{item.totalPoints}</Text></Text>
                    </View>
                  </React.Fragment>
                )))}
            </View >
          </View>
        </>}

        {/* Make Your Prediction Section */}
        <View style={[styles.section, pool.poolStatus === "completed" ? { marginBottom: 40 } : { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Image source={Images.Loop} style={styles.icon} resizeMode="contain" />
            <Text style={styles.sectionTitle}>Make Your Prediction</Text>
          </View>

          <View style={styles.predictionContainer}>
            <View style={styles.predictionQuestionContainer}>
              <Text style={styles.predictionQuestion}>Question</Text>
              <Text style={styles.predictionQuestionText}>
                {pool.title}
              </Text>
            </View>

            <Text style={styles.predictionLabel}>Choose Your answer:</Text>

            <View style={styles.answerOptions}>
              {options.length > 0 ? (
                options.map((option, index) => (
                  <View
                    key={index}
                    style={[
                      styles.answerOption,
                      selectedAnswer === option && styles.answerOptionSelected,

                      // ✅ Highlight correct answer (Points Awards only)
                      pool.rewardSystem === "Points Awards" &&
                      correctAnswer === option && {
                        borderColor: "#01C2A8",
                        borderWidth: 2,
                        backgroundColor: "#E6FAF7",
                      },
                    ]}
                  >
                    {/* RADIO BUTTON */}
                    // Inside options.map for the prediction section
                    <TouchableOpacity
                      style={[
                        styles.answerRadio,
                        selectedAnswer === option && styles.answerRadioSelected,
                      ]}
                      onPress={() => {
                        setSelectedAnswer(option);
                        setActiveRankPicker(null);
                      }}
                      // REMOVE or CHANGE this line if it was restricting users
                      disabled={!!pool.result} // Only disable if the pool is already finished
                    >
                      {selectedAnswer === option && <View style={styles.answerRadioDot} />}
                    </TouchableOpacity>

                    {/* OPTION TEXT */}
                    <Text style={styles.answerText}>{option}</Text>

                    {/* YOUR PICK TAG */}
                    {selectedAnswer === option && (
                      <View style={styles.YourPickTag}>
                        <Text style={styles.YourPickTagText}>Your Pick</Text>
                      </View>
                    )}

                    {/* ===== POINTS AWARDS (Mark Correct) ===== */}
                    {pool.rewardSystem === "Points Awards" && (
                      <TouchableOpacity
                        style={[
                          styles.setRankButton,
                          correctAnswer && { opacity: 0.5 },
                        ]}
                        disabled={!!correctAnswer}
                        onPress={() => {
                          setPendingCorrectOption(option);
                          setShowConfirmModal(true);
                        }}
                      >
                        <Image
                          source={
                            correctAnswer === option
                              ? Images.Competition
                              : Images.Rank
                          }
                          style={styles.rankIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.setRankText}>
                          {correctAnswer === option
                            ? "Correct Answer"
                            : "Mark Correct"}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* ===== PODIUM (Set Rank + Dropdown) ===== */}
                    {pool.rewardSystem === "Podium" &&
                      pool.poolStatus !== "completed" && (
                        <>
                          <TouchableOpacity
                            style={styles.setRankButton}
                            onPress={() =>
                              setActiveRankPicker(
                                activeRankPicker === option ? null : option
                              )
                            }
                          >
                            <Image
                              source={Images.Rank}
                              style={styles.rankIcon}
                              resizeMode="contain"
                            />
                            <Text style={styles.setRankText}>
                              {answerRanks[1] === option
                                ? "Rank 1"
                                : answerRanks[2] === option
                                  ? "Rank 2"
                                  : answerRanks[3] === option
                                    ? "Rank 3"
                                    : "Set Rank"}
                            </Text>
                          </TouchableOpacity>

                          <RankDropdown
                            visible={activeRankPicker === option}
                            options={rankOptions}
                            onSelect={(rank) =>
                              handleRankSelect(option, rank.id)
                            }
                          />
                        </>
                      )}
                  </View>
                ))
              ) : (
                <Text style={{ textAlign: "center", color: Colors.SUBTEXT }}>
                  No options available
                </Text>
              )}
            </View>


            {pool.poolStatus === "completed" ?

              <View>
                <Text>
                  Your Prediction : {selectedAnswer}
                </Text>
                <Text>
                  {pool.result?.userResult === "won" ? "Correct!" : "Wrong!"}
                </Text>
              </View>
              : (
                <>
                  <View style={styles.predictionResultBox}>
                    <Text style={styles.predictionResultText}>
                      How to participate: Select your predictions. For Podium pools,
                      participants can set ranks (1st, 2nd, 3rd) for different questions
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.logoutButtonContainer}
                    disabled={
                      !!pool.result ||
                      (pool.rewardSystem === "Points Awards" && !correctAnswer) ||
                      (pool.rewardSystem === "Podium" && !isPodiumReady)
                    }
                    onPress={() => {
                      if (pool.rewardSystem === "Points Awards" && !correctAnswer) {
                        Alert.alert("Please mark a correct answer first");
                        return;
                      }

                      if (pool.rewardSystem === "Podium" && !isPodiumReady) {
                        Alert.alert("Please assign Rank 1, Rank 2, and Rank 3");
                        return;
                      }

                      // optional: prevent reopen if already declared
                      if (pool.result) {
                        Alert.alert("Result already declared");
                        return;
                      }
                      setShowConfirmModal(true);
                    }}
                  >
                    {pool.rewardSystem === "Podium" && (
                      <LinearGradient
                        colors={Colors.GRADIENT}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.logoutButton,
                          (pool.result || correctAnswer) && { opacity: 0.5 },
                        ]}
                      >
                        <Text style={styles.suggestButtonText}>
                          Declare Result
                        </Text>
                      </LinearGradient>
                    )}
                  </TouchableOpacity>

                  <Text style={[styles.pointsRequired, { fontFamily: 'Inter-SemiBold' }]}>
                    Your Bet: {selectedAnswer || 'None'}
                  </Text>
                  <Text style={styles.pointsRequired}>Points required : {pool.betAmount} pts</Text>
                  <Text style={styles.maxWin}>Maximum Win : {pool.maxWin} pts</Text>
                  {pool.poolStatus == "active" &&
                    <TouchableOpacity
                      style={styles.logoutButtonContainer}
                      onPress={handlePrediction}
                    >
                      <LinearGradient
                        colors={Colors.GRADIENT}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoutButton}
                      >
                        <Text style={styles.suggestButtonText}>
                          Confirm Prediction
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  }
                  {pool.poolStatus == "active" && (<>
                    <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", textAlign: "center" }}>OR</Text>
                    <TouchableOpacity
                      style={[styles.logoutButtonContainer, { marginBottom: 10 }]}
                      onPress={handleSuggestCustomOptions}
                    >
                      <LinearGradient
                        colors={Colors.GRADIENT}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoutButton}
                      >
                        <Text style={styles.suggestButtonText}>
                          Suggest Custom Options
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>)}
                </>
              )}

          </View>
        </View>
        {pool.poolStatus === "completed" &&
          <>
            <View style={styles.closePoolWarning}>
              <Image source={Images.Lock} style={styles.icon} resizeMode='contain' />
              <Text style={styles.rewardLabel}>Pool is now closed. No more Predictions can be submitted or modified</Text>
            </View>
            <View style={[styles.section, pool.createdBy?.id == userData?.user?._id && pool.poolStatus === "completed" ? { marginBottom: 40 } : { marginBottom: 100 }]}>
              <View style={styles.sectionHeader}>
                <Image source={Images.Trophy} style={styles.icon} resizeMode="contain" />
                <Text style={styles.sectionTitle}>Results & Winners</Text>
              </View>
              {pool.result?.userResult === "won" ? (
                <View style={styles.resultSection}>
                  <Image source={Images.Party} style={{ width: 40, height: 40 }} resizeMode='contain' />
                  <Text style={styles.resultText}>Congratulations ! You {pool.result?.userResult} !</Text>
                  <Text style={styles.resultPoints}>+{pool.result?.userPointsEarned} Pts Won</Text>
                  <Text style={styles.resultPointsText}>Your points have been added to your account</Text>
                  <Text style={styles.resultDistributedText}>Total pot distributed : {pool.totalPot} points</Text>
                  <Text style={styles.resultProfileText}>Winners will see their points reflected in their profile</Text>
                </View>
              ) :
                <View style={[styles.reopenSection, { borderColor: "#C80202", backgroundColor: "#FDE3E4", }]}>
                  <Text style={[styles.resultText, { fontFamily: "Inter-SemiBold", fontWeight: "700" }]}>Better Luck next time!</Text>
                  <Text style={styles.pill}>No Winnings</Text>
                  <Text style={[styles.resultPoints]}>You lost your {pool.betAmount} points stake.</Text>
                </View>
              }
            </View>
            {pool.createdBy?.id == userData?.user?._id && pool.poolStatus === "completed" && (
              <View style={[styles.reopenSection, { marginBottom: 100 }]}>
                <Text style={styles.sectionTitle}>Pool Management</Text>
                <Text style={styles.reopenDescription}>This pool is currently closed .You can reopen it to allow new predictions and reset al current rankings</Text>
                <Text onPress={handlePoolReopen} style={styles.reopenButtonText}>Reopen Pool</Text>
              </View>
            )}
          </>}


      </ScrollView>
      <ConfirmModal
        visible={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingCorrectOption(null);
        }}
        onConfirm={() => {
          // 🎯 POINTS AWARDS
          if (pool.rewardSystem === "Points Awards") {
            if (!pendingCorrectOption) {
              Alert.alert("Please mark a correct answer first");
              return;
            }

            setCorrectAnswer(pendingCorrectOption);
            handleDeclareResult(pendingCorrectOption);
            setPendingCorrectOption(null);
          }

          // 🏆 PODIUM
          if (pool.rewardSystem === "Podium") {
            if (!isPodiumReady) {
              Alert.alert("Please assign Rank 1, Rank 2, and Rank 3");
              return;
            }

            // 👉 send ranks instead of correct answer
            handleDeclareResult({
              rank1: answerRanks[1],
              rank2: answerRanks[2],
              rank3: answerRanks[3],
            });
          }

          setShowConfirmModal(false);
        }}

      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoutButtonContainer: {
    alignItems: 'center',
  },

  logoutButton: {
    paddingVertical: 12,    // ✅ Controls width (adjust as needed)
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: "90%"
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GREY,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },
  headerAvatars: {
    flexDirection: 'row',
    gap: -8,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.GREY,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  poolHeader: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  poolTitleContainer: {
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.GREY,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },
  poolTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.TEXT,
  },
  poolDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
  },
  infoBox: {
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.GREY,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    justifyContent: "space-between"
  },
  infoTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
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
  icon: {
    height: 20,
    width: 20
  },
  infoQuestion: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
    marginBottom: 10
  },
  innerContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 5
  },
  pointsText: {
    fontSize: 14,
    color: Colors.TEXT,
    fontFamily: 'Inter-Medium',
  },
  noParticipants: {
    fontSize: 14,
    color: Colors.SUBTEXT,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
  },
  participantsList: {
    gap: 12,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  participantAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.GREY,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
    marginBottom: 2,
  },
  participantDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.GREY,
    padding: 12,
    borderRadius: 10,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.WHITE,
  },
  floatingRank: {
    position: "absolute",
    top: -10,
    right: -12
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.TEXT,
    marginBottom: 2,
  },
  leaderboardDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
  },
  rewardBox: {
    backgroundColor: "#CCF3EE",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderColor: "#01C2A8",
    borderWidth: 1
  },
  closePoolWarning: {
    backgroundColor: "#CCF3EE",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderColor: "#01C2A8",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },
  rewardLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium ',
    color: Colors.TEXT,
    maxWidth: "90%"
  },
  rewardValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
  },
  rewardTotal: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
  },
  predictionContainer: {
    gap: 12,
  },
  predictionQuestionContainer: {
    backgroundColor: Colors.GREY,
    padding: 15,
    borderRadius: 10
  },
  predictionQuestion: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
  },
  predictionQuestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
  },
  predictionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    marginTop: 4,
  },
  answerOptions: {
    gap: 10,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
    overflow: "visible"
  },
  answerOptionSelected: {
    borderColor: Colors.DARKGREY,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    alignItems: "center"
  },
  answerRadio: {
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.TEXT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerRadioSelected: {
    borderColor: Colors.DARKGREY,
  },
  answerRadioDot: {
    width: 20,
    height: 20,
    borderRadius: 26,
    backgroundColor: Colors.DARKGREY,
    marginTop: 0.2,
    marginLeft: 0.33
  },
  answerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
    flex: 1,
  },
  YourPickTag: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  YourPickTagText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: Colors.WHITE,
  },
  predictionResultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#CCF3EE',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderColor: "#01C2A8",
    borderWidth: 1
  },
  predictionResultText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
  },
  pointsRequired: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.DARKGREY,
    marginTop: 4,
  },
  maxWin: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.DARKGREY,
  },
  suggestButton: {
    backgroundColor: Colors.TEXT,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  suggestButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.WHITE,
  },
  poolClosedWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(1, 194, 168, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  poolClosedWarningText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.CYAN,
    flex: 1,
  },
  setRankButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.GREY,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  setRankText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },
  rankDropdown: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 8,
    paddingVertical: 6,
  },
  rankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  rankIcon: {
    width: 20,
    height: 20,
  },

  rankText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },
  dropdown: {
    position: 'absolute',
    right: 12,
    top: 50,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GREY,
    zIndex: 9999,            // 🔥 floats above everything
    elevation: 20,           // Android
    paddingVertical: 6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
  },
  resultSection: {
    alignItems: "center",
    paddingVertical: 10
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
    fontStyle: "italic",
    marginVertical: 5
  },
  resultPoints: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    marginBottom: 5
  },
  resultPointsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
    marginBottom: 15
  },
  resultDistributedText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
  },
  resultProfileText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
  },
  reopenSection: {
    padding: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#FF6A00",
    borderRadius: 8,
    backgroundColor: "#FFEDE0"
  },
  reopenButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.WHITE,
    backgroundColor: "#FF6A00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  reopenDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
    marginTop: 5,
    marginBottom: 15
  },
  pill: {
    alignSelf: "flex-start",        // ✅ pill width = text width
    backgroundColor: "#C80202",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    fontSize: 12,
    fontFamily: "Inter-Medium",
    marginVertical: 4,
  },

});