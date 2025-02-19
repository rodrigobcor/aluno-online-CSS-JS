/**

Verifica se o horário atende ao seguinte formato:
uma abreviação do dia da semana (logo no início da frase),
seguida de um espaço e dos horários no formato letra-número
(todos estes com espaços entre si),
no limite de 6 horários num mesmo dia (terminando a frase em seguida)
@returns {RegExp} a expressão regular para verificação do horário no formato do Aluno Online
*/
function getRegexHorario() {
    // passo-a-passo:
    const inicioDaString = "^", fimDaString = "$", opcional = "?";
    // os caracteres de início e fim indicam qe não pode haver nada antes ou depois do horário
    // e o caractere de opcionalidade indica que algo pode existir (sem repetição) ou não existir
    // nas demais constantes: "|" (sem aspas) significa "ou"
    const diaDaSemana = "(SEG|TER|QUA|QUI|SEX|SAB)"; // entre parênteses - primeiro grupo de captura

    // cada turno (M, T, N) possui um identificador de intervalo de 1 até 6
    // (exceto à noite, que agora tem 5), separado do grupo anterior por um caractere de espaço
    const turnoEIntervalo = " (M[1-6]|T[1-6]|N[1-5])"; // entre parênteses - segundo grupo de captura

    // todo horário tem pelo menos um turno e um identificador de intervalo,
    // mas normalmente há outros horários, antecedidos por um espaço
    const maisUmTurnoOpcional = "(?:" + turnoEIntervalo + ")" + opcional;
    // a expressão "?:" indicam que, embora estabeleça uma correspondência (match), não é um grupo de captura

    // finalmente, a composição
    // XXX IMPORTANTE: Esse código considera até 5 horários num mesmo dia
    let regexHorario = inicioDaString + diaDaSemana + turnoEIntervalo
        + maisUmTurnoOpcional + maisUmTurnoOpcional + maisUmTurnoOpcional
        + maisUmTurnoOpcional + maisUmTurnoOpcional + fimDaString;
    regexHorario = new RegExp(regexHorario, "gmi"); // global, multilinha, indiferente de maiúscula e minúscula

    // console.log(`Regex horário: ${regexHorario.source}`);
    // Resultado (não confie, o código pode ter mudado!!!): /^(SEG|TER|QUA|QUI|SEX|SAB) (M[1-6]|T[1-6]|N[1-5])(?: (M[1-6]|T[1-6]|N[1-5]))?(?: (M[1-6]|T[1-6]|N[1-5]))?(?: (M[1-6]|T[1-6]|N[1-5]))?(?: (M[1-6]|T[1-6]|N[1-5]))?(?: (M[1-6]|T[1-6]|N[1-5]))?$/gim
    return regexHorario; // cansativo, né?
}

/**

Essa função NÃO testa:
se os horários são sequenciais;
se há horários repetidos;
se os horários fazem sentido.
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
        if (!getRegexHorario().test(horario)) { // erro, não passou mas devia passar
            console.error(O formato de horário "${horario}" teoricamente devia passar mas não passou.);
            numErros++;
        }
    });
    const naoPodemPassar = [
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
        if (getRegexHorario().test(horario)) { // erro, passou mas não devia passar
            console.error(O formato de horário "${horario}" teoricamente não devia passar mas passou.);
            numErros++;
        }
    });
    if (numErros == 0) {
        console.log(Todos os valores de teste foram aprovados, campeão.);
    } else {
        console.log(Total de erros = ${ numErros }.);
    }
}