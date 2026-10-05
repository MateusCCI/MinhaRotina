import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { HojeItem } from '../lib/types';
import { dueLabel, CATEGORY_COLORS, CATEGORY_TEXT } from '../lib/date';
import { accents, theme, cardShadow } from '../lib/theme';
import { categoryIcon, dueIcon } from '../lib/icons';

interface HojeItemProps {
  item: HojeItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const HOJE = accents.hoje;

/** Cor do badge de prazo por estado — a cor complementa o ícone, não o substitui. */
function dueBadgeColors(tone: ReturnType<typeof dueLabel>['tone']): { bg: string; fg: string } {
  if (tone === 'overdue') return { bg: theme.colors.dangerSoft, fg: theme.colors.danger };
  if (tone === 'today') return { bg: theme.colors.warningSoft, fg: theme.colors.warning };
  return { bg: theme.colors.surfaceAlt, fg: theme.colors.textSecondary };
}

export default function HojeItemComponent({ item, onToggle, onDelete }: HojeItemProps) {
  const due = dueLabel(item.due_date);
  const dueColors = dueBadgeColors(due.tone);

  const handleToggle = (): void => {
    void Haptics.selectionAsync();
    onToggle(item.id);
  };

  return (
    <View style={[styles.container, !item.checked && due.tone === 'overdue' ? styles.containerUrgent : undefined]}>
      <TouchableOpacity
        style={[styles.checkbox, item.checked ? styles.checkboxChecked : undefined]}
        onPress={handleToggle}
        testID={`hoje-check-${item.id}`}
        accessibilityLabel={item.checked ? 'Desmarcar' : 'Concluir'}
        accessibilityRole="checkbox"
        accessible
      >
        {item.checked && <Ionicons name="checkmark" size={22} color={theme.colors.onPrimary} />}
      </TouchableOpacity>
      <View style={styles.body}>
        <Text style={[styles.content, item.checked ? styles.checked : undefined]}>
          {item.content}
        </Text>
        {(due.label || item.category) && (
          <View style={styles.badges}>
            {due.label && (
              <View style={[styles.badgeRow, { backgroundColor: dueColors.bg }]}>
                <Ionicons name={dueIcon(due.tone)} size={12} color={dueColors.fg} />
                <Text style={[styles.badgeText, { color: dueColors.fg }]}>{due.label}</Text>
              </View>
            )}
            {item.category && (
              <View
                style={[
                  styles.badgeRow,
                  { backgroundColor: CATEGORY_COLORS[item.category] ?? theme.colors.surfaceAlt },
                ]}
              >
                <Ionicons
                  name={categoryIcon(item.category)}
                  size={12}
                  color={CATEGORY_TEXT[item.category] ?? theme.colors.textSecondary}
                />
                <Text style={[styles.badgeText, { color: CATEGORY_TEXT[item.category] ?? theme.colors.textSecondary }]}>
                  {item.category}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
        testID={`hoje-remover-${item.id}`}
        accessibilityLabel="Remover do hoje"
        accessibilityRole="button"
      >
        <Ionicons name="close-circle-outline" size={24} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sm,
    ...cardShadow(),
  },
  containerUrgent: {
    borderWidth: 1.5,
    borderColor: theme.colors.danger,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: theme.colors.surface,
  },
  checkboxChecked: {
    backgroundColor: HOJE.base,
    borderColor: HOJE.base,
  },
  content: {
    flex: 1,
    fontSize: theme.type.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  body: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
  },
  badgeText: {
    fontSize: theme.type.caption,
    fontWeight: '700',
  },
  checked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  deleteBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
