import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();       
  const [contractABI, setContractABI] = useState('[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"}],"name":"Cancel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"Listed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"listingId","type":"uint256"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"Sale","type":"event"},{"inputs":[{"internalType":"uint256","name":"listingId","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"buyToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"listingId","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"listingId","type":"uint256"}],"name":"getListing","outputs":[{"components":[{"internalType":"enum Market.ListingStatus","name":"status","type":"uint8"},{"internalType":"address","name":"seller","type":"address"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"}],"internalType":"struct Market.Listing","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"listToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"}]');
  const [marketAddress, setMarketAddress] = useState('0xD50bEa3E1e924004f9991a41f2603DA87ceE6DCB'); //Smart Contract Address Here


  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });

    Moralis.onAccountsChanged(function (address) {
      setWalletAddress(address[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChainId(web3.givenProvider?.chainId));
  useEffect(
    () => setWalletAddress(web3.givenProvider?.selectedAddress || user?.get("ethAddress")),
    [web3, user]
  );

  return (
    <MoralisDappContext.Provider value={{ walletAddress, chainId, marketAddress, setMarketAddress, contractABI, setContractABI }}>
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
