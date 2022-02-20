import React, { useState, useEffect } from "react";
import { getNativeByChain } from "helpers/networks";
import { getCollectionsByChain } from "helpers/collections";
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
} from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin ,Form,Input} from "antd";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import {
  FileSearchOutlined,
  RightCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";

//0x33bD01A9C5d8c361FA7dF97C255C5a1504443E5F

function NFTMint({ inputValue, setInputValue }) {
    const { chainId, marketAddress, contractABI,walletAddress,NFTAddress,NftcontractABI } = useMoralisDapp();
    const NFTCollections = getCollectionsByChain(chainId);
    const contractProcessor = useWeb3ExecuteFunction();
    const NftcontractABIJson = JSON.parse(NftcontractABI);
    const initialValues = { name: "", description: "", imageFile: "" };
    const MintinitialValues = { quantity: "", nftid: ""};
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isMintSubmit, setIsMintSubmit] = useState(false);
    const [MintformValues, setMintFormValues] = useState(MintinitialValues);
    const [MintformErrors, setMintFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [visible, setVisibility] = useState(false);

    const [NftTokenAddress, setNftTokenAddress] = useState();
    const [NftQuantity, setNftQuantity] = useState();

    const MintNftFunction = "mint"; //name of function in smart contact
    const EnabelMintFunction = "setIsMintEnable"; //name of function in smart contact

    async function Mint(Nftid,Quantity) {
      setLoading(true);
      const ops = {
        contractAddress: "0xd57b1e431984c49807F134CBc0E43ab0E1223eA8",
        functionName: MintNftFunction, //name of function in smart contact
        abi: NftcontractABIJson,
        params: {
          tokenId: Nftid,
          quantity : Quantity
        },
      };
  
      await contractProcessor.fetch({
        params: ops,
        onSuccess: (data) => {
          console.log("success");
          setLoading(false);
          setVisibility(false);
          succMint();
        },
        onError: (error) => {
          console.log(error);
          setLoading(false);
          failMint();
        },
      });
    }


    async function EnabelMint() {
      setLoading(true);
      const ops = {
        contractAddress: "0xd57b1e431984c49807F134CBc0E43ab0E1223eA8",
        functionName: EnabelMintFunction, //name of function in smart contact
        abi: NftcontractABIJson,
        params: {
          value: true,
        },
      };
  
      await contractProcessor.fetch({
        params: ops,
        onSuccess: (data) => {
          console.log("success");
          setLoading(false);
          setVisibility(false);
          succEnabelMint();
        },
        onError: (error) => {
          console.log(error);
          setLoading(false);
          failEnabelMint();
        },
      });
    }

    function succMint() {
      let secondsToGo = 5;
      const modal = Modal.success({
        title: "Success!",
        content: `Your NFT was Mint on the marketplace`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }

    function failMint() {
      let secondsToGo = 5;
      const modal = Modal.error({
        title: "Error!",
        content: `There was a problem Minting your NFT`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }
    function succEnabelMint() {
      let secondsToGo = 5;
      const modal = Modal.success({
        title: "Success!",
        content: `Your NFT Minting is Enabeld on the marketplace`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }

    function failEnabelMint() {
      let secondsToGo = 5;
      const modal = Modal.error({
        title: "Error!",
        content: `There was a problem Enabel Minting your NFT`,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    };
  
    const handleSubmit = (e) => {
      setFormErrors(validate(formValues));
      setIsSubmit(true);
    };


    const MinthandleChange = (e) => {
      const { name, value } = e.target;
      console.log(e.target.value);
      setMintFormValues({...MintformValues ,[name]: value });
    };


    const EnabelMinthandleSubmit = (e) => {
      EnabelMint();
    };

    const MinthandleSubmit = (e) => {
      
      setMintFormErrors(validateMint(MintformValues));
      setIsMintSubmit(true);
      setNftTokenAddress(MintformValues.nftid);
      setNftQuantity(MintformValues.quantity);
      Mint(MintformValues.nftid,MintformValues.quantity)
    };
  
    useEffect(() => {
      console.log(formErrors);
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        console.log(formValues);
      }
    }, [formErrors]);

    useEffect(() => {
      console.log(MintformErrors);
      if (Object.keys(MintformErrors).length === 0 && isMintSubmit) {
        console.log(MintformValues);
      }
    }, [MintformErrors]);
    const validate = (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "name is required";
      }
      if (!values.imageFile) {
        errors.imageFile = "Email is required!";
      }
      return errors;
    };
    const validateMint = (values) => {
      console.log(values)
      const errors = {};
      if (!values.nftid) {
        errors.nftid = "NFT Token Address is required";
      }
      if (!values.quantity) {
        errors.quantity = "Quantity is required!";
      }
      return errors;
    };

  return (
    <>
    {/* <Form onFinish={handleSubmit}>
        <Form.Item name="name">
          <Input  type="text"  value={formValues.name} onChange={handleChange} />
        </Form.Item>
        <Form.Item name="description">
          <Input type="text"  value={formValues.description} onChange={handleChange} />
          </Form.Item>
        <Form.Item name="imageFile">
          <Input type="file"  value={formValues.imageFile} onChange={handleChange} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Input type="submit" value="Submit" />
        </Form.Item>
      </Form> */}


      <Form onFinish={MinthandleSubmit}>
        <Form.Item name="nftid">
          <Input  type="text" name="nftid" placeholder="NFT Token Address" value={MintformValues.nftid} onChange={MinthandleChange} />
        </Form.Item>
        <Form.Item name="quantity">
          <Input type="text" name="quantity" placeholder="NFT Quantity" value={MintformValues.quantity} onChange={MinthandleChange} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Input  type="submit" value="MINT NFT" />
        </Form.Item>
      </Form>


      <Form onFinish={EnabelMinthandleSubmit}>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Input  type="submit" value="Enabel Mint" />
        </Form.Item>
      </Form>
    </>
  );
}

export default NFTMint;
