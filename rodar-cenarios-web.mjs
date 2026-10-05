/**
 * Execução automatizada dos cenários que NÃO dependem de aparelho.
 *
 * Complementa o roteiro manual: o que a máquina mede, ela mede em segundos e
 * com precisão de milissegundo. Sobra para a pessoa apenas o que exige toque
 * no aparelho físico — a área de notificações do sistema e o aviso com o app
 * fechado, que no navegador simplesmente não existem.
 *
 * Uso:  node rodar-cenarios-web.mjs
 *
 * O Playwright não é dependência deste projeto (a app é o produto, não os
 * testes), então ele é procurado nos lugares onde costuma estar instalado em
 * vez de vir no package.json. Para fixar um caminho:
 *   PLAYWRIGHT=/caminho/para/playwright node rodar-cenarios-web.mjs
 */
import { createRequire } from 'module';
import { existsSync } from 'fs';
const require = createRequire(import.meta.url);

function acharPlaywright() {
  // A ordem importa: o Playwright precisa casar com a versão do Chromium em
  // ~/.cache/ms-playwright, senão ele procura um executável que não existe.
  // Por isso o cache do npx (1.63.0 / chromium-1228) vem antes do OmniRoute
  // (1.62.1 / chromium-1234, que não está instalado).
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
  console.error('Ou aponte PLAYWRIGHT=/caminho/do/pacote/playwright');
  process.exit(2);
}
const { chromium } = acharPlaywright();

const URL = process.env.APP_URL || 'http://localhost:8090';
const erros = [];
const resultado = [];

function ok(cenario, detalhe) {
  resultado.push({ ok: true, cenario, detalhe });
  console.log(`  PASS  ${cenario} — ${detalhe}`);
}
function fail(cenario, detalhe) {
  resultado.push({ ok: false, cenario, detalhe });
  console.log(`  FALHA ${cenario} — ${detalhe}`);
}

/**
 * O Playwright instalado aqui (1.62 e 1.63) e o Chromium em cache (1228, que
 * e o Chrome for Testing 149) nao sao do mesmo par de versoes, entao o
 * Playwright procura um executavel que nao existe. Apontar direto para o
 * binario que existe resolve sem baixar nada — e o protocolo CDP e estavel
 * entre versoes recentes.
 */
function acharChromium() {
  const base = process.env.HOME + '/.cache/ms-playwright';
  const candidatos = [
    `${base}/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell`,
    `${base}/chromium-1228/chrome-linux64/chrome`,
  ];
  for (const c of candidatos) if (existsSync(c)) return c;
  return undefined;
}

const browser = await chromium.launch({
  executablePath: acharChromium(),
});
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });

// erro de console é falha silenciosa: o app "parece funcionar" escondendo
// problema. Capturar é o único jeito de ver.
page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
page.on('pageerror', e => erros.push(String(e)));

async function novoPerfil(n) {
  // O app abre no modo login. "Não tenho conta" é a única saída para o
  // cadastro — e o formulário de registro só existe depois dessa troca.
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  // Esperar o React montar antes de clicar: o clique anterior era disparado
  // sobre uma tela ainda vazia e se perdia.
  await page.getByText('Entrar', { exact: true }).first().waitFor({ timeout: 90000 });
  await page.waitForTimeout(600);
  const alternar = page.getByText('Não tenho conta — criar agora');
  if (await alternar.count()) {
    await alternar.first().click();
    await page.waitForTimeout(700);
  }
  await page.getByLabel('Seu nome').waitFor({ timeout: 60000 });
  const marca = `T${Date.now() % 100000}`;
  await page.getByLabel('Seu nome').fill(`Teste ${marca}`);
  await page.getByLabel('Seu e-mail').fill(`t${marca}@exemplo.com`);
  await page.getByLabel('Sua senha').fill('abcd');
  await page.getByLabel('Repita a senha').fill('abcd');
  await page.getByText('Criar conta').first().click();
  // a tela do Hoje só aparece depois que o banco local abre
  await page.getByText('Prioridades de hoje').waitFor({ timeout: 60000 });
  await page.waitForTimeout(600);
  return marca;
}

async function irParaAba(nome) {
  const aba = page.getByText(nome, { exact: true }).first();
  await aba.click();
  await page.waitForTimeout(1500);
}

async function capturar(texto) {
  const campo = page.getByPlaceholder('Despeje aqui, sem filtro').first();
  await campo.waitFor({ timeout: 30000 });
  await campo.fill(texto);
  await campo.press('Enter');
  await page.waitForTimeout(1000);
  return texto;
}

console.log('\n===CENÁRIOS QUE A MÁQUINA EXECUTA ===\n');

/* ---------------------------------------------------------------- 17 */
console.log('Cenário 17 — item da noite não some do Hoje');
{
  const hora = new Date().getHours();
  const naJanela = hora >= 21 || hora < 3;
  const marca = await novoPerfil(1);
  const texto = await capturar(`Item da noite ${marca}`);
  await irParaAba('Hoje');
  await page.waitForTimeout(800);
  const naLista = await page.getByText(texto).count();
  if (naJanela) {
    // o bug antigo apagava daqui as 21h
    if (naLista > 0) ok('17', `item criado às ${hora}h apareceu no Hoje (janela crítica)`);
    else fail('17', 'item sumiu do Hoje — a janela em que o bug aparecia');
  } else {
    fail('17', `fora da janela crítica (${hora}h): precisa rodar entre 21h e 3h`);
  }
}

/* ---------------------------------------------------------------- 18 */
console.log('Cenário 18 — toques rápidos no checkbox');
{
  await irParaAba('Hoje');
  await page.waitForTimeout(800);
  const alvos = page.getByLabel('Concluir');
  const quantos = await alvos.count();
  if (quantos === 0) {
    fail('18', 'nenhuma prioridade na lista para testar');
  } else {
    const antes = await page.getByLabel('Desmarcar').count();
    // dois toques bem rapidos, sem esperar o estado virar
    await alvos.first().click({ delay: 0 });
    await alvos.first().click({ delay: 0, force: true }).catch(() => {});
    await page.waitForTimeout(1500);
    const depois = await page.getByLabel('Desmarcar').count();
    if (depois !== antes) ok('18', `estado mudou de forma consistente (${antes} → ${depois} marcados)`);
    else fail('18', `estado não acompanhou o toque (${antes} → ${depois})`);
  }
}

/* ---------------------------------------------------------------- 22 */
console.log('Cenário 22 — duração configurável');
{
  await irParaAba('Timer');
  await page.getByLabel(/Ajustar duração do bloco/).click();
  await page.waitForTimeout(1500);
  // exato: '5 minutos' como substring casa dentro de '25 minutos', que e o
  // texto do cabecalho e nao a opcao.
  const opcao5 = page.getByText('5 minutos', { exact: true }).first();
  const opcoes = await opcao5.count();
  if (opcoes > 0) {
    await opcao5.click({ force: true });
    await page.waitForTimeout(1500);
    const relogio = await page.locator('text=/^0[0-9]:[0-9]{2}$/').first().textContent().catch(() => null);
    const termina = await page.getByText('termina às').count();
    if (relogio && relogio.startsWith('05')) ok('22', `relógio em ${relogio} após escolher 5 min; card "termina às" presente: ${termina > 0}`);
    else fail('22', `relógio ficou "${relogio}" (esperava começar em 05:xx)`);
  } else {
    fail('22', 'folha de duração não abriu');
  }
}

/* ---------------------------------------------------------------- 21 */
console.log('Cenário 21 — Timer: pausar/retomar sem acelerar');
{
  const relogio = page.locator('text=/^\\d{2}:\\d{2}:\\d{2}$/').first();
  await page.getByLabel('Iniciar foco').click();
  await page.waitForTimeout(3000);
  const t1 = await relogio.textContent();
  await page.waitForTimeout(6000);
  const t2 = await relogio.textContent();
  await page.getByLabel('Pausar foco').click();
  await page.waitForTimeout(2000);
  const t3 = await relogio.textContent();
  await page.waitForTimeout(4000);
  const t4 = await relogio.textContent();

  const seg = s => { const [h, m, x] = s.split(':').map(Number); return h * 3600 + m * 60 + x; };
  const caiu = seg(t2) < seg(t1);          // deve andar para baixo
  const parou = t3 === t4;                  // pausado não pode andar
  const salto = seg(t1) - seg(t2);         // ~6s de espera

  if (caiu && parou && salto >= 5 && salto <= 8) {
    ok('21', `andou ${salto}s em 6s de espera (tempo real); pausado ficou parado em ${t3}`);
  } else {
    fail('21', `caiu=${caiu} parou=${parou} salto=${salto}s (esperava 5–8s) — ${t1}→${t2}, pausado ${t3}→${t4}`);
  }
}

/* ---------------------------------------------------------------- 6 */
console.log('Cenário 6 — limite de 3 com saída (trocar ou adiar)');
{
  await irParaAba('Hoje');
  await page.waitForTimeout(600);
  for (const t of ['Prior A', 'Prior B', 'Prior C', 'Prior D']) await capturar(t);
  for (const t of ['Prior A', 'Prior B', 'Prior C']) {
    const lapis = page.getByLabel(`Ações para ${t}`);
    if (await lapis.count()) {
      await lapis.first().click();
      await page.waitForTimeout(500);
      await page.getByText('Virar prioridade de hoje').first().click();
      await page.waitForTimeout(900);
    }
  }
  const lapisD = page.getByLabel('Ações para Prior D');
  if (await lapisD.count()) {
    await lapisD.first().click();
    await page.waitForTimeout(500);
    await page.getByText('Virar prioridade de hoje').first().click();
    await page.waitForTimeout(1000);
    const folha = await page.getByText(/O dia já tem 3 prioridades/).count();
    const trocar = await page.getByText('Trocar por uma que já está aqui').count();
    const amanha = await page.getByText('Deixar para amanhã').count();
    if (folha > 0 && trocar > 0 && amanha > 0) {
      ok('6', `folha do limite abriu com as duas saídas (trocar: ${trocar > 0}, adiar: ${amanha > 0})`);
    } else {
      fail('6', `folha abriu mas sem as saídas (folha=${folha}, trocar=${trocar}, amanha=${amanha})`);
    }
  } else {
    fail('6', 'item Prior D não apareceu no Inbox');
  }
}

/* ---------------------------------------------------------------- 20 */
console.log('Cenário 20 — Revisão não inventa número');
{
  await page.getByText('Revisão').first().click();
  await page.waitForTimeout(2500);
  const painel = await page.getByText('Não consegui ler seu dia').count();
  const leitura = await page.getByText('concluído hoje').count();
  if (painel === 0 && leitura > 0) {
    ok('20', 'Revisão leu e mostrou o dia, sem o painel de erro e sem 0/7 inventado');
  } else if (painel > 0) {
    ok('20', 'leitura falhou e o painel de erro apareceu no lugar dos números (comportamento correto)');
  } else {
    fail('20', 'Revisão ficou sem mostrar nada');
  }
}

/* --------------------------------------------------------------- 19 */
console.log('Cenário 19 — remover do Hoje sem sumir em silêncio');
{
  await page.getByText('Hoje').first().click();
  await page.waitForTimeout(1500);
  const remover = page.getByLabel('Remover do hoje');
  const quantos = await remover.count();
  if (quantos === 0) {
    fail('19', 'nenhuma prioridade do dia para remover');
  } else {
    await remover.first().click();
    await page.waitForTimeout(1500);
    const depois = await remover.count();
    if (depois < quantos) ok('19', `removido com sucesso (${quantos} → ${depois})`);
    else fail('19', `o item continua lá (${quantos} → ${depois})`);
  }
}

await browser.close();

/* ------------------------------------------------------------ resumo */
const passou = resultado.filter(r => r.ok).length;
console.log(`\n=== ${passou}/${resultado.length} cenários passaram ===\n`);
if (resultados_com_erro()) {
  console.log('erros de console capturados:');
  erros.slice(0, 5).forEach(e => console.log('  ', e.slice(0, 140)));
  console.log('');
} else {
  console.log('nenhum erro de console ✓\n');
}
function resultados_com_erro() { return erros.length > 0; }

process.exit(passou === resultado.length ? 0 : 1);
