// Seleciona a tabela pela Tag
var tabela = document.getElementsByTagName('table');

// Verifica se a tabela foi encontrada
if (tabela) {
    // Seleciona todas as linhas (<tr>) da tabela
    var linhas = tabela.getElementsByTagName('tr');
    
    // Seleciona todas as celulas (<td>) da tabela
    var celulas = linhas.getElementsByTagName('td');

    // Itera sobre cada celula e adiciona a classe
    for (var i = 0; i < celulas.length; i++) {
        linhas[i].classList.add('minha-classe');
    }
} else {
    console.error('Tabela não encontrada!');
}