pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ALDOToken is ERC20, Ownable {
    constructor() ERC20("ALDO Token", "ALDO") Ownable(msg.sender) {
        // Mint initial supply to owner (1 million tokens)
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Mint function - only owner can mint
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Burn function - only owner can burn
    function burn(uint256 amount) public onlyOwner {
        _burn(msg.sender, amount);
    }

    // Allow users to burn their own tokens
    function burnFrom(address account, uint256 amount) public {
        require(account == msg.sender || allowance(account, msg.sender) >= amount, "Not authorized");
        _burn(account, amount);
    }
}