import columbia from './columbia.png'
import {Alert, Button} from 'react-bootstrap'

const Aboutthisproject = () => {
    return(
        <div>
            <Alert key={'success'} variant={'success'}>
            Thank you for playing with my NFT market!
            </Alert>
            <a href={'https://www.ee.columbia.edu/'}><img src={columbia} width='250' height='216' /></a>
            <Alert key={'light'} variant={'light'}>
            Project: CSGO Highlights NFT Market: A Decentralized Application Based on Blockchain
            </Alert>
            <Alert key={'light'} variant={'light'}>
            Final Project of ELEN E6883 at Columbia University
            </Alert>
            <Alert key={'light'} variant={'light'}>
            Author: Yifan Shao
            </Alert>
            <Alert key={'light'} variant={'light'}>
            UNI: ys3349
            </Alert>
            <Alert key={'light'} variant={'light'}>
            email: ys3349@columbia.edu
            </Alert>
            <Alert key={'light'} variant={'light'}>
            Github:<Button variant='link' href="https://github.com/Yifshao/CSGOHighlightsNFTMarket">https://github.com/Yifshao/CSGOHighlightsNFTMarket</Button>
            </Alert>
            <Alert key={'info'} variant={'info'}>
            Please refer to my report and demo video for more details
            </Alert>
        </div>
    )
}

export default Aboutthisproject;