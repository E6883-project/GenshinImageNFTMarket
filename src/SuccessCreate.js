import {Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'

const SuccessCreate = () =>{
return(
<main style={{padding:"1rem 0"}}>
    <h2 bsSize="lg">Thank you for creating/selling your NFT</h2>
    <p>Please confirm the transactions in your wallet. </p>
    <p>Go to the Home page to see your NFT.</p>
    <Button varient='primary' size='lg' as={Link} to="/">
        Home
    </Button>
</main>
)
}

export default SuccessCreate;