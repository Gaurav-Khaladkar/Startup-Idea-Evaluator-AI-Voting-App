import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, Title, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../utils/storageKeys';

export default function IdeaSubmissionScreen({ navigation, showToast }) {
  const [startupName, setStartupName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const generateFakeRating = () => Math.floor(Math.random() * 101);

  const saveIdea = async () => {
    if (!startupName.trim() || !tagline.trim() || !description.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    const newIdea = {
      id: Date.now().toString(),
      startupName: startupName.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      rating: generateFakeRating(),
      votes: 0,
    };

    try {
      const existingJson = await AsyncStorage.getItem(STORAGE_KEYS.IDEAS);
      const existingIdeas = existingJson ? JSON.parse(existingJson) : [];
      const updatedIdeas = [newIdea, ...existingIdeas];
      await AsyncStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(updatedIdeas));

      setLoading(false);
      showToast({
        type: 'success',
        text1: 'Idea submitted!',
        text2: `${newIdea.startupName} was added.`,
      });

      navigation.navigate('IdeaListing');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to save idea');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Title style={[styles.title, { color: theme.colors.primary }]}>
        Submit Your Startup Idea
      </Title>
      <TextInput
        label="Startup Name"
        mode="outlined"
        value={startupName}
        onChangeText={setStartupName}
        style={styles.input}
        autoCapitalize="words"
      />
      <TextInput
        label="Tagline"
        mode="outlined"
        value={tagline}
        onChangeText={setTagline}
        style={styles.input}
      />
      <TextInput
        label="Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={5}
        style={[styles.input, { minHeight: 100 }]}
      />
      <Button
        mode="contained"
        onPress={saveIdea}
        loading={loading}
        contentStyle={styles.buttonContent}
        disabled={loading}
      >
        Submit Idea
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { marginBottom: 30, fontWeight: 'bold', fontSize: 24, textAlign: 'center' },
  input: { marginBottom: 18 },
  buttonContent: { paddingVertical: 12 },
});
