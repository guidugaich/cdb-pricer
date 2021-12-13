# cdb-pricer

Ferramenta para precificação de CDB (certificado de depósito bancário) como parte do processo seletivo da Gorila Investimentos. O serviço está publicado como um Docker container na plataforma Heroku.

API Publicada: https://cdb-pricer.herokuapp.com/pricing
Aplicação front-end para interação de usuário: https://guidugaich.github.io/cdb-pricer-front

Para rodar a aplicação localmente basta clonar o projeto e rodar `npm start`

# A aplicação

O repóstório contém uma aplicação, desenvolvida com `node` e `express`, para cálculo de preço de um CDB (Certificado de Depósito Bancário) pós-fixado indexado ao CDI. Como input, o usuário deve informar a **data inicial de investimento**, a **taxa do CDB** e a **data atual** da preficicação. Os inputs devem ser informados no formato de query string, no modelo:

https://cdb-pricer.herokuapp.com/pricing?investmentDate=YYYY-MM-DD&cdbRate=XX.XX&currentDate=YYYY-MM-DD

- As datas devem necessariamente ser informadas no formato especificado (YYYY-MM-DD)
- A taxa do CDB deve ser informada em formato numérico (inteiro ou decimal)

O retorno será um objeto JSON no formato abaixo, onde ***unitPrice*** é o resultado da precificação do CDB da data especificada.

```
[
  {
	  "date": "YYYY-MM-DD", // data inicial de investimento
	  "unitPrice": XX.XX
  },
  {
	  "date": "YYYY-MM-DD",
	  "unitPrice": YY.YY
  },
  ...,
  {
	  "date": "YYYY-MM-DD", // data final de precificação
	  "unitPrice": ZZ.ZZ
  }
]
```

## Arquitetura

A aplicação utiliza um padrão de arquitetura MSC, com um ***model*** que faz a requisição dos dados históricos do CDI, um ***service*** que realiza todos os cálculos e verificações numéricas, e uma camada de ***controller*** que lida com as requisições e respostas para o usuário.

# Testes

Foram implementados testes unitários para as camadas de service e controller, além de testes de integração para o endpoint principal. Os testes foram implementados com as ferramentas `chai`, `sinon` e `mocha`. `chai-http` foi utilizada para simulação de requisições. Para executar os testes:

```
$ npm test
```
