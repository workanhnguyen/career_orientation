import React from 'react'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light ">
        {/* <!-- Change Logo Img Here --> */}
        <a className="navbar-brand" href="#"><img src="images/logo.svg" alt="" /></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <div className="interactive-menu-button">
            <a href="#">
              <span>Menu</span>
            </a>
          </div>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              {/* <!-- Nav Link --> */}
              <a className="nav-link" data-scroll href="#home">Home.<span class="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              {/* <!-- Nav Link --> */}
              <a className="nav-link" data-scroll href="#about-us">About Us.</a>
            </li>
            <li className="nav-item">
              {/* <!-- Nav Link --> */}
              <a className="nav-link" data-scroll href="#portfolio">Portfolio.</a>
            </li>
            <li className="nav-item">
              {/* <!-- Nav Link --> */}
              <a className="nav-link" data-scroll href="#blog">Blog.</a>
            </li>
            <li className="nav-item">
              {/* <!-- Nav Link --> */}
              <a className="nav-link" data-scroll href="#contact-us">Contact Us.</a>
            </li>
            <li className="nav-item dropdown">
              {/* <!-- Lang Dropdown Link --> */}
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">EN</a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                {/* <!-- Lang Dropdown Choice --> */}
                <a className="dropdown-item" href="#">DE </a>
                {/* <!-- Lang Dropdown Choice --> */}
                <a className="dropdown-item" href="#">ES </a>
              </div>
            </li>
          </ul>
          <form data-scroll href="#contact-us" className="contact-btn form-inline my-2 my-lg-0">
            {/* <!-- Contact Us Button --> */}
            <button>Contact Us</button>
          </form>
        </div>
      </nav>
  )
}

export default Navbar