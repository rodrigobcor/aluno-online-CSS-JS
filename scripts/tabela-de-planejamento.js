/**
 * Planejamento de inscrições: adicionar/remover turmas no resumo
 * e manter o quadro de horários em dia.
 *
 * Depende de `utilidades.js` e `tabela-de-horarios.js`.
 *
 * Mudanças em relação à versão anterior:
 * - o `addEventListener` solto no fim do arquivo (que gerava `ReferenceError`
 *   ao carregar) foi removido; a remoção de turma tem um único tratamento,
 *   dentro de `adicionarTurmaNaTabela`, e atualiza o quadro de horários;
 * - os botões ➕ são identificados pelo contexto (a turma em que estão),
 *   e não por `data-turma`, que se repetia entre disciplinas;
 * - todos os botões são tratados por delegação de eventos, então funcionam também
 *   para conteúdo inserido depois (detalhes carregados ao expandir o acordeão);
 * - as verificações de `null` agora acontecem antes de qualquer uso do elemento.
 */

/**
 * Verifica se a turma já consta no resumo do planejamento.
 *
 * @param {string} codigoDisciplina O código da disciplina (ex.: IME01-04827).
 * @param {string} numeroTurma O identificador da turma.
 * @returns {boolean} `true` se a turma já foi adicionada.
 */
function turmaJaExiste(codigoDisciplina, numeroTurma) {
  return Array.from(document.querySelectorAll("#tabela-resumo-plano-inscricoes tbody tr"))
    .some(linha => linha.dataset.codigo === codigoDisciplina && linha.dataset.turma === numeroTurma);
}

/**
 * Descobre a disciplina e a turma a que um botão ➕ pertence.
 *
 * @param {Element} botao O botão de adicionar turma.
 * @returns {{nome: string, codigo: string, numeroTurma: string, grupoDaTurma: Element}|null}
 *     Os dados, ou `null` se o botão estiver fora da estrutura esperada.
 */
function identificarTurmaDoBotao(botao) {
  const grupoDaTurma = botao.closest(".div-grupo-turmas-disciplina");
  const tdDetalhes = botao.closest("td.detalhes-disciplina");
  if (!grupoDaTurma || !tdDetalhes) {
    return null;
  }
  const nome = tdDetalhes.querySelector(".info-disciplina-nome")?.textContent.trim();
  const codigo = tdDetalhes.querySelector(".info-disciplina-codigo")?.textContent.trim();
  const numeroTurma = grupoDaTurma.querySelector(".info-disciplina-turma-id")?.textContent.trim();
  if (!nome || !codigo || !numeroTurma) {
    return null;
  }
  return { nome, codigo, numeroTurma, grupoDaTurma };
}

function marcarBotaoDeTurma(botao, desabilitado) {
  botao.classList.toggle("desabilitado", desabilitado);
  botao.setAttribute("aria-disabled", String(desabilitado));
  botao.style.opacity = desabilitado ? "0.5" : "1";
}

/**
 * Atualiza o estado (habilitado/desabilitado) dos botões ➕ conforme o resumo atual.
 *
 * @param {ParentNode} [raiz] Onde procurar os botões (padrão: a página inteira).
 */
function sincronizarBotoesDeTurmas(raiz = document) {
  raiz.querySelectorAll(".botao-adicionar-turma").forEach(botao => {
    const turma = identificarTurmaDoBotao(botao);
    if (turma) {
      marcarBotaoDeTurma(botao, turmaJaExiste(turma.codigo, turma.numeroTurma));
    }
  });
}

/**
 * Garante que toda turma tenha o botão ➕ (na maquete, só as duas primeiras tinham)
 * e sincroniza o estado dos botões. Deve ser chamada sempre que novo conteúdo
 * de turmas for inserido na página.
 *
 * @param {ParentNode} [raiz] Onde procurar as turmas (padrão: a página inteira).
 */
function prepararTurmas(raiz = document) {
  raiz.querySelectorAll(".div-grupo-turmas-disciplina").forEach(grupo => {
    if (grupo.querySelector(".botao-adicionar-turma")) return;
    const rotulo = grupo.querySelector(".label-info-disciplina-turma");
    if (!rotulo) return;
    const botao = document.createElement("a");
    botao.href = "#";
    botao.className = "botao-adicionar-turma";
    botao.setAttribute("role", "button");
    botao.title = "Adicionar ao planejamento";
    botao.textContent = "➕";
    rotulo.parentElement.insertBefore(botao, rotulo);
  });
  sincronizarBotoesDeTurmas(raiz);
}

/**
 * Adiciona a turma do botão informado ao resumo do planejamento
 * e atualiza o quadro de horários.
 *
 * @param {Element} botao O botão ➕ da turma.
 */
function adicionarTurmaNaTabela(botao) {
  const turma = identificarTurmaDoBotao(botao);
  if (!turma) {
    console.error("Não foi possível identificar a disciplina e a turma deste botão.");
    return;
  }
  const { nome, codigo, numeroTurma, grupoDaTurma } = turma;

  if (turmaJaExiste(codigo, numeroTurma)) {
    alert("Esta turma já foi adicionada ao seu planejamento!");
    return;
  }

  const tempos = Array.from(grupoDaTurma.querySelectorAll(".info-disciplina-turma-tempo"))
    .map(tempo => tempo.textContent.trim());
  const localDasAulas = grupoDaTurma.querySelector(".info-disciplina-turma-local-aulas")?.textContent.trim()
    || "Não informado";

  const tbody = document.querySelector("#tabela-resumo-plano-inscricoes tbody");
  if (!tbody) {
    console.error("Tabela de resumo do planejamento não encontrada.");
    return;
  }

  // Cria a nova linha, guardando os dados em atributos (usados pelo quadro de horários)
  const novaLinha = document.createElement("tr");
  novaLinha.dataset.codigo = codigo;
  novaLinha.dataset.turma = numeroTurma;
  novaLinha.dataset.tempos = tempos.join("|");

  const criarCelula = (classe, texto) => {
    const celula = document.createElement("td");
    celula.className = classe;
    if (texto !== undefined) celula.textContent = texto;
    return celula;
  };

  const celulaBotaoRemover = criarCelula("botao-remover-turma");
  const linkRemover = document.createElement("a");
  linkRemover.href = "#";
  linkRemover.setAttribute("role", "button");
  linkRemover.setAttribute("aria-label", `Remover ${nome}, turma ${numeroTurma}, do planejamento`);
  linkRemover.textContent = "✖️";
  linkRemover.addEventListener("click", evento => {
    evento.preventDefault();
    if (confirm("Tem certeza que deseja remover esta disciplina do seu planejamento?")) {
      novaLinha.remove();
      sincronizarBotoesDeTurmas(); // reativa o botão correspondente
      recalcularQuadroDeHorarios(); // e tira os horários do quadro
    }
  });
  celulaBotaoRemover.appendChild(linkRemover);

  const celulaHorarios = criarCelula("resumo-turma-tempos");
  const ulHorarios = document.createElement("ul");
  ulHorarios.className = "info-disciplina-turma-tempos";
  tempos.forEach(tempo => {
    const li = document.createElement("li");
    li.className = "info-disciplina-turma-tempo";
    li.textContent = tempo;
    ulHorarios.appendChild(li);
  });
  celulaHorarios.appendChild(ulHorarios);

  novaLinha.append(
    celulaBotaoRemover,
    criarCelula("resumo-disciplina-nome", nome),
    criarCelula("resumo-disciplina-codigo", codigo),
    criarCelula("resumo-turma-id", numeroTurma),
    celulaHorarios,
    criarCelula("resumo-turma-local-aulas", localDasAulas)
  );
  tbody.appendChild(novaLinha);

  sincronizarBotoesDeTurmas();
  recalcularQuadroDeHorarios();
}

// Um único listener para todos os botões ➕, atuais e futuros.
if (!document.documentElement.dataset.planejamentoAtivo) {
  document.documentElement.dataset.planejamentoAtivo = "true";
  document.addEventListener("click", evento => {
    const botao = evento.target.closest(".botao-adicionar-turma");
    if (!botao) return;
    evento.preventDefault(); // previne o comportamento padrão do link
    if (botao.getAttribute("aria-disabled") === "true") return;
    adicionarTurmaNaTabela(botao);
  });
}

quandoPronto(() => prepararTurmas());
