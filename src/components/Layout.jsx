import React from 'react';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import Blockie from "./Blockie";
import { Button, Card, Modal } from "antd";
import { useState } from "react";
import Address from "./Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { getExplorer } from "helpers/networks";
import { NavLink } from 'react-router-dom';
const Layout =({children}) =>{


    const { authenticate, isAuthenticated, logout } = useMoralis();
  const { walletAddress, chainId } = useMoralisDapp();
  const [isModalVisible, setIsModalVisible] = useState(false);


    return(
        
        
        <body className="body  ">
            <div className="col-md-12 mybody">
                <div className="m-4 mynav ">
                    <nav className="navbar navborrder navbar-expand-lg navbar-light  ">
                        <div className="container-fluid ">
        
                            <img src="asset/images/mylogo.png" alt="" className="mylogo" />
                            <button type="button" className="navbar-toggler bg-light " data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                                <span className="navbar-toggler-icon "></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarCollapse">
                                <div className="navbar-nav">
                                <NavLink to='/' className="nav-item nav-link active" style={{color: "white"}}>Home</NavLink>
                                    <NavLink to='/nftBalance' className="nav-item nav-link active" style={{color: "white"}}>Your Collection</NavLink>
                                    <NavLink to='/mint' className="nav-item nav-link active" style={{color: "white"}}>Mint</NavLink>
                                </div>
                                <div className="navbar-nav ms-auto">
                                    {!isAuthenticated ?  
                                    <button onClick={() => authenticate({ signingMessage: "Hello World!" })} className="nav-item nav-link p-2 btncolor " style={{color: "white"}}>Login</button>
                                   :<button onClick={() => logout()} className="nav-item nav-link p-2 btncolor " style={{color: "white"}}>Logout</button>}
                                    
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="  mycontainer   m-4  ">
                    <div className="col-md-12 p-3">
                        <div className=" ">
                            <NavLink to='/MetaPlayer' className="btncolor btn btn-secondary">Meta Players</NavLink>
                            <NavLink to='/Guns' className="btncolor btn btn-secondary">Guns</NavLink>
                            <NavLink to='/NftBox' className="btncolor btn btn-secondary">NFT's Box (coming soon)</NavLink>
                            <NavLink to='/Car' className="btncolor btn btn-secondary">Car (coming soon)</NavLink>
                            <NavLink to='/Walls' className="btncolor btn btn-secondary">Walls (coming soon)</NavLink>
                        </div>
                        <hr/>
                    </div>
        {children}
        </div>
    </div>
</body>
       
    )
}
 

export default Layout;