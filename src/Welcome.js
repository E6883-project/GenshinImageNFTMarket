import {Carousel} from 'react-bootstrap'
import image1 from './welcome1.png'

const Welcome = () =>{ return(
    <Carousel>
      <Carousel.Item>
        <img width={900} height={500} src={image1}/>
        <Carousel.Caption>
          <h3>Welcome to Genshin NFT Market!</h3>
          <p>Please click "connect wallet" to start.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )};
  
  export default Welcome;