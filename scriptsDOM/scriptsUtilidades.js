// Não está sendo utilizada. Mover depois para um projeto próprio de reutilização.
/**
 * Fonte: adaptado de https://gomakethings.com/converting-the-jquery-next-method-to-vanilla-js/
 */
var next = function (elem, selector) {
  // Get the next element
  var nextElem = elem.nextElementSibling;
  // If there's no selector, return the next element
  if (!selector) {
    return nextElem;
  }
  // Otherwise, check if the element matches the selector
  if (nextElem && nextElem.matches(selector)) {
    return nextElem;
  }
  // if it's not a match, return null
  return null;
};

/**
 * Cria dinamicamente um campo de formulário (`input`)
 * atribuindo seu valor, para inclusão no conteúdo da página.
 * 
 * @param {string} formOutput O nome do formulário.
 * @param {string} campo O nome do campo a ser criado.
 * @param {string} valor O valor do campo a ser criado.
 * 
 */
function formCreateHiddenInputField(formOutput, campo, valor) {
  var hiddenField = document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = campo;
  hiddenField.value = valor;
  formOutput.appendChild(hiddenField);
}

/**
 * Consulta a ementa de uma disciplina a partir de seu código.
 * 
 * @param {string} idDisciplina O código identificador da disciplina.
 */
function ementaDisciplina(idDisciplina) {
  formCreateHiddenInputField(output, 'idDisciplina', idDisciplina);
  document.output.submit();
}


/**
 * Insere a classe CSS passada por parâmetro em todos os elementos `<td>`
 * de determinada tabela. Na ausência do parâmetro, efetua a ação
 * na *tag* `<table>` encontrada.
 * 
 * @param {string} idTabela O nome identificador da tabela (atributo `id`).
 * @param {string} nomeDaClasse O nome da classe CSS a ser adicionada no elemento `<td>`.
 */
function insereClasseNasCelulasDaTabela(idTabela, nomeDaClasse) {
  // Seleciona a tabela pela Tag
  var tabela = (idTabela ? document.getElementById(idTabela) : document.getElementsByTagName('table'));

  // Verifica se a tabela foi encontrada
  if (tabela) {
    // Seleciona todas as linhas (<tr>) da tabela
    var linhas = tabela.getElementsByTagName('tr');

    // Seleciona todas as celulas (<td>) da tabela
    var celulas = linhas.getElementsByTagName('td');

    // Itera sobre cada celula e adiciona a classe
    for (var i = 0; i < celulas.length; i++) {
      linhas[i].classList.add(nomeDaClasse);
    }
  } else {
    console.error(idTabela ? `Tabela '${idTabela}' não encontrada.` : `A tag "<table>" não foi identificada.`);
  }
}