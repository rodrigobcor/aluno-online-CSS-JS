
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

//document.onmousedown=clique ;
//document.oncontextmenu = new Function("return false;") ;



function detectMobile() 
{ 
    if (   navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
       )
    {
       criaInputHidden("mobile", "S");
       return true;
    }
    else 
    {
        criaInputHidden("mobile", "N");
        return false;
    }
}

function executaMenu(bloqueado, requisicao, target, hRef)
{
    if (bloqueado == 1)
    {
        window.alert("Acesso  temporariamente  bloqueado.");
        return
    }
        
    createHiddenInput("target", target);
    if ( target == 1 )
        document.formulario.target = '_blank';
    else if ( target == 2 && detectMobile() == true )
        document.formulario.target = '_blank';
    else
        document.formulario.target = '_self';
    
    createHiddenInput("hRef", hRef);
    createHiddenInput("requisicao", requisicao);
    
    //var programa = '';
    //var action = criaInputParametros(programa);
    
    var action = "/requisicaoaluno/"; //criaInputParametros(programa);
    if ( action != false )
        document.formulario.action = action;

    document.formulario.submit();
}

function createHiddenInput(campo, valor)
{
    var hiddenField = document.createElement('input');            
    hiddenField.type = 'hidden';
    hiddenField.name = campo;
    hiddenField.value = valor;            
    document.formulario.appendChild(hiddenField);            
}

/*
function criaInputParametros(programa)
{
    var action = programa;
    if ( action == false  ||  action.trim() == "" )
        return "/requisicaoaluno/";
    
    var n = programa.indexOf("?");
    if ( n >= 0)
    {  
        if ( n > 0 )
            action = action.substr(0, n);
        else
            action = "/requisicaoaluno/";
        
        var argumentos = programa.substr(n + 1);
        //alert("Programa " + programa + " # N " + n + " # Action " + action + " # Argumentos: " + argumentos);
        var i;
        var total = 1
        for (i = 0; i < total; i++)
        {
            n = argumentos.indexOf("&");
            if ( n >= 0)
            {
                total = total + 1;
                argumento =  argumentos.substr(0, n);
                argumentos =  argumentos.substr(n + 1);
            }
            else
            {
                argumento = argumentos;
            }

            n = argumento.indexOf("=");
            nomeArgumento = argumento.substr(0, n);
            valorArgumento = argumento.substr(n + 1);

            var hiddenField = document.createElement('input');            
            hiddenField.type = 'hidden';
            hiddenField.name = nomeArgumento;
            hiddenField.value = valorArgumento;
            document.formulario.appendChild(hiddenField);
        }
    }
    
    return action;
}
*/





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



function critica_matricula( form )
{
    if ( form.matricula.value == "" )
    {
        window.alert("Informe a Matrícula!") ;
        return(false);
    }
    else if ( form.matricula.value != ""  &&  form.matricula.value.length < 12 )
    {
        window.alert("Preencha corretamente a matrícula!") ;
        return(false);
    }
    else
    {
        var_posicao = 0 ;

        while ( var_posicao < form.matricula.value.length )
        {
            if ( "0123456789".indexOf( form.matricula.value.charAt(var_posicao) ) == -1 )
            {
                window.alert("Preencha corretamente a Matrícula!") ;
                return false;
            }
            var_posicao++;
        }
    }

    return true;
}

/**
 * 
 * Verifica se o cpf é válido
 * 
 * @param string cpf 
 * 
 * @returns bool
 */
function valida_cpf(cpf)
{
    cpf = cpf.replaceAll('/[^0-9]/g', '');

    // Verifica se não tem 11 dígitos ou se tem todos os números iguais
    if (cpf.length != 11 || /(\d)\1{10}/g.test(cpf)) return false;

    for (let posicaoDigito = 9; posicaoDigito < 11; posicaoDigito++) 
    {
        let soma = 0;

        for (let indice = 0; indice < posicaoDigito; indice++) {
            soma += cpf[indice] * ((posicaoDigito + 1) - indice);
        }

        let digitoVerificador = ((10 * soma) % 11) % 10;
        
        if (cpf[posicaoDigito] != digitoVerificador) return false;
    }

    return true;
}


// Para uso em botão de envio em formulário
function sendRequest(button) {
    let attribute = button.getAttribute('data-request');

    let requisicaoInput = document.getElementsByName('requisicao');
    
    if (requisicaoInput) {
        requisicaoInput[0].value = attribute;
    }
}

// Para uso em botão de retorno em formulário
function returnRequest(button) {
    sendRequest(button);

    document.form.submit();
}