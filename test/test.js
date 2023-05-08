const { assert } = require("chai");

const market  = artifacts.require("Marketplace");
const nft  = artifacts.require("NFTMint");

describe("GenshinMarket", function() {

    let accounts, Market_deploy, NFT_deploy;
    let feePercent = 1;
    let URI = "Sample URI";
    let URI2 = "another sample url"
    let URI3 = "asdasf"
    this.timeout(5000);


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


    it("Test: Usuccessful NFT purchase when passing incorrect amount to contract", async function(){
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

    it("Test: Usuccessful NFT purchase when the NFT is not listed for sale", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);
        failed_transaction = false;

        // Try to purchase an NFT not for sale
        price1 = await Market_deploy.calPrice(1);
        try {
            await Market_deploy.purchaseNFT(1, {from: accounts[2], value: price1});
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }

        const image = await Market_deploy.items(1);
        assert.equal(image.listed, false);                          
        assert.equal(failed_transaction, true);
    });

    it("Test: Usuccessful NFT purchase when NFT is listed on sale first but got unlisted", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);
        await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})  
        failed_transaction = false;
        image = await Market_deploy.items(1);
        assert.equal(image.listed, true);

        // Try to purchase an NFT unlisted from sale
        price1 = await Market_deploy.calPrice(1);
        await Market_deploy.removeNFTFromSale(1, {from: accounts[1]})  
        try {
            await Market_deploy.purchaseNFT(1, {from: accounts[2], value: price1});
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }
        image = await Market_deploy.items(1);
        assert.equal(image.listed, false);                          
        assert.equal(failed_transaction, true);
    });

    it("Test: Should error out when Try to remove a NFT from sale when it's not on sale", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);

        failed_transaction = false;
        image = await Market_deploy.items(1);
        assert.equal(image.listed, false);

        try {
            await Market_deploy.removeNFTFromSale(1, {from: accounts[1]})
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }
        image = await Market_deploy.items(1);
        assert.equal(image.listed, false);                          
        assert.equal(failed_transaction, true);
    });

    it("Test: Should error out when Try to list a NFT for sale when it's already on sale", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);

        failed_transaction = false;
        await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})
        image = await Market_deploy.items(1);
        assert.equal(image.listed, true);

        try {
            await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }
        image = await Market_deploy.items(1);
        assert.equal(image.listed, true);                          
        assert.equal(failed_transaction, true);
    });

    it("Test: should fail when non-owner try to list a NFT for sale", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);

        failed_transaction = false;

        try {
            await Market_deploy.listNFTForSale(1, 4, {from: accounts[2]})
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }
        image = await Market_deploy.items(1);
        assert.equal(image.listed, false);                          
        assert.equal(failed_transaction, true);
    });

    it("Test: should not transfer an image when receiver is a contract", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);

        try {
            await Market_deploy.transferNFT(1, NFT_deploy.address, {from: accounts[1]})
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }
        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(failed_transaction, true);
    });

    it("Test: Non-owner should not transfer an image", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);

        try {
            await Market_deploy.transferNFT(1, accounts[1], {from: accounts[2]})
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }
        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(failed_transaction, true);
    });

    it("Test: should be able to transfer image multiple times", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[3]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);

        await Market_deploy.transferNFT(1, accounts[2], {from: accounts[1]})
        assert.equal(await NFT_deploy.ownerOf(1), accounts[2]);
        await Market_deploy.transferNFT(1, accounts[3], {from: accounts[2]})
        assert.equal(await NFT_deploy.ownerOf(1), accounts[3]);
        await Market_deploy.transferNFT(1, accounts[1], {from: accounts[3]})
        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
    });

    it("Test: should be able to purchase image multiple times after re-listing for sale", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[3]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);

        await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})         
        price1 = await Market_deploy.calPrice(1);
        await Market_deploy.purchaseNFT(1, {from: accounts[2], value: price1});
        assert.equal(await NFT_deploy.ownerOf(1), accounts[2]);

        await Market_deploy.listNFTForSale(1, 3, {from: accounts[2]})         
        price1 = await Market_deploy.calPrice(1);
        await Market_deploy.purchaseNFT(1, {from: accounts[3], value: price1});
        assert.equal(await NFT_deploy.ownerOf(1), accounts[3]);

        await Market_deploy.listNFTForSale(1, 5, {from: accounts[3]})         
        price1 = await Market_deploy.calPrice(1);
        await Market_deploy.purchaseNFT(1, {from: accounts[1], value: price1});
        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
    });

    it("Test: should error out when try to purchase an NFT just purchased by another user but not re-listed for sale", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[3]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await Market_deploy.itemCount(), 1);
    
        await Market_deploy.listNFTForSale(1, 4, {from: accounts[1]})         

        price1 = await Market_deploy.calPrice(1);
        await Market_deploy.purchaseNFT(1, {from: accounts[2], value: price1});

        const image = await Market_deploy.items(1);
        assert.equal(image.listed, false);      
        assert.equal(await NFT_deploy.ownerOf(1), accounts[2]);

        price1 = await Market_deploy.calPrice(1);

        try {
            await Market_deploy.purchaseNFT(1, {from: accounts[3], value: price1});
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }

        assert(failed_transaction, true);
        assert.equal(await NFT_deploy.ownerOf(1), accounts[2]);
    });

    it("Test: should fail when try to create an NFT with same image", async function(){
        await NFT_deploy.mint(URI, {from: accounts[1]})
        assert.equal(await NFT_deploy.tokenCount(), 1);
        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});

        await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[1]})

        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await Market_deploy.itemCount(), 1);

        const image = await Market_deploy.items(1);

        try {
            await Market_deploy.createNFT(NFT_deploy.address,
            1, "abc1", {from: accounts[2]})
          } catch (error) {
            console.error('An error occurred:', error);
            failed_transaction = true;
          }

        assert.equal(failed_transaction, true);
        assert.equal(await NFT_deploy.ownerOf(1), accounts[1]);
        assert.equal(await Market_deploy.itemCount(), 1);
    });



});

