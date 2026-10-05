import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_TEXT, DUE_OPTIONS } from '../lib/date';
import { accents, theme, cardShadow } from '../lib/theme';
import { categoryIcon } from '../lib/icons';

export interface CaptureMeta {
  dueDate?: string | null;
  category?: string | null;
}

interface CaptureInputProps {
  onCapture: (text: string, meta: CaptureMeta) => void;
}

const INBOX = accents.inbox;

/**
 * Campo de captura: despejar uma ideia tem de custar um toque. Por isso o
 * campo é o elemento mais alto do card e o botão nasce com o ícone — o
 * rótulo sozinho obriga a ler antes de apertar.
 */
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

  const canSubmit = !!text.trim();

  return (
    <View style={styles.card}>
      <View style={styles.promptRow}>
        <View style={styles.promptIcon}>
          <Ionicons name="sparkles" size={16} color={INBOX.base} />
        </View>
        <Text style={styles.prompt}>O que está na sua cabeça?</Text>
      </View>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          testID="captura-campo"
          placeholder="Despeje aqui, sem filtro…"
          placeholderTextColor={theme.colors.textMuted}
          returnKeyType="done"
          accessibilityLabel="Campo de captura rápida"
        />
        <TouchableOpacity
          style={[styles.btn, !canSubmit && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          accessibilityLabel="Salvar item"
        >
          <Ionicons
            name="checkmark"
            size={18}
            color={canSubmit ? theme.colors.onPrimary : theme.colors.onDisabled}
          />
          <Text style={[styles.btnText, !canSubmit && styles.btnTextDisabled]}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsHead}>
        <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
        <Text style={styles.optionsLabel}>Quando lembrar?</Text>
      </View>
      <View style={styles.chips}>
        {DUE_OPTIONS.map(opt => {
          const active = dueKey === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setDueKey(opt.key)}
              accessibilityLabel={`Prazo: ${opt.label}`}
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.optionsHead}>
        <Ionicons name="pricetags-outline" size={14} color={theme.colors.textMuted} />
        <Text style={styles.optionsLabel}>É sobre o quê?</Text>
      </View>
      <View style={styles.chips}>
        {CATEGORIES.map(cat => {
          const active = category === cat;
          // O chip nasce na cor da categoria: a paleta de 6 matizes é a
          // única informação de cor da tela, então escondê-la atrás de um
          // toque deixa a primeira tela monocromática.
          const ink = CATEGORY_TEXT[cat] ?? theme.colors.text;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                { backgroundColor: CATEGORY_COLORS[cat] ?? theme.colors.surfaceAlt },
                active && { borderColor: ink, borderWidth: 2 },
              ]}
              onPress={() => setCategory(prev => (prev === cat ? null : cat))}
              accessibilityLabel={`Categoria ${cat}`}
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={categoryIcon(cat)}
                size={15}
                color={active ? theme.colors.onPrimary : ink}
              />
              <Text style={[styles.chipText, { color: active ? theme.colors.onPrimary : ink }]}>
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
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  promptIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: accents.inbox.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prompt: {
    fontSize: theme.type.title,
    fontWeight: '700',
    color: theme.colors.text,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
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
  optionsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    marginTop: 4,
  },
  optionsLabel: {
    fontSize: theme.type.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
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
