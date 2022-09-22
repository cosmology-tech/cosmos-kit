import React from "react";
import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Divider,
  Button,
  Link as ChakraLink,
  Icon,
  Image,
  Tooltip,
  TooltipProps,
  ButtonProps,
} from "@chakra-ui/react";
import {
  DefaultLinkType,
  IconTypeProps,
  DefaultCardType,
  DefaultLinkItemType,
  DefaultIconButtonType,
} from "../types";

// 🔧 use forwardRef to fix ref-warnings =>
// https://github.com/vercel/next.js/issues/7915#issuecomment-745117649
export const DefaultLink = React.forwardRef((props: any, ref) => {
  return (
    <ChakraLink
      w="full"
      ref={ref}
      _hover={{ textDecoration: "none" }}
      _focus={{ outline: "none" }}
      {...props}
    >
      {props.children}
    </ChakraLink>
  );
});

export const DefaultIconButton = ({
  icon,
  label,
  showTooltip,
  chakraButtonProps,
  chakraTooltipProps,
}: {
  chakraButtonProps?: ButtonProps;
  chakraTooltipProps?: TooltipProps;
} & DefaultIconButtonType) => {
  return showTooltip ? (
    <Tooltip
      label={label}
      hasArrow={true}
      bg={useColorModeValue("primary.300", "primary.100")}
      {...chakraTooltipProps}
    >
      <Button
        boxShadow={useColorModeValue(
          "0 2px 5px -2px #d1d1d1",
          "0 1px 1px #535353, 0 3px 4px -1px #222"
        )}
        p={2.5}
        _focus={{ outline: "none" }}
        {...chakraButtonProps}
      >
        <Icon as={icon} w={5} h={5} />
      </Button>
    </Tooltip>
  ) : (
    <Button
      boxShadow={useColorModeValue("0 2px 5px -2px #d1d1d1", "0 0 2px #555")}
      p={2.5}
      {...chakraButtonProps}
    >
      <Icon as={icon} w={5} h={5} />
    </Button>
  );
};

export const ListLinkButton = ({
  text,
  chakraButtonProps,
}: { chakraButtonProps?: ButtonProps } & DefaultLinkItemType) => {
  return (
    <Button
      variant="outline"
      boxShadow="base"
      w="full"
      h={12}
      borderRadius={5}
      {...chakraButtonProps}
    >
      {text}
    </Button>
  );
};

export const MenuLinkButton = ({
  icon,
  text,
  chakraButtonProps,
}: { chakraButtonProps?: ButtonProps } & DefaultLinkItemType) => {
  return (
    <Button
      size="lg"
      w="full"
      variant="ghost"
      justifyContent="start"
      px={3}
      _focus={{ outline: "none" }}
      {...chakraButtonProps}
    >
      <Stack isInline={true} spacing={2} alignItems="center">
        {icon}
        <Text>{text}</Text>
      </Stack>
    </Button>
  );
};

export const TextWithIconLink = ({ text, icon }: DefaultLinkType) => (
  <Stack isInline={true} alignItems="center" spacing={1} opacity={0.7}>
    <Text fontWeight="semibold">{text}</Text>
    <Icon as={icon} />
  </Stack>
);

export const DefaultIcon = ({ icon }: { icon: IconTypeProps }) => {
  if (typeof icon === "string")
    return (
      <Box borderRadius="full" overflow="hidden" w={6} h={6}>
        <Image
          src={icon}
          fallbackSrc={"https://dummyimage.com/200x200/cfcfcf/fff&text=X"}
        />
      </Box>
    );
  return <>{icon}</>;
};

export const DefaultCard = ({ title, children }: DefaultCardType) => {
  return (
    <Box
      w="full"
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={useColorModeValue(
        "0 2px 3px #e3e3e3",
        "0 1px 3px #6e6e6e, 0 5px 12px -5px #858585"
      )}
      borderRadius="lg"
      p={6}
    >
      <Text fontWeight="semibold" fontSize="lg">
        {title}
      </Text>
      <Box mx={-6}>
        <Divider my={6} />
      </Box>
      {children}
    </Box>
  );
};
