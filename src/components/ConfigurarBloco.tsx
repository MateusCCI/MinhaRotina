import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { accents, theme } from '../lib/theme';

const TIMER = accents.timer;

/** Atalho canônico do método (25 min), então é o padrão do app. */
export const DURACAO_PADRAO_MIN = 25;

interface Opcao {
  min: number;
  /** Quando usar — o rótulo sozinho não ajuda quem não sabe escolher. */
  quando: string;
}

/**
 * Presets em vez de campo numérico. Campo numérico = digitar = barreira de
 * execução, e a lista de durações possíveis é infinita: escolher entre 5
 * opções fechadas e descritas é o que reduz a carga de decisão de quem tem
 * TDAH. O de 5 minutos existe de propósito — tempo curto é o ponto de
 * entrada mais viável para iniciantes, não um caso extremo.
 */
export const OPCOES_BLOCO: Opcao[] = [
  { min: 5, quando: 'Para começar agora, sem grande duração' },
  { min: 15, quando: 'Tarefa curta ou energia baixa' },
  { min: 25, quando: 'O bloco clássico, para tarefas de verdade' },
  { min: 45, quando: 'Trabalho profundo, quando o corpo já aqueceu' },
];

interface ConfigurarBlocoProps {
  visible: boolean;
  /** Minutos já em uso; é o que aparece marcado. */
  selectedMin: number;
  onSelect: (min: number) => void;
  onClose: () => void;
}

/**
 * Folha de escolha da duração do bloco. Fica em cima de tudo (RF07: a
 * configuração só aparece quando a pessoa abre, nunca intrometendo no meio
 * do foco).
 */
export default function ConfigurarBloco({
  visible,
  selectedMin,
  onSelect,
  onClose,
}: ConfigurarBlocoProps) {
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
        accessibilityLabel="Fechar"
      />
      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <Text style={styles.titulo}>Quanto tempo dura um bloco?</Text>
        <Text style={styles.sub}>
          A escolha vale para os próximos blocos. Trocar no meio de um ciclo zera a contagem.
        </Text>

        <View style={styles.lista}>
          {OPCOES_BLOCO.map(op => {
            const ativo = op.min === selectedMin;
            return (
              <TouchableOpacity
                key={op.min}
                style={[styles.opcao, ativo && styles.opcaoAtiva]}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSelect(op.min);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: ativo }}
                accessibilityLabel={`${op.min} minutos. ${op.quando}`}
              >
                <View style={[styles.min, ativo && styles.minAtivo]}>
                  <Text style={[styles.minTexto, ativo && styles.minTextoAtivo]}>{op.min}</Text>
                </View>
                <View style={styles.opcaoTexto}>
                  <Text style={[styles.opcaoTitulo, ativo && styles.opcaoTituloAtivo]}>
                    {op.min} {op.min === 1 ? 'minuto' : 'minutos'}
                  </Text>
                  <Text style={styles.quando}>{op.quando}</Text>
                </View>
                {ativo ? (
                  <Ionicons name="checkmark-circle" size={22} color={TIMER.base} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.fechar} onPress={onClose} accessibilityRole="button">
          <Text style={styles.fecharText}>Pronto</Text>
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
    marginBottom: theme.spacing.lg,
  },
  titulo: {
    fontSize: theme.type.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sub: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    marginTop: 6,
    marginBottom: theme.spacing.lg,
  },
  lista: {
    gap: 10,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 60,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  opcaoAtiva: {
    backgroundColor: TIMER.soft,
    borderColor: TIMER.base,
  },
  min: {
    width: 46,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  minAtivo: {
    backgroundColor: TIMER.base,
    borderColor: TIMER.base,
  },
  minTexto: {
    fontSize: theme.type.callout,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  minTextoAtivo: {
    color: theme.colors.onPrimary,
  },
  opcaoTexto: {
    flex: 1,
  },
  opcaoTitulo: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.text,
  },
  opcaoTituloAtivo: {
    color: TIMER.base,
  },
  quando: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  fechar: {
    marginTop: theme.spacing.lg,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: TIMER.base,
  },
  fecharText: {
    color: theme.colors.onPrimary,
    fontSize: theme.type.callout,
    fontWeight: '700',
  },
});