# Pata & Companhia Petshop - Fase 2

Projeto da disciplina **Fundamentos de Sistemas Web** (PUCRS). Continuação da Fase 1:
o site do petshop agora usa CSS próprio e Bootstrap 5, tem funções em JavaScript,
formulário de cadastro do cliente e do pet, agendamento com calendário e recursos
de acessibilidade.

## Como visualizar

Abra `index.html` em um navegador ou acesse a versão publicada no GitHub Pages.

## Estrutura dos arquivos

```text
petshop-fase2/
├── index.html          início, com carrossel Bootstrap
├── produtos.html       6 produtos (2 por categoria) com filtro e busca
├── servicos.html       banho, tosa, tele-busca e tabela de valores
├── agendamento.html    formulário de cliente + pet + agendamento
├── contato.html        endereço, telefones e horários
├── ajuda.html          funcionalidades, acessibilidade e ajustes da Fase 2
├── css/estilo.css      paleta, tipografia e ajustes sobre o Bootstrap
├── js/comum.js         relógio, situação da loja, link ativo e ano do rodapé
├── js/produtos.js      filtro por categoria e busca por nome
├── js/agendamento.js   validação, calendário, horários e cálculo do valor
└── imagens/            banners do carrossel, produtos, serviços e logotipo (SVG)
```

## Requisitos da Fase 2

**CSS/Bootstrap e JavaScript** — Bootstrap 5.3 via CDN mais `css/estilo.css`.
Carrossel com três banners e troca automática a cada 6 segundos; relógio e aviso de
loja aberta/fechada atualizados a cada 30 segundos (função temporal); filtro de
produtos; validação e cálculo de preço no agendamento.

**Formulário de cadastro do cliente e do pet** — nome, CPF, endereço, CEP, telefone,
e-mail e sexo (radio) do tutor; nome, espécie (select), raça, idade (number), porte
(radio) e observações (textarea) do pet; checkboxes de lembrete e de confirmação.
Usa `required`, `placeholder`, `minlength`, `pattern`, `min`/`max` e mensagens de erro.

**Escolha do serviço e agendamento** — banho, tosa ou os dois; tele-busca ou entrega
do pet na loja; campo de calendário (`input type="date"`) limitado aos próximos 60
dias, que recusa domingos e monta os horários conforme o dia da semana.

**Acessibilidade** — `alt` com audiodescrição em todas as imagens, link para pular ao
conteúdo, HTML semântico, `label` em todos os campos, `aria-live` nas áreas que mudam
sozinhas, `aria-current` no link da página atual, foco visível e contraste reforçado.

## Ajustes em relação à Fase 1

Descritos em detalhe na página `ajuda.html`. Em resumo: adoção do Bootstrap e de CSS
próprio, separação do código em arquivos, menu responsivo, produtos e serviços em
cartões e tabelas responsivas, nova página de agendamento, textos alternativos
reescritos como audiodescrição, tabela de preços reorganizada por porte do pet e
imagens em SVG.

## Observação

Front-end acadêmico: não há servidor, banco de dados nem envio real de e-mails.
O agendamento é validado e resumido no próprio navegador.
