import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-up">
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-gray-900 tracking-tighter mix-blend-overlay">404</h1>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mix-blend-color opacity-80" />
      </div>
      
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
        Page not found
      </h2>
      
      <p className="max-w-md text-lg text-gray-500 mb-10 leading-relaxed">
        We couldn't find the page you were looking for. It might have been moved, renamed, or perhaps never existed.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to homepage
        </Link>
        <Link 
          href="/?category=technology" 
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-indigo-600 transition-all"
        >
          Browse Technology
        </Link>
      </div>

      <div className="mt-20 pt-10 border-t border-gray-100 w-full max-w-xl flex flex-col sm:flex-row justify-center gap-8 text-sm text-gray-500">
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-900 uppercase tracking-wider text-xs">Popular Topics</span>
          <div className="flex gap-4 justify-center sm:justify-start">
            <Link href="/?category=ai" className="hover:text-indigo-600 transition-colors">AI</Link>
            <Link href="/?category=business" className="hover:text-indigo-600 transition-colors">Business</Link>
            <Link href="/?category=software" className="hover:text-indigo-600 transition-colors">Software</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
