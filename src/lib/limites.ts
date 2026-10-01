/**
 * Limites do produto em um só lugar.
 *
 * Antes o número 3 vivia em dois lugares: hardcoded no `insertHojeItem` e
 * declarado como `MAX_FOCUS` na tela Hoje. Quando um mudou e o outro não,
 * o banco recusava enquanto a tela dizia que havia espaço (ou o contrário) —
 * e nenhum teste pegou, porque os dois caminhos pareciam corretos isolados.
 * Fonte única resolve por construção: não existe como divergirem.
 */

/**
 * Quantas prioridades o dia aceita, conforme o escopo do TAP.
 *
 * É limite, e não sugestão: o produto assume que a restrição é parte do
 * método. Por isso a tela nunca deixa a pessoa num beco — ao chegar ao
 * limite, ela escolhe entre trocar uma das abertas ou deixar a nova para
 * amanhã.
 */
export const LIMITE_FOCO_DIA = 3;

/** A partir de quantas ideias no Inbox aparece o convite a promote e limpar. */
export const LIMITE_LIMPEZA_INBOX = 5;