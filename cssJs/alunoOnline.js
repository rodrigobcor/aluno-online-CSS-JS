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


/*
 * Bloqueador de Botão Direito - iceBreaker http://www.icebreaker.com.br/ 
 */
function clique() 
{
    if (event.button==2||event.button==3) 
    {
        oncontextmenu = "return false;";
        alert("Não retorne ou feche a página caso tenha submetido suas alterações.  A resposta do sistema pode demorar em função da concorrência de usuários.");
    }
} 

document.onmousedown=clique ;
document.oncontextmenu = new Function("return false;") ;


//function enviarRequisicao(formOutput)
//{ 
//    var requisicaoOriginal = formOutput.elements["requisicao"].value;
//
//    formOutput.elements["requisicao"].value = requisicao;
//    formOutput.submit();
//    formOutput.elements["requisicao"].value = requisicaoOriginal;
//}

/*
 *  Consultar Discplina pelo Código.
 *  
 *  formOutput: nome do formulário
 *  codigo: código da disciplina
 */
function consultarDisciplina( formOutput, codigo )
{
    formCreateHiddenInputField(formOutput, 'disciplinas[0]', codigo);
    formOutput.submit();
}

function consultarTurmasDisciplina( formOutput, codigo, requisicao )
{
    formCreateHiddenInputField(formOutput, 'disciplinas[0]', codigo);

    var requisicaoOriginal = formOutput.elements["requisicao"].value;

    formOutput.elements["requisicao"].value = requisicao;
    formOutput.submit();
    formOutput.elements["requisicao"].value = requisicaoOriginal;
}

/*
 *  Cria um campo de formulário input dinamicamente.
 *  
 *  formOutput: nome do formulário
 *  campo: nome do campo a ser criado
 *  valor: valor do campo a ser criado
 *  
 */
function formCreateHiddenInputField(formOutput, campo, valor)
{
    var hiddenField = document.createElement('input');            
    hiddenField.type = 'hidden';
    hiddenField.name = campo;
    hiddenField.value = valor;            
    formOutput.appendChild(hiddenField);            
}


function ementaDisciplina( idDisciplina )
{
    formCreateHiddenInputField(output, 'idDisciplina', idDisciplina);
    document.output.submit();
}