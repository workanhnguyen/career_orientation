import React, { memo } from 'react'

import './Home.scss'
import { About, Feedback, Footer, Header, Services, University } from '../../container';

function Home() {
  return (
    <div>
        <Header />
        <Services />
        <About />
        <University />
        <Footer />
    </div>
  )
}

export default memo(Home)