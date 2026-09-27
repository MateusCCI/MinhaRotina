import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { InboxItem } from '../lib/types';
import { dueLabel, CATEGORY_COLORS, CATEGORY_TEXT } from '../lib/date';
import { theme, cardShadow } from '../lib/theme';

interface InboxItemProps {
  item: InboxItem;
  onPromote: (id: number) => void;
  onEdit: (item: InboxItem) => void;
  onDelete: (id: number) => void;
}

export default function InboxItemComponent({ item, onPromote, onEdit, onDelete }: InboxItemProps) {
  const due = dueLabel(item.due_date);
  const hasBadges = due.label || item.category;

  const handlePromote = (): void => {
    void Haptics.selectionAsync();
    onPromote(item.id);
  };

  return (
    <View style={[styles.container, due.urgent && styles.containerUrgent]}>
      <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
      {hasBadges && (
        <View style={styles.badges}>
          {item.category && (
            <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[item.category] ?? '#E7E5E4' }]}>
              <Text style={[styles.badgeText, { color: CATEGORY_TEXT[item.category] ?? theme.colors.textSecondary }]}>
                {item.category}
              </Text>
            </View>
          )}
          {due.label && (
            <View style={[styles.badge, due.urgent ? styles.badgeUrgent : styles.badgeDue]}>
              <Text style={[styles.badgeText, due.urgent ? styles.badgeUrgentText : styles.badgeDueText]}>
                {due.label}
              </Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onEdit(item)}
          accessibilityLabel={`Editar ${item.content}`}
          accessibilityRole="button"
        >
          <Ionicons name="pencil-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.iconBtnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handlePromote}
          accessibilityLabel={`Mover ${item.content} para hoje`}
          accessibilityRole="button"
        >
          <Text style={styles.primaryBtnText}>Virar prioridade</Text>
          <Ionicons name="arrow-forward" size={18} color={theme.colors.onPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtnDanger}
          onPress={() => onDelete(item.id)}
          accessibilityLabel={`Excluir ${item.content}`}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...cardShadow(),
  },
  containerUrgent: {
    borderWidth: 1.5,
    borderColor: theme.colors.danger,
  },
  content: {
    fontSize: theme.type.body,
    color: theme.colors.text,
    marginBottom: 10,
    lineHeight: 24,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  badgeDue: {
    backgroundColor: theme.colors.primarySoft,
  },
  badgeUrgent: {
    backgroundColor: theme.colors.dangerSoft,
  },
  badgeText: {
    fontSize: theme.type.caption,
    fontWeight: '700',
  },
  badgeDueText: {
    color: theme.colors.primary,
  },
  badgeUrgentText: {
    color: theme.colors.danger,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
  },
  iconBtnText: {
    fontSize: theme.type.footnote,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  primaryBtnText: {
    fontSize: theme.type.footnote,
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
  iconBtnDanger: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.dangerSoft,
  },
});
