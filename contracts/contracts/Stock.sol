// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StockTokenization is ERC20, Ownable {
    
    struct Stock{
        uint256 stockId;
        string name;
        string symbol;
        string identifier;
        uint256 totalShares;
        uint256 sharesSold;
        uint256 sharePrice;
        address issuer;
        bool isActive;
    }

    mapping(uint256 => Stock) public stocks; //mapping to store the stocks by their id

    uint256 public nextStockId = 1; //counter for stock ids

    //event to log stock tokenization
    event StockTokenized(
        uint256 stockId,
        string name,
        string symbol,
        string identifier,
        uint256 totalShares,
        uint256 sharePrice,
        address issuer
    );

    //event to log price updates
    event PriceUpdated(uint256 stockId, uint256 newPrice);
    
    //constructor to initialize the ERC20 token and set the admin address
    constructor() ERC20("StockToken", "STK") Ownable(msg.sender) {}

    //function to tokenize a new stock
    function tokenizeStock( string memory _name, string memory _symbol, string memory _identifier, uint256 _totalShares, uint256 _sharePrice) external onlyOwner {
        require(_totalShares > 0, "Total shares must be greater than 0");
        require(_sharePrice > 0, "Share price must be greater than 0");

        //new stock ID
        uint256 stockId = nextStockId++;

        //create new stock struct and store it in the mapping
        stocks[stockId] = Stock({
            stockId: stockId,
            name: _name,
            symbol: _symbol,
            identifier: _identifier,
            totalShares: _totalShares,
            sharesSold: 0,
            sharePrice: _sharePrice,
            issuer: owner(),
            isActive: true
        });

        //mint the total shares to the admin address
        _mint(owner(), _totalShares);
        
        //emit an event to log the tokenization
        emit StockTokenized(stockId, _name, _symbol, _identifier, _totalShares, _sharePrice, owner());
    }

    //function to update the price of a stock (called by the backend)
    function updateStockPrice(uint256 _stockId, uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price must be greater than 0");
        require(stocks[_stockId].isActive, "Stock is not active");

        //update the stock price
        stocks[_stockId].sharePrice = _newPrice;

        //emit an event to log the price update
        emit PriceUpdated(_stockId, _newPrice);
    }

}