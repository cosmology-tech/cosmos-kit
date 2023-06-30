import { ChainDivProps } from "../types";

export const ChainDiv = (props: ChainDivProps) => {
  return (
    <div>
      <div>
        <img alt="" src={props.icon} width={50} />
      </div>
      <span>{props.prettyName}</span>
    </div>
  );
};
