import React from "react";

import { Badge } from "components/badge";
import { Button } from "components/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/card";

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
      <div className="flex space-x-4">
        <Badge variant="outline" className="min-w-[150px]">
          Balance:&ensp;
          <span>{balance}</span>
        </Badge>
        <Button size="sm" variant="default" onClick={handleClickGetBalance}>
          {getBalancebuttonText || "Fetch Balance"}
        </Button>
        <Button size="sm" variant="default" onClick={handleClickSendTokens}>
          {sendTokensbuttonText || "Send Tokens (to self)"}
        </Button>
      </div>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>
              <p className="scroll-m-20 text-md font-extrabold tracking-tight">
                Result
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre>{response}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
