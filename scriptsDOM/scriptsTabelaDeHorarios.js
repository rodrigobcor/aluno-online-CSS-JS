function inserirHorariosNaTabelaDeHorarios() {
  // Limpa todos os horários primeiro (opcional, dependendo do seu caso)
  apagaTabelaDeHorarios();

  const tabelaDisciplinas = document.getElementById('tabela-resumo-plano-inscricoes');
  const linhas = tabelaDisciplinas.querySelectorAll('tbody tr');
  const tabelaIntervalos = document.getElementById('tabela-plano-inscricoes');

  linhas.forEach(linha => {
    const codigo = linha.querySelector('.resumo-disciplina-codigo').textContent.trim();
    const turmaId = linha.querySelector('.resumo-turma-id').textContent.trim();
    const itensHorario = linha.querySelectorAll('.info-disciplina-turma-tempo');

    itensHorario.forEach(item => {
      const textoHorario = item.textContent.trim();
      const [dia, ...horariosDia] = textoHorario.split(' ');

      const diaMap = {
        'SEG': 'seg', 'TER': 'ter', 'QUA': 'qua',
        'QUI': 'qui', 'SEX': 'sex', 'SAB': 'sab'
      };

      const diaClass = diaMap[dia];
      if (!diaClass) return;

      horariosDia.forEach(horario => {
        const celulas = tabelaIntervalos.querySelectorAll(`.${diaClass}.${horario.toLowerCase()}`);

        celulas.forEach(celula => {
          const div = document.createElement('div');
          div.textContent = `${codigo}`;
          div.style.fontSize = 'smaller';
          div.style.padding = '2px';

          // Marca a célula com os dados da disciplina
          celula.setAttribute('data-codigo', codigo);
          celula.setAttribute('data-turma', turmaId);

          celula.innerHTML = '';
          celula.appendChild(div);
        });
      });
    });
  });
}


function apagaTabelaDeHorarios() {
  const tabelaIntervalos = document.getElementById('tabela-plano-inscricoes');
  const celulasComDisciplinas = tabelaIntervalos.querySelectorAll('td[data-codigo]');

  celulasComDisciplinas.forEach(celula => {
    celula.innerHTML = '';
    celula.removeAttribute('data-codigo');
    celula.removeAttribute('data-turma');
  });
}


function removerHorariosDaDisciplina(codigoDisciplina, turmaId) {
  const tabelaIntervalos = document.getElementById('tabela-plano-inscricoes');
  const celulasComDisciplina = tabelaIntervalos.querySelectorAll(
    `td[data-codigo="${codigoDisciplina}"][data-turma="${turmaId}"]`
  );

  celulasComDisciplina.forEach(celula => {
    celula.innerHTML = '';
    celula.removeAttribute('data-codigo');
    celula.removeAttribute('data-turma');
  });
}


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
 * Verifica se o horário atende ao seguinte formato:
 * - uma abreviação do dia da semana (logo no início da frase),
 * - seguida de um espaço e dos horários no formato letra-número
 * (todos estes com espaços entre si),
 * no limite de 6 horários num mesmo dia (terminando a frase em seguida)
 * @returns {RegExp} a expressão regular para verificação do horário no formato do Aluno Online
 */
function getRegexHorario() {
  // passo-a-passo:
  const inicioDaString = "^", fimDaString = "$"; // indicam que não pode haver nada antes ou depois do horário
  const opcional = "?"; // indica que algo pode existir (sem repetição) ou não existir
  // nas demais constantes: "|" (sem aspas) significa "ou"
  const diaDaSemana = "(SEG|TER|QUA|QUI|SEX|SAB)"; // entre parênteses - primeiro grupo de captura

  // cada turno (M, T, N) possui um identificador de intervalo de 1 até 6
  // (exceto à noite, que agora tem 5), separado do grupo anterior por um caractere de espaço
  const turnoEIntervalo = " (M[1-6]|T[1-6]|N[1-5])"; // entre parênteses - segundo grupo de captura

  // os horário têm pelo menos um turno e um identificador de intervalo,
  // mas normalmente há outros horários, antecedidos por um espaço
  const maisUmTurnoOpcional = "(?:" + turnoEIntervalo + ")" + opcional;
  // a expressão "?:" (sem aspas) indica que, embora estabeleça uma correspondência (match), não é um grupo de captura

  // finalmente, a composição
  // XXX IMPORTANTE: Esse código considera até 5 horários num mesmo dia
  let regexHorario = inicioDaString + diaDaSemana + turnoEIntervalo
      + maisUmTurnoOpcional + maisUmTurnoOpcional + maisUmTurnoOpcional
      + maisUmTurnoOpcional + maisUmTurnoOpcional + fimDaString;

  regexHorario = new RegExp(regexHorario, "gmi"); // global, multilinha, indiferente de maiúsculas e minúsculas

  // console.log(`Regex horário: ${regexHorario.source}`); // pra mostrar o resultado, em caso de manutenção do código
  // Resultado (não confie, o código pode ter mudado!!!): /^(SEG|TER|QUA|QUI|SEX|SAB) (M[1-6]|T[1-6]|N[1-5])(?: (M[1-6]|T[1-6]|N[1-5]))?(?: (M[1-6]|T[1-6]|N[1-5]))?(?: (M[1-6]|T[1-6]|N[1-5]))?(?: (M[1-6]|T[1-6]|N[1-5]))?(?: (M[1-6]|T[1-6]|N[1-5]))?$/gim
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
      // OS FORMATOS A SEGUIR SÃO VÁLIDOS EM OUTROS LUGARES FORA DO AOL:
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
      console.log(`Todos os valores de teste foram aprovados.`);
    } else {
      console.log(`Total de erros = ${numErros}.`);
    }
  }
}
