/**
 * Utilidades compartilhadas entre os demais scripts do projeto.
 *
 * ORDEM DE CARREGAMENTO (importante):
 *   utilidades.js -> dados-das-disciplinas.js -> tabela-de-horarios.js
 *   -> tabela-de-planejamento.js -> acordeao.js
 *
 * Funções como `consultarDisciplina`, `ementaDisciplina` e
 * `formCreateHiddenInputField` existiam duplicadas em três arquivos;
 * agora vivem somente aqui.
 */

/**
 * Fonte: adaptado de https://gomakethings.com/converting-the-jquery-next-method-to-vanilla-js/
 */
function next(elem, selector) {
  const nextElem = elem.nextElementSibling;
  if (!selector) {
    return nextElem;
  }
  if (nextElem && nextElem.matches(selector)) {
    return nextElem;
  }
  return null;
}

/**
 * Escapa texto para uso seguro dentro de HTML gerado por template.
 * Todo conteúdo vindo do servidor deve passar por aqui antes de ir para `innerHTML`.
 *
 * @param {*} texto O valor a escapar.
 * @returns {string} O texto escapado.
 */
function escaparHtml(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Aguarda o tempo informado.
 *
 * @param {number} ms Milissegundos.
 */
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Cria (ou atualiza, se já existir) um campo de formulário oculto.
 * Reaproveitar o campo evita acumular `<input hidden>` repetidos
 * a cada consulta.
 *
 * @param {HTMLFormElement|string} formOutput O formulário (ou o nome dele).
 * @param {string} campo O nome do campo.
 * @param {string} valor O valor do campo.
 * @returns {HTMLInputElement} O campo criado ou atualizado.
 */
function formCreateHiddenInputField(formOutput, campo, valor) {
  const form = typeof formOutput === "string" ? document.forms[formOutput] : formOutput;
  let campoOculto = Array.from(form.querySelectorAll('input[type="hidden"]'))
    .find(input => input.name === campo);
  if (!campoOculto) {
    campoOculto = document.createElement("input");
    campoOculto.type = "hidden";
    campoOculto.name = campo;
    form.appendChild(campoOculto);
  }
  campoOculto.value = valor;
  return campoOculto;
}

/**
 * Realiza a consulta de uma disciplina a partir de seu identificador.
 * O identificador é sempre tratado como TEXTO (nunca como número literal),
 * pois literais com zero à esquerda (ex.: 04304) são lidos como octal em JS.
 *
 * @param {HTMLFormElement|string} formOutput O formulário (ou o nome dele).
 * @param {string|number} codigo O identificador numérico da disciplina.
 */
function consultarDisciplina(formOutput, codigo) {
  const form = typeof formOutput === "string" ? document.forms[formOutput] : formOutput;
  formCreateHiddenInputField(form, "disciplinas[0]", String(codigo));
  form.submit();
}

/**
 * Realiza a consulta das turmas de uma disciplina.
 *
 * @param {HTMLFormElement|string} formOutput O formulário (ou o nome dele).
 * @param {string|number} codigo O identificador numérico da disciplina.
 * @param {string} requisicao O valor do campo `requisicao` da consulta desejada.
 */
function consultarTurmasDisciplina(formOutput, codigo, requisicao) {
  const form = typeof formOutput === "string" ? document.forms[formOutput] : formOutput;
  formCreateHiddenInputField(form, "disciplinas[0]", String(codigo));

  const requisicaoOriginal = form.elements["requisicao"].value;
  form.elements["requisicao"].value = requisicao;
  form.submit();
  form.elements["requisicao"].value = requisicaoOriginal;
}

/**
 * Consulta a ementa de uma disciplina a partir de seu identificador.
 *
 * @param {string|number} idDisciplina O identificador numérico da disciplina.
 * @param {HTMLFormElement} [form] O formulário (padrão: o formulário `output`).
 */
function ementaDisciplina(idDisciplina, form = document.forms["output"]) {
  formCreateHiddenInputField(form, "idDisciplina", String(idDisciplina));
  form.submit();
}

/**
 * Insere a classe CSS passada por parâmetro em todos os elementos `<td>`
 * de determinada tabela. Na ausência do identificador, usa a primeira
 * `<table>` encontrada.
 *
 * @param {string} idTabela O atributo `id` da tabela.
 * @param {string} nomeDaClasse O nome da classe CSS a adicionar em cada `<td>`.
 */
function insereClasseNasCelulasDaTabela(idTabela, nomeDaClasse) {
  const tabela = idTabela ? document.getElementById(idTabela) : document.querySelector("table");
  if (!tabela) {
    console.error(idTabela ? `Tabela '${idTabela}' não encontrada.` : `A tag "<table>" não foi identificada.`);
    return;
  }
  tabela.querySelectorAll("td").forEach(celula => celula.classList.add(nomeDaClasse));
}

/**
 * Executa a função quando o DOM estiver pronto — inclusive quando o script
 * é colado no console depois que a página já terminou de carregar
 * (nesse caso o evento DOMContentLoaded nunca mais dispara).
 *
 * @param {Function} funcao A função a executar.
 */
function quandoPronto(funcao) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", funcao, { once: true });
  } else {
    funcao();
  }
}
