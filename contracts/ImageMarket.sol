// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract  Marketplace is ReentrancyGuard {
    struct GenshinImage {
        uint256 image_id;
        uint256 token_id;
        IERC721 nft;
        address payable seller;
        bool sold;

    }

    mapping(uint256 => GenshinImage) public items;
    mapping(uint => bool) public withdraw_list;


    function createNFT() internal pure returns (string memory) {
        return '';
    }


    function transferNFT (uint256 image_id) external payable nonReentrant{

    }

    function listNFTForSale (uint256 image_id) external payable nonReentrant{

    }


    function removeNFTFromSale (uint256 _image_id) external payable nonReentrant{
       require(_image_id >= 0, "Image ID not valid");
       require(items[_image_id].seller == msg.sender);
       require(items[_image_id].sold == false);

       GenshinImage storage temp = items[_image_id];

       temp.nft.transferFrom(address(this), msg.sender, temp.token_id);
       withdraw_list[_image_id] = true;

       
    }

    function purchaseNFT(uint256 image_id) external payable nonReentrant{

    }

}