// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

abstract contract TestContract is Initializable {
    function __TestContract_init() public view onlyInitializing {
        console.log("TestContract: onlyInitializing");       
    }
}

contract Mars is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable, TestContract {

    function initialize(string calldata _name) public virtual initializer {
        __TestContract_init();
        __Ownable_init();
        __ERC20_init(_name, "MARS");
        _version = 1;

        _mint(msg.sender, 10000000 * 10 ** decimals());
    }

   uint256 _version;
    function _authorizeUpgrade(address newImplementation) internal 
    override
    onlyOwner
    {

    }

    function version() public view virtual returns (uint256) {
        return _version;
    }
}

contract MarsV2 is Mars {
    uint256 fee;

    function initializev2(uint256 v) public reinitializer(2) {
        __V2_init(v);
    }

    function __V2_init(uint256 v) public onlyInitializing {
        _version = v;
        console.log("MarsV2: __V2_init(%d)", v);      
    }
}