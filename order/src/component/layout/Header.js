import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../redux/action/actLogin';

const Header = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const logoutHandle = () =>{
    sessionStorage.clear();
    dispatch(logout())
    history.push("/")
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ paddingRight: '50px' }}>
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <a className="navbar-brand mt-2 mt-lg-0" href="#top">
              <img
                src="./image/LOGO.png"
                height="50"
                alt=""
                loading="lazy"
              />
            </a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#top">Dashboard</a>
              </li>
              {/* <li className="nav-item">
              <a className="nav-link" href="#top">Team</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#top">Projects</a>
            </li> */}
            </ul>
          </div>

          <div className="d-flex align-items-center">


            <a
              className="text-reset me-3 dropdown-toggle hidden-arrow"
              href="#top"
              id="navbarDropdownMenuLink"
              role="button"
              data-mdb-toggle="dropdown"
              aria-expanded="false"
            >
              {/* <i className="fas fa-bell"></i>
              <span className="badge rounded-pill badge-notification bg-danger">1</span> */}
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdownMenuLink"
            >
              {/* <li>
              <a className="dropdown-item" href="#top">Some news</a>
            </li>
            <li>
              <a className="dropdown-item" href="#top">Another news</a>
            </li>
            <li>
              <a className="dropdown-item" href="#top">Something else here</a>
            </li> */}
            </ul>

            <a
              className="dropdown-toggle d-flex align-items-center hidden-arrow"
              href="#top"
              id="navbarDropdownMenuLink"
              role="button"
              data-mdb-toggle="dropdown"
              aria-expanded="false"
            >
              {/* <img
                src={userProfile.imageUrl}
                className="rounded-circle"
                height="5"
                alt=""
                loading="lazy"
              /> */}
              <Avatar icon={<UserOutlined />} />
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdownMenuLink"
            >
             
            
              <li>
                <a type="button" className="dropdown-item text-danger"
                onClick={() => logoutHandle()}
                >Đăng xuất</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

     
    </div>
  )
}

export default Header
