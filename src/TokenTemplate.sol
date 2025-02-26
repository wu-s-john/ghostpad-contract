// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenTemplate
 * @dev A template contract for creating new memecoin tokens
 * This contract will be cloned using the minimal proxy pattern for gas efficiency
 */
contract TokenTemplate is ERC20, Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    
    bool private initialized = false;
    bool public contractLocked = false; // Whether certain functions are locked to prevent changes
    
    // Description of the token
    string public description;
    
    // Transaction tax settings
    uint256 public taxRate; // Tax rate in basis points (1/100 of a percent, e.g., 100 = 1%)
    address public taxRecipient; // Address that receives the tax
    
    // Burn settings
    bool public burnEnabled;
    
    // Liquidity lock settings
    uint256 public liquidityLockPeriod;
    address public liquidityPool;
    uint256 public liquidityLockEndTime;
    
    // Vesting settings
    bool public vestingEnabled; // Whether vesting functionality is enabled
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
    event TaxRateUpdated(uint256 oldRate, uint256 newRate);
    event TaxRecipientUpdated(address oldRecipient, address newRecipient);
    event DescriptionUpdated(string oldDescription, string newDescription);
    event BurnEnabledUpdated(bool enabled);
    event ContractLocked(bool locked);
    event LiquidityLocked(address liquidityPool, uint256 unlockTime);
    event LiquidityUnlocked(address liquidityPool);
    event VestingScheduleCreated(address beneficiary, uint256 amount, uint256 start, uint256 cliff, uint256 duration, bool revocable);
    event VestingScheduleRevoked(bytes32 vestingScheduleId);
    event VestingReleased(bytes32 vestingScheduleId, uint256 amount);
    
    /**
     * @dev Constructor
     * Called when this contract is deployed, not when proxies are deployed
     */
    constructor() public ERC20("Template", "TEMP") {
        // This constructor is only used for the original template, not the clones
    }
    
    /**
     * @dev Initialize the token (can only be called once)
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply Initial supply of tokens
     * @param owner Owner of the token
     * @param _description Description of the token
     * @param _taxRate Tax rate in basis points
     * @param _taxRecipient Address that receives the tax
     * @param _burnEnabled Whether burn is enabled
     * @param _liquidityLockPeriod Period for locking liquidity
     * @param _vestingEnabled Whether vesting functionality is enabled
     */
    function initialize(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner,
        string memory _description,
        uint256 _taxRate,
        address _taxRecipient,
        bool _burnEnabled,
        uint256 _liquidityLockPeriod,
        bool _vestingEnabled
    ) external {
        require(!initialized, "Contract already initialized");
        require(owner != address(0), "Owner cannot be the zero address");
        
        // Initialize ERC20
        super._setupDecimals(18);
        // Since we can't set name and symbol directly as they're immutable in ERC20,
        // we'll use the values in the UI layer instead of the contract
        _mint(msg.sender, initialSupply);
        
        // Set owner
        transferOwnership(owner);
        
        // Set token properties
        description = _description;
        taxRate = _taxRate;
        taxRecipient = _taxRecipient;
        burnEnabled = _burnEnabled;
        liquidityLockPeriod = _liquidityLockPeriod;
        vestingEnabled = _vestingEnabled;
        
        initialized = true;
        
        emit Initialized(name, symbol, initialSupply, owner);
    }
    
    /**
     * @dev Override transfer function to apply tax if tax rate is greater than 0
     * @param recipient Recipient of the transfer
     * @param amount Amount to transfer
     */
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // If tax rate is 0 or recipient is the owner or tax recipient, use normal transfer
        if (taxRate == 0 || recipient == owner() || recipient == taxRecipient) {
            return super.transfer(recipient, amount);
        }
        
        // Calculate tax amount
        uint256 taxAmount = amount.mul(taxRate).div(10000);
        uint256 transferAmount = amount.sub(taxAmount);
        
        // Transfer tax to tax recipient if tax amount is greater than 0
        if (taxAmount > 0 && taxRecipient != address(0)) {
            super.transfer(taxRecipient, taxAmount);
        }
        
        // Transfer remaining amount to recipient
        return super.transfer(recipient, transferAmount);
    }
    
    /**
     * @dev Override transferFrom function to apply tax if tax rate is greater than 0
     * @param sender Sender of the transfer
     * @param recipient Recipient of the transfer
     * @param amount Amount to transfer
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        // If tax rate is 0 or recipient is the owner or tax recipient, use normal transferFrom
        if (taxRate == 0 || recipient == owner() || recipient == taxRecipient) {
            return super.transferFrom(sender, recipient, amount);
        }
        
        // Calculate tax amount
        uint256 taxAmount = amount.mul(taxRate).div(10000);
        uint256 transferAmount = amount.sub(taxAmount);
        
        // Transfer tax to tax recipient if tax amount is greater than 0
        if (taxAmount > 0 && taxRecipient != address(0)) {
            super.transferFrom(sender, taxRecipient, taxAmount);
        }
        
        // Transfer remaining amount to recipient
        return super.transferFrom(sender, recipient, transferAmount);
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
     * @dev Update the tax rate (can only be called by owner)
     * @param newTaxRate New tax rate in basis points
     */
    function updateTaxRate(uint256 newTaxRate) public onlyOwner {
        require(!contractLocked, "Contract is locked");
        
        uint256 oldTaxRate = taxRate;
        taxRate = newTaxRate;
        
        emit TaxRateUpdated(oldTaxRate, newTaxRate);
    }
    
    /**
     * @dev Update the tax recipient (can only be called by owner)
     * @param newTaxRecipient New tax recipient address
     */
    function updateTaxRecipient(address newTaxRecipient) public onlyOwner {
        require(!contractLocked, "Contract is locked");
        
        address oldTaxRecipient = taxRecipient;
        taxRecipient = newTaxRecipient;
        
        emit TaxRecipientUpdated(oldTaxRecipient, newTaxRecipient);
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
            IERC20(token).transfer(owner(), amount);
        }
    }
    
    /**
     * @dev Allow the contract to receive ETH
     */
    receive() external payable {}
} 