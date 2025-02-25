/**
 * Obtém a lista das disciplinas.
 * 
 * Atenção: o conteúdo está hard-coded.
 * Mudanças na estrutura da página impedirão o funcionamento correto.
 */
function getDisciplinasDaPagina() {
    const tds = document.querySelectorAll('td');
    disciplinas = [];
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
}