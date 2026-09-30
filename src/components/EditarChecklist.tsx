import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { SaidaItem } from '../lib/types';

interface EditarChecklistProps {
  visible: boolean;
  items: SaidaItem[];
  onRename: (id: number, content: string) => Promise<void> | void;
  onDelete: (item: SaidaItem) => void;
  onAdd: () => void;
  onClose: () => void;
}

/**
 * Editor em lote do checklist de saída.
 *
 * Existe porque **um único** botão de lápis na tela abre o lugar onde todos
 * os itens são editados de uma vez. Antes cada linha carregava lápis +
 * lixeira, e o resultado era duas colunas de ícones ao lado de texto que
 * raramente se edita — o tipo de ruído que faz o olho ir para o controle em
 * vez do conteúdo.
 *
 * Aqui a renomeação é no lugar: o campo já vem preenchido e grava ao sair ou
 * ao pressionar "pronto". Apagar fica por linha porque apagar é sempre uma
 * decisão sobre **um** item, não sobre a lista inteira.
 */
export default function EditarChecklist({
  visible,
  items,
  onRename,
  onDelete,
  onAdd,
  onClose,
}: EditarChecklistProps) {
  const [rascunhos, setRascunhos] = useState<Record<number, string>>({});

  // Só recarrega os rascunhos ao abrir: enquanto a folha está no ar, o texto
  // que o usuário digita não pode ser sobrescrito pela lista de baixo.
  useEffect(() => {
    if (!visible) return;
    setRascunhos(Object.fromEntries(items.map(i => [i.id, i.content])));
  }, [visible, items]);

  const confirmar = (item: SaidaItem): void => {
    const texto = (rascunhos[item.id] ?? item.content).trim();
    if (!texto || texto === item.content) return;
    void onRename(item.id, texto);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} accessibilityLabel="Fechar" />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>Editar checklist</Text>
            <Text style={styles.sub}>
              {items.length} {items.length === 1 ? 'item' : 'itens'} · toque no campo para renomear
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityLabel="Fechar edição"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle-outline" size={28} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.lista}>
          {items.map(item => (
            <View key={item.id} style={styles.linha}>
              <TextInput
                style={styles.campo}
                value={rascunhos[item.id] ?? item.content}
                onChangeText={t => setRascunhos(prev => ({ ...prev, [item.id]: t }))}
                onBlur={() => confirmar(item)}
                onSubmitEditing={() => confirmar(item)}
                returnKeyType="done"
                maxLength={60}
                selectTextOnFocus
                placeholder="Nome do item"
                placeholderTextColor={theme.colors.textMuted}
                accessibilityLabel={`Renomear ${item.content}`}
              />
              <TouchableOpacity
                style={styles.apagar}
                onPress={() => onDelete(item)}
                accessibilityLabel={`Excluir ${item.content}`}
                accessibilityRole="button"
              >
                <Ionicons name="trash-outline" size={19} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.adicionar} onPress={onAdd} accessibilityRole="button">
          <Ionicons name="add" size={19} color={theme.colors.onPrimary} />
          <Text style={styles.adicionarText}>Adicionar item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pronto} onPress={onClose} accessibilityRole="button">
          <Ionicons name="checkmark" size={19} color={theme.colors.onPrimary} />
          <Text style={styles.prontoText}>Pronto</Text>
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
    maxHeight: '85%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 32,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  headText: {
    flex: 1,
  },
  title: {
    fontSize: theme.type.title,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sub: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -10,
    marginTop: -8,
  },
  lista: {
    gap: 8,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  campo: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: theme.type.body,
    color: theme.colors.text,
  },
  apagar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.dangerSoft,
  },
  adicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
  },
  adicionarText: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  pronto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 52,
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
  prontoText: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
});