# IBO - Initial Bottle Offering

*insert screenshot here*


IBO allows alcohol producers (wineries, distilleries etc) to tokenize their future production. It can be use as alternative way to rise funds, emit limited batch of bottles etc.

Tokens should be offer below shop price of bottles, so the discount becomes value for token holders and reason to buy tokens aka tokenomy.

This variant of IBO supports only one token at a time. Feel free to check other variants of this dApp:

* IBO Manager - handles multiple tokens
* IBO Auction - NFT version of this contract with auctioning mechanism

## Disclaimer

Following code is NOT production ready. It may contain bugs and be not gas efficient. It was created as learning project. Feel free to use it as an example of creating ERC20 token (fungible token) and dApp associated with it.


## Tooling: 
**Frontend**: TypeScript / VueJS / Vuex / Vuetify / Web3

**Smart contract**: Solidity / Truffle / Ganache / OpenZeppelin / Chai / Mocha

## Instalation

1. Clone the repository

```
git clone X
```

2. Install Truffle
```
npm install -g truffle
```

3. Install smart contract dependencies
```
npm install
```

3. Install frontend app dependencies
```
cd app
npm install
```

## Testing
You can test all features of smart contract by executing
```
truffle test
```

## Running

1. Run Ganache

2. (Optionally) Set up token details

Open `migrations/1640956577_ibo.js` and adjust values of token details
```
const NAME = 'Solaris 2022';
const SYMBOL = 'SOL22';
const NUMBER_OF_BOTTLES = 100;
const DESCRIPTION = 'New vintage of our best wine';
const PRODUCER = 'Chateau Lawicki';
const URL_TO_MORE_INFO = 'http://www.wine.eth';
const PRICE_IN_ETH = '0.02';
const SHOP_PRICE_IN_ETH = '0.05';
```

3. Deploy smart contract
```
truffle deploy
```

3. Start VueJS app
```
cd app
npm run serve
```

Go to http://localhost:8080/ to interact with the app

*Remember to connect your wallet to Ganache network*

## Using the app

When you'll open the app and login with your wallet you'll be able to buy tokens. If you'll have any tokens the box with balance will appear. In this box you'll see button with wine icon, click on it to start bottle withdrawing process. When you'll do that your'll give an allowance to your tokens to the owner of the contract. In response you'll see modal window with your wallet address. In production ready application the address could be presented in the form of QR code. Now someone on the producer site will scan that code and give you your bottle - burning in the same time token representing that bottle (this part of application is not included in this repo, although the process of withdrawing is present in test cases).

If you login to the app with wallet address of the contract owner you will have option to withdraw ETH funds from the contract as well as modify token (bottle) details.

## Author
Mike Lawicki http://lawicki.pl
