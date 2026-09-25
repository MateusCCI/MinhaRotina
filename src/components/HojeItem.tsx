import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HojeItem } from '../lib/types';
import { dueLabel, CATEGORY_COLORS } from '../lib/date';
import { theme } from '../lib/theme';

interface HojeItemProps {
  item: HojeItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function HojeItemComponent({ item, onToggle, onDelete }: HojeItemProps) {
  const due = dueLabel(item.due_date);

  return (
    <View style={[styles.container, !item.checked && due.urgent ? styles.containerUrgent : undefined]}>
      <TouchableOpacity
        style={[styles.checkbox, item.checked ? styles.checkboxChecked : undefined]}
        onPress={() => onToggle(item.id)}
        accessibilityLabel={item.checked ? 'Desmarcar' : 'Marcar'}
        accessible
      >
        {item.checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.body}>
        <Text style={[styles.content, item.checked ? styles.checked : undefined]}>
          {item.content}
        </Text>
        {(due.label || item.category) && (
          <View style={styles.badges}>
            {due.label && (
              <Text style={[styles.badge, styles.badgeUrgent]}>⏰ {due.label}</Text>
            )}
            {item.category && (
              <Text style={[styles.badge, { color: CATEGORY_COLORS[item.category] ?? theme.colors.textSecondary }]}>
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
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  containerUrgent: {
    borderColor: theme.colors.danger,
    borderWidth: 2,
    backgroundColor: theme.colors.dangerSoft,
  },
  checkbox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: theme.colors.surfaceAlt,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.patina,
    borderColor: theme.colors.patina,
  },
  checkmark: {
    color: theme.colors.bg,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
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
    fontSize: 12,
    fontWeight: '600',
  },
  badgeUrgent: {
    color: theme.colors.danger,
  },
  checked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 18,
    color: theme.colors.danger,
  },
});
