import Mcp from "./mcp"

const NFTabi = require("./Huygens_contractsData/NFT_CSGO.json");

const McpFunc = new Mcp();
McpFunc.Contract.setProvider("http://18.182.45.18:8765/");

const NFTtokenAddress = "0xc482105CE34364985a9c9FB003Ec30B61B5eD414";
const NFTcoreaddress = "0xc482105CE34364985a9c9FB003Ec30B61B5eD414";

const NFTInstance = new McpFunc.Contract(
    NFTabi.abi,
    NFTtokenAddress
);

const NFTContract = {
    NFTtokenAddress,
    NFTInstance,
    NFTcoreaddress
}

export default NFTContract;
