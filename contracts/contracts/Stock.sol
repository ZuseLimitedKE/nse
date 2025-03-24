// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

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
    mapping(uint256 => mapping(address => uint256)) public investorBalances; //mapping to store investor balances

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

    //event to log purchase of shares
       event SharesPurchased(
        uint256 indexed stockId,
        address indexed buyer,
        uint256 amount,
        uint256 totalCost
    );
    
    //constructor to initialize the ERC20 token and set the admin address
    constructor() ERC20("StockToken", "STK") Ownable(msg.sender) {}

    //Function to tokenize a new stock
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

    //Function to update the price of a stock (called by the backend)
    function updateStockPrice(uint256 _stockId, uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price must be greater than 0");
        require(stocks[_stockId].isActive, "Stock is not active");

        //update the stock price
        stocks[_stockId].sharePrice = _newPrice;

        //emit an event to log the price update
        emit PriceUpdated(_stockId, _newPrice);
    }

    //Function for purchasing shares of a stock
    function purchaseShares(uint256 _stockId, uint256 _amount) external payable {
    Stock storage stock = stocks[_stockId];
    
    //validate the purchase
    require(stock.isActive, "Stock is not active");
    require(_amount > 0, "Amount must be greater than 0");
    require(_amount <= (stock.totalShares - stock.sharesSold), "Not enough shares available");
    
    //calculate total cost
    uint256 totalCost = _amount * stock.sharePrice;
    require(msg.value >= totalCost, "Insufficient ETH sent");
    
    // Direct transfer to admin (owner)
    payable(owner()).transfer(totalCost);
    
    // Transfer tokens to buyer
    _transfer(owner(), msg.sender, _amount);
    
    // Update state
    investorBalances[_stockId][msg.sender] += _amount;
    stock.sharesSold += _amount;
    
    // Refund any excess ETH
    if (msg.value > totalCost) {
        payable(msg.sender).transfer(msg.value - totalCost);
    }
    
    emit SharesPurchased(_stockId, msg.sender, _amount, totalCost);

    }

}