/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Image,
  Icon,
  useBreakpointValue,
  SystemStyleObject,
  SkeletonCircle,
  Skeleton
} from '@chakra-ui/react';
import { Searcher } from 'fast-fuzzy';
import { FiChevronDown } from 'react-icons/fi';
import {
  AsyncSelect,
  OptionProps,
  chakraComponents,
  GroupBase,
  DropdownIndicatorProps,
  PlaceholderProps
} from 'chakra-react-select';
import {
  ChainOption,
  ChangeChainDropdownType,
  ChangeChainMenuType
} from '../types';

const SkeletonOptions = () => {
  return (
    <Stack isInline={true} alignItems="center" spacing={3}>
      <SkeletonCircle w={10} h={10} />
      <Skeleton w={40} h={6} />
    </Stack>
  );
};

const SelectOptions = ({ data, value, onChange }: ChangeChainMenuType) => {
  const menuHeight = useBreakpointValue({ base: 60, md: 56 });
  const customStyles = {
    control: (provided: SystemStyleObject) => ({
      ...provided,
      height: 12
    }),
    menu: (provided: SystemStyleObject) => ({
      ...provided,
      h: menuHeight,
      mt: 4,
      mb: 0,
      bg: useColorModeValue('white', 'gray.900'),
      boxShadow: useColorModeValue('0 1px 5px #e3e3e3', '0 0px 4px #4b4b4b'),
      borderRadius: '0.3rem'
    }),
    menuList: (provided: SystemStyleObject) => ({
      ...provided,
      h: menuHeight,
      bg: 'transparent',
      border: 'none',
      borderRadius: 'none',
      p: 2,
      // For Firefox
      scrollbarWidth: 'auto',
      scrollbarColor: useColorModeValue(
        'rgba(0,0,0,0.3) rgba(0,0,0,0.2)',
        'rgba(255,255,255,0.2) rgba(255,255,255,0.1)'
      ),
      // For Chrome and other browsers except Firefox
      '&::-webkit-scrollbar': {
        width: '14px',
        background: useColorModeValue(
          'rgba(220,220,220,0.1)',
          'rgba(60,60,60,0.1)'
        ),
        borderRadius: '3px'
      },
      '&::-webkit-scrollbar-thumb': {
        background: useColorModeValue(
          'rgba(0,0,0,0.1)',
          'rgba(255,255,255,0.1)'
        ),
        borderRadius: '10px',
        border: '3px solid transparent',
        backgroundClip: 'content-box'
      }
    }),
    clearIndicator: (provided: SystemStyleObject) => ({
      ...provided,
      borderRadius: 'full',
      color: useColorModeValue('blackAlpha.600', 'whiteAlpha.600')
    }),
    dropdownIndicator: (provided: SystemStyleObject) => ({
      ...provided,
      bg: 'transparent',
      pl: 1.5
    }),
    option: (
      provided: SystemStyleObject,
      state: { isSelected: boolean; isFocused: boolean }
    ) => {
      return {
        ...provided,
        borderRadius: 'lg',
        h: 14,
        color: 'inherit',
        bg: useColorModeValue(
          state.isSelected
            ? state.isFocused
              ? 'primary.200'
              : 'primary.100'
            : state.isFocused
              ? 'blackAlpha.200'
              : 'transparent',
          state.isSelected
            ? state.isFocused
              ? 'primary.600'
              : 'primary.500'
            : state.isFocused
              ? 'whiteAlpha.200'
              : 'transparent'
        ),
        _notFirst: {
          mt: 2
        },
        _active: {
          bg: 'primary.50'
        },
        _disabled: { bg: 'transparent', _hover: { bg: 'transparent' } }
      };
    }
  };
  const IndicatorSeparator = () => {
    return null;
  };
  const DropdownIndicator = ({
    ...props
  }: DropdownIndicatorProps<ChainOption, false, GroupBase<ChainOption>>) => {
    return (
      <chakraComponents.DropdownIndicator {...props}>
        <Icon
          as={FiChevronDown}
          w={6}
          h={6}
          color={useColorModeValue('blackAlpha.600', 'whiteAlpha.600')}
        />
      </chakraComponents.DropdownIndicator>
    );
  };
  const Placeholder = (props: PlaceholderProps<ChainOption>) => {
    if (props.hasValue) {
      return (
        <chakraComponents.Placeholder {...props}>
          <Stack
            id={props.getValue()[0].label}
            isInline={true}
            alignItems="center"
            spacing={3}
            overflow="hidden"
            wordBreak="break-word"
            color={useColorModeValue('blackAlpha.800', 'whiteAlpha.800')}
            w="full"
          >
            <Box
              minW={8}
              minH={8}
              maxW={8}
              maxH={8}
              w="full"
              h="full"
              border="1px solid"
              borderColor={useColorModeValue(
                'blackAlpha.200',
                'whiteAlpha.200'
              )}
              borderRadius="full"
              overflow="hidden"
            >
              <Image
                alt=""
                src={props.getValue()[0].icon}
                fallbackSrc={'https://dummyimage.com/150/9e9e9e/ffffff&text=☒'}
              />
            </Box>
            <Text fontSize="xl" fontWeight="semibold">
              {props.getValue()[0].label}
            </Text>
          </Stack>
        </chakraComponents.Placeholder>
      );
    }
    return <chakraComponents.Placeholder {...props} />;
  };
  const CustomOption = ({
    children,
    ...props
  }: OptionProps<ChainOption, false, GroupBase<ChainOption>>) => {
    return (
      <chakraComponents.Option {...props}>
        <Stack
          id={props.label}
          isInline={true}
          alignItems="center"
          spacing={3}
          overflow="hidden"
          wordBreak="break-word"
          color={useColorModeValue('blackAlpha.800', 'whiteAlpha.800')}
          w="full"
        >
          <Box
            minW={10}
            minH={10}
            maxW={10}
            maxH={10}
            w="full"
            h="full"
            border="1px solid"
            borderColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
            borderRadius="full"
            overflow="hidden"
          >
            <Image
              alt=""
              src={props.data?.icon}
              fallbackSrc={'https://dummyimage.com/150/9e9e9e/ffffff&text=☒'}
            />
          </Box>
          <Text fontSize="xl" fontWeight="semibold">
            {children}
          </Text>
        </Stack>
      </chakraComponents.Option>
    );
  };

  return (
    <AsyncSelect
      id="select-chain"
      instanceId="select-chain"
      placeholder="Choose a chain"
      chakraStyles={customStyles}
      isClearable={true}
      isMulti={false}
      isOptionDisabled={(option) => option.isDisabled || false}
      blurInputOnSelect={true}
      controlShouldRenderValue={false}
      loadingMessage={() => <SkeletonOptions />}
      value={value}
      defaultOptions={data}
      loadOptions={(inputValue, callback) => {
        const searcher = new Searcher(data, {
          keySelector: (obj) => obj.label
        });
        callback(searcher.search(inputValue));
      }}
      onChange={onChange}
      components={{
        DropdownIndicator,
        IndicatorSeparator,
        Placeholder,
        Option: CustomOption
      }}
    />
  );
};

export const ChangeChainDropdown = ({
  data,
  selectedItem,
  onChange
}: ChangeChainDropdownType) => {
  return (
    <Box w="full" position="relative" zIndex={150}>
      <SelectOptions data={data} value={selectedItem} onChange={onChange} />
    </Box>
  );
};
