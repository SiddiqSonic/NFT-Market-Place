//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ownable is Context {
    address private _owner;
    address private _buybackOwner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    modifier onlyBuybackOwner() {
        require(
            _buybackOwner == _msgSender(),
            "Ownable: caller is not the buyback owner"
        );
        _;
    }

    constructor() {
        address msgSender = _msgSender();
        _owner = msgSender;
        _buybackOwner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function transferOwnership(address newOwner) external virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );

        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    function transferBuybackOwnership(address newOwner)
        external
        virtual
        onlyOwner
    {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );

        emit OwnershipTransferred(_buybackOwner, newOwner);
        _buybackOwner = newOwner;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function buybackOwner() public view returns (address) {
        return _buybackOwner;
    }
}

contract Market is Ownable {
	enum ListingStatus {
		Active,
		Sold,
		Cancelled
	}

	struct Listing {
		ListingStatus status;
		address seller;
		address token;
		uint tokenId;
		uint price;
		uint256 tokenAmount;
	}

	event Listed(
		uint listingId,
		address seller,
		address token,
		uint tokenId,
		uint price,
		uint256 tokenAmount,
        uint quantity
	);

	event Sale(
		uint listingId,
		address buyer,
		address token,
		uint tokenId,
		uint price,
		uint256 tokenAmount,
        uint quantity
	);

	event Cancel(
		uint listingId,
		address seller
	);

	uint private _listingId = 0;
	mapping(uint => Listing) private _listings;
	address nftOwner = 0xDa4E9AE390720DE2b73d2520bBda344aEaCbEFD8;
	address nullAddr = 0x0000000000000000000000000000000000000000;
	uint Percentage = 1;          
	address private nativeToken = 0xBa007b6170C602C08545ff97395677408688D3a2;

	function setNativeToken(address _token) external onlyOwner{
		require(_token != 0x0000000000000000000000000000000000000000, "Native token cannot be null address");
		nativeToken = _token;
	}

	function setNFTOwner(address _owner) external onlyOwner{
		nftOwner = _owner;
	}

	function setPercentage(uint _percentage) external onlyOwner{
		Percentage = _percentage;
	}

	function listToken(address token, uint tokenId, uint price, uint256 tokenAmount, uint256 quantity) external {
        require(price >= 0, "Price must be equal or greater than 0");
		require(tokenAmount >=0, "Token amount must be equal or greater than 0");
		
		if(price == 0){
			require(tokenAmount > 0, "Token amount must be greator than 0 if it is sale by native token");
		}else if(tokenAmount == 0){
			require(price > 0, "Price must be gretor than 0 if it is a sale by bnb");
		}

		ERC1155(token).safeTransferFrom(msg.sender, address(this), tokenId, quantity,"");

		Listing memory listing = Listing(
			ListingStatus.Active,
			msg.sender,
			token,
			tokenId,
			price,
			tokenAmount
		);

		_listingId++;

		_listings[_listingId] = listing;

		emit Listed(
			_listingId,
			msg.sender,
			token,
			tokenId,
			price,
			tokenAmount,
            quantity
		);
	}
	
	function getListing(uint listingId) public view returns (Listing memory) {
		return _listings[listingId];
	}

	function buyNFTWithBNB(uint listingId, uint256 quantity) external payable {
		Listing storage listing = _listings[listingId];

		require(msg.sender != listing.seller, "Seller cannot be buyer");
		require(listing.status == ListingStatus.Active, "Listing is not active");

		require(msg.value >= listing.price, "Insufficient payment");

		ERC1155(listing.token).safeTransferFrom(address(this), msg.sender, listing.tokenId, quantity,"");
		
		if(listing.seller == nftOwner){
			payable(listing.seller).transfer(listing.price);
		}
		else{
			payable(nftOwner).transfer(Percentage * listing.price / 100); //Transfer the commision to the site nft owner
			payable(listing.seller).transfer(listing.price - Percentage * listing.price / 100);     //Transfer the payment to the seller
		}
		emit Sale(
			listingId,
			msg.sender,
			listing.token,
			listing.tokenId,
			listing.price,
			0,
            quantity
		);
	}


	function buyNFTWithToken(uint listingId, uint256 quantity) external {
		Listing storage listing = _listings[listingId];

		require(msg.sender != listing.seller, "Seller cannot be buyer");
		require(listing.status == ListingStatus.Active, "Listing is not active");

		require(ERC20(nativeToken).balanceOf(msg.sender) >= listing.tokenAmount, "Insufficient tokens");

		ERC1155(listing.token).safeTransferFrom(address(this), msg.sender, listing.tokenId, quantity,"");
		
		if(listing.seller == nftOwner){
			// transfer native token from users's wallet to seller wallet, here owner and seller are same
			ERC20(nativeToken).transferFrom(msg.sender, address(this), listing.tokenAmount);
			ERC20(nativeToken).transfer(listing.seller, listing.tokenAmount);
		}
		else{
			// transfer native token from user's wallet to nftowner and seller
			ERC20(nativeToken).transferFrom(msg.sender, address(this), listing.tokenAmount);
			ERC20(nativeToken).transfer(nftOwner, Percentage * listing.tokenAmount / 100);
			ERC20(nativeToken).transfer(listing.seller, listing.tokenAmount - Percentage * listing.tokenAmount / 100 );
		}

		emit Sale(
			listingId,
			msg.sender,
			listing.token,
			listing.tokenId,
			0,
			listing.tokenAmount,
            quantity
		);
	}

	function cancel(uint listingId , uint256 quantity) public {
		Listing storage listing = _listings[listingId];

		require(msg.sender == listing.seller, "Only seller can cancel listing");
		require(listing.status == ListingStatus.Active, "Listing is not active");

		listing.status = ListingStatus.Cancelled;
	
		ERC1155(listing.token).safeTransferFrom(address(this), msg.sender, listing.tokenId,quantity,"");

		emit Cancel(listingId, listing.seller);
	}

	function getNativeToken() public view returns(address){
		return nativeToken;
	}

	function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}