import { useEffect, useState} from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import Account from "components/Account";
import Chains from "components/Chains";
import NFTBalance from "components/NFTBalance";
import NFTTokenIds from "components/NFTTokenIds";
import NFTMint from "components/NFTMint";

import SearchCollections from "components/SearchCollections";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";
import NFTMarketTransactions from "components/NFTMarketTransactions";
import Layout from "components/Layout"

const styles = {
 
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();



  const [inputValue, setInputValue] = useState("explore");
  const [nft ,setnft] = useState();
  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Router>
    <Layout>
       
      <Switch>
          <Route exact path="/">
                <Redirect to="/MetaPlayer" />
            </Route>
            <Route path="/nftBalance">
              <NFTBalance />
            </Route>
            <Route path="/MetaPlayer">
              <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue} nft={nft} setnft={setnft} path = {"MetaPlayer"}/>
            </Route>
            <Route path="/Buy/:id">
              <NFTTokenIds inputValue={inputValue} setInputValue={setInputValue} Mynft={nft} setnft={setnft} path = {"Buy"}/>
            </Route>
            <Route path="/Transactions">
              <NFTMarketTransactions />
            </Route>
            <Route path="/mint">
              <NFTMint />
            </Route>
          </Switch>
          
          <div style={styles.headerRight}>
            
          </div>
    </Layout>
    </Router>
  );
};



export default App;
