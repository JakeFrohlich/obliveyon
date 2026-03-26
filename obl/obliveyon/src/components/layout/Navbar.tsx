"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "@/components/cart/CartSidebar";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-[0.3em] uppercase">
              Obliveyon
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/shop">Shop</NavLink>
              <NavLink href="/shop?category=new">New Arrivals</NavLink>
              {isLoggedIn ? (
                <>
                  <NavLink href="/profile">Account</NavLink>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm text-text-secondary hover:text-white tracking-wider uppercase transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <NavLink href="/login">Sign In</NavLink>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                aria-label="Open cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 flex flex-col gap-1.5">
                  <span className={`block h-px bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
                  <span className={`block h-px bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4 bg-bg">
                <MobileNavLink href="/shop" onClick={() => setMobileOpen(false)}>Shop</MobileNavLink>
                <MobileNavLink href="/shop?category=new" onClick={() => setMobileOpen(false)}>New Arrivals</MobileNavLink>
                {isLoggedIn ? (
                  <>
                    <MobileNavLink href="/profile" onClick={() => setMobileOpen(false)}>Account</MobileNavLink>
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="text-lg text-text-secondary hover:text-white tracking-wider uppercase transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink href="/login" onClick={() => setMobileOpen(false)}>Sign In</MobileNavLink>
                    <MobileNavLink href="/signup" onClick={() => setMobileOpen(false)}>Create Account</MobileNavLink>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-text-secondary hover:text-white tracking-wider uppercase transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-lg text-text-secondary hover:text-white tracking-wider uppercase transition-colors"
    >
      {children}
    </Link>
  );
}
