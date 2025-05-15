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
  
  if (!tdDetalhes) {
    console.log('TD de detalhes não encontrado');
    return;
  }

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
  linkRemover.addEventListener('click', function(e) {
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

document.addEventListener('DOMContentLoaded', function() {
  // Adiciona event listeners a todos os botões
  document.querySelectorAll('.botao-adicionar-turma').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault(); // Previne o comportamento padrão do link
      const turmaId = this.getAttribute('data-turma');
      adicionarTurmaNaTabela(turmaId);
    });
  });
});

linkRemover.addEventListener('click', function(e) {
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
  }
});