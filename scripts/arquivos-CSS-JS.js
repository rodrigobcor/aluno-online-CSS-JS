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