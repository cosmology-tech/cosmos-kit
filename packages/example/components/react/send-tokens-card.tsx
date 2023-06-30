import React from "react";

export const SendTokensdiv = ({
  balance,
  response,
  isFetchingBalance,
  isConnectWallet,
  getBalancebuttonText,
  handleClickGetBalance,
  sendTokensbuttonText,
  handleClickSendTokens,
}: {
  balance: number;
  response?: string;
  isFetchingBalance: boolean;
  isConnectWallet: boolean;
  sendTokensbuttonText?: string;
  handleClickSendTokens: () => void;
  getBalancebuttonText?: string;
  handleClickGetBalance: () => void;
}) => {
  if (!isConnectWallet) {
    return (
      <div>
        <h5>Please Connect Your Wallet!</h5>
      </div>
    );
  }
  return (
    <div>
      <div>
        <span>
          Balance:&ensp;
          <span>{balance}</span>
        </span>
        <button onClick={handleClickGetBalance}>
          {getBalancebuttonText || "Fetch Balance"}
        </button>
      </div>
      <div>
        <button onClick={handleClickSendTokens}>
          {sendTokensbuttonText || "Send Tokens (to self)"}
        </button>
      </div>
      {response && (
        <div>
          <span>Result</span>
          <div>
            <pre>{response}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
