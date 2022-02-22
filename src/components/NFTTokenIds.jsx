import React, { useState, useEffect } from "react";
import { getNativeByChain } from "helpers/networks";
import { getCollectionsByChain } from "helpers/collections";
import { useIPFS } from "../hooks/useIPFS.js";

import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
} from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin } from "antd";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import {
  FileSearchOutlined,
  RightCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import { NavLink ,useParams} from "react-router-dom";

const { Meta } = Card;

const styles = {
 
};

function NFTTokenIds({ inputValue, setInputValue,Mynft, setnft, path,match }) {
  setInputValue("0xd57b1e431984c49807F134CBc0E43ab0E1223eA8");
  const fallbackImg =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==";
  const { NFTTokenIds, totalNFTs, fetchSuccess } = useNFTTokenIds(inputValue);
  const [visible, setVisibility] = useState(false);
  const [nftToBuy, setNftToBuy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [NFTData,setNFTData] = useState();
  
  const contractProcessor = useWeb3ExecuteFunction();
  const { chainId, marketAddress, contractABI, walletAddress } =
    useMoralisDapp();
  const nativeName = getNativeByChain(chainId);
  const contractABIJson = JSON.parse(contractABI);
  const { Moralis } = useMoralis();
  const queryMarketItems = useMoralisQuery("ListMarketItems");
  const queryNftModel = useMoralisQuery("NFT");
  const {id} = useParams();
  const { resolveLink } = useIPFS();
  const fetchNftModel = JSON.parse(
    JSON.stringify(queryNftModel.data, [
      "objectId",
      "createdAt",
      "updatedAt",
      "ACL",
      "nft_image",  
      "nft_id",
      "Name",
      "Model",
      "HEALTH",
    ])
  );
  const fetchMarketItems = JSON.parse(
    JSON.stringify(queryMarketItems.data, [
      "objectId",
      "createdAt",
      "listingId",
      "price",
      "token", //nftcontract_address 
      "itemId",
      "quantity",
      "tokenId",
      "seller",
      "owner",
      "confirmed",
    ])
  );
  const purchaseItemFunction = "buyToken";
  const NFTCollections = getCollectionsByChain(chainId);

  async function purchase(objId) {
    setLoading(true);
    const tokenDetails = getNft(objId);
    const itemID = tokenDetails.itemId;
    const tokenPrice = tokenDetails.price;
    const listingId = tokenDetails.listingId;
    const quantity = 1;
    const ops = {
      contractAddress: marketAddress,
      functionName: purchaseItemFunction,
      abi: contractABIJson,
      params: {
        listingId: listingId,
        quantity: quantity,
      },
      msgValue: tokenPrice,
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("success");
        setLoading(false);
        setVisibility(false);
        updateSoldMarketItem(objId);
        succPurchase();
      },
      onError: (error) => {
        setLoading(false);
        failPurchase();
      },
    });
  }

  const handleBuyClick = (nft) => {
    setNftToBuy(nft);
    console.log(nft.image);
    setVisibility(true);
  };
  const handleOnClick = (nft) => {
    console.log("OnClick",nft);
    setnft(nft);
  };
  function succPurchase() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `You have purchased this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failPurchase() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem when purchasing this NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  async function updateSoldMarketItem(objId) {
    const tokenDetails = getNft(objId);
    const id = tokenDetails.objectId;
    const marketList = Moralis.Object.extend("ListMarketItems");
    const query = new Moralis.Query(marketList);
    await query.get(id).then((obj) => {
      obj.set("quantity", "" + tokenDetails.quantity - 1);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }
var MarketList = "" ;
  const getMarketItem = (nft) => {
  
    const result = fetchMarketItems?.find(
      (e) =>
        e.token === nft?.token_address &&
        e.tokenId === nft?.token_id &&
        e.quantity > 0 &&
        e.confirmed === true 
        // e.seller === "0xac30cef569992203cf1766c788752305d689c814"
    );
    console.log(result);
    MarketList = result;
    return result;
  };

  const getNft = (objId) => {
    console.log(objId);
    const result = fetchMarketItems?.find(
      (e) =>
        e.objectId === objId
    );
    console.log(result);
    return result;
  };

  const getNftOnBuy = (tokenid) => {
    console.log(tokenid);
    const result = fetchNftModel?.find(
      (e) =>
        e.nft_id == tokenid
    );
    console.log(result);
    return result;
  };

  async function getNftModel(nfturl){
    console.log("Model");
    console.log(nfturl);
    var nft ={};
    try {
      await fetch(nfturl)
        .then((response) => response.json())
        .then((data) => {
          nft.name = data.result.Name;
          nft.tokenId = data.result.nft_id;
          console.log("lfkjd")
          console.log(data);
        });
    } catch (error) {
      console.log(error);
    }
    setNFTData(nft);
    console.log(nft);
    return nft;
  };


  var my_nft = "";
    if (path === "Buy"){
      my_nft = getNft(id);
        const hex = parseInt(my_nft.tokenId, 10).toString(16)
       // getNftModel("https://fwekh9wzvkvb.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=CdZGKv5yJnL12xgL7436851bq4OFjW9UsdHodRs0&id="+hex);
      }
 
 
  

  return (
    <>
      <div>
        {contractABIJson.noContractDeployed && (
          <>
            <Alert
              message="No Smart Contract Details Provided. Please deploy smart contract and provide address + ABI in the MoralisDappProvider.js file"
              type="error"
            />
            <div style={{ marginBottom: "10px" }}></div>
          </>
        )}
        {inputValue !== "explore" && totalNFTs !== undefined && (
          <>
            {!fetchSuccess && (
              <>
                <Alert
                  message="Unable to fetch all NFT metadata... We are searching for a solution, please try again later!"
                  type="warning"
                />
                <div style={{ marginBottom: "10px" }}></div>
              </>
            )}

          </>
        )}



        {path !== "Buy" &&
          NFTTokenIds.slice(0, 20).map((nft, index) => (
            

            <div>
              {getMarketItem(nft) && (
                <NavLink to={`/buy/${MarketList.objectId}`} onClick={handleOnClick(nft)}>
                  <div className="  mynft m-3 ">
                    <div className=" m-3 p-1  tag  ">
                      <div className="row">
                        <div className="col-md-5" >
                        <span   className="span ">Meta Players</span> 
                        </div>

                        <div className="col-md-4" >
                        <img src="asset/images/protection.png" alt="" className="power p1 ml-2" /> 

                        </div>

                        <div className="col-md-3" >
                        <img src="asset/images/attack.png" alt="" className="power p2 ml-2" />

                        </div>
                     
                      </div>
                    
                    </div>
                     <img src={nft?.image || "error"} className="character" alt="" />
                    <p className="chinfo"> #{nft.token_id} {nft.name}</p>
                    <h5 className="chinfo">  {MarketList.price / ("1e" + 18)} BNB</h5>
                    <h5 className="chinfo"> {MarketList.quantity}</h5>
                  </div>
                </NavLink>
              )}
            </div>

          ))
        }
        {path === 'Buy' &&
          
          <div data-v-ee1d93aa="" data-v-c42fc3ce="" className="cat-page">
            <div data-v-47e5a974="" data-v-ee1d93aa="" className="market-category" data-v-c42fc3ce="">
              <div data-v-47e5a974="" className="menu-view" style={{ background: "linear-gradient(6deg,purple, #1819EF)" }}> <a data-v-47e5a974=""  className="router-link-active menu-item-pets">
                Nft Characters
              </a> </div>
              <div data-v-47e5a974="" classNameName="dropdown-view">
                <div data-v-4ebee254="" data-v-47e5a974="" className="tabs-view tab-menus">
                  <div data-v-4ebee254="" className="tab-list"><a data-v-4ebee254="" className="tab-item
                                          selected"><span data-v-4ebee254="" className="icon" style={{ backgroundImage: "url(&quot;/img/icon-category-pets.dad24f21.png&quot)" }} >
                    </span> Nft Characters</a><a data-v-4ebee254="" className="tab-item
                                          has-tooltip" data-original-title="null"><span data-v-4ebee254="" className="icon" style={{ backgroundImage: "url(&quot;/img/icon-category-lends.5de98e6f.png&quot;)" }}></span></a></div>
                </div>
              </div>
            </div>
            <div data-v-ee1d93aa="" data-v-c42fc3ce="" className="detail-info" style={{ background: "linear-gradient(6deg,purple, #1819EF)" }}>
              <div data-v-ee1d93aa="" data-v-c42fc3ce="" className="info-inner">
                <div data-v-c7994836="" data-v-ee1d93aa="" className="info-comp clearfix" data-v-c42fc3ce="">
                  <div data-v-c7994836="" className="aside-left">
                    <section data-v-c7994836="" className="section-item nft-info">
                      <div data-v-c7994836="" className="infos">
                        <div data-v-c7994836="" className="title span col-md-6"><span data-v-c7994836="" className="token-id-m">#1</span  >{getNftOnBuy(my_nft.tokenId).Name }</div>
                      </div>
                      <div data-v-c7994836="" className="token-id">
                        <div data-v-c7994836="" className="element-values">
                          <div data-v-c7994836="" className="element"><img data-v-c7994836="" src="https://d1vyp5kjqdxn2l.cloudfront.net/cdnstatic/img/d98b76406dc6884ed7168a722ab85217.png" /></div>
                          <div data-v-c7994836="" className="element"><img data-v-c7994836="" src="https://d1vyp5kjqdxn2l.cloudfront.net/cdnstatic/img/47f78123e1490c84f5bc883f7b5771aa.png" /></div>
                        </div><span data-v-c7994836="" className="id-text">#{my_nft.tokenId}</span></div>
                    </section>
                    <div data-v-c7994836="" className="cover-view">
                      <div data-v-c7994836="" className="stars">
                        <div data-v-32540007="" data-v-c7994836="" className="stars-widget
                                                  stars-large"></div>
                      </div>
                      <model-viewer alt="Neil Armstrong's Spacesuit from the Smithsonian Digitization Programs Office and National Air and Space Museum" src={`asset/gltf/${my_nft.tokenId}.gltf`} poster="shared-assets/models/NeilArmstrong.webp" seamless-poster="" shadow-intensity="1" camera-controls="" ar-status="not-presenting"></model-viewer>
                    </div>
                    {/* ModelUrl */}
                    <div data-v-c7994836="" className="market-info">
                      <div data-v-1db83116="" data-v-c7994836="" className="price-info price-com-info"> 
                      <span data-v-1db83116="" className="amount d-flex">
                          <img src="asset/images/bnb.png" style={{ width: "22px", height: "20px"}} alt="" />
                          <div className="mx-3">{my_nft.price/ ("1e" + 18)} </div>
                      </span>
                          </div>
                          <a onClick={() => purchase(id)} 
                          data-v-c7994836="" className="common-button button-44 button-primary">BUY NOW
                          </a>
                          </div>
                  </div>
                  <div data-v-c7994836="" className="aside-right">
                    <section data-v-c7994836="" className="section-item">
                      <div data-v-c7994836="" className="title">GROWTH POTENTIAL<span data-v-c7994836="" className="title-text" style={{ color: "rgb(136, 173,219)" }}>(320)</span></div>
                      <div data-v-c7994836="" className="element-list">
                        <div data-v-c7994836="" className="data-item">
                          <div data-v-c7994836="" className="s-title">ATTACK</div>
                          <div data-v-c7994836="" className="s-value">
                            <div data-v-9f0486de="" data-v-c7994836="" className="cover-image
                                                          bg-box" style={{ backgroundImage: "url( asset/images/attack.png)" }}></div><span data-v-c7994836="">77</span></div>
                        </div>
                        <div data-v-c7994836="" className="data-item">
                          <div data-v-c7994836="" className="s-title">HEALTH</div>
                          <div data-v-c7994836="" className="s-value">
                            <div data-v-9f0486de="" data-v-c7994836="" className="cover-image
                                                          bg-box" style={{ backgroundImage: "url( asset/images/health.png)" }}></div><span data-v-c7994836="">108</span></div>
                        </div>
                        <div data-v-c7994836="" className="data-item">
                          <div data-v-c7994836="" className="s-title">DEFENCE</div>
                          <div data-v-c7994836="" className="s-value">
                            <div data-v-9f0486de="" data-v-c7994836="" className="cover-image
                                                          bg-box" style={{ backgroundImage: "url( asset/images/protection.png)" }}></div><span data-v-c7994836="">27</span></div>
                        </div>
                        <div data-v-c7994836="" className="data-item">
                          <div data-v-c7994836="" className="s-title">SPEED</div>
                          <div data-v-c7994836="" className="s-value">
                            <div data-v-9f0486de="" data-v-c7994836="" className="cover-image
                                                          bg-box" style={{ backgroundImage: "url( asset/images/speedcopy.png)" }}></div><span data-v-c7994836=" ">108</span></div>
                        </div>
                      
                      </div>
                    </section>


                  </div>

                </div>
              </div>
            </div>
          </div>


        }

      </div>
      {getMarketItem(nftToBuy) ? (
        <Modal
          title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          onOk={() => purchase()}
          okText="Buy"
        >
          <Spin spinning={loading}>
            <div
              style={{
                width: "250px",
                margin: "auto",
              }}
            >
              <Badge.Ribbon
                color="green"
                text={`${getMarketItem(nftToBuy).price / ("1e" + 18)
                  } ${nativeName}`}
              >
                <img
                  src={nftToBuy?.image}
                  style={{
                    width: "250px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
              </Badge.Ribbon>
            </div>
          </Spin>
        </Modal>
      ) : (
        <Modal
          title={`Buy ${nftToBuy?.name} #${nftToBuy?.token_id}`}
          visible={visible}
          onCancel={() => setVisibility(false)}
          onOk={() => setVisibility(false)}
        >
          <img
            src={nftToBuy?.image}
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
          <Alert
            message="This NFT is currently not for sale"
            type="warning"
          />
        </Modal>
      )}
      {/* </div> */}
    </>
  );
}

export default NFTTokenIds;