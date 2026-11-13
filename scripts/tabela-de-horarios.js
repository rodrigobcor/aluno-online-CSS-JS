/**
 * Quadro provisório de horários.
 *
 * Existia uma implementação concorrente (a que sobrescrevia o conteúdo da célula
 * e escondia os conflitos) e outra, em "pending commit", que marcava `com-conflito`.
 * Esta versão unifica as duas: o quadro é SEMPRE recalculado por inteiro a partir
 * das linhas do resumo do planejamento (`#tabela-resumo-plano-inscricoes`), cada uma
 * com os atributos `data-codigo`, `data-turma` e `data-tempos` (ex.: "SEG M5 M6|QUA M5 M6").
 * Assim, adicionar ou remover uma turma nunca deixa o quadro inconsistente.
 */

const MAPA_DIAS = { SEG: "seg", TER: "ter", QUA: "qua", QUI: "qui", SEX: "sex", SAB: "sab" };

/**
 * Recalcula todo o quadro de horários a partir do resumo do planejamento.
 * Células com mais de uma disciplina/turma recebem a classe `com-conflito`;
 * as demais, `selecionada`.
 *
 * @returns {number} A quantidade de células em conflito.
 */
function recalcularQuadroDeHorarios() {
  apagaTabelaDeHorarios();
  const quadro = document.getElementById("tabela-plano-inscricoes");
  if (!quadro) {
    return 0;
  }

  document.querySelectorAll("#tabela-resumo-plano-inscricoes tbody tr").forEach(linha => {
    const { codigo, turma } = linha.dataset;
    (linha.dataset.tempos || "").split("|").filter(Boolean).forEach(tempo => {
      decomporIntervalo(tempo).forEach(({ dia, horario }) => {
        const celula = quadro.querySelector(`td.${MAPA_DIAS[dia]}.${horario.toLowerCase()}`);
        if (celula) {
          marcarCelula(celula, codigo, turma);
        } else {
          console.warn(`Célula do quadro não encontrada para "${dia} ${horario}".`);
        }
      });
    });
  });

  return quadro.querySelectorAll("td.com-conflito").length;
}

/**
 * Compatibilidade com o nome anterior da função.
 */
function inserirHorariosNaTabelaDeHorarios() {
  return recalcularQuadroDeHorarios();
}

/**
 * Registra uma disciplina/turma em uma célula do quadro.
 * Se a célula já tiver outra disciplina/turma, passa a ser marcada como conflito
 * e exibe todos os códigos.
 *
 * @param {HTMLTableCellElement} celula A célula do quadro.
 * @param {string} codigo O código da disciplina.
 * @param {string} turma O identificador da turma.
 */
function marcarCelula(celula, codigo, turma) {
  const registros = JSON.parse(celula.dataset.registros || "[]");
  if (!registros.some(r => r.codigo === codigo && r.turma === turma)) {
    registros.push({ codigo, turma });
  }
  celula.dataset.registros = JSON.stringify(registros);

  celula.replaceChildren(...registros.map(registro => {
    const div = document.createElement("div");
    div.className = "codigo-na-celula";
    div.textContent = registro.codigo;
    div.title = `${registro.codigo} — turma ${registro.turma}`;
    div.style.fontSize = "smaller";
    div.style.padding = "2px";
    return div;
  }));

  celula.classList.remove("selecionada", "com-conflito");
  celula.classList.add(registros.length > 1 ? "com-conflito" : "selecionada");
}

/**
 * Remove toda marcação do quadro (textos e classes), mesmo que a disciplina
 * ainda conste na lista. Chamada no início de cada recálculo.
 */
function apagaTabelaDeHorarios() {
  const quadro = document.getElementById("tabela-plano-inscricoes");
  if (!quadro) {
    return;
  }
  quadro.querySelectorAll("td[data-registros], td.selecionada, td.com-conflito").forEach(celula => {
    celula.replaceChildren();
    celula.removeAttribute("data-registros");
    celula.classList.remove("selecionada", "com-conflito");
  });
}

/**
 * Decompõe um intervalo no formato do Aluno Online (ex.: "QUA T2 T3")
 * em uma lista de pares dia/horário.
 *
 * @param {string} intervalo O horário no formato original a decompor.
 * @returns {{dia: string, horario: string}[]} Um item por horário (lista vazia se o formato for inválido).
 */
function decomporIntervalo(intervalo) {
  const texto = String(intervalo).trim().replace(/\s+/g, " ");
  if (!getRegexHorario().test(texto)) {
    console.warn(`Formato de horário não reconhecido: "${intervalo}".`);
    return [];
  }
  const [dia, ...horarios] = texto.split(" ");
  return horarios.map(horario => ({ dia: dia.toUpperCase(), horario: horario.toUpperCase() }));
}

/**
 * Verifica se o horário atende ao seguinte formato:
 * - uma abreviação do dia da semana (logo no início da frase),
 * - seguida de um a seis horários no formato letra-número, separados por espaço
 *   (M1–M6, T1–T6, N1–N5).
 * O limite anterior (cinco horários) rejeitava uma manhã inteira (M1 a M6).
 *
 * @returns {RegExp} a expressão regular para verificação do horário no formato do Aluno Online
 */
function getRegexHorario() {
  // sem as flags `g`/`m`: com `g`, `test()` guarda estado (`lastIndex`) entre chamadas
  return /^(SEG|TER|QUA|QUI|SEX|SAB)(?: (?:M[1-6]|T[1-6]|N[1-5])){1,6}$/i;
}

/**
 * Adapted from regex101.com by Marcelo
 *
 * @param {RegExp} aRegex The regex to apply (com a flag `g`).
 * @param {string} text The source text to find matches.
 * @returns {any[]} the list of matches, **as an array of arrays**.
 */
function getArrayOfGroupMatches(aRegex, text) {
  let allResults = [], matchResult;
  while ((matchResult = aRegex.exec(text)) !== null) {
    allResults.push(matchResult.slice(1)); // sem o match global
    // regex101.com states that this is necessary to avoid infinite loops with zero-width matches.
    // (o índice precisa ser lido do resultado original, e não da cópia sem o match global)
    if (matchResult.index === aRegex.lastIndex) {
      aRegex.lastIndex++;
    }
  }
  return allResults;
}

/**
 * Testa a aplicação da função `getRegexHorario()` com relação a dados de entrada.
 *
 * Essa função NÃO testa:
 * - se os horários não são sequenciais (ex.: T1T3);
 * - se há horários repetidos (ex.: M3M3);
 * - se os horários não fazem sentido (ex.: M1N5).
 *
 * O conteúdo deve vir corretamente do sistema original.
 */
function testeGetRegexHorario() {
  let numErros = 0;
  const devemPassar = [
    "SEG M5", // apenas um segmento de horário
    "TER M5 M6", // dois segmentos de horário
    "QUA T6 N1", // dois segmentos de horário com variação de turno
    "QUI M4 M5 M6", // três segmentos de horário
    "QUA T3 T4 T5 T6", // quatro segmentos de horário
    "SEG M1 M2 M3 M4 M5 M6", // manhã inteira (seis segmentos)
    "SAB M6 T1" // só pra testar sábado
  ];
  devemPassar.forEach(horario => {
    if (!getRegexHorario().test(horario)) {
      console.error(`O formato de horário "${horario}" teoricamente devia passar, mas não passou.`);
      numErros++;
    }
  });
  const naoPodemPassar = [
    "RAÇÃO PARA GATOS", // conteúdo inválido
    "TER 1", // turno ausente
    "QUA T", // turno sem identificador de horário
    "SEG G1", // turno inválido
    "SEX N6", // turno inexistente
    "SEG M7", // identificador de horário inválido
    "QUI N1N", // um dos turnos sem identificador de horário
    "QU N2", // número de caracteres do dia da semana < 3
    "QUIN N3", // número de caracteres do dia da semana > 3
    "SEQ G1", // dia da semana inválido
    "SEG M1 M2 M3 M4 M5 M6 T1", // mais de seis horários no mesmo dia
    // OS FORMATOS A SEGUIR SÃO VÁLIDOS EM OUTROS LUGARES FORA DO AOL:
    "TER T3 SEX T3", // dia da semana na mesma linha
    "SEXM1M2" // sem espaço entre os itens
  ];
  naoPodemPassar.forEach(horario => {
    if (getRegexHorario().test(horario)) {
      console.error(`O formato de horário "${horario}" teoricamente não devia passar, mas passou.`);
      numErros++;
    }
  });
  if (numErros === 0) {
    console.log(`Todos os valores de teste foram aprovados.`);
  } else {
    console.log(`Total de erros = ${numErros}.`);
  }
  return numErros;
}

/**
 * Teste manual do quadro: marca três disciplinas, sendo duas em conflito
 * (segunda M5), e imprime o número de células em conflito.
 * Deve ser executado em uma página que contenha as duas tabelas do planejamento.
 */
function testeQuadroDeHorarios() {
  const quadro = document.getElementById("tabela-plano-inscricoes");
  apagaTabelaDeHorarios();
  marcarCelula(quadro.querySelector("td.seg.m5"), "IMERMAO 101", "1");
  marcarCelula(quadro.querySelector("td.seg.m6"), "IMERMAO 101", "1");
  marcarCelula(quadro.querySelector("td.seg.m5"), "FISCERTO 102", "1");
  console.log(`Células em conflito: ${quadro.querySelectorAll("td.com-conflito").length} (esperado: 1).`);
}
