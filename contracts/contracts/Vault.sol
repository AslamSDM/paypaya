//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./ERC4626Fees.sol";

interface IERC20_J {
	function totalSupply() external view returns (uint256);

	function balanceOf(address account) external view returns (uint256);

	function transfer(address to, uint256 amount) external returns (bool);

	function allowance(
		address owner,
		address spender
	) external view returns (uint256);

	function approve(address spender, uint256 amount) external returns (bool);

	function transferFrom(
		address from,
		address to,
		uint256 amount
	) external returns (bool);
}

contract Vault is ERC4626Fees {
	struct loanDetails {
		uint256 amount;
		uint8 remaining_tenures;
		uint8 total_tenures;
		uint256 tenure_size;
		uint256 loan_taken_time;
		uint256 next_tenure_due;
		uint256 last_day_of_repayment;
		uint256 vUDSC_released_every_tenure;
	}

	struct userDetails {
		uint256 credit_worthiness;
		uint256 credit_available;
		bool world_id_verified;
	}

	address payable public vaultOwner;
	uint256 public entryFeeBasisPoints;
	mapping(address => uint256) depositTime;
	mapping(address => uint256) depositAmount;
	mapping(address => bool) isLoanPending;
	mapping(address => userDetails) public address_to_user;
	mapping(address => loanDetails[]) public user_to_loan_mapping;
	// mapping(address => bool) public world_id_verified;
	IERC20 immutable USDC_TOKEN;

	constructor(
		IERC20 _asset,
		uint256 _basisPoints
	) ERC4626(_asset) ERC20("Vault USDC Token", "vUSDC") {
		vaultOwner = payable(msg.sender);
		entryFeeBasisPoints = _basisPoints;
		USDC_TOKEN = _asset;
	}

	modifier validRepay(uint8 id) {
		loanDetails memory loan_being_repayed = user_to_loan_mapping[
			msg.sender
		][id];
		// require loan to exist for the msg.sender
		require(
			loan_being_repayed.amount != 0 &&
				loan_being_repayed.last_day_of_repayment != 0 &&
				loan_being_repayed.loan_taken_time != 0 &&
				loan_being_repayed.next_tenure_due != 0 &&
				loan_being_repayed.remaining_tenures != 0 &&
				loan_being_repayed.tenure_size != 0 &&
				loan_being_repayed.total_tenures != 0,
			"This is not a valid loan"
		);
		// require the msg.sender to have proper allowance to loan contract
		require(
			loan_being_repayed.tenure_size <=
				USDC_TOKEN.allowance(msg.sender, address(this)),
			"You have no proper allowance"
		);
		// require the msg.sender balance of to be greatre than the tenure size
		require(
			USDC_TOKEN.balanceOf(msg.sender) >= loan_being_repayed.tenure_size,
			"You dont have enough balance"
		);

		_;
	}

	modifier validateLoan(uint256 loanAmount) {
		userDetails memory user = address_to_user[msg.sender];
		require(user.credit_worthiness > 0, "You are not eligible");
		require(
			user.credit_available >= loanAmount,
			"Clear debts before taking new loan"
		);
		require(
			IERC20(address(this)).allowance(msg.sender, address(this)) >
				calculate_loan_ratio(msg.sender, loanAmount),
			"Not enough approval"
		);
		_;
	}
	modifier onlyOwner() {
		require(msg.sender == vaultOwner, "Only owner can update");
		_;
	}
	modifier userDoesNotExist() {
		require(
			address_to_user[msg.sender].credit_worthiness == 0 &&
				address_to_user[msg.sender].credit_available == 0,
			"User already exists"
		);
		_;
	}

	function create_user(
		address user_addr,
		uint256 initial_credit_worthiness,
		uint256 initial_credit_available,
		bool world_id_verified_q
	) public userDoesNotExist {
		address_to_user[user_addr] = userDetails({
			credit_worthiness: initial_credit_worthiness,
			credit_available: initial_credit_available,
			world_id_verified: world_id_verified_q
		});
	}

	function calculate_loan_ratio(
		address user_address,
		uint256 loanAmount
	) private view returns (uint256) {
		userDetails memory user = address_to_user[user_address];
		uint256 balanceof_user = IERC20(address(this)).balanceOf(user_address);

		return (loanAmount * balanceof_user) / user.credit_worthiness;
	}

	function calculate_and_populate_loan(
		address userAddress,
		uint256 loanAmount,
		uint8 splits
	) private {
		userDetails storage user = address_to_user[userAddress];
		uint256 loan_amount_added_with_interest = loanAmount + (loanAmount / 5);
		user.credit_available =
			user.credit_available -
			loan_amount_added_with_interest;
		uint256 tenure_size = (loan_amount_added_with_interest / splits);
		uint256 loan_taken_time = block.timestamp;
		uint256 next_tenure_due = loan_taken_time + (30 days);
		uint256 last_day_of_repayment = loan_taken_time +
			(30 days * uint256(splits));
		uint256 vUDSC_released_every_tenure = (
			calculate_loan_ratio(userAddress, loanAmount)
		) / splits;
		user_to_loan_mapping[userAddress].push(
			loanDetails({
				amount: loan_amount_added_with_interest,
				remaining_tenures: splits,
				total_tenures: splits,
				tenure_size: tenure_size,
				loan_taken_time: loan_taken_time,
				next_tenure_due: next_tenure_due,
				last_day_of_repayment: last_day_of_repayment,
				vUDSC_released_every_tenure: vUDSC_released_every_tenure
			})
		);
	}

	function removeLoan(address repayer, uint8 loanID) private {
		loanDetails[] storage availableLoans = user_to_loan_mapping[repayer];
		availableLoans[loanID] = availableLoans[availableLoans.length - 1];
		availableLoans.pop();
		isLoanPending[repayer] = false;
	}

	function calculate_and_populate_repay(
		address repayer,
		uint8 loanID
	) private {
		loanDetails memory currentLoan = user_to_loan_mapping[repayer][loanID];
		if (currentLoan.remaining_tenures == 1) {
			removeLoan(repayer, loanID);
		} else {
			address_to_user[repayer].credit_available =
				address_to_user[repayer].credit_available +
				currentLoan.tenure_size;
			uint256 next_tenure_due = block.timestamp + 30 days;
			uint8 remaining_tenures = currentLoan.remaining_tenures - 1;

			user_to_loan_mapping[repayer][loanID] = loanDetails({
				amount: currentLoan.amount,
				remaining_tenures: remaining_tenures,
				total_tenures: currentLoan.total_tenures,
				tenure_size: currentLoan.tenure_size,
				loan_taken_time: currentLoan.loan_taken_time,
				next_tenure_due: next_tenure_due,
				last_day_of_repayment: currentLoan.last_day_of_repayment,
				vUDSC_released_every_tenure: currentLoan
					.vUDSC_released_every_tenure
			});
		}
	}

	function approve_USDC(uint256 amount) private {
		USDC_TOKEN.approve(address(this), amount);
	}

	function approve_vUSDC(uint256 amount) private {
		IERC20(address(this)).approve(address(this), amount);
	}

	function dispatchLoan(
		uint256 loanAmount,
		uint8 number_of_splits
	) public validateLoan(loanAmount) {
		require(
			USDC_TOKEN.balanceOf(address(this)) >= loanAmount,
			"Your loan cant be served now try again later"
		);

		calculate_and_populate_loan(msg.sender, loanAmount, number_of_splits);
		approve_vUSDC(loanAmount);
		approve_USDC(loanAmount);
		// Transfer USDC from the contract to the borrower
		require(
			USDC_TOKEN.transferFrom(address(this), msg.sender, loanAmount),
			"USDC transfer to borrower failed"
		);

		// Calculate and transfer the collateral (vUSDC) from the borrower to the contract
		uint256 collateralAmount = calculate_loan_ratio(msg.sender, loanAmount);
		require(
			IERC20(address(this)).transferFrom(
				msg.sender,
				address(this),
				collateralAmount
			),
			"vUSDC collateral transfer failed"
		);

		isLoanPending[msg.sender] = true;
	}

	function get_vusdc_return_amount(
		address repayer,
		uint8 loanId
	) private view returns (uint256) {
		return
			user_to_loan_mapping[repayer][loanId].vUDSC_released_every_tenure;
	}

	function repay_tenure(uint8 id) public validRepay(id) {
		calculate_and_populate_repay(msg.sender, id);

		uint256 repayment_amount = get_repayment_amount(msg.sender, id);
		uint256 vUSDC_return_amount = get_vusdc_return_amount(msg.sender, id);

        approve_vUSDC(vUSDC_return_amount);
		// approve_USDC(loanAmount);
		USDC_TOKEN.transferFrom(msg.sender, address(this), repayment_amount);
		IERC20(address(this)).transferFrom(
			address(this),
			msg.sender,
			vUSDC_return_amount
		);
	}

	function get_repayment_amount(
		address repayer,
		uint8 loanId
	) public view returns (uint256) {
		return user_to_loan_mapping[repayer][loanId].tenure_size;
	}

	function update_credit_worthiness(
		address user,
		uint256 newCredit
	) public onlyOwner {
		bool difference = address_to_user[user].credit_worthiness > newCredit;
		address_to_user[user].credit_worthiness = newCredit;

		if (difference) {
			uint256 change = address_to_user[user].credit_worthiness -
				newCredit;
			address_to_user[user].credit_available -= change;
		} else {
			uint256 change = newCredit -
				address_to_user[user].credit_worthiness;
			address_to_user[user].credit_available += change;
		}
	}

	function update_credit_worthiness_for_loan(
		address user,
		uint256 newCredit
	) private {
		bool difference = address_to_user[user].credit_worthiness > newCredit;
		uint256 currentCreditWorthiness = address_to_user[user]
			.credit_worthiness;
		address_to_user[user].credit_worthiness = newCredit;

		if (difference) {
			uint256 change = currentCreditWorthiness - newCredit;
			address_to_user[user].credit_available -= change;
		} else {
			uint256 change = newCredit - currentCreditWorthiness;
			address_to_user[user].credit_available += change;
		}
	}

	function calculate_interest(
		address depositer
	) public view returns (uint256) {
		uint256 monthsElapsed = (block.timestamp - depositTime[depositer]) /
			(60 * 60 * 24 * 30);
		// calculating based on 12% per year 1% per month and 1/30 % per day
		require(monthsElapsed > 0, "Withdraw only after one month");
		uint256 interest = ((depositAmount[depositer]) * monthsElapsed) / 100;
		return interest;
	}

	function deposit(
		uint256 assets,
		address receiver
	) public virtual override returns (uint256) {
		require(
			assets <= maxDeposit(receiver),
			"ERC4626: deposit more than max"
		);
		require(
			depositTime[msg.sender] == 0,
			"Withdraw previous stake before increasing"
		);
		uint256 shares = previewDeposit(assets);
		_deposit(_msgSender(), receiver, assets, shares);
		afterDeposit(assets, msg.sender);

		return shares;
	} // add function to update  creditworthiness on loan contract

	function mint(
		uint256 shares,
		address receiver
	) public virtual override returns (uint256) {
		require(shares <= maxMint(receiver), "ERC4626: mint more than max");
		require(
			depositTime[msg.sender] == 0,
			"Withdraw previous stake before increasing"
		);
		uint256 assets = previewMint(shares);
		_deposit(_msgSender(), receiver, assets, shares);
		afterDeposit(assets, msg.sender);

		return assets;
	}

	function redeem(
		uint256 shares,
		address receiver,
		address owner
	) public virtual override returns (uint256) {
		require(shares <= maxRedeem(owner), "ERC4626: redeem more than max");
		require(
			depositTime[msg.sender] > 0 && depositAmount[msg.sender] > 0,
			"Invest before withdraw"
		);
		uint256 assets = previewRedeem(shares);
		uint256 interest = beforeWithdraw(msg.sender);
		_withdraw(_msgSender(), receiver, owner, assets + interest, shares);

		return assets;
	}

	function withdraw(
		uint256 assets,
		address receiver,
		address owner
	) public virtual override returns (uint256) {
		require(
			assets <= maxWithdraw(owner),
			"ERC4626: withdraw more than max"
		);
		require(
			depositTime[msg.sender] > 0 && depositAmount[msg.sender] > 0,
			"Invest before withdraw"
		);
		uint256 shares = previewWithdraw(assets);
		uint256 interest = beforeWithdraw(msg.sender);
		_withdraw(_msgSender(), receiver, owner, assets + interest, shares);

		return shares;
	} // onwithdrawal reduce credit worthiness

	function _entryFeeBasisPoints() internal view override returns (uint256) {
		return entryFeeBasisPoints;
	}

	function _entryFeeRecipient() internal view override returns (address) {
		return vaultOwner;
	}

	function afterDeposit(uint256 assets, address depositer) internal virtual {
		depositTime[depositer] = block.timestamp;
		depositAmount[depositer] = assets;
		bool world_id_verified_q = address_to_user[depositer].world_id_verified;
		if (world_id_verified_q) {
			update_credit_worthiness_for_loan(depositer, (3 * assets) / 2);
		} else {
			update_credit_worthiness_for_loan(depositer, (4 * assets) / 5);
		}
	}

	function beforeWithdraw(
		address depositer
	) internal virtual returns (uint256) {
		// calculate the interest of the depositor
		uint256 interest = calculate_interest(depositer);
		//reset the deposit amount and deposit timestamp mapping
		depositTime[depositer] = 0;
		depositAmount[depositer] = 0;
		// allow withdrawal by returning interest
		update_credit_worthiness_for_loan(depositer, 0);
		//update the credit worthiness

		return interest;
	}

	function get_credit_worthiness(address user) public view returns (uint256) {
		return address_to_user[user].credit_worthiness;
	}

	// get available credits
	function get_credit_limit(address user) public view returns (uint256) {
		return address_to_user[user].credit_available;
	}

	// get loan by id

	function get_loan_by_id(
		address user,
		uint8 id
	) public view returns (loanDetails memory) {
		return user_to_loan_mapping[user][id];
	}
    function is_world_id_verified(
		address user

	) public view returns ( bool) {
		return address_to_user[user].world_id_verified;
	}
}
