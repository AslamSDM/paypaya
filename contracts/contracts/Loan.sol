//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);
}

contract Loan {
    struct loanDetails {
        uint256 amount;
        uint8 remaining_tenures;
        uint8 total_tenures;
        uint256 tenure_size;
        uint256 loan_taken_time;
        uint256 next_tenure_due;
        uint256 last_day_of_repayment;
    }

    struct userDetails {
        uint256 credit_worthiness;
        uint256 credit_available;
    }

    mapping(address => userDetails) public address_to_user;
    mapping(address => loanDetails[]) public user_to_loan_mapping; // each loan will be having an id which can be used to track the specifc loan that is going to be repayed

    address public immutable owner;
    address public immutable LOAN_TOKEN_ADDRES;

    IERC20 immutable USDC_TOKEN;

    constructor(address _owner, address _LOAN_TOKEN_ADDRESS) {
        owner = _owner;
        LOAN_TOKEN_ADDRES = _LOAN_TOKEN_ADDRESS;
        USDC_TOKEN = IERC20(_LOAN_TOKEN_ADDRESS);
    }

    modifier validateLoan(uint256 loanAmount) {
        userDetails memory user = address_to_user[msg.sender];
        require(user.credit_worthiness > 0, "You are not eligible");
        require(
            user.credit_available >= loanAmount,
            "Clear debts before taking new loan"
        );
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can update");
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

    function create_user() public userDoesNotExist {
        address_to_user[msg.sender] = userDetails({
            credit_worthiness: 0,
            credit_available: 0
        });
    }

    function calculate_and_populate_loan(
        address userAddress,
        uint256 loanAmount,
        uint8 splits
    ) private {
        userDetails memory user = address_to_user[userAddress];
        uint256 loan_amount_added_with_interest = loanAmount + (loanAmount / 5);
        user.credit_available =
            user.credit_available -
            loan_amount_added_with_interest;
        uint256 tenure_size = (loan_amount_added_with_interest / splits);
        uint256 loan_taken_time = block.timestamp;
        uint256 next_tenure_due = loan_taken_time + (30 days);
        uint256 last_day_of_repayment = loan_taken_time +
            (30 days * tenure_size);
        user_to_loan_mapping[userAddress].push(
            loanDetails({
                amount: loan_amount_added_with_interest,
                remaining_tenures: splits,
                total_tenures: splits,
                tenure_size: tenure_size,
                loan_taken_time: loan_taken_time,
                next_tenure_due: next_tenure_due,
                last_day_of_repayment: last_day_of_repayment
            })
        );
    }
    function removeLoan(address repayer, uint8 loanID) private {
        loanDetails[] storage availableLoans = user_to_loan_mapping[repayer];
        availableLoans[loanID]= availableLoans[availableLoans.length-1];
        availableLoans.pop();
    }

    function calculate_and_populate_repay(
        address repayer,
        uint8 loanID
    ) private {
        loanDetails memory currentLoan = user_to_loan_mapping[repayer][loanID];
        if (currentLoan.remaining_tenures ==1 ){
            removeLoan(repayer,loanID);
        }
        else {
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
            last_day_of_repayment: currentLoan.last_day_of_repayment
        });
    }
    }

    function update_credit_worthiness(
        address user,
        uint256 newCredit
    ) public onlyOwner {
        address_to_user[user].credit_worthiness = newCredit;
        address_to_user[user].credit_available =
            newCredit +
            address_to_user[user].credit_available;
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
        USDC_TOKEN.transferFrom(address(this), msg.sender, loanAmount);
    }

    function repay_tenure(uint8 id) public validRepay(id) {
        calculate_and_populate_repay(msg.sender, id);
        uint256 repayment_amount = get_repayment_amount(msg.sender, id);
        USDC_TOKEN.transferFrom(msg.sender, address(this), repayment_amount);
    }

    function get_repayment_amount(
        address repayer,
        uint8 loanId
    ) public view returns (uint256) {
        return user_to_loan_mapping[repayer][loanId].tenure_size;
    }

    //get all loans (call public mapping directly)

    // get credit worthiness

    function get_credit_worthiness(address user) public view returns (uint256) {
        return address_to_user[user].credit_worthiness;
    }

    // get available credits
    function get_credit_limit(address user) public view returns (uint256) {
        return address_to_user[user].credit_available;
    }

    // get loan by id

    function get_loan_by_id(address user,uint8 id) public view returns ( loanDetails memory) {
        return  user_to_loan_mapping[user][id];
    }
}


//dispatcher contract => approval 10000000

// loan contract => update creditworthiness