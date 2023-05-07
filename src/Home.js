import {Row, Col, Card, Button, Dropdown, Modal, Alert} from 'react-bootstrap'
import {ethers} from 'ethers'
import {useState, useEffect} from 'react'
import Nohighlights from './Nohighlight'
import Dust2image from './Dust2.png'
import Mirageimage from './Mirage.png'
import Infernoimage from './Inferno.png'
import Nukeimage from './Nuke.png'
import Overpassimage from './Overpass.png'
import Ancientimage from './Ancient.png'
import Vertigoimage from './Vertigo.png'
import trainimage from './Train.png'

const Home = ({highlightmarket,nft}) =>{
    const [highlights, sethighlights] = useState([])
    const [loading, setloading] = useState(true)
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


    const loadhighlight = async () =>{
        const itemCount = await highlightmarket.itemCount()
        let highlights = []
        let modalbool = []
        for(let i = 1; i <= itemCount; i++){
            const withdrawornot = await highlightmarket.withdrawornot(i)
            if(!withdrawornot)
            {const highlight = await highlightmarket.items(i);
            if(!highlight.sold){
                const uri = await nft.tokenURI(highlight.token_id)
                const response = await fetch(uri)
                const metadata = await response.json()
                const totalPrice = await highlightmarket.gettotalprice(highlight.highlight_id)
                highlights.push(
                    {
                        Price: totalPrice,
                        highlightid: highlight.highlight_id,
                        seller: highlight.seller,
                        name: metadata.name,
                        description: metadata.description,
                        image: metadata.image,
                        csgomap: highlight.csgo_map,
                        class: highlight.class,
                        demouri: highlight.demo_url,
                        roundnum: Number(highlight.round_num),
                        playernum: highlight.player_num,
                        mostnum: Number(highlight.most_sold)+1
                    }
                )
                modalbool.push(false)
            }}
        }
        sethighlights(highlights)
        setloading(false)
    }
    const buymarkethighlight = async (highlight)=>{
        await (await highlightmarket.buyhighlight(highlight.highlightid, {value: highlight.Price})).wait()
        loadhighlight()
    }
    useEffect(() => {
        loadhighlight()
    },[])


    if(loading) return (
        <main style={{padding: "1rem 0"}}>
            <h2>Loading...</h2>
            <p>Have a good time!</p>
        </main>
    )
    return (
        <div className='flex justify-center'>
            <Alert key={"primary"} variant={"primary"}>
            If you want to disconnect from you account, please open your wallet and click on "disconnect", then tap the upper left corner of the navigation bar to return to the initial page.
                            </Alert>
            {
                highlights.length > 0 ?
                    <div className='px-5 container'>
                        <Row xs={1} md={2} lg={4} className='g-4 py-5'>
                            {highlights.map ( (highlight, idx) => (
                                    <Col key={idx} className='overflow-hidden'>
                                        <Card>
                                        <Card.Img variant='top' src={highlight.image} />
                                            <Card.Body color='secondary'>
                                                <Card.Title>
                                                    Name: {highlight.name}
                                                </Card.Title>
                                                <Card.Text>
                                                    Description: {highlight.description}
                                                </Card.Text>
                                                <Card.Text>
                                                    Classification: {classificationnum(highlight.class)}
                                                </Card.Text>
                                                <Card.Text>
                                                    map: <img src={maptoimage(highlight.csgomap)} width='210' height='30' className='' alt='' />
                                                </Card.Text>
                                                <Dropdown drop='up'>
                                                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                                                        More details
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item >Demo URL: {highlight.demouri}</Dropdown.Item>
                                                        <Dropdown.Item >Round: {highlight.roundnum}</Dropdown.Item>
                                                        <Dropdown.Item >Player: {playernumtostr(highlight.playernum)}</Dropdown.Item>
                                                        <Dropdown.Item>Inventory(from original owner): {highlight.mostnum}</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Card.Body>
                                            <Card.Footer>
                                                <div className='d-grid'>
                                                    <Button onClick={() => buymarkethighlight((highlight))} variant="primary">
                                                    Buy for {ethers.utils.formatEther(highlight.Price.toString())} ETH
                                                    </Button>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                            
                            )

                                )
                            }
                            
                        </Row>
                    </div>
                : (
                    <main style={{padding:"1rem 0"}}>
                        <h2 bsSize="lg">No NFT is being sold.</h2>
                        <Nohighlights />
                    </main>
                )
            }
        </div>
    );
}



export default Home;