import { ContactsOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useNFTTokenIds = (addr) => {
  const { token } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [NFTTokenIds, setNFTTokenIds] = useState([]);
  const [totalNFTs, setTotalNFTs] = useState();
  const [fetchSuccess, setFetchSuccess] = useState(true);
  const {
    fetch: getNFTTokenIds,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(token.getAllTokenIds, {
    chain: "0x38",
    address: addr,
    limit: 30,
  });

  useEffect(async () => {
    if (data?.result) {
      const NFTs = data.result;
      setTotalNFTs(data.total);
      setFetchSuccess(true);
      for (let NFT of NFTs) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          NFT.image = resolveLink(NFT.metadata?.image);
        } else if (NFT?.token_uri) {
          NFT.token_uri = NFT.token_uri.replace("https://sov4nxuxgz71.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=1lHRghK2KvhvHNkoKxiA9SWXsH3RxytBjsOrbqxw&id","https://fwekh9wzvkvb.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=CdZGKv5yJnL12xgL7436851bq4OFjW9UsdHodRs0&id");
          //https://fwekh9wzvkvb.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=CdZGKv5yJnL12xgL7436851bq4OFjW9UsdHodRs0&id=
          try {
            await fetch(NFT.token_uri)
              .then((response) => response.json())
              .then((data) => {
                NFT.image = resolveLink(data.result.nft_image.url);
                console.log("NFT URL" + NFT.token_uri);
                console.log("Image URL "+NFT.image);
                NFT.model = resolveLink(data.result.Model.url);
                NFT.name = data.result.Name;
                console.log("Data = ", data);
                console.log( NFT);
              });
          } catch (error) {
            setFetchSuccess(false);

          }
        }
      }
      setNFTTokenIds(NFTs);
    }
  }, [data]);

  return {
    getNFTTokenIds,
    NFTTokenIds,
    totalNFTs,
    fetchSuccess,
    error,
    isLoading,
  };
};
