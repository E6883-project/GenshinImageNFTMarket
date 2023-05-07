import {Row, Col, Card, Dropdown, Alert} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import Dust2image from './Dust2.png'
import Mirageimage from './Mirage.png'
import Infernoimage from './Inferno.png'
import Nukeimage from './Nuke.png'
import Overpassimage from './Overpass.png'
import Ancientimage from './Ancient.png'
import Vertigoimage from './Vertigo.png'
import trainimage from './Train.png'


const SoldNFTs = ({highlightmarket, nft, account}) => {
    const [loading, setloading] = useState(true)
    const [soldhighlights, setsoldhighlights] = useState([])
    const [soldvalue, setsoldvalue] = useState(0)
    const [totalsoldduplicate, settotalsoldduplicate] = useState(0)
    const maptoimage = (map) =>{
        if(Number(map) === 0){
            return(Dust2image)
        }
        if(Number(map) === 1){
            return(Mirageimage)
        }
        if(Number(map) === 2){
            return(Infernoimage)
        }
        if(Number(map) === 3){
            return(Nukeimage)
        }
        if(Number(map) === 4){
            return(Overpassimage)
        }
        if(Number(map) === 5){
            return(Ancientimage)
        }
        if(Number(map) === 6){
            return(Vertigoimage)
        }
        if(Number(map) === 7){
            return(trainimage)
        }
    }

    const classificationnum = (classnum) =>{
        if(Number(classnum) === 0){
            return("Triple Kill")
        }
        if(Number(classnum) === 1){
            return("Quadra Kill")
        }
        if(Number(classnum) === 2){
            return("Penta Kill")
        }
        if(Number(classnum) === 3){
            return("1v1")
        }
        if(Number(classnum) === 4){
            return("1v2")
        }
        if(Number(classnum) === 5){
            return("1v3")
        }
        if(Number(classnum) === 6){
            return("1v4")
        }
        if(Number(classnum) === 7){
            return("1v5")
        }
    }
    const playernumtostr = (player) =>{
        if(player === 0){
            return("Terrorist No.1")
        }
        if(player === 1){
            return("Terrorist No.2")
        }
        if(player ===2){
            return("Terrorist No.3")
        }
        if(player ===3){
            return("Terrorist No.4")
        }
        if(player ===4){
            return("Terrorist No.5")
        }
        if(player ===5){
            return("Counter-strike No.1")
        }
        if(player ===6){
            return("Counter-strike No.2")
        }
        if(player ===7){
            return("Counter-strike No.3")
        }
        if(player ===8){
            return("Counter-strike No.4")
        }
        if(player ===9){
            return("Counter-strike No.5")
        }
    }


    const loadmysolds = async () =>{
        const itemCount = await highlightmarket.itemCount()
        const totalsold = await highlightmarket.earnmoney(account)
        const earnnum = Number(ethers.utils.formatEther(totalsold.toString()))
        let soldhighlights = []
        let soldvalue = 0
        for (let i = 1; i <= itemCount; i++){
            let sellerslist = await highlightmarket.sellerall(i,account)
            if(sellerslist){
                const highlight = await highlightmarket.items(i)
                const uri = await nft.tokenURI(highlight.token_id)
                const response = await fetch(uri)
                const metadata = await response.json()
                const totalPrice = await highlightmarket.sellertotalprice(i,account)
                const sellerprice = await highlightmarket.sellerpriceall(i,account)
                let highlightinfo = {
                    TotalPrice: totalPrice,
                    price: sellerprice,
                    highlightID: highlight.highlight_id,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                    demouri: highlight.demo_url,
                    class: highlight.class,
                    csgomap: highlight.csgo_map,
                    roundnum: Number(highlight.round_num),
                    playernum: highlight.player_num,
                    mostnum: Number(highlight.most_sold)+1
                }
                soldhighlights.push(highlightinfo)
                soldvalue = soldvalue + Number(ethers.utils.formatEther(sellerprice.toString()))
            }
        }
        setloading(false)
        setsoldhighlights(soldhighlights)
        setsoldvalue(soldvalue)
        settotalsoldduplicate(earnnum)
    }
    useEffect(() => {
        loadmysolds()
    },[])

    if(loading) return (
        <main style={{padding: "1rem 0"}}>
            <h2>Loading...</h2>
            <p>Have a good time!</p>
        </main>
    )
    return (
        <div className="flex justify-center">
            {
                soldhighlights.length > 0 ?
                <div className='px-5 py-3 container'>
                    <h2>Your sold NFTs:</h2>
                    <Alert key={"info"} variant={"info"}>
                    If you sell a NFT more than once, the card will just show the return of the last transaction.
                    </Alert>
                    <h>Total returns (not including duplicated NFTs): {soldvalue} ETH</h>
                    <p>Total returns (including duplicated NFTs): {totalsoldduplicate} ETH</p>
                    <Row xs={1} md={2} lg={4} className="g-4 py-4">
                        {
                            soldhighlights.map((highlight, idx) =>(
                                <Col key={idx} className="overflow-hidden">
                                    <Card>
                                        <Card.Img variant='top' src={highlight.image} />
                                        <Card.Body color='secondary'>
                                        <Card.Text>Name: {highlight.name}</Card.Text>
                                        <Dropdown drop='up'>
                                            <Dropdown.Toggle variant="info" id="dropdown-basic">
                                                More details
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>Demo URL: {highlight.demouri}</Dropdown.Item>
                                                <Dropdown.Item>Description: {highlight.description}</Dropdown.Item>
                                                <Dropdown.Item>Classification: {classificationnum(highlight.class)}</Dropdown.Item>
                                                <Dropdown.Item>map: <img src={maptoimage(highlight.csgomap)} width='210' height='30' className='' alt='' /></Dropdown.Item>
                                                <Dropdown.Item >Round: {highlight.roundnum}</Dropdown.Item>
                                                <Dropdown.Item >Player: {playernumtostr(highlight.playernum)}</Dropdown.Item>
                                                <Dropdown.Item>Inventory(from original owner): {highlight.mostnum}</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        </Card.Body>
                                        <Card.Footer>{ethers.utils.formatEther(highlight.TotalPrice.toString())} ETH - Received {ethers.utils.formatEther(highlight.price.toString())} ETH</Card.Footer>
                                    </Card>
                                </Col>
                            )
                            )
                        }
                    </Row>
                </div>
                :(
                    <main style={{padding: "1rem 0"}}>
                        <h2>No sold NFTs</h2>
                    </main>
                )
            }
        </div>
    )
}



export default SoldNFTs;