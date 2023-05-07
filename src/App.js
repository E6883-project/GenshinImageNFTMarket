import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Navigation from './Navbar';
import Welcome from './Welcome';
import {ethers} from "ethers";
import {useState} from "react";
import NFTaddress  from "./contractsData/NFT_CSGO-address.json";
import Highlightaddress from "./contractsData/HighlightMarket-address.json";
import NFTAbi from "./contractsData/NFT_CSGO.json";
import HighlightAbi from "./contractsData/HighlightMarket.json";
import Home from './Home';
import Create from "./Create";
import Resell from "./Resell";
import Mysellinghighlights from "./mysellinghighlights";
import Mypurchases from "./Mypurchases"
import Aboutthisproject from "./Aboutthisproject";
import SuccessCreate from './SuccessCreate';
import { Spinner } from 'react-bootstrap';
import SoldNFTs from './SoldNFTs';
import Sellpurchases from './Sellpurchases';
import NFTcontract from './NFTcontract';
import HighlightContract from './HighlightContract';




 
function App() {
  const [loading, setloading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setnft] = useState({})
  const [highlightmarket, sethighlightmarket] = useState({})


  const loadaccount = async () => {
    /*
    const connection = window["aleereum"].connect();
    const provider = window["aleereum"]
    if(provider.isConnected === true){
      setAccount(provider.account)
      const highlightmarket = HighlightContract.highlightmarketInstance.methods
      sethighlightmarket(highlightmarket)
      const nft = NFTcontract.NFTInstance.methods
      setnft(nft)
      setloading(false)
    }
    else{
      setAccount(null)
      setloading(true)
    }
    */
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const highlightmarket = new ethers.Contract(Highlightaddress.address, HighlightAbi.abi, signer)
    sethighlightmarket(highlightmarket)
    const nft = new ethers.Contract(NFTaddress.address, NFTAbi.abi, signer)
    setnft(nft)
    setloading(false)
    
  }

  return (
    <BrowserRouter>
      <div className='App'>
      <Navigation loadaccount={loadaccount} account={account}/>
      {loading ? (
        <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
          <Welcome />
          <Spinner animation="border" style={{display: 'flex'}} />
          <p>Welcome to CSGO highlights NFT market!<br/>
          Please click "connect wallet".<br/>
            Awaiting wallet connection...</p>
        </div>
      ) : (
        <Routes>
        <Route path="/" element={
          <Home highlightmarket={highlightmarket} nft={nft}/>
        } />
        <Route path="/create" element={
          <Create nft={nft} highlightmarket={highlightmarket}/>
        }/>
        <Route path="/resell" element={
          <Resell nft={nft} highlightmarket={highlightmarket} account={account}/>
        }/>
        <Route path="/sell-your-purchase" element={
          <Sellpurchases nft={nft} highlightmarket={highlightmarket} account={account} />
        }/>
        <Route path="/my-selling-highlights" element={
          <Mysellinghighlights highlightmarket={highlightmarket} nft={nft} account={account} />
        }/>
        <Route path="/sold-highlights" element={
          <SoldNFTs highlightmarket={highlightmarket} nft={nft} account={account} />
        } />
        <Route path="/my-purchases" element={
          <Mypurchases highlightmarket={highlightmarket} nft={nft} account={account}  />
        }/>
        <Route path="/about-this-project" element={
          <Aboutthisproject />
        } />
        <Route path="/success-create" element={
          <SuccessCreate />
        } />
      </Routes>
      )}
      </div>
    </BrowserRouter>
  );
}

export default App;
