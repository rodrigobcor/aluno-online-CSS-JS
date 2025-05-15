
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
