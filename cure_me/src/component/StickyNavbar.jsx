import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    });
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8 text-white">
      {["Pages", "Account", "Blocks", "Docs"].map((item) => (
        <Typography
          as="li"
          key={item}
          variant="small"
          className="p-1 font-medium hover:text-gray-300 transition"
        >
          <a href="#" className="flex items-center">{item}</a>
        </Typography>
      ))}
    </ul>
  );

  return (
    <div className="w-full">
      <Navbar className="sticky top-0 z-50 h-max w-full bg-gray-900 px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between text-white">
          <Typography as="a" href="#" className="text-3xl font-bold">
          CURE ME
          </Typography>
          <div className="hidden lg:flex items-center gap-6">{navList}</div>
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="text" size="sm" className="text-white border border-white">
              Log In
            </Button>
            <Button variant="gradient" size="sm" className="bg-blue-600">
              Sign In
            </Button>
          </div>
          {/* Mobile Menu Button */}
          <IconButton
            variant="text"
            className="lg:hidden text-white"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </IconButton>
        </div>
        <MobileNav open={openNav} className="bg-gray-900 text-white">
          {navList}
          <div className="flex flex-col gap-3 mt-3">
            <Button fullWidth variant="text" size="sm" className="text-white border border-white">
              Log In
            </Button>
            <Button fullWidth variant="gradient" size="sm" className="bg-blue-600">
              Sign In
            </Button>
          </div>
        </MobileNav>
      </Navbar>
    </div>
  );
}
