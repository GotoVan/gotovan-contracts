export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} GotoVan – The Avocado Shop LTD. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">
          <a href="mailto:hello@gotovan.co.uk" className="hover:text-gray-600 transition">
            hello@gotovan.co.uk
          </a>
          {' · '}
          <a href="tel:+447394329184" className="hover:text-gray-600 transition">
            +44 (0) 7394329184
          </a>
        </p>
      </div>
    </footer>
  )
}