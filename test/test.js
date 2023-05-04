const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GenshinMarket", function() {

    let deployer, addr1, addr2, addr3, Market_deploy, NFT_deploy;
    let feePercent = 1;
    let URI = "Sample URI";
    let URI2 = "another sample url"
    let URI3 = "asdasf"

    beforeEach(async function() {
    [deployer, addr1, addr2, addr3] = await ethers.getSigners();
    const GenshinMarket = await ethers.getContractFactory("ImageMarket");
    const NFT_Genshin = await ethers.getContractFactory("NFTMint");
    Market_deploy = await GenshinMarket.deploy(feePercent);
    NFT_deploy = await NFT_Genshin.deploy();
    });

    describe("Deployment", function(){
    it("should track name and symbol of the nft collection", async function(){
        expect(await NFT_deploy.name()).to.equal("CSGONFT");
        expect(await NFT_deploy.symbol()).to.equal("CSGO");
    })

    it("should track feeAccount and feePercent of the markerplace", async function(){
        expect(await Market_deploy.feeAccount()).to.equal(deployer.address);
        expect(await Market_deploy.feePercent()).to.equal(feePercent);
    })
    })

    it("should create a new NFT", async function() {
        const uniqueId = 1;
        const name = "My NFT";
        const description = "This is my NFT";
        await nftContract.createNFT(uniqueId, name, description);
        const nft = await nftContract.getNFT(uniqueId);
        expect(nft.id).to.equal(uniqueId);
        expect(nft.name).to.equal(name);
        expect(nft.description).to.equal(description);
    });

    describe("Making Highlights", function(){
        beforeEach(async function(){
            await NFT_deploy.connect(addr1).mint(URI)
            await NFT_deploy.connect(addr1).setApprovalForAll(Market_deploy.address, true)
        })

        it("should track newly created highlight, transfer NFT from seller to market and emit Highlightcreated event", async function(){
            await expect(Market_deploy.connect(addr1).createNFT(NFT_deploy.address,
                1, toWei(1), 2, "abc1"))
                .to.emit(Market_deploy, "HighlightCreated")
                .withArgs(
                    1, // uint256 itemCount;
                    NFT_deploy.address, // IERC721 nft; 
                    1, // uint256 token_id;
                    toWei(1), // uint256 price;
                    addr1.address, // address payable seller;
                    1, // uint256 new_most_sold;
                    "abc1", // string image_url;
                )

            expect(await NFT_deploy.ownerOf(1)).to.equal(Market_deploy.address);
            expect(await Market_deploy.itemCount()).to.equal(1);

            const highlight = await Market_deploy.items(1);
            // TODO: fix attributes name
            expect(highlight.nft).to.equal(NFT_deploy.address); // IERC721 _nft
            expect(highlight.token_id).to.equal(1); // uint256 _tokenId
            expect(highlight.price).to.equal(toWei(1)); // uint256 _price
            expect(highlight.seller).to.equal("user1"); // address payable seller
            expect(highlight.sold).to.equal(false); // bool sold
            expect(highlight.most_sold).to.equal(1); // uint256 most_sold;
            expect(highlight.demo_url).to.equal("abc1");

        });
        });
});
