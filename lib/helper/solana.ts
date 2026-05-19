import {
    Address,
    address,
    fetchEncodedAccount,
    GetAccountInfoApi,
    isAddress,
    Rpc,
    RpcApi,
    SolanaRpcApi,
} from "@solana/kit";

export async function fetchAccount(
    publickey: Address,
    rpc: Rpc<SolanaRpcApi>,
): Promise<any> {
    if (!isAddress(publickey)) {
        throw new Error("Invalid Solana address format");
    }


    const result = await rpc.getBalance(publickey).send();

    console.log("result ", result)

}



