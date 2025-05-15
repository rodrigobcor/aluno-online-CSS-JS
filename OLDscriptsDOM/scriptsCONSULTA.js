/**
 * Realiza a busca por uma discplina a partir de seu código.
 * 
 * @param {string} formOutput O nome do formulário.
 * @param {string} codigo O código da disciplina a ser consultada.
 */
function consultarDisciplina(formOutput, codigo) {
  formCreateHiddenInputField(formOutput, 'disciplinas[0]', codigo);
  formOutput.submit();
}

/**
 * Realiza a busca por uma turma a partir do código da disciplina.
 * 
 * @param {string} formOutput O nome do formulário.
 * @param {string} codigo O código da disciplina a ser consultada.
 * @param {} requisicao Os dados da requisição a ser solicitada.
 */
function consultarTurmasDisciplina(formOutput, codigo, requisicao) {
  formCreateHiddenInputField(formOutput, 'disciplinas[0]', codigo);

  // mantém um cópia da definição da requisição original
  var requisicaoOriginal = formOutput.elements["requisicao"].value;

  // efetua a requisição solicitada
  formOutput.elements["requisicao"].value = requisicao;
  formOutput.submit();

  // retorna à definição da requisição original
  formOutput.elements["requisicao"].value = requisicaoOriginal;
}

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
