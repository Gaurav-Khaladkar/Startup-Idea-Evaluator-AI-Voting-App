import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIdeas } from '../context/IdeaContext';
import { getColors } from '../theme';
import { SortOption } from '../types/idea';

const rankBadges = ['🥇', '🥈', '🥉'];

export function LeaderboardScreen() {
  const { ideas, themeMode } = useIdeas();
  const [basis, setBasis] = useState<SortOption>('votes');
  const colors = getColors(themeMode);

  const topIdeas = useMemo(() => {
    const copy = [...ideas];
    copy.sort((a, b) => {
      if (basis === 'votes') {
        return b.votes - a.votes || b.aiRating - a.aiRating;
      }
      return b.aiRating - a.aiRating || b.votes - a.votes;
    });
    return copy.slice(0, 5);
  }, [basis, ideas]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>Top 5 Startup Ideas</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Ranked by {basis}. Tap the toggle to switch your leaderboard view.
      </Text>

      <View style={styles.segmentWrap}>
        <SegmentButton
          active={basis === 'votes'}
          colors={colors}
          label="Rank by Votes"
          onPress={() => setBasis('votes')}
        />
        <SegmentButton
          active={basis === 'rating'}
          colors={colors}
          label="Rank by Rating"
          onPress={() => setBasis('rating')}
        />
      </View>

      {topIdeas.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No ideas on the board yet.</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
            Submit ideas and vote to build your leaderboard.
          </Text>
        </View>
      ) : (
        topIdeas.map((idea, index) => {
          const gradient = getGradient(index, themeMode);
          return (
            <LinearGradient colors={gradient} key={idea.id} style={styles.rankCard}>
              <View style={styles.rankHeader}>
                <Text style={styles.badge}>{rankBadges[index] ?? `#${index + 1}`}</Text>
                <Text style={styles.rankText}>Rank {index + 1}</Text>
              </View>
              <Text style={styles.ideaName}>{idea.name}</Text>
              <Text style={styles.ideaTagline}>{idea.tagline}</Text>
              <View style={styles.metricsRow}>
                <Text style={styles.metric}>🤖 {idea.aiRating}/100</Text>
                <Text style={styles.metric}>👍 {idea.votes} votes</Text>
              </View>
            </LinearGradient>
          );
        })
      )}
    </ScrollView>
  );
}

interface SegmentButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: ReturnType<typeof getColors>;
}

function SegmentButton({ active, colors, label, onPress }: SegmentButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.segmentButton,
        {
          backgroundColor: active ? colors.primary : colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.segmentText, { color: active ? '#ffffff' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

function getGradient(rankIndex: number, themeMode: 'light' | 'dark'): [string, string] {
  if (rankIndex === 0) {
    return ['#f59e0b', '#f97316'];
  }
  if (rankIndex === 1) {
    return ['#64748b', '#475569'];
  }
  if (rankIndex === 2) {
    return ['#fb923c', '#ea580c'];
  }
  if (themeMode === 'dark') {
    return ['#1f2937', '#0f172a'];
  }
  return ['#0f766e', '#0e7490'];
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 22,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    padding: 18,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
  },
  ideaName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 6,
  },
  ideaTagline: {
    color: '#f8fafc',
    fontSize: 14,
    marginTop: 2,
    opacity: 0.95,
  },
  metric: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rankCard: {
    borderRadius: 16,
    marginTop: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.17,
    shadowRadius: 10,
  },
  rankHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  segmentButton: {
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  segmentWrap: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
