import {Carousel} from 'react-bootstrap'
import image4 from './welcome6.png'
import image5 from './welcome5.png'
import image6 from './welcome4.png'

const Nohighlights = () =>{ return(
    <Carousel>
      <Carousel.Item>
        <img width={1000} height={500} src={image4}/>
        <Carousel.Caption>
          <h3>Create your own NFT!</h3>
          <p>Click "Sell your highlight" then choose whether you want to create a new NFT or resell your highlight. Enjoy it!</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img width={1000} height={500} src={image5}/>
        <Carousel.Caption>
          <h3>Highlight type: multi-kills</h3>
          <p>If you kill more than three enemies in one round, create your NFT and sell your highlight!</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img width={900} height={500} src={image6}/>
        <Carousel.Caption>
          <h3>Highlight type: endgame</h3>
          <p>If you complete an endgame successfully, upload your highlight and let everybody know your strong strength!</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )};
  
  export default Nohighlights;