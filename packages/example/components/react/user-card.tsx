import React from "react";

import { ConnectedUserdivType } from "../types";

export const ConnectedUserInfo = ({ username, icon }: ConnectedUserdivType) => {
  return (
    <div>
      {username && (
        <>
          <div>{icon}</div>
          <span>{username}</span>
        </>
      )}
    </div>
  );
};
