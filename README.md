![](public/eth.png)
##
## Project Starter Package
I created this repository as a quicker starting point for solidity projects. It combines 3 major frameworks that are used together:
- <img src="public/icons/react.png" width="30" > [React](https://reactjs.org/) -> front-end
- <img src="public/icons/truffle.png" width="30" > [Truffle](https://www.trufflesuite.com/truffle) -> solidity development (including network defaults to truffle-config.js)
- <img src="public/icons/metamask.png" width="30" > [MetaMask](https://metamask.io/) -> web3 connectivity
- <img src="public/icons/ganache.png" width="30" > [Ganache](https://www.trufflesuite.com/ganache) -> development 
##
Additionally, packages that are staples and used often throughout projects are also embedded/included in package.json:
- dotenv (.env file integration)
- web3
- chai
- lodash
- moment
- bootstrap
- babel (ES6 integration for Javascript)
##
## Instructions
1.  clone repository or download a local copy
```
git clone https://github.com/Guceri/project-init EthereumProject
```
2.  navigate to project directory to install package.json packages
```
npm install
```
3.  configure .env file (rename fi & set API keys, Mnemonics, etc.)
      - rename file to .env
      - configure API keys & Mnemonics
4.  make adjustments to truffle-config.js as needed (ie. compiler version)
5.  run smoke test
```
npm start
```