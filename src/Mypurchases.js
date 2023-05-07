import {Row, Col, Card, Dropdown, Button, Alert} from 'react-bootstrap'
import {Link} from 'react-router-dom'
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


const Mypurchases = ({highlightmarket, nft, account}) => {
    const [loading, setloading] = useState(true)
    const [mybuyings, setmybuyings] = useState([])
    const [totalcost, settotalcost] = useState(0)
    const [totalduplicate, settotaldupilcate] = useState(0)
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

    const loadmybuyings = async () =>{
        const itemCount = await highlightmarket.itemCount()
        let mybuyings = []
        let totalcost = 0
        const spentmoney = await highlightmarket.spentmoney(account)
        const spentnum = Number(ethers.utils.formatEther(spentmoney.toString()))
        for (let i = 1; i <= itemCount; i++){
            let buyerslist = await highlightmarket.buyersall(i,account)
            if(buyerslist){
                const highlight = await highlightmarket.items(i)
                const uri = await nft.tokenURI(highlight.token_id)
                const response = await fetch(uri)
                const metadata = await response.json()
                const totalPrice = await highlightmarket.buyertotalprice(i,account)
                const buyerprice = await highlightmarket.buyerpriceall(i,account)
                let highlightinfo = {
                    TotalPrice: totalPrice,
                    price: buyerprice,
                    highlightID: highlight.highlight_id,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                    demouri: highlight.demo_url,
                    class: highlight.class,
                    csgomap: highlight.csgo_map,
                    roundnum: Number(highlight.round_num),
                    playernum: highlight.player_num
                }
                mybuyings.push(highlightinfo)
                totalcost = totalcost + Number(ethers.utils.formatEther(totalPrice.toString()))
            }
        }
        setloading(false)
        setmybuyings(mybuyings)
        settotalcost(totalcost)
        settotaldupilcate(spentnum)
    }
    
    useEffect(() => {
        loadmybuyings()
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
                mybuyings.length > 0 ?
                <div className='px-5 py-3 container'>
                    <h2>NFTs you bought:</h2>
                    <Alert key={"info"} variant={"info"}>
                    If you bought a NFT more than once, the card will just show the price of the last transaction.
                    </Alert>
                    <h>Total cost (not including duplicated NFTs): {totalcost} ETH</h>
                    <p>Total cost (including duplicated NFTs): {totalduplicate} ETH</p>
                    <Button variant='link' as={Link} to='/sell-your-purchase'>Sell the NFT your bought</Button>
                    <Row xs={1} md={2} lg={4} className="g-4 py-4">
                        {
                            mybuyings.map((highlight, idx) =>(
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
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        </Card.Body>
                                        <Card.Footer>
                                        <Card.Text >Paid {ethers.utils.formatEther(highlight.TotalPrice.toString())} ETH</Card.Text>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            )
                            )
                        }
                    </Row>
                </div>
                :(
                    <main style={{padding: "1rem 0"}}>
                        <h2>You have not bought any NFT.</h2>
                        <h2>You can go to Home page to choose an NFT and buy it.</h2>
                        <h2>Enjoy!</h2>
                        <Button varient='primary' size='lg' as={Link} to="/">
                            Home
                        </Button>
                    </main>
                )
            }
        </div>
    )
}



export default Mypurchases;