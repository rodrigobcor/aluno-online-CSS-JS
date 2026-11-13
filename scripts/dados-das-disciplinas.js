/**
 * Extração de dados do Aluno Online e geração do HTML reformatado.
 *
 * Depende de `utilidades.js`.
 *
 * Princípios desta versão:
 * - nenhum recorte de HTML por posição fixa nem regex sobre HTML:
 *   a leitura é feita com `DOMParser`;
 * - a resposta do servidor é decodificada com o charset correto (ISO-8859-1);
 * - nenhum dado fictício é exibido: o que não foi extraído aparece
 *   como "dado não encontrado";
 * - identificadores de disciplina são sempre TEXTO (evita o problema do octal);
 * - todo conteúdo vindo do servidor é escapado antes de ir para o HTML.
 */

const DADO_NAO_ENCONTRADO = "Dado não encontrado. Acesse a interface padrão do sistema.";
const INTERVALO_ENTRE_REQUISICOES_MS = 300;
const VALIDADE_DO_CACHE_MS = 5 * 60 * 1000; // vagas mudam, então o cache é curto

/* ------------------------------------------------------------------ */
/* Rede: fila, decodificação e cache                                   */
/* ------------------------------------------------------------------ */

let filaDeRequisicoes = Promise.resolve();

/**
 * Executa as requisições uma de cada vez, com intervalo entre elas,
 * para não sobrecarregar o servidor da universidade.
 *
 * @param {Function} tarefa Função (assíncrona) que faz a requisição.
 */
function enfileirar(tarefa) {
  const resultado = filaDeRequisicoes.then(tarefa);
  filaDeRequisicoes = resultado.catch(() => { }).then(() => esperar(INTERVALO_ENTRE_REQUISICOES_MS));
  return resultado;
}

/**
 * Lê o corpo da resposta usando o charset informado pelo servidor
 * (cabeçalho ou `<meta>`), com ISO-8859-1 como padrão. `response.text()`
 * sempre assume UTF-8 e corromperia os acentos.
 *
 * @param {Response} resposta A resposta do `fetch`.
 * @returns {Promise<string>} O texto decodificado.
 */
async function decodificarResposta(resposta) {
  const buffer = await resposta.arrayBuffer();
  const contentType = resposta.headers.get("content-type") || "";
  let charset = (contentType.match(/charset=([^;\s]+)/i) || [])[1];
  if (!charset) {
    const previa = new TextDecoder("iso-8859-1").decode(buffer.slice(0, 2048));
    charset = (previa.match(/charset=["']?([\w-]+)/i) || [])[1];
  }
  try {
    return new TextDecoder(charset || "iso-8859-1").decode(buffer);
  } catch (erro) {
    return new TextDecoder("iso-8859-1").decode(buffer);
  }
}

/**
 * Busca (somente leitura) a página de consulta de uma disciplina.
 * Equivale ao envio do formulário `output` feito por `consultarDisciplina`,
 * mas sem navegar para fora da página atual.
 *
 * @param {string} id O identificador numérico da disciplina.
 * @returns {Promise<string>} O HTML da página de consulta.
 */
async function buscarHtmlDisciplina(id) {
  const form = document.querySelector('form[name="output"]') || document.querySelector("form");
  if (!form) {
    throw new ReferenceError("Formulário da página não encontrado.");
  }
  const dados = new URLSearchParams(new FormData(form)); // mesmo formato do envio nativo
  dados.set("disciplinas[0]", id);

  const resposta = await fetch(form.getAttribute("action") || window.location.href, {
    method: "POST",
    body: dados,
    credentials: "same-origin"
  });
  if (!resposta.ok) {
    throw new Error(`O servidor respondeu com o status ${resposta.status}.`);
  }
  return decodificarResposta(resposta);
}

/**
 * Obtém (e guarda em cache por poucos minutos) os detalhes estruturados
 * de uma disciplina: dados gerais, requisitos e turmas.
 *
 * Essa função não altera nenhum dado do servidor original.
 *
 * @param {string|number} idDisciplina O identificador numérico da disciplina.
 * @returns {Promise<object>} Os detalhes da disciplina.
 */
async function obterDetalhesDisciplina(idDisciplina) {
  if (!idDisciplina) {
    throw new SyntaxError("Para obter os detalhes da disciplina, "
      + "é necessário informar o código identificador (somente números).");
  }
  const id = String(parseInt(idDisciplina, 10));
  const chave = `ao:detalhes:${id}`;

  try {
    const salvo = JSON.parse(sessionStorage.getItem(chave) || "null");
    if (salvo && Date.now() - salvo.instante < VALIDADE_DO_CACHE_MS) {
      return salvo.detalhes;
    }
  } catch (erro) { /* cache indisponível: segue sem ele */ }

  const html = await enfileirar(() => buscarHtmlDisciplina(id));
  const documento = new DOMParser().parseFromString(html, "text/html");
  const detalhes = extrairDetalhesDaPagina(documento);

  try {
    sessionStorage.setItem(chave, JSON.stringify({ instante: Date.now(), detalhes }));
  } catch (erro) { /* cache indisponível: segue sem ele */ }
  return detalhes;
}

async function testGetDetalhesDisciplinas(codDisciplina) {
  codDisciplina = codDisciplina || "10815"; // um código (válido) qualquer
  console.log(await obterDetalhesDisciplina(codDisciplina));
}

/* ------------------------------------------------------------------ */
/* Extração: lista de disciplinas                                      */
/* ------------------------------------------------------------------ */

/**
 * Texto de um nó, sem espaços repetidos nem `&nbsp;`.
 */
function textoLimpo(no) {
  return (no?.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * NOTA: Essa função extrai os dados de TODAS as disciplinas da lista,
 * mas SEM nenhuma requisição ao servidor (lê apenas a página atual).
 * Os detalhes (requisitos, turmas...) são obtidos sob demanda,
 * por `obterDetalhesDisciplina`.
 *
 * @param {ParentNode} [raiz] Onde procurar a tabela (padrão: a página atual).
 * @returns {object[]} Uma lista de objetos JSON, cada um com os dados de uma disciplina.
 */
function extrairDadosGeraisDisciplinas(raiz = document) {
  const tabela = raiz.querySelector("table.reportTable");
  if (!tabela) {
    throw new ReferenceError("Não foi possível encontrar a tabela de disciplinas");
  }
  return Array.from(tabela.querySelectorAll("tr"))
    .filter(linha => linha.querySelector("td"))
    .map(extrairDadosDisciplina)
    .filter(Boolean);
}

/**
 * Extrai os dados de uma linha da lista de disciplinas.
 * Esta função é compatível com a versão do sistema disponibilizada no período 2025/1:
 * colunas Disciplina, Período, Atendida?, Tipo, Ramif., Cred., CH Total,
 * Trava Crédito e "Turma no Período?".
 *
 * @param {HTMLTableRowElement|string} linhaOuHtml O `<tr>` (ou o HTML dele).
 * @returns {object|null} Um objeto JSON com os dados da disciplina, ou `null` se a linha não for reconhecida.
 */
function extrairDadosDisciplina(linhaOuHtml) {
  let linha = linhaOuHtml;
  if (typeof linhaOuHtml === "string") {
    const modelo = document.createElement("template");
    const html = /^\s*<tr/i.test(linhaOuHtml) ? linhaOuHtml : `<tr>${linhaOuHtml}</tr>`;
    modelo.innerHTML = `<table><tbody>${html}</tbody></table>`;
    linha = modelo.content.querySelector("tr");
  }
  const celulas = Array.from(linha?.cells || []);
  if (celulas.length < 9) {
    return null;
  }

  const identificacao = textoLimpo(celulas[0]).match(/([A-Z]{3}\d{2})-(\d{5})\s+(.+)/);
  if (!identificacao) {
    return null;
  }
  const onclick = celulas[0].querySelector("a")?.getAttribute("onclick") || "";
  const idNoLink = (onclick.match(/consultarDisciplina\(\s*\w+\s*,\s*['"]?(\d+)/) || [])[1];

  return normalizarDadosDisciplina({
    CODIGO_DEPARTAMENTO: identificacao[1],
    CODIGO_CINCO_ULTIMOS_NUMEROS: identificacao[2],
    CODIGO: `${identificacao[1]}-${identificacao[2]}`,
    ID_DISCIPLINA: String(parseInt(idNoLink || identificacao[2], 10)),
    NOME: identificacao[3],
    PERIODO: textoLimpo(celulas[1]),
    FOI_ATENDIDA: textoLimpo(celulas[2]),
    TIPO: textoLimpo(celulas[3]),
    CODIGO_RAMIFICACAO: textoLimpo(celulas[4]),
    NUM_CREDITOS: textoLimpo(celulas[5]),
    CARGA_HORARIA_TOTAL: textoLimpo(celulas[6]),
    TRAVA_DE_CREDITO: textoLimpo(celulas[7]),
    TEM_TURMA_NO_PERIODO: textoLimpo(celulas[8])
  });
}

/**
 * Completa/uniformiza os campos de uma disciplina, aceitando também o
 * formato antigo do JSON (sem `CODIGO_DEPARTAMENTO`, `CODIGO_CINCO_ULTIMOS_NUMEROS`
 * e `ID_DISCIPLINA`, e com `EH_PERIODO_SUGERIDO`).
 *
 * A coluna original do sistema se chama "Turma no Período?" e indica se há
 * turma ofertada neste período letivo — por isso o campo agora se chama
 * `TEM_TURMA_NO_PERIODO`.
 *
 * @param {object} disciplina Os dados da disciplina.
 * @returns {object} Uma cópia normalizada.
 */
function normalizarDadosDisciplina(disciplina) {
  const resultado = { ...disciplina };
  if (resultado.EH_PERIODO_SUGERIDO !== undefined && resultado.TEM_TURMA_NO_PERIODO === undefined) {
    resultado.TEM_TURMA_NO_PERIODO = resultado.EH_PERIODO_SUGERIDO;
  }
  delete resultado.EH_PERIODO_SUGERIDO;

  const partes = String(resultado.CODIGO || "").match(/^([A-Z]{3}\d{2})-(\d{5})$/);
  if (partes) {
    resultado.CODIGO_DEPARTAMENTO = resultado.CODIGO_DEPARTAMENTO || partes[1];
    resultado.CODIGO_CINCO_ULTIMOS_NUMEROS = resultado.CODIGO_CINCO_ULTIMOS_NUMEROS || partes[2];
    resultado.ID_DISCIPLINA = resultado.ID_DISCIPLINA || String(parseInt(partes[2], 10));
  }
  resultado.PERIODO = String(resultado.PERIODO ?? "").trim() || "-";
  return resultado;
}

/* ------------------------------------------------------------------ */
/* Extração: página de consulta de uma disciplina                      */
/* ------------------------------------------------------------------ */

const ROTULOS_DADOS_GERAIS = {
  "Número de créditos": "NUM_CREDITOS",
  "Carga Horária Total": "CARGA_HORARIA_TOTAL",
  "Carga Horária Semanal": "CARGA_HORARIA_SEMANAL",
  "Oferecida como Universal": "EH_UNIVERSAL",
  "Permite Conflito de Horário": "PERMITE_CONFLITO_HORARIO",
  "Permite Situação em Preparo": "PERMITE_EM_PREPARO",
  "Tipo de Aprovação": "TIPO_APROVACAO",
  "Tempo de Duração": "TEMPO_DURACAO"
};

/**
 * Extrai os detalhes de uma disciplina a partir da página de consulta.
 *
 * @param {Document} documento A página de consulta já interpretada.
 * @returns {object} Dados gerais complementares, `REQUISITOS` e `TURMAS`.
 */
function extrairDetalhesDaPagina(documento) {
  const detalhes = extrairDadosGeraisDaConsulta(documento);
  detalhes.REQUISITOS = extrairRequisitosDaConsulta(documento);
  detalhes.TURMAS = extrairTurmasDaConsulta(documento);
  return detalhes;
}

function extrairDadosGeraisDaConsulta(documento) {
  const dados = {};
  documento.querySelectorAll("div").forEach(div => {
    if (div.children.length > 0) return; // só divs "folha"
    const partes = textoLimpo(div).match(/^(.+?)\s*[:?]\s*(.*)$/); // "Rótulo: valor" ou "Rótulo? valor"
    const campo = partes && ROTULOS_DADOS_GERAIS[partes[1].trim()];
    if (campo) {
      dados[campo] = partes[2] || DADO_NAO_ENCONTRADO;
    }
  });
  return dados;
}

const ROTULOS_REQUISITOS = ["Pré-Requisito", "Co-Requisito", "Trava"];

/**
 * Extrai os requisitos (pré-requisitos, co-requisitos e travas de crédito).
 * Uma linha com "ou" entre disciplinas representa alternativas.
 *
 * @param {Document} documento A página de consulta já interpretada.
 * @returns {object[]} A lista de requisitos (vazia se não houver nenhum).
 */
function extrairRequisitosDaConsulta(documento) {
  const requisitos = [];
  documento.querySelectorAll("b").forEach(rotulo => {
    const nomeDoRotulo = textoLimpo(rotulo).replace(/:$/, "");
    if (!ROTULOS_REQUISITOS.includes(nomeDoRotulo)) return;
    const celulaDoValor = rotulo.parentElement?.nextElementSibling;
    if (!celulaDoValor) return;

    // separa as alternativas pelos <b>ou</b>
    const alternativas = [];
    let atual = "";
    celulaDoValor.childNodes.forEach(no => {
      if (no.nodeType === 1 && no.tagName === "B" && /^ou$/i.test(textoLimpo(no))) {
        alternativas.push(atual);
        atual = "";
      } else if (!(no.nodeType === 1 && no.tagName === "BR")) {
        atual += no.textContent + " ";
      }
    });
    alternativas.push(atual);
    const itens = alternativas.map(texto => textoLimpo({ textContent: texto })).filter(Boolean);
    if (itens.length === 0) return;

    if (nomeDoRotulo === "Trava") {
      requisitos.push({ TIPO_REQUISITO: "TRAVA_DE_CREDITO", ROTULO: nomeDoRotulo, TEXTO: itens[0] });
      return;
    }
    const comoRequisito = (texto, tipo) => {
      const partes = texto.match(/^([A-Z]{3}\d{2}-\d{5})\s+(.+)$/);
      return {
        TIPO_REQUISITO: tipo,
        CODIGO_REQUISITO_DISCIPLINA: partes ? partes[1] : "",
        NOME_REQUISITO_DISCIPLINA: partes ? partes[2] : texto
      };
    };
    if (itens.length === 1) {
      requisitos.push({ ...comoRequisito(itens[0], "REQUISITO_SEM_OPCOES_ALTERNATIVAS"), ROTULO: nomeDoRotulo });
    } else {
      requisitos.push({
        TIPO_REQUISITO: "REQUISITO_COM_OPCOES_ALTERNATIVAS",
        ROTULO: nomeDoRotulo,
        ALTERNATIVAS_REQUISITO: itens.map(item => comoRequisito(item, "REQUISITO_ALTERNATIVO"))
      });
    }
  });
  return requisitos;
}

/**
 * Extrai as turmas da disciplina (id, docente, horários e vagas).
 *
 * @param {Document} documento A página de consulta já interpretada.
 * @returns {object[]} A lista de turmas.
 */
function extrairTurmasDaConsulta(documento) {
  return Array.from(documento.querySelectorAll('td[style*="border-style: solid"]'))
    .map(extrairDadosTurma)
    .filter(Boolean);
}

function extrairDadosTurma(celulaDaTurma) {
  const achaRotulo = nome => Array.from(celulaDaTurma.querySelectorAll("b"))
    .find(b => textoLimpo(b).replace(/:$/, "").toLowerCase() === nome.toLowerCase());
  // valor que vem logo depois do rótulo, no mesmo elemento ("TURMA: 1")
  const valorNaMesmaLinha = rotulo => {
    if (!rotulo) return "";
    const todo = textoLimpo(rotulo.parentElement);
    const nome = textoLimpo(rotulo);
    return todo.slice(todo.indexOf(nome) + nome.length).trim();
  };
  // valor que está no elemento vizinho ("Docente:" | "NOME")
  const valorNoVizinho = rotulo => textoLimpo(rotulo?.parentElement?.nextElementSibling);

  const idTurma = valorNaMesmaLinha(achaRotulo("TURMA"));
  if (!idTurma) {
    return null;
  }

  const rotuloTempos = achaRotulo("Tempos");
  const tempos = [];
  const celulaDosTempos = rotuloTempos?.parentElement?.nextElementSibling;
  if (celulaDosTempos) {
    const divs = Array.from(celulaDosTempos.children).filter(el => el.tagName === "DIV");
    for (let i = 0; i + 1 < divs.length; i += 2) { // pares: dia + horários
      tempos.push(`${textoLimpo(divs[i])} ${textoLimpo(divs[i + 1])}`);
    }
  }

  const [tabelaVagasAtuais, tabelaVagasInscricao] = celulaDaTurma.querySelectorAll("table");
  const linhaDoTipo = (tabela, tipo) => Array.from(tabela?.rows || [])
    .map(linha => Array.from(linha.cells).map(textoLimpo))
    .find(celulas => celulas[0]?.toLowerCase() === tipo.toLowerCase()) || [];
  const vagasAtuais = tipo => {
    const [, oferecidas, ocupadas] = linhaDoTipo(tabelaVagasAtuais, tipo);
    return { OFERECIDAS: oferecidas ?? "", OCUPADAS: ocupadas ?? "" };
  };
  const vagasInscricao = tipo => {
    const [, oferecidas, solicitadasTotal, solicitadasPreferenciais] = linhaDoTipo(tabelaVagasInscricao, tipo);
    return {
      OFERECIDAS: oferecidas ?? "",
      SOLICITADAS_TOTAL: solicitadasTotal ?? "",
      SOLICITADAS_PREFERENCIAIS: solicitadasPreferenciais ?? ""
    };
  };

  return {
    ID_TURMA: idTurma,
    EH_PREFERENCIAL: /^s/i.test(valorNaMesmaLinha(achaRotulo("Preferencial"))),
    DOCENTE: valorNoVizinho(achaRotulo("Docente")),
    LOCAL_AULAS: valorNoVizinho(achaRotulo("Local das Aulas")),
    TEMPOS: tempos,
    VAGAS_ATUAIS: { UERJ: vagasAtuais("UERJ"), VESTIBULAR: vagasAtuais("Vestibular") },
    VAGAS_INSCRICAO: { UERJ: vagasInscricao("UERJ"), VESTIBULAR: vagasInscricao("Vestibular") }
  };
}

/**
 * Junta os detalhes obtidos da página de consulta aos dados da lista,
 * avisando no console se campos comuns às duas páginas estiverem inconsistentes.
 *
 * @param {object} dados Os dados já obtidos na lista de disciplinas.
 * @param {object} detalhes Os detalhes extraídos da página de consulta.
 * @returns {object} O objeto com os dados originais acrescidos dos complementares.
 */
function mesclarDetalhes(dados, detalhes) {
  ["NUM_CREDITOS", "CARGA_HORARIA_TOTAL"].forEach(campo => {
    if (dados[campo] !== undefined && detalhes[campo] !== undefined && dados[campo] !== detalhes[campo]) {
      console.warn(`Inconsistência em ${campo} (${dados.CODIGO}): lista="${dados[campo]}", detalhes="${detalhes[campo]}". Acesse a interface padrão do sistema.`);
    }
  });
  return { ...detalhes, ...dados };
}

/**
 * Obtém os detalhes complementares de uma disciplina e os mescla aos dados já conhecidos.
 *
 * @param {string|Document|object} fonte O HTML da página de consulta, o documento já
 *     interpretado ou os detalhes já extraídos.
 * @param {object} dadosDeUmaDisciplina Os dados já obtidos na lista de disciplinas.
 * @returns {object} O objeto com os dados originais acrescidos dos complementares.
 */
function extrairDadosComplementaresDisciplina(fonte, dadosDeUmaDisciplina) {
  let detalhes = fonte;
  if (typeof fonte === "string") {
    detalhes = extrairDetalhesDaPagina(new DOMParser().parseFromString(fonte, "text/html"));
  } else if (fonte instanceof Document) {
    detalhes = extrairDetalhesDaPagina(fonte);
  }
  return mesclarDetalhes(normalizarDadosDisciplina(dadosDeUmaDisciplina || {}), detalhes);
}

/* ------------------------------------------------------------------ */
/* Utilitários da página                                               */
/* ------------------------------------------------------------------ */

/**
 * Obtém os horários da lista criada anteriormente.
 *
 * @returns {string[]} os horários obtidos da lista de disciplinas selecionadas para matrícula
 */
function getHorariosDaLista() {
  return Array.from(document.querySelectorAll("#tabela-resumo-plano-inscricoes tbody tr"))
    .flatMap(linha => (linha.dataset.tempos || "").split("|").filter(Boolean));
}

/**
 * Obtém a matrícula e nome do aluno que está autenticado.
 */
function getMatriculaENomeDoAluno() {
  const elemento = document.querySelector("#divCabecalhoAplicacao font")
    || document.querySelector("#table_cabecalho_rodape > tbody > tr:nth-child(3) > td > font");
  const texto = textoLimpo(elemento);
  const posicao = texto.indexOf(" - ");
  return {
    matricula: posicao >= 0 ? texto.slice(0, posicao) : texto,
    nome: posicao >= 0 ? texto.slice(posicao + 3) : ""
  };
}

/* ------------------------------------------------------------------ */
/* Geração do HTML                                                     */
/* ------------------------------------------------------------------ */

function sim(valor) {
  return /^s/i.test(String(valor ?? "").trim());
}

function classeDoPeriodo(periodo) {
  return /^\d+$/.test(String(periodo)) ? `periodo-${periodo}` : "sem-periodo";
}

/**
 * Gera o conteúdo HTML com os dados de uma disciplina (linha do acordeão).
 *
 * @param {object} disciplina Um objeto JSON com os dados da disciplina.
 * @returns {string} O conteúdo estruturado com os dados da disciplina.
 */
function preencherModeloDisciplina(disciplina) {
  const d = normalizarDadosDisciplina(disciplina);
  const e = escaparHtml;
  const atendida = sim(d.FOI_ATENDIDA);
  const id = e(d.ID_DISCIPLINA);
  const abrirConsulta = `javascript:consultarDisciplina(output, '${id}'); return false;`;

  return `
<!-- ${e(d.NOME)} -->
<tr class="dados-disciplina${atendida ? " disciplina-atendida" : ""}" data-id-disciplina="${id}"><!-- Início do conteúdo da disciplina -->
  <td class="disciplina-periodo">
    <span class="${classeDoPeriodo(d.PERIODO)}">${e(d.PERIODO)}</span>
  </td>
  <td class="disciplina-nome${atendida ? " tooltip" : ""}">
    <a href="#" onclick="${abrirConsulta}">&#128269;</a>
    <span class="texto-nome-disciplina">${e(d.NOME)}</span>
    ${atendida ? `<span class="tooltip-texto">Esta disciplina já foi atendida.</span>` : ""}
  </td>
  <td class="disciplina-codigo ${e(d.CODIGO_DEPARTAMENTO)}">${e(d.CODIGO)}</td>
  <td class="disciplina-tipo">${e(d.TIPO)}</td>
  <td class="disciplina-codigo-ramificacao">${e(d.CODIGO_RAMIFICACAO)}</td>
  <td class="disciplina-num-creditos">${e(d.NUM_CREDITOS)}</td>
  <td class="disciplina-ch-total">${e(d.CARGA_HORARIA_TOTAL)}</td>
  <td class="disciplina-periodo-sugerido" data-turma-no-periodo="${sim(d.TEM_TURMA_NO_PERIODO)}">
    <a href="#" onclick="${abrirConsulta}">&#128269;</a>
    <span class="texto-periodo-sugerido">${e(d.TEM_TURMA_NO_PERIODO)}</span>
  </td>
  <td class="disciplina-trava-credito" data-creditos-necessarios="${e(d.TRAVA_DE_CREDITO)}">${e(d.TRAVA_DE_CREDITO)}</td>
  <td colspan="8" class="fold detalhes-disciplina">
${preencherModeloDetalhesDisciplina(d)}
  </td>
</tr>
`;
}

/**
 * Gera o conteúdo HTML do detalhe de uma disciplina.
 * Enquanto os detalhes não foram obtidos (eles são carregados quando o
 * acordeão é aberto), exibe apenas o cabeçalho e um marcador de pendência —
 * nunca dados fictícios.
 *
 * @param {object} disciplina Um objeto JSON com os dados da disciplina.
 * @returns {string} O conteúdo estruturado com os detalhes da disciplina.
 */
function preencherModeloDetalhesDisciplina(disciplina) {
  const e = escaparHtml;
  const id = e(disciplina.ID_DISCIPLINA);
  const carregado = Array.isArray(disciplina.TURMAS);
  const dadosGerais = carregado
    ? preencherModeloDadosGerais(disciplina)
    : `<div class="div-detalhes-pendentes" data-detalhes-carregados="false">Os detalhes serão carregados ao expandir.</div>`;

  return `    <div class="divContentBlock">
      <div class="divContentBlockHeader">
        <h3 class="info-disciplina-nome">${e(disciplina.NOME)}</h3>
        <span class="info-disciplina-codigo">${e(disciplina.CODIGO)}</span>
        <a class="info-disciplina-link-ementa" href="#" onclick="javascript:ementaDisciplina('${id}'); return false;">&#128196; Ementa</a>
      </div>
${dadosGerais}
    </div>${carregado ? "\n" + preencherModeloRequisitosETurmas(disciplina) : ""}`;
}

/**
 * Gera o bloco de dados gerais de uma disciplina cujos detalhes já foram obtidos.
 *
 * @param {object} d Os dados da disciplina mesclados com os detalhes.
 */
function preencherModeloDadosGerais(d) {
  const v = campo => escaparHtml(d[campo] ?? DADO_NAO_ENCONTRADO);
  return `      <div class="divContentBlockBody info-disciplina">
        <ul class="info-disciplina-dados-gerais">
          <li>
            <span class="label-info-disciplina-dados-gerais">N.º de créditos:</span>
            <span class="info-disciplina-dados-gerais-num-creditos">${v("NUM_CREDITOS")}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Carga horária semanal:</span>
            <span class="info-disciplina-dados-gerais-ch-semanal">${v("CARGA_HORARIA_SEMANAL")}</span>
            (<span class="label-info-disciplina-dados-gerais">Carga horária total:</span>
            <span class="info-disciplina-dados-gerais-ch-total">${v("CARGA_HORARIA_TOTAL")}</span>)
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Turma ofertada no período?</span>
            <span class="info-disciplina-dados-gerais-periodo-sugerido" data-turma-no-periodo="${sim(d.TEM_TURMA_NO_PERIODO)}">${v("TEM_TURMA_NO_PERIODO")}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Tempo de duração:</span>
            <span class="info-disciplina-dados-gerais-tempo-duracao">${v("TEMPO_DURACAO")}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Tipo de aprovação:</span>
            <span class="info-disciplina-dados-gerais-tipo-aprovacao">${v("TIPO_APROVACAO")}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Trava de crédito:</span>
            <span class="info-disciplina-dados-gerais-trava-credito">${v("TRAVA_DE_CREDITO")}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Permite conflito de horário?</span>
            <span class="info-disciplina-dados-gerais-pode-conflitar">${v("PERMITE_CONFLITO_HORARIO")}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">É oferecida como Universal?</span>
            <span class="info-disciplina-dados-gerais-oferta-universal">${v("EH_UNIVERSAL")}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Permite situação "Em Preparo"?</span>
            <span class="info-disciplina-dados-gerais-pode-em-preparo">${v("PERMITE_EM_PREPARO")}</span>
          </li>
        </ul>
      </div>`;
}

/**
 * Gera os blocos de requisitos e de turmas (irmãos do bloco de cabeçalho/dados gerais).
 *
 * @param {object} d Os dados da disciplina mesclados com os detalhes.
 */
function preencherModeloRequisitosETurmas(d) {
  return `    <div class="divContentBlock">
      <h4 class="divContentBlockHeader">Requisitos da Disciplina</h4>
      <div class="divContentBlockBody div-pre-requisitos">
${preencherModeloRequisitosDisciplina(d.REQUISITOS)}
      </div>
    </div>
    <div class="divContentBlock">
      <h4 class="divContentBlockHeader">Turmas da Disciplina</h4>
      <div class="divContentBlockBody">
${preencherModeloTurmas(d.TURMAS)}
      </div>
    </div>`;
}

/**
 * @param {object[]} requisitos O conjunto (`array`) de requisitos da disciplina.
 * Caso não haja requisitos, deve-se indicar **com um `array` vazio** (sem elementos).
 *
 * @returns {string} O modelo de requisitos preenchido.
 */
function preencherModeloRequisitosDisciplina(requisitos) {
  if (!Array.isArray(requisitos)) {
    throw ReferenceError("Não foi possível identificar a informação dos requisitos da disciplina.");
  }
  if (requisitos.length === 0) {
    return `        <p>Esta disciplina não possui requisito para inscrição.</p>`;
  }
  const e = escaparHtml;
  const textoDoRequisito = r => r.CODIGO_REQUISITO_DISCIPLINA
    ? `${e(r.CODIGO_REQUISITO_DISCIPLINA)} ${e(r.NOME_REQUISITO_DISCIPLINA)}`
    : e(r.NOME_REQUISITO_DISCIPLINA);

  return requisitos.map(requisito => {
    let corpo;
    if (requisito.TIPO_REQUISITO === "TRAVA_DE_CREDITO") {
      corpo = e(requisito.TEXTO);
    } else if (requisito.TIPO_REQUISITO === "REQUISITO_COM_OPCOES_ALTERNATIVAS") {
      corpo = requisito.ALTERNATIVAS_REQUISITO.map(textoDoRequisito)
        .join(`<br/><span class="alternativo">ou</span><br/>`);
    } else {
      corpo = textoDoRequisito(requisito);
    }
    return `        <div class="div-pre-requisito">
          <span class="label-pre-requisito">${e(requisito.ROTULO || "Pré-Requisito")}:</span>
          <p class="pre-requisitos">${corpo}</p>
        </div>`;
  }).join("\n");
}

/**
 * Gera o HTML das turmas de uma disciplina (segue `templates/modelo-conteudo-cada-turma.html`).
 *
 * @param {object[]} turmas A lista de turmas extraída da página de consulta.
 * @returns {string} O HTML das turmas.
 */
function preencherModeloTurmas(turmas) {
  const e = escaparHtml;
  if (!turmas || turmas.length === 0) {
    return `        <p>Nenhuma turma encontrada para esta disciplina.</p>`;
  }
  return turmas.map(t => {
    const ua = t.VAGAS_ATUAIS, vi = t.VAGAS_INSCRICAO;
    return `        <div class="div-grupo-turmas-disciplina"><!-- Início do conteúdo da turma -->
          <div class="div-turma-disciplina">
            <div class="info-disciplina-turma-informacoes">
              <ul class="info-disciplina-turma">
                <li>
                  <a href="#" class="botao-adicionar-turma" role="button" title="Adicionar ao planejamento">➕</a>
                  <span class="label-info-disciplina-turma">Turma:</span>
                  <span class="info-disciplina-turma-id">${e(t.ID_TURMA)}</span>
                </li>
                <li>
                  <span class="label-info-disciplina-turma">Turma preferencial?</span>
                  <span class="info-disciplina-turma-preferencial" data-turma-preferencial="${Boolean(t.EH_PREFERENCIAL)}">${t.EH_PREFERENCIAL ? "SIM" : "Não"}</span>
                </li>
                <li>
                  <span class="label-info-disciplina-turma">Docente:</span>
                  <span class="info-disciplina-turma-docente">${e(t.DOCENTE)}</span>
                </li>
                <li>
                  <span class="label-info-disciplina-turma">Local das aulas:</span>
                  <span class="info-disciplina-turma-local-aulas">${e(t.LOCAL_AULAS)}</span>
                </li>
                <li>
                  <span class="label-info-disciplina-turma">Tempos:</span>
                  <ul class="info-disciplina-turma-tempos">
${t.TEMPOS.map(tempo => `                    <li class="info-disciplina-turma-tempo">${e(tempo)}</li>`).join("\n")}
                  </ul>
                </li>
              </ul>
            </div>
            <div class="info-disciplina-turma-informacoes">
              <table class="tabela-disciplina-turma-vagas">
                <caption>Vagas atuais da turma</caption>
                <colgroup><col class="vagas-tipo" /><col class="vagas-num-oferecidas" /><col class="vagas-num-ocupadas" /></colgroup>
                <thead><tr><th scope="col">Tipo de vaga</th><th scope="col">Oferecidas</th><th scope="col">Ocupadas</th></tr></thead>
                <tbody>
                  <tr><th scope="row" class="vagas-uerj">UERJ</th><td>${e(ua.UERJ.OFERECIDAS)}</td><td>${e(ua.UERJ.OCUPADAS)}</td></tr>
                  <tr><th scope="row" class="vagas-vestibular">Vestibular</th><td>${e(ua.VESTIBULAR.OFERECIDAS)}</td><td>${e(ua.VESTIBULAR.OCUPADAS)}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="info-disciplina-turma-informacoes">
              <table class="tabela-disciplina-turma-vagas">
                <caption>Vagas para solicitação de inscrição</caption>
                <colgroup><col class="vagas-tipo" /><col class="vagas-num-oferecidas" /><col span="2" class="vagas-num-solicitadas" /></colgroup>
                <thead>
                  <tr><th scope="col" rowspan="2">Tipo de vaga</th><th scope="col" rowspan="2">Oferecidas</th><th scope="colgroup" colspan="2">Solicitadas</th></tr>
                  <tr><th scope="col">Total</th><th scope="col">Preferenciais</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row" class="vagas-uerj">UERJ</th><td>${e(vi.UERJ.OFERECIDAS)}</td><td>${e(vi.UERJ.SOLICITADAS_TOTAL)}</td><td>${e(vi.UERJ.SOLICITADAS_PREFERENCIAIS)}</td></tr>
                  <tr><th scope="row" class="vagas-vestibular">Vestibular</th><td>${e(vi.VESTIBULAR.OFERECIDAS)}</td><td>${e(vi.VESTIBULAR.SOLICITADAS_TOTAL)}</td><td>${e(vi.VESTIBULAR.SOLICITADAS_PREFERENCIAIS)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div><!-- Fim do conteúdo da turma -->`;
  }).join("\n");
}

/**
 * Transforma uma lista de dados de disciplinas (cada elemento como um objeto JSON)
 * no formato HTML compatível com o acordeão e, se houver um destino, a insere nele.
 *
 * @param {object[]} listaDadosDisciplinas Uma lista de objetos no formato JSON.
 *     Para uma única disciplina, utilize a função `preencherModeloDisciplina(disciplina)`.
 * @param {Element|null} [destino] O `<tbody>` que receberá as linhas
 *     (padrão: `#tabela-disciplinas > tbody`, se existir). O conteúdo anterior é substituído.
 * @returns {string[]} A lista de HTMLs gerados (um por disciplina).
 */
function transformarListaDisciplinas(listaDadosDisciplinas, destino = document.querySelector("#tabela-disciplinas > tbody")) {
  const htmls = listaDadosDisciplinas.map(disciplina => preencherModeloDisciplina(disciplina));
  if (destino) {
    destino.innerHTML = htmls.join("\n");
    if (typeof ativarAcordeao === "function") {
      ativarAcordeao();
    }
  }
  return htmls;
}

function testeTransformarListaDisciplinas() {
  return transformarListaDisciplinas([
    {
      CODIGO: "IME04-10817", NOME: "Fundamentos da Computação", PERIODO: "1", FOI_ATENDIDA: "Sim",
      TIPO: "Obrigatória", CODIGO_RAMIFICACAO: "626", NUM_CREDITOS: "5", CARGA_HORARIA_TOTAL: "90",
      TEM_TURMA_NO_PERIODO: "Sim", TRAVA_DE_CREDITO: "0"
    },
    { // formato antigo do JSON (sem campos derivados): também é aceito
      CODIGO: "ILE02-10822", NOME: "Português Instrumental", PERIODO: "3", FOI_ATENDIDA: "Sim",
      TIPO: "Obrigatória", CODIGO_RAMIFICACAO: "626", NUM_CREDITOS: "4", CARGA_HORARIA_TOTAL: "60",
      EH_PERIODO_SUGERIDO: "Sim", TRAVA_DE_CREDITO: "0"
    }
  ]);
}
