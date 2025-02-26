/* DESATUALIZADO - não há mais classes começando com "colHorarios" */

// Seleciona a tabela de disciplinas
const tabelaDisciplinas = document.querySelector('.tabela-resumo-plano-inscricao');

    // Seleciona todas as linhas da tabela, exceto o cabeçalho
    const linhas = tabelaDisciplinas.querySelectorAll('tr:not(:first-child)');

    // Seleciona a tabela de horários
    const tabelaHorarios = document.querySelector('.tabela-plano-inscricoes');

    // Percorre cada linha da tabela de disciplinas
    linhas.forEach(linha => {
        const codigo = linha.querySelector('.colHorarios-3').textContent.trim(); // Código da disciplina
        const horarios = linha.querySelector('.colHorarios-5').textContent.trim(); // Horários

        // Divide os horários em partes (SEG M5 M6, TER M5 M6, etc.)
        const partesHorarios = horarios.split('\n');

        partesHorarios.forEach(parte => {
            const [dia, ...horariosDia] = parte.split(' '); // Separa o dia e os horários
            horariosDia.forEach(horario => {
                // Seleciona a linha correspondente ao horário na tabela de horários
                const linhaHorario = tabelaHorarios.querySelector(`.${horario}`);
                if (linhaHorario) {
                    // Seleciona a célula correspondente ao dia
                    const celula = linhaHorario.querySelector(`.${dia}`);
                    if (celula) {
                        // Insere o código da disciplina na célula
                        celula.textContent = codigo;
                    }
                }
            });
        });
    });