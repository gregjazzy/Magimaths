'use client';

import { motion } from 'framer-motion';
import { ComponentProps } from 'react';

type MotionDivProps = ComponentProps<typeof motion.div>;

export function MotionDiv(props: MotionDivProps) {
  return <motion.div {...props} />;
}

export function MotionSpan(props: ComponentProps<typeof motion.span>) {
  return <motion.span {...props} />;
}

export function MotionButton(props: ComponentProps<typeof motion.button>) {
  return <motion.button {...props} />;
}
