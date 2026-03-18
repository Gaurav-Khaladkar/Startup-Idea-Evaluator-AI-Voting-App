import * as Clipboard from 'expo-clipboard';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { useIdeas } from '../context/IdeaContext';
import { useToast } from '../context/ToastContext';
import { getColors } from '../theme';
import { SortOption, StartupIdea } from '../types/idea';

export function IdeaListScreen() {
  const { ideas, hasVoted, upvoteIdea, themeMode } = useIdeas();
  const { showToast } = useToast();
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const colors = getColors(themeMode);

  const sortedIdeas = useMemo(() => {
    const ideaCopy = [...ideas];
    ideaCopy.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.aiRating - a.aiRating || b.votes - a.votes;
      }
      return b.votes - a.votes || b.aiRating - a.aiRating;
    });
    return ideaCopy;
  }, [ideas, sortBy]);

  const toggleExpanded = (ideaId: string) => {
    setExpandedIds((current) =>
      current.includes(ideaId) ? current.filter((id) => id !== ideaId) : [...current, ideaId],
    );
  };

  const handleVote = (ideaId: string) => {
    const result = upvoteIdea(ideaId);
    showToast(result.message, result.success ? 'success' : 'info');
  };

  const handleShare = async (idea: StartupIdea) => {
    const text = `${idea.name}\n${idea.tagline}\nAI Rating: ${idea.aiRating}/100\nVotes: ${idea.votes}\n\n${idea.description}`;
    try {
      await Share.share({ message: text });
    } catch {
      showToast('Unable to open share dialog right now.', 'error');
    }
  };

  const handleCopy = async (idea: StartupIdea) => {
    const text = `${idea.name} - ${idea.tagline}\n${idea.description}`;
    await Clipboard.setStringAsync(text);
    showToast('Idea copied to clipboard.', 'success');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.segmentWrap}>
        <SegmentButton
          active={sortBy === 'rating'}
          colors={colors}
          label="Sort: Rating"
          onPress={() => setSortBy('rating')}
        />
        <SegmentButton
          active={sortBy === 'votes'}
          colors={colors}
          label="Sort: Votes"
          onPress={() => setSortBy('votes')}
        />
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={sortedIdeas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No ideas yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
              Submit your first startup idea from the Submit tab.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isExpanded = expandedIds.includes(item.id);
          const voted = hasVoted(item.id);

          return (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.titleRow}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.ratingPill, { color: colors.primary, borderColor: colors.primary }]}>
                  AI {item.aiRating}
                </Text>
              </View>

              <Text style={[styles.tagline, { color: colors.mutedText }]}>{item.tagline}</Text>

              <View style={styles.metricsRow}>
                <Text style={[styles.metricText, { color: colors.text }]}>👍 {item.votes} votes</Text>
                <Text style={[styles.metricText, { color: colors.mutedText }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <Text numberOfLines={isExpanded ? undefined : 2} style={[styles.description, { color: colors.text }]}>
                {item.description}
              </Text>

              {item.description.length > 95 ? (
                <Pressable onPress={() => toggleExpanded(item.id)}>
                  <Text style={[styles.readMore, { color: colors.primary }]}>
                    {isExpanded ? 'Show less' : 'Read more'}
                  </Text>
                </Pressable>
              ) : null}

              <View style={styles.actionRow}>
                <ActionButton
                  color={colors.primary}
                  disabled={voted}
                  label={voted ? 'Voted' : 'Upvote'}
                  onPress={() => handleVote(item.id)}
                />
                <ActionButton color={colors.accent} label="Share" onPress={() => handleShare(item)} />
                <ActionButton color="#64748b" label="Copy" onPress={() => handleCopy(item)} />
              </View>
            </View>
          );
        }}
      />
    </View>
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
          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      <Text style={[styles.segmentText, { color: active ? '#ffffff' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

interface ActionButtonProps {
  label: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}

function ActionButton({ color, disabled, label, onPress }: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        {
          backgroundColor: disabled ? '#94a3b8' : color,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 10,
    flex: 1,
    paddingVertical: 9,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  container: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
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
  listContent: {
    padding: 14,
    paddingTop: 8,
  },
  metricText: {
    fontSize: 13,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    paddingRight: 8,
  },
  ratingPill: {
    borderRadius: 999,
    borderWidth: 1,
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  readMore: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
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
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  tagline: {
    fontSize: 14,
    marginTop: 2,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
