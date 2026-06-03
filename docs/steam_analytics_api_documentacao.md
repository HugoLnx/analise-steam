# Steam Analytics API - Documentação Técnica

## Visão Geral

API responsável por listar jogos da Steam com suporte a filtros de tags, paginação e ordenação.

## Endpoint

```
GET /api/games/
```

## Fluxo da API

- Frontend envia requisição GET para `/api/games/`
- Backend lê os query params
- Backend monta queries usando `Q()` do Django
- Aplica filtros INCLUDE e EXCLUDE
- Aplica ordenação
- Aplica paginação
- Retorna resposta JSON

## Query Params

| Parâmetro    | Tipo   | Descrição                |
|--------------|--------|--------------------------|
| `page`       | int    | Página atual             |
| `sort`       | string | Ordenação dos resultados |
| `filter_tags`| string | Filtros de tags          |

## Ordenação

| Valor     | Descrição              |
|-----------|------------------------|
| `revenue` | Receita em 1 ano       |
| `reviews` | Quantidade de reviews  |
| `price`   | Maior preço            |
| `release` | Data de lançamento     |

## Filtro de Tags

O parâmetro `filter_tags` permite criar filtros usando operadores lógicos.

Exemplo:
```
INCLUDE_AND FPS,Arena Shooter;EXCLUDE_OR Multiplayer,Casual
```

## Operadores

| Operador      | Função                                      |
|---------------|---------------------------------------------|
| `INCLUDE_AND` | Jogo deve possuir TODAS as tags             |
| `INCLUDE_OR`  | Jogo deve possuir PELO MENOS UMA tag        |
| `EXCLUDE_AND` | Remove jogos que possuem TODAS as tags      |
| `EXCLUDE_OR`  | Remove jogos que possuem QUALQUER uma das tags |

## Exemplo Completo

```
/api/games/?page=1&sort=revenue&filter_tags=INCLUDE_AND FPS,Arena Shooter;INCLUDE_OR Boomer Shooter;EXCLUDE_OR Multiplayer,Casual
```

## Estrutura da Resposta JSON

```json
{
  "results": [
    {
      "appid": 730,
      "name": "Counter-Strike 2",
      "price": 0,
      "release_date": "2023-09-27",
      "review_count": 8000000,
      "revenue_1year": 120000000,
      "tags": [
        "FPS",
        "Shooter"
      ]
    }
  ],
  "page": 1,
  "per_page": 20,
  "total": 250,
  "total_pages": 13
}
```

## Observações

- Tags não diferenciam maiúsculas/minúsculas
- Múltiplas tags usam vírgula
- Múltiplos grupos usam `;`
- Paginação padrão: 20 jogos por página
- Backend utiliza `distinct()` para evitar duplicações
