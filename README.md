# GenshinImageNFTMarket

## File Structure
- contracts
    - `ImageMarket.sol`: Market Contract with required functions, including `creatNFT`, `listNFTForSale`, `removeNFTFromSale`, `transferNFT`, `purchaseNFT`
    - `NFTMint.sol`: ERC721URIStorage is a Solidity contract that inherits from the ERC721 contract and adds the ability to associate a metadata URI with each NFT token ID. The metadata URI is a URL that points to a JSON file containing metadata about the token, such as its name, description, image, and other attributes; user can use mint function to mint new NFTs
- migrations
    - `1_deploy_nft.js`: truffle deploy file
- node_modules: npm modules installed
- test
    - `test.js`: truffle test scripts written in javascript to test all functions in our smart contract
- `truffle-config.js`: truffle config files
- `package.json`: npm package list

## How run the code
1. Download and install the current version of Node.js, Truffle, Ganache, MetaMask. This is my development version:
    - Truffle v5.8.4 (core: 5.8.4)
    - Ganache v7.8.0
    - Node v18.16.0
2. Compile the contract: `truffle compile`
3. Migrate/Deploy the contract:
    - Local Deployment with Ganache: `truffle migrate`
    - TODO (still testing): Test Network Deployment; `truffle migrate --network sepolia`
4. Test the contract: `truffle test`









