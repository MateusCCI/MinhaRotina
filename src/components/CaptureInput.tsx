import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { CATEGORIES, CATEGORY_COLORS, DUE_OPTIONS } from '../lib/date';

export interface CaptureMeta {
  dueDate?: string | null;
  category?: string | null;
}

interface CaptureInputProps {
  onCapture: (text: string, meta: CaptureMeta) => void;
}

export default function CaptureInput({ onCapture }: CaptureInputProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [dueKey, setDueKey] = useState<string>('none');

  const handleSubmit = (): void => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const option = DUE_OPTIONS.find(o => o.key === dueKey);
    onCapture(trimmed, { dueDate: option?.value ?? null, category });
    setText('');
    setCategory(null);
    setDueKey('none');
  };

  return (
    <View style={styles.wrapper}>
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

      <View style={styles.options}>
        <Text style={styles.optionsLabel}>Prazo:</Text>
        <View style={styles.chips}>
          {DUE_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.chip, dueKey === opt.key && styles.chipActive]}
              onPress={() => setDueKey(opt.key)}
            >
              <Text style={[styles.chipText, dueKey === opt.key && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.options}>
        <Text style={styles.optionsLabel}>Categoria:</Text>
        <View style={styles.chips}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                category === cat && { backgroundColor: CATEGORY_COLORS[cat] },
              ]}
              onPress={() => setCategory(prev => (prev === cat ? null : cat))}
            >
              <Text
                style={[
                  styles.chipText,
                  category === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
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
  options: {
    marginTop: 8,
  },
  optionsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});