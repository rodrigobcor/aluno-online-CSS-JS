function envia( codigo )
     {
              criaInputHidden('disciplinas[0]', codigo);
              document.output.submit();
     }

     function criaInputHidden(campo, valor)
     {
         var hiddenField = document.createElement('input');            
         hiddenField.type = 'hidden';
         hiddenField.name = campo;
         hiddenField.value = valor;            
         document.output.appendChild(hiddenField);            
     }

     