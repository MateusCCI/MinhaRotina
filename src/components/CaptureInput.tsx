import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_TEXT, DUE_OPTIONS } from '../lib/date';
import { theme, cardShadow } from '../lib/theme';

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
    <View style={styles.card}>
      <Text style={styles.prompt}>O que está na sua cabeça?</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          placeholder="Despeje aqui, sem filtro…"
          placeholderTextColor={theme.colors.textMuted}
          returnKeyType="done"
          accessibilityLabel="Campo de captura rápida"
        />
        <TouchableOpacity
          style={[styles.btn, !text.trim() && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={!text.trim()}
          accessibilityLabel="Salvar item"
        >
          <Text style={[styles.btnText, !text.trim() && styles.btnTextDisabled]}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.optionsLabel}>Quando lembrar?</Text>
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

      <Text style={styles.optionsLabel}>É sobre o quê?</Text>
      <View style={styles.chips}>
        {CATEGORIES.map(cat => {
          const active = category === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                active && { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] },
              ]}
              onPress={() => setCategory(prev => (prev === cat ? null : cat))}
            >
              <Text
                style={[
                  styles.chipText,
                  active && { color: CATEGORY_TEXT[cat] ?? theme.colors.text },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...cardShadow(),
  },
  prompt: {
    fontSize: theme.type.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bg,
    borderRadius: theme.radius.md,
    padding: 6,
    paddingLeft: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: theme.type.body,
    color: theme.colors.text,
    paddingVertical: 12,
    minHeight: 48,
  },
  btn: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  btnText: {
    fontSize: theme.type.callout,
    color: theme.colors.onPrimary,
    fontWeight: '700',
  },
  btnTextDisabled: {
    color: theme.colors.onDisabled,
  },
  optionsLabel: {
    fontSize: theme.type.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: theme.type.footnote,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: theme.colors.onPrimary,
  },
});
