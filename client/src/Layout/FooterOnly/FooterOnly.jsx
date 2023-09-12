import React, { memo } from 'react'

import './FooterOnly.scss'

function FooterOnly() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h5>SCOSS</h5>
            <h3>HCMC - OU</h3>
            <h6>© 2023 - SCOSS, Bản quyền</h6>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default memo(FooterOnly)