/**
 * Script de ativação do acordeão.
 * 
 * Fonte: adaptado de:
 * - https://codepen.io/jopico/pen/kyRprJ (estrutura geral);
 * - https://codepen.io/arjancodes/pen/gbweYB (trechos da função `toggleAccordion()`);
 * - https://gomakethings.com/converting-the-jquery-next-method-to-vanilla-js/ (função `next()`).
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
      proximo.style.maxHeight = proximo.scrollHeight + 'px'; // expand dynamically
    }

    proximo.classList.toggle("open");
  }

  var dadosDisciplinas = document.querySelectorAll(".fold-table tr.dados-disciplina");
  dadosDisciplinas.forEach(disciplina => {
    // disciplina.addEventListener("click", toggleAccordion); // apenas se a linha inteira deva ser selecionável para expandir o acordeão
    let itemAbreFecha = disciplina.querySelector(".disciplina-periodo");
    if (itemAbreFecha) {
      itemAbreFecha.addEventListener("click", toggleAccordion);
    }
  });

  var next = function (elem, selector) {
    // Get the next element
    var nextElem = elem.nextElementSibling;
    // If there's no selector, return the next element
    if (!selector) {
      return nextElem;
    }
    // Otherwise, check if the element matches the selector
    if (nextElem && nextElem.matches(selector)) {
      return nextElem;
    }
    // if it's not a match, return null
    return null;
  };
});
