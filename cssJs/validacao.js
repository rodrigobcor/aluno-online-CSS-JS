/**
 * Verifica se o horário atende ao seguinte formato:
 * uma abreviação do dia da semana (logo no início da frase),
 * seguida de um espaço e dos horários no formato letra-número
 * (todos estes com espaços entre si),
 * no limite de 6 horários num mesmo dia (terminando a frase em seguida)
 * @returns {RegExp} a expressão regular para verificação do horário no formato do Aluno Online
 */
function getRegexHorario() {
  // passo-a-passo pra gente entender:
  
  const inicioDaString = "^", fimDaString = "$"; // útil para indicar qe não pode haver nada antes/depois do horário
  const opcional = "?"; // indica que algo pode (a) existir (sem repetição) ou (b) não existir

  const diaDaSemana = "(SEG|TER|QUA|QUI|SEX|SAB)"; // entre parênteses - primeiro grupo de captura
  
  // cada turno (M, T, N) possui um identificador de intervalo de 1 até 6
  // (exceto à noite, que agora tem 5), separado do grupo anterior por um caractere de espaço
  const turnoEIntervalo = " (M[1-6]|T[1-6]|N[1-5])"; // entre parênteses - segundo grupo de captura
  
  // Cada horário tem pelo menos um turno e um identificador de intervalo,
  // mas normalmente há outros horários, antecedidos por um espaço.
  const maisUmTurnoOpcional = "(?:" + turnoEIntervalo + ")" + opcional;
  // "?:" (sem aspas) indica que, embora tenha que seguir o padrão, não é um grupo de captura
  
  // finalmente, a composição
  // XXX IMPORTANTE: Esse código considera até 5 horários num mesmo dia
  let regexHorario = inicioDaString + diaDaSemana + turnoEIntervalo
      + maisUmTurnoOpcional + maisUmTurnoOpcional + maisUmTurnoOpcional
      + maisUmTurnoOpcional + maisUmTurnoOpcional + fimDaString;

  regexHorario = new RegExp(regexHorario, "gmi"); // global, multilinha, indiferente de maiúsculas e minúsculas

  // console.log(`Regex horário: ${regexHorario.source}`); // pra mostrar o resultado, em caso de manutenção do código
  return regexHorario; // ufa!
}

/**
 * Adapted from regex101.com by Marcelo
 * 
 * @param {RegExp} aRegex The regex to apply.
 * @param {string} text The source text to find matches.
 * @returns {any[]} the list of matches, **as an array of arrays**.
 */
function getArrayOfGroupMatches(aRegex, text) {
  let allResults = [], matchResult;
  while ((matchResult = aRegex.exec(text)) !== null) {
    matchResult = matchResult.splice(1); // removing global match (not necessary)
    allResults.push(matchResult);
    // regex101.com states that this is necessary to avoid infinite loops
    // with zero-width matches (not use it while testing, though)
    if (matchResult.index === aRegex.lastIndex) {
      aRegex.lastIndex++;
    }
  }
  // console.log(`Applying the regex ${aRegex.source} to the text returned : ${JSON.stringify(allResults)}.`);
  return allResults;
}

/**
 * Testa a aplicação da função `getRegexHorario()
 * com relação a dados de entrada.
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
    "QUA T3 T4 T5 T6", // quatro segmentos de horário // assumindo que não há 5 no mesmo dia
    "SAB M6 T1" // só pra testar sábado
  ];
  devemPassar.forEach(horario => {
    if (!getRegexHorario().test(horario)) { // Erro: não passou, mas devia passar.
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
    "QUI N1N",// um dos turnos sem identificador de horário
    "QU N2", // número de caracteres do dia da semana < 3
    "QUIN N3", // número de caracteres do dia da semana > 3
    "SEQ G1", // dia da semana inválido
    // OS FORMATOS A SEGUIR SÃO VÁLIDOS EM OUTROS LUGARES FORA DO AOL
    "TER T3 SEX T3", // dia da semana na mesma linha
    "SEXM1M2" // sem espaço entre os itens      
  ];
  naoPodemPassar.forEach(horario => {
    if (getRegexHorario().test(horario)) { // Erro: passou, mas não devia passar.
      console.error(`O formato de horário "${horario}" teoricamente não devia passar, mas passou.`);
      numErros++;
    }
  });
  if (numErros == 0) {
    console.log(`Todos os valores de teste foram aprovados, campeão!`);
  } else {
    console.log(`Total de erros = ${numErros}.`);
  }
}
