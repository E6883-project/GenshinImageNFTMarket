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
        bool sold;
        uint256 most_sold;
        string image_url;
    }

    // Define mappings which are used to store some data

    mapping(string => bool) public appear_or_not;

    mapping(string => uint256) public left_sells;

    mapping(string => bool) public sold_or_not;

    mapping(string => address) public owner;

    // mapping(string => bool) public appear_or_not_all;

    mapping(uint256 => address) public buyerstorage;
    
    mapping(uint => mapping(address => bool)) public buyersall;

    mapping(uint => mapping(address => bool)) public sellerall;

    mapping(uint256 => GenshinImage) public items;

    mapping(uint => mapping(address => uint)) public buyerpriceall;

    mapping(uint => mapping(address => uint)) public buyertotalprice;

    mapping(uint => mapping(address => uint)) public sellerpriceall;

    mapping(uint => mapping(address => uint)) public sellertotalprice;

    mapping(uint => uint) public originalmostsold;

    mapping(uint => bool) public withdrawornot;

    mapping(address => uint) public spentmoney;

    mapping(address => uint) public earnmoney;
   
    uint256 new_most_sold;

    //feeAccount is the account to receive transaction fee.

    address payable public immutable feeAccount;

    uint256 public immutable feePercent;

    uint256 public itemCount;

    // string allconnect;

    //Define events

    event ImageCreated (
        uint256 image_id,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        uint256 most_sold_num,
        string image_url
    );


    event Bought (
        uint256 image,
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer,
        uint256 left_sold
    );

    constructor(uint256 _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function createNFT(IERC721 _nft, uint256 _tokenId, uint256 _price, uint256 _most_sold_num, string memory _image_url) external nonReentrant {
        require(_price > 0, "The must should be positive.");
        require(_most_sold_num >= 1, "The image should be sold at least once.");
        require(appear_or_not[_image_url] == false, "The image has already been created.");
        appear_or_not[_image_url] = true;
        owner[_image_url] = msg.sender;
        sold_or_not[_image_url] = false;
        
        // new_most_sold = _most_sold_num - 1;
        left_sells[_image_url] = _most_sold_num;
        itemCount++;
        // _nft.transferFrom(msg.sender, address(this), _tokenId);
        items[itemCount] = GenshinImage (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            _most_sold_num,
            _image_url
        );
        originalmostsold[itemCount] = _most_sold_num;
        emit ImageCreated(itemCount, address(_nft), _tokenId, _price, msg.sender, _most_sold_num, _image_url);

    }
    
    function recreateNFT(IERC721 _nft, uint256 _tokenId, uint256 _price, string memory _image_url) external nonReentrant {
        require(_price > 0, "The must should be positive.");
        require(appear_or_not[_image_url] == true, "The image has not been created yet.");
        require(owner[_image_url] == msg.sender, "This sender does not own this image.");
        require(sold_or_not[_image_url] == true, "The image is being sold.");
        new_most_sold = left_sells[_image_url];
        require(new_most_sold > 0, "The image has exceeded its maximum number of times for resale.");

        // new_most_sold--;
        left_sells[_image_url] = new_most_sold;
        itemCount++;
        // _nft.transferFrom(msg.sender, address(this), _tokenId);
        sold_or_not[_image_url] = false;

        items[itemCount] = GenshinImage (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            new_most_sold,
            _image_url
        );
        emit ImageCreated(itemCount, address(_nft), _tokenId, _price, msg.sender, new_most_sold, _image_url);

    }

    function listNFTForSale(uint256 _image_id, uint256 _price) external nonReentrant {
        require(_image_id > 0 && _image_id <= itemCount, "Image not found.");
        require(buyerstorage[_image_id] == msg.sender, "The image is not owned by the sender");
        require(_price > 0, "Price must be greater than 0");
        //Get the information of NFT.
        GenshinImage storage image = items[_image_id];
        image.seller = payable(msg.sender);
        image.sold = false;
        image.price = _price;
        //After writing the new information of image, transfer the NFT to market
        image.nft.transferFrom(msg.sender, address(this), image.token_id);
        //Store the new NFT
        items[_image_id] = image;
        buyerstorage[_image_id] = address(123);
        withdrawornot[_image_id] = false;
    }

    function calPrice(uint256 _image_id) view public returns(uint256) {
        return(items[_image_id].price*(100+feePercent)/100);
    }

    function purchaseNFT(uint256 _image_id) external payable nonReentrant {
        require(_image_id > 0 && _image_id <= itemCount, "Image not found.");
        uint256 _price = calPrice(_image_id);
        require(msg.value >= _price, "Insufficient balance for the buyer.");
        GenshinImage storage image = items[_image_id];
        require(!image.sold, "The image has already been sold.");
        image.seller.transfer(image.price);
        feeAccount.transfer(_price - image.price);
        image.sold = true;
        image.nft.transferFrom(address(this), msg.sender, image.token_id);
        if (buyerstorage[_image_id] != address(123)) {
            sold_or_not[image.image_url] = true;
        }
        buyerstorage[_image_id] = msg.sender;
        buyersall[_image_id][msg.sender] = true;
        sellerall[_image_id][image.seller] = true;
        buyerpriceall[_image_id][msg.sender] = image.price;
        sellerpriceall[_image_id][image.seller] = image.price;
        sellertotalprice[_image_id][image.seller] = _price;
        buyertotalprice[_image_id][msg.sender] = _price;
        spentmoney[msg.sender] += _price;
        earnmoney[image.seller] += image.price;
        // TODO: most sold需要改吗
        //Emit event.
        emit Bought(
            _image_id,
            address(image.nft),
            image.token_id,
            image.price,
            image.seller,
            msg.sender,
            image.most_sold
        );

    }

    function removeNFTFromSale(uint256 _image_id) external nonReentrant {
        require(_image_id > 0 && _image_id <= itemCount, "Image not found.");
        require(items[_image_id].seller == msg.sender, "The user does not own this image.");
        require(items[_image_id].sold == false, "The image has already been sold.");
        GenshinImage storage image = items[_image_id];
        if (buyerstorage[_image_id] == address(123)) {
            buyerstorage[_image_id] = msg.sender;
            items[_image_id].sold = true;
        }
        if(image.most_sold + 1 == originalmostsold[_image_id]){
            appear_or_not[image.image_url] = false;
            owner[image.image_url] = address(0);
            left_sells[image.image_url] = 0;
        }
        else{
            left_sells[image.image_url]++;
            sold_or_not[image.image_url] = true;
        }
        image.nft.transferFrom(address(this), msg.sender, image.token_id);
        withdrawornot[_image_id] = true;
    }

    function transferNFT(uint256 _image_id, address receiver) external nonReentrant {
        require(_image_id > 0 && _image_id <= itemCount, "Image not found.");
        require(items[_image_id].sold == false, "The image has already been sold.");
        // require(buyerstorage[_image_id] == msg.sender, "The image is not owned by the sender");
        require(receiver != address(0), "Recipient address cannot be zero.");
        require(!_isContract(receiver), "Recipient address should not be a contract.");

        GenshinImage storage image = items[_image_id];
        require(image.nft.ownerOf(image.token_id) == msg.sender, "The image is not owned by the sender");
        image.nft.transferFrom(msg.sender, receiver, image.token_id);
    
    }

    function _isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(account) }
        return size > 0;
    }

}