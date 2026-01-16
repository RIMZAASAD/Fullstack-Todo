// Animated components inspired by reactbits principles
// These components use Framer Motion for animations with shadcn styling

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Animated Button Component
export const AnimatedButton = motion(Button);

// Animated Card Component
export const AnimatedCard = motion(Card);

// Slide In Animation
export const SlideIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Fade In Animation
export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Bounce In Animation
export const BounceIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 10 }}
    >
      {children}
    </motion.div>
  );
};

// Hover Effect Wrapper
export const HoverEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

// Staggered List Animation - Updated to handle a container with children that need staggered animation
export const StaggeredList = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {children}
    </motion.div>
  );
};