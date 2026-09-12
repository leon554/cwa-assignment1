// Shared nav link data and active-route helper. The desktop nav is rendered by
// MainNavClient; MobileMenu also imports NAV_LINKS from here.

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/wordle", label: "Wordle" },
  { href: "/word-search", label: "Word Search" },
  { href: "/word", label: "Manage Words" },
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
];

// Matching on `href + "/"` rather than a bare prefix keeps sibling routes such as
// /word and /word-search from both counting as active.
function isActiveNavLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export { NAV_LINKS, isActiveNavLink };
