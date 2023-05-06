// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract  Marketplace is ReentrancyGuard {



    struct GenshinImage {
        uint256 image_id;
        IERC721 nft;
        uint256 token_id;
        uint256 price;
        address payable seller;
        bool listed;
        string image_url;
    }

    // Define mappings which are used to store some data
    mapping(string => bool) public appear_or_not;
    mapping(uint256 => GenshinImage) public items;

    //feeAccount is the account to receive transaction fee.
    address payable public immutable feeAccount;
    uint256 public immutable feePercent;
    uint256 public itemCount;

    //Define events
    event ImageCreated (
        uint256 image_id,
        address indexed nft,
        uint256 tokenId,
        address indexed seller,
        string image_url
    );

    event Bought (
        uint256 image,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint256 _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function createNFT(IERC721 _nft, uint256 _tokenId, string memory _image_url) external nonReentrant {
        require(appear_or_not[_image_url] == false, "The image has already been created.");
        appear_or_not[_image_url] = true;
        
        itemCount++;
        items[itemCount] = GenshinImage (
            itemCount,
            _nft,
            _tokenId,
            0,
            payable(msg.sender),
            false,
            _image_url
        );
        emit ImageCreated(itemCount, address(_nft), _tokenId, msg.sender, _image_url);

    }

    function listNFTForSale(uint256 _image_id, uint256 _price) external nonReentrant {
        require(_image_id > 0 && _image_id <= itemCount, "Image not found.");
        GenshinImage storage image = items[_image_id];
        require(image.seller == msg.sender, "The image is not owned by the sender");
        require(_price > 0, "Price must be greater than 0");
        require(!image.listed, "The image has already been listed for sale.");
        image.price = _price;
        image.listed = true;
        //After writing the new information of image, transfer the NFT to market
        image.nft.transferFrom(msg.sender, address(this), image.token_id);
        //Store the new NFT
        items[_image_id] = image;
    }

    function removeNFTFromSale(uint256 _image_id) external nonReentrant {
        require(_image_id > 0 && _image_id <= itemCount, "Image not found.");
        GenshinImage storage image = items[_image_id];
        require(image.seller == msg.sender, "The user does not own this image.");
        require(image.listed, "The image is not listed for sale.");
        
        image.listed = false;
        image.seller = payable(msg.sender);
        image.nft.transferFrom(address(this), msg.sender, image.token_id);
        items[_image_id] = image;
    }

    function transferNFT(uint256 _image_id, address receiver) external nonReentrant {
        require(_image_id > 0 && _image_id <= itemCount, "Image not found.");
        GenshinImage storage image = items[_image_id];
        require(image.seller == msg.sender, "The image is not owned by the sender.");
        require(image.listed == false, "The image is currently listed for sale.");
        // require(buyerstorage[_image_id] == msg.sender, "The image is not owned by the sender");
        require(!_isContract(receiver), "Recipient address should not be a contract.");
        require(receiver != address(0), "Recipient address cannot be zero.");

        image.seller = payable(receiver);
        image.nft.transferFrom(msg.sender, receiver, image.token_id);
        items[_image_id] = image;
    
    }

    function calPrice(uint256 _image_id) view public returns(uint256) {
        return(items[_image_id].price*(100+feePercent)/100);
    }

    function purchaseNFT(uint256 _image_id) external payable nonReentrant {
        require(_image_id > 0 && _image_id <= itemCount, "Image not found.");
        uint256 _price = calPrice(_image_id);
        require(msg.value >= _price, "Insufficient balance for the buyer.");
        GenshinImage storage image = items[_image_id];
        require(image.listed, "The image is not listed for sale.");
        require(image.seller != msg.sender, "The image cannot be bought by its owner.");

        image.seller.transfer(image.price);
        feeAccount.transfer(_price - image.price);
        image.listed = false;
        image.nft.transferFrom(address(this), msg.sender, image.token_id);
        items[_image_id] = image;
        
        //Emit event.
        emit Bought(
            _image_id,
            address(image.nft),
            image.token_id,
            image.price,
            image.seller,
            msg.sender
        );

    }


    function _isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(account) }
        return size > 0;
    }

}