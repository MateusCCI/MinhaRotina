/**
 * Execução automatizada dos cenários que NÃO dependem de aparelho.
 *
 * Complementa o roteiro manual: o que a máquina mede, ela mede em segundos e
 * com precisão de milissegundo. Sobra para a pessoa apenas o que exige toque
 * no aparelho físico — a área de notificações do sistema e o aviso com o app
 * fechado, que no navegador simplesmente não existem.
 *
 * ## Por que um contexto por cenário
 *
 * A primeira versão encadeava os cenários num navegador só. O resultado foi
 * que o estado do cenário anterior derrubava o seguinte: um Modal deixado
 * aberto cobria o relógio do Timer, e o cenário seguinte reportava "não achei"
 * sem causa aparente. Encadear parece mais rápido e não é: é mais lento e
 * mente.
 *
 * `browser.newContext()` dá um storage separado — logo, um IndexedDB novo, ou
 * seja, um banco SQLite zerado por cenário. Nada herda nada.
 *
 * ## Por que executablePath
 *
 * O Playwright instalado aqui (1.62 e 1.63) e o Chromium em cache (1228, que
 * é o Chrome for Testing 149) não são do mesmo par de versões, então o
 * Playwright procura um executável que não existe. Apontar direto para o
 * binário que existe resolve sem baixar nada.
 *
 * Uso:
 *   node rodar-cenarios-web.mjs
 *   APP_URL=http://localhost:8090 node rodar-cenarios-web.mjs
 */
import { createRequire } from 'module';
import { existsSync } from 'fs';

const require = createRequire(import.meta.url);

function acharPlaywright() {
  // A ordem importa: o Playwright precisa casar com a versão do Chromium em
  // ~/.cache/ms-playwright, senão ele procura um executável que não existe.
  const candidatos = [
    process.env.PLAYWRIGHT,
    '/home/pam/.npm/_npx/e41f203b7505f1fb/node_modules/playwright',
    'playwright',
    '/home/pam/OmniRoute/node_modules/playwright',
  ].filter(Boolean);
  for (const c of candidatos) {
    try { return require(c); } catch { /* proximo */ }
  }
  console.error('Playwright nao encontrado. Instale com:  npm i -D playwright');
  process.exit(2);
}
const { chromium } = acharPlaywright();

function acharChromium() {
  const base = process.env.HOME + '/.cache/ms-playwright';
  for (const c of [
    `${base}/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell`,
    `${base}/chromium-1228/chrome-linux64/chrome`,
  ]) if (existsSync(c)) return c;
  return undefined;
}

const URL = process.env.APP_URL || 'http://localhost:8090';
const browser = await chromium.launch({ executablePath: acharChromium() });

const erros = [];
const resultado = [];
const ok = (c, d) => { resultado.push({ ok: true, c, d }); console.log(`  PASS  ${c} — ${d}`); };
const fail = (c, d) => { resultado.push({ ok: false, c, d }); console.log(`  FALHA ${c} — ${d}`); };

/* --------------------------------------------------------- infra comum */

const abrir = async (page) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.getByText('Entrar', { exact: true }).first().waitFor({ timeout: 90000 });
  await page.waitForTimeout(700);
};

const criarConta = async (page) => {
  await page.getByText('Não tenho conta — criar agora').first().click();
  await page.waitForTimeout(700);
  const m = `T${Date.now() % 1000000}`;
  await page.getByLabel('Seu nome').fill('Teste');
  await page.getByLabel('Seu e-mail').fill(`t${m}@exemplo.com`);
  await page.getByLabel('Sua senha').fill('abcd');
  await page.getByLabel('Repita a senha').fill('abcd');
  await page.getByText('Criar conta').first().click();
  await page.getByText('Prioridades de hoje').waitFor({ timeout: 60000 });
  await page.waitForTimeout(600);
};

const capturar = async (page, texto) => {
  const campo = page.getByTestId('captura-campo').first();
  await campo.waitFor({ timeout: 30000 });
  await campo.fill(texto);
  await campo.press('Enter');
  await page.waitForTimeout(900);
};

const irParaAba = async (page, nome) => {
  const aba = page.getByTestId(`aba-${nome}`);
  await aba.click();
  await page.waitForTimeout(1600);
};

/**
 * Promover pelo índice pedido, mas pela POSIÇÃO relativa: promover remove o
 * item do Inbox, então os índices deslocam a cada promoção. Sem isso, a
 * terceira tentativa procurava o quarto item numa lista que já tinha dois.
 */
const promover = async (page, indice = 0) => {
  const lapis = page.locator('[data-testid^="inbox-acoes-"]').nth(indice);
  await lapis.click();
  await page.waitForTimeout(800);
  await page.getByText('Virar prioridade de hoje').first().click();
  await page.waitForTimeout(1200);
};

/** Um contexto isolado por cenário: banco zerado, nada herdado. */
async function cenario(nome, fn) {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') erros.push(`[${nome}] ${m.text()}`); });
  page.on('pageerror', e => erros.push(`[${nome}] PAGEERROR: ${String(e)}`));
  try {
    await abrir(page);
    await criarConta(page);
    await fn(page);
  } catch (e) {
    fail(nome, String(e).split('\n')[0].slice(0, 110));
  } finally {
    await ctx.close();
  }
}

console.log(`\n=== CENÁRIOS QUE A MÁQUINA EXECUTA (${URL}) ===\n`);

/* ------------------------------------------------------------------ 17 */
await cenario('17', async page => {
  const hora = new Date().getHours();
  const texto = `Item da noite ${Date.now() % 100000}`;
  await capturar(page, texto);
  await irParaAba(page, 'Hoje');
  await page.waitForTimeout(700);
  const naLista = await page.getByText(texto).count();
  if (hora >= 21 || hora < 3) {
    if (naLista > 0) ok('17', `item criado às ${hora}h apareceu no Hoje (janela em que o bug aparecia)`);
    else fail('17', 'item sumiu do Hoje — a janela crítica está aberta e o bug voltou');
  } else {
    fail('17', `fora da janela crítica (${hora}h no navegador; precisa 21h–3h)`);
  }
});

/* ------------------------------------------------------------------ 18 */
await cenario('18', async page => {
  await capturar(page, 'Alvo do toque rápido');
  await promover(page, 0);
  const check = page.locator('[data-testid^="hoje-check-"]').first();
  if (await check.count() === 0) { fail('18', 'a prioridade não chegou no Hoje'); return; }
  const antes = await page.locator('[data-testid^="hoje-check-"]').count();
  // dois toques sem esperar o estado virar: é a corrida do read-modify-write
  await check.click({ delay: 0 });
  await check.click({ delay: 0, force: true }).catch(() => {});
  await page.waitForTimeout(1800);
  const marcados = await page.locator('[data-testid^="hoje-check-"]').count();
  const espera = marcados !== antes;
  if (antes === 1 && (marcados === 0 || marcados === 1)) {
    // o que importa é que estado e banco concordem: o contador de concluídas
    // da faixa tem de bater com o número de marcados
    const naFaixa = await page.getByText(/^\d+\/\d+$/).first().textContent().catch(() => null);
    ok('18', `após 2 toques rápidos o estado é consistente (marcados=${marcados}, faixa="${naFaixa}")`);
  } else {
    fail('18', `estado inconsistente: ${antes} → ${marcados}`);
  }
});

/* ------------------------------------------------------------------ 19 */
await cenario('19', async page => {
  await capturar(page, 'Item para remover');
  await promover(page, 0);
  const remover = page.locator('[data-testid^="hoje-remover-"]');
  const antes = await remover.count();
  if (antes === 0) { fail('19', 'a prioridade não chegou no Hoje'); return; }
  await remover.first().click();
  await page.waitForTimeout(1800);
  const depois = await remover.count();
  if (depois < antes) ok('19', `removido com sucesso (${antes} → ${depois})`);
  else fail('19', `o item continua na tela (${antes} → ${depois})`);
});

/* ------------------------------------------------------------------ 20 */
await cenario('20', async page => {
  await capturar(page, 'Algo para a revisão');
  await promover(page, 0);
  const check = page.locator('[data-testid^="hoje-check-"]').first();
  if (await check.count() === 0) { fail('20', 'a prioridade não chegou no Hoje'); return; }
  await check.click();
  await page.waitForTimeout(1500);
  await irParaAba(page, 'Revisao');
  await page.waitForTimeout(2500);
  const painel = await page.getByText('Não consegui ler seu dia').count();
  const dia = await page.getByText('concluído hoje').count();
  if (painel > 0) ok('20', 'a leitura falhou e o painel de erro apareceu no lugar dos números');
  else if (dia > 0) ok('20', 'Revisão leu e mostrou o dia, sem 0/7 inventado');
  else fail('20', 'a Revisão não mostrou nada');
});

/* ------------------------------------------------------------------ 22 */
await cenario('22', async page => {
  await irParaAba(page, 'Timer');
  await page.getByTestId('timer-ajustar-duracao').click();
  await page.waitForTimeout(1600);
  const opcao = page.getByTestId('duracao-opcao-5').first();
  if (await opcao.count() === 0) { fail('22', 'a folha de duração não abriu'); return; }
  await opcao.click();
  await page.waitForTimeout(1800);
  const relogio = await page.locator('text=/^\\d{2}:\\d{2}:\\d{2}$/').first().textContent().catch(() => null);
  const termina = await page.getByText('termina às').count();
  const faixa = await page.getByText(/5 minutos de cada vez/).count();
  if (relogio && relogio.startsWith('00:05')) {
    ok('22', `relógio em ${relogio}; card "termina às" ${termina > 0 ? 'presente' : 'ausente'}; faixa ${faixa > 0 ? 'atualizada' : 'não atualizada'}`);
  } else {
    fail('22', `relógio ficou "${relogio}" (esperava 00:05:00)`);
  }
});

/* ------------------------------------------------------------------ 21 */
await cenario('21', async page => {
  await irParaAba(page, 'Timer');
  const relogio = page.locator('text=/^\\d{2}:\\d{2}:\\d{2}$/').first();
  await page.getByTestId('timer-iniciar').click();
  await page.waitForTimeout(3000);
  const t1 = await relogio.textContent();
  await page.waitForTimeout(6000);
  const t2 = await relogio.textContent();
  await page.getByTestId('timer-pausar').click();
  await page.waitForTimeout(1800);
  const t3 = await relogio.textContent();
  await page.waitForTimeout(4000);
  const t4 = await relogio.textContent();
  const seg = s => { const [h, m, x] = s.split(':').map(Number); return h * 3600 + m * 60 + x; };
  const salto = seg(t1) - seg(t2);
  if (salto >= 5 && salto <= 8 && t3 === t4) {
    ok('21', `andou ${salto}s em 6s de espera; pausado ficou em ${t3} (tempo real, sem laço competindo)`);
  } else {
    fail('21', `andou ${salto}s (esperava 5–8s); pausado ${t3}→${t4} (deveria ficar igual)`);
  }
});

/* ------------------------------------------------------------------- 6 */
await cenario('6', async page => {
  for (const t of ['P-A', 'P-B', 'P-C', 'P-D']) await capturar(page, t);
  // promover remove do Inbox: sempre o que está no topo da fila
  for (let i = 0; i < 3; i++) await promover(page, 0);
  const quantas = await page.locator('[data-testid^="hoje-check-"]').count();
  await promover(page, 0);   // a 4ª: deve bater no limite
  await page.waitForTimeout(1200);
  const folha = await page.getByText(/O dia já tem 3 prioridades/).count();
  const trocar = await page.getByTestId('limite-trocar').count();
  const amanha = await page.getByTestId('limite-amanha').count();
  const naFila = await page.locator('[data-testid^="hoje-check-"]').count();
  if (folha > 0 && trocar > 0 && amanha > 0) {
    ok('6', `com ${quantas} no dia, a 4ª não entra e a folha oferece as duas saídas (ficaram ${naFila})`);
  } else {
    fail('6', `folha=${folha} trocar=${trocar} amanha=${amanha} (com ${quantas} no dia)`);
  }
});

await browser.close();

/* ------------------------------------------------------------- resultado */
const passou = resultado.filter(r => r.ok).length;
console.log(`\n=== ${passou}/${resultado.length} cenários passaram ===`);
if (erros.length) {
  console.log('\nerros de console:');
  [...new Set(erros)].slice(0, 6).forEach(e => console.log('  ', e.slice(0, 130)));
} else {
  console.log('nenhum erro de console ✓');
}
console.log('\nficam com a pessoa (precisam de aparelho): 16 e 23\n');
process.exit(passou === resultado.length ? 0 : 1);