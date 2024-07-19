/* Plano de Periodização para Ciência da Computação
 * (campus Maracanã, versão 1) em 03/04/2024
 */

/**
  * Disciplinas obrigatórias:
  *
  * Literalmente, são as disciplinas obrigatórias,
  * assim estabelecidas pelo Colegiado do Curso,
  * tendo em vista seu projeto político-pedagógico,
  * em consonância com as diretrizes nacionais
  * do Ministério da Educação.
  */

const obrigatorias = [
    // TODO
    ];
    
    
    /** Disciplinas eletivas restritas
      * (ou técnicas, na descrição do Plano de Periodização):
      *
      * São disciplinas eletivas acessíveis apenas
      * para uma determinada ramificação ou habilitação,
      * que vão definir o perfil profissional escolhido.
      * O estudante escolhe as que mais se aproximam de
      * sua área de interesse, dentre um elenco de disciplinas.
      */
    const eletivas-restritas = [
      {
        codigo: IME04-10851,
        nome: Algoritmos Distribuídos,
        creditos: 4
      },
      {
        codigo: IME04-10853,
        nome: Algoritmos para Geometria Computacional,
        creditos: 4
      },
      {
        codigo: IME04-10854,
        nome: Aspectos Práticos em Ciência da Computação I,
        creditos: 4
      },
      {
        codigo: IME04-10855,
        nome: Aspectos Práticos em Ciência da Computação II,
        creditos: 4
      },
      {
        codigo: IME04-10856,
        nome: Aspectos Práticos em Redes de Computadores,
        creditos: 4
      },
      {
        codigo: IME04-10857,
        nome: Aspectos Práticos em Sistemas Operacionais,
        creditos: 4
      },
      {
        codigo: IME04-10679,
        nome: Avaliação e Inovação em Tecnologia,
        creditos: 4
      },
      {
        codigo: IME06-10858,
        nome: Computação Científica,
        creditos: 4
      },
      {
        codigo: IME04-10859,
        nome: Desenvolvimento e Implementação de Algoritmos,
        creditos: 4
      },
      {
        codigo: IME04-10860,
        nome: Empreendedor em Tecnologia da Informação,
        creditos: 4
      },
      {
        codigo: IME04-10861,
        nome: Engenharia de Requisitos de Software,
        creditos: 4
      },
      {
        codigo: IME04-10863,
        nome: Filosofia da Ciência,
        creditos: 4
      },
      {
        codigo: FAF03-04304,
        nome: Fundamentos de Administração,
        creditos: 4
      },
      {
        codigo: IME04-11454,
        nome: Gestão da Inovação,
        creditos: 4
      },
      {
        codigo: IME04-10864,
        nome: Gestão de Tecnologia da Informação,
        creditos: 4
      },
      {
        codigo: IME04-10865,
        nome: Informática na Educação,
        creditos: 4
      },
      {
        codigo: IME04-10867,
        nome: Modelagem de Sistemas,
        creditos: 4
      },
      {
        codigo: IME04-10868,
        nome: Programação Paralela e Distribuída,
        creditos: 4
      },
      {
        codigo: IME04-10869,
        nome: Qualidade de Software,
        creditos: 4
      },
      {
        codigo: IME04-10870,
        nome: Realidade Virtual,
        creditos: 4
      },
      {
        codigo: IME04-10871,
        nome: Redes de Computadores II,
        creditos: 4
      },
      {
        codigo: IME04-10872,
        nome: Redes Neuronais,
        creditos: 4
      },
      {
        codigo: IME04-10873,
        nome: Sistemas de Informação,
        creditos: 4
      },
      {
        codigo: IME04-10874,
        nome: Tópicos Especiais I,
        creditos: 4
      },
      {
        codigo: IME04-10875,
        nome: Tópicos Especiais II,
        creditos: 4
      }
    ];
    
    
    /** Disciplinas eletivas definidas (ou básicas):
      *
      * São disciplinas eletivas acessíveis a todos os alunos do Curso,
      * independentemente de sua ramificação ou habilitação.
      * O estudante escolhe as que mais se aproximam de sua área de interesse,
      * dentre um elenco de disciplinas.
      */
    
    // TODO conferir se eletiva definida é sinônimo de eletiva básica,
    // pois foi incluído devido à ausência de eletivas "definidas"
    // no Plano de Periodização
    
    const eletivas-basicas = [
      {
        codigo: IME04-10850,
        nome: Álgebra Linear aplic à Computação Gráfica,
        tipo:eletiva-restrita-basica,
        creditos: 4
      },
      {
        codigo: IME06-10852,
        nome: Análise Numérica,
        tipo:eletiva-restrita-basica,
        creditos: 4
      },
      {
        codigo: IME04-06247,
        nome: Empreendedor em Tecnologia de Informação,
        tipo:eletiva-restrita-basica,
        creditos: 4
      },
      {
        codigo: IME05-10862,
        nome: Estatística Aplicada,
        tipo:eletiva-restrita-basica,
        creditos: 4
      },
      {
        codigo: FIS02-11016,
        nome: Física III,
        tipo:eletiva-restrita-basica,
        creditos: 4
      },
      {
        codigo: FIS03-11017,
        nome: Física IV,
        tipo:eletiva-restrita-basica,
        creditos: 4
      },
      {
        codigo: ILE04-10866,
        nome: Ling Inglesa Instr p/Leitura na Ciência da Computação,
        tipo:eletiva-restrita-basica,
        creditos: 4
      },
      {
        codigo: IME06-08559,
        nome: Tópicos Especiais de Matemática Aplicada I,
        tipo:eletiva-restrita-basica,
        creditos: 4
      },
      {
        codigo: IME06-08560,
        nome: Tópicos Especiais de Matemática Aplicada II,
        tipo:eletiva-restrita-basica,
        creditos: 4
      }
    ];
    
    
    /**
     * Disciplinas eletivas universais:
     *
     * São disciplinas eletivas acessíveis a qualquer estudante,
     * de qualquer curso, atuando como um enriquecimento curricular.
     *
     * Disciplinas eletivas universais não estão especificadas,
     * devido à sua natureza conforme descrito.
     */
    
    // As definições e descrições das categorias de disciplinas foram extraídas de
    // https://www.ibrag.uerj.br/index.php/2014-11-05-17-02-47/95-habilitacoes/curriculo-antigo/estrutura-curricular/460-estrutura-curricular.html