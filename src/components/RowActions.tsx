import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { IconName } from '../lib/icons';

export interface RowAction {
  key: string;
  label: string;
  /** Linha de apoio: o que essa ação faz, em uma frase. */
  description?: string;
  icon: IconName;
  /** 'danger' pinta a ação de vermelho e exige confirmação antes. */
  tone?: 'default' | 'danger';
  onPress: () => void | Promise<void>;
}

interface RowActionsProps {
  visible: boolean;
  /** Título da folha — normalmente o conteúdo do item, para não perder o contexto. */
  title?: string;
  actions: RowAction[];
  onClose: () => void;
}

/**
 * Folha de ações do item (bottom sheet).
 *
 * Existe por **revelação progressiva**: a linha da lista carrega só o
 * lápis, e as três ações (promover, editar, excluir) aparecem aqui. Com
 * três botões em cada linha, a lista do Inbox vira um mural de botões e a
 * hierarquia se perde — o olho vai para o controle, não para a tarefa.
 * A alternativa (menu suspenso ancorado no toque) foi descartada porque
 * no celular o destino fica curto e o sheet é mais fácil de acertar.
 */
export default function RowActions({ visible, title, actions, onClose }: RowActionsProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
        accessibilityLabel="Fechar ações"
      />
      <View style={styles.sheet}>
        {title ? (
          <View style={styles.head}>
            <View style={styles.grabber} />
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </View>
        ) : (
          <View style={styles.grabberOnly} />
        )}

        {actions.map(action => {
          const danger = action.tone === 'danger';
          return (
            <TouchableOpacity
              key={action.key}
              style={[styles.action, danger && styles.actionDanger]}
              onPress={() => {
                onClose();
                void action.onPress();
              }}
              accessibilityLabel={action.label}
              accessibilityRole="button"
            >
              <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
                <Ionicons
                  name={action.icon}
                  size={19}
                  color={danger ? theme.colors.danger : theme.colors.primary}
                />
              </View>
              <View style={styles.actionBody}>
                <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>
                  {action.label}
                </Text>
                {action.description ? (
                  <Text style={styles.actionDescription}>{action.description}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.cancel} onPress={onClose} accessibilityRole="button">
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: 32,
  },
  grabberOnly: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginBottom: theme.spacing.sm,
  },
  head: {
    alignItems: 'center',
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.type.footnote,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
  },
  actionDanger: {
    backgroundColor: theme.colors.dangerSoft,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDanger: {
    backgroundColor: 'rgba(220,38,38,0.14)',
  },
  actionBody: {
    flex: 1,
  },
  actionLabel: {
    fontSize: theme.type.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  actionLabelDanger: {
    color: theme.colors.danger,
  },
  actionDescription: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    marginTop: 1,
    lineHeight: 18,
  },
  cancel: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  cancelText: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
});
