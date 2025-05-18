/**
 * Script de ativação do acordeão.
 * 
 * Fonte: adaptado de:
 * - https://codepen.io/jopico/pen/kyRprJ (estrutura geral);
 * - https://codepen.io/arjancodes/pen/gbweYB (trechos da função `toggleAccordion()`);
 * - https://www.w3schools.com/howto/howto_js_accordion.asp (animação)
 */
document.addEventListener("DOMContentLoaded", function () {

  var toggleAccordion = function (event) {
    let linhaInteira = event.currentTarget.parentElement;
    linhaInteira.classList.toggle("open");
    let celulaComDetalhes = linhaInteira.lastElementChild;
    celulaComDetalhes.classList.toggle("open");
    celulaComDetalhes.classList.toggle("fold");

    if (celulaComDetalhes.classList.contains("open")) {
      celulaComDetalhes.style.padding = ""; // default
      celulaComDetalhes.style.height = ""; // default
      celulaComDetalhes.style.display = "";
    } else {
      celulaComDetalhes.style.padding = "0px";
      celulaComDetalhes.style.height = "0px";
      celulaComDetalhes.style.display = "none";
    }
  }

  var dadosDisciplinas = document.querySelectorAll(".fold-table tr.dados-disciplina");
  dadosDisciplinas.forEach(disciplina => {
    // disciplina.addEventListener("click", toggleAccordion); // apenas se a linha inteira deva ser selecionável para expandir o acordeão
    let itemAbreFecha = disciplina.querySelector(".disciplina-periodo");
    if (itemAbreFecha) {
      itemAbreFecha.addEventListener("click", toggleAccordion);
    }
  });
});

async function getDetalhesDisciplinas(codDisciplina) {
  if (!codDisciplina) {
    throw new SyntaxError("Para obter os detalhes da disciplina, "
      + "é necessário informar o código identificador (somente números).");
  }

  const formOutput = document.querySelector('form'); // Substitua pelo seletor correto
  const formData = new FormData(formOutput);
  
  // Adicione ou modifique o código da disciplina no FormData
  formData.set('codDisciplina', codDisciplina); // Ajuste o nome do campo conforme necessário

  try {
    const response = await fetch(formOutput.action || window.location.href, {
      method: 'POST',
      body: formData,
    });
    
    const html = await response.text();
    
    // Processamento do HTML
    const inicio = html.indexOf("<form") + 411; // Ajuste esses valores conforme necessário
    const fim = html.indexOf("</form>") - 199;
    const dadosDisciplina = html.slice(inicio, fim);
    
    return dadosDisciplina;
  } catch (error) {
    console.error("Erro ao consultar página.\nDetalhes técnicos:", error);
    throw error; // Propaga o erro para quem chamar a função
  }
}

// Inserir os detalhes na div
getDetalhesDisciplinas(10814)
  .then(dados => {
    const detalhesDiv = document.getElementById('detalhes-disciplina-10814');
    detalhesDiv.innerHTML = dados; // Insere o conteúdo retornado na div
  })
  .catch(err => console.error(err));

  /**
 * Transforma uma lista de dados de disciplinas (cada elemento como um objeto JSON)
 * no formato HTML compatível com o acordeão.
 * 
 * @param {object[]} listaDadosDisciplinas Uma lista de objetos no formato JSON.
 * Para uma única disciplina, utilize a função `preencherModeloDisciplina(disciplina)`.
 */
function transformarListaDisciplinas(listaDadosDisciplinas) {
  listaDadosDisciplinas = listaDadosDisciplinas.map(disciplina => preencherModeloDisciplina(disciplina));
  console.log(listaDadosDisciplinas);
  return listaDadosDisciplinas;
}