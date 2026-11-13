/**
 * Insere os estilos e scripts do projeto em uma página do Aluno Online
 * (por exemplo, colando este arquivo no Console e chamando as funções abaixo).
 *
 * A versão anterior procurava arquivos que não existem mais
 * (`../cssJs/caixaConteudoPagina.css`, `disciplinas-do-curriculo.css`...).
 * Agora a lista de arquivos é explícita e fica num só lugar.
 *
 * ATENÇÃO: carregar código de um endereço externo dentro de uma página autenticada
 * exige confiar nesse endereço. Prefira fixar uma versão (commit) em `base`.
 */

const URL_BASE_DO_PROJETO = "https://rodrigobcor.github.io/aluno-online-CSS-JS/";

// A ordem importa: `variaveis-estilos.css` deve ser sempre o primeiro.
const ARQUIVOS_CSS_DO_PROJETO = [
  "variaveis-estilos", "estilos-gerais", "blocos", "acordeao", "plano-inscricoes",
  "disciplinas-listagem", "disciplinas-detalhes", "turmas", "info-tooltips"
].map(nome => `estilos/${nome}.css`);

// A ordem importa: cada script depende dos anteriores.
const ARQUIVOS_JS_DO_PROJETO = [
  "utilidades", "dados-das-disciplinas", "tabela-de-horarios", "tabela-de-planejamento", "acordeao"
].map(nome => `scripts/${nome}.js`);

/**
 * Insere o conteúdo CSS personalizado para reformatação do Aluno Online.
 *
 * @param {string} [base] O endereço-base do projeto (terminado em "/").
 */
function inserirCSSPersonalizado(base = URL_BASE_DO_PROJETO) {
  ARQUIVOS_CSS_DO_PROJETO.forEach(arquivo => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = base + arquivo;
    document.head.appendChild(link);
  });
}

/**
 * Insere o conteúdo JavaScript personalizado para reformatação do Aluno Online,
 * carregando um arquivo de cada vez, na ordem, para respeitar as dependências.
 *
 * @param {string} [base] O endereço-base do projeto (terminado em "/").
 * @returns {Promise<void>} Resolvida quando todos os scripts foram carregados.
 */
async function inserirJSPersonalizado(base = URL_BASE_DO_PROJETO) {
  for (const arquivo of ARQUIVOS_JS_DO_PROJETO) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = base + arquivo;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Falha ao carregar ${base + arquivo}`));
      document.head.appendChild(script);
    });
  }
}
