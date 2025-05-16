/**
 * Obtém os detalhes de determinada disciplina do período, no formato HTML.
 * 
 * Essa função não altera nenhum dado do servidor original.
 * 
 * @param {number} codDisciplina O código identificador da disciplina (apenas números).
 */
function getDetalhesDisciplinas(codDisciplina) {
  if (!codDisciplina) {
    throw SyntaxError("Para obter os detalhes da disciplina, "
      + "é necessário informar o código identificador (somente números).");
  }

  // Substitui temporariamente a função submit do formulário
  const formOutput = document.querySelector('form'); // Substitua pelo seletor do formulário
  const originalSubmit = formOutput.submit; // Salva a função original

  let dadosDisciplina = ""; // declarando fora do escopo da função pra retornar o resultado

  // Substitui o método submit para obter os dados
  formOutput.submit = function () {
    // Extrai os campos do formulário
    const formData = new FormData(formOutput);
    const url = formOutput.action || window.location.href; // URL do formulário

    // Faz a solicitação com `fetch` e obtém o HTML
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(html => {
        // TODO ainda precisa ajustar os números que estão hard-coded

        // Agora, selecionando a parte relevante do conteúdo HTML obtido
        let inicio = html.indexOf("<form") + 411; // recupera o índice logo após o ": "
        let fim = html.indexOf("</form>") - 199;
        dadosDisciplina = html.slice(inicio, fim); // variável declarada fora do escopo da função
        // console.log(dadosDisciplina); // Exibe os dados da disciplina
      })
      .catch(error => console.error("Erro ao consultar página.\nDetalhes técnicos: ", error));
  };

  // Agora, chame a função consultar com o código desejado
  consultarDisciplina(formOutput, codDisciplina);

  // Restaura o método submit original
  formOutput.submit = originalSubmit;

  return dadosDisciplina;
}

function testGetDetalhesDisciplinas(codDisciplina) {
  codDisciplina = codDisciplina || "10815"; // um código (válido) qualquer
  let htmlDadosDisciplina = getDetalhesDisciplinas(codDisciplina);
  console.log(htmlDadosDisciplina);
}


/**
 * Obtém os horários da lista criada anteriormente.
 * 
 * @returns {string[]} os horários obtida da lista de disciplinas selecionadas para matrícula
 */
function getHorariosDaLista() {
  let celulasHorarios = document.querySelectorAll(".resumo-turma-tempos");
  let horarios = [];
  celulasHorarios.forEach(horario => horarios.push(horario.innerText));
  return horarios;
}

/**
 * Obtém a matrícula e nome do aluno que está autenticado.
 */
function getMatriculaENomeDoAluno() {
  let matriculaENome = document.querySelector("#table_cabecalho_rodape > tbody > tr:nth-child(3) > td > font").innerText;
  console.log(matriculaENome);
  [matricula, nome] = matriculaENome.split(" - ");
  return {
    "matricula": matricula,
    "nome": nome
  };
}

/**
 * NOTA: Essa função **NÃO FILTRA** uma disciplina específica para obter seu conteúdo.
 * Ao invés disso, extrai os dados de TODAS as disciplinas.
 * Por isso, deve ser usada APENAS QUANDO **IMPRESCINDÍVEL**,
 * para que não haja um excesso de requisições que
 * venham a resultar em negação de serviço pelo servidor.
 * 
 * Seleciona, a partir do DOM, os elementos HTML para coleta, e extrai os dados pertinentes.
 * 
 * @returns {object[]} Uma lista de objetos JSON, cada um com os dados de uma disciplina.
 */
function extrairDadosGeraisDisciplinas() {
  let todasAsDisciplinasHTML = document.getElementsByClassName("reportTable");
  if (todasAsDisciplinasHTML) {
    todasAsDisciplinasHTML = todasAsDisciplinasHTML[0].getElementsByTagName("tr");
  } else {
    throw ReferenceError("Não foi possível encontrar a tabela de disciplinas");
  }
  let listaDadosDisciplinas = [], htmlDeUmaDisciplina = "";
  for (let i = 1; i < todasAsDisciplinasHTML.length; i++) { // primeiro elemento (0): início da tabela (cabeçalhosdas colunas)
    htmlDeUmaDisciplina = todasAsDisciplinasHTML[i].innerHTML;
    // console.log(htmlDeUmaDisciplina);
    listaDadosDisciplinas.push(extrairDadosDisciplina(htmlDeUmaDisciplina));
  }
  return listaDadosDisciplinas;
}

/**
 * Extrai os dados da disciplina a partir do trecho HTML equivalente.
 * 
 * ATENÇÃO: Infelizmente, a página-fonte não contém identificadores
 * que permitam uma consulta mais direta.
 * Esta função é compatível com a versão do sistema disponibilizada no período 2025/1.
 * Qualquer alteração no formato HTML original pode comprometer seu funcionamento.
 * 
 * @param {string} htmlDisciplina O trecho HTML que contém os dados da disciplina.
 * @returns {object} um objeto JSON com os dados estruturados da disciplina.
 */
function extrairDadosDisciplina(htmlDisciplina) {
  let EstruturacaoDeDados = {
    DEPTO_NUM_COD_NOME: {
      // dois \s pra não ignorar espaço entre palavras
      contentToFind: /\s*<span style="vertical-align: top;">([A-Z]{3}[0-9]{2})(?:-| )([0-9]{5})\s*(.+?)\s\s+<\/span>\s*/gm,
      // replace: "\nCODIGO_DEPARTAMENTO:$1\nCODIGO_CINCO_ULTIMOS_NUMEROS:$2\nCODIGO:$1-$2\nNOME:$3\n"
    },
    TURMA_NO_PERIODO: {
      contentToFind:/\s*<span style="vertical-align: top;">\s*(Sim|Não)\s*<\/span>\s*/gm,
      // replace: "\nEH_PERIODO_SUGERIDO:$1\n"
    },
    DEMAIS_CAMPOS: {
      contentToFind: /\s*<td style="text-align: center;">([0-9 -]+?)<\/td>\n\s*<td style="text-align: center;">(Sim|Não)<\/td>\n\s*<td style="text-align: center;">(.+?)<\/td>\n\s*<td style="text-align: center;">([0-9]+?)<\/td>\n\s*<td style="text-align: center;">([0-9]+?)<\/td>\n\s*<td style="text-align: center;">([0-9]+?)<\/td>\n\s*<td style="text-align: center;">([0-9]+?)<\/td>/gm,
      // replace: "\nPERIODO:$1\nFOI_ATENDIDA:$2\nTIPO:$3\nCODIGO_RAMIFICACAO:$4\nNUM_CREDITOS:$5\nCARGA_HORARIA_TOTAL:$6\nTRAVA_DE_CREDITO:$7\n"
    }
  };

  let dadosDeUmaDisciplina = {};
  const DADO_NAO_ENCONTRADO = "Dado não encontrado. Acesse a interface padrão do sistema.";

  let resultadoDoMatch = EstruturacaoDeDados.TURMA_NO_PERIODO["contentToFind"].exec(htmlDisciplina);
  if (resultadoDoMatch) {
    dadosDeUmaDisciplina["EH_PERIODO_SUGERIDO"] = resultadoDoMatch[1];
  }

  resultadoDoMatch = EstruturacaoDeDados.DEPTO_NUM_COD_NOME["contentToFind"].exec(htmlDisciplina);
  if (resultadoDoMatch) {
    dadosDeUmaDisciplina["CODIGO_DEPARTAMENTO"] = resultadoDoMatch[1];
    dadosDeUmaDisciplina["CODIGO_CINCO_ULTIMOS_NUMEROS"] = resultadoDoMatch[2] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["CODIGO"] = `${resultadoDoMatch[1]}-${resultadoDoMatch[2]}` || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["NOME"] = resultadoDoMatch[3] || DADO_NAO_ENCONTRADO;
  }

  console.log(htmlDisciplina);
  console.log(EstruturacaoDeDados.DEMAIS_CAMPOS["contentToFind"]);

  resultadoDoMatch = EstruturacaoDeDados.DEMAIS_CAMPOS["contentToFind"].exec(htmlDisciplina);
  if (resultadoDoMatch) {
    dadosDeUmaDisciplina["PERIODO"] = resultadoDoMatch[1] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["FOI_ATENDIDA"] = resultadoDoMatch[2] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["TIPO"] = resultadoDoMatch[3] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["CODIGO_RAMIFICACAO"] = resultadoDoMatch[4] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["NUM_CREDITOS"] = resultadoDoMatch[5] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["CARGA_HORARIA_TOTAL"] = resultadoDoMatch[6] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["TRAVA_DE_CREDITO"] = resultadoDoMatch[7] || DADO_NAO_ENCONTRADO;
  }

  // console.log(dadosDeUmaDisciplina);
  return dadosDeUmaDisciplina;
}

/**
 * Extrai os dados da disciplina a partir do trecho HTML equivalente.
 * 
 * ATENÇÃO: Infelizmente, a página-fonte não contém identificadores
 * que permitam uma consulta mais direta.
 * Esta função é compatível com a versão do sistema disponibilizada no período 2025/1.
 * Qualquer alteração no formato HTML original pode comprometer seu funcionamento.
 * 
 * @param {string} htmlDetalhesDisciplina O trecho HTML que contém os dados detalhados da disciplina.
 * @param {object} disciplina Um objeto JSON com os dados já obtidos na lista de disciplinas.
   @returns {object} o objeto JSON com os dados originais acrescidos dos dados complementares da disciplina.
 */
function extrairDadosComplementaresDisciplina(htmlDetalhesDisciplina, dadosDeUmaDisciplina) {
  // TODO AINDA NÃO EXTRAI, chamando stub
  return stubExtrairDadosComplementaresDisciplina(dadosDeUmaDisciplina);

  let EstruturacaoDeDados = {
    TODO_REGEX_PRA_VERIFICAR_CONSISTENCIA: {
      contentToFind: /TODO/gm,
      // replace: "TODO"
    },
    TODO_ID_EXPRESSAO_REGULAR: {
      contentToFind: /TODO/gm,
      // replace: "TODO"
    } // ...
  };

  dadosDeUmaDisciplina = dadosDeUmaDisciplina || {};
  const DADO_NAO_ENCONTRADO = "Dado não encontrado. Acesse a interface padrão do sistema.";
  const DADO_INCONSISTENTE = "Há uma inconsistência entre as informações gerais da disciplina e seus detalhes. Acesse a interface padrão do sistema."

  let resultadoDoMatch = EstruturacaoDeDados.TODO_REGEX_PRA_VERIFICAR_CONSISTENCIA["contentToFind"].exec(htmlDetalhesDisciplina);
  if (resultadoDoMatch) {

    // os dados a seguir são comuns à parte de dados gerais e a de dados detalhados da disciplina, e precisam estar consistentes
    // TODO preencher campos, subdividir depois quais são extraíveis de quais regexes
    // TODO todos os índices do resultado do match são hipotéticos e devem ser substituídos
    verificarConsistencia(resultadoDoMatch[1], dadosDeUmaDisciplina["NUM_CREDITOS"]);
    verificarConsistencia(resultadoDoMatch[2], dadosDeUmaDisciplina["CARGA_HORARIA_TOTAL"]);
    verificarConsistencia(resultadoDoMatch[3], dadosDeUmaDisciplina["EH_PERIODO_SUGERIDO"]); // FIXME isso REALMENTE está nos detalhes da disciplina???
    verificarConsistencia(resultadoDoMatch[4], dadosDeUmaDisciplina["TRAVA_DE_CREDITO"]);

    // se estiver tudo ok, continua
  }

  resultadoDoMatch = EstruturacaoDeDados.TODO_ID_EXPRESSAO_REGULAR["contentToFind"].exec(htmlDetalhesDisciplina);
  if (resultadoDoMatch) {
    // TODO preencher campos, subdividir depois quais são extraíveis de quais regexes
    // TODO todos os índices do resultado do match são hipotéticos e devem ser substituídos
    dadosDeUmaDisciplina["CARGA_HORARIA_SEMANAL"] = resultadoDoMatch[1] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["TEMPO_DURACAO"] = resultadoDoMatch[2] || DADO_NAO_ENCONTRADO;dadosDeUmaDisciplina["TIPO_APROVACAO"] = resultadoDoMatch[3] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["PERMITE_CONFLITO_HORARIO"] = resultadoDoMatch[4] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["EH_UNIVERSAL"] = resultadoDoMatch[5] || DADO_NAO_ENCONTRADO; // XXX não sei por que isso (entre outros) é mantido, dá pra ver pela lista
    dadosDeUmaDisciplina["PERMITE_EM_PREPARO"] = resultadoDoMatch[6] || DADO_NAO_ENCONTRADO;

    dadosDeUmaDisciplina["REQUISITOS"] = extrairRequisitos(htmlDetalhesDisciplina, dadosDeUmaDisciplina);
  }

  return htmlDetalhesDisciplina;

  // inner function
  function verificarConsistencia(dadoEsperado, dadoRecebido) {
    if (dadoEsperado != dadoRecebido) {
      throw ReferenceError(DADO_INCONSISTENTE);
    }
  }
}

function extrairRequisitos(htmlDetalhesDisciplina) {
  // TODO AINDA NÃO EXTRAI, chamando stub
  return stubExtrairRequisitos();

  // TODO RASCUNHO A PARTIR DO STUB
  let requisitos = []; // se não tiver nenhum, fica vazio

  // ========= PARA CADA REQUISITO INVARIÁVEL: =========
  // Passo 1: Criar o requisito
  let requisitoUnico = {
    TIPO_REQUISITO: "REQUISITO_SEM_OPCOES_ALTERNATIVAS",
    CODIGO_REQUISITO_DISCIPLINA: "[valor do código do requisito]",
    NOME_REQUISITO_DISCIPLINA: "[valor do nome do requisito]"
  };
  // Passo 2: Incluir na lista de requisitos
  requisitos.push(requisitoUnico);

  // ========= PARA CADA REQUISITO COM ALTERNATIVAS (UM *OU* OUTRO): =========

  // Passo 1: criar um objeto que funciona como um agregador de alternativas
  let opcoesDeRequisito = {
    TIPO_REQUISITO: "REQUISITO_COM_OPCOES_ALTERNATIVAS",
    ALTERNATIVAS_REQUISITO: [] // por definição, tem que ter pelo menos dois requisitos como alternativas
  }
  // Passo 2: criar cada alternativa separadamente
  let requisitoAlternativo1 = {
    TIPO_REQUISITO: "REQUISITO_ALTERNATIVO",
    CODIGO_REQUISITO_DISCIPLINA: "[valor do código do requisito alternativo 1]",
    NOME_REQUISITO_DISCIPLINA: "[valor do nome do requisito alternativo 1]"
  };
  let requisitoAlternativo2 = {
    TIPO_REQUISITO: "REQUISITO_ALTERNATIVO",
    CODIGO_REQUISITO_DISCIPLINA: "[valor do código do requisito alternativo 2]",
    NOME_REQUISITO_DISCIPLINA: "[valor do nome do requisito alternativo 2]"
  };
  // Passo 3: PARA CADA ALTERNATIVA CRIADA, inclui-la no agregador de alternativas
  opcoesDeRequisito["ALTERNATIVAS_REQUISITO"].push(requisitoAlternativo1);
  opcoesDeRequisito["ALTERNATIVAS_REQUISITO"].push(requisitoAlternativo2);
  // reforçando: deve haver ao menos duas inclusões, por serem duas alternativas

  // Passo 4: Incluir o agregador de alternativas na lista de requisitos
  requisitos.push(opcoesDeRequisito);

  return requisitos;
}

function stubExtrairDadosComplementaresDisciplina(dadosDeUmaDisciplina) {
  console.log("ATENÇÃO: Os dados complementares da disciplina são hipotéticos e apenas para testes!");

  dadosDeUmaDisciplina = dadosDeUmaDisciplina || {};
  // dadosDeUmaDisciplina["NUM_CREDITOS"] = "[valor do número de créditos]"; // JÁ TEM ESSE DADO, só pra conferir consistência
  dadosDeUmaDisciplina["CARGA_HORARIA_SEMANAL"] = "[valor da carga horária semanal]";
  // dadosDeUmaDisciplina["CARGA_HORARIA_TOTAL"] = "[valor da carga horária total]"; // JÁ TEM ESSE DADO, só pra conferir consistência
  // dadosDeUmaDisciplina["EH_PERIODO_SUGERIDO"] = "[valor indicando se é o período sugerido]"; // JÁ TEM ESSE DADO, só pra conferir consistência
  dadosDeUmaDisciplina["TEMPO_DURACAO"] = "[valor do tempo de duração]";
  dadosDeUmaDisciplina["TIPO_APROVACAO"] = "[valor do tipo de aprovação]";
  // dadosDeUmaDisciplina["TRAVA_DE_CREDITO"] = "[valor da trava de crédito]" // JÁ TEM ESSE DADO, só pra conferir consistência
  dadosDeUmaDisciplina["PERMITE_CONFLITO_HORARIO"] = "[valor indicando se tem conflito de horário]";
  dadosDeUmaDisciplina["EH_UNIVERSAL"] = "[valor indicando se é do tipo Universal]"; // XXX não sei por que isso (entre outros) é mantido, dá pra ver pela lista
  dadosDeUmaDisciplina["PERMITE_EM_PREPARO"] = "[valor indicando se permite lançamento \"em preparo\"]";

  dadosDeUmaDisciplina["REQUISITOS"] = extrairRequisitos(dadosDeUmaDisciplina);

  return dadosDeUmaDisciplina;
}

function stubExtrairRequisitos() {
  console.log("ATENÇÃO: Os dados de requisitos são hipotéticos e apenas para testes!");
  let requisitos = []; // se não tiver nenhum, fica vazio

  let requisitoUnico = {
    TIPO_REQUISITO: "REQUISITO_SEM_OPCOES_ALTERNATIVAS",
    CODIGO_REQUISITO_DISCIPLINA: "[valor do código do requisito]",
    NOME_REQUISITO_DISCIPLINA: "[valor do nome do requisito]"
  };
  requisitos.push(requisitoUnico);

  let opcoesDeRequisito = {
    TIPO_REQUISITO: "REQUISITO_COM_OPCOES_ALTERNATIVAS",
    ALTERNATIVAS_REQUISITO: [] // por definição, tem que ter pelo menos dois requisitos como alternativas
  }
  let requisitoAlternativo1 = {
    TIPO_REQUISITO: "REQUISITO_ALTERNATIVO",
    CODIGO_REQUISITO_DISCIPLINA: "[valor do código do requisito alternativo 1]",
    NOME_REQUISITO_DISCIPLINA: "[valor do nome do requisito alternativo 1]"
  };
  let requisitoAlternativo2 = {
    TIPO_REQUISITO: "REQUISITO_ALTERNATIVO",
    CODIGO_REQUISITO_DISCIPLINA: "[valor do código do requisito alternativo 2]",
    NOME_REQUISITO_DISCIPLINA: "[valor do nome do requisito alternativo 2]"
  };
  opcoesDeRequisito["ALTERNATIVAS_REQUISITO"].push(requisitoAlternativo1);
  opcoesDeRequisito["ALTERNATIVAS_REQUISITO"].push(requisitoAlternativo2);
  requisitos.push(opcoesDeRequisito);

  return requisitos;
}

/**
 * Realiza a busca por uma discplina a partir de seu código.
 * 
 * @param {string} formOutput O nome do formulário.
 * @param {string} codigo O código da disciplina a ser consultada.
 */
function consultarDisciplina(formOutput, codigo) {
  formCreateHiddenInputField(formOutput, 'disciplinas[0]', codigo);
  formOutput.submit();
}

/**
 * Realiza a busca por uma turma a partir do código da disciplina.
 * 
 * @param {string} formOutput O nome do formulário.
 * @param {string} codigo O código da disciplina a ser consultada.
 * @param {} requisicao Os dados da requisição a ser solicitada.
 */
function consultarTurmasDisciplina(formOutput, codigo, requisicao) {
  formCreateHiddenInputField(formOutput, 'disciplinas[0]', codigo);

  // mantém um cópia da definição da requisição original
  var requisicaoOriginal = formOutput.elements["requisicao"].value;

  // efetua a requisição solicitada
  formOutput.elements["requisicao"].value = requisicao;
  formOutput.submit();

  // retorna à definição da requisição original
  formOutput.elements["requisicao"].value = requisicaoOriginal;
}

/**
 * Gera o conteúdo HTML com os dados de uma disciplina, utilizando o modelo de estruturação dos dados.
 * 
 * @param {object} disciplina Um objeto JSON com os dados da disciplina.
 * @returns {string} O conteúdo estruturado com os dados da disciplina.
 */
function preencherModeloDisciplina(disciplina) {

  /* Obs.: Os espaços precedentes por linha, para a devida
   * indentação com restante do código, devem ser incluídos à parte.
   */
  let modeloPreenchidoDisciplina = `
<!-- ${disciplina.NOME} -->
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
  <td class="disciplina-codigo-ramificacao">${disciplina.CODIGO_RAMIFICACAO}</td>
  <td class="disciplina-num-creditos">${disciplina.NUM_CREDITOS}</td>
  <td class="disciplina-ch-total">${disciplina.CARGA_HORARIA_TOTAL}</td>
  <td class="disciplina-periodo-sugerido" data-periodo-sugerido="${disciplina.EH_PERIODO_SUGERIDO == "Sim"}">
    <a href="#" onclick="javascript:consultarDisciplina(output, ${disciplina.CODIGO_CINCO_ULTIMOS_NUMEROS}); return false;">&#128269;</a>
    <span class="texto-periodo-sugerido">${disciplina.EH_PERIODO_SUGERIDO}</span>
  </td>
  <td class="disciplina-trava-credito" data-creditos-necessarios="${disciplina.TRAVA_DE_CREDITO}">${disciplina.TRAVA_DE_CREDITO}</td>
  <td colspan="8" class="fold detalhes-disciplina">
${preencherModeloDetalhesDisciplina(disciplina)}
  </td>
</tr>
`;
  return modeloPreenchidoDisciplina;
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

  let modeloPreenchidoDetalhesDisciplina = 
`    <div class="divContentBlock">
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
            <span  class="info-disciplina-dados-gerais-ch-semanal">${disciplina.CARGA_HORARIA_SEMANAL}</span>
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
            <span class="info-disciplina-dados-gerais-tempo-duracao">${disciplina.TEMPO_DURACAO}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Tipo de aprovação:</span>
            <span class="info-disciplina-dados-gerais-tipo-aprovacao">${disciplina.TIPO_APROVACAO}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Trava de crédito:</span>
            <span class="info-disciplina-dados-gerais-trava-credito">${disciplina.TRAVA_DE_CREDITO}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Permite conflito de horário?</span>
            <span class="info-disciplina-dados-gerais-pode-conflitar">${disciplina.PERMITE_CONFLITO_HORARIO}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">É oferecida como Universal?</span>
            <span class="info-disciplina-dados-gerais-oferta-universal">${disciplina.EH_UNIVERSAL}</span>
          </li>
          <li>
            <span class="label-info-disciplina-dados-gerais">Permite situação "Em Preparo"?</span>
            <span class="info-disciplina-dados-gerais-pode-em-preparo">${disciplina.PERMITE_EM_PREPARO}</span>
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
    </div>`;
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
    // fechando a tag do parágrafo
    htmlRequisito +=
`          </p>
        </div>`;
    htmlRequisitos.push(htmlRequisito);
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
    let divisorDeAlternativas = "\n" + indentacao +
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
    });
    htmlTodasAsAlternativas = htmlTodasAsAlternativas.trimEnd().split("\n").join(divisorDeAlternativas) + "\n";
    return htmlTodasAsAlternativas;
  }

  // innner function
  // TODO tratar co-requisitos (menos prioritário que todo o resto)
  function getCoRequisitos(requisitos) {
    // provavelmente vai funcionar exatamente como a de comOpcaoAlternativa mas com divisor "E SIMULTANEAMENTE" ao invés de "OU"
  }

  // retornando todo o conteúdo HTML removendo vírgula separadora dos trechos
  return htmlRequisitos.join("\n");
}

function testeTransformarListaDisciplinas() {
  transformarListaDisciplinas([
    JSON.parse(`{
      "CODIGO_DEPARTAMENTO": "IME04",
      "CODIGO_CINCO_ULTIMOS_NUMEROS": "10817",
      "CODIGO": "IME04-10817",
      "NOME": "Fundamentos da Computação",
      "PERIODO": "1",
      "FOI_ATENDIDA": "Sim",
      "TIPO": "Obrigatória",
      "CODIGO_RAMIFICACAO": "626",
      "NUM_CREDITOS": "5",
      "CARGA_HORARIA_TOTAL": "90",
      "EH_PERIODO_SUGERIDO": "Sim",
      "TRAVA_DE_CREDITO": "0"
    }`),
    JSON.parse(`{
      "CODIGO_DEPARTAMENTO": "ILE02",
      "CODIGO_CINCO_ULTIMOS_NUMEROS": "10822",
      "CODIGO": "ILE02-10822",
      "NOME": "Português Instrumental",
      "PERIODO": "3",
      "FOI_ATENDIDA": "Sim",
      "TIPO": "Obrigatória",
      "CODIGO_RAMIFICACAO": "626",
      "NUM_CREDITOS": "4",
      "CARGA_HORARIA_TOTAL": "60",
      "EH_PERIODO_SUGERIDO": "Sim",
      "TRAVA_DE_CREDITO": "0"
    }`)
  ]);
}
