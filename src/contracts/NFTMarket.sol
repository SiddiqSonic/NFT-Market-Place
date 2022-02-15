//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Market {
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
	}

	event Listed(
		uint listingId,
		address seller,
		address token,
		uint tokenId,
		uint price,
        uint quantity
	);

	event Sale(
		uint listingId,
		address buyer,
		address token,
		uint tokenId,
		uint price,
        uint quantity
	);

	event Cancel(
		uint listingId,
		address seller
	);

	uint private _listingId = 0;
	mapping(uint => Listing) private _listings;
	address Owner;
	uint Percentage;


	function setOwner(address _owner) external{
		Owner = _owner;
	}

	function setPercentage(uint _percentage) external{
		Percentage = _percentage / 100 ;
	}

	function listToken(address token, uint tokenId, uint price, uint256 quantity) external {
        require(price > 0, "Price must be greater than 0");
		ERC1155(token).safeTransferFrom(msg.sender, address(this), tokenId, quantity,"");

		Listing memory listing = Listing(
			ListingStatus.Active,
			msg.sender,
			token,
			tokenId,
			price
		);

		_listingId++;

		_listings[_listingId] = listing;

		emit Listed(
			_listingId,
			msg.sender,
			token,
			tokenId,
			price,
            quantity
		);
	}
	
	function getListing(uint listingId) public view returns (Listing memory) {
		return _listings[listingId];
	}

	function buyToken(uint listingId, uint256 quantity) external payable {
		Listing storage listing = _listings[listingId];

		require(msg.sender != listing.seller, "Seller cannot be buyer");
		require(listing.status == ListingStatus.Active, "Listing is not active");

		require(msg.value >= listing.price, "Insufficient payment");


		ERC1155(listing.token).safeTransferFrom(address(this), msg.sender, listing.tokenId, quantity,"");
		
		if(listing.seller == Owner){
			payable(listing.seller).transfer(listing.price);
		}
		else{
			payable(Owner).transfer(Percentage * listing.price); //Transfer the commision to the site owner
			payable(listing.seller).transfer(listing.price);     //Transfer the payment to the seller
		}
		emit Sale(
			listingId,
			msg.sender,
			listing.token,
			listing.tokenId,
			listing.price,
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