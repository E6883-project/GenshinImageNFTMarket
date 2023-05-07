import Mcp from "mcp.js"

const Highlightabi = require("./Huygens_contractsData/HighlightMarket.json")

const McpFunc = new Mcp();
McpFunc.Contract.setProvider("http://18.182.45.18:8765/");

const Highlighttokenaddress = "0x94f470dAE66DcCfE336eE1A7C5521fE07E6a7AA1";
const Highlightcoreaddress = "0x94f470dAE66DcCfE336eE1A7C5521fE07E6a7AA1";


const highlightmarketInstance = new McpFunc.Contract(
    Highlightabi.abi,
    Highlighttokenaddress
)

const HighlightContract = {
    Highlighttokenaddress,
    highlightmarketInstance,
    Highlightcoreaddress
}

export default HighlightContract;
