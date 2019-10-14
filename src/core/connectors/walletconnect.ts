export interface IWalletConnectConnectorOptions {
  infuraId: string;
  bridge?: string;
  qrcode?: boolean;
  network?: string;
  rpc?: { [key: number]: string };
  chainId?: number;
}

function getChainId(network: string) {
  const infuraChainIds = {
    mainnet: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42
  };

  const chainId = infuraChainIds[network];
  if (!chainId) {
    throw new Error(`Invalid or unknown chainId for network=${network}`);
  }
  return chainId;
}

const ConnectToWalletConnect = (
  WalletConnectProvider: any,
  opts: IWalletConnectConnectorOptions
) => {
  return new Promise(async (resolve, reject) => {
    let bridge = "https://bridge.walletconnect.org";
    let qrcode = true;
    let infuraId = "";
    let chainId = 1;
    let rpc = null

    if (opts) {
      bridge = opts.bridge || bridge;
      qrcode = typeof opts.qrcode !== "undefined" ? opts.qrcode : qrcode;
      infuraId = opts.infuraId || "";

      if (opts.network) {
        chainId = getChainId(opts.network)
      } else {
        chainId = opts.chainId || chainId
      }

      rpc = opts.rpc || null;
    }

    const provider = new WalletConnectProvider({
      bridge,
      qrcode,
      infuraId,
      rpc,
      chainId
    });

    await provider.enable();

    resolve(provider);
  });
};

export default ConnectToWalletConnect;
