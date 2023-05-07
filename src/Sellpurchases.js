import {Row, Col, Card, Dropdown, Button, Modal, Form} from 'react-bootstrap'
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


const Sellpurchases = ({highlightmarket, nft, account}) => {
    const [loading, setloading] = useState(true)
    const [mybuyings, setmybuyings] = useState([])
    const [totalcost, settotalcost] = useState(0)
    const [sellid, setsellid] = useState(null)
    const [shows, setshows] = useState(false)
    const handleshowsClose = () => setshows(false)
    const handleshowsShow = (highlightID) => {
        setsellid(highlightID)
        setshows(true)}
    const [newprice, setnewprice] = useState(null)
    const [confirm, setconfirm] = useState(false)
    const handleconfirmShow = () => {
        if(newprice <= 0){
            handlepriceShow()
        }
        else{setconfirm(true)}}
    const handleconfirmClose = () => {
        setconfirm(false)
    setshows(false)}

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
        for (let i = 1; i <= itemCount; i++){
            const buyers = await highlightmarket.buyerstorage(i)
            if(buyers.toLowerCase() === account){
                const highlight = await highlightmarket.items(i)
                const uri = await nft.tokenURI(highlight.token_id)
                const response = await fetch(uri)
                const metadata = await response.json()
                const totalPrice = await highlightmarket.gettotalprice(highlight.highlight_id)
                let highlightinfo = {
                    TotalPrice: totalPrice,
                    price: highlight.price,
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
                if(highlight.sold){
                mybuyings.push(highlightinfo)
                totalcost = totalcost + Number(ethers.utils.formatEther(totalPrice.toString()))}
            }
        }
        setloading(false)
        setmybuyings(mybuyings)
        settotalcost(totalcost)
    }
    
    const [pricenegative, setpricenegative] = useState(false)
    const handlepriceClose = () => setpricenegative(false)
    const handlepriceShow = () => setpricenegative(true)

    const resellNFT = async () => {
        if(newprice <= 0){
            handlepriceShow()
            return
        }
        resellpurchases(sellid, newprice)
    }

    const resellpurchases = async (sellid, newprice) =>{
        await (await nft.setApprovalForAll(highlightmarket.address, true)).wait()
        const listingPrice = ethers.utils.parseEther(newprice.toString())
        await (await highlightmarket.sellboughts(sellid, listingPrice)).wait()
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
                    <h2>Choose the NFT you want to sell:</h2>
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
                                        <Button onClick={() => handleshowsShow(highlight.highlightID)}>Sell this NFT</Button>
                                        <Modal show={shows} onHide={handleshowsClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Please set the price of this NFT.</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form.Control onChange={(e) => setnewprice(e.target.value)} type='number' placeholder='Price in ETH (should be positive)' />
                                        </Modal.Body>
                                        <Modal.Footer>
                                        <Button variant="secondary" onClick={handleshowsClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleconfirmShow}>
                                            Confirm
                                        </Button>
                                        </Modal.Footer>
                                        </Modal>
                                        <Modal show={confirm} onHide={handleconfirmClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirm the new price.</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <p>{newprice} ETH</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                            <Button variant="secondary" onClick={handleconfirmClose}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={() => resellNFT()} as={Link} to="/success-create">
                                                Confirm
                                            </Button>
                                            </Modal.Footer>

                                        </Modal>
                                        <Modal show={pricenegative} onHide={handlepriceClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Error</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <p2>Price should be positive.</p2>
                                            </Modal.Body>
                                            <Modal.Footer>
                                            <Button variant="primary" onClick={handlepriceClose}>
                                                Close
                                            </Button>
                                            </Modal.Footer>
                                        </Modal>
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
                        <h2>You have not bought NFT that can be sold.</h2>
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



export default Sellpurchases;