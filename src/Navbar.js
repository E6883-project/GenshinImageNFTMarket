import {Link} from 'react-router-dom'
import {Navbar, Nav, Button, Container, NavDropdown} from 'react-bootstrap'
import market from './market.png'
import MenuItem from "@material-ui/core/MenuItem";
import {useState} from 'react'
import sound from "./flashbang.mp3"

const Navigation = ({ loadaccount, account}) => {
    const [audio] = useState(new Audio(sound))
    const [player, setplayer] = useState(false)
    const start = () => {
        if(!player){
            audio.play()
            setplayer(true)
        }
        else{
            audio.pause()
            setplayer(false)
        }
      }
    return (
        <Navbar expand="lg" bg="info">
            <Container>
                <Navbar.Brand href = "http://localhost:3000/">
                    <img src={market} width='60' height='43' className='' alt='' />
                    &nbsp; CSGO Highlights NFT Market
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='me-auto'>
                        <Nav.Link as={Link} to="/">Market Home</Nav.Link>
                        <NavDropdown eventKey={3} title="Sell your highlight" id="basic-nav-dropdown">
                            <Nav.Link as={Link} to="/create">Create your NFT for a new highlight</Nav.Link>
                            <MenuItem divider />
                            <Nav.Link as={Link} to="/resell">Create your NFT for your old highlight</Nav.Link>
                            <MenuItem divider />
                            <Nav.Link as={Link} to="/sell-your-purchase">Sell the NFT that you bought</Nav.Link>
                        </NavDropdown>
                        <NavDropdown eventKey={4} title="My sellings" id="basic-nav-dropdown-2">
                            <Nav.Link as={Link} to="/my-selling-highlights">NFTs for sale</Nav.Link>
                            <Nav.Link as={Link} to="/sold-highlights">NFTs sold</Nav.Link>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/my-purchases">My purchases</Nav.Link>
                        <Nav.Link as={Link} to="/about-this-project">About this project</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`http://etherscan.io/address/${account}`}>
                                <Button variant="success">
                                    {account.slice(0,5) + '...' + account.slice(37,42)}
                                </Button>
                            </Nav.Link>
                        ) : (
                            <Nav.Link>
                            <Button onClick={loadaccount} varient="outline-light" active>Connect wallet</Button>
                            </Nav.Link>
                        )
                        }
                    </Nav>
                    <Nav>
                    <Button variant='light' onClick={start}>🎵</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;