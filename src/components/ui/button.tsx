import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 rounded-md py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

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

export { Button, MotionButton, buttonVariants };
