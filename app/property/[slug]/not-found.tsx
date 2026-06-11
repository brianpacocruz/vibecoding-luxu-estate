import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-background-light min-h-screen">
        <div className="bg-white p-12 rounded-xl shadow-sm border border-mosque/5 inline-block mt-10">
          <span className="material-icons text-6xl text-mosque/40 mb-4">search_off</span>
          <h2 className="text-3xl font-display font-light text-nordic-dark mb-4">Property Not Found</h2>
          <p className="text-nordic-muted mb-8 max-w-md mx-auto">
            We couldn't find the requested property. It may have been removed, sold, or the link might be broken.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-mosque hover:bg-mosque/90 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20"
          >
            <span className="material-icons text-sm">arrow_back</span>
            Return to Home
          </Link>
        </div>
      </main>
    </>
  );
}
