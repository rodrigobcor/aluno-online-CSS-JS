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
