import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModalComponent from "../components/ModalComponent"
import { Colors } from '../../assets/fonts/fonts';
import { Images } from '../../assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dropdown from '../components/Dropdown';
import { useGetCategories, useGetPools, useGetUsers } from '../api/PoolApis';
import { useGetPoolResults, useGetPoolStatistics, useGetProfile } from '../api/ProfileApis'
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useQueryClient } from "@tanstack/react-query";

export default function ProfileScreen({ }) {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { data: pools = [] } = useGetPools();

  const handlePress = (resultId) => {
    const pool = pools.find(p => p.id === resultId);
    if (!pool) return;

    navigation.navigate('PoolDetail', { pool });
  };
  const handleDropdownToggle = (dropdownName) => {
    const newState = openDropdown === dropdownName ? null : dropdownName;
    setOpenDropdown(newState);
  };

  const { data: userData = [], isLoading: isProfileLoading } = useGetProfile()
  const { data: userOptions = [], isLoading: isUsersLoading } = useGetUsers()
  const { data: poolResults = [], isLoading: isResultsLoading } = useGetPoolResults()
  const poolOptions = poolResults.map(pool => ({
    id: pool.id || pool._id,
    name: pool.title,
    original: pool,
  }));

  const { data: category = [] } = useGetCategories();
  const categoryOptions = category.map(cat => ({
    id: cat._id,
    name: cat.name,
    icon: cat.icon,
  }));

  const { data: poolStatistics = [], isLoading: isStatsLoading } = useGetPoolStatistics()

  const filteredStats = poolStatistics.filter(item => {
    if (selectedUser) {
      const isUserInMatch =
        item.player1?.name === selectedUser.name ||
        item.player2?.name === selectedUser.name;
      if (!isUserInMatch) return false;
    }

    if (selectedPool && item.poolTitle !== selectedPool.name) return false;

    if (selectedCategory && item.category !== selectedCategory.name) return false;

    return true;
  });

  const isLoading = isProfileLoading || isUsersLoading || isResultsLoading || isStatsLoading || uploading

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8, //  Reduce quality to compress image
      },
      async (response) => {
        if (response.didCancel) {
          console.log("Image pick cancelled");
          return;
        }
        if (response.errorCode) {
          Alert.alert("Error", response.errorMessage || "Failed to pick image");
          return;
        }

        const selectedImage = response.assets?.[0];
        if (!selectedImage) {
          Alert.alert("Error", "No image selected");
          return;
        }

        setImage(selectedImage);

        try {
          await uploadImage(selectedImage);
        } catch (error) {
          console.error("Upload error:", error);
        }
      }
    );
  };

  const uploadImage = async (img) => {
    if (!img || !img.uri) {
      Alert.alert("Error", "No image URI found");
      return;
    }

    try {
      setUploading(true);

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.");
        return;
      }

      const formData = new FormData();

      formData.append("profile", {
        uri: Platform.OS === 'ios' ? img.uri.replace('file://', '') : img.uri,
        name: img.fileName || "photo.jpg",
        type: img.type || "image/jpeg",
      });

      const response = await fetch(
        "https://porralia.com/api/auth/updateprofile",
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `HTTP ${response.status}`;

        try {
          if (contentType?.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          console.log("Could not parse error response:", e);
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      Alert.alert("Success", "Profile image updated successfully!");

      // Refetch profile automatically
      queryClient.invalidateQueries({ queryKey: ["profile"] });

    } catch (error) {
      console.error("Upload Error:", error.message);

      let userMessage = error.message;

      if (error.message.includes("Network")) {
        userMessage = "Network connection failed. Please check your internet and try again.";
      } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        userMessage = "Your session expired. Please login again.";
      } else if (error.message.includes("413")) {
        userMessage = "Image is too large. Please choose a smaller image.";
      }

      Alert.alert("Upload Failed", userMessage);
      setImage(null); 

    } finally {
      setUploading(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  };

  const [showModal, setShowModal] = useState(false);
  const modalType = "logout"
  const navigation = useNavigation()
  const { signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await signOut(token)
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  }

  const filteredResults = poolResults.filter(result => {

    if (selectedPool && result.title !== selectedPool.name) return false;

    if (selectedCategory && result.category !== selectedCategory.name) return false;

    return true;
  });

  const resetFilter = () => {
    setSelectedUser("");
    setSelectedPool("");
    setSelectedCategory("");
    setShowFilter(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.header} onPress={() => navigation.navigate("Setting")}>
          <Image source={Images.Setting} resizeMode='contain' style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        <Loader visible={isLoading} />

        {/* Profile */}
        <View style={styles.profileContainer}>
          {/* LEFT: Avatar with Badge */}
          <View style={styles.leftProfile}>
            <Pressable onPress={pickImage} disabled={uploading} style={styles.avatarWrapper}>
              {image?.uri || userData?.user?.profile ? (
                <Image
                  source={image?.uri ? { uri: image.uri } : { uri: userData.user.profile }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Icon name="person" size={40} color={Colors.SUBTEXT} />
                </View>
              )}

              {/* Upload Badge */}
              <View style={styles.addImage}>
                <Icon name="camera" size={12} color={Colors.WHITE} />
              </View>
            </Pressable>
          </View>

          {/* RIGHT: User Information */}
          <View style={styles.rightProfile}>
            <Text style={styles.name} numberOfLines={1}>
              {userData?.user?.name || "User Name"}
            </Text>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Icon name="mail" size={14} color={Colors.CYAN} />
              <Text style={styles.detailText} numberOfLines={1}>
                {userData?.user?.email}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Icon name="call" size={14} color={Colors.CYAN} />
              <Text style={styles.detailText}>
                {userData?.user?.phone || "No phone added"}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.joinedBadge}>
              <Text style={styles.joinedText}>
                Member since {formatDate(userData?.user?.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Total Winnings */}
        <View style={styles.winningWrapper}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Icon name="trophy" size={20} color="#FFD700" />
              </View>
              <Text style={styles.statLabel}>Total Winnings</Text>
              <Text style={styles.statValue}>{userData.bettingBag?.totalWinnings ?? '0'}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCard}>
              <View style={styles.statIconCircle}>
                <Icon name="wallet" size={20} color="#01C2A8" />
              </View>
              <Text style={styles.statLabel}>Bankroll</Text>
              <Text
                style={[styles.statValue, { width: '100%', flexShrink: 1 }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {userData?.bettingBag?.bankroll ?? '0'}
              </Text> </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.filterIcon}
          onPress={() => setShowFilter(!showFilter)}
          disabled={uploading}
        >
          <Image source={Images.Filter} style={{ height: 40, width: 40, }} resizeMode='contain' />
        </TouchableOpacity>

        {/* Filter Panel */}
        {showFilter && (
          <View style={styles.filterPanel}>
            <Dropdown
              label="Filter by User"
              value={selectedUser}
              options={userOptions}
              onSelect={(item) => {
                setSelectedUser(item.name === 'All Users' ? null : item)
                setOpenDropdown(null)
              }}
              isOpen={openDropdown === 'selectedUser'}
              onToggle={() => handleDropdownToggle('selectedUser')}
            />

            <Dropdown
              label="Filter by Pool"
              value={selectedPool}
              options={poolOptions}
              onSelect={(item) => {
                setSelectedPool(item);
                setOpenDropdown(null);
              }}
              isOpen={openDropdown === 'selectedPool'}
              onToggle={() => handleDropdownToggle('selectedPool')}
            />

            <Dropdown
              label="Filter by Category"
              value={selectedCategory}
              options={categoryOptions}
              onSelect={(item) => {
                setSelectedCategory(item.name === 'All Categories' ? null : item);
                setOpenDropdown(null);
              }}
              isOpen={openDropdown === 'selectedCategory'}
              onToggle={() => handleDropdownToggle('selectedCategory')}
            />
            <TouchableOpacity style={styles.resetButton} onPress={resetFilter}>
              <Text style={styles.resetText}>Reset Filter</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pool Results */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Image source={Images.Trophy} style={{ height: 20, width: 20 }} />
              <Text style={styles.sectionTitle}>Pool Results</Text>
            </View>
            <TouchableOpacity style={{}} onPress={() => navigation.navigate("Results", { results: poolResults })}>
              <Text style={styles.sectionTitle}>View All</Text>
            </TouchableOpacity>
          </View>

          {filteredResults.length === 0 && (
            <Text style={{ color: Colors.SUBTEXT }}>
              No results found
            </Text>
          )}

          {filteredResults.map(result => {
            const isWon = result.resultInfo?.userResult === 'won';
            const hasRank = result.resultInfo?.rank !== null && result.resultInfo?.rank !== undefined;

            return (
              <TouchableOpacity
                key={result.id}
                activeOpacity={0.7}
                onPress={() => handlePress(result.id)}
                style={[
                  styles.resultCard,
                  isWon ? styles.win : styles.loss,
                  { shadowColor: isWon ? '#00796B' : '#C80202' }
                ]}
              >
                {/* Header Row: Title + Result Badge */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.resultTitle} numberOfLines={1}>{result.title}</Text>
                  <View style={[
                    styles.resultOutcomeBadge,
                    { backgroundColor: isWon ? '#01C2A8' : '#C80202' }
                  ]}>
                    <Text style={styles.outcomeText}>{isWon ? '🏆 WON' : '❌ LOST'}</Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Category + Date Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {result.categoryIcon ? (
                      <Image source={{ uri: result.categoryIcon }} style={{ width: 16, height: 16, borderRadius: 4 }} />
                    ) : null}
                    <Text style={styles.resultText}>{result.category}</Text>
                  </View>
                  <Text style={[styles.resultText, { fontSize: 11 }]}>
                    🗓 {new Date(result.declaredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </Text>
                </View>

                {/* Prediction vs Correct Answer */}
                <View style={styles.predictionRow}>
                  <View style={styles.predictionBox}>
                    <Text style={styles.predictionLabel}>Your Prediction</Text>
                    <Text style={[styles.predictionValue, { color: isWon ? '#00796B' : '#C80202' }]}>
                      {typeof result.prediction === 'object' ? JSON.stringify(result.prediction) : result.prediction}
                    </Text>
                  </View>
                  <View style={styles.vsCircle}>
                    <Text style={styles.vsText}>VS</Text>
                  </View>
                  <View style={styles.predictionBox}>
                    <Text style={styles.predictionLabel}>Correct Answer</Text>
                    <Text style={[styles.predictionValue, { color: '#00796B' }]}>
                      {typeof result.correctAnswer === 'object'
                        ? result.resultInfo?.rank
                          ? result.correctAnswer[`rank${result.resultInfo.rank}`] ?? '—'   
                          : Object.values(result.correctAnswer).join(', ')
                        : result.correctAnswer}
                    </Text>
                  </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsInfoRow}>
                  {/* Bet Amount */}
                  <View style={styles.statInfoBox}>
                    <Text style={styles.statInfoLabel}>Bet</Text>
                    <Text style={styles.statInfoValue}>🪙 {result.betAmount}</Text>
                  </View>

                  {/* Total Pot */}
                  <View style={styles.statInfoBox}>
                    <Text style={styles.statInfoLabel}>Total Pot</Text>
                    <Text style={styles.statInfoValue}>💰 {result.totalPot}</Text>
                  </View>

                  {/* Points */}
                  <View style={styles.statInfoBox}>
                    <Text style={styles.statInfoLabel}>{isWon ? `Earned (${result.resultInfo.potPercentage>0 && result.resultInfo.potPercentage}%)` : 'Lost'}</Text>
                    <Text style={[styles.statInfoValue, { color: isWon ? '#00796B' : '#C80202', fontFamily: 'Inter-Bold' }]}>
                      {isWon ? `+${result.resultInfo?.pointsEarned}` : `-${result.resultInfo?.pointsLost}`}
                    </Text>
                  </View>
                  {hasRank && result.resultInfo?.pointsEarned < result.betAmount && (
                    <View style={styles.statInfoBox}>
                      <Text style={styles.statInfoLabel}>Net</Text>

                      <Text
                        style={[
                          styles.statInfoValue,
                          {
                            color:
                              result.resultInfo?.pointsEarned - result.betAmount >= 0
                                ? '#00796B'
                                : '#C80202',
                            fontFamily: 'Inter-Bold',
                          },
                        ]}
                      >
                        {result.resultInfo?.pointsEarned - result.betAmount >= 0
                          ? `+${result.resultInfo?.pointsEarned - result.betAmount}`
                          : `${result.resultInfo?.pointsEarned - result.betAmount}`}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Rank Row — only if rank exists */}
                {hasRank && (
                  <View style={styles.rankRow}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>🥇 Rank #{result.resultInfo?.rank}</Text>
                    </View>
                    <Text style={styles.potPercentageText}>{result.resultInfo?.potPercentageText}</Text>
                  </View>
                )}

              </TouchableOpacity>
            );
          }).slice(0, 3)}
        </View>

        {/* Head to Head */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Image source={Images.Trophy} style={{ height: 20, width: 20 }} />
              <Text style={styles.sectionTitle}>Head to Head Statistics</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Statistics", { results: poolStatistics })}>
              <Text style={styles.sectionTitle}>View All</Text>
            </TouchableOpacity>
          </View>
          {filteredStats.length === 0 && (
            <Text style={{ color: Colors.SUBTEXT }}>
              No results found
            </Text>
          )}
          {filteredStats.slice(0, 3).map((item, index) => (
            <View style={styles.h2hCard} key={index}>
              <View>
                <Text style={styles.h2hTitle}>{item.player1?.name} vs {item.player2?.name}</Text>
                <Text style={styles.h2hSub}>{item.poolsPlayedTogether} Pool Together</Text>
              </View>
              <View style={styles.h2hBadge}>
                <LinearGradient
                  colors={Colors.GRADIENT}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.h2hBadge}
                >
                  <Text style={styles.h2hBadgeText}>{item.player1TotalPoints - item.player2TotalPoints} Points</Text>
                </LinearGradient>
                <Text style={styles.h2hDiff}>Net Difference</Text>
              </View>
            </View>
          )).slice(0, 3)}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButtonContainer} onPress={() => setShowModal(true)}>
          <LinearGradient
            colors={Colors.GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <ModalComponent
        visible={showModal}
        type={modalType}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
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
  header: {
    justifyContent: 'flex-end',
    marginTop: 30,
    alignItems: "flex-end",
  },
  scroll: {
    paddingBottom: 10,
    paddingHorizontal: 16
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  leftProfile: {
    marginRight: 18,
  },
  avatarWrapper: {
    position: 'relative',
    padding: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.GREY,
    borderWidth: 2,
    borderColor: Colors.GREY,
  },
  placeholderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImage: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.DARKGREY,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.WHITE,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  rightProfile: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Inter-Bold', 
    color: Colors.TEXT,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
    marginLeft: 8,
  },
  joinedBadge: {
    backgroundColor: Colors.GREY,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  joinedText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.GREY,
    marginVertical: 5,
  },
  winningWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: "center"
  },
  filterIcon: {
    alignItems: "flex-end",
    backgroundColor: Colors.WHITE,
    padding: 6,
    borderRadius: 6,
    marginRight: 20,
    marginTop: 10
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#3A3A3A',
    marginHorizontal: 16,
  },

  filterPanel: {
    backgroundColor: Colors.GREY,
    borderRadius: 14,
    padding: 16,
  },
  section: {
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    padding: 25,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.DARKGREY,
  },

  resultCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  resultOutcomeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  outcomeText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#00000015',
    marginVertical: 8,
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#00000008',
    borderRadius: 10,
    padding: 10,
  },
  predictionBox: {
    flex: 1,
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 10,
    color: Colors.SUBTEXT,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  predictionValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  vsCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00000015',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  vsText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: Colors.SUBTEXT,
  },
  statsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statInfoBox: {
    alignItems: 'center',
    flex: 1,
  },
  statInfoLabel: {
    fontSize: 10,
    color: Colors.SUBTEXT,
    fontFamily: 'Inter-Medium',
  },
  statInfoValue: {
    fontSize: 13,
    color: Colors.DARKGREY,
    fontFamily: 'Inter-SemiBold',
    marginTop: 2,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
    flexWrap: 'wrap',
  },
  rankBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rankText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#7A5C00',
  },
  netBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  netBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#7A5C00',
  },
  potPercentageText: {
    fontSize: 11,
    color: Colors.SUBTEXT,
    fontFamily: 'Inter-Medium',
    flexShrink: 1,
  },
  loss: {
    borderWidth: 1,
    borderColor: '#C80202',
    backgroundColor: '#F5E6E8',
  },
  win: {
    borderWidth: 1,
    borderColor: '#00796B',
    backgroundColor: '#CCF3EE',
  },
  resultTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.DARKGREY,
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
    marginTop: 2,
  },
  lossBadge: {
    backgroundColor: "#C80202",
    alignSelf: 'flex-start',
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 4,
    marginTop: 8,
  },
  winBadge: {
    backgroundColor: '#01C2A8',
    alignSelf: 'flex-start',
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 4,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 10,
    color: Colors.WHITE,
    fontFamily: 'Inter-Medium',
  },

  h2hCard: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  h2hTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.DARKGREY,
  },
  h2hSub: {
    fontSize: 14,
    color: Colors.SUBTEXT,
    marginTop: 2,
  },
  h2hBadge: {
    borderRadius: 26,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  h2hBadgeText: {
    fontSize: 10,
    color: Colors.WHITE,
    fontFamily: 'Inter-Medium',
  },
  h2hDiff: {
    fontSize: 10,
    color: Colors.SUBTEXT,
    fontFamily: 'Inter-Medium',
  },

  logoutButtonContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 80,
  },

  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.GREY,
  },
  resetButton: {
    backgroundColor: Colors.TEXT,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-end"
  },
  resetText: {
    color: Colors.GREY,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    padding: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-end',
  },
});