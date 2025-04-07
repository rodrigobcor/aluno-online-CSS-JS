/**
 * 
 * @param {string} intervalo O horário no formato original a decompor.
 * @returns {{dia: string, horario: string}} um objeto com a decomposição do intervalo em dia e horário.
 */
function decomporIntervalo(intervalo) {
  let segmentosDoIntervalo = getArrayOfGroupMatches(getRegexIntervalo(), intervalo);
  // o primeiro elemento é o dia da semana (ex. QUA), os outros são os horários (ex. T2)
  // cada segmento vai ser antecedido do dia da semana
  const diaSemana = segmentosDoIntervalo.splice(0, 1); // obtém apenas o dia da semana e mantém o horário no segmentosDoIntervalo
  segmentosDoIntervalo = segmentosDoIntervalo.map(
    // lembrando que segmentosDoIntervalo contém apenas o horário, então pode-se reutilizar a variável
    segmentosDoIntervalo => ({
      "dia": diaSemana,
      "horario": segmentosDoIntervalo
    })
  );
  return segmentosDoIntervalo;
}

function transformarFormatoTurma() {
    const formatoAntigo = document.querySelector('td[style*="border-style: solid"]');
    if (!formatoAntigo) {
        console.error('Elemento do formato antigo não encontrado.');
        return;
    }

    const novoFormato = document.createElement('div');
    novoFormato.className = 'divContentBlock';

    const header = document.createElement('div');
    header.className = 'divContentBlockHeader';
    header.textContent = 'Turmas da Disciplina';
    novoFormato.appendChild(header);

    const body = document.createElement('div');
    body.className = 'divContentBlockBody';
    novoFormato.appendChild(body);

    const grupoTurmas = document.createElement('div');
    grupoTurmas.className = 'div-grupo-turmas-disciplina';
    body.appendChild(grupoTurmas);

    const divTurma = document.createElement('div');
    divTurma.className = 'div-turma-disciplina';
    grupoTurmas.appendChild(divTurma);

    const divInformacoes = document.createElement('div');
    divInformacoes.className = 'detalhes-disciplina-turma-informacoes';
    divTurma.appendChild(divInformacoes);

    const ulDetalhes = document.createElement('ul');
    ulDetalhes.className = 'detalhes-disciplina-turma';
    divInformacoes.appendChild(ulDetalhes);

    const turmaElement = formatoAntigo.querySelector('div > div > div > b');
    if (turmaElement && turmaElement.nextSibling) {
        const turma = turmaElement.nextSibling.textContent.trim();
        const liTurma = document.createElement('li');
        liTurma.className = 'detalhes-disciplina-turma-id';
        liTurma.textContent = turma;
        ulDetalhes.appendChild(liTurma);
    } else {
        console.error('Elemento de turma não encontrado.');
    }

    const preferencialElement = formatoAntigo.querySelector('div > div > div > div:nth-child(2) > div');
    if (preferencialElement) {
        const preferencial = preferencialElement.textContent.replace('Preferencial:', '').trim();
        const liPreferencial = document.createElement('li');
        liPreferencial.className = 'detalhes-disciplina-turma-preferencial';
        liPreferencial.textContent = preferencial;
        ulDetalhes.appendChild(liPreferencial);
    } else {
        console.error('Elemento de preferencial não encontrado.');
    }

    const docenteElement = formatoAntigo.querySelector('div > div > div > div:nth-child(5) > div:nth-child(2)');
    if (docenteElement) {
        const docente = docenteElement.textContent.trim();
        const liDocente = document.createElement('li');
        liDocente.className = 'detalhes-disciplina-turma-docente';
        liDocente.textContent = docente;
        ulDetalhes.appendChild(liDocente);
    } else {
        console.error('Elemento de docente não encontrado.');
    }

    const liLocalizacao = document.createElement('li');
    liLocalizacao.className = 'detalhes-disciplina-turma-localizacao';
    ulDetalhes.appendChild(liLocalizacao);

    const liTempos = document.createElement('li');
    liTempos.className = 'detalhes-disciplina-turma-tempos';
    ulDetalhes.appendChild(liTempos);

    const ulTempos = document.createElement('ul');
    ulTempos.className = 'detalhes-disciplina-turma-tempo-lista';
    liTempos.appendChild(ulTempos);

    const tempos = formatoAntigo.querySelectorAll('div > div > div > div:nth-child(3) > div:nth-child(2) > div');
    if (tempos.length > 0) {
        tempos.forEach(tempo => {
            const liTempo = document.createElement('li');
            liTempo.className = 'detalhes-disciplina-turma-tempo';
            liTempo.textContent = tempo.textContent.trim();
            ulTempos.appendChild(liTempo);
        });
    } else {
        console.error('Elementos de tempos não encontrados.');
    }

    const tabelasVagas = formatoAntigo.querySelectorAll('table');
    if (tabelasVagas.length > 0) {
        tabelasVagas.forEach((tabela, index) => {
            const divTabela = document.createElement('div');
            divTabela.className = 'detalhes-disciplina-turma-informacoes';
            divTurma.appendChild(divTabela);

            const novaTabela = document.createElement('table');
            novaTabela.className = 'tabela-disciplina-turma-vagas';
            divTabela.appendChild(novaTabela);

            const caption = document.createElement('caption');
            caption.className = 'tabela-vagas-descricao';
            caption.textContent = index === 0 ? 'Vagas atuais da turma' : 'Vagas para solicitação de inscrição';
            novaTabela.appendChild(caption);

            const tbody = document.createElement('tbody');
            novaTabela.appendChild(tbody);

            const linhas = tabela.querySelectorAll('tr');
            linhas.forEach(linha => {
                const novaLinha = document.createElement('tr');
                tbody.appendChild(novaLinha);

                const celulas = linha.querySelectorAll('td, th');
                celulas.forEach(celula => {
                    const novaCelula = document.createElement(celula.tagName.toLowerCase());
                    novaCelula.textContent = celula.textContent.trim();
                    novaCelula.setAttribute('style', celula.getAttribute('style'));
                    novaLinha.appendChild(novaCelula);
                });
            });
        });
    } else {
        console.error('Tabelas de vagas não encontradas.');
    }

    formatoAntigo.parentNode.replaceChild(novoFormato, formatoAntigo);
}

/**
 * 
 * @param {object[]} listaDadosDisciplinas Uma lista de objetos no formato JSON.
 */
function transformarListaDisciplinas(listaDadosDisciplinas) {
  listaDadosDisciplinas = listaDadosDisciplinas.map(disciplina => preencherModeloDisciplina(disciplina));
  console.log(listaDadosDisciplinas);
  return listaDadosDisciplinas;
}


/**
 * Gera o conteúdo HTML com os dados de uma disciplina, utilizando o modelo de estruturação dos dados.
 * 
 * @param {object} disciplina Um objeto JSON com os dados da disciplina.
 * @returns {string} O conteúdo estruturado com os dados da disciplina.
 */

function preencherModeloDisciplina(disciplina) {
  let dadosGeraisDisciplina = preencherModeloDadosGeraisDisciplina(disciplina);
  // console.log(dadosGeraisDisciplina);

  let detalhesDisciplina = preencherModeloDetalhesDisciplina(disciplina);
  // console.log(detalhesDisciplina);

  return dadosGeraisDisciplina + "\n" + detalhesDisciplina;
}

function preencherModeloDadosGeraisDisciplina(disciplina) {

  /* Obs.: Os espaços precedentes por linha, para a devida
   * indentação com restante do código, devem ser incluídos à parte.
   */
  let modeloPreenchidoDadosGerais = `
<tr class="dados-disciplina${(disciplina.FOI_ATENDIDA == "Sim" ? " disciplina-atendida" : "")}"><!-- Início do conteúdo da disciplina -->
  <td class="disciplina-periodo">
    <span class="${disciplina.CODIGO_DEPARTAMENTO}">${disciplina.PERIODO}</span>
  </td>
  <td class="disciplina-nome${(disciplina.FOI_ATENDIDA == "Sim" ? " tooltip" : "")}">
    <a href="#" onclick="javascript:consultarDisciplina(output, ${disciplina.CODIGO_CINCO_ULTIMOS_NUMEROS}); return false;">&#128269;</a>
    <span class="texto-nome-disciplina">${disciplina.NOME}</span>
    ${(disciplina.FOI_ATENDIDA == "Sim" ? `<span class="tooltip-texto">Esta disciplina já foi atendida.</span>` : "")}
  </td>
  <td class="disciplina-codigo ${disciplina.CODIGO_DEPARTAMENTO}">${disciplina.CODIGO}</td>
  <td class="disciplina-tipo">${disciplina.TIPO}</td>
  <td class="disciplina-codigo-ramificacao">${disciplina.RAMIFICACAO}</td>
  <td class="disciplina-num-creditos">${disciplina.NUM_CREDITOS}</td>
  <td class="disciplina-ch-total">${disciplina.CARGA_HORARIA_TOTAL}</td>
  <td class="disciplina-periodo-sugerido" data-periodo-sugerido="${disciplina.EH_PERIODO_SUGERIDO == "Sim"}">
    <a href="#" onclick="javascript:consultarDisciplina(output, ${disciplina.CODIGO_CINCO_ULTIMOS_NUMEROS}); return false;">&#128269;</a>
    <span class="texto-periodo-sugerido">${disciplina.EH_PERIODO_SUGERIDO}</span>
  </td>
  <td class="disciplina-trava-credito" data-creditos-necessarios="${disciplina.TRAVA_DE_CREDITO}">${disciplina.TRAVA_DE_CREDITO}</td>
  <td colspan="8" class="fold detalhes-disciplina">
  </td>
</tr>
`;

  return modeloPreenchidoDadosGerais;
}


/**
 * Gera o conteúdo HTML com os dados de uma disciplina, utilizando o modelo de estruturação dos detalhes.
 * 
 * @param {object} disciplina Um objeto JSON com os dados da disciplina.
 * @returns {string} O conteúdo estruturado com os detalhes da disciplina.
 */
function preencherModeloDetalhesDisciplina(disciplina) {

    // os dados a incluir aqui (ou a maioria) não se encontram na página geral de lista de disciplinas,
    // e só aparecem sob demanda, quando se seleciona a opção de consulta de uma disciplina
    disciplina = extrairDadosComplementaresDisciplina(disciplina);

    let modeloPreenchidoDetalhesDisciplina = `
    <div class="divContentBlock">
      <div class="divContentBlockHeader">
        <h3 class="info-disciplina-nome">${disciplina.NOME}</h3>
        <span class="info-disciplina-codigo">${disciplina.CODIGO}</span>
        <a class="info-disciplina-link-ementa" href="#" onclick="javascript:ementaDisciplina(${disciplina.CODIGO_CINCO_ULTIMOS_NUMEROS}); return false;">&#128196; Ementa</a>
      </div>
      <div class="divContentBlockBody info-disciplina">
        <ul class="info-disciplina-dados-gerais">
          <li>
            <span class="label-info-disciplina-dados-gerais">N.º de créditos:</span>
            <span class="info-disciplina-dados-gerais-num-creditos">${disciplina.NUM_CREDITOS}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Carga horária semanal:</span>
            <span  class="info-disciplina-dados-gerais-ch-semanal">${disciplina.CH_SEMANAL_DISCIPLINA}</span>
            (<span class="label-info-disciplina-dados-gerais">Carga horária total:</span>
            <span class="info-disciplina-dados-gerais-ch-total">${disciplina.CARGA_HORARIA_TOTAL}</span>)
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Sugerida para o período?</span>
            <span class="info-disciplina-dados-gerais-periodo-sugerido" data-periodo-sugerido="${disciplina.EH_PERIODO_SUGERIDO == "Sim"}">
              ${disciplina.EH_PERIODO_SUGERIDO}
              <a href="#" onclick="javascript:consultarDisciplina(
                  output, ${disciplina.CODIGO_CINCO_ULTIMOS_NUMEROS}
              ); return false;">&#128269;</a>
            </span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Tempo de duração:</span>
            <span class="info-disciplina-dados-gerais-tempo-duracao">${disciplina.TEMPO_DURACAO_DISCIPLINA}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Tipo de aprovação:</span>
            <span class="info-disciplina-dados-gerais-tipo-aprovacao">${disciplina.TIPO_APROVACAO_DISCIPLINA}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Trava de crédito:</span>
            <span class="info-disciplina-dados-gerais-trava-credito">${disciplina.TRAVA_DE_CREDITO}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Permite conflito de horário?</span>
            <span class="info-disciplina-dados-gerais-pode-conflitar">${disciplina.PERMITE_CONFLITO_HORARIO_DISCIPLINA}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">É oferecida como Universal?</span>
            <span class="info-disciplina-dados-gerais-oferta-universal">${disciplina.EH_UNIVERSAL_DISCIPLINA}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Permite situação "Em Preparo"?</span>
            <span class="info-disciplina-dados-gerais-pode-em-preparo">${disciplina.PERMITE_EM_PREPARO_DISCIPLINA}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="divContentBlock">
      <h4 class="divContentBlockHeader">Requisitos da Disciplina</h4>
      <div class="divContentBlockBody div-pre-requisitos">
      ${preencherModeloRequisitosDisciplina(disciplina.REQUISITOS)}
      </div>
    </div>
    <div class="divContentBlock">
      <h4 class="divContentBlockHeader">Turmas da Disciplina</h4>
      <div class="divContentBlockBody">

<!-- ---------------------------------------------------------- -->
<!-- INCLUIR AQUI O CONTEÚDO DAS TURMAS (SEGUIR MODELO PRÓPRIO) -->
<!-- ---------------------------------------------------------- -->

      </div>
    </div>
`
  return modeloPreenchidoDetalhesDisciplina;
}


/**
 * @param {object[]} requisitos O conjunto (`array`) de requisitos da disciplina.
 * Caso não haja requisitos, deve-se indicar **com um `array` vazio** (sem elementos).
 * 
 * @returns O modelo de requisitos preenchido.
 */
function preencherModeloRequisitosDisciplina(requisitos) {
  if (!requisitos) {
    throw ReferenceError("Não foi possível identificar a informação dos requisitos da disciplina.");
  }
  if (requisitos.length == 0) {
    return `        <p>Esta disciplina não possui requisito para inscrição.</p>`;
  }
  let htmlRequisitos = [], htmlRequisito = null;
  requisitos.forEach(umRequisito => {
    htmlRequisito =
`        <div class="div-pre-requisito">
          <span class="label-pre-requisito">Pré-Requisito:</span>
          <p class="pre-requisitos">` + "\n";
    if (umRequisito.TIPO_REQUISITO == "REQUISITO_SEM_OPCOES_ALTERNATIVAS") {
        htmlRequisito += getHtmlRequisitoSimples(umRequisito, "");
    } else if (umRequisito.TIPO_REQUISITO == "REQUISITO_COM_OPCOES_ALTERNATIVAS") {
        htmlRequisito += getHtmlRequisitoComOpcaoAlternativa(umRequisito, "");
    }
    htmlRequisitos.push(htmlRequisito);
    // fechando a tag do parágrafo
    htmlRequisito +=
`          </p>
        </div>` + "\n";
  });

  // innner function
    function getHtmlRequisitoSimples(requisitoSimples, indentacao = "") {
    return indentacao +
`            ${requisitoSimples.CODIGO_REQUISITO_DISCIPLINA}: ${requisitoSimples.NOME_REQUISITO_DISCIPLINA}` + "\n";
  }

  // innner function
  function getHtmlRequisitoComOpcaoAlternativa(opcoesDeRequisito, indentacao = "") {
    let htmlTodasAsAlternativas = "";
    // o divisor de alternativas irá constar entre as alternativas
    let divisorDeAlternativas = indentacao +
`            <br/><span class="alternativo">OU</span>` + "\n";

    // o valor do atributo ALTERNATIVAS_REQUISITO é um array de requisitos alternativos
    opcoesDeRequisito.ALTERNATIVAS_REQUISITO.forEach(requisitoAlternativo => {
      if (requisitoAlternativo.TIPO_REQUISITO == "REQUISITO_ALTERNATIVO") {
        // cada opção/alternativa é tratada como um requisito simples
        htmlTodasAsAlternativas += getHtmlRequisitoSimples(requisitoAlternativo, indentacao + "  ");
        // e essas alternativas são separadas por "OU"s que indiquem essa natureza

      } else if (requisitoAlternativo.TIPO_REQUISITO == "REQUISITO_COM_OPCOES_ALTERNATIVAS") { // caso muito atípico, não testado!
        htmlTodasAsAlternativas += getHtmlRequisitoComOpcaoAlternativa(opcoesDeRequisito, indentacao + "  ");
      } // qualquer outra opção de escolha é provavelmente um erro sintático.

      htmlTodasAsAlternativas = htmlTodasAsAlternativas.trimEnd().split("\n").join(divisorDeAlternativas);
    });

    return htmlTodasAsAlternativas;
  }

  // innner function
  // TODO tratar co-requisitos (menos prioritário que todo o resto)
  function getCoRequisitos(requisitos) {
    // provavelmente vai funcionar exatamente como a de comOpcaoAlternativa mas com divisor "E SIMULTANEAMENTE" ao invés de "OU"
  }

  return htmlRequisitos;
}

function testeTransformarListaDisciplinas() {
  transformarListaDisciplinas([JSON.parse(`{
    "EH_PERIODO_SUGERIDO": "Sim",
    "CODIGO_DEPARTAMENTO": "IME04",
    "CODIGO_CINCO_ULTIMOS_NUMEROS": "10817",
    "CODIGO": "IME04-10817",
    "NOME": "Fundamentos da Computação",
    "PERIODO": "1",
    "FOI_ATENDIDA": "Sim",
    "TIPO": "Obrigatória",
    "RAMIFICACAO": "626",
    "NUM_CREDITOS": "5",
    "CARGA_HORARIA_TOTAL": "90",
    "TRAVA_DE_CREDITO": "0"
  }`)]);
}
