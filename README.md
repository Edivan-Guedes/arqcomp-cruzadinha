# Sheikah Archive — Mapa de Runas & Santuário dos Códigos

projeto acadêmico **não oficial**, com estética inspirada na **Sheikah Slate de *The Legend of Zelda: Breath of the Wild***. O jogador assume o papel de **Link**, recebendo orientações narrativas de uma transmissão da princesa e da própria Pedra Sheikah. 

## Como jogar

### 1. Acesse o menu inicial

Abra `index.html` no navegador. O menu apresenta uma mensagem da princesa para Link. Escolha **Mapa de Runas** (cruzadinha) ou **Santuário dos Códigos** (estilo Termo). Use **Menu principal**, no canto superior esquerdo, para alternar entre os modos.

### 2. Mapa de Runas — Cruzadinha

1. Leia as pistas numeradas, separadas em **Horizontais** e **Verticais**, no painel à direita.
2. Clique em uma pista ou casa do tabuleiro para escolher a palavra. Clicar novamente no cruzamento alterna entre as duas direções.
3. Digite a resposta diretamente no tabuleiro usando o **teclado do computador**. As letras avançam automaticamente.
4. Use **Backspace** para apagar e as **setas** para navegar. Respostas não possuem acentos nem espaços.
5. Clique em **Conferir registros** para descobrir quais palavras estão corretas (verde) ou incorretas (vermelho). O contador mostra quantas das **16 palavras** estão certas.
6. Corrija as respostas e confira novamente. Para apagar tudo, use **Reiniciar mapa**.

**Objetivo:** preencher corretamente as 16 palavras cruzadas, cada uma conectada a pelo menos outra.

### 3. Santuário dos Códigos (estilo Termo)

1. O jogo escolhe **aleatoriamente uma das 16 palavras** do material da atividade.
2. Leia a pista exibida acima da grade. O número de casas corresponde à quantidade de letras da resposta.
3. Digite uma tentativa com o **mesmo número de letras** usando o teclado físico ou as teclas na tela.
4. Pressione **Enter** para confirmar. As cores indicam:
   - **Verde:** letra correta na posição correta.
   - **Âmbar:** letra presente na palavra, mas em outra posição.
   - **Cinza:** letra ausente (ou ocorrência excedente de uma letra repetida).
5. Use as pistas de cor para tentar acertar a palavra em até **6 tentativas**.
6. Clique em **Novo código** para começar outra rodada com uma palavra sorteada.

**Observação:** no modo Santuário dos Códigos, as tentativas não precisam ser palavras do dicionário, mas precisam ter o comprimento indicado. Esse modo é um desafio adicional.

## Documentos utilizados como base

1. **[SP3 MAT3] — Tópicos de Arquitetura Computacional | SPTech** — material teórico utilizado para fundamentar as pistas, os termos e suas definições.
2. **ARQCOMP — Exercício 04 v3 — Game Cruzadinha** — enunciado da Atividade Avaliativa III, com as 16 palavras previstas, regras das pistas, critérios de funcionamento e orientações de entrega.

## Lista de palavras e pistas da cruzadinha

| Palavra | Pista |
| --- | --- |
| CPU | Componente central que busca e executa instruções de um programa. |
| ULA | Parte da CPU responsável por cálculos e operações lógicas. |
| UC | Parte da CPU que interpreta instruções e coordena os demais componentes. |
| REGISTRADORES | Pequenas memórias internas da CPU que guardam valores em uso imediato. |
| RAM | Memória volátil que guarda aplicativos ativos e dados temporários. |
| ROM | Tipo de memória não volátil associado ao firmware de inicialização. |
| EEPROM | Memória não volátil que permite guardar configurações mesmo após desligar o dispositivo. |
| FLASH | Tecnologia regravável e não volátil utilizada para armazenar o programa no Arduino. |
| CACHE | Memória rápida que guarda cópias de informações acessadas recentemente. |
| MEMORIADEMASSA | Categoria que inclui SSD e HD para guardar arquivos permanentemente. |
| DMA | Mecanismo que transfere dados para a memória sem ocupar continuamente a CPU. |
| ADDRESSBUS | Conjunto de linhas que identifica qual posição de memória será acessada. |
| DATABUS | Conjunto de linhas bidirecionais que transporta valores e instruções entre componentes. |
| MICROCONTROLADOR | Chip que reúne processamento, memória e interfaces de entrada e saída. |
| DUALCORE | Processador que possui dois núcleos de execução. |
| QUADCORE | Processador que possui quatro núcleos de execução. |

## Executar e publicar

Os arquivos `index.html`, `style.css`, `script.js` e `puzzle.json` ficam na raiz do projeto. Não é necessário instalar dependências, compilar nem executar servidor: basta abrir `index.html` no Chrome, Edge ou Firefox. O arquivo JSON também documenta o tabuleiro; os dados são incorporados ao JavaScript para permitir abertura diretamente pelo sistema de arquivos.

---

*Homenagem visual feita por fãs para fins educacionais. Não possui vínculo com Nintendo ou com a franquia The Legend of Zelda. Símbolos e elementos gráficos do projeto foram construídos em CSS e SVG.*
