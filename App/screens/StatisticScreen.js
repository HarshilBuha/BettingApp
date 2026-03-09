import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/fonts/fonts';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { Images } from '../../assets/Images';
import LinearGradient from 'react-native-linear-gradient';

export default function StatisticScreen({ route }) {
  const { results } = route.params || {};
  console.log(results);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {/* <Loader visible={isLoading} /> */}

      {/* BACKGROUND */}
      <View style={styles.background}>
        <View style={styles.ellipseBig} />
        <View style={styles.ellipseSmall} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Header type='out' label='Statistics' showBackButton={true} showNotificationIcon={false} />

        {/* CARD */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Image source={Images.Trophy} style={{ height: 20, width: 20 }} />
                <Text style={styles.sectionTitle}>Head to Head Statistics</Text>
              </View>
            </View>

            {results.length === 0 && (
              <Text style={{ color: Colors.SUBTEXT }}>
                No results found
              </Text>
            )}

            {results.map((item,index) => (
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
                    <Text style={styles.h2hBadgeText}>{item.player1TotalPoints-item.player2TotalPoints} Points</Text>
                  </LinearGradient>
                  <Text style={styles.h2hDiff}>Net Difference</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 10
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  ellipseBig: {
    position: 'absolute',
    width: 420,
    height: 420,
    backgroundColor: 'rgba(135,206,235,0.45)',
    borderRadius: 210,
    top: -160,
    right: -240,
  },
  ellipseSmall: {
    position: 'absolute',
    width: 550,
    height: 550,
    backgroundColor: 'rgba(135,206,235,0.25)',
    borderRadius: 250,
    top: -320,
    right: -140,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  scroll: {
    paddingBottom: 10,
    paddingHorizontal: 16
  },
  section: {
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
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


});
