import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function About() {
  const title =
    'About Cogi - Smart Study Timer with Pomodoro & Spaced Repetition | Boost Learning Efficiency'
  const description =
    'Discover how Cogi combines the Pomodoro Technique with spaced repetition to enhance your study sessions. Our research-backed learning tool helps students and professionals improve memory retention, time management, and study productivity.'

  const Header = () => {
    return (
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div>
            <img
              src="/assets/logo.svg"
              alt="Cogi Study Timer Logo"
              width={32}
              height={32}
              className="w-8 h-8"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.onerror = null
                img.src = '/assets/logo-fallback.png'
              }}
            />
          </div>
          <Link to="/" className="text-gray-200 text-2xl font-bold">
            Cogi
          </Link>
        </div>
      </header>
    )
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://cogi.com/about" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Cogi Study Timer",
              "applicationCategory": "EducationalApplication",
              "description": "${description}",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <div className="w-full pt-6">
          <div className="max-w-3xl mx-auto mb-8 px-4">
            <Header />
          </div>

          <main className="max-w-3xl mx-auto space-y-8 px-4 pb-12">
            <section>
              <h1 className="text-gray-200 text-3xl font-bold mb-4">
                What is Cogi?
              </h1>

              <p className="text-gray-400 text-lg mb-4">
                <Link
                  to="/"
                  className="font-bold hover:text-gray-200 transition-colors"
                >
                  Cogi
                </Link>{' '}
                is an intelligent study timer that revolutionizes the way you
                learn and manage your study sessions. By combining the proven
                Pomodoro Technique with advanced spaced repetition algorithms,
                Cogi helps students, professionals, and lifelong learners
                optimize their study efficiency and knowledge retention.
              </p>
            </section>

            <section>
              <h2 className="text-gray-200 text-2xl font-bold mb-4">
                The Science Behind Cogi
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-xl font-bold mb-3">
                    Pomodoro Technique
                  </h3>
                  <p className="text-gray-400">
                    The Pomodoro Technique, developed by Francesco Cirillo,
                    breaks work into focused 25-minute intervals followed by
                    short breaks. This method helps combat mental fatigue,
                    maintain concentration, and manage cognitive load
                    effectively. Studies show that regular breaks can increase
                    productivity by up to 40%.
                  </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-xl font-bold mb-3">
                    Spaced Repetition
                  </h3>
                  <p className="text-gray-400">
                    Based on Hermann Ebbinghaus's forgetting curve research,
                    spaced repetition optimizes learning by reviewing
                    information at gradually increasing intervals. This
                    scientifically-proven method can improve long-term memory
                    retention by up to 200% compared to traditional study
                    methods.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-gray-200 text-2xl font-bold mb-4">
                Key Features and Benefits
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-xl font-bold mb-3">
                    Smart Study Sessions
                  </h3>
                  <ul className="text-gray-400 space-y-2">
                    <li>
                      • Customizable study intervals for optimal focus and
                      productivity
                    </li>
                    <li>
                      • Intelligent break scheduling based on your learning
                      patterns
                    </li>
                    <li>• Progress tracking and performance analytics</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-xl font-bold mb-3">
                    Memory Enhancement
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Research published in the Journal of Educational Psychology
                    demonstrates that spaced repetition can:
                  </p>
                  <ul className="text-gray-400 space-y-2">
                    <li>• Increase knowledge retention by up to 200%</li>
                    <li>• Reduce required study time by 30%</li>
                    <li>• Improve long-term memory consolidation</li>
                    <li>• Enhance understanding of complex concepts</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-gray-200 text-2xl font-bold mb-4">
                Perfect For
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-lg font-bold mb-2">
                    Students
                  </h3>
                  <p className="text-gray-400">
                    Optimize your study sessions for exams, assignments, and
                    long-term learning goals.
                  </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-lg font-bold mb-2">
                    Professionals
                  </h3>
                  <p className="text-gray-400">
                    Master new skills and maintain professional certifications
                    efficiently.
                  </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-lg font-bold mb-2">
                    Lifelong Learners
                  </h3>
                  <p className="text-gray-400">
                    Pursue personal development and hobbies with structured
                    learning techniques.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h2 className="text-gray-200 text-2xl font-bold mb-4">
                Get Started Today
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Join thousands of successful learners who have improved their
                study efficiency with Cogi. Our research-backed approach to
                learning has helped students achieve better grades,
                professionals advance their careers, and lifelong learners
                master new skills faster than ever.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
                >
                  Start your learning journey
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-gray-200 text-2xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-lg font-bold mb-2">
                    How does Cogi improve study efficiency?
                  </h3>
                  <p className="text-gray-400">
                    Cogi combines time management techniques with cognitive
                    science principles to optimize your study sessions. The app
                    tracks your learning patterns and automatically adjusts
                    intervals for maximum retention.
                  </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-gray-200 text-lg font-bold mb-2">
                    Can I customize study intervals?
                  </h3>
                  <p className="text-gray-400">
                    Yes! While we recommend starting with the classic 25-minute
                    Pomodoro sessions, you can adjust both study and break
                    intervals to match your personal learning style and
                    schedule.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default About
