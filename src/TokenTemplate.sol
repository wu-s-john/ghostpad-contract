// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

/**
 * @title TokenTemplate
 * @dev A template contract for creating new memecoin tokens
 * This contract will be cloned using the minimal proxy pattern for gas efficiency
 */
contract TokenTemplate is Initializable, ERC20Upgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;
    
    bool public contractLocked; // Whether certain functions are locked to prevent changes
    
    // Description of the token
    string public description;
    
    // Burn settings
    bool public burnEnabled;
    
    // Liquidity lock settings
    uint256 public liquidityLockPeriod;
    address public liquidityPool;
    uint256 public liquidityLockEndTime;
    
    // Vesting settings
    bool public vestingEnabled; // Whether vesting functionality is enabled
    
    // Initialization parameters struct to avoid too many arguments
    struct InitParams {
        string name;
        string symbol;
        uint256 initialSupply;
        address owner;
        address contractAddress;
        string description;
        bool burnEnabled;
        uint256 liquidityLockPeriod;
        bool vestingEnabled;
        uint256 ethAmount;
    }
    
    struct VestingSchedule {
        address beneficiary; // Beneficiary of tokens after they are released
        uint256 cliff;      // Cliff time - when tokens start to vest
        uint256 start;      // Start time of the vesting period
        uint256 duration;   // Duration of the vesting period in seconds
        uint256 releasedAmount; // Amount of tokens released
        uint256 amountTotal;    // Total amount of tokens to be released at the end of the vesting
        bool revocable;         // Whether the vesting is revocable or not
        bool revoked;           // Whether the vesting has been revoked or not
    }
    
    bytes32[] private vestingSchedulesIds;
    mapping(bytes32 => VestingSchedule) private vestingSchedules;
    mapping(address => uint256) private holdersVestingCount;
    
    uint256 private vestingSchedulesTotalAmount;
    
    // Events
    event Initialized(string name, string symbol, uint256 initialSupply, address owner);
    event DescriptionUpdated(string oldDescription, string newDescription);
    event BurnEnabledUpdated(bool enabled);
    event ContractLocked(bool locked);
    event LiquidityLocked(address liquidityPool, uint256 unlockTime);
    event LiquidityUnlocked(address liquidityPool);
    event VestingScheduleCreated(address beneficiary, uint256 amount, uint256 start, uint256 cliff, uint256 duration, bool revocable);
    event VestingScheduleRevoked(bytes32 vestingScheduleId);
    event VestingReleased(bytes32 vestingScheduleId, uint256 amount);
    event TokenDistribution(uint256 ownerAmount, uint256 contractAmount, uint256 ownerPercentage);
    
    /**
     * @dev Calculate the percentage of tokens that should go to the owner based on ETH deposited
     * Uses a step function to give lower percentages for higher ETH amounts
     * @param ethAmount Amount of ETH deposited in wei
     * @return percentage Percentage of tokens that should go to the owner (in basis points, 100 = 1%)
     */
    function calculateOwnerPercentage(uint256 ethAmount) public pure returns (uint256) {
        // Convert wei to ETH with 1 decimal precision
        uint256 ethInTenths = ethAmount / 10**17;
        
        // Step function based on ETH amount
        if (ethInTenths >= 1000) {  // 100 ETH or more
            return 5000;  // 50%
        } else if (ethInTenths >= 100) {  // 10 ETH or more
            return 1000;  // 10%
        } else if (ethInTenths >= 10) {  // 1 ETH or more
            return 500;   // 5%
        } else if (ethInTenths >= 1) {  // 0.1 ETH or more
            return 375;   // 3.75%
        } else {
            return 10;  // Default to 50% for very small amounts
        }
    }
    
    /**
     * @dev Initialize the token (can only be called once)
     * @param params Initialization parameters struct
     */
    function initialize(
        InitParams memory params
    ) external initializer {
        require(params.owner != address(0), "Owner cannot be the zero address");
        
        // Initialize base contracts
        __ERC20_init(params.name, params.symbol);
        __Ownable_init();
        __ReentrancyGuard_init();
        
        // Set decimals
        _setupDecimals(18);
        
        // Calculate the owner percentage based on ETH amount
        uint256 ownerPercentage;
        if (params.ethAmount > 0) {
            // Calculate percentage using the formula
            ownerPercentage = calculateOwnerPercentage(params.ethAmount);
        } else {
            // Default to 50% if no ETH amount is provided
            ownerPercentage = 5000;
        }
        
        // Calculate token amounts for owner and contract
        uint256 ownerAmount = params.initialSupply.mul(ownerPercentage).div(10000);
        uint256 contractAmount = params.initialSupply.sub(ownerAmount);
        
        // Mint tokens with the correct distribution
        _mint(params.owner, ownerAmount);
        _mint(params.contractAddress, contractAmount);
        
        // Emit token distribution event
        emit TokenDistribution(ownerAmount, contractAmount, ownerPercentage);
        
        // Set owner
        transferOwnership(params.owner);
        
        // Set token properties
        description = params.description;
        burnEnabled = params.burnEnabled;
        liquidityLockPeriod = params.liquidityLockPeriod;
        vestingEnabled = params.vestingEnabled;
        contractLocked = false;
        
        emit Initialized(params.name, params.symbol, params.initialSupply, params.owner);
    }
    
    /**
     * @dev This function is no longer needed since we're passing ethAmount directly,
     * but we keep it for backward compatibility or direct calls
     */
    function getTornadoDenomination(address ghostPadAddress) external view returns (uint256) {
        return 1 ether; // Default for backward compatibility
    }
    
    /**
     * @dev Override transfer function - tax functionality removed
     * @param recipient Recipient of the transfer
     * @param amount Amount to transfer
     */
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        return super.transfer(recipient, amount);
    }
    
    /**
     * @dev Override transferFrom function - tax functionality removed
     * @param sender Sender of the transfer
     * @param recipient Recipient of the transfer
     * @param amount Amount to transfer
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }
    
    /**
     * @dev Burn tokens (can only be called if burn is enabled)
     * @param amount Amount to burn
     */
    function burn(uint256 amount) public {
        require(burnEnabled, "Burn is not enabled");
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from another address (can only be called if burn is enabled)
     * @param account Address to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address account, uint256 amount) public {
        require(burnEnabled, "Burn is not enabled");
        uint256 decreasedAllowance = allowance(account, msg.sender).sub(amount, "Burn amount exceeds allowance");
        _approve(account, msg.sender, decreasedAllowance);
        _burn(account, amount);
    }
    
    /**
     * @dev Mint new tokens (can only be called by owner)
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Update the description (can only be called by owner)
     * @param newDescription New description
     */
    function updateDescription(string memory newDescription) public onlyOwner {
        require(!contractLocked, "Contract is locked");
        
        string memory oldDescription = description;
        description = newDescription;
        
        emit DescriptionUpdated(oldDescription, newDescription);
    }
    
    /**
     * @dev Set whether burn is enabled (can only be called by owner)
     * @param enabled Whether burn is enabled
     */
    function setBurnEnabled(bool enabled) public onlyOwner {
        require(!contractLocked, "Contract is locked");
        
        burnEnabled = enabled;
        
        emit BurnEnabledUpdated(enabled);
    }
    
    /**
     * @dev Lock the contract to prevent future changes (can only be called by owner)
     * This is a one-way operation and cannot be undone
     */
    function lockContract() public onlyOwner {
        contractLocked = true;
        
        emit ContractLocked(true);
    }
    
    /**
     * @dev Lock liquidity pool tokens (can only be called by owner or GhostPad)
     * @param _liquidityPool Address of the liquidity pool
     */
    function lockLiquidity(address _liquidityPool) public {
        // Can be called by owner or by token deployer (GhostPad)
        require(msg.sender == owner() || msg.sender == tx.origin, "Unauthorized");
        require(_liquidityPool != address(0), "Invalid liquidity pool address");
        require(liquidityPool == address(0), "Liquidity already locked");
        
        liquidityPool = _liquidityPool;
        liquidityLockEndTime = block.timestamp.add(liquidityLockPeriod);
        
        emit LiquidityLocked(_liquidityPool, liquidityLockEndTime);
    }
    
    /**
     * @dev Unlock liquidity pool tokens (can only be called by owner after lock period)
     */
    function unlockLiquidity() public onlyOwner {
        require(liquidityPool != address(0), "No liquidity locked");
        require(block.timestamp >= liquidityLockEndTime, "Liquidity still locked");
        
        address pool = liquidityPool;
        liquidityPool = address(0);
        
        emit LiquidityUnlocked(pool);
    }
    
    // =============== VESTING FUNCTIONALITY (OPTIONAL) ===============
    
    /**
     * @dev Create a new vesting schedule
     * @param _beneficiary Address of the beneficiary to whom tokens will be released
     * @param _start Start time of the vesting period
     * @param _cliff Duration in seconds of the cliff after which tokens will start vesting
     * @param _duration Duration in seconds of the period in which the tokens will vest
     * @param _revocable Whether the vesting is revocable or not
     * @param _amount Total amount of tokens to be released at the end of the vesting
     */
    function createVestingSchedule(
        address _beneficiary,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration,
        bool _revocable,
        uint256 _amount
    ) public onlyOwner {
        require(vestingEnabled, "Vesting functionality is not enabled");
        require(_beneficiary != address(0), "Beneficiary cannot be the zero address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(_duration >= _cliff, "Duration must be greater than or equal to cliff");
        
        // Calculate vesting schedule ID
        bytes32 vestingScheduleId = computeVestingScheduleIdForAddressAndIndex(
            _beneficiary, holdersVestingCount[_beneficiary]
        );
        
        // Check that the token owner has enough balance
        uint256 ownerBalance = balanceOf(owner());
        require(ownerBalance >= vestingSchedulesTotalAmount.add(_amount), "Owner balance is not sufficient");
        
        // Create vesting schedule
        vestingSchedules[vestingScheduleId] = VestingSchedule({
            beneficiary: _beneficiary,
            cliff: _cliff,
            start: _start,
            duration: _duration,
            releasedAmount: 0,
            amountTotal: _amount,
            revocable: _revocable,
            revoked: false
        });
        
        // Update vesting schedule tracking
        vestingSchedulesIds.push(vestingScheduleId);
        holdersVestingCount[_beneficiary] = holdersVestingCount[_beneficiary].add(1);
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.add(_amount);
        
        emit VestingScheduleCreated(_beneficiary, _amount, _start, _cliff, _duration, _revocable);
    }
    
    /**
     * @dev Revoke a vesting schedule
     * @param vestingScheduleId ID of the vesting schedule to revoke
     */
    function revoke(bytes32 vestingScheduleId) public onlyOwner {
        require(vestingEnabled, "Vesting functionality is not enabled");
        VestingSchedule storage vestingSchedule = vestingSchedules[vestingScheduleId];
        require(vestingSchedule.revocable, "Vesting schedule is not revocable");
        require(!vestingSchedule.revoked, "Vesting schedule already revoked");
        
        // Calculate amount to transfer back to owner
        uint256 unreleased = vestingSchedule.amountTotal.sub(vestingSchedule.releasedAmount);
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.sub(unreleased);
        vestingSchedule.revoked = true;
        
        // Transfer unreleased tokens back to owner
        _transfer(address(this), owner(), unreleased);
        
        emit VestingScheduleRevoked(vestingScheduleId);
    }
    
    /**
     * @dev Release vested tokens
     * @param vestingScheduleId ID of the vesting schedule
     * @param amount Amount of tokens to release
     */
    function release(bytes32 vestingScheduleId, uint256 amount) public nonReentrant {
        require(vestingEnabled, "Vesting functionality is not enabled");
        VestingSchedule storage vestingSchedule = vestingSchedules[vestingScheduleId];
        require(msg.sender == vestingSchedule.beneficiary, "Only beneficiary can release tokens");
        require(!vestingSchedule.revoked, "Vesting schedule has been revoked");
        
        uint256 releasable = computeReleasableAmount(vestingScheduleId);
        require(releasable >= amount, "TokenVesting: no tokens are due");
        
        // Update released amount
        vestingSchedule.releasedAmount = vestingSchedule.releasedAmount.add(amount);
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.sub(amount);
        
        // Transfer tokens to beneficiary
        _transfer(address(this), vestingSchedule.beneficiary, amount);
        
        emit VestingReleased(vestingScheduleId, amount);
    }
    
    /**
     * @dev Get the total amount of tokens held in vesting schedules
     * @return The total amount of tokens in vesting schedules
     */
    function getVestingSchedulesTotalAmount() public view returns (uint256) {
        return vestingSchedulesTotalAmount;
    }
    
    /**
     * @dev Get the total number of vesting schedules
     * @return The total number of vesting schedules
     */
    function getVestingSchedulesCount() public view returns (uint256) {
        return vestingSchedulesIds.length;
    }
    
    /**
     * @dev Get the vesting schedule ID for an address and index
     * @param holder The address of the holder
     * @param index The index of the vesting schedule
     * @return The vesting schedule ID
     */
    function computeVestingScheduleIdForAddressAndIndex(address holder, uint256 index)
        public pure returns (bytes32) {
        return keccak256(abi.encodePacked(holder, index));
    }
    
    /**
     * @dev Get a vesting schedule
     * @param vestingScheduleId The ID of the vesting schedule
     * @return The vesting schedule
     */
    function getVestingSchedule(bytes32 vestingScheduleId)
        public view returns (VestingSchedule memory) {
        return vestingSchedules[vestingScheduleId];
    }
    
    /**
     * @dev Compute the releasable amount for a vesting schedule
     * @param vestingScheduleId The ID of the vesting schedule
     * @return The releasable amount
     */
    function computeReleasableAmount(bytes32 vestingScheduleId)
        public view returns (uint256) {
        VestingSchedule storage vestingSchedule = vestingSchedules[vestingScheduleId];
        if (vestingSchedule.revoked) {
            return 0;
        }
        return _computeReleasableAmount(vestingSchedule);
    }
    
    /**
     * @dev Compute the releasable amount for a vesting schedule
     * @param vestingSchedule The vesting schedule
     * @return The releasable amount
     */
    function _computeReleasableAmount(VestingSchedule memory vestingSchedule)
        internal view returns (uint256) {
        uint256 currentTime = block.timestamp;
        if (currentTime < vestingSchedule.start.add(vestingSchedule.cliff)) {
            return 0;
        } else if (currentTime >= vestingSchedule.start.add(vestingSchedule.duration)) {
            return vestingSchedule.amountTotal.sub(vestingSchedule.releasedAmount);
        } else {
            uint256 timeFromStart = currentTime.sub(vestingSchedule.start);
            uint256 vestedAmount = vestingSchedule.amountTotal.mul(timeFromStart).div(vestingSchedule.duration);
            return vestedAmount.sub(vestingSchedule.releasedAmount);
        }
    }
    
    /**
     * @dev Withdraw tokens from this contract (for accidental transfers)
     * @param token The ERC20 token address (use address(0) for Ether)
     * @param amount The amount to withdraw
     */
    function withdrawToken(address token, uint256 amount) public onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20Upgradeable(token).transfer(owner(), amount);
        }
    }
    
    /**
     * @dev Allow the contract to receive ETH
     */
    receive() external payable {}
} 