import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useIdeas } from '../context/IdeaContext';
import { useToast } from '../context/ToastContext';
import { getColors } from '../theme';
import { RootTabParamList } from '../types/navigation';

type Props = BottomTabScreenProps<RootTabParamList, 'Submit'>;

export function SubmitIdeaScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const { addIdea, themeMode } = useIdeas();
  const { showToast } = useToast();
  const colors = getColors(themeMode);

  const handleSubmit = () => {
    if (!name.trim() || !tagline.trim() || !description.trim()) {
      showToast('Please fill all fields before submitting.', 'error');
      return;
    }

    const idea = addIdea({ name, tagline, description });
    showToast(`Submitted! Fake AI score: ${idea.aiRating}/100`, 'success');

    setName('');
    setTagline('');
    setDescription('');
    navigation.navigate('Ideas');
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.heading, { color: colors.text }]}>The Startup Idea Evaluator</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Pitch your startup and get instant fake AI feedback.
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Startup Name</Text>
        <TextInput
          autoCapitalize="words"
          onChangeText={setName}
          placeholder="IdeaSprint"
          placeholderTextColor={colors.mutedText}
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={name}
        />

        <Text style={[styles.label, { color: colors.text }]}>Tagline</Text>
        <TextInput
          autoCapitalize="sentences"
          onChangeText={setTagline}
          placeholder="Turn chaos into momentum for small teams."
          placeholderTextColor={colors.mutedText}
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={tagline}
        />

        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          autoCapitalize="sentences"
          multiline
          onChangeText={setDescription}
          placeholder="Explain your startup idea in a few lines..."
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            styles.textArea,
            { borderColor: colors.border, color: colors.text, textAlignVertical: 'top' },
          ]}
          value={description}
        />

        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.submitText}>Generate AI Rating + Submit</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  container: {
    flexGrow: 1,
    gap: 14,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  submitButton: {
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 13,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  textArea: {
    minHeight: 110,
  },
});
