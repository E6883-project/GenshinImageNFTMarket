// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract  Marketplace is ReentrancyGuard {
    struct GenshinImage {
        uint256 image_id;
        IERC721 nft;

    }

    function createNFT() internal pure returns (string memory) {
        return '';
    }


    function transferNFT () {}

    function listNFTForSale () {}


    function removeNFTFromSale

    function purchaseNFT

}