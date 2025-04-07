# Passos para a execução dos testes

_Nota: Caso haja alguma inconsistência nessa descrição, favor entrar em contato com os desenvolvedores._

## Sem acesso ao sistema remoto

1. Iniciar emulador de servidor (servidor local), caso esteja utilizando arquivos do próprio computador ¹.
2. Localizar e abrir o arquivo `disciplinasDoCurriculo_2025-1.html`.
3. Abrir e fechar um ou dois itens acordeão, vendo se:
   * o layout está correto.
   * os detalhes da disciplina e turmas existentes estão aparecendo.
4. Acessar a opção de ferramentas do desenvolvedor (no Chrome: `F12`).
5. Seguir as instruções descritas [EM AMBOS OS CASOS](#em-ambos-os-casos).

¹ Algumas alternativas para acionar o emulador:

   - Alternativa 1: Caso o ambiente Python esteja instalado no computador, pode-se executar o comando `python -m http.server 9000` a partir da pasta raiz do projeto (substituindo 9000 por outro número de porta, caso esta esteja sendo utilizada por outro serviço).
   - Alternativa 2: Na IDE [Visual Studio Code](https://code.visualstudio.com/), existe uma extensão integrada [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) que precisa estar instalada e ativada, de modo que opção "Go Live" esteja disponível no canto inferior direito. Deve-se abrir a pasta raiz do projeto na IDE e selecionar a opção "Live Server".

## Com acesso ao sistema remoto

1. Acessar o sistema remoto normalmente pelo navegador e selecionar a visão de disciplinas do curso (`TODO INFORMAR > CAMINHO > AQUI`).
2. No conteúdo desse projeto, abrir arquivo `TODO COLOCAR NOME DO ARQUIVO JS`, selecionar todo o texto e copiar.
3. Acessar a opção de ferramentas do desenvolvedor (no Chrome: `F12`).
4. Na visão do Console, colar o conteúdo copiado.
5. Executar a função `TODO colocarNomeDaFuncao()`. Caso tudo tenha ocorrido corretamente, o layout da página deve ter sido alterado.
6. Seguir as instruções descritas [EM AMBOS OS CASOS](#em-ambos-os-casos).

## EM AMBOS OS CASOS

Na visão do Console, verificar se existe alguma mensagem de erro relacionada ao sistema. Caso haja, comunicá-lo aos desenvolvedores informando:
* uma cópia da mensagem de erro apresentada no Console
* um _screenshot_ (_print_) da página, se possível
* qual ação ocasionou o erro (ou seja, em que momento), caso se lembre.

**Reforçando: este projeto está em versão BETA, e não nos responsabilizamos por eventuais erros**. Caso ocorram, estes não devem interferir de forma nenhuma na efetivação da matrícula, pois apenas o planejamento de matrícula é apresentado.

### TODO *** ENCAIXAR NO LOCAL CORRETO ***

      Ver onde mencionar que:
      - a execução resultará em um conteúdo JSON no Console (iniciando com abre-colchetes e encerrando com fecha-colchetes, contendo os dados de cada disciplina entre chaves).
      - deve-se copiar o conteúdo JSON descrito no passo anterior e incluir no Console o trecho a seguir: `const listaDeDisciplinas = ` e colar o conteúdo copiado.
      - por fim, incluir no Console o trecho a seguir: `transformarListaDisciplinas(listaDeDisciplinas);`.

      Ver como mencionar que, pra testes com uma única disciplina sem precisar gerar o JSON, basta executar `testeTransformarListaDisciplinas()`, sem parâmetro `TODO essa função deveria ter pelo menos duas disciplinas para testar mais de um item do acordeão`.