import type {
  Plugin,
  PluginAPI,
  RPCResponse,
  RPCRequest,
} from "@lumeweb/relay-types";
import { Connection } from "@solana/web3.js";

let connection: Connection;

function getProvider(config: any, chainId: string): Connection {
  if (!connection) {
    connection = new Connection(
      `https://${chainId}.gateway.pokt.network/v1/lb/${config.str(
        "pocket-app-id"
      )}`
    );
  }

  return connection;
}

const plugin: Plugin = {
  name: "solana",
  async plugin(api: PluginAPI): Promise<void> {
    api.registerMethod("getAccountInfo", {
      cacheable: true,
      async handler(request: RPCRequest): Promise<RPCResponse | null> {
        let blockchainRpcPlugin = await api.loadPlugin("blockchain-rpc");
        const chain = blockchainRpcPlugin.exports.networks["solana-mainnet"];
        let resp = await blockchainRpcPlugin.exports.proxyRpcMethod(
          api.config,
          request,
          chain,
          (chainId: string) => {
            const provider = getProvider(api.config, chainId);
            // @ts-ignore
            return provider._rpcRequest.bind(provider);
          }
        );

        if (resp.result) {
          resp.id = "0";
          if (resp.result.context) {
            resp.result.context.apiVersion = 0;
            resp.result.context.slot = 0;
          }
        }

        return { data: resp };
      },
    });
  },
};

export default plugin;
