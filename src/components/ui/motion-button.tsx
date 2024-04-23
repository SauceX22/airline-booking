"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface MotionButtonProps
  extends React.ComponentPropsWithRef<typeof motion.button>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
}

const MotionButton = React.forwardRef<typeof motion.button, MotionButtonProps>(
  (
    {
      className,
      variant,
      size,
      ref: motionRef,
      isLoading = false,
      loadingText = "Loading",
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        layout
        className={cn(
          buttonVariants({ variant, size, className }),
          "relative overflow-hidden",
        )}
        ref={motionRef}
        {...props}
      >
        <motion.div
          layout
          className="absolute text-[13px]"
          // push down the children on loading
          initial={{ y: "0%" }}
          animate={{ y: isLoading ? "250%" : "0%" }}
        >
          {props.children}
        </motion.div>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              layout
              className="absolute flex w-auto items-center justify-center gap-2 font-medium"
              // move downwards on loading
              initial={{ y: "-250%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-250%" }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 600,
                damping: 22,
              }}
            >
              {loadingText}
              <div className="flex w-full items-center justify-center pt-0.5">
                <div className="flex h-full w-9 items-center justify-around">
                  {[0, 1, 2].map((index) => (
                    <motion.span
                      key={index}
                      className="block h-1.5 w-1.5 rounded-full bg-[#171717]"
                      initial={{
                        y: index === 0 ? "0%" : index === 1 ? "-50%" : "-100%",
                      }}
                      animate={{
                        y: ["0%", "-100%", "0%"],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        delay: index * 0.2,
                        repeatDelay: 0.9,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  },
);
MotionButton.displayName = "MotionButton";

export { MotionButton };
