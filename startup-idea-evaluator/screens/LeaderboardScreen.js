import React, { useEffect, useState } from 'react';
import {
  View, FlatList, StyleSheet, Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, useTheme } from 'react-native-paper';

import { STORAGE_KEYS } from '../utils/storageKeys';

const badges = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
  const [topIdeas, setTopIdeas] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    loadTopIdeas();
  }, []);

  const loadTopIdeas = async () => {
    try {
      const ideasJson = await AsyncStorage.getItem(STORAGE_KEYS.IDEAS);
      const ideas = ideasJson ? JSON.parse(ideasJson) : [];
      const sortedByVotes = [...ideas].sort((a, b) => b.votes - a.votes);
      setTopIdeas(sortedByVotes.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item, index }) => {
    const badge = badges[index] || '';
    return (
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface },
          index === 0 ? styles.firstCard : null,
        ]}
        elevation={4}
      >
        <Card.Content>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>{item.startupName}</Text>
          <Text style={[styles.tagline, { color: theme.colors.text }]}>{item.tagline}</Text>
          <Text style={[styles.stats, { color: theme.colors.text }]}>
            Rating: {item.rating} | Votes: {item.votes}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.primary }]}>
        🏆 Leaderboard - Top 5 Startup Ideas
      </Text>
      {topIdeas.length === 0 ? (
        <Text style={[styles.noData, { color: theme.colors.placeholder }]}>
          No ideas submitted yet.
        </Text>
      ) : (
        <FlatList
          data={topIdeas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  noData: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  card: {
    marginVertical: 8,
    borderRadius: 12,
    paddingVertical: 8,
  },
  firstCard: { backgroundColor: '#e6ffe6' },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 4,
  },
  badgeText: { fontSize: 26 },
  title: { fontWeight: 'bold', fontSize: 18 },
  tagline: { fontStyle: 'italic', marginBottom: 6 },
  stats: { marginTop: 8, fontWeight: '600' },
});
