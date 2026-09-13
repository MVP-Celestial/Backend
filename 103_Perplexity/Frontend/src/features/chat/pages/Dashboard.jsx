import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import { getChats, getMessages } from '../service/chat.api'
import { useDispatch } from 'react-redux'
import { setCurrentChatId } from '../chat.slice'
import {
  Compass,
  MessagesSquare,
  History,
  FolderKanban,
  Share2,
  Database,
  Headphones,
  Settings2,
  Paperclip,
  ChevronDown,
  Search,
  UserPlus,
  Plus,
  ArrowUp,
  PanelLeft,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react'

// --- static content ---------------------------------------------------

const NAV_ITEMS = [
  { icon: Compass, label: 'Explore' },
  { icon: MessagesSquare, label: 'Threads' },
  { icon: History, label: 'History' },
  { icon: FolderKanban, label: 'Spaces' },
  { icon: Share2, label: 'Shared' },
  { icon: Database, label: 'Sources' },
]

const FOCUS_MODES = ['Balanced', 'Academic', 'Concise', 'Creative']

const PROMPTS = [
  {
    title: 'Draft a project plan',
    detail: 'Break a personal project into weekly milestones',
  },
  {
    title: 'Reply to a job offer',
    detail: 'Write a considered response with a counter on start date',
  },
  {
    title: 'Summarize a long article',
    detail: 'Condense it to the three claims that actually matter',
  },
  {
    title: 'Explain how something works',
    detail: 'Get a technical walkthrough with a plain-language summary',
  },
]

function getGreeting(date) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// intro shimmer timing (ms) — visible, then fades out
const GLOW_VISIBLE_MS = 2200
const GLOW_FADE_MS = 600

// --- component ----------------------------------------------------------
// Requires Tailwind CSS (JIT / v3+, for arbitrary-value classes like bg-[#423368]).
// Requires `darkMode: 'class'` in tailwind.config.js for the dark: variants below
// to be driven by the toggle rather than the OS setting.
// Add Fraunces + Inter in your index.html <head>, or via @import in your global CSS:
// <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
// then reference them with font-['Fraunces'] / font-['Inter'] as used below, or wire
// them into tailwind.config.js under theme.extend.fontFamily.

const Dashboard = () => {
  const chat = useChat()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { currentChatId, isLoading, error } = useSelector((state) => state.chat)

  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [previousChats, setPreviousChats] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarHover, setSidebarHover] = useState(false)
  const [focusMode, setFocusMode] = useState(FOCUS_MODES[0])
  const [focusOpen, setFocusOpen] = useState(false)
  const [citationsOn, setCitationsOn] = useState(true)
  const [glowPhase, setGlowPhase] = useState('hidden') // 'in' | 'fading' | 'hidden'
  const [dark, setDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  )
  const inputRef = useRef(null)

  useEffect(() => {
    chat.initializeSocketConnection?.()
  }, [])

  useEffect(() => {
    getChats()
      .then((data) => setPreviousChats(data.chats || []))
      .catch(() => setPreviousChats([]))
  }, [])

  const openPreviousChat = async (chatItem) => {
    try {
      const data = await getMessages(chatItem._id)
      setMessages((data.messages || []).map((message) => ({
        id: message._id,
        sender: message.sender === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      })))
      dispatch(setCurrentChatId(chatItem._id))
    } catch {
      // Leave the current conversation visible if history loading fails.
    }
  }

  const startNewThread = () => {
    setMessages([])
    setQuery('')
    dispatch(setCurrentChatId(null))
    playIntroGlow()
  }

  // plays the shimmering gradient border once: on dashboard mount, and again
  // whenever a new chat/thread is started, or the theme is toggled
  const glowTimersRef = useRef([])
  const playIntroGlow = () => {
    glowTimersRef.current.forEach(clearTimeout)
    setGlowPhase('in')
    const fadeTimer = setTimeout(() => setGlowPhase('fading'), GLOW_VISIBLE_MS)
    const hideTimer = setTimeout(() => setGlowPhase('hidden'), GLOW_VISIBLE_MS + GLOW_FADE_MS)
    glowTimersRef.current = [fadeTimer, hideTimer]
  }

  useEffect(() => {
    playIntroGlow()
    return () => glowTimersRef.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const greeting = useMemo(() => getGreeting(new Date()), [])
  const firstName = user?.name?.split(' ')[0] || 'there'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || isLoading) return

    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: 'user', content: trimmed }])
    setQuery('')

    try {
      const data = await chat.handleSendMessage(trimmed, currentChatId)
      setPreviousChats((current) => [data.chat, ...current.filter((item) => item._id !== data.chat._id)])
      setMessages((current) => [...current, {
        id: data.aiMsg._id || `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.aiMsg.content,
      }])
    } catch {
      // The hook stores the request error in Redux; keep the user's message visible.
    }
  }

  const applyPrompt = (text) => {
    setQuery(text)
    inputRef.current?.focus()
  }

  const toggleTheme = () => {
    setDark((v) => !v)
    playIntroGlow()
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="flex min-h-screen bg-[#FAF8F4] dark:bg-[#131314] text-[#1B1B1B] dark:text-[#E8E6E3] font-['Inter'] transition-colors duration-300">
        <style>{`
          @keyframes shimmerMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          .chat-markdown p { margin: 0 0 0.75rem; }
          .chat-markdown p:last-child { margin-bottom: 0; }
          .chat-markdown ul { list-style: disc; margin: 0.5rem 0 0.75rem 1.25rem; }
          .chat-markdown ol { list-style: decimal; margin: 0.5rem 0 0.75rem 1.25rem; }
          .chat-markdown h1, .chat-markdown h2, .chat-markdown h3 { font-weight: 600; margin: 0.75rem 0 0.35rem; }
          .chat-markdown code { background: rgba(127, 127, 127, 0.16); border-radius: 0.25rem; padding: 0.1rem 0.25rem; }
          .chat-markdown pre { overflow-x: auto; background: rgba(127, 127, 127, 0.12); border-radius: 0.5rem; padding: 0.75rem; margin: 0.75rem 0; }
          .chat-markdown pre code { background: transparent; padding: 0; }
        `}</style>

        {/* rail */}
        <aside className={`hidden sm:flex shrink-0 flex-col gap-7 py-5 border-r border-[#E4DED2] dark:border-[#3C3F41] transition-[width] duration-200 ${sidebarOpen ? 'w-64 px-3' : 'w-17 items-center'}`}>
          <div
            className={`relative flex items-center ${sidebarOpen ? 'justify-between w-full px-1' : 'justify-center'}`}
            onMouseEnter={() => setSidebarHover(true)}
            onMouseLeave={() => setSidebarHover(false)}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen((value) => !value)}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center transition-colors ${sidebarHover || sidebarOpen ? 'bg-[#2A2438] text-[#B7A9E0]' : 'bg-linear-to-br from-[#423368] to-[#6C5A9C]'}`}
            >
              {sidebarHover || sidebarOpen ? <PanelLeft size={17} strokeWidth={1.8} /> : <span className="w-7.5 h-7.5" />}
            </button>
            {sidebarHover && !sidebarOpen && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1B1B1B] px-4 py-2 text-[14px] font-semibold text-white shadow-lg">
                Open sidebar
              </span>
            )}
            {sidebarOpen && <span className="text-[13px] font-semibold text-[#6B6560] dark:text-[#9AA0A6]">Your threads</span>}
          </div>

          {sidebarOpen && (
            <div className="w-full flex-1 overflow-y-auto space-y-1">
              {previousChats.length === 0 ? (
                <p className="px-2 text-[12px] text-[#9B958C]">No previous chats yet.</p>
              ) : previousChats.map((chatItem) => (
                <button
                  key={chatItem._id}
                  type="button"
                  onClick={() => openPreviousChat(chatItem)}
                  className="w-full truncate rounded-lg px-3 py-2 text-left text-[13px] text-[#6B6560] dark:text-[#B8B4AE] hover:bg-[#EFEAF6] dark:hover:bg-[#2A2438] hover:text-[#423368] dark:hover:text-[#B7A9E0]"
                  title={chatItem.title}
                >
                  {chatItem.title}
                </button>
              ))}
            </div>
          )}

          {!sidebarOpen && <nav className="flex flex-1 flex-col gap-1.5">
            {NAV_ITEMS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-[10px] text-[#6B6560] dark:text-[#9AA0A6] hover:bg-[#EFEAF6] dark:hover:bg-[#2A2438] hover:text-[#423368] dark:hover:text-[#B7A9E0]"
              >
                <Icon size={18} strokeWidth={1.8} />
              </button>
            ))}
          </nav>}

          <div className={`flex ${sidebarOpen ? 'flex-row justify-between w-full px-1' : 'flex-col items-center'} gap-3.5`}>
            <button
              type="button"
              onClick={toggleTheme}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={dark}
              className="w-10 h-10 flex items-center justify-center rounded-[10px] text-[#6B6560] dark:text-[#9AA0A6] hover:bg-[#EFEAF6] dark:hover:bg-[#2A2438] hover:text-[#423368] dark:hover:text-[#B7A9E0]"
            >
              {dark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
            </button>
            <button
              type="button"
              title="Voice"
              aria-label="Voice"
              className="w-10 h-10 flex items-center justify-center rounded-[10px] text-[#6B6560] dark:text-[#9AA0A6] hover:bg-[#EFEAF6] dark:hover:bg-[#2A2438] hover:text-[#423368] dark:hover:text-[#B7A9E0]"
            >
              <Headphones size={18} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              title="Settings"
              aria-label="Settings"
              className="w-10 h-10 flex items-center justify-center rounded-[10px] text-[#6B6560] dark:text-[#9AA0A6] hover:bg-[#EFEAF6] dark:hover:bg-[#2A2438] hover:text-[#423368] dark:hover:text-[#B7A9E0]"
            >
              <Settings2 size={18} strokeWidth={1.8} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#423368] text-white text-[13px] font-semibold flex items-center justify-center">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          {/* top bar */}
          <header className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-4">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B6560] dark:text-[#9AA0A6]">
              <Sparkles size={14} strokeWidth={1.8} />
              Sonar Pro
              <ChevronDown size={14} strokeWidth={1.8} />
            </span>

            <div className="flex items-center gap-2.5">
              <span className="hidden md:inline-flex items-center gap-2 border border-[#E4DED2] dark:border-[#3C3F41] bg-white dark:bg-[#1E1F20] rounded-lg px-3 py-1.5 text-[13px] text-[#6B6560] dark:text-[#9AA0A6]">
                <Search size={14} strokeWidth={1.8} />
                Search threads
              </span>
              {/* small-screen theme toggle, since the rail is hidden below sm */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={dark}
                className="sm:hidden inline-flex items-center justify-center w-9 h-9 border border-[#E4DED2] dark:border-[#3C3F41] bg-white dark:bg-[#1E1F20] rounded-lg text-[#6B6560] dark:text-[#9AA0A6]"
              >
                {dark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 border border-[#E4DED2] dark:border-[#3C3F41] bg-white dark:bg-[#1E1F20] rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#1B1B1B] dark:text-[#E8E6E3]"
              >
                <UserPlus size={14} strokeWidth={1.8} />
                Invite
              </button>
              <button
                type="button"
                onClick={startNewThread}
                className="inline-flex items-center gap-1.5 border-none bg-[#1B1B1B] dark:bg-[#E8E6E3] hover:bg-[#423368] dark:hover:bg-[#8E7BBE] text-white dark:text-[#131314] rounded-lg px-3.5 py-2 text-[13px] font-medium"
              >
                <Plus size={14} strokeWidth={1.8} />
                New thread
              </button>
            </div>
          </header>

          {/* hero */}
          <main className={`flex-1 flex flex-col items-center px-5 pb-16 pt-6 ${messages.length ? 'justify-start' : 'justify-center'}`}>
            {!messages.length && <div
              className="w-11.5 h-11.5 rounded-full mb-5 motion-safe:animate-pulse"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #8E7BBE, #423368 70%)',
                boxShadow: '0 0 34px rgba(66,51,104,0.35)',
              }}
              aria-hidden="true"
            />}

            {!messages.length && <h1 className="font-['Fraunces'] font-medium text-center leading-tight text-[28px] sm:text-[38px] mb-2.5">
              {greeting}, {firstName}
            </h1>}
            {!messages.length && <p className="max-w-105 text-center text-[#6B6560] dark:text-[#9AA0A6] text-[15px] leading-relaxed mb-9">
              Ask a question and get an answer{' '}
              <span className="text-[#423368] dark:text-[#B7A9E0] font-medium">backed by sources</span> you can
              check yourself.
            </p>}

            {messages.length > 0 && (
              <div className="w-full max-w-170 flex-1 overflow-y-auto py-6 space-y-5 mb-5">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={message.sender === 'user'
                      ? 'max-w-[85%] rounded-2xl rounded-br-md bg-[#423368] px-4 py-3 text-white whitespace-pre-wrap'
                      : 'max-w-[92%] rounded-2xl rounded-bl-md border border-[#E4DED2] dark:border-[#3C3F41] bg-white dark:bg-[#1E1F20] px-4 py-3 text-[#1B1B1B] dark:text-[#E8E6E3]'}>
                      {message.sender === 'assistant' ? (
                        <div className="chat-markdown text-[14px] leading-6">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : message.content}
                    </div>
                  </div>
                ))}
                {isLoading && <div className="text-[13px] text-[#6B6560] dark:text-[#9AA0A6] animate-pulse">Thinking…</div>}
                {error && <div className="text-[13px] text-red-500">{error}</div>}
              </div>
            )}

            {/* composer, wrapped so the shimmer border can sit around it */}
            <div
              className={`relative w-full max-w-170 rounded-2xl ${
                glowPhase !== 'hidden' ? 'p-0.5 overflow-hidden' : ''
              }`}
            >
              {glowPhase !== 'hidden' && (
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-2xl transition-opacity ease-out ${
                    glowPhase === 'fading' ? 'opacity-0 duration-600' : 'opacity-100 duration-300'
                  }`}
                  style={{
                    backgroundImage:
                      'linear-gradient(115deg, #6C5CE7, #4B8BF5, #22C1C3, #F7CB45, #FF6B9D, #6C5CE7)',
                    backgroundSize: '300% 100%',
                    animation: 'shimmerMove 2.5s linear infinite',
                  }}
                />
              )}
              <form
                onSubmit={handleSubmit}
                className="relative z-10 bg-white dark:bg-[#1E1F20] border border-[#E4DED2] dark:border-[#3C3F41] rounded-2xl px-4.5 pt-4 pb-3 shadow-[0_1px_2px_rgba(27,27,27,0.04)]"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  placeholder="Ask anything, or paste a topic to explore"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  className="w-full border-none outline-none resize-none bg-transparent text-[15px] text-[#1B1B1B] dark:text-[#E8E6E3] placeholder:text-[#9B958C] dark:placeholder:text-[#6B6560] min-h-6"
                />

                <div className="flex items-center gap-2 mt-3.5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 border border-[#E4DED2] dark:border-[#3C3F41] rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#6B6560] dark:text-[#9AA0A6] hover:border-[#423368] dark:hover:border-[#8E7BBE] hover:text-[#423368] dark:hover:text-[#B7A9E0]"
                  >
                    <Paperclip size={14} strokeWidth={1.8} />
                    Attach
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setFocusOpen((v) => !v)}
                      aria-haspopup="listbox"
                      aria-expanded={focusOpen}
                      className="inline-flex items-center gap-1.5 border border-[#E4DED2] dark:border-[#3C3F41] rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#6B6560] dark:text-[#9AA0A6] hover:border-[#423368] dark:hover:border-[#8E7BBE] hover:text-[#423368] dark:hover:text-[#B7A9E0]"
                    >
                      {focusMode}
                      <ChevronDown size={14} strokeWidth={1.8} />
                    </button>

                    {focusOpen && (
                      <div
                        role="listbox"
                        className="absolute top-[calc(100%+6px)] left-0 min-w-35 bg-white dark:bg-[#1E1F20] border border-[#E4DED2] dark:border-[#3C3F41] rounded-[10px] p-1.5 shadow-[0_8px_24px_rgba(27,27,27,0.08)] z-10"
                      >
                        {FOCUS_MODES.map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            role="option"
                            aria-selected={mode === focusMode}
                            onClick={() => {
                              setFocusMode(mode)
                              setFocusOpen(false)
                            }}
                            className="block w-full text-left rounded-md px-2 py-1.5 text-[13px] text-[#1B1B1B] dark:text-[#E8E6E3] hover:bg-[#EFEAF6] dark:hover:bg-[#2A2438] hover:text-[#423368] dark:hover:text-[#B7A9E0]"
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1" />

                  <label className="flex items-center gap-2 text-[12.5px] text-[#6B6560] dark:text-[#9AA0A6]">
                    Citations
                    <button
                      type="button"
                      role="switch"
                      aria-checked={citationsOn}
                      onClick={() => setCitationsOn((v) => !v)}
                      className={`w-8 h-4.5 rounded-full p-0.5 flex items-center transition-colors ${
                        citationsOn ? 'bg-[#423368] dark:bg-[#8E7BBE] justify-end' : 'bg-[#E4DED2] dark:bg-[#3C3F41] justify-start'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white block" />
                    </button>
                  </label>

                  <button
                    type="submit"
                    disabled={!query.trim()}
                    aria-label="Send"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white dark:text-[#131314] bg-[#1B1B1B] dark:bg-[#E8E6E3] hover:bg-[#423368] dark:hover:bg-[#8E7BBE] disabled:bg-[#E4DED2] dark:disabled:bg-[#3C3F41] disabled:text-[#B6B0A6] dark:disabled:text-[#6B6560] disabled:cursor-not-allowed"
                  >
                    <ArrowUp size={16} strokeWidth={2} />
                  </button>
                </div>
              </form>
            </div>

            {/* quick-start prompts */}
            {!messages.length && <div className="w-full max-w-170 flex flex-wrap justify-center gap-2.5 mt-6">
              {PROMPTS.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => applyPrompt(p.title)}
                  className="flex-1 basis-65 max-w-[320px] text-left border border-[#E4DED2] dark:border-[#3C3F41] hover:border-[#423368] dark:hover:border-[#8E7BBE] bg-white dark:bg-[#1E1F20] rounded-xl px-3.5 py-3"
                >
                  <p className="text-[13.5px] font-semibold m-0 mb-0.5">{p.title}</p>
                  <p className="text-[12.5px] text-[#6B6560] dark:text-[#9AA0A6] m-0 leading-snug">{p.detail}</p>
                </button>
              ))}
            </div>}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
