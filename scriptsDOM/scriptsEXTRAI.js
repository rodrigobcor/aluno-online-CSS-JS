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
    listaDadosDisciplinas.push(extrairDadosDisciplina2025_1(htmlDeUmaDisciplina));
  }
  return listaDadosDisciplinas;
}

/**
 * ATENÇÃO: Infelizmente, a página-fonte não contém identificadores
 * que permitam uma consulta mais direta.
 * Esta função é compatível com a versão do sistema disponibilizada no período 2025/1.
 * Qualquer alteração no formato HTML original pode comprometer seu funcionamento.
 * 
 * @param {string} htmlDisciplina O trecho HTML que contém os dados da disciplina.
 * @returns {object} um objeto JSON com os dados estruturados da disciplina.
 */
function extrairDadosDisciplina2025_1(htmlDaDisciplina) {
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
      // replace: "\nPERIODO:$1\nFOI_ATENDIDA:$2\nTIPO:$3\nRAMIFICACAO:$4\nNUM_CREDITOS:$5\nCARGA_HORARIA_TOTAL:$6\nTRAVA_DE_CREDITO:$7\n"
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
    dadosDeUmaDisciplina["RAMIFICACAO"] = resultadoDoMatch[4] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["NUM_CREDITOS"] = resultadoDoMatch[5] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["CARGA_HORARIA_TOTAL"] = resultadoDoMatch[6] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["TRAVA_DE_CREDITO"] = resultadoDoMatch[7] || DADO_NAO_ENCONTRADO;
  }

  // console.log(dadosDeUmaDisciplina);
  return dadosDeUmaDisciplina;
}


/**
 * 
 * @param {object} disciplina Um objeto JSON com os dados já obtidos na lista de disciplinas.
   @returns {object} os dados originais acrescidos dos dados complementares da disciplina, mantendo a estrutura JSON
 */
function extrairDadosComplementaresDisciplina2025_1(dadosDeUmaDisciplina) {
  // TODO AINDA NÃO EXTRAI

  // TODO cenário mock com dados temporários, para teste
  console.log("ATENÇÃO: Dados de teste!");

  dadosDeUmaDisciplina = dadosDeUmaDisciplina || {};
  // dadosDeUmaDisciplina["NUM_CREDITOS"] = "[valor do número de créditos]"; // JÁ TEM ESSE DADO, só pra conferir consistência
  dadosDeUmaDisciplina["CH_SEMANAL_DISCIPLINA"] = "[valor da carga horária semanal]";
  // dadosDeUmaDisciplina["CARGA_HORARIA_TOTAL"] = "[valor da carga horária total]"; // JÁ TEM ESSE DADO, só pra conferir consistência
  // dadosDeUmaDisciplina["EH_PERIODO_SUGERIDO"] = "[valor indicando se é o período sugerido]"; // JÁ TEM ESSE DADO, só pra conferir consistência
  dadosDeUmaDisciplina["TEMPO_DURACAO_DISCIPLINA"] = "[valor do tempo de duração]";
  dadosDeUmaDisciplina["TIPO_APROVACAO_DISCIPLINA"] = "[valor do tipo de aprovação]";
  // dadosDeUmaDisciplina["TRAVA_DE_CREDITO"] = "[valor da trava de crédito]" // JÁ TEM ESSE DADO, só pra conferir consistência
  dadosDeUmaDisciplina["PERMITE_CONFLITO_HORARIO_DISCIPLINA"] = "[valor indicando se tem conflito de horário]";
  dadosDeUmaDisciplina["EH_UNIVERSAL_DISCIPLINA"] = "[valor indicando se é do tipo Universal]"; // XXX não sei por que isso (entre outros) é mantido, dá pra ver pela lista
  dadosDeUmaDisciplina["PERMITE_EM_PREPARO_DISCIPLINA"] = "[valor indicando se permite lançamento \"em preparo\"]";

  dadosDeUmaDisciplina["REQUISITOS"] = extrairRequisitos(dadosDeUmaDisciplina);

  return dadosDeUmaDisciplina;

  // Função auxiliar interna, para melhor coesão
  function extrairRequisitos() {
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
}
