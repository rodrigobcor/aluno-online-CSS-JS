/**
 * Insere o conteúdo CSS personalizado para reformatação do Aluno Online.
 */
function inserirCSSPersonalizado() {
  // Selecionar o elemento <link> existente
  var linkExistente = document.querySelector('link[href="../cssJs/caixaConteudoPagina.css"]');

  // FIXME O arquivo não existe mais, e uma série de arquivos passou a existir.
  // Considerar criar uma função para incluir cada um por parâmetro

  // Criar um novo elemento <link> para o novo arquivo CSS
  var novoLink = document.createElement('link');
  novoLink.type = 'text/css';
  novoLink.rel = 'stylesheet';
  novoLink.href = 'https://rodrigobcor.github.io/aluno-online-CSS-JS/estilos/disciplinas-do-curriculo.css'; // FIXME O arquivo não existe mais

  // Inserir o novo elemento <link> após o elemento existente
  linkExistente.parentNode.insertBefore(novoLink, linkExistente.nextSibling);
}


/**
 * Insere o conteúdo JavaScript personalizado para reformatação do Aluno Online.
 * FIXME Desatualizado
 * @todo
 */
function inserirJSPersonalizado() {
  // Seleciona o arquivo JavaScript existente
  const scriptExistente = document.querySelector('script[src="../cssJs/alunoOnline.js"]');

  // Cria um novo elemento <script> para o novo arquivo JavaScript
  const novoScript = document.createElement('script');
  novoScript.src = 'https://rodrigobcor.github.io/aluno-online-CSS-JS/cssJs/alunoOnline.js'; // Substitua pelo caminho do seu novo arquivo JS
  novoScript.type = 'text/javascript';

  // Insere o novo arquivo JavaScript após o arquivo existente
  scriptExistente.parentNode.insertBefore(novoScript, scriptExistente.nextSibling);
}

function inserirIntervaloNaTabela() {
  // Seleciona a tabela-resumo de disciplinas
  const tabelaDisciplinas = document.getElementById('tabela-resumo-plano-inscricoes');

  // Seleciona todas as linhas da tabela
  const linhas = tabelaDisciplinas.querySelectorAll('tbody tr');

  // Seleciona a tabela do plano de inscrições com os horários
  const tabelaIntervalos = document.getElementById('tabela-plano-inscricoes');

  // Percorre cada linha da tabela de disciplinas
  linhas.forEach(linha => {
    const codigo = linha.querySelector('.resumo-disciplina-codigo').textContent.trim();
    const itensHorario = linha.querySelectorAll('.info-disciplina-turma-tempo');

    itensHorario.forEach(item => {
      const textoHorario = item.textContent.trim();
      const [dia, ...horariosDia] = textoHorario.split(' ');

      // Mapeia os dias para as classes CSS correspondentes
      const diaMap = {
        'SEG': 'seg',
        'TER': 'ter',
        'QUA': 'qua',
        'QUI': 'qui',
        'SEX': 'sex',
        'SAB': 'sab'
      };

      const diaClass = diaMap[dia];

      if (!diaClass) return; // Se não encontrar o dia, pula para o próximo

      horariosDia.forEach(horario => {
        // Seleciona todas as células que correspondem ao dia e horário
        const celulas = tabelaIntervalos.querySelectorAll(`.${diaClass}.${horario.toLowerCase()}`);

        celulas.forEach(celula => {
          // Cria um elemento para mostrar a disciplina e o código
          const div = document.createElement('div');
          div.textContent = `${codigo}`;
          div.style.fontSize = 'smaller';
          div.style.padding = '2px';

          // Limpa a célula antes de adicionar novo conteúdo
          celula.innerHTML = '';
          celula.appendChild(div);
        });
      });
    });
  });
}

function apagaTabelaDeHorarios() {
  // Seleciona a tabela-resumo de disciplinas
  const tabelaDisciplinas = document.getElementById('tabela-resumo-plano-inscricoes');

  // Seleciona todas as linhas da tabela
  const linhas = tabelaDisciplinas.querySelectorAll('tbody tr');

  // Seleciona a tabela do plano de inscrições com os horários
  const tabelaIntervalos = document.getElementById('tabela-plano-inscricoes');

  // Percorre cada linha da tabela de disciplinas
  linhas.forEach(linha => {
    const codigo = linha.querySelector('.resumo-disciplina-codigo').textContent.trim();
    const itensHorario = linha.querySelectorAll('.info-disciplina-turma-tempo');

    itensHorario.forEach(item => {
      const textoHorario = item.textContent.trim();
      const [dia, ...horariosDia] = textoHorario.split(' ');

      // Mapeia os dias para as classes CSS correspondentes
      const diaMap = {
        'SEG': 'seg',
        'TER': 'ter',
        'QUA': 'qua',
        'QUI': 'qui',
        'SEX': 'sex',
        'SAB': 'sab'
      };

      const diaClass = diaMap[dia];

      if (!diaClass) return; // Se não encontrar o dia, pula para o próximo

      horariosDia.forEach(horario => {
        // Seleciona todas as células que correspondem ao dia e horário
        const celulas = tabelaIntervalos.querySelectorAll(`.${diaClass}.${horario.toLowerCase()}`);

        celulas.forEach(celula => {
          // Cria um elemento para mostrar a disciplina e o código
          const div = document.createElement('div');
          div.textContent = ' ';
          div.style.fontSize = 'smaller';
          div.style.padding = '2px';

          // Limpa a célula antes de adicionar novo conteúdo
          celula.innerHTML = '';
          celula.appendChild(div);
        });
      });
    });
  });
}

function adicionarDisciplinaNaTabela() {
  // Seleciona o TD com os detalhes da disciplina
  const tdDetalhes = document.querySelector('#tabela-disciplinas > tbody > tr.dados-disciplina.open > td.detalhes-disciplina.open');
  
  if (!tdDetalhes) {
    console.log('TD de detalhes não encontrado');
    return;
  }

  // Extrai as informações da disciplina
  const nomeDisciplina = tdDetalhes.querySelector('.info-disciplina-nome').textContent.trim();
  const codigoDisciplina = tdDetalhes.querySelector('.info-disciplina-codigo').textContent.trim();
  
  // Encontra a turma específica pelo ID
  const turma = Array.from(tdDetalhes.querySelectorAll('.info-disciplina-turma-id')).find(el => el.textContent.trim() === turmaId).closest('.div-grupo-turmas-disciplina');
  
  if (!turma) {
    console.log(`Turma ${turmaId} não encontrada`);
    return;
  }

  const numeroTurma = primeiraTurma.querySelector('.info-disciplina-turma-id').textContent.trim();
  const horarios = primeiraTurma.querySelectorAll('.info-disciplina-turma-tempo');

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
  
  // Cria as células com as mesmas classes da tabela original
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
  novaLinha.appendChild(celulaNome);
  novaLinha.appendChild(celulaCodigo);
  novaLinha.appendChild(celulaTurma);
  novaLinha.appendChild(celulaHorarios);
  novaLinha.appendChild(celulaLocal);

  // Adiciona a linha ao final da tabela
  tbody.appendChild(novaLinha);
}

document.addEventListener('DOMContentLoaded', function() {
  // Adiciona event listeners a todos os botões
  document.querySelectorAll('.botao-adicionar-turma').forEach(btn => {
    btn.addEventListener('click', function() {
      const turmaId = this.getAttribute('data-turma');
      adicionarTurmaNaTabela(turmaId);
    });
  });
});