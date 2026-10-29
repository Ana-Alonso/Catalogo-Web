import React from 'react';
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion';
import { designClasses, splitDesignProps, type DesignProps } from './boxClasses';
import { imageClasses, splitImageProps, type ImageProps } from './imageClasses';

type MotionTag = 'div' | 'article' | 'button' | 'a' | 'span';

type MotionBaseProps<T extends MotionTag> = Omit<HTMLMotionProps<T>, 'className'>;

export type AnimatedProps<T extends MotionTag> = MotionBaseProps<T> & DesignProps;

const motionElements = {
  div: motion.div,
  article: motion.article,
  button: motion.button,
  a: motion.a,
  span: motion.span,
} as const;

function MotionBox<T extends MotionTag>({
  tag,
  ...rest
}: AnimatedProps<T> & { tag: T }) {
  const Component = motionElements[tag] as unknown as React.ComponentType<MotionBaseProps<T>>;
  const { design, dom } = splitDesignProps(rest as Record<string, unknown>);
  return (
    <Component
      {...(dom as MotionBaseProps<T>)}
      className={designClasses(design)}
    />
  );
}

export const Animated: React.FC<AnimatedProps<'div'>> = (props) => (
  <MotionBox tag="div" {...props} />
);

export const AnimatedCard: React.FC<AnimatedProps<'article'>> = (props) => (
  <MotionBox tag="article" {...props} />
);

export const AnimatedButton: React.FC<AnimatedProps<'button'>> = (props) => (
  <MotionBox tag="button" {...props} />
);

export const AnimatedLink: React.FC<AnimatedProps<'a'>> = (props) => (
  <MotionBox tag="a" {...props} />
);

export const AnimatedText: React.FC<AnimatedProps<'span'>> = (props) => (
  <MotionBox tag="span" {...props} />
);

export type AnimatedImageProps = Omit<HTMLMotionProps<'img'>, 'className' | 'src' | 'alt'> &
  Omit<ImageProps, 'className' | 'src' | 'alt'> & {
    src: string | undefined;
    alt: string;
  };

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  loading,
  intrinsicWidth,
  intrinsicHeight,
  ...rest
}) => {
  const { design, dom } = splitImageProps(rest as Record<string, unknown>);
  return (
    <motion.img
      {...(dom as HTMLMotionProps<'img'>)}
      src={src}
      alt={alt}
      loading={loading}
      width={intrinsicWidth}
      height={intrinsicHeight}
      className={imageClasses(design)}
    />
  );
};

AnimatedImage.displayName = 'AnimatedImage';

export const Presence: typeof AnimatePresence = AnimatePresence;
