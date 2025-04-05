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
