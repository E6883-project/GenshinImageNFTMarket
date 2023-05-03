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
        // unint256 most_sold;
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
        
        new_most_sold--;
        left_sells[_image_url] = new_most_sold;
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        items[itemCount] = GenshinImage (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            _image_url
        );
        originalmostsold[itemCount] = _most_sold_num;
        emit ImageCreated(itemCount, address(_nft), _tokenId, _price, msg.sender, new_most_sold, _image_url);

    }
    
    function listNFTForSale(IERC721 _nft, uint256 _tokenId, uint256 _price, string memory _image_url) external nonReentrant {
        require(_price > 0, "The must should be positive.");
        require(appear_or_not[_image_url] == true, "The image has not been created yet.");
        require(owner[_image_url] == msg.sender, "This sender does not own this image.");
        require(sold_or_not[_image_url] == true, "The image is being sold.");
        new_most_sold = left_sells[_image_url];
        require(new_most_sold > 0, "The image has exceeded its maximum number of times for resale.");

        new_most_sold--;
        left_sells[_image_url] = new_most_sold;
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        sold_or_not[_image_url] = false;

        items[itemCount] = GenshinImage (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false,
            _image_url
        );
        emit ImageCreated(itemCount, address(_nft), _tokenId, _price, msg.sender, new_most_sold, _image_url);

    }

    // function createNFT() internal pure returns (string memory) {
    //     return '';
    // }


    // function transferNFT () {}

    // function listNFTForSale () {}


    // function removeNFTFromSale

    // function purchaseNFT

}