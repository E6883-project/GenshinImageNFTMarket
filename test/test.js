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
    console.log(accounts)
    Market_deploy = await market.deployed();
    NFT_deploy = await nft.deployed();
    });

    describe("Deployment", function(){
    it("should track name and symbol of the nft collection", async function(){
        assert.equal(await NFT_deploy.name(), "GenshinNFT")
        assert.equal(await NFT_deploy.symbol(), "Genshin")
    })

    it("should track feeAccount and feePercent of the markerplace", async function(){
        assert.equal(await Market_deploy.feeAccount(), accounts[0])
        assert.equal(await Market_deploy.feePercent(), feePercent)
    })
    })

    describe("Minting NFTs", function(){
        it("should track each mint nft", async function(){
            await NFT_deploy.mint(URI, {from: accounts[1]})
            assert.equal(await NFT_deploy.tokenCount(), 1);
            assert.equal(await NFT_deploy.balanceOf(accounts[1]), 1);
            assert.equal(await NFT_deploy.tokenURI(1), URI);

            await NFT_deploy.mint(URI, {from: accounts[2]})
            assert.equal(await NFT_deploy.tokenCount(), 2);
            assert.equal(await NFT_deploy.balanceOf(accounts[2]), 1);
            assert.equal(await NFT_deploy.tokenURI(2), URI);
        })
    })

    describe("Making images", function(){
        beforeEach(async function(){
            tokenCount = await NFT_deploy.mint(URI, {from: accounts[1]})
            // console.log("tokenCount: ", tokenCount, typeof tokenCount)
            await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
        })

        it("should track newly created image, transfer NFT from seller to market and emit imagecreated event", async function(){
            await Market_deploy.createNFT(NFT_deploy.address,
                1, 1, 2, "abc1", {from: accounts[1]})

            assert.equal(await NFT_deploy.ownerOf(1), Market_deploy.address);
            assert.equal(await Market_deploy.itemCount(), 1);

            const image = await Market_deploy.items(1);
            assert.equal(image.image_id, 1);                // uint256 image_id;
            assert.equal(image.nft, NFT_deploy.address);    // IERC721 _nft
            assert.equal(image.token_id, 1);                // uint256 _tokenId
            assert.equal(image.price, 1);                   // uint256 _price
            assert.equal(image.seller, accounts[1]);        // address payable seller
            assert.equal(image.sold, false);                // bool sold
            assert.equal(image.most_sold, 1);               // uint256 most_sold;
            assert.equal(image.image_url, "abc1");          // string image_url
        });
    });

    describe("Transfer images", function(){
        beforeEach(async function(){
            // await NFT_deploy.mint(URI, {from: accounts[1]})
            // await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[1]});
            await NFT_deploy.setApprovalForAll(Market_deploy.address, true, {from: accounts[2]});
        });

        it("should transfer an image from one account to another", async function(){
            // await Market_deploy.createNFT(NFT_deploy.address,
            //     1, 1, 2, "abc1", {from: accounts[1]})
            const image = await Market_deploy.items(1);
            assert.equal(image.seller, accounts[1])
            console.log(Market_deploy.itemCount())

            await Market_deploy.transferNFT(1, accounts[2], {from: accounts[1]})
            assert.equal(image.seller, accounts[2])
        });
    });
    
});
