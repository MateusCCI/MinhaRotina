# FERRAMENTAS

## nota — edição de `.docx` por LLM

Fica em `~/Note2026/docx-llm` (repositório próprio, fora deste projeto de
propósito). Roda em qualquer máquina: **não precisa de `pip` nem de
`python-docx`**, porque usa só a biblioteca padrão do Python.

Já está no PATH como `nota`.

### Por que existe

`.docx` é um ZIP de XML OOXML. Abrir e salvar num editor de texto reescreve
o XML inteiro — e **perdeu um parágrafo inteiro** do relatório aqui, sem
erro nenhum. Abaixo, um LLM tem muita chance de alinhar uma tag e errar a
aspa, e o arquivo deixa de abrir.

A ferramenta garante: **o LLM nunca toca em XML.** O caminho é sempre

    extrai  ->  texto puro (o LLM edita isso)  ->  aplica

### Comandos

```bash
nota extrai REL.docx                     # parágrafos numerados
nota extrai REL.docx --json              # para o LLM consumir

nota troca REL.docx "velho" "novo"       # recusa se o texto for ambíguo
nota troca REL.docx "velho" "novo" --todos
nota troca REL.docx "velho" "novo" --dry-run

nota capa REL.docx "Minha Rotina"        # título da capa

nota preenche REL.docx "6.6 Integração" "texto do parágrafo"

nota conta REL.docx --secao RESUMO --max 150

nota confere ANTES.docx DEPOIS.docx      # o que mudou e o que sumiu
nota valida REL.docx                     # zip + XML + conversão
nota testa                               # prova de vida
```

### O fluxo seguro

```bash
cp docs/MinhaRotina-PI.docx /tmp/trabalho.docx
nota extrai /tmp/trabalho.docx --json > /tmp/doc.json
# edite o JSON (aqui pode usar LLM à vontade)

nota troca /tmp/trabalho.docx "velho" "novo"
nota valida /tmp/trabalho.docx
nota confere docs/MinhaRotina-PI.docx /tmp/trabalho.docx

# só se passou:
cp /tmp/trabalho.docx docs/MinhaRotina-PI.docx
```

### Por que `confere` é o comando mais importante

`valida` só prova que o arquivo **abre**. Um `.docx` pode abrir
perfeitamente depois de um editor reescrever o XML e deixar um parágrafo a
menos. Backup restaura; **diff denuncia**.

`confere` sai com código 1 quando há perda acima da tolerância:

```bash
nota valida novo.docx && nota confere velho.docx novo.docx || echo "PAROU"
```

Ele também aponta **seções com corpo vazio** — sinal mais forte que a
contagem de palavras, porque uma seção vazia pode custar zero palavras e
ainda assim estar quebrada.

### Limites

- Só edita o corpo de `word/document.xml`. Não mexe em cabeçalho, rodapé,
  nota de rodapé nem caixa de texto.
- Não cria documento do zero; edita um `.docx` existente.
- `preenche` escreve só no primeiro parágrafo vazio de uma seção.
- Não conhece campos dinâmicos (índice, sumário, número de página).
- Sem LibreOffice instalado, a trava de conversão não roda — as outras três
  seguram.

Documentação completa em `~/Note2026/docx-llm/README.md`.
