const market  = artifacts.require("Marketplace");
const nft  = artifacts.require("NFTMint");

module.exports = function(deployer) {
    let feePercent = 1;
    deployer.deploy(market, feePercent);
    deployer.deploy(nft);
  };