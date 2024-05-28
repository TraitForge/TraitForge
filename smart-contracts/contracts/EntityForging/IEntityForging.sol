// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEntityForging {
  struct Listing {
    address account;
    uint256 tokenId;
    bool isListed;
    uint256 fee;
  }

  event ListedForForging(uint256 tokenId, uint256 fee);
  event EntityForged(
    uint256 indexed newTokenid,
    uint256 parent1Id,
    uint256 parent2Id,
    uint256 newEntropy
  );
  event CancelledListingForForging(uint256 tokenId);
  event FeePaid(uint256 forgerTokenId, uint256 mergerTokenId, uint256 feePaid);

  // allows the owner to set NukeFund address
  function setNukeFundAddress(address payable _nukeFundAddress) external;

  function listForForging(uint256 tokenId, uint256 fee) external;

  function forgeWithListed(
    uint256 forgerTokenId,
    uint256 mergerTokenId
  ) external payable returns (uint256);

  function cancelListingForForging(uint256 tokenId) external;

  function fetchListings() external view returns (Listing[] memory);
}