import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  const Header = () => {
    return (
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="px-2">
            <img
              src="/assets/logo.svg"
              alt="Cogi"
              className="w-8 h-8"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.onerror = null
                img.src = '/assets/logo-fallback.png'
              }}
            />
          </div>
          <h1 className="text-gray-200 text-2xl font-bold">Cogi</h1>
        </div>
      </header>
    )
  }

  return (
    <React.Fragment>
      <div className="min-h-screen flex flex-col bg-surface">
        <div className="w-full px-8 md:px-16 pt-6">
          <div className="max-w-md mx-auto mb-60">
            <Header />
          </div>
        </div>
        <div className="text-center space-y-6 p-8 rounded-lg animate-fadeIn">
          <div className="animate-bounce">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-200">
              This page was not found
            </h2>

            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-gray-400 hover:text-gray-200 underline"
              >
                Back to home now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default NotFound
