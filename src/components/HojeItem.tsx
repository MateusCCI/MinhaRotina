import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { HojeItem } from '../lib/types';
import { dueLabel, CATEGORY_TEXT } from '../lib/date';
import { theme, cardShadow } from '../lib/theme';

interface HojeItemProps {
  item: HojeItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function HojeItemComponent({ item, onToggle, onDelete }: HojeItemProps) {
  const due = dueLabel(item.due_date);

  const handleToggle = (): void => {
    void Haptics.selectionAsync();
    onToggle(item.id);
  };

  return (
    <View style={[styles.container, !item.checked && due.urgent ? styles.containerUrgent : undefined]}>
      <TouchableOpacity
        style={[styles.checkbox, item.checked ? styles.checkboxChecked : undefined]}
        onPress={handleToggle}
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
              <Text style={[styles.badge, due.urgent ? styles.badgeUrgent : styles.badgeCalm]}>
                {due.label}
              </Text>
            )}
            {item.category && (
              <Text style={[styles.badge, { color: CATEGORY_TEXT[item.category] ?? theme.colors.textSecondary }]}>
                {item.category}
              </Text>
            )}
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
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
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
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
    marginTop: 6,
  },
  badge: {
    fontSize: theme.type.caption,
    fontWeight: '700',
  },
  badgeUrgent: {
    color: theme.colors.danger,
  },
  badgeCalm: {
    color: theme.colors.textSecondary,
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
