// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ALDOEcosystem is Ownable, ReentrancyGuard {
    IERC20 public immutable aldoToken;

    // ========== STAKING CONFIGURATION ==========
    uint256 public constant BRONZE_MIN = 100 * 10**18;      // 100 ALDO
    uint256 public constant SILVER_MIN = 1000 * 10**18;     // 1,000 ALDO
    uint256 public constant GOLD_MIN = 10000 * 10**18;      // 10,000 ALDO
    uint256 public constant PLATINUM_MIN = 100000 * 10**18; // 100,000 ALDO

    uint256 public constant BRONZE_APY = 10;    // 10%
    uint256 public constant SILVER_APY = 15;    // 15%
    uint256 public constant GOLD_APY = 20;      // 20%
    uint256 public constant PLATINUM_APY = 30;  // 30%

    uint256 public constant SECONDS_PER_YEAR = 365 days;

    enum Tier { NONE, BRONZE, SILVER, GOLD, PLATINUM }

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 totalRewardsClaimed;
        Tier tier;
        bool isActive;
    }

    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;

    // ========== GOVERNANCE CONFIGURATION ==========
    uint256 public constant MIN_PROPOSAL_STAKE = 1000 * 10**18; // 1,000 ALDO minimum untuk create proposal
    uint256 public constant VOTING_PERIOD = 7 days;

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

    // ========== VESTING CONFIGURATION ==========
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

    // ========== AIRDROP CONFIGURATION ==========
    struct Airdrop {
        uint256 id;
        uint256 totalAmount;
        uint256 amountPerUser;
        uint256 endTime;
        bool active;
        mapping(address => bool) eligibleUsers;
        mapping(address => bool) claimed;
    }

    mapping(uint256 => Airdrop) public airdrops;
    uint256 public airdropCount;

    // ========== EVENTS ==========
    event Staked(address indexed user, uint256 amount, Tier tier);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 reward);
    event TierUpgraded(address indexed user, Tier oldTier, Tier newTier);

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);

    event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 duration);
    event VestingClaimed(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 scheduleIndex);

    event AirdropCreated(uint256 indexed airdropId, uint256 totalAmount);
    event AirdropClaimed(uint256 indexed airdropId, address indexed user, uint256 amount);

    constructor(address _aldoToken) Ownable(msg.sender) {
        aldoToken = IERC20(_aldoToken);
    }

    // ========== STAKING FUNCTIONS ==========
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        StakeInfo storage userStake = stakes[msg.sender];
        
        // Claim pending rewards first
        if (userStake.isActive) {
            _claimRewards();
        }

        // Transfer tokens
        require(aldoToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Update stake
        userStake.amount += amount;
        userStake.startTime = block.timestamp;
        userStake.lastClaimTime = block.timestamp;
        userStake.isActive = true;

        totalStaked += amount;

        // Calculate tier
        Tier oldTier = userStake.tier;
        Tier newTier = _calculateTier(userStake.amount);
        userStake.tier = newTier;

        emit Staked(msg.sender, amount, newTier);
        if (newTier > oldTier) {
            emit TierUpgraded(msg.sender, oldTier, newTier);
        }
    }

    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.isActive, "No active stake");
        require(amount > 0 && amount <= userStake.amount, "Invalid amount");

        // Claim pending rewards first
        _claimRewards();

        // Update stake
        userStake.amount -= amount;
        totalStaked -= amount;

        if (userStake.amount == 0) {
            userStake.isActive = false;
            userStake.tier = Tier.NONE;
        } else {
            userStake.tier = _calculateTier(userStake.amount);
        }

        // Transfer tokens back
        require(aldoToken.transfer(msg.sender, amount), "Transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external nonReentrant {
        _claimRewards();
    }

    function _claimRewards() internal {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.isActive, "No active stake");

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
        if (!userStake.isActive || userStake.amount == 0) return 0;

        uint256 timeStaked = block.timestamp - userStake.lastClaimTime;
        uint256 apy = _getAPY(userStake.tier);
        
        return (userStake.amount * apy * timeStaked) / (100 * SECONDS_PER_YEAR);
    }

    function _calculateTier(uint256 amount) internal pure returns (Tier) {
        if (amount >= PLATINUM_MIN) return Tier.PLATINUM;
        if (amount >= GOLD_MIN) return Tier.GOLD;
        if (amount >= SILVER_MIN) return Tier.SILVER;
        if (amount >= BRONZE_MIN) return Tier.BRONZE;
        return Tier.NONE;
    }

    function _getAPY(Tier tier) internal pure returns (uint256) {
        if (tier == Tier.PLATINUM) return PLATINUM_APY;
        if (tier == Tier.GOLD) return GOLD_APY;
        if (tier == Tier.SILVER) return SILVER_APY;
        if (tier == Tier.BRONZE) return BRONZE_APY;
        return 0;
    }

    function getStakeInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 pendingRewards,
        uint256 totalClaimed,
        Tier tier,
        string memory tierName,
        uint256 apyRate
    ) {
        StakeInfo memory userStake = stakes[user];
        stakedAmount = userStake.amount;
        pendingRewards = calculateRewards(user);
        totalClaimed = userStake.totalRewardsClaimed;
        tier = userStake.tier;
        tierName = _getTierName(tier);
        apyRate = _getAPY(tier);
    }

    function _getTierName(Tier tier) internal pure returns (string memory) {
        if (tier == Tier.PLATINUM) return "PLATINUM";
        if (tier == Tier.GOLD) return "GOLD";
        if (tier == Tier.SILVER) return "SILVER";
        if (tier == Tier.BRONZE) return "BRONZE";
        return "NONE";
    }

    // ========== GOVERNANCE FUNCTIONS ==========
    function createProposal(string memory title, string memory description) external returns (uint256) {
        require(stakes[msg.sender].amount >= MIN_PROPOSAL_STAKE, "Need 1000 ALDO staked");
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + VOTING_PERIOD;
        proposal.exists = true;

        emit ProposalCreated(proposalId, msg.sender, title);
        return proposalId;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.exists, "Proposal doesn't exist");
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(stakes[msg.sender].isActive, "Must be staker");

        uint256 weight = stakes[msg.sender].amount;
        hasVoted[proposalId][msg.sender] = true;
        voteWeight[proposalId][msg.sender] = weight;

        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }

        emit Voted(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.exists, "Proposal doesn't exist");
        require(block.timestamp >= proposal.endTime, "Voting not ended");
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
        require(proposal.exists, "Proposal doesn't exist");
        
        return (
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.endTime,
            proposal.executed,
            block.timestamp < proposal.endTime
        );
    }

    // ========== VESTING FUNCTIONS ==========
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 duration,
        uint256 cliffDuration,
        bool revocable
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(duration > cliffDuration, "Invalid duration");

        require(aldoToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

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
        require(scheduleIndex < vestingSchedules[msg.sender].length, "Invalid index");
        
        VestingSchedule storage schedule = vestingSchedules[msg.sender][scheduleIndex];
        require(!schedule.revoked, "Schedule revoked");
        require(block.timestamp >= schedule.startTime + schedule.cliffDuration, "Cliff not reached");

        uint256 vested = _calculateVested(schedule);
        uint256 claimable = vested - schedule.claimedAmount;
        require(claimable > 0, "Nothing to claim");

        schedule.claimedAmount += claimable;
        require(aldoToken.transfer(msg.sender, claimable), "Transfer failed");

        emit VestingClaimed(msg.sender, claimable);
    }

    function _calculateVested(VestingSchedule memory schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
            return 0;
        }

        if (block.timestamp >= schedule.startTime + schedule.duration) {
            return schedule.totalAmount;
        }

        uint256 timePassed = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * timePassed) / schedule.duration;
    }

    function revokeVesting(address beneficiary, uint256 scheduleIndex) external onlyOwner {
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid index");
        
        VestingSchedule storage schedule = vestingSchedules[beneficiary][scheduleIndex];
        require(schedule.revocable, "Not revocable");
        require(!schedule.revoked, "Already revoked");

        schedule.revoked = true;
        
        uint256 vested = _calculateVested(schedule);
        uint256 unvested = schedule.totalAmount - vested;
        
        if (unvested > 0) {
            require(aldoToken.transfer(owner(), unvested), "Transfer failed");
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
        require(scheduleIndex < vestingSchedules[beneficiary].length, "Invalid index");
        
        VestingSchedule memory schedule = vestingSchedules[beneficiary][scheduleIndex];
        uint256 vested = _calculateVested(schedule);
        
        return (
            schedule.totalAmount,
            schedule.claimedAmount,
            vested,
            vested - schedule.claimedAmount,
            schedule.startTime,
            schedule.startTime + schedule.duration,
            schedule.revoked
        );
    }

    // ========== AIRDROP FUNCTIONS ==========
    function createAirdrop(
        uint256 amountPerUser,
        address[] calldata eligibleUsers,
        uint256 duration
    ) external onlyOwner returns (uint256) {
        require(amountPerUser > 0, "Amount must be > 0");
        require(eligibleUsers.length > 0, "No users");

        uint256 airdropId = airdropCount++;
        uint256 totalAmount = amountPerUser * eligibleUsers.length;

        require(aldoToken.transferFrom(msg.sender, address(this), totalAmount), "Transfer failed");

        Airdrop storage airdrop = airdrops[airdropId];
        airdrop.id = airdropId;
        airdrop.totalAmount = totalAmount;
        airdrop.amountPerUser = amountPerUser;
        airdrop.endTime = block.timestamp + duration;
        airdrop.active = true;

        for (uint256 i = 0; i < eligibleUsers.length; i++) {
            airdrop.eligibleUsers[eligibleUsers[i]] = true;
        }

        emit AirdropCreated(airdropId, totalAmount);
        return airdropId;
    }

    function claimAirdrop(uint256 airdropId) external nonReentrant {
        Airdrop storage airdrop = airdrops[airdropId];
        require(airdrop.active, "Airdrop not active");
        require(block.timestamp < airdrop.endTime, "Airdrop ended");
        require(airdrop.eligibleUsers[msg.sender], "Not eligible");
        require(!airdrop.claimed[msg.sender], "Already claimed");

        airdrop.claimed[msg.sender] = true;
        require(aldoToken.transfer(msg.sender, airdrop.amountPerUser), "Transfer failed");

        emit AirdropClaimed(airdropId, msg.sender, airdrop.amountPerUser);
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
            airdrop.eligibleUsers[msg.sender]
        );
    }

    // ========== ADMIN FUNCTIONS ==========
    function depositRewards(uint256 amount) external onlyOwner {
        require(aldoToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = aldoToken.balanceOf(address(this));
        require(aldoToken.transfer(owner(), balance), "Transfer failed");
    }
}