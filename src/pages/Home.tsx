import { Button, Container } from '@mui/material'
import { Link } from 'react-router-dom'

type Props = {}

const Home = (props: Props) => {
  return (
    <Container>
      Home page
      <Button>
        <Link to="/employee">Employee</Link>
      </Button>
    </Container>
  )
}

export default Home 