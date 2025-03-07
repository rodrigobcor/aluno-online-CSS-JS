# Ajustes de interface de usuário do AO

## Resumo de Mudanças

1. Remoção dos estilos (`style`) *inline* das classes (`class`) e das linhas de tabela (`tr`) referentes às linhas de informação (nome, código, período etc.) das disciplinas.
2. Inclusão de classes em cada célula (`td`) das linhas da tabela, para formatação mais precisa com CSS.
3. Modificação do CSS original para um novo CSS com a formatação  *inline* que foi retirada das classes e células.
4. Inclusão de formatações como:
    - atribuição de cores para os códigos conforme o departamento,
    - ordenação nas disciplinas (entre concluídas e não concluídas), e
    - ajustes com cadeados nas disciplinas com trava de crédito.
5. Inclusão de uma tabela de planejamento de horários e sua formatação.
6. Modificação das linhas (`tr`) das disciplinas para incluir o acordeão (primeira versão).
7. Inclusão de código CSS e JS para permitir o funcionamento do acordeão (primeira versão).
8. Inclusão de classes do acordeão (segunda versão).

## Problemas

1. Existe uma [*issue* no GitHub](https://github.com/desktop/desktop/issues/3923) sobre problemas de compatibilidade de codificação de caracteres nos *commits*. Isso está afetando o trabalho. Mesmo mudando a codificação (`enconding`) ou o `charset` do HTML, o problema permanece.
