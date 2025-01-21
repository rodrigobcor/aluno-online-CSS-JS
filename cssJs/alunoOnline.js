function envia(codigo) {
    criaInputHidden('disciplinas[0]', codigo);
    document.output.submit();
}

function criaInputHidden(campo, valor) {
    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = campo;
    hiddenField.value = valor;
    document.output.appendChild(hiddenField);
}

document.addEventListener('DOMContentLoaded', function() {
    var celulasAcordeao = document.querySelectorAll('.celDisciplina.acordeao');

    celulasAcordeao.forEach(function(celula) {
        celula.addEventListener('click', function(event) {
            if (event.target === celula || event.target.classList.contains('disciplina-texto')) {
                var panel = celula.querySelector('.panel');

                if (panel.style.display === "block") {
                    panel.style.display = "none";
                    celula.classList.remove('active');
                } else {
                    panel.style.display = "block";
                    celula.classList.add('active');
                }
            }
        });

        var panel = celula.querySelector('.panel');
        if (panel) {
            panel.addEventListener('click', function(event) {
                event.stopPropagation(); 
            });
        }
    });
});