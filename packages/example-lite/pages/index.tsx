import { useChain } from "@cosmos-kit/react-lite";
import React from "react";
import { Button, Container } from "react-bootstrap";

export default function () {
  const { openView } = useChain("cosmoshub");
  return (
    <Container className="mt-5">
      <Button variant="primary" onClick={openView}>
        Open Modal
      </Button>
    </Container>
  );
}
