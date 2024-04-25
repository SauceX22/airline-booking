"use client";

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MotionCard = motion(Card);
MotionCard.displayName = "MotionCard";

const MotionCardHeader = motion(CardHeader);
MotionCardHeader.displayName = "MotionCardHeader";

const MotionCardTitle = motion(CardTitle);
MotionCardTitle.displayName = "MotionCardTitle";

const MotionCardContent = motion(CardContent);
MotionCardContent.displayName = "MotionCardContent";

const MotionCardDescription = motion(CardDescription);
MotionCardDescription.displayName = "MotionCardDescription";

const MotionCardFooter = motion(CardFooter);
MotionCardFooter.displayName = "MotionCardFooter";

export {
  MotionCard,
  MotionCardHeader,
  MotionCardTitle,
  MotionCardContent,
  MotionCardDescription,
  MotionCardFooter,
};
