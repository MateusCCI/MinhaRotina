import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InboxItem } from '../lib/types';
import { dueLabel, CATEGORY_COLORS } from '../lib/date';
import { theme } from '../lib/theme';

interface InboxItemProps {
  item: InboxItem;
  onPromote: (id: number) => void;
  onEdit: (item: InboxItem) => void;
  onDelete: (id: number) => void;
}

export default function InboxItemComponent({ item, onPromote, onEdit, onDelete }: InboxItemProps) {
  const due = dueLabel(item.due_date);
  const hasBadges = due.label || item.category;

  return (
    <View style={styles.container}>
      <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
      {hasBadges && (
        <View style={styles.badges}>
          {item.category && (
            <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[item.category] ?? '#A8A29E' }]}>
              <Text style={styles.badgeText}>{item.category}</Text>
            </View>
          )}
          {due.label && (
            <View style={[styles.badge, due.urgent ? styles.badgeUrgent : styles.badgeDue]}>
              <Text style={styles.badgeDueText}>{due.label}</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.btnEdit]}
          onPress={() => onEdit(item)}
          accessibilityLabel={`Editar ${item.content}`}
        >
          <Text style={[styles.btnText, styles.btnEditText]}>✎ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPromote]}
          onPress={() => onPromote(item.id)}
          accessibilityLabel={`Mover ${item.content} para hoje`}
        >
          <Text style={styles.btnText}>→ Hoje</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnDelete]}
          onPress={() => onDelete(item.id)}
          accessibilityLabel={`Excluir ${item.content}`}
        >
          <Text style={[styles.btnText, styles.btnDeleteText]}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeDue: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
  },
  badgeUrgent: {
    backgroundColor: theme.colors.dangerSoft,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onGold,
  },
  badgeDueText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.gold,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  btnEdit: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnEditText: {
    color: theme.colors.textSecondary,
  },
  btnPromote: {
    backgroundColor: theme.colors.gold,
  },
  btnDelete: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: 'rgba(255,95,86,0.4)',
    minWidth: 48,
  },
  btnDeleteText: {
    color: theme.colors.danger,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onGold,
  },
});