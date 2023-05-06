const { assert } = require("chai");

const market  = artifacts.require("Marketplace");
const nft  = artifacts.require("NFTMint");

describe("GenshinMarket", function() {

    let accounts, Market_deploy, NFT_deploy;
    let feePercent = 1;
    let URI = "Sample URI";
    let URI2 = "another sample url"
    let URI3 = "asdasf"


    beforeEach(async function() {
        // accounts = [Feeacount, SELLER1, SELLER2, ....]
        accounts = await web3.eth.getAccounts();
        // console.log(accounts)
        Market_deploy = await market.new(1);
        NFT_deploy = await nft.new();
    });


    it("should track name and symbol of the nft collection", async function(){
            assert.equal(await NFT_deploy.name(), "GenshinNFT")
            assert.equal(await NFT_deploy.symbol(), "Genshin")
    });


    it("should track feeAccount and feePercent of the markerplace", async function(){
            assert.equal(await Market_deploy.feeAccount(), accounts[0])
            assert.equal(await Market_deploy.feePercent(), feePercent)
    });


    it("should track each mint nft", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await NFT_deploy.balanceOf(accounts[1]), 1);
        assert.equal(await NFT_deploy.tokenURI(1), URI);

        await NFT_deploy.mint(URI, {from: accounts[2]})
        assert.equal(await NFT_deploy.tokenCount(), 2);
        assert.equal(await NFT_deploy.balanceOf(accounts[2]), 1);
        assert.equal(await NFT_deploy.tokenURI(2), URI);
    });


    it("Test: should track newly created image, transfer NFT from seller to market and emit imagecreated event", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await Market_deploy.itemCount(), 1);

        const image = await Market_deploy.items(1);
        assert.equal(image.image_id, 1);                // uint256 image_id;
        assert.equal(image.nft, NFT_deploy.address);    // IERC721 _nft
        assert.equal(image.token_id, 1);                // uint256 _tokenId
        assert.equal(image.price, 0);                   // uint256 _price
        assert.equal(image.seller, accounts[1]);        // address payable seller
        assert.equal(image.listed, false);              // bool listed
        assert.equal(image.image_url, "abc1");          // string image_url
    });


    it("Test: should transfer an image from one account to another", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);

        await Market_deploy.transferNFT(1, accounts[2], {from: accounts[1]})
        assert.equal(await NFT_deploy.ownerOf(1), accounts[2]);
    });


    it("Test: should list an NFT for sale", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})                            // _image_id = 1, price = 4
        assert.equal(await NFT_deploy.ownerOf(1), Market_deploy.address);   // Test owner should be market (for sale)

        const image = await Market_deploy.items(1);
        assert.equal(image.price, 4);                   // Test price    
        assert.equal(image.listed, true);               // bool listed
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);
    });


    it("Test: should remove an NFT for sale", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})                            // _image_id = 1, price = 4
        assert.equal(await NFT_deploy.ownerOf(1), Market_deploy.address);   // Test owner should be market (for sale)
        
        await Market_deploy.removeNFTFromSale(1, {from: accounts[1]})
        const image = await Market_deploy.items(1);  
        assert.equal(image.listed, false);               // bool listed
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);
    });


    it("Test: should execute a successful NFT purchase", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);
    
        await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})         

        // give price1 to msg.value, which is accounts[2] here 
        // s.t. he can afford the image 1
        price1 = await Market_deploy.calPrice(1);
        await Market_deploy.purchaseNFT(1, {from: accounts[2], value: price1});

        const image = await Market_deploy.items(1);
        assert.equal(image.listed, false);                       // bool listed        
        assert.equal(await NFT_deploy.ownerOf(1), accounts[2]);
    });


    it("Test: should execute an usuccessful NFT purchase", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);
    
        await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})         

        // give incorrect price1 to msg.value, which is accounts[2] here 
        // s.t. he can afford the image 1
        price1 = await Market_deploy.calPrice(1) * 2;
        try {
            // Code that may throw an error
            await Market_deploy.purchaseNFT(1, {from: accounts[2], value: price1});
          } catch (error) {
            // Code to handle the error
            console.error('An error occurred:', error);
          }

        const image = await Market_deploy.items(1);
        assert.equal(image.listed, true);                          
        assert.equal(await NFT_deploy.ownerOf(1), Market_deploy.address);
    });

});








    // describe("Purchase images", function(){
    //     beforeEach(async function(){
    //         await NFT_deploy.mint(URI2, {from: accounts[1]})
    //         assert.equal(await NFT_deploy.tokenCount(), 2);
    //         assert.equal(await NFT_deploy.ownerOf(2), accounts[1]);

    //         // console.log("tokenCount: ", tokenCount, typeof tokenCount)
    //         await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
    //         await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});
    //     })

    //     it("should succeed purchase an image", async function(){
    //         // createNFT(IERC721 _nft, uint256 _tokenId, uint256 _price, uint256 _most_sold_num, string memory _image_url)
    //         assert.equal(await Market_deploy.itemCount(), 1);
    //         // assert.equal(await NFT_deploy.ownerOf(1), Market_deploy.address);
    //         // assert.equal(await NFT_deploy.ownerOf(2), Market_deploy.address);
            
    //         await Market_deploy.createNFT(NFT_deploy.address,
    //             2, 1, 1, "abc2", {from: accounts[1]})

    //         assert.equal(await Market_deploy.itemCount(), 2);
    //         // _tokenId = 2
    //         // _price = 1
            
    //         // console.log(accounts[1])
    //         // console.log(accounts[0])

    //         // assert.equal(await Market_deploy.itemCount(), 2);

    //         // const image2 = await Market_deploy.items(2);
    //         // assert.equal(image2.image_id, 2); // uint256 image_id;
    //         // assert.equal(image2.nft, NFT_deploy.address); // IERC721 _nft
    //         // assert.equal(image2.token_id, 2); // uint256 _tokenId
    //         // assert.equal(image2.price, 1); // uint256 _price
    //         // assert.equal(image2.seller, accounts[1]); // address payable seller
    //         // assert.equal(image2.sold, false); // bool sold
    //         // assert.equal(image2.most_sold, 0); // uint256 most_sold;
    //         // assert.equal(image2.image_url, "abc2");

    //         // const image1 = await Market_deploy.items(1);

    //         // let amount = web3.utils.toWei('1', 'ether');
    //         // let result = await Market_deploy.purchaseNFT(1, {from: accounts[2], value: amount});
    //         // console.log(result);

    //         // assert.equal(image.seller, accounts[2]); // address payable seller
    //     });
    //     });

