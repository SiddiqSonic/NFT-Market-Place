//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//"https://sov4nxuxgz71.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=1lHRghK2KvhvHNkoKxiA9SWXsH3RxytBjsOrbqxw&id=0"


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC1155 {
    uint256 public constant Rifle = 0;
    mapping(address => uint256) private mintedWallet;
    bool public isMintEnable;

    constructor() ERC1155("https://sov4nxuxgz71.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=1lHRghK2KvhvHNkoKxiA9SWXsH3RxytBjsOrbqxw&id={id}") {
        _mint(msg.sender, Rifle, 100, "");
    }

    function setIsMintEnable(bool value) external onlyOwner{
        isMintEnable = value;
    }

    function mint(uint tokenId, uint256 quantity) external payable{
        require(isMintEnable, "Minting is not Enabel");
        require(mintedWallet[msg.sender] < 1, "exceed max per wallet");

        mintedWallet[msg.sender]++;    
        _mint(msg.sender, tokenId, quantity, "");
    }
}