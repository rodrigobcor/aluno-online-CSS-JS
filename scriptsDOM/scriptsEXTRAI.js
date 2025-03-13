/**
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
 * Esta função é compatível com a versão 2025-1 do sistema.
 * Qualquer alteração no formato HTML original pode comprometer seu funcionamento!
 * 
 * @param {string} htmlDaDisciplina 
 * @returns {object} um objeto JSON com os dados da disciplina
 */
function extrairDadosDisciplina2025_1(htmlDaDisciplina) {
  let EstruturacaoDeDados = {
    DEPTO_NUM_COD_NOME: {
      // dois \s pra não ignorar espaço entre palavras
      contentToFind: /\s*<span style="vertical-align: top;">([A-Z]{3}[0-9]{2})(?:-| )([0-9]{5})\s*(.+?)\s\s+<\/span>\s*/gm,
      // replace: "\nCODIGO_DEPARTAMENTO_DISCIPLINA:$1\nCODIGO_DISCIPLINA_CINCO_ULTIMOS_NUMEROS:$2\nCODIGO_DISCIPLINA:$1-$2\nNOME_DISCIPLINA:$3\n"
    },
    TURMA_NO_PERIODO: {
      contentToFind:/\s*<span style="vertical-align: top;">\s*(Sim|Não)\s*<\/span>\s*/gm,
      // replace: "\nEH_PERIODO_SUGERIDO:$1\n"
    },
    DEMAIS_CAMPOS: {
      contentToFind: /\s*<td style="text-align: center;">([0-9 -]+?)<\/td>\n\s*<td style="text-align: center;">(Sim|Não)<\/td>\n\s*<td style="text-align: center;">(.+?)<\/td>\n\s*<td style="text-align: center;">([0-9]+?)<\/td>\n\s*<td style="text-align: center;">([0-9]+?)<\/td>\n\s*<td style="text-align: center;">([0-9]+?)<\/td>\n\s*<td style="text-align: center;">([0-9]+?)<\/td>/gm,
      // replace: "\nPERIODO_DISCIPLINA:$1\nDISCIPLINA_JA_ATENDIDA:$2\nTIPO_DISCIPLINA:$3\nCODIGO_RAMIFICACAO_DISCIPLINA:$4\nNUM_CREDITOS_DISCIPLINA:$5\nCH_TOTAL_DISCIPLINA:$6\nTRAVA_CREDITO_DISCIPLINA:$7\n"
    }
  };

  let dadosDeUmaDisciplina = {};
  const DADO_NAO_ENCONTRADO = "Dado não encontrado. Acesse a interface padrão do sistema.";
  
  let resultadoDoMatch = EstruturacaoDeDados.TURMA_NO_PERIODO["contentToFind"].exec(htmlDaDisciplina);
  if (resultadoDoMatch) {
    dadosDeUmaDisciplina["EH_PERIODO_SUGERIDO"] = resultadoDoMatch[1];
  }

  resultadoDoMatch = EstruturacaoDeDados.DEPTO_NUM_COD_NOME["contentToFind"].exec(htmlDaDisciplina);
  if (resultadoDoMatch) {
    dadosDeUmaDisciplina["CODIGO_DEPARTAMENTO_DISCIPLINA"] = resultadoDoMatch[1];
    dadosDeUmaDisciplina["CODIGO_DISCIPLINA_CINCO_ULTIMOS_NUMEROS"] = resultadoDoMatch[2] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["CODIGO_DISCIPLINA"] = `${resultadoDoMatch[1]}-${resultadoDoMatch[2]}` || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["NOME_DISCIPLINA"] = resultadoDoMatch[3] || DADO_NAO_ENCONTRADO;
  }

  console.log(htmlDaDisciplina);
  console.log(EstruturacaoDeDados.DEMAIS_CAMPOS["contentToFind"]);

  resultadoDoMatch = EstruturacaoDeDados.DEMAIS_CAMPOS["contentToFind"].exec(htmlDaDisciplina);
  if (resultadoDoMatch) {
    dadosDeUmaDisciplina["PERIODO_DISCIPLINA"] = resultadoDoMatch[1] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["DISCIPLINA_JA_ATENDIDA"] = resultadoDoMatch[2] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["TIPO_DISCIPLINA"] = resultadoDoMatch[3] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["CODIGO_RAMIFICACAO_DISCIPLINA"] = resultadoDoMatch[4] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["NUM_CREDITOS_DISCIPLINA"] = resultadoDoMatch[5] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["CH_TOTAL_DISCIPLINA"] = resultadoDoMatch[6] || DADO_NAO_ENCONTRADO;
    dadosDeUmaDisciplina["TRAVA_CREDITO_DISCIPLINA"] = resultadoDoMatch[7] || DADO_NAO_ENCONTRADO;
  }

  console.log(dadosDeUmaDisciplina);
  return dadosDeUmaDisciplina;
}
