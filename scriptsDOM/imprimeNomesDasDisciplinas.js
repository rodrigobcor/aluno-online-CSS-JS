 /** 
  * Imprime o nome das disciplinas no console.
  */
function imprimeNomeDisciplinas() {
    const disciplina = document.getElementsByClassName("LINKNAOSUB");
    for (let i = 0; i < disciplina.length; i++) {
    console.log(disciplina[i].innerText);
    }
}