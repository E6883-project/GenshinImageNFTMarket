import {Row, Form, Button, Modal, Image, FloatingLabel, Alert} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import {create as ipfsHttpClient} from 'ipfs-http-client'
import {Link} from 'react-router-dom'
import Dust2image from './Dust2.png'
import Mirageimage from './Mirage.png'
import Infernoimage from './Inferno.png'
import Nukeimage from './Nuke.png'
import Overpassimage from './Overpass.png'
import Ancientimage from './Ancient.png'
import Vertigoimage from './Vertigo.png'
import trainimage from './Train.png'
import Dust23kimage from './fronts/Dust23k.png'
import Dust24kimage from './fronts/Dust24k.png'
import Dust25kimage from './fronts/Dust25k.png'
import Dust21v1image from './fronts/Dust21v1.png'
import Dust21v2image from './fronts/Dust21v2.png'
import Dust21v3image from './fronts/Dust21v3.png'
import Dust21v4image from './fronts/Dust21v4.png'
import Dust21v5image from './fronts/Dust21v5.png'
import Mirage3kimage from './fronts/Mirage3k.png'
import Mirage4kimage from './fronts/Mirage4k.png'
import Mirage5kimage from './fronts/Mirage5k.png'
import Mirage1v1image from './fronts/Mirage1v1.png'
import Mirage1v2image from './fronts/Mirage1v2.png'
import Mirage1v3image from './fronts/Mirage1v3.png'
import Mirage1v4image from './fronts/Mirage1v4.png'
import Mirage1v5image from './fronts/Mirage1v5.png'
import Inferno3kimage from './fronts/Inferno3k.png'
import Inferno4kimage from './fronts/Inferno4k.png'
import Inferno5kimage from './fronts/Inferno5k.png'
import Inferno1v1image from './fronts/Inferno1v1.png'
import Inferno1v2image from './fronts/Inferno1v2.png'
import Inferno1v3image from './fronts/Inferno1v3.png'
import Inferno1v4image from './fronts/Inferno1v4.png'
import Inferno1v5image from './fronts/Inferno1v5.png'
import Nuke3kimage from './fronts/Nuke3k.png'
import Nuke4kimage from './fronts/Nuke4k.png'
import Nuke5kimage from './fronts/Nuke5k.png'
import Nuke1v1image from './fronts/Nuke1v1.png'
import Nuke1v2image from './fronts/Nuke1v2.png'
import Nuke1v3image from './fronts/Nuke1v3.png'
import Nuke1v4image from './fronts/Nuke1v4.png'
import Nuke1v5image from './fronts/Nuke1v5.png'
import Overpass3kimage from './fronts/Overpass3k.png'
import Overpass4kimage from './fronts/Overpass4k.png'
import Overpass5kimage from './fronts/Overpass5k.png'
import Overpass1v1image from './fronts/Overpass1v1.png'
import Overpass1v2image from './fronts/Overpass1v2.png'
import Overpass1v3image from './fronts/Overpass1v3.png'
import Overpass1v4image from './fronts/Overpass1v4.png'
import Overpass1v5image from './fronts/Overpass1v5.png'
import Ancient3kimage from './fronts/Ancient3k.png'
import Ancient4kimage from './fronts/Ancient4k.png'
import Ancient5kimage from './fronts/Ancient5k.png'
import Ancient1v1image from './fronts/Ancient1v1.png'
import Ancient1v2image from './fronts/Ancient1v2.png'
import Ancient1v3image from './fronts/Ancient1v3.png'
import Ancient1v4image from './fronts/Ancient1v4.png'
import Ancient1v5image from './fronts/Ancient1v5.png'
import Vertigo3kimage from './fronts/Vertigo3k.png'
import Vertigo4kimage from './fronts/Vertigo4k.png'
import Vertigo5kimage from './fronts/Vertigo5k.png'
import Vertigo1v1image from './fronts/Vertigo1v1.png'
import Vertigo1v2image from './fronts/Vertigo1v2.png'
import Vertigo1v3image from './fronts/Vertigo1v3.png'
import Vertigo1v4image from './fronts/Vertigo1v4.png'
import Vertigo1v5image from './fronts/Vertigo1v5.png'
import Train3kimage from './fronts/Train3k.png'
import Train4kimage from './fronts/Train4k.png'
import Train5kimage from './fronts/Train5k.png'
import Train1v1image from './fronts/Train1v1.png'
import Train1v2image from './fronts/Train1v2.png'
import Train1v3image from './fronts/Train1v3.png'
import Train1v4image from './fronts/Train1v4.png'
import Train1v5image from './fronts/Train1v5.png'

function isInteger(obj) {
    return obj%1 === 0
   }

const client = ipfsHttpClient('http://ipfs.infura.io:5001/api/v0')

const Resell = ({ highlightmarket, nft, account}) => {
    const [image, setimage] = useState('')
    const [price, setprice] = useState(null)
    const [name, setname] = useState('')
    const [description, setdescription] = useState('')
    const [mostsold, setmostsold] = useState(null)
    const [classification, setclassification] = useState('Triple Kill')
    const [map, setmap] = useState('Dust2')
    const [demouri, setdemouri] = useState('')
    const [round, setround] = useState(null)
    const [player, setplayer] = useState('Terrorist No.1')
    const [uploadornot, setuploadornot] = useState(false)
    const [notfull, setnotfull] = useState(false)
    const handlenotfullClose = () => {
        setnotfull(false)
        setintermit(false)}
    const handlenotfullShow = () => setnotfull(true)
    const [pricenegative, setpricenegative] = useState(false)
    const handlepriceClose = () => {
        setpricenegative(false)
        setintermit(false)}
    const handlepriceShow = () => setpricenegative(true)
    const [roundwrong, setroundwrong] = useState(false)
    const handleroundClose = () => {
        setroundwrong(false)
        setintermit(false)}
    const handleroundShow = () => setroundwrong(true)

    const [appear, setappear] = useState(null)
    const [appearerror, setappearerror] = useState(false)
    const handleappearerrorClose = () => {
        setappearerror(false)
        setintermit(false)}
    const handleappearerrorShow = () => setappearerror(true)
    const [oldowner, setoldowner] = useState(null)
    const [isowner, setisowner] = useState(false)
    const handleisownerClose = () => {
        setisowner(false)
        setintermit(false)}
    const handleisowenrShow = () => setisowner(true)
    const [soldornot, setsoldornot] = useState(null)
    const [notsold, setnotsold] = useState(false)
    const handlenotsoldClose = () => {
        setnotsold(false)
        setintermit(false)}
    const handlenotsoldShow = () => setnotsold(true)
    const [lefttimes, setlefttimes] = useState(null)
    const [cansold, setcansold] = useState(false)
    const handlecansoldClose = () => {
        setcansold(false)
        setintermit(false)}
    const handlecansoldShow = () => setcansold(true)

    const maptoimage = (map) =>{
        if(map === "Dust2"){
            return(Dust2image)
        }
        if(map === "Mirage"){
            return(Mirageimage)
        }
        if(map === "Inferno"){
            return(Infernoimage)
        }
        if(map === "Nuke"){
            return(Nukeimage)
        }
        if(map === "Overpass"){
            return(Overpassimage)
        }
        if(map === "Ancient"){
            return(Ancientimage)
        }
        if(map === "Vertigo"){
            return(Vertigoimage)
        }
        if(map === "Train"){
            return(trainimage)
        }
    }
    
    const uploadtoIPFS = async (event) =>{
        event.preventDefault()
        const file = event.target.files[0]
        if(typeof file !== 'undefined'){
            try{
                const result = await client.add(file)
                setimage(`http://ipfs.infura.io/ipfs/${result.path}`)
                setuploadornot(true)
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }
        }
    }

    const createNFT = async () => {
        if(!image || !price || !name || !description || !demouri || !round) return
        try{
            const result = await client.add(JSON.stringify({image, name, description}))
            mintThenList(result)
        } catch (error) {
            console.log("ipfs url upload error: ", error)
        }
    }

    const mintThenList = async (result) =>{
        const uri = `http://ipfs.infura.io/ipfs/${result.path}`
        await (await nft.mint(uri)).wait()
        const id = await nft.tokenCount()
        await (await nft.setApprovalForAll(highlightmarket.address, true)).wait()
        const listingPrice = ethers.utils.parseEther(price.toString())
        await (await highlightmarket.resellhighlight(nft.address, id, listingPrice, getclassint(classification), getmapint(map), demouri, round, getplayerint(player))).wait()
    }

    const getclassint = async (classification) => {
        if(classification === '' || classification === 'Triple Kill'){
            return 0
        }
        if(classification === 'Quadra Kill'){
            return 1
        }
        if(classification === 'Penta Kill'){
            return 2
        }
        if(classification === '1v1'){
            return 3
        }
        if(classification === '1v2'){
            return 4
        }
        if(classification === '1v3'){
            return 5
        }
        if(classification === '1v4'){
            return 6
        }
        if(classification === '1v5'){
            return 7
        }
      }
    const getmapint = async (map) =>{
        if(map === '' || map === 'Dust2'){
            return 0
        }
        if(map === 'Mirage'){
            return 1
        }
        if(map === 'Inferno'){
            return 2
        }
        if(map === 'Nuke'){
            return 3
        }
        if(map === 'Overpass'){
            return 4
        }
        if(map === 'Ancient'){
            return 5
        }
        if(map === 'Vertigo'){
            return 6
        }
        if(map === 'Train'){
            return 7
        }
    }

    const getplayerint = async (player) =>{
        if(player === '' || player === 'Terrorist No.1'){
            return 0
        }
        if(player === 'Terrorist No.2'){
            return 1
        }
        if(player === 'Terrorist No.3'){
            return 2
        }
        if(player === 'Terrorist No.4'){
            return 3
        }
        if(player === 'Terrorist No.5'){
            return 4
        }
        if(player === 'Counter-strike No.1'){
            return 5
        }
        if(player === 'Counter-strike No.2'){
            return 6
        }
        if(player === 'Counter-strike No.3'){
            return 7
        }
        if(player === 'Counter-strike No.4'){
            return 8
        }
        if(player === 'Counter-strike No.5'){
            return 9
        }
    }

    const loadinformation = async() => {
        let appear = await highlightmarket.appear_or_not_all(classification.concat(map, demouri,String(round), player))
        let owner = await highlightmarket.owner(classification.concat(map, demouri,String(round), player))
        let soldornot = await highlightmarket.sold_or_not(classification.concat(map, demouri,String(round), player))
        let lefttimes = await highlightmarket.left_sells(classification.concat(map, demouri,String(round), player))
        setappear(appear)
        setoldowner(owner)
        setsoldornot(soldornot)
        setlefttimes(lefttimes)

        if(!appear || owner.toLowerCase() !== account || !soldornot || lefttimes<1){
            setShow(false)
        }
    }

    const[intermit, setintermit] = useState(false)
    const handleintermitClose = () => setintermit(false)
    const handleintermitShow = () => {
        loadinformation()
        setintermit(true)}

    const [show, setShow] = useState(false)

    const handleClose = () => 
    {setShow(false)
    setintermit(false)}
    const handleShow = () =>{
        loadinformation()
        if(!price || !name || !description || !demouri || !round) {
            handlenotfullShow()
            return}
        if(price <= 0){
            handlepriceShow()
            return
        }
        if(round <1 || round >30 || !isInteger(round)){
            handleroundShow()
            return
        }
        loadinformation()
        if(!appear){
            handleappearerrorShow()
            return
        }
        if(oldowner.toLowerCase() !== account)
        {
            handleisowenrShow()
            return
        }
        if(!soldornot){
            handlenotsoldShow()
            return
        }
        if(lefttimes < 1){
            handlecansoldShow()
            return
        }

        if(!uploadornot){
            if(map==="Dust2" && classification ==="Triple Kill"){
                setimage(Dust23kimage)
            }
            if(map==="Dust2" && classification ==="Quadra Kill"){
                setimage(Dust24kimage)
            }
            if(map==="Dust2" && classification ==="Penta Kill"){
                setimage(Dust25kimage)
            }
            if(map==="Dust2" && classification ==="1v1"){
                setimage(Dust21v1image)
            }
            if(map==="Dust2" && classification ==="1v2"){
                setimage(Dust21v2image)
            }
            if(map==="Dust2" && classification ==="1v3"){
                setimage(Dust21v3image)
            }
            if(map==="Dust2" && classification ==="1v4"){
                setimage(Dust21v4image)
            }
            if(map==="Dust2" && classification ==="1v5"){
                setimage(Dust21v5image)
            }
            if(map==="Mirage" && classification === "Triple Kill"){
                setimage(Mirage3kimage)
            }
            if(map==="Mirage" && classification === "Quadra Kill"){
                setimage(Mirage4kimage)
            }
            if(map==="Mirage" && classification === "Penta Kill"){
                setimage(Mirage5kimage)
            }
            if(map==="Mirage" && classification === "1v1"){
                setimage(Mirage1v1image)
            }
            if(map==="Mirage" && classification === "1v2"){
                setimage(Mirage1v2image)
            }
            if(map==="Mirage" && classification === "1v3"){
                setimage(Mirage1v3image)
            }
            if(map==="Mirage" && classification === "1v4"){
                setimage(Mirage1v4image)
            }
            if(map==="Mirage" && classification === "1v5"){
                setimage(Mirage1v5image)
            }
            if(map==="Inferno" && classification === "Triple Kill"){
                setimage(Inferno3kimage)
            }
            if(map==="Inferno" && classification === "Quadra Kill"){
                setimage(Inferno4kimage)
            }
            if(map==="Inferno" && classification === "Penta Kill"){
                setimage(Inferno5kimage)
            }
            if(map==="Inferno" && classification === "1v1"){
                setimage(Inferno1v1image)
            }
            if(map==="Inferno" && classification === "1v2"){
                setimage(Inferno1v2image)
            }
            if(map==="Inferno" && classification === "1v3"){
                setimage(Inferno1v3image)
            }
            if(map==="Inferno" && classification === "1v4"){
                setimage(Inferno1v4image)
            }
            if(map==="Inferno" && classification === "1v5"){
                setimage(Inferno1v5image)
            }
            if(map==="Nuke" && classification === "Triple Kill"){
                setimage(Nuke3kimage)
            }
            if(map==="Nuke" && classification === "Quadra Kill"){
                setimage(Nuke4kimage)
            }
            if(map==="Nuke" && classification === "Penta Kill"){
                setimage(Nuke5kimage)
            }
            if(map==="Nuke" && classification === "1v1"){
                setimage(Nuke1v1image)
            }
            if(map==="Nuke" && classification === "1v2"){
                setimage(Nuke1v2image)
            }
            if(map==="Nuke" && classification === "1v3"){
                setimage(Nuke1v3image)
            }
            if(map==="Nuke" && classification === "1v4"){
                setimage(Nuke1v4image)
            }
            if(map==="Nuke" && classification === "1v5"){
                setimage(Nuke1v5image)
            }
            if(map==="Overpass" && classification === "Triple Kill"){
                setimage(Overpass3kimage)
            }
            if(map==="Overpass" && classification === "Quadra Kill"){
                setimage(Overpass4kimage)
            }
            if(map==="Overpass" && classification === "Penta Kill"){
                setimage(Overpass5kimage)
            }
            if(map==="Overpass" && classification === "1v1"){
                setimage(Overpass1v1image)
            }
            if(map==="Overpass" && classification === "1v2"){
                setimage(Overpass1v2image)
            }
            if(map==="Overpass" && classification === "1v3"){
                setimage(Overpass1v3image)
            }
            if(map==="Overpass" && classification === "1v4"){
                setimage(Overpass1v4image)
            }
            if(map==="Overpass" && classification === "1v5"){
                setimage(Overpass1v5image)
            }
            if(map==="Ancient" && classification === "Triple Kill"){
                setimage(Ancient3kimage)
            }
            if(map==="Ancient" && classification === "Quadra Kill"){
                setimage(Ancient4kimage)
            }
            if(map==="Ancient" && classification === "Penta Kill"){
                setimage(Ancient5kimage)
            }
            if(map==="Ancient" && classification === "1v1"){
                setimage(Ancient1v1image)
            }
            if(map==="Ancient" && classification === "1v2"){
                setimage(Ancient1v2image)
            }
            if(map==="Ancient" && classification === "1v3"){
                setimage(Ancient1v3image)
            }
            if(map==="Ancient" && classification === "1v4"){
                setimage(Ancient1v4image)
            }
            if(map==="Ancient" && classification === "1v5"){
                setimage(Ancient1v5image)
            }
            if(map==="Vertigo" && classification === "Triple Kill"){
                setimage(Vertigo3kimage)
            }
            if(map==="Vertigo" && classification === "Quadra Kill"){
                setimage(Vertigo4kimage)
            }
            if(map==="Vertigo" && classification === "Penta Kill"){
                setimage(Vertigo5kimage)
            }
            if(map==="Vertigo" && classification === "1v1"){
                setimage(Vertigo1v1image)
            }
            if(map==="Vertigo" && classification === "1v2"){
                setimage(Vertigo1v2image)
            }
            if(map==="Vertigo" && classification === "1v3"){
                setimage(Vertigo1v3image)
            }
            if(map==="Vertigo" && classification === "1v4"){
                setimage(Vertigo1v4image)
            }
            if(map==="Vertigo" && classification === "1v5"){
                setimage(Vertigo1v5image)
            }
            if(map==="Train" && classification === "Triple Kill"){
                setimage(Train3kimage)
            }
            if(map==="Train" && classification === "Quadra Kill"){
                setimage(Train4kimage)
            }
            if(map==="Train" && classification === "Penta Kill"){
                setimage(Train5kimage)
            }
            if(map==="Train" && classification === "1v1"){
                setimage(Train1v1image)
            }
            if(map==="Train" && classification === "1v2"){
                setimage(Train1v2image)
            }
            if(map==="Train" && classification === "1v3"){
                setimage(Train1v3image)
            }
            if(map==="Train" && classification === "1v4"){
                setimage(Train1v4image)
            }
            if(map==="Train" && classification === "1v5"){
                setimage(Train1v5image)
            }
        }
        setShow(true)};
    
    return (
        <div className='container-fluid mt-5'>
            <div className='row'>
                <main role='main' className='col-lg-12 mx-auto' style={{maxWidth: '1000px'}}>
                    <div className='content mx-auto'>
                        <Row className='g-1'>
                        <Alert key={"warning"} variant={"warning"}>
                        Please enter the information of the highlight you have created
                            </Alert>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Demo URL"
                            className="mb-3"
                        >
                            <Form.Control onChange={(e) => setdemouri(e.target.value)} type='text' placeholder="Demo URI" />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Highlight name"
                            className="mb-3"
                        >
                            <Form.Control onChange={(e) => setname(e.target.value)} type='text' placeholder="Highlight name" />
                            </FloatingLabel>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Description"
                            className="mb-3"
                        >
                            <Form.Control onChange={(e) => setdescription(e.target.value)} type='textarea' placeholder='Description' />
                            </FloatingLabel>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Classification"
                            className="mb-3"
                        >
                            <Form.Select onChange={(e) => setclassification(e.target.value)}>
                                <option value="Triple Kill">Triple Kill</option>
                                <option value="Quadra Kill">Quadra Kill</option>
                                <option value="Penta Kill">Penta Kill</option>
                                <option value="1v1">1v1</option>
                                <option value="1v2">1v2</option>
                                <option value="1v3">1v3</option>
                                <option value="1v4">1v4</option>
                                <option value="1v5">1v5</option>
                            </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Map"
                            className="mb-3"
                        >
                            <Form.Select onChange={(e) => setmap(e.target.value)}>
                                <option value="Dust2">Dust2</option>
                                <option value="Mirage">Mirage</option>
                                <option value="Inferno">Inferno</option>
                                <option value="Nuke">Nuke</option>
                                <option value="Overpass">Overpass</option>
                                <option value="Ancient">Ancient</option>
                                <option value="Vertigo">Vertigo</option>
                                <option value="Train">Train</option>
                            </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="The player of highlight"
                            className="mb-3"
                        >
                            <Form.Select onChange={(e) => setplayer(e.target.value)}>
                                <option value="Terrorist No.1">Terrorist No.1</option>
                                <option value="Terrorist No.2">Terrorist No.2</option>
                                <option value="Terrorist No.3">Terrorist No.3</option>
                                <option value="Terrorist No.4">Terrorist No.4</option>
                                <option value="Terrorist No.5">Terrorist No.5</option>
                                <option value="Counter-strike No.1">Counter-strike No.1</option>
                                <option value="Counter-strike No.2">Counter-strike No.2</option>
                                <option value="Counter-strike No.3">Counter-strike No.3</option>
                                <option value="Counter-strike No.4">Counter-strike No.4</option>
                                <option value="Counter-strike No.5">Counter-strike No.5</option>
                            </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Game round (should be in 1-30)"
                            className="mb-3"
                        >
                            <Form.Control onChange={(e) => setround(e.target.value)} type='number' placeholder='Game round (should be in 1-30)' />
                            </FloatingLabel>
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Price in ETH (should be positive)"
                            className="mb-3"
                        >
                            <Form.Control onChange={(e) => setprice(e.target.value)} type='number' placeholder='Price in ETH (should be positive)' />
                            </FloatingLabel>
                            Image: (You can choose not upload an image. If so your NFT will use the default image.)
                            <Form.Control type='file' name='file' onChange={uploadtoIPFS} />
                            <div className='d-grid px-0'>
                                <Button onClick={handleintermitShow} varient='primary'>
                                    Create NFT
                                </Button>
                                <Modal show = {intermit} onHide={handleintermitClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Click the button to see whether you can create this NFT.</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={handleShow}>
                                        Check
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                    <Modal.Title>Confirm your NFT.</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                    <p>Please confirm the information of your NFT: </p>
                                    <p>Demo URI: {demouri}</p>
                                    <p>Name: {name}</p>
                                    <p>Description: {description}</p>
                                    <p>Classification: {classification}</p>
                                    <p>Map: <img src={maptoimage(map)} width='286' height='30' className='' alt='' /></p>
                                    <p>Round: {round}</p>
                                    <p>Player: {player}</p>
                                    <p>Price: {price}</p>
                                    <p>Most admitted sold number: {mostsold}</p>
                                    Image:
                                    <Image src={image} />
                                    
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={createNFT} as={Link} to="/success-create">
                                        Confirm
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={notfull} onHide={handlenotfullClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Error</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p2>Please enter all information (only image is optional). </p2>
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="primary" onClick={handlenotfullClose}>
                                        Close
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
                                <Modal show={roundwrong} onHide={handleroundClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Error</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p2>Round should be an integer between 1 to 30.</p2>
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="primary" onClick={handleroundClose}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={appearerror} onHide={handleappearerrorClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Error</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p2>The NFT of this highlight has not been created before.</p2>
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="primary" onClick={handleappearerrorClose}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={notsold} onHide={handlenotsoldClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Error</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p2>The NFT of this highlight is selling.</p2>
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="primary" onClick={handlenotsoldClose}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={cansold} onHide={handlecansoldClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Error</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p2>The number of NFTs this highlight can be sold has reached the maximum.</p2>
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="primary" onClick={handlecansoldClose}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={isowner} onHide={handleisownerClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Error</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p2>You are not the owner of this highlight.</p2>
                                    </Modal.Body>
                                    <Modal.Footer>
                                    <Button variant="primary" onClick={handleisownerClose}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Resell;