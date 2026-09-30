import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../lib/theme';
import { categoryIcon } from '../lib/icons';
import { HojeItem } from '../lib/types';

interface BlocoConcluidoProps {
  visible: boolean;
  /** `x/3 concluídas — NN%`, o resumo que o texto do projeto promete. */
  concluidas: number;
  total: number;
  pct: number;
  /** Prioridades ainda abertas, oferecidas como "próximo passo". */
  proximas: HojeItem[];
  onEscolher: (id: number) => void;
  onClose: () => void;
}

/**
 * RF07: o bloco de 25 minutos só avisa **no fim**, nunca no meio do foco
 * (Jones et al., 2021: lembrete demais faz a pessoa ignorar tudo). E o
 * aviso não é só "acabou": mostra o quanto do dia já saiu e oferece a
 * prioridade que ainda está aberta.
 *
 * O app **não** oferece adicionar uma 4ª prioridade aqui. O limite de 3 é
 * o principio do projeto (Essencialismo); o fim do bloco é um convite a
 * continuar o que já foi escolhido, não a reabrir a lista.
 */
export default function BlocoConcluido({
  visible,
  concluidas,
  total,
  pct,
  proximas,
  onEscolher,
  onClose,
}: BlocoConcluidoProps) {
  const feito = total > 0 && concluidas === total;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} accessibilityLabel="Fechar" />
      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="checkmark-done" size={30} color={theme.colors.success} />
          </View>
          <Text style={styles.heroTitle}>Bloco de 25 minutos concluído</Text>
          <Text style={styles.heroProgress}>
            {concluidas}/{total} concluídas — {pct}%
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct}%` }]} />
          </View>
        </View>

        {feito ? (
          <View style={styles.descanso}>
            <Ionicons name="partly-sunny" size={18} color={theme.colors.warning} />
            <Text style={styles.descansoText}>
              Dia fechado. Levanta, estica as costas e come algo — o próximo bloco é seu,
              não do app.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.pergunta}>E agora, qual dos dois?</Text>
            {proximas.length > 0 ? (
              <View style={styles.lista}>
                {proximas.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.opcao}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      onEscolher(item.id);
                    }}
                    accessibilityLabel={`Continuar com ${item.content}`}
                  >
                    <View style={styles.opcaoIcon}>
                      <Ionicons name={categoryIcon(item.category)} size={17} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.opcaoTexto} numberOfLines={2}>
                      {item.content}
                    </Text>
                    <Ionicons name="play" size={18} color={theme.colors.success} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.vazio}>
                Nenhuma prioridade em aberto. Escolha uma na aba Hoje quando quiser.
              </Text>
            )}
          </>
        )}

        <TouchableOpacity style={styles.fechar} onPress={onClose} accessibilityRole="button">
          <Text style={styles.fecharText}>Fechar</Text>
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
  hero: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: theme.colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  heroTitle: {
    fontSize: theme.type.title,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  heroProgress: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.success,
    marginTop: 4,
  },
  track: {
    width: '100%',
    height: 10,
    marginTop: 12,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: theme.colors.success,
  },
  pergunta: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  lista: {
    gap: 8,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  opcaoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoTexto: {
    flex: 1,
    fontSize: theme.type.callout,
    color: theme.colors.textBody,
    fontWeight: '600',
  },
  vazio: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: theme.spacing.sm,
  },
  descanso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.warningSoft,
    marginBottom: theme.spacing.sm,
  },
  descansoText: {
    flex: 1,
    fontSize: theme.type.callout,
    color: theme.colors.textBody,
    lineHeight: 21,
  },
  fechar: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
  },
  fecharText: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
});
