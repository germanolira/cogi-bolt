import { useEffect, useState } from 'react'
import { PomodoroSession } from '../types/pomodoroSession'
import { ArrowLeft, BarChart, Clock, Focus, History, Timer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const calculateTotalFocusTime = (sessions: PomodoroSession[]): string => {
  const totalSeconds = sessions.reduce(
    (acc, session) => acc + session.workDuration,
    0,
  )
  console.log(totalSeconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

// const calculateAverageSessionLength = (sessions: PomodoroSession[]): string => {
//   if (sessions.length === 0) return '0m'
//   const avgSeconds =
//     sessions.reduce((acc, session) => acc + session.workDuration, 0) /
//     sessions.length
//   const minutes = Math.floor(avgSeconds / 60)
//   return `${minutes}m`
// }

// const calculateFocusScore = (sessions: PomodoroSession[]): string => {
//   if (sessions.length === 0) return '0%'
//   // Simple focus score based on completed sessions
//   const score = Math.min(100, (sessions.length / 10) * 100)
//   return `${Math.round(score)}%`
// }

const getComparisonWithLastWeek = (
  sessions: PomodoroSession[],
): {
  focusTime: string
  sessionsCount: string
  avgSession: string
  focusScore: string
} => {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const thisWeekSessions = sessions.filter(
    (session) => new Date(session.startTime) >= oneWeekAgo,
  )
  const lastWeekSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.startTime)
    return (
      sessionDate >= new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000) &&
      sessionDate < oneWeekAgo
    )
  })

  const thisWeekTotal = thisWeekSessions.reduce(
    (acc, session) => acc + session.workDuration,
    0,
  )
  const lastWeekTotal = lastWeekSessions.reduce(
    (acc, session) => acc + session.workDuration,
    0,
  )
  const hoursDiff =
    Math.round(((thisWeekTotal - lastWeekTotal) / 3600) * 10) / 10

  return {
    focusTime: `${hoursDiff >= 0 ? '+' : ''}${hoursDiff}h from last week`,
    sessionsCount: `${
      thisWeekSessions.length >= lastWeekSessions.length ? '+' : ''
    }${thisWeekSessions.length - lastWeekSessions.length} from last week`,
    avgSession: `${Math.round(
      (thisWeekSessions.length
        ? thisWeekTotal / thisWeekSessions.length / 60
        : 0) -
        (lastWeekSessions.length
          ? lastWeekTotal / lastWeekSessions.length / 60
          : 0),
    )}m from last week`,
    focusScore: `${Math.round(
      (thisWeekSessions.length / 10) * 100 -
        (lastWeekSessions.length / 10) * 100,
    )}% from last week`,
  }
}

const Analytics = () => {
  const [sessions, setSessions] = useState<PomodoroSession[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const storedSessions = localStorage.getItem('cogi_sessions')
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions))
    } else {
      setSessions([])
    }
  }, [])

  const handleAnalyticsClick = () => {
    navigate('/analytics')
  }

  const Header = () => {
    return (
      <header
        className="flex items-center justify-between w-full mb-8"
        role="banner"
      >
        <div className="flex items-center">
          <div className="px-2">
            <img
              src="/assets/logo.svg"
              alt="Logo da Cogi" // Descrição alternativa melhorada
              className="w-8 h-8"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.onerror = null
                img.src = '/assets/logo-fallback.png'
              }}
            />
          </div>
          <h1 className="text-white text-2xl font-bold">Cogi</h1>
        </div>
        <nav
          className="flex justify-center items-center gap-2"
          aria-label="Navegação principal"
        >
          <button
            onClick={handleAnalyticsClick}
            className="bg-gray-900 p-2 rounded-lg text-white hover:bg-gray-800 transition transform active:scale-95 duration-100 flex items-center gap-2"
            aria-label="Abrir Analytics"
          >
            <BarChart className="w-6 h-6 text-white" />
            <span>Analytics</span>
          </button>
        </nav>
      </header>
    )
  }

  const StatisticsCard = ({
    title,
    value,
    icon: Icon,
    change,
  }: {
    title: string
    value: string
    icon: React.ComponentType<{ className: string }>
    change: string
  }) => {
    return (
      <article className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-200">{title}</h2>
          <div className="text-2xl font-bold text-white">{value}</div>
          <p className="text-xs text-gray-400">{change}</p>
        </div>
        <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
      </article>
    )
  }

  const comparison = getComparisonWithLastWeek(sessions)

  return (
    <>
      {/* Gerenciamento de metadados para SEO */}
      <Helmet>
        <title>Analytics - Cogi</title>
        <meta
          name="description"
          content="Veja suas estatísticas de foco e sessões de Pomodoro com o Analytics da Cogi."
        />
        <meta
          name="keywords"
          content="Cogi, Analytics, Pomodoro, Foco, Estatísticas"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Adicione outras meta tags conforme necessário */}
      </Helmet>

      <main className="min-h-screen bg-background text-gray-800" role="main">
        <div className="mx-auto max-w-4xl lg:max-w-3xl p-4 md:p-6 lg:p-8">
          <Header />

          {/* Back to Home Button */}
          <div className="flex items-center justify-start gap-2 mb-8">
            <button
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition transform active:scale-95 duration-100"
              aria-label="Voltar para Home"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-6 h-6 text-white" />
              <span className="text-lg">Back to Home</span>
            </button>
          </div>

          <section aria-labelledby="statistics-heading">
            <h2 id="statistics-heading" className="sr-only">
              Estatísticas de Foco
            </h2>{' '}
            {/* Visível apenas para leitores de tela */}
            <div className="grid gap-6 mb-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatisticsCard
                  title="Total Focus Time"
                  value={calculateTotalFocusTime(sessions)}
                  icon={(props) => <Clock {...props} />}
                  change={comparison.focusTime}
                />
                <StatisticsCard
                  title="Sessions Completed"
                  value={sessions.length.toString()}
                  icon={(props) => <History {...props} />}
                  change={comparison.sessionsCount}
                />
                {/* Adicione mais StatisticsCard conforme necessário */}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Analytics
