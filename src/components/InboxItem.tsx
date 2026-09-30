import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InboxItem } from '../lib/types';
import { dueLabel, CATEGORY_COLORS, CATEGORY_TEXT } from '../lib/date';
import { theme, cardShadow } from '../lib/theme';
import { categoryIcon, dueIcon } from '../lib/icons';

interface InboxItemProps {
  item: InboxItem;
  /** Abre a folha de ações do item (a linha em si não guarda estado). */
  onMenu: (item: InboxItem) => void;
}

/** Cor do badge de prazo por estado — a cor complements o ícone, não o substitui. */
function dueBadgeColors(tone: ReturnType<typeof dueLabel>['tone']): { bg: string; fg: string } {
  if (tone === 'overdue') return { bg: theme.colors.dangerSoft, fg: theme.colors.danger };
  if (tone === 'today') return { bg: theme.colors.warningSoft, fg: theme.colors.warning };
  return { bg: theme.colors.surfaceAlt, fg: theme.colors.textSecondary };
}

export default function InboxItemComponent({ item, onMenu }: InboxItemProps) {
  const due = dueLabel(item.due_date);
  const categoryInk = (item.category && CATEGORY_TEXT[item.category]) || theme.colors.textSecondary;
  const dueColors = dueBadgeColors(due.tone);

  return (
    <View style={[styles.container, due.tone === 'overdue' && styles.containerUrgent]}>
      <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
      {/* Uma linha só de metadados: os pills à esquerda, o lápis à direita.
          Enquanto o item não tem prazo nem categoria, a linha continua
          existindo para o lápis não mudar de lugar de um item para outro. */}
      <View style={styles.badges}>
        {item.category && (
          <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[item.category] ?? theme.colors.surfaceAlt }]}>
            <Ionicons name={categoryIcon(item.category)} size={13} color={categoryInk} />
            <Text style={[styles.badgeText, { color: categoryInk }]}>{item.category}</Text>
          </View>
        )}
        {due.label && (
          <View style={[styles.badge, { backgroundColor: dueColors.bg }]}>
            <Ionicons name={dueIcon(due.tone)} size={13} color={dueColors.fg} />
            <Text style={[styles.badgeText, { color: dueColors.fg }]}>{due.label}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => onMenu(item)}
          accessibilityLabel={`Ações para ${item.content}`}
          accessibilityRole="button"
        >
          <Ionicons name="pencil-outline" size={18} color={theme.colors.textSecondary} />
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
    marginBottom: 8,
    lineHeight: 24,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  badgeText: {
    fontSize: theme.type.caption,
    fontWeight: '700',
  },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
  },
});
