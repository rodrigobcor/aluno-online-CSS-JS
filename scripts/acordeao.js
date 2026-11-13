/**
 * Script de ativação do acordeão.
 *
 * Fonte: adaptado de:
 * - https://codepen.io/jopico/pen/kyRprJ (estrutura geral);
 * - https://codepen.io/arjancodes/pen/gbweYB (trechos da função de alternância);
 * - https://www.w3schools.com/howto/howto_js_accordion.asp (animação)
 *
 * Depende de `utilidades.js`, `dados-das-disciplinas.js` e (opcionalmente)
 * `tabela-de-planejamento.js`.
 *
 * Mudanças em relação à versão anterior:
 * - NENHUMA requisição é feita ao carregar o script (antes havia uma chamada
 *   com id fixo, `getDetalhesDisciplinas(10814)`); os detalhes são carregados
 *   somente na primeira vez que cada linha é expandida, uma disciplina por vez;
 * - a leitura da resposta usa `DOMParser` e o charset correto (ver `dados-das-disciplinas.js`);
 * - cliques tratados por delegação (funcionam em linhas inseridas depois);
 * - teclado (Enter/Espaço) e `aria-expanded` no gatilho;
 * - o zebrado é recalculado em JS, respeitando a ordem visual (`order` do CSS).
 */

/**
 * Abre ou fecha o acordeão de uma disciplina.
 *
 * @param {HTMLTableRowElement} linha A linha `tr.dados-disciplina`.
 */
function alternarAcordeao(linha) {
  const detalhes = linha?.querySelector(":scope > td.detalhes-disciplina");
  if (!detalhes) return;

  const abrir = !linha.classList.contains("open");
  linha.classList.toggle("open", abrir);
  detalhes.classList.toggle("open", abrir);
  detalhes.classList.toggle("fold", !abrir); // `.fold` esconde (display: none) no CSS
  linha.querySelector(":scope > td.disciplina-periodo")?.setAttribute("aria-expanded", String(abrir));

  if (abrir) {
    carregarDetalhesSeNecessario(linha);
  }
}

/**
 * Obtém o identificador numérico (texto) da disciplina de uma linha.
 */
function obterIdDaDisciplina(linha) {
  if (linha.dataset.idDisciplina) {
    return linha.dataset.idDisciplina;
  }
  const marcador = linha.querySelector('[id^="detalhes-disciplina-"]');
  const idNoMarcador = marcador?.id.match(/(\d+)$/)?.[1];
  const idNoLink = linha.querySelector("a[onclick]")?.getAttribute("onclick")
    .match(/consultarDisciplina\(\s*\w+\s*,\s*['"]?(\d+)/)?.[1];
  const id = idNoMarcador || idNoLink;
  return id ? String(parseInt(id, 10)) : null;
}

/**
 * Lê, na própria linha, os dois campos que pertencem à listagem (e não à página de consulta).
 */
function lerDadosDaLinha(linha) {
  return {
    TEM_TURMA_NO_PERIODO: linha.querySelector(".texto-periodo-sugerido")?.textContent.trim() || DADO_NAO_ENCONTRADO,
    TRAVA_DE_CREDITO: linha.querySelector(".disciplina-trava-credito")?.dataset.creditosNecessarios
      ?? linha.querySelector(".disciplina-trava-credito")?.textContent.trim()
      ?? DADO_NAO_ENCONTRADO
  };
}

/**
 * Carrega os detalhes (dados gerais, requisitos e turmas) da disciplina
 * na primeira vez em que o acordeão é aberto.
 *
 * @param {HTMLTableRowElement} linha A linha `tr.dados-disciplina`.
 */
async function carregarDetalhesSeNecessario(linha) {
  const alvo = linha.querySelector(":scope > td.detalhes-disciplina");
  const pendente = alvo?.querySelector('[data-detalhes-carregados="false"], [id^="detalhes-disciplina-"]');
  if (!pendente || pendente.dataset.carregando === "true") return;

  const id = obterIdDaDisciplina(linha);
  if (!id) {
    pendente.textContent = "Não foi possível identificar a disciplina.";
    return;
  }

  pendente.dataset.carregando = "true";
  pendente.textContent = "Carregando detalhes...";
  try {
    const detalhes = await obterDetalhesDisciplina(id);
    const disciplina = mesclarDetalhes(lerDadosDaLinha(linha), detalhes);
    const blocoDoCabecalho = pendente.closest(".divContentBlock");

    // os dados gerais substituem o marcador; requisitos e turmas vêm logo após o bloco do cabeçalho
    pendente.insertAdjacentHTML("afterend", preencherModeloDadosGerais(disciplina));
    blocoDoCabecalho.insertAdjacentHTML("afterend", preencherModeloRequisitosETurmas(disciplina));
    pendente.remove();

    if (typeof prepararTurmas === "function") {
      prepararTurmas(alvo);
    }
  } catch (erro) {
    console.error("Erro ao consultar página.\nDetalhes técnicos:", erro);
    pendente.dataset.carregando = "false";
    pendente.dataset.detalhesCarregados = "false";
    pendente.textContent = "Não foi possível carregar os detalhes. Feche e abra novamente para tentar de novo.";
  }
}

/**
 * Recalcula o zebrado considerando a ORDEM VISUAL das linhas:
 * disciplinas não atendidas primeiro, atendidas depois (regra `order` do CSS).
 */
function atualizarZebra() {
  const tbody = document.querySelector("#tabela-disciplinas > tbody");
  if (!tbody) return;
  const linhas = Array.from(tbody.querySelectorAll(":scope > tr.dados-disciplina"));
  const atendida = linha => linha.classList.contains("disciplina-atendida");
  [...linhas.filter(l => !atendida(l)), ...linhas.filter(atendida)]
    .forEach((linha, indice) => linha.classList.toggle("zebra", indice % 2 === 1));
}

/**
 * Ativa o acordeão da tabela de disciplinas. Pode ser chamada de novo
 * (por exemplo, depois de inserir novas linhas) sem duplicar listeners.
 */
function ativarAcordeao() {
  const tbody = document.querySelector("#tabela-disciplinas > tbody");
  if (!tbody) return;

  if (!tbody.dataset.acordeaoAtivo) {
    tbody.dataset.acordeaoAtivo = "true";
    const linhaDoGatilho = evento => {
      const gatilho = evento.target.closest("td.disciplina-periodo");
      return gatilho && tbody.contains(gatilho) ? gatilho.closest("tr.dados-disciplina") : null;
      // apenas a célula do período expande; para a linha inteira, use `evento.target.closest("tr.dados-disciplina")`
    };
    tbody.addEventListener("click", evento => alternarAcordeao(linhaDoGatilho(evento)));
    tbody.addEventListener("keydown", evento => {
      if (evento.key !== "Enter" && evento.key !== " ") return;
      const linha = linhaDoGatilho(evento);
      if (linha) {
        evento.preventDefault();
        alternarAcordeao(linha);
      }
    });
  }

  tbody.querySelectorAll(":scope > tr.dados-disciplina > td.disciplina-periodo").forEach(gatilho => {
    gatilho.tabIndex = 0;
    gatilho.setAttribute("role", "button");
    gatilho.setAttribute("aria-expanded", String(gatilho.parentElement.classList.contains("open")));
  });
  atualizarZebra();
}

quandoPronto(ativarAcordeao);
