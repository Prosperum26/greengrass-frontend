// Footer Component
export const Footer = () => {
  return (
    <footer className="mt-auto bg-brown-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="text-sm text-white/70">
              GreenGrass - Green Community Platform
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="/" className="hover:text-[#859448] transition-colors">Home</a>
            <a href="/events" className="hover:text-[#859448] transition-colors">Events</a>
            <a href="/leaderboard" className="hover:text-[#859448] transition-colors">Leaderboard</a>
          </div>
          <p className="text-sm text-white/40">
            2026 GreenGrass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
