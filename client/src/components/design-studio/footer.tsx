/**
 * Footer Component
 * Implements HLR-DSH-020: Footer with Help, Docs, Privacy, Terms
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 py-4 px-8 shrink-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-6">
          <a href="/help" className="hover:text-slate-700 transition-colors">Help</a>
          <a href="/docs" className="hover:text-slate-700 transition-colors">Docs</a>
          <a href="/privacy" className="hover:text-slate-700 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-slate-700 transition-colors">Terms</a>
        </div>
        <div className="text-slate-400">
          © {currentYear} Arkhitekton. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;


