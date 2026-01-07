export const fadeVariants = {
  hidden: { opacity: 0, filter: "blur(20px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

export const fadeTransition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
};
