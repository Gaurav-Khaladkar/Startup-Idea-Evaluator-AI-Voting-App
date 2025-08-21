import React, { useEffect, useState } from 'react';
import {
  View, FlatList, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Card, IconButton, Paragraph, Menu, useTheme, Button,
} from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { STORAGE_KEYS } from '../utils/storageKeys';

export default function IdeaListingScreen({ navigation, showToast }) {
  const [ideas, setIdeas] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  const [menuVisible, setMenuVisible] = useState(false);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isDark = theme.dark;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadIdeas();
      loadUserVotes();
    });
    return unsubscribe;
  }, [navigation]);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.IDEAS);
      const allIdeas = data ? JSON.parse(data) : [];
      sortAndSetIdeas(allIdeas, sortBy);
    } catch {
      Alert.alert('Error', 'Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  const loadUserVotes = async () => {
    try {
      const votesJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_VOTES);
      const votes = votesJson ? JSON.parse(votesJson) : [];
      setUserVotes(votes);
    } catch {}
  };

  const sortAndSetIdeas = (ideasToSort, key) => {
    const sorted = [...ideasToSort].sort((a, b) =>
      key === 'rating' ? b.rating - a.rating : b.votes - a.votes
    );
    setIdeas(sorted);
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUpvote = async (id) => {
    if (userVotes.includes(id)) {
      showToast({
        type: 'info',
        text1: 'Already voted',
        text2: 'You have already voted for this idea.',
      });
      return;
    }

    const updatedIdeas = ideas.map((idea) =>
      idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
    );

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(updatedIdeas));
      setIdeas(updatedIdeas);

      const newUserVotes = [...userVotes, id];
      await AsyncStorage.setItem(STORAGE_KEYS.USER_VOTES, JSON.stringify(newUserVotes));
      setUserVotes(newUserVotes);

      showToast({
        type: 'success',
        text1: 'Vote recorded!',
        text2: 'Thank you for your vote.',
      });
    } catch {
      Alert.alert('Error', 'Failed to save vote');
    }
  };

  const shareIdea = async (idea) => {
    try {
      await Share.share({
        message: `Startup Idea: ${idea.startupName}\nTagline: ${idea.tagline}\nDescription: ${idea.description}\nRating: ${idea.rating}\nVotes: ${idea.votes}`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const copyIdeaToClipboard = (idea) => {
    const text = `Startup Idea: ${idea.startupName}\nTagline: ${idea.tagline}\nDescription: ${idea.description}\nRating: ${idea.rating}\nVotes: ${idea.votes}`;
    Clipboard.setString(text);
    showToast({ type: 'success', text1: 'Copied to clipboard!' });
  };

  const renderRightActions = (progress, dragX, item) => (
    <Button
      mode="contained"
      onPress={() => handleUpvote(item.id)}
      disabled={userVotes.includes(item.id)}
      style={{ marginVertical: 10, marginRight: 10, minWidth: 80 }}
      compact
    >
      {userVotes.includes(item.id) ? 'Voted' : 'Upvote'}
    </Button>
  );

  const renderItem = ({ item }) => {
    const isExpanded = expandedIds.includes(item.id);
    const userHasVoted = userVotes.includes(item.id);

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <Card
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#23272f' : theme.colors.surface,
              borderColor: isDark ? '#363a42' : '#e0e0e0',
              borderWidth: 1,
            },
          ]}
          elevation={4}
        >
          <Card.Content>
            <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.7}>
              <Text style={[styles.title, { color: isDark ? '#fff' : theme.colors.text }]}>
                {item.startupName}
              </Text>
              <Text style={[styles.tagline, { color: isDark ? '#bbb' : theme.colors.text }]}>
                {item.tagline}
              </Text>
              <Text
                style={[styles.ratingVotes, { color: isDark ? '#bbb' : theme.colors.text }]}
              >
                Rating: {item.rating} | Votes: {item.votes}
              </Text>
              {isExpanded && (
                <Paragraph
                  style={[styles.description, { color: isDark ? '#eee' : theme.colors.text }]}
                >
                  {item.description}
                </Paragraph>
              )}
              <Text style={[styles.readMore, { color: theme.colors.primary }]}>
                {isExpanded ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
            <View style={styles.iconButtonRow}>
              <IconButton
                icon="thumb-up-outline"
                size={24}
                onPress={() => handleUpvote(item.id)}
                disabled={userHasVoted}
                color={isDark ? '#8ab4f8' : theme.colors.primary}
                accessibilityLabel={userHasVoted ? 'Already voted' : 'Upvote this idea'}
              />
              <IconButton
                icon="share-outline"
                size={24}
                onPress={() => shareIdea(item)}
                color={isDark ? '#8ab4f8' : theme.colors.primary}
                accessibilityLabel="Share this idea"
              />
              <IconButton
                icon="content-copy"
                size={24}
                onPress={() => copyIdeaToClipboard(item)}
                color={isDark ? '#8ab4f8' : theme.colors.primary}
                accessibilityLabel="Copy idea to clipboard"
              />
            </View>
          </Card.Content>
        </Card>
      </Swipeable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.sortContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.sortButton}
            >
              Sort by: {sortBy === 'rating' ? 'Rating' : 'Votes'}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setSortBy('rating');
              sortAndSetIdeas(ideas, 'rating');
              setMenuVisible(false);
            }}
            title="Rating"
          />
          <Menu.Item
            onPress={() => {
              setSortBy('votes');
              sortAndSetIdeas(ideas, 'votes');
              setMenuVisible(false);
            }}
            title="Votes"
          />
        </Menu>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          style={{ marginTop: 40 }}
          color={theme.colors.primary}
        />
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={ideas.length === 0 ? styles.emptyContainer : null}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No ideas submitted yet.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: {
    marginVertical: 8,
    borderRadius: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  tagline: {
    fontStyle: 'italic',
    marginBottom: 6,
  },
  ratingVotes: {
    fontWeight: '600',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  readMore: {
    marginTop: 6,
    fontWeight: 'bold',
  },
  iconButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  sortContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 },
  sortButton: { minWidth: 140 },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 40 },
  emptyText: { textAlign: 'center', fontSize: 16 },
});
