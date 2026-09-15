import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface CaptureInputProps {
  onCapture: (text: string) => void;
}

export default function CaptureInput({ onCapture }: CaptureInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (): void => {
    const trimmed = text.trim();
    if (trimmed) {
      onCapture(trimmed);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        placeholder="Despejar ideia aqui..."
        placeholderTextColor="#9CA3AF"
        returnKeyType="done"
        accessibilityLabel="Campo de captura rápida"
      />
      <TouchableOpacity
        style={[styles.btn, !text.trim() && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={!text.trim()}
        accessibilityLabel="Salvar item"
      >
        <Text style={styles.btnText}>✓</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  btnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  btnText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 20,
  },
});
