// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { SchemaResolver } from  "@ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";
import { IEAS, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
contract AttesterResolver is SchemaResolver {
    address private immutable _targetAttester;

    constructor(IEAS eas, address targetAttester) SchemaResolver(eas) {
        _targetAttester = targetAttester;
    }

    function onAttest(
        Attestation calldata attestation,
        uint256
    ) internal view override returns (bool) {
        return attestation.attester == _targetAttester;
    }

    function onRevoke(
        Attestation calldata attestation,
        uint256
    ) internal pure override returns (bool) {
        return true;
    }
}
