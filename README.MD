## Test task goal

Create api to scrap data about nike.com products. The customer should send two requests - first to initiate scrapping and second to retrieve data. The minimum time between two requests should be 10 seconds.

## Configuration

Project is configured using .env file. There is only 1 config key available - PORT, which configures the port web server will be launched on. The default .env file is included in git repo (although it is a bad practice, but it is just test project) and can be overriden by .env.local if such file is provided.

## Setup and launch scripts

### Setup

Requirements: Node v16.0+

1. Install packages through `npm install`

### Launch scripts

There is 3 available scripts:

1. `npm run build` - transpile ts files into js files
2. `npm run start` - build and run project using node
3. `npm run test` - build and run tests using jest test runner

## Logic

The main endpoint is located on `/parse`.

- To interact with API, user need to get product id from nike site. The product id is a bold part of nike page url, provided in example below:\
  nike.com/t/**offcourt-colorado-rockies-slide-B2ZZsZ/DH6991-001**

- The user may start process of scrapping using the GET request `/parse?productId={productId}`. If the page exists, the result will be response code 200 with body:

```
{
  "handleId": handleId
}
```

Handle id should be used to retrieve the result of operation. If the productId is incorrect, the endpoint will return the 400 Bad Request.
The results of scrapping will be stored in database until (and after) the user will send another request to pick it up. The scrapping is done by parsing **NEXT_DATA** script header from page.

- To get the results, user need to send another request with `/parse?handleId={handleId}`. If the result is ready, the response will be (example):

```
{
  "result": {
    "name": "Nike Gamma Force",
    "brand": "Nike",
    "price": 80.97,
    "isAvailable": true,
    "isInSale": true,
    "saleDescription": "-15%",
    "description": "Layers upon layers of dimensional style—that's a force to be reckoned with. Offering both comfort and versatility, these kicks are rooted in heritage basketball culture. The collar materials pay homage to vintage sport while the subtle platform elevates your look, literally. The Gamma Force is forging its own legacy: court style that can be worn all day, wherever you go."
  }
}
```

If the result is not ready (less than 10 sec passed from 1st request), or parsing timeout, or incorrect hanlde, the user will instead receive 202 response with reason for rejection:

```
{
    reason: {Reason for rejection}
}
```

## File structure and logic separation

- index.ts - entry point for application
- env.ts - logic to extract env variables from .env
- datasource.ts - logic to setup datasource singleton to access database
- types.ts - type declarations for types used in application
- expressApp.ts - express controller logic
- requestHandler.ts - handling data storage logic between parser and controller
- parser.ts - retrieving and parsing the nike webpages
- /entity/scrapRequest.entity.ts - database entity for scrap result model

## Packages and technologies used

- Typescript - for code supportability
- Express - web server
- TypeORM - orm for database
- Sqlite database - for ease of setup of test project. The data is store in db.sqlite file inside root folder.
- uuid - generating uuid for handles
- Axios - making outgoing htto requests (more readable than native node options)
- Jest - testing

## Testing

The solution also includes smoke test to check if parser works correctly (the nike page structure was unchanged).
It can be run with aforementioned `npm run test` command.
