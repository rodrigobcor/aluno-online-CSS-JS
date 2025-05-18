function turmaJaExiste(codigoDisciplina, numeroTurma) {
  const linhas = document.querySelectorAll('#tabela-resumo-plano-inscricoes tbody tr');

  for (const linha of linhas) {
    const codigo = linha.querySelector('.resumo-disciplina-codigo').textContent.trim();
    const turma = linha.querySelector('.resumo-turma-id').textContent.trim();

    if (codigo === codigoDisciplina && turma === numeroTurma) {
      return true;
    }
  }
  return false;
}

function adicionarTurmaNaTabela(turmaId) {
  // Seleciona o TD com os detalhes da disciplina
  const tdDetalhes = document.querySelector('#tabela-disciplinas > tbody > tr.dados-disciplina.open > td.detalhes-disciplina.open');


    // Extrai as informações da disciplina
    const nomeDisciplina = tdDetalhes.querySelector('.info-disciplina-nome').textContent.trim();
    const codigoDisciplina = tdDetalhes.querySelector('.info-disciplina-codigo').textContent.trim();

    // Encontra a turma específica pelo ID
    const turma = Array.from(tdDetalhes.querySelectorAll('.info-disciplina-turma-id'))
        .find(el => el.textContent.trim() === turmaId)
        .closest('.div-grupo-turmas-disciplina');

    if (!turma) {
        console.log(`Turma ${turmaId} não encontrada`);
        return;
    }

    const numeroTurma = turma.querySelector('.info-disciplina-turma-id').textContent.trim();

    // Verifica se a turma já existe na tabela
    if (turmaJaExiste(codigoDisciplina, numeroTurma)) {
        alert('Esta turma já foi adicionada ao seu planejamento!');
        return;
    }

    const horarios = turma.querySelectorAll('.info-disciplina-turma-tempo');

    // Cria um UL para os horários como na tabela original
    const ulHorarios = document.createElement('ul');
    ulHorarios.className = 'info-disciplina-turma-tempos';

    horarios.forEach(horario => {
        const li = document.createElement('li');
        li.className = 'info-disciplina-turma-tempo';
        li.textContent = horario.textContent.trim();
        ulHorarios.appendChild(li);
    });

    // Seleciona a primeira tabela
    const tabelaResumo = document.getElementById('tabela-resumo-plano-inscricoes');
    const tbody = tabelaResumo.querySelector('tbody');

    // Cria a nova linha
    const novaLinha = document.createElement('tr');

    // Cria a célula com o botão de remoção
    const celulaBotaoRemover = document.createElement('td');
    celulaBotaoRemover.className = 'botao-remover-turma';

    const linkRemover = document.createElement('a');
    linkRemover.href = '#';
    linkRemover.innerHTML = '✖️';

    // Adiciona o event listener para remover a linha
    linkRemover.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Tem certeza que deseja remover esta disciplina do seu planejamento?')) {
            novaLinha.remove();
            // Reativa o botão de adicionar turma correspondente
            const botaoAdicionar = document.querySelector(`.botao-adicionar-turma[data-turma="${turmaId}"]`);
            if (botaoAdicionar) {
                botaoAdicionar.disabled = false;
                botaoAdicionar.style.opacity = '1';
            }
            // Atualiza a tabela de horários após remoção
            inserirHorariosNaTabelaDeHorarios();
        }
    });
  if (!tdDetalhes) {
    console.log('TD de detalhes não encontrado');
    return;
  }

    celulaBotaoRemover.appendChild(linkRemover);

    // Cria as demais células
    const celulaNome = document.createElement('td');
    celulaNome.className = 'resumo-disciplina-nome';
    celulaNome.textContent = nomeDisciplina;

    const celulaCodigo = document.createElement('td');
    celulaCodigo.className = 'resumo-disciplina-codigo';
    celulaCodigo.textContent = codigoDisciplina;

    const celulaTurma = document.createElement('td');
    celulaTurma.className = 'resumo-turma-id';
    celulaTurma.textContent = numeroTurma;

    const celulaHorarios = document.createElement('td');
    celulaHorarios.className = 'resumo-turma-tempos';
    celulaHorarios.appendChild(ulHorarios);

    const celulaLocal = document.createElement('td');
    celulaLocal.className = 'resumo-turma-local-aulas';
    celulaLocal.textContent = 'Não informado';

    // Adiciona as células à linha
    novaLinha.appendChild(celulaBotaoRemover);
    novaLinha.appendChild(celulaNome);
    novaLinha.appendChild(celulaCodigo);
    novaLinha.appendChild(celulaTurma);
    novaLinha.appendChild(celulaHorarios);
    novaLinha.appendChild(celulaLocal);

    // Adiciona a linha ao final da tabela
    tbody.appendChild(novaLinha);

    // Desabilita o botão de adicionar turma correspondente
    const botaoAdicionar = document.querySelector(`.botao-adicionar-turma[data-turma="${turmaId}"]`);
    if (botaoAdicionar) {
        botaoAdicionar.disabled = true;
        botaoAdicionar.style.opacity = '0.5';
    }

    // Atualiza a tabela de horários
    inserirHorariosNaTabelaDeHorarios();
}

// BEGIN pending commit

/**
 * Fills out the schedule table with the disciplines
 * 
 * @param {object[]} listOfDisciplines The list of disciplines
 *     selected for enrollment.
 * @param {string} listOfDisciplines.code The discipline code identifier.
 * @param {string[]} listOfDisciplines.weekDaysAndTimes The scheduled
 *     days and times for the discipline.
 */
function fillOutTable(listOfDisciplines) {
  let weekDay, timeCode = undefined;
  listOfDisciplines.forEach(discipline => {
    discipline.weekDaysAndTimes.forEach(weekDayAndTime => {
      [weekDay, timeCode] = weekDayAndTime.split(" ");
      fillOutCell(discipline.code, weekDay, timeCode);
    });
  });
}

/**
 * Removes every marker/color of from the cells of the schedule table,
 * even if the discipline is (still) present on the list of disciplinas.
 * 
 * This function must be called everytime a change occurs in the list of disciplines.
 */
function clearWholeTable() {
  // select all cells
  let allCells = document.querySelectorAll("#tabela-plano-inscricoes > tbody > tr > td");
  allCells.forEach(tableCell => {
    // clean markers (classes) of selected disciplines, 
    // it will be filled out again later
    tableCell.classList.remove("selecionada");
    tableCell.classList.remove("com-conflito");
    tableCell.innerText = "";
  });
}

/**
 * This funcion must be called from the array of disciplines from the list.
 * It handles duplicate schedules for different disciplines.
 * 
 * Note-to-self: Ideally, this array uses objects with disciplineCodes and each week/time info.
 * If so, change the parameter (as it avoids a long parameter list)
 * 
 * @param {string} disciplineCode 
 * @param {string} weekDay 
 * @param {string} timeCode 
 */
function fillOutCell(disciplineCode, weekDay, timeCode) {

  let selector = `#tabela-plano-inscricoes > tbody > tr.${timeCode} > td.${weekDay}`;
  let tableCell = document.querySelector(selector);
  let classToAdd = "";
  let cellText = tableCell.innerText;
  // verifico se algum código foi adicionado em uma iteração anterior
  if (cellText.length == 0) { // no discipline has been added to this cell
    classToAdd = "selecionada";
    cellText = disciplineCode;
  } else { // at least one discipline has been added to this cell
    classToAdd = "com-conflito";
    cellText = cellText + '\n' + disciplineCode; // keep the former and add the current one
  }
  tableCell.classList.add(classToAdd);
  tableCell.innerText = cellText;
}

function fillOutCellTest() {
  let disciplineCode = "IMERMÃO 101";
  let weekDay = "seg";
  let timeCode = "m5";
  fillOutCell(disciplineCode, weekDay, timeCode);
  // horário seguinte
  timeCode = "m6";
  fillOutCell(disciplineCode, weekDay, timeCode);
  // another discipline
  disciplineCode = "FISCERTO 102"
  weekDay = "seg";
  timeCode = "m3";
  fillOutCell(disciplineCode, weekDay, timeCode);
  timeCode = "m4";
  fillOutCell(disciplineCode, weekDay, timeCode);
  timeCode = "m5";
  fillOutCell(disciplineCode, weekDay, timeCode);
}

// END pending commit

document.addEventListener('DOMContentLoaded', function () {
  // Adiciona event listeners a todos os botões
  document.querySelectorAll('.botao-adicionar-turma').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // Previne o comportamento padrão do link
      const turmaId = this.getAttribute('data-turma');
      adicionarTurmaNaTabela(turmaId);
    });
  });
});

linkRemover.addEventListener('click', function (e) {
  e.preventDefault();
  if (confirm('Tem certeza que deseja remover esta disciplina do seu planejamento?')) {
    // Remove os horários específicos primeiro
    removerHorariosDaDisciplina(codigoDisciplina, numeroTurma);

    // Depois remove a linha da tabela
    novaLinha.remove();

    // Reativa o botão de adicionar
    const botaoAdicionar = document.querySelector(`.botao-adicionar-turma[data-turma="${turmaId}"]`);
    if (botaoAdicionar) {
      botaoAdicionar.disabled = false;
      botaoAdicionar.style.opacity = '1';
    }
});
