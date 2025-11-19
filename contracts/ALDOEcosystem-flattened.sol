// SPDX-License-Identifier: MIT

// Sources flattened with hardhat v2.27.0 https://hardhat.org


// File @openzeppelin/contracts/utils/Context.sol@v4.9.6

// OpenZeppelin Contracts (last updated v4.9.4) (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v4.9.6

// OpenZeppelin Contracts (last updated v4.9.0) (access/Ownable.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File @openzeppelin/contracts/security/ReentrancyGuard.sol@v4.9.6

// OpenZeppelin Contracts (last updated v4.9.0) (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == _ENTERED;
    }
}


// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v4.9.6

// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}


// File contracts/ALDOEcosystem.sol

pragma solidity ^0.8.20;



/**
 * @title ALDOEcosystem - Complete DeFi Platform for ALDO Token
 * @notice Includes: Staking, Governance, Vesting, Airdrop, Multi-tier system
 */
contract ALDOEcosystem is Ownable, ReentrancyGuard {
    IERC20 public aldoToken;
    
    // ============ STAKING SYSTEM ============
    
    enum StakeTier { NONE, BRONZE, SILVER, GOLD, PLATINUM }
    
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 totalRewardsClaimed;
        StakeTier tier;
        bool isActive;
    }
    
    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    
    // Tier requirements (minimum stake amount)
    uint256 public constant BRONZE_MIN = 1000 * 10**18;    // 1,000 ALDO
    uint256 public constant SILVER_MIN = 5000 * 10**18;    // 5,000 ALDO
    uint256 public constant GOLD_MIN = 25000 * 10**18;     // 25,000 ALDO
    uint256 public constant PLATINUM_MIN = 100000 * 10**18; // 100,000 ALDO
    
    // APY rates per tier (basis points: 1000 = 10%)
    uint256 public constant BRONZE_APY = 1000;    // 10%
    uint256 public constant SILVER_APY = 1500;    // 15%
    uint256 public constant GOLD_APY = 2000;      // 20%
    uint256 public constant PLATINUM_APY = 3000;  // 30%
    
    uint256 public constant SECONDS_PER_YEAR = 31536000;
    
    // ============ GOVERNANCE SYSTEM ============
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool exists;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public voteWeight;
    
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_PROPOSAL_STAKE = 10000 * 10**18; // Need 10k ALDO staked to propose
    
    // ============ VESTING SYSTEM ============
    
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 claimedAmount;
        uint256 startTime;
        uint256 duration;
        uint256 cliffDuration;
        bool revocable;
        bool revoked;
    }
    
    mapping(address => VestingSchedule[]) public vestingSchedules;
    
    // ============ AIRDROP SYSTEM ============
    
    struct Airdrop {
        uint256 id;
        uint256 totalAmount;
        uint256 amountPerUser;
        uint256 startTime;
        uint256 endTime;
        bool active;
        mapping(address => bool) claimed;
        address[] eligibleUsers;
    }
    
    mapping(uint256 => Airdrop) public airdrops;
    uint256 public airdropCount;
    
    // ============ EVENTS ============
    
    event Staked(address indexed user, uint256 amount, StakeTier tier);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 reward);
    event TierUpgraded(address indexed user, StakeTier oldTier, StakeTier newTier);
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    
    event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 duration);
    event VestingClaimed(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 scheduleIndex);
    
    event AirdropCreated(uint256 indexed airdropId, uint256 totalAmount);
    event AirdropClaimed(uint256 indexed airdropId, address indexed user, uint256 amount);
    
    constructor(address _aldoToken){
        aldoToken = IERC20(_aldoToken);
    }
    
    // ============ STAKING FUNCTIONS ============
    
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        
        StakeInfo storage userStake = stakes[msg.sender];
        
        if (userStake.isActive && userStake.amount > 0) {
            _claimRewards();
        }
        
        require(
            aldoToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        if (!userStake.isActive) {
            userStake.startTime = block.timestamp;
            userStake.lastClaimTime = block.timestamp;
            userStake.isActive = true;
        }
        
        userStake.amount += amount;
        totalStaked += amount;
        
        StakeTier oldTier = userStake.tier;
        userStake.tier = _calculateTier(userStake.amount);
        
        if (oldTier != userStake.tier) {
            emit TierUpgraded(msg.sender, oldTier, userStake.tier);
        }
        
        emit Staked(msg.sender, amount, userStake.tier);
    }
    
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.isActive, "No active stake");
        require(userStake.amount >= amount, "Insufficient staked amount");
        
        _claimRewards();
        
        userStake.amount -= amount;
        totalStaked -= amount;
        
        if (userStake.amount == 0) {
            userStake.isActive = false;
            userStake.tier = StakeTier.NONE;
        } else {
            userStake.tier = _calculateTier(userStake.amount);
        }
        
        require(aldoToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
    
    function claimRewards() external nonReentrant {
        require(stakes[msg.sender].isActive, "No active stake");
        _claimRewards();
    }
    
    function _claimRewards() internal {
        StakeInfo storage userStake = stakes[msg.sender];
        uint256 reward = calculateRewards(msg.sender);
        
        if (reward > 0) {
            userStake.lastClaimTime = block.timestamp;
            userStake.totalRewardsClaimed += reward;
            
            require(aldoToken.transfer(msg.sender, reward), "Reward transfer failed");
            
            emit RewardsClaimed(msg.sender, reward);
        }
    }
    
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        
        if (!userStake.isActive || userStake.amount == 0) {
            return 0;
        }
        
        uint256 apyRate = _getAPYForTier(userStake.tier);
        uint256 timeStaked = block.timestamp - userStake.lastClaimTime;
        uint256 reward = (userStake.amount * apyRate * timeStaked) / (10000 * SECONDS_PER_YEAR);
        
        return reward;
    }
    
    function _calculateTier(uint256 amount) internal pure returns (StakeTier) {
        if (amount >= PLATINUM_MIN) return StakeTier.PLATINUM;
        if (amount >= GOLD_MIN) return StakeTier.GOLD;
        if (amount >= SILVER_MIN) return StakeTier.SILVER;
        if (amount >= BRONZE_MIN) return StakeTier.BRONZE;
        return StakeTier.NONE;
    }
    
    function _getAPYForTier(StakeTier tier) internal pure returns (uint256) {
        if (tier == StakeTier.PLATINUM) return PLATINUM_APY;
        if (tier == StakeTier.GOLD) return GOLD_APY;
        if (tier == StakeTier.SILVER) return SILVER_APY;
        if (tier == StakeTier.BRONZE) return BRONZE_APY;
        return 0;
    }
    
    function getStakeInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 pendingRewards,
        uint256 totalClaimed,
        StakeTier tier,
        string memory tierName,
        uint256 apyRate
    ) {
        StakeInfo memory userStake = stakes[user];
        stakedAmount = userStake.amount;
        pendingRewards = calculateRewards(user);
        totalClaimed = userStake.totalRewardsClaimed;
        tier = userStake.tier;
        tierName = _getTierName(userStake.tier);
        apyRate = _getAPYForTier(userStake.tier);
    }
    
    function _getTierName(StakeTier tier) internal pure returns (string memory) {
        if (tier == StakeTier.PLATINUM) return "Platinum";
        if (tier == StakeTier.GOLD) return "Gold";
        if (tier == StakeTier.SILVER) return "Silver";
        if (tier == StakeTier.BRONZE) return "Bronze";
        return "None";
    }
    
    // ============ GOVERNANCE FUNCTIONS ============
    
    function createProposal(
        string memory title,
        string memory description
    ) external returns (uint256) {
        require(stakes[msg.sender].amount >= MIN_PROPOSAL_STAKE, "Need 10k ALDO staked to propose");
        
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        
        newProposal.id = proposalCount;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        newProposal.exists = true;
        
        emit ProposalCreated(proposalCount, msg.sender, title);
        
        return proposalCount;
    }
    
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.exists, "Proposal does not exist");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(stakes[msg.sender].isActive, "Must be staker to vote");
        
        uint256 votingPower = stakes[msg.sender].amount;
        hasVoted[proposalId][msg.sender] = true;
        voteWeight[proposalId][msg.sender] = votingPower;
        
        if (support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }
        
        emit Voted(proposalId, msg.sender, support, votingPower);
    }
    
    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.exists, "Proposal does not exist");
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId);
    }
    
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 endTime,
        bool executed,
        bool isActive
    ) {
        Proposal memory proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.endTime,
            proposal.executed,
            block.timestamp <= proposal.endTime
        );
    }
    
    // ============ VESTING FUNCTIONS ============
    
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 duration,
        uint256 cliffDuration,
        bool revocable
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(duration > 0, "Duration must be > 0");
        require(cliffDuration <= duration, "Cliff too long");
        
        require(
            aldoToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        VestingSchedule memory schedule = VestingSchedule({
            totalAmount: amount,
            claimedAmount: 0,
            startTime: block.timestamp,
            duration: duration,
            cliffDuration: cliffDuration,
            revocable: revocable,
            revoked: false
        });
        
        vestingSchedules[beneficiary].push(schedule);
        
        emit VestingScheduleCreated(beneficiary, amount, duration);
    }
    
    function claimVested(uint256 scheduleIndex) external nonReentrant {
        require(scheduleIndex < vestingSchedules[msg.sender].length, "Invalid schedule");
        
        VestingSchedule storage schedule = vestingSchedules[msg.sender][scheduleIndex];
        require(!schedule.revoked, "Schedule revoked");
        require(block.timestamp >= schedule.startTime + schedule.cliffDuration, "Cliff not reached");
        
        uint256 vested = _calculateVestedAmount(schedule);
        uint256 claimable = vested - schedule.claimedAmount;
        
        require(claimable > 0, "No tokens to claim");
        
        schedule.claimedAmount += claimable;
        
        require(aldoToken.transfer(msg.sender, claimable), "Transfer failed");
        
        emit VestingClaimed(msg.sender, claimable);
    }
    
    function _calculateVestedAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }
        
        if (block.timestamp >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount;
        }
        
        uint256 timeVested = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * timeVested) / schedule.duration;
    }
    
    function revokeVesting(address beneficiary, uint256 scheduleIndex) external onlyOwner {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid schedule");
        
        VestingSchedule storage schedule = vestingSchedules[beneficiary][scheduleIndex];
        require(schedule.revocable, "Not revocable");
        require(!schedule.revoked, "Already revoked");
        
        uint256 vested = _calculateVestedAmount(schedule);
        uint256 claimable = vested - schedule.claimedAmount;
        
        if (claimable > 0) {
            schedule.claimedAmount += claimable;
            require(aldoToken.transfer(beneficiary, claimable), "Transfer failed");
        }
        
        schedule.revoked = true;
        uint256 remaining = schedule.totalAmount - schedule.claimedAmount;
        
        if (remaining > 0) {
            require(aldoToken.transfer(owner(), remaining), "Return transfer failed");
        }
        
        emit VestingRevoked(beneficiary, scheduleIndex);
    }
    
    function getVestingInfo(address beneficiary, uint256 scheduleIndex) external view returns (
        uint256 totalAmount,
        uint256 claimedAmount,
        uint256 vestedAmount,
        uint256 claimableAmount,
        uint256 startTime,
        uint256 endTime,
        bool revoked
    ) {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid schedule");
        
        VestingSchedule memory schedule = vestingSchedules[beneficiary][scheduleIndex];
        
        totalAmount = schedule.totalAmount;
        claimedAmount = schedule.claimedAmount;
        vestedAmount = _calculateVestedAmount(schedule);
        claimableAmount = vestedAmount > claimedAmount ? vestedAmount - claimedAmount : 0;
        startTime = schedule.startTime;
        endTime = schedule.startTime + schedule.duration;
        revoked = schedule.revoked;
    }
    
    // ============ AIRDROP FUNCTIONS ============
    
    function createAirdrop(
        uint256 amountPerUser,
        address[] memory eligibleUsers,
        uint256 duration
    ) external onlyOwner returns (uint256) {
        require(eligibleUsers.length > 0, "No eligible users");
        require(amountPerUser > 0, "Amount must be > 0");
        
        uint256 totalAmount = amountPerUser * eligibleUsers.length;
        
        require(
            aldoToken.transferFrom(msg.sender, address(this), totalAmount),
            "Transfer failed"
        );
        
        airdropCount++;
        Airdrop storage newAirdrop = airdrops[airdropCount];
        
        newAirdrop.id = airdropCount;
        newAirdrop.totalAmount = totalAmount;
        newAirdrop.amountPerUser = amountPerUser;
        newAirdrop.startTime = block.timestamp;
        newAirdrop.endTime = block.timestamp + duration;
        newAirdrop.active = true;
        newAirdrop.eligibleUsers = eligibleUsers;
        
        emit AirdropCreated(airdropCount, totalAmount);
        
        return airdropCount;
    }
    
    function claimAirdrop(uint256 airdropId) external nonReentrant {
        Airdrop storage airdrop = airdrops[airdropId];
        require(airdrop.active, "Airdrop not active");
        require(block.timestamp <= airdrop.endTime, "Airdrop ended");
        require(!airdrop.claimed[msg.sender], "Already claimed");
        require(_isEligible(airdropId, msg.sender), "Not eligible");
        
        airdrop.claimed[msg.sender] = true;
        
        require(
            aldoToken.transfer(msg.sender, airdrop.amountPerUser),
            "Transfer failed"
        );
        
        emit AirdropClaimed(airdropId, msg.sender, airdrop.amountPerUser);
    }
    
    function _isEligible(uint256 airdropId, address user) internal view returns (bool) {
        Airdrop storage airdrop = airdrops[airdropId];
        for (uint256 i = 0; i < airdrop.eligibleUsers.length; i++) {
            if (airdrop.eligibleUsers[i] == user) {
                return true;
            }
        }
        return false;
    }
    
    function getAirdropInfo(uint256 airdropId) external view returns (
        uint256 totalAmount,
        uint256 amountPerUser,
        uint256 endTime,
        bool active,
        bool userClaimed,
        bool userEligible
    ) {
        Airdrop storage airdrop = airdrops[airdropId];
        return (
            airdrop.totalAmount,
            airdrop.amountPerUser,
            airdrop.endTime,
            airdrop.active,
            airdrop.claimed[msg.sender],
            _isEligible(airdropId, msg.sender)
        );
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    function depositRewards(uint256 amount) external onlyOwner {
        require(
            aldoToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = aldoToken.balanceOf(address(this));
        require(aldoToken.transfer(owner(), balance), "Transfer failed");
    }
}
