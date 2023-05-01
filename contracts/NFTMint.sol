// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMint is ERC721URIStorage {
    uint public tokenCount;

    constructor() ERC721("GenshinNFT", "Genshin") {}

    function mint(string memory _tokenURI) external returns(uint){
        tokenCount = tokenCount + 1;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }

}