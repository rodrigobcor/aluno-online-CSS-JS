/**
 * Obtém a lista das disciplinas.
 * 
 * Atenção: o conteúdo está hard-coded.
 * Mudanças na estrutura da página impedirão o funcionamento correto.
 * 
 * @todo corrigir valores hard-coded
 */
function getDisciplinasDaPagina() {
    const tds = document.querySelectorAll('td');
    disciplinas = [];
    // FIXME valores hard-coded
    for (let i = 19; i <= tds.length-5; i++) {
        disciplina = {};
        disciplina.codigoEnome = tds[i].innerText;
        i++;
        disciplina.periodo = tds[i].innerText;
        i++;
        disciplina.atendida = tds[i].innerText;
        i++;
        disciplina.tipo = tds[i].innerText;
        i++;
        disciplina.ramif = tds[i].innerText;
        i++;
        disciplina.creditos = tds[i].innerText;
        i++;
        disciplina.CHtotal = tds[i].innerText;
        i++;
        disciplina.travaCredito = tds[i].innerText;
        i++;
        disciplina.turmaPeriodo = tds[i].innerText;
        disciplinas.push(disciplina);
        i+9;
    }
    return disciplinas;
}


/**
 * Obtém os detalhes de determinada disciplina do período, no formato HTML.
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
                let inicio = html.indexOf("<form") + 411; // recupera o índice logo após o ": "
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

function testGetDetalhesDisciplinas(codDisciplina) {
    codDisciplina = codDisciplina || "10815"; // um código (válido) qualquer
    let htmlDadosDisciplina = getDetalhesDisciplinas(codDisciplina);
    console.log(htmlDadosDisciplina);
}


/**
 * Obtém os horários da lista criada anteriormente.
 * 
 * @returns {string[]} os horários obtida da lista de disciplinas selecionadas para matrícula
 */
function getHorariosDaLista() {
    let celulasHorarios = document.querySelectorAll(".resumo-turma-tempos");
    let horarios = [];
    celulasHorarios.forEach(horario => horarios.push(horario.innerText));
    return horarios;
}

/**
 * Obtém a matrícula e nome do aluno que está autenticado.
 */
function getMatriculaENomeDoAluno() {
    console.log(document.querySelector("#divCabecalhoAplicacao > div:nth-child(2) > div:nth-child(1) > font").innerText);
}
