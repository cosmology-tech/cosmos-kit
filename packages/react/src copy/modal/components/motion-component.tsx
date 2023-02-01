import { Box, GridItem } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';

export const ModalContentVariants: Variants = {
  hidden: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '10%',
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.4, type: 'easeOut' },
  },
  enter: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, type: 'easeOut' },
  },
};
export const LoadingVariants: Variants = {
  hidden: {
    rotate: 0,
    transition: { duration: 0.4, type: 'easeOut' },
  },
  animate: {
    opacity: [1, 0.7, 0.5, 0.3, 0.5, 0.7, 1],
    rotate: 360,
    transition: {
      duration: 2,
      type: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

export const AnimateBox = motion(Box);
export const AnimateGridItem = motion(GridItem);
