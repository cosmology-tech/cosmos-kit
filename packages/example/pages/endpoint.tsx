import "bootstrap/dist/css/bootstrap.min.css";
import { useChainWallet, useManager } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

const Page = () => {
  const { chainWallet } = useChainWallet("cosmoshub", "keplr-extension");
  const { addEndpoints } = useManager();
  const [endpoints, setEndpoints] = useState<string[]>([]);
  const [n, setn] = useState(0);

  useEffect(() => {
    if (n !== 0) {
      addEndpoints({ cosmoshub: { rpc: [`endpoint added ${n}`] } });
    }
    setEndpoints(
      chainWallet?.preferredEndpoints?.rpc?.map((rpc) => {
        return typeof rpc === "string" ? rpc : rpc.url;
      }) || []
    );
  }, [n]);

  return (
    <>
      <Button
        onClick={() => {
          setn(n + 1);
        }}
      >
        Add Endpoint
      </Button>
      <ListGroup>
        {endpoints.map((endpoint, i) => {
          return <ListGroup.Item key={i}>{endpoint}</ListGroup.Item>;
        })}
      </ListGroup>
    </>
  );
};

export default Page;
