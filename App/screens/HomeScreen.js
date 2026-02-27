import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../assets/fonts/fonts';
import { Images } from '../../assets/Images';

import Header from '../components/Header';
import Loader from '../components/Loader';
import PoolCard from '../components/PoolCard';

import { useGetPools, useGetInvitedPools } from '../api/PoolApis';
import { useGetProfile } from '../api/ProfileApis';

export default function HomeScreen() {
  const navigation = useNavigation();

  const { data: userData = {}, isLoading: isProfileLoading } = useGetProfile();
  const { data: pools = [], isLoading: isPoolsLoading } = useGetPools();
  const {
    data: invitedPools = [],
    isLoading: isInvitesLoading,
    refetch: refetchInvitedPools,
  } = useGetInvitedPools();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchInvitedPools();
    setRefreshing(false);
  };
  const loading = isProfileLoading || isPoolsLoading || isInvitesLoading;

  const handleCreatePool = () => {
    navigation.navigate('PoolStack', { screen: 'CreatePool' });
  };

  const handleViewPools = () => {
    navigation.navigate('PoolStack', { screen: 'PoolMain' });
  };

  const currentUserName = userData?.user?.name;

  const joinedPoolsCount = pools.filter(pool => {
    const isCreator =
      pool.createdBy?.name === currentUserName;

    const isParticipant = pool.participants?.some(
      p => p.playerName === currentUserName
    );

    return isParticipant && !isCreator;
  }).length;

  const poolStats = [
    {
      id: '1',
      label: 'Pool Points',
      value: userData?.user?.totalPoints ?? 0,
      icon: Images.Trophy,
      navigate: 'Summary',
    },
    {
      id: '2',
      label: 'Pools Joined',
      value: joinedPoolsCount,
      icon: Images.Persons,
      navigate: 'PoolMain',
      initialFilters: { role: { id: 3, name: 'Player' } },
    },
    {
      id: '3',
      label: 'Active Pools',
      icon: Images.Bullseye,
      navigate: 'PoolMain',
      initialFilters: { status: { id: 2, name: 'Active' } },
    },
    {
      id: '4',
      label: 'Your Pools',
      icon: Images.YourPool,
      navigate: 'PoolMain',
      initialFilters: { role: { id: 2, name: 'Creator' } },
    },
  ];
  const renderStatCard = ({ item }) => {
    const handlePress = () => {
      if (!item.navigate) return;
      if (item.navigate === 'Summary') {
        navigation.navigate('Summary', {
          results: userData?.results || [],
        });
        return;
      }
      navigation.navigate('PoolStack', {
        screen: item.navigate,
        params: item.initialFilters || {},
      });
    };

    return (
      <TouchableOpacity
        style={styles.statCard}
        activeOpacity={0.7}
        onPress={item.navigate ? handlePress : undefined}
      >
        <View style={styles.statIconContainer}>
          <Image source={item.icon} resizeMode='contain' style={{ height: 30, width: 30 }} />
        </View>
        {item.value !== undefined && (
          <Text style={styles.statValue}>{item.value}</Text>
        )}
        <Text style={styles.statLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
      <Header showBackButton={false} />
      <Loader visible={loading} />

      <FlatList
        data={invitedPools}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
            <PoolCard item={item} pool={item.pool} mode="invited" />
          </View>
        )}
        ListHeaderComponent={
          <>
            {/* ACTION BUTTONS */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity onPress={handleCreatePool} style={styles.buttons}>
                <Text style={styles.buttonstxt}>Create New Pool</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleViewPools} style={styles.buttons}>
                <Text style={styles.buttonstxt}>View My Pools</Text>
              </TouchableOpacity>
            </View>

            {/* STATS GRID */}
            <View style={styles.statsContainer}>
              <FlatList
                data={poolStats}
                renderItem={renderStatCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.statRow}
              />
            </View>

            {/* INVITED POOLS TITLE */}
            {invitedPools.length > 0 && (
              <Text style={styles.sectionTitle}>Invited Pools</Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No pending pool invitations
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
  },

  listContent: {
    paddingBottom: 80,
  },

  /* ACTION BUTTONS */
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
    marginBottom: 24,
  },

  buttons: {
    flex: 1,
    backgroundColor: Colors.TEXT,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonstxt: {
    color: Colors.WHITE,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  /* STATS */
  statsContainer: {
    paddingHorizontal: 16,
    backgroundColor: Colors.GREY,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },

  statRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GREY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 108,
  },

  statIconContainer: {
    marginBottom: 8,
  },

  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.SUBTEXT,
  },

  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.TEXT,
    textAlign: 'center',
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.TEXT,
    marginHorizontal: 16,
    marginBottom: 10,
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },

  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.SUBTEXT,
  },
});
