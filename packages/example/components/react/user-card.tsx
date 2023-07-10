import React from "react";

import { Card, CardHeader, CardTitle } from "components/card";
import { Badge } from "components/badge";
import { ConnectedUserdivType } from "../types";

export const ConnectedUserInfo = ({ username, icon }: ConnectedUserdivType) => {
  if (!username) return null;

  return (
    <Card className="ConnectedUserInfo p-2 w-fit">
      <CardHeader>
        <CardTitle>
          <Badge className="p-2" variant="outline">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500 leading-4 mb-2 mr-2" />
            Account name: {username}
          </Badge>
          <div>{icon}</div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
