// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ALDOToken is ERC20, Ownable {
    constructor() ERC20("ALDO Token", "ALDO") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public onlyOwner {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public {
        require(
            account == msg.sender || allowance(account, msg.sender) >= amount,
            "Not authorized"
        );
        _burn(account, amount);
    }
}
