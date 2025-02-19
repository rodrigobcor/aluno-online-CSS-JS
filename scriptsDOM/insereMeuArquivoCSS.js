// Selecionar o elemento <link> existente
var linkExistente = document.querySelector('link[href="../cssJs/caixaConteudoPagina.css"]');

// Criar um novo elemento <link> para o novo arquivo CSS
var novoLink = document.createElement('link');
novoLink.type = 'text/css';
novoLink.rel = 'stylesheet';
novoLink.href = 'https://rodrigobcor.github.io/aluno-online-CSS-JS/estilos/disciplinas-do-curriculo.css'; // Substitua pelo caminho do seu novo arquivo CSS

// Inserir o novo elemento <link> após o elemento existente
linkExistente.parentNode.insertBefore(novoLink, linkExistente.nextSibling);