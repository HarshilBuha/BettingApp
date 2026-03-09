import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors } from '../../assets/fonts/fonts';
import { Images } from '../../assets/Images';

import Header from '../components/Header';
import PoolCard from '../components/PoolCard';
import PoolFilter from '../components/PoolFilter';
import { useGetPools } from '../api/PoolApis';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useGetProfile } from '../api/ProfileApis';

export default function PoolScreen({ navigation }) {
  const route = useRoute();
  const { data: userData } = useGetProfile();
  const currentUserId = userData?.user?._id;

  const initialStatus = route.params?.status || { id: 1, name: 'All Pools' };
  const initialRole = route.params?.role || { id: 1, name: 'All Roles' };
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [role, setRole] = useState(initialRole);
  const [category, setCategory] = useState({ id: 1, name: 'All Categories' });
  const [users, setUsers] = useState({ id: 1, name: 'All Users' });
  const { data: pools = [] } = useGetPools();
  console.log(pools);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setSearchText('');
      setCategory({ id: 1, name: 'All Categories' });
      setUsers({ id: 1, name: 'All Users' });

      setStatus(route.params?.status || { id: 1, name: 'All Pools' });
      setRole(route.params?.role || { id: 1, name: 'All Roles' });
    }, [route.params])
  );

  const filteredPools = pools.filter(pool => {
    if (
      searchText &&
      !(
        pool.title.toLowerCase().includes(searchText.toLowerCase()) ||
        pool.description.toLowerCase().includes(searchText.toLowerCase())
      )
    ) {
      return false;
    }

    if (status && status.name !== 'All Pools') {
      const poolStatus = pool.poolStatus || '';
      if (poolStatus.toLowerCase() !== status.name.toLowerCase()) {
        return false;
      }
    }

    if (role && role.name !== 'All Roles') {
      if (role.name === 'Creator') {
        if (pool.createdBy?.id !== currentUserId && pool.createdBy?._id !== currentUserId) {
          return false;
        }
      }

      if (role.name === 'Player') {
        const currentUserName = userData?.user?.name;

        const isCreator =
          pool.createdBy?.name === currentUserName;

        const isParticipant = pool.participants?.some(
          p => p.playerName === currentUserName
        );

        // must be participant
        if (!isParticipant) return false;

        // must NOT be creator
        if (isCreator) return false;
      }
    }

    // 📂 Category
    if (category && category.name !== 'All Categories') {
      const poolCategory = typeof pool.category === 'string'
        ? pool.category
        : pool.category?.name || pool.category?.title || '';

      if (poolCategory.toLowerCase() !== category.name.toLowerCase()) {
        return false;
      }
    }

    // 👥 Users
    if (users && users.name !== 'All Users') {
      const createdByName = typeof pool.createdBy === 'string'
        ? pool.createdBy
        : pool.createdBy?.name || pool.createdBy?.username || '';

      if (!createdByName.toLowerCase().includes(users.name.toLowerCase())) {
        return false;
      }
    }

    return true;
  });


  const resetFilters = () => {
    setSearchText('');
    setStatus({ id: 1, name: 'All Pools' });
    setRole({ id: 1, name: 'All Roles' });
    setCategory({ id: 1, name: 'All Categories' });
    setUsers({ id: 1, name: 'All Users' });
    setShowFilter(false)
  };


  const handleCreatePool = () => {
    navigation.navigate('CreatePool');
  };

  const handleViewPool = (pool) => {
    navigation.navigate('PoolDetail', { pool }); 
};

  const handleCloseFilter = () => {
    setShowFilter(false);
    setIsDropdownOpen(false);
  };

  const getEmptyMessage = () => {
    // 1. Search Logic
    if (searchText) {
      return {
        title: "No matches found",
        subtitle: `We couldn't find any pools matching "${searchText}".`,
        icon: "search-outline"
      };
    }

    // 2. Status Logic (Active/Completed)
    if (status && status.name !== 'All Pools') {
      return {
        title: `No ${status.name} Pools`,
        subtitle: `There are currently no pools with the status "${status.name}".`,
        icon: "file-tray-outline"
      };
    }

    // 3. Role Logic (Creator/Player)
    if (role && role.name !== 'All Roles') {
      return {
        title: "No Pools Found",
        subtitle: `You haven't created any pools as a ${role.name} yet.`,
        icon: "person-outline"
      };
    }
    if (category && category.name !== 'All Categories') {
    return {
      title: "No Pools in Category",
      subtitle: `There are currently no pools under the "${category.name}" category.`,
      icon: "grid-outline"
    };
  }


    // 4. Default state (Actually empty database)
    return {
      title: "No Pools to Show",
      subtitle: "There are currently no pools available in the pool.",
      icon: "cloud-offline-outline"
    };
  };

  const emptyContent = getEmptyMessage();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={Colors.WHITE} />
      <Header showBackButton />

      <View style={styles.headerRow}>
        <Text style={styles.poolCount}>
          Showing {filteredPools.length} of {pools.length} Pools

        </Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(!showFilter)}
        >
          <Image
            source={Images.Filter}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {showFilter && (
        <Pressable
          style={styles.overlay}
          onPress={handleCloseFilter}
          pointerEvents={isDropdownOpen ? 'none' : 'auto'}
        />
      )}
      <FlatList
        data={filteredPools}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PoolCard pool={item} onViewPool={handleViewPool} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name={emptyContent.icon} size={60} color={Colors.GRAY} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>{emptyContent.title}</Text>
            <Text style={styles.subtitle}>{emptyContent.subtitle}</Text>
          </View>
        }
        ListHeaderComponent={
          <>
            {showFilter && (
              <PoolFilter
                searchText={searchText}
                onSearchChange={setSearchText}
                status={status}
                setStatus={setStatus}
                role={role}
                setRole={setRole}
                category={category}
                setCategory={setCategory}
                users={users}
                setUsers={setUsers}
                resetFilter={resetFilters}
                onDropdownOpen={setIsDropdownOpen}
              />
            )}
          </>
        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDropdownOpen}
      />


      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreatePool}
      >
        <Icon name="add" size={28} color={Colors.WHITE} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
  },
  filterWrapper: {
    maxHeight: "80%",
    overflow: 'hidden',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  poolCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.TEXT,
  },
  filterButton: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  createButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 28,
    backgroundColor: Colors.CYAN,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, 
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.TEXT,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.DARKGREY,
    textAlign: 'center',
    marginTop: 8,
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.SUBTEXT, 
    borderRadius: 8,
  },
  resetText: {
    color: Colors.CYAN,
    fontFamily: 'Inter-Medium',
  },
});
