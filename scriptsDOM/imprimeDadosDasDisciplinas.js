/** 
 * Obtém os detalhes da disciplina no formato HTML.
 * 
 * * Essa função não altera nenhum dado do servidor original.
 */
function testGetDetalhesDisciplinas(codDisciplina) {
    // essa linha é apenas para testes
    numDisciplina = "10815";

    let htmlDadosDisciplina = getDetalhesDisciplinas(codDisciplina);
    console.log(htmlDadosDisciplina);    
}

/**
 * Obtém os detalhes de determinada disciplina no no período.
 * 
 * Essa função não altera nenhum dado do servidor original.
 * 
 * @param {number} codDisciplina O código identificador da disciplina (apenas números).
 */
function getDetalhesDisciplinas(codDisciplina) {

    if (!codDisciplina) {
        throw SyntaxError("Para obter os detalhes da disciplina, "
            + "é necessário informar o código identificador (somente números).");
    }

    // Substitui temporariamente a função submit do formulário
    const formOutput = document.querySelector('form'); // Substitua pelo seletor do formulário
    const originalSubmit = formOutput.submit; // Salva a função original

    let dadosDisciplina = ""; // declarando fora do escopo da função pra retornar o resultado

    // Substitui o método submit para obter os dados
    formOutput.submit = function () {
        // Extrai os campos do formulário
        const formData = new FormData(formOutput);
        const url = formOutput.action || window.location.href; // URL do formulário

        // Faz a solicitação com `fetch` e obtém o HTML
        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(html => {
                // TODO ainda precisa ajustar os números que estão hard-coded
                
                // Agora, selecionando a parte relevante do conteúdo HTML obtido
                let inicio = html.indexOf("<form") + 411; // Pega o índice logo após o ": "
                let fim = html.indexOf("</form>") - 199;
                dadosDisciplina = html.slice(inicio, fim); // variável declarada fora do escopo da função
                // console.log(dadosDisciplina); // Exibe os dados da disciplina
            })
            .catch(error => console.error("Erro ao consultar página.\nDetalhes técnicos:", error));
    };

    // Agora, chame a função consultar com o código desejado
    consultarDisciplina(formOutput, codDisciplina);

    // Restaura o método submit original
    formOutput.submit = originalSubmit;

    return dadosDisciplina;
}
