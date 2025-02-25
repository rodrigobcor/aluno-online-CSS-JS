
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
