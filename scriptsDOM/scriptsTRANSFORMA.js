/**
 * 
 * @param {string} intervalo O horário no formato original a decompor.
 * @returns {{dia: string, horario: string}} um objeto com a decomposição do intervalo em dia e horário.
 */
function decomporIntervalo(intervalo) {
    let segmentosDoIntervalo = getArrayOfGroupMatches(getRegexIntervalo(), intervalo);
    // o primeiro elemento é o dia da semana (ex. QUA), os outros são os horários (ex. T2)
    // cada segmento vai ser antecedido do dia da semana
    const diaSemana = segmentosDoIntervalo.splice(0, 1); // obtém apenas o dia da semana e mantém o horário no segmentosDoIntervalo
    segmentosDoIntervalo = segmentosDoIntervalo.map(
        // lembrando que segmentosDoIntervalo contém apenas o horário, então pode-se reutilizar a variável
        segmentosDoIntervalo => {
        	"dia" = diaSemana,
        	"horario" = segmentosDoIntervalo
        }
    );
    return segmentosDoIntervalo;
}

function transformarFormatoTurma() {
    const formatoAntigo = document.querySelector('td[style*="border-style: solid"]');
    if (!formatoAntigo) {
        console.error('Elemento do formato antigo não encontrado.');
        return;
    }

    const novoFormato = document.createElement('div');
    novoFormato.className = 'divContentBlock';

    const header = document.createElement('div');
    header.className = 'divContentBlockHeader';
    header.textContent = 'Turmas da Disciplina';
    novoFormato.appendChild(header);

    const body = document.createElement('div');
    body.className = 'divContentBlockBody';
    novoFormato.appendChild(body);

    const grupoTurmas = document.createElement('div');
    grupoTurmas.className = 'div-grupo-turmas-disciplina';
    body.appendChild(grupoTurmas);

    const divTurma = document.createElement('div');
    divTurma.className = 'div-turma-disciplina';
    grupoTurmas.appendChild(divTurma);

    const divInformacoes = document.createElement('div');
    divInformacoes.className = 'detalhes-disciplina-turma-informacoes';
    divTurma.appendChild(divInformacoes);

    const ulDetalhes = document.createElement('ul');
    ulDetalhes.className = 'detalhes-disciplina-turma';
    divInformacoes.appendChild(ulDetalhes);

    const turmaElement = formatoAntigo.querySelector('div > div > div > b');
    if (turmaElement && turmaElement.nextSibling) {
        const turma = turmaElement.nextSibling.textContent.trim();
        const liTurma = document.createElement('li');
        liTurma.className = 'detalhes-disciplina-turma-id';
        liTurma.textContent = turma;
        ulDetalhes.appendChild(liTurma);
    } else {
        console.error('Elemento de turma não encontrado.');
    }

    const preferencialElement = formatoAntigo.querySelector('div > div > div > div:nth-child(2) > div');
    if (preferencialElement) {
        const preferencial = preferencialElement.textContent.replace('Preferencial:', '').trim();
        const liPreferencial = document.createElement('li');
        liPreferencial.className = 'detalhes-disciplina-turma-preferencial';
        liPreferencial.textContent = preferencial;
        ulDetalhes.appendChild(liPreferencial);
    } else {
        console.error('Elemento de preferencial não encontrado.');
    }

    const docenteElement = formatoAntigo.querySelector('div > div > div > div:nth-child(5) > div:nth-child(2)');
    if (docenteElement) {
        const docente = docenteElement.textContent.trim();
        const liDocente = document.createElement('li');
        liDocente.className = 'detalhes-disciplina-turma-docente';
        liDocente.textContent = docente;
        ulDetalhes.appendChild(liDocente);
    } else {
        console.error('Elemento de docente não encontrado.');
    }

    const liLocalizacao = document.createElement('li');
    liLocalizacao.className = 'detalhes-disciplina-turma-localizacao';
    ulDetalhes.appendChild(liLocalizacao);

    const liTempos = document.createElement('li');
    liTempos.className = 'detalhes-disciplina-turma-tempos';
    ulDetalhes.appendChild(liTempos);

    const ulTempos = document.createElement('ul');
    ulTempos.className = 'detalhes-disciplina-turma-tempo-lista';
    liTempos.appendChild(ulTempos);

    const tempos = formatoAntigo.querySelectorAll('div > div > div > div:nth-child(3) > div:nth-child(2) > div');
    if (tempos.length > 0) {
        tempos.forEach(tempo => {
            const liTempo = document.createElement('li');
            liTempo.className = 'detalhes-disciplina-turma-tempo';
            liTempo.textContent = tempo.textContent.trim();
            ulTempos.appendChild(liTempo);
        });
    } else {
        console.error('Elementos de tempos não encontrados.');
    }

    const tabelasVagas = formatoAntigo.querySelectorAll('table');
    if (tabelasVagas.length > 0) {
        tabelasVagas.forEach((tabela, index) => {
            const divTabela = document.createElement('div');
            divTabela.className = 'detalhes-disciplina-turma-informacoes';
            divTurma.appendChild(divTabela);

            const novaTabela = document.createElement('table');
            novaTabela.className = 'tabela-disciplina-turma-vagas';
            divTabela.appendChild(novaTabela);

            const caption = document.createElement('caption');
            caption.className = 'tabela-vagas-descricao';
            caption.textContent = index === 0 ? 'Vagas atuais da turma' : 'Vagas para solicitação de inscrição';
            novaTabela.appendChild(caption);

            const tbody = document.createElement('tbody');
            novaTabela.appendChild(tbody);

            const linhas = tabela.querySelectorAll('tr');
            linhas.forEach(linha => {
                const novaLinha = document.createElement('tr');
                tbody.appendChild(novaLinha);

                const celulas = linha.querySelectorAll('td, th');
                celulas.forEach(celula => {
                    const novaCelula = document.createElement(celula.tagName.toLowerCase());
                    novaCelula.textContent = celula.textContent.trim();
                    novaCelula.setAttribute('style', celula.getAttribute('style'));
                    novaLinha.appendChild(novaCelula);
                });
            });
        });
    } else {
        console.error('Tabelas de vagas não encontradas.');
    }

    formatoAntigo.parentNode.replaceChild(novoFormato, formatoAntigo);
}

transformarFormatoTurma();
