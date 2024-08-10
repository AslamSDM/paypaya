const createWallet = () => {
    const wallet = {
        isLogined: false,
        number: null
    }
    const data = JSON.stringify(wallet);
    localStorage.setItem("Paypaya", data);
    return data;
}

const getWallet = () => {
    const wallet = localStorage.getItem("Paypaya");
    if (wallet) {
        return JSON.parse(wallet);
    } else {
        return createWallet();
    }
}

const updateWallet = (key: string, value: string) => {
    const wallet = getWallet();

    const update = {
        ...JSON.parse(wallet),
        [key]: value
    }
    localStorage.setItem("Paypaya", JSON.stringify(update));
}

export {
    createWallet,
    updateWallet,
    getWallet
}