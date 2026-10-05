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
      {/* Item de UMA linha: texto, pills e lápis na mesma faixa. O texto é
          o único que cede espaço (`flex: 1` com `numberOfLines={1}`): os
          pills e o lápis mantêm o tamanho, porque é deles que se lê o
          prazo e a categoria sem precisar abrir nada. */}
      <Text style={styles.content} numberOfLines={1}>{item.content}</Text>
      {item.category && (
        <View style={[styles.badge, { backgroundColor: CATEGORY_COLORS[item.category] ?? theme.colors.surfaceAlt }]}>
          <Ionicons name={categoryIcon(item.category)} size={13} color={categoryInk} />
          <Text style={[styles.badgeText, { color: categoryInk }]}>{item.category}</Text>
        </View>
      )}
      {due.label && (
        // O prazo vira **só ícone** nesta linha. Medido: o pill "vence hoje"
        // custava 96 px, quase o texto inteiro da tarefa, e aí até "Revisar o
        // DER" truncava. A cor segue dizendo a urgência e o glifo segue
        // dizendo o estado; as palavras ficaram no accessibilityLabel, que é
        // o que o leitor de tela lê.
        <View
          style={[styles.dueDot, { backgroundColor: dueColors.bg }]}
          // `accessible` é o que faz o Android/iOS Announcescaremente o
          // rótulo: sem ele, um View sem papel só é lido na web.
          accessible
          accessibilityLabel={`Prazo: ${due.label}`}
        >
          <Ionicons name={dueIcon(due.tone)} size={13} color={dueColors.fg} />
        </View>
      )}
      <TouchableOpacity
        style={styles.iconBtn}
        // O desenho encolhe para a altura da linha, mas o **alvo de toque**
        // continua com 44pt: `hitSlop` estende a área sensível além do
        // desenho. As duas coisas importam — alvo pequeno demais atrapalha
        // quem tem dificuldade motora, desenho grande demais empurra a
        // linha para baixo.
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={() => onMenu(item)}
        testID={`inbox-acoes-${item.id}`}
        accessibilityLabel={`Ações para ${item.content}`}
        accessibilityRole="button"
      >
        <Ionicons name="pencil-outline" size={15} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    // Linha única: o item virou faixa, não cartão. `minHeight: 52` é o piso
    // confortável para o dedo; o texto é o único que cede espaco.
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    ...cardShadow(),
  },
  containerUrgent: {
    borderWidth: 1.5,
    borderColor: theme.colors.danger,
  },
  content: {
    // O texto cede espaco; `flexShrink: 0` nos pills e no lapis impede que
    // eles amassem quando a ideia e longa.
    flex: 1,
    fontSize: theme.type.callout,
    fontWeight: '600',
    color: theme.colors.text,
  },
  badge: {
    flexShrink: 0,
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
  dueDot: {
    flexShrink: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    flexShrink: 0,
    width: 28,
    height: 28,
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: theme.colors.surfaceAlt,
  },
});
