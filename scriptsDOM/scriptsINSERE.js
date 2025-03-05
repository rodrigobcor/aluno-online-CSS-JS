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
    const tabelaDisciplinas = document.querySelector('.tabela-resumo-plano-inscricoes');

    // Seleciona todas as linhas da tabela, exceto o cabeçalho
    const linhas = tabelaDisciplinas.querySelectorAll('tr:not(:first-child)');

    // Seleciona a tabela do plano de inscrições com os horários
    const tabelaIntervalos = document.querySelector('.tabela-plano-inscricoes');

    // Percorre cada linha da tabela de disciplinas
    linhas.forEach(linha => {
        const codigo = linha.querySelector('.resumo-disciplina-codigo').textContent.trim(); // Código da disciplina
        const horarios = linha.querySelector('.resumo-turma-tempos').textContent.trim(); // Horários

        // Divide os horários em partes (SEG M5 M6, TER M5 M6, etc.)
        const partesHorarios = horarios.split('\n');

        partesHorarios.forEach(parte => {
            const [dia, ...horariosDia] = parte.split(' '); // Separa o dia e os horários
            horariosDia.forEach(horario => {
                // Seleciona a linha correspondente ao horário na tabela de horários
                const linhaHorario = tabelaIntervalos.querySelector(`.${horario}`);
                if (linhaHorario) {
                    // Seleciona a célula correspondente ao dia
                    const celula = linhaHorario.querySelector(`.${dia}`);
                    if (celula) {
                        // Insere o código da disciplina na célula
                        celula.textContent = codigo;
                    }
                }
            });
        });
    });
}
