// Intercepta a função submit do formulário
const formOutput = document.querySelector('form'); // Substitua pelo seletor do formulário
const originalSubmit = formOutput.submit; // Salva a função original

// Substitui o método submit para capturar os dados
formOutput.submit = function () {
// Extrai os campos do formulário
const formData = new FormData(formOutput);
const url = formOutput.action || window.location.href; // URL do formulário

// Faz a solicitação com `fetch` e captura o HTML
fetch(url, {
    method: 'POST',
    body: formData,
})
    .then(response => response.text())
    .then(html => {
        // Agora, manipule o HTML capturado
        let inicio = html.indexOf("<form") + 411; // Pega o índice logo após o ": "
        let fim = html.indexOf("</form>") - 199;
        let dadosDisciplina = html.slice(inicio, fim);
        console.log(dadosDisciplina); // Exibe os dados da disciplina
    })
    .catch(error => console.error("Erro ao capturar HTML:", error));
};

// Agora, chame a função consultar com o código desejado
consultarDisciplina(formOutput, "10815");

// Restaura o método submit original
formOutput.submit = originalSubmit;