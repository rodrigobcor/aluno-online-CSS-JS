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
