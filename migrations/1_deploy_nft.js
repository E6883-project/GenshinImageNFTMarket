const market  = artifacts.require("Marketplace");
const nft  = artifacts.require("NFTMint");

<<<<<<< HEAD
=======

>>>>>>> 3cf9c4cd09d81132cf0651b6e92acba0483c6a34
module.exports = function(deployer) {
    let feePercent = 1;
    deployer.deploy(market, feePercent);
    deployer.deploy(nft);
  };