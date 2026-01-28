"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CrossIcon, MenuIcon } from "./icons";
import { fadeVariants } from "@/app/_animations/fade-variants";
import { usePathname } from "next/navigation";
const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const iconColor = pathname === "/" ? "#FFFFFF" : "#000000";
  const isHeroPage = pathname === "/";
  const menuBgColor = isHeroPage ? "bg-foreground" : "bg-background";
  const menuTextColor = isHeroPage ? "text-background" : "text-foreground";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((previousIsOpen) => !previousIsOpen);
  };

  const handleLinkClick = (href: string) => {
    if (pathname === href) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="relative sm:hidden">
      <nav className="flex items-center">
        <button
          className="w-8 h-8 -mr-1 relative border-0 bg-transparent visible sm:hidden transition-opacity duration-300 ease z-[70] pointer-events-auto cursor-pointer"
          aria-label="Menu"
          type="button"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <CrossIcon data-hide={false} color={iconColor} />
          ) : (
            <MenuIcon data-hide={false} color={iconColor} />
          )}
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.ul
              className={`fixed inset-0 w-full min-h-screen ${menuBgColor} backdrop-blur-md flex sm:hidden flex-col justify-start items-start text-left gap-2 px-4 pt-32 pb-8 overflow-y-auto z-40`}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.li
                className={`${menuTextColor} text-2xl font-medium whitespace-nowrap w-full`}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Link className="block w-full py-1" href="/manifesto" onClick={() => handleLinkClick("/manifesto")}>
                  Manifesto
                </Link>
              </motion.li>

              <motion.li
                className={`${menuTextColor} text-2xl font-medium whitespace-nowrap w-full`}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Link className="block w-full py-1" href="/login" onClick={() => handleLinkClick("/login")}>
                  Sign In
                </Link>
              </motion.li>

              <motion.li
                className={`${menuTextColor} text-2xl font-medium whitespace-nowrap w-full`}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Link className="block w-full py-1" href="/contact" onClick={() => handleLinkClick("/contact")}>
                  Contact Sales
                </Link>
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default MobileMenu;
