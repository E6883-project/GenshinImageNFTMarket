# NFT Marketplace Smart Contract for Image Transaction

## Overview
This is the Final Course Project for ELEN E6883 Intro to Blockchain. We implemented and tested a smart contract compliant with ERC721 standard, which is able to create, transfer, sale, remove, and purchase NFTs. The marketplace was deployed both on the local network with Truffle and Ganache, and also a test network with Sepolia and Metamask. 

## Team member
- Mingxuan Lu, ml4799 (Test & deployment) 
- Jingwei Zhang, jz3555 (Test) 
- Zhengping Zhu, zz2989 (Smart Contract)
- Guangwen Wang, gw2459 (Report) 
- Yi Wang, yw3903 (Report)

## File Structure
- contracts
    - `ImageMarket.sol`: Smart Contract with required functions, including `creatNFT`, `listNFTForSale`, `removeNFTFromSale`, `transferNFT`, `purchaseNFT`
    - `NFTMint.sol`: ERC721URIStorage is a Solidity contract that inherits from the ERC721 contract and adds the ability to associate a metadata URI with each NFT token ID. 
- migrations
    - `1_deploy_nft.js`: truffle deploy file
- node_modules: npm modules installed
- test
    - `test.js`: truffle test scripts written in javascript to test all functions in our smart contract
- `truffle-config.js`: truffle config files
- `package.json`: npm package list

## Environmental Setup
Download and install through `npm` the current version of Node.js, Truffle, Ganache, MetaMask. The versions used during development:<br />
- Truffle v5.8.4 (core: 5.8.4)
- Ganache v7.8.0
- Solidity - 0.8.19 (solc-js)
- Node v18.16.0
- Web3.js v1.8.2
    
## Deploy and test the contract (Local & Sepolia Test Network)
1. Install npm packages: `sudo npm i`
2. Compile the contract: `truffle compile`
3. Migrate/Deploy the contract:
    - Local Deployment with Ganache: `truffle migrate`
    - Test Network Deployment: `truffle migrate --network sepolia`, cost at least 0.013 sepETH to deploy given the price on 05/07/2023
4. Test the contract: `truffle test`; all the tests are conducted on locally.







