import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { accents, theme } from '../lib/theme';
import { LIMITE_FOCO_DIA } from '../lib/limites';
import { HojeItem } from '../lib/types';

const FOCO = accents.hoje;

interface LimiteFocoProps {
  visible: boolean;
  /** Texto do item do Inbox que a pessoa tentou promover. */
  candidato: string;
  /** As prioridades que já ocupam o dia. */
  abertas: HojeItem[];
  /** A pessoa escolheu trocar: sai a prioridade de `id`. */
  onTrocar: (id: number) => void;
  /** A pessoa preferiu deixar o item para amanhã. */
  onAmanha: () => void;
  onFechar: () => void;
}

/**
 * Folha do limite de foco.
 *
 * Existe para o limite não virar beco. Recusar a 4ª prioridade com um "não
 * é possível" e pronto empurra a pessoa para uma impasse: ou ela desiste da
 * tarefa, ou ignora o app. Aqui o limite é explicado, e há duas saídas
 * legítimas — trocar uma das abertas ou adiar a nova — porque as duas são
 * decisões corretas e a pessoa sabe melhor que o software qual delas é.
 */
export default function LimiteFoco({
  visible,
  candidato,
  abertas,
  onTrocar,
  onAmanha,
  onFechar,
}: LimiteFocoProps) {
  const [trocando, setTrocando] = useState(false);

  /** Voltar ao passo 1 sem perder o contexto do que foi tentado. */
  const voltar = (): void => setTrocando(false);

  const escolherTroca = (id: number): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTrocando(false);
    onTrocar(id);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onFechar}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onFechar}
        accessibilityLabel="Fechar"
      />
      <View style={styles.sheet}>
        <View style={styles.grabber} />

        {!trocando ? (
          <>
            <View style={styles.espaco}>
              <Ionicons name="layers-outline" size={22} color={FOCO.base} />
            </View>

            <Text style={styles.titulo}>O dia já tem {LIMITE_FOCO_DIA} prioridades</Text>

            <Text style={styles.texto}>
              Um dia com mais de {LIMITE_FOCO_DIA} coisas abertas costuma virar sobrecarga: a lista
              cresce, mas o foco não acompanha. Isso não é erro seu — é o método funcionando.
            </Text>

            <View style={styles.cartaoItem}>
              <Text style={styles.cartaoRotulo}>Você tentou adicionar</Text>
              <Text style={styles.cartaoTexto} numberOfLines={3}>
                {candidato}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.opcao}
              onPress={() => setTrocando(true)}
              accessibilityRole="button"
            >
              <Ionicons name="swap-horizontal" size={19} color={FOCO.base} />
              <View style={styles.opcaoTexto}>
                <Text style={styles.opcaoTitulo}>Trocar por uma que já está aqui</Text>
                <Text style={styles.opcaoDesc}>
                  Sai uma das {abertas.length} de hoje e entra esta. Bom quando a de hoje já
                  perdeu a importância.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.opcao}
              onPress={onAmanha}
              accessibilityRole="button"
            >
              <Ionicons name="calendar-outline" size={19} color={FOCO.base} />
              <View style={styles.opcaoTexto}>
                <Text style={styles.opcaoTitulo}>Deixar para amanhã</Text>
                <Text style={styles.opcaoDesc}>
                  Este item continua no Inbox e volta a aparecer amanhã. Nada se perde.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelar}
              onPress={onFechar}
              accessibilityRole="button"
            >
              <Text style={styles.cancelarTexto}>Agora não</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.titulo}>Qual sair para entrar esta?</Text>
            <Text style={styles.texto}>
              Escolha a prioridade de hoje que pode esperar. Concluída ou adiada, ela continua
              guardada.
            </Text>

            <View style={styles.lista}>
              {abertas.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.linha}
                  onPress={() => escolherTroca(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Trocar por esta: ${item.content}`}
                >
                  <Ionicons name="close-circle-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.linhaTexto} numberOfLines={2}>
                    {item.content}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.cancelar}
              onPress={voltar}
              accessibilityRole="button"
            >
              <Text style={styles.cancelarTexto}>Voltar</Text>
            </TouchableOpacity>
          </>
        )}
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
  espaco: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
    backgroundColor: FOCO.soft,
    marginBottom: theme.spacing.md,
  },
  titulo: {
    fontSize: theme.type.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  texto: {
    fontSize: theme.type.callout,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginTop: 8,
  },
  cartaoItem: {
    marginTop: theme.spacing.lg,
    marginBottom: 4,
    padding: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cartaoRotulo: {
    fontSize: theme.type.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cartaoTexto: {
    fontSize: theme.type.callout,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 4,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
    minHeight: 68,
    padding: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  opcaoTexto: {
    flex: 1,
  },
  opcaoTitulo: {
    fontSize: theme.type.callout,
    fontWeight: '700',
    color: FOCO.base,
  },
  opcaoDesc: {
    fontSize: theme.type.footnote,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginTop: 2,
  },
  lista: {
    marginTop: theme.spacing.lg,
    gap: 10,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  linhaTexto: {
    flex: 1,
    fontSize: theme.type.callout,
    color: theme.colors.text,
  },
  cancelar: {
    marginTop: theme.spacing.lg,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelarTexto: {
    fontSize: theme.type.callout,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
});