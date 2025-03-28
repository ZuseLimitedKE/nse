// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract StockTokenization is ERC1155, Ownable {
    constructor(string memory uri) ERC1155(uri) {}
    struct Stock{
        string stockId;
        uint256 totalSupply;
        string symbol;
        string name; 
    }
    mapping(string => Stock) public stocks;
   function createStock(string memory shareId, string memory symbol, uint256 initialSupply, string memory tokenName)public onlyOwner{
    require (bytes(stocks[shareId].symbol).length == 0, "Stock already exists");
    Stock storage stock = stocks[shareId];
    stock.stockId = shareId;
    stock.totalSupply = initialSupply;
    stock.symbol = symbol;
    stock.name = tokenName;
    _mint(address(this), shareId, initialSupply, "");
   }
   function getSymbol(string memory shareId) public view returns(string memory){
       return stocks[shareId].symbol;
   }
}