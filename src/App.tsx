import { useEffect, useMemo, useState } from "react"
import { signOut } from "firebase/auth"
import { auth, firebaseReady } from "./firebase"
import { LoginScreen, useAuth, useCloudSync } from "./cloud"

type Status = "Идея" | "В процессе" | "Готово"
type View = "table" | "board" | "gallery"
type Block = { id: string; type: "text" | "heading" | "check" | "quote" | "divider" | "image"; text: string; done?: boolean }
type Entry = {
  id: string
  chapter: string
  title: string
  icon: string
  cover: string
  status: Status
  date: string
  tags: string[]
  blocks: Block[]
  createdAt: string
}
type Task = { id: string; title: string; done: boolean; completedAt?: string }
type Quest = { id: string; title: string; xp: number; coins: number; done: boolean; completedAt?: string }
type AppData = {
  entries: Entry[]
  tasks: Task[]
  quests: Quest[]
  xp: number
  coins: number
  purchases: string[]
  visits: string[]
}

const ocean = "https://images.unsplash.com/photo-1719930699151-ea588d6dc563?auto=format&fit=crop&w=1800&q=85"
const photos = [
  "https://images.unsplash.com/photo-1546757545-d680d414fbbb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1619644862264-5395db5d92d9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1647941953226-6ef3fef4ddbf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1619364726002-dfd4fdaee5f2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1601417924450-bbfb87f4fe70?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1599972451680-0fcddaaaf308?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1611425436237-8da6ec2529f8?auto=format&fit=crop&w=1200&q=80",
]

const chapters = [
  { id: "work", name: "Работа", icon: "◫", subtitle: "Проекты, идеи и тихий прогресс", cover: photos[0], tags: ["проект", "фокус"] },
  { id: "culture", name: "Культура", icon: "◉", subtitle: "Книги, фильмы и музыка", cover: photos[1], tags: ["книга", "кино"] },
  { id: "finance", name: "Финансы", icon: "◇", subtitle: "Спокойствие в цифрах", cover: photos[2], tags: ["бюджет", "цель"] },
  { id: "dreams", name: "Сны", icon: "☾", subtitle: "Образы до рассвета", cover: photos[3], tags: ["сон", "символ"] },
  { id: "questions", name: "Вопросы", icon: "?", subtitle: "То, что ещё не имеет ответа", cover: photos[4], tags: ["мысль", "важное"] },
  { id: "education", name: "Образование", icon: "⌁", subtitle: "Навыки и новые территории", cover: photos[5], tags: ["курс", "язык"] },
  { id: "lore", name: "Lore", icon: "✦", subtitle: "Вселенная моей книги", cover: photos[6], tags: ["персонаж", "мир"] },
  { id: "health", name: "Здоровье", icon: "＋", subtitle: "Тихий журнал тела", cover: photos[4], tags: ["ритм", "забота"] },
  { id: "buy", name: "Надо купить", icon: "□", subtitle: "Осознанный список желаний", cover: photos[1], tags: ["дом", "желание"] },
  { id: "relations", name: "Отношения", icon: "∞", subtitle: "Мои люди и важные даты", cover: photos[5], tags: ["люди", "память"] },
  { id: "travel", name: "Путешествия", icon: "↗", subtitle: "Маршруты будущего", cover: photos[0], tags: ["место", "маршрут"] },
]

const iso = (days = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const starterEntries: Entry[] = chapters.flatMap((chapter, index) => [
  {
    id: `${chapter.id}-1`,
    chapter: chapter.id,
    title: [
      "Портфолио: следующая версия", "Мартовское чтение", "Фонд свободы", "Город без окон",
      "Что для меня означает дом?", "Китайский: новый ритм", "Архив северного берега",
      "Неделя мягкого режима", "Лампа для рабочего стола", "День рождения мамы", "Тихая неделя в Киото",
    ][index],
    icon: chapter.icon,
    cover: chapter.cover,
    status: index % 3 === 0 ? "В процессе" : index % 3 === 1 ? "Идея" : "Готово",
    date: iso(index + 4),
    tags: chapter.tags,
    createdAt: iso(-index),
    blocks: [
      { id: `h-${index}`, type: "heading", text: "Заметки" },
      { id: `t-${index}`, type: "text", text: `Это начало страницы «${chapter.name}». Здесь можно хранить контекст, решения и всё, к чему хочется вернуться.` },
      { id: `q-${index}`, type: "quote", text: "Не торопить мысль. Дать ей место стать яснее." },
    ],
  },
  {
    id: `${chapter.id}-2`,
    chapter: chapter.id,
    title: ["Идеи на апрель", "Посмотреть позже", "План на квартал", "Повторяющиеся места", "Письмо себе", "Карта навыков", "Персонажи", "Наблюдения", "Для поездки", "Не забыть сказать", "Места у воды"][index],
    icon: "·",
    cover: photos[(index + 2) % photos.length],
    status: "Идея",
    date: iso(index + 18),
    tags: [chapter.tags[0]],
    createdAt: iso(-index - 2),
    blocks: [{ id: `n-${index}`, type: "text", text: "Свободное пространство для новой мысли." }],
  },
])

const initialData: AppData = {
  entries: starterEntries,
  tasks: [
    { id: "t1", title: "Выбрать одну главную задачу", done: false },
    { id: "t2", title: "Китайский язык · 30 минут", done: false },
    { id: "t3", title: "Записать одну честную мысль", done: false },
  ],
  quests: [
    { id: "q1", title: "Одна глубокая сессия", xp: 30, coins: 12, done: false },
    { id: "q2", title: "Разобрать входящие", xp: 20, coins: 8, done: false },
    { id: "q3", title: "Вечерняя запись", xp: 15, coins: 5, done: false },
  ],
  xp: 140,
  coins: 86,
  purchases: [],
  visits: [],
}

function usePersistentData() {
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem("my-mind-workspace-v1")
      return saved ? { ...initialData, ...JSON.parse(saved) } : initialData
    } catch {
      return initialData
    }
  })
  useEffect(() => localStorage.setItem("my-mind-workspace-v1", JSON.stringify(data)), [data])
  return [data, setData] as const
}

function useRoute() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || "home")
  useEffect(() => {
    const update = () => setRoute(window.location.hash.slice(1) || "home")
    window.addEventListener("hashchange", update)
    return () => window.removeEventListener("hashchange", update)
  }, [])
  return route
}

function go(path: string) {
  window.location.hash = path === "home" ? "" : path
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function Icon({ name }: { name: "search" | "home" | "plus" | "table" | "board" | "gallery" | "close" | "music" | "menu" }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4 4" /></>,
    home: <><path d="m3 11 9-7 9 7" /><path d="M5.5 10v10h13V10M9 20v-6h6v6" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    table: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 10h18M9 4v16" /></>,
    board: <><rect x="3" y="4" width="7" height="16" rx="1" /><rect x="14" y="4" width="7" height="11" rx="1" /></>,
    gallery: <><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="9" cy="9" r="2" /><path d="m4 18 5-5 3 3 3-3 5 5" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    music: <><path d="M9 18V6l10-2v12" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  }
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function Sidebar({ open, onClose, onSearch, footer }: { open: boolean; onClose: () => void; onSearch: () => void; footer?: React.ReactNode }) {
  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="brand" onClick={() => go("home")} role="button" tabIndex={0}>
        <span className="brand__moon">☾</span>
        <span><b>MY MIND</b><small>личное пространство</small></span>
      </div>
      <button className="nav-search" onClick={onSearch}><Icon name="search" /><span>Быстрый поиск</span><kbd>⌘ K</kbd></button>
      <nav>
        <button className="nav-link" onClick={() => { go("home"); onClose() }}><Icon name="home" />Главная</button>
        <p className="nav-label">Моя вселенная</p>
        {chapters.map((chapter) => (
          <button className="nav-link" key={chapter.id} onClick={() => { go(`chapter/${chapter.id}`); onClose() }}>
            <span className="nav-symbol">{chapter.icon}</span>{chapter.name}
          </button>
        ))}
      </nav>
      <div className="sidebar__footer">{footer ?? <><span className="online-dot" /> Всё сохранено локально</>}</div>
    </aside>
  )
}

function Shell({ children, route, onSearch, account }: { children: React.ReactNode; route: string; onSearch: () => void; account?: React.ReactNode }) {
  const [menu, setMenu] = useState(false)
  const chapter = chapters.find((item) => route.includes(item.id))
  return (
    <div className="app-shell">
      <Sidebar open={menu} onClose={() => setMenu(false)} onSearch={onSearch} footer={account} />
      <main className="workspace">
        <header className="mobile-bar">
          <button onClick={() => setMenu(true)} aria-label="Открыть меню"><Icon name="menu" /></button>
          <span>{chapter?.name || "MY MIND"}</span>
          <button onClick={onSearch} aria-label="Поиск"><Icon name="search" /></button>
        </header>
        {children}
      </main>
      {menu && <button className="scrim" onClick={() => setMenu(false)} aria-label="Закрыть меню" />}
    </div>
  )
}

function Player({ data }: { data: AppData }) {
  const level = Math.floor(data.xp / 250) + 1
  const progress = data.xp % 250
  return (
    <section className="panel player">
      <div className="avatar"><span>AM</span></div>
      <div className="player__meta"><small>ИГРОК</small><strong>Azhar</strong><span>Уровень {level}</span></div>
      <div className="xp"><div><span>Опыт</span><b>{progress} / 250 XP</b></div><i><em style={{ width: `${progress / 2.5}%` }} /></i></div>
      <div className="coins"><span>◈</span><div><b>{data.coins}</b><small>монет</small></div></div>
    </section>
  )
}

function Home({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const now = new Date()
  const dateLabel = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(now)
  const countdowns = useMemo(() => data.entries.filter((entry) => entry.date >= iso()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3), [data.entries])
  const toggleTask = (id: string) => setData((state) => ({ ...state, tasks: state.tasks.map((task) => task.id === id ? { ...task, done: !task.done, completedAt: !task.done ? iso() : undefined } : task) }))
  const toggleQuest = (id: string) => setData((state) => {
    const quest = state.quests.find((item) => item.id === id)!
    const gain = quest.done ? -1 : 1
    return { ...state, xp: Math.max(0, state.xp + quest.xp * gain), coins: Math.max(0, state.coins + quest.coins * gain), quests: state.quests.map((item) => item.id === id ? { ...item, done: !item.done, completedAt: !item.done ? iso() : undefined } : item) }
  })
  const month = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(now)
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return (
    <>
      <section className="home-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(4,10,24,.94), rgba(5,13,29,.2)), url("${ocean}")` }}>
        <div className="home-hero__content">
          <span className="eyebrow">ТВОЁ ТИХОЕ МЕСТО · {dateLabel.toUpperCase()}</span>
          <h1>MY MIND</h1>
          <p>Добро пожаловать домой. Здесь не нужно спешить — только замечать, сохранять и мягко двигаться дальше.</p>
          <button className="primary" onClick={() => document.getElementById("today")?.scrollIntoView({ behavior: "smooth" })}>Начать сегодня <span>→</span></button>
        </div>
        <div className="hero-note"><span>✦</span> Мысли становятся яснее,<br />когда у них есть место.</div>
        <small className="photo-credit">Фото: Nick de Partee / Unsplash</small>
      </section>

      <div className="content" id="today">
        <div className="section-heading"><div><span>01 / СЕГОДНЯ</span><h2>Пульт управления</h2></div><p>Только самое важное на сегодня.</p></div>
        <div className="dashboard-grid">
          <section className="panel countdown-panel">
            <PanelTitle title="Ближайшие события" action="по дате" />
            <div className="countdown-list">{countdowns.map((entry) => {
              const days = Math.max(0, Math.ceil((new Date(`${entry.date}T23:59`).getTime() - Date.now()) / 86400000))
              return <button key={entry.id} onClick={() => go(`entry/${entry.id}`)}><time><b>{days}</b><span>дней</span></time><div><strong>{entry.title}</strong><small>{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(entry.date))}</small></div><i>↗</i></button>
            })}</div>
          </section>
          <section className="panel tasks-panel">
            <PanelTitle title="Задачи на день" action={`${data.tasks.filter((task) => task.done).length}/${data.tasks.length}`} />
            <div className="task-list">
              {data.tasks.filter((task) => !task.done).map((task) => <button key={task.id} onClick={() => toggleTask(task.id)}><i /> <span>{task.title}</span></button>)}
              {data.tasks.some((task) => task.done) && <small className="done-label">ГОТОВО</small>}
              {data.tasks.filter((task) => task.done).map((task) => <button className="done" key={task.id} onClick={() => toggleTask(task.id)}><i>✓</i><span>{task.title}</span><em>{task.completedAt}</em></button>)}
            </div>
          </section>
          <Player data={data} />
        </div>

        <div className="mid-grid">
          <section className="panel music">
            <div className="album" style={{ backgroundImage: `url("${photos[2]}")` }}><span><Icon name="music" /></span></div>
            <div className="music__copy"><small>СЕЙЧАС ИГРАЕТ</small><strong>Moon Song</strong><span>Phoebe Bridgers · Punisher</span><div className="track"><i /></div><div className="controls">↶　<button>▶</button>　↷</div></div>
          </section>
          <section className="panel calendar">
            <PanelTitle title={month} action="календарь" />
            <div className="weekdays">{["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"].map((day) => <span key={day}>{day}</span>)}</div>
            <div className="days">{Array.from({ length: 42 }, (_, index) => {
              const day = index - offset + 1
              return <span className={day === now.getDate() ? "today" : day < 1 || day > total ? "muted" : ""} key={index}>{day > 0 && day <= total ? day : ""}</span>
            })}</div>
          </section>
        </div>

        <div className="section-heading universe-heading"><div><span>02 / АРХИВ</span><h2>Моя вселенная</h2></div><p>Каждая глава — отдельная комната памяти.</p></div>
        <div className="universe">
          {chapters.map((chapter, index) => <button className={index === 0 || index === 6 ? "wide" : ""} key={chapter.id} onClick={() => go(`chapter/${chapter.id}`)} style={{ backgroundImage: `linear-gradient(0deg, rgba(3,8,18,.9), rgba(3,8,18,.05) 70%), url("${chapter.cover}")` }}><span>{chapter.icon}</span><div><small>{String(index + 1).padStart(2, "0")} / ГЛАВА</small><strong>{chapter.name}</strong><em>{chapter.subtitle}</em></div><i>↗</i></button>)}
        </div>

        <div className="section-heading"><div><span>03 / ИГРА</span><h2>Мягкий прогресс</h2></div><p>Награда — за движение, не за идеальность.</p></div>
        <div className="game-grid">
          <section className="panel quest-panel"><PanelTitle title="Журнал квестов" action="+ XP" />{data.quests.map((quest) => <button className={quest.done ? "done" : ""} key={quest.id} onClick={() => toggleQuest(quest.id)}><i>{quest.done ? "✓" : ""}</i><span><b>{quest.title}</b><small>+{quest.xp} XP · +{quest.coins} монет</small></span></button>)}</section>
          <RewardShop data={data} setData={setData} />
          <Achievements data={data} />
        </div>
      </div>
    </>
  )
}

function PanelTitle({ title, action }: { title: string; action: string }) {
  return <div className="panel-title"><h3>{title}</h3><span>{action}</span></div>
}

function RewardShop({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const rewards = [{ id: "tea", name: "Любимый напиток", price: 40 }, { id: "book", name: "Новая книга", price: 120 }, { id: "day", name: "День без планов", price: 200 }]
  return <section className="panel rewards"><PanelTitle title="Магазин наград" action={`${data.coins} ◈`} />{rewards.map((reward) => <div key={reward.id}><span><b>{reward.name}</b><small>{data.purchases.includes(reward.id) ? "получено" : `${reward.price} монет`}</small></span><button disabled={data.coins < reward.price || data.purchases.includes(reward.id)} onClick={() => setData((state) => ({ ...state, coins: state.coins - reward.price, purchases: [...state.purchases, reward.id] }))}>{data.purchases.includes(reward.id) ? "✓" : "Купить"}</button></div>)}</section>
}

function Achievements({ data }: { data: AppData }) {
  const visitSet = new Set(data.visits ?? [])
  let streak = 0
  const startOffset = visitSet.has(iso()) ? 0 : -1
  while (visitSet.has(iso(startOffset - streak))) streak++
  const badges = [
    { icon: "✦", name: "Первый шаг", unlocked: data.quests.some((q) => q.done), hint: "Выполни любой квест" },
    { icon: "7", name: "Серия 7 дней", unlocked: streak >= 7, hint: "Заходи 7 дней подряд" },
    { icon: "10", name: "Архивариус", unlocked: data.entries.length >= 10, hint: "Создай 10 и больше записей" },
  ]
  return <section className="panel achievements"><PanelTitle title="Достижения" action={`${badges.filter((b) => b.unlocked).length}/${badges.length}`} /><div>{badges.map((badge) => <article className={badge.unlocked ? "" : "locked"} key={badge.name}><span>{badge.icon}</span><b>{badge.name}</b><small>{badge.unlocked ? "открыто" : badge.hint}</small></article>)}</div></section>
}

function ChapterPage({ id, data, setData }: { id: string; data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const chapter = chapters.find((item) => item.id === id) || chapters[0]
  const entries = data.entries.filter((entry) => entry.chapter === chapter.id)
  const [view, setView] = useState<View>("table")
  const addEntry = () => {
    const entry: Entry = { id: `${chapter.id}-${Date.now()}`, chapter: chapter.id, title: "Без названия", icon: chapter.icon, cover: chapter.cover, status: "Идея", date: iso(7), tags: [], createdAt: iso(), blocks: [{ id: `${Date.now()}-block`, type: "text", text: "Начните писать…" }] }
    setData((state) => ({ ...state, entries: [entry, ...state.entries] }))
    go(`entry/${entry.id}`)
  }
  return (
    <div className="chapter-page">
      <div className="chapter-cover" style={{ backgroundImage: `linear-gradient(0deg, #07101f, transparent 70%), url("${chapter.cover}")` }}><small>Фото с Unsplash</small></div>
      <div className="chapter-body">
        <div className="breadcrumbs"><button onClick={() => go("home")}>Главная</button><span>/</span><b>{chapter.name}</b></div>
        <div className="chapter-heading"><span>{chapter.icon}</span><div><h1>{chapter.name}</h1><p>{chapter.subtitle}</p></div></div>
        <div className="database">
          <div className="database__bar">
            <div className="view-tabs">
              {(["table", "board", "gallery"] as View[]).map((item) => <button className={view === item ? "active" : ""} key={item} onClick={() => setView(item)}><Icon name={item} />{{ table: "Таблица", board: "Доска", gallery: "Галерея" }[item]}</button>)}
            </div>
            <button className="new-button" onClick={addEntry}><Icon name="plus" /> Новая запись</button>
          </div>
          {view === "table" && <TableView entries={entries} />}
          {view === "board" && <BoardView entries={entries} />}
          {view === "gallery" && <GalleryView entries={entries} />}
        </div>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: Status }) { return <span className={`status status--${status === "Идея" ? "idea" : status === "В процессе" ? "progress" : "done"}`}>{status}</span> }
const Tag = ({ text }: { text: string }) => <span className="tag">{text}</span>

function TableView({ entries }: { entries: Entry[] }) {
  return <div className="table-wrap"><table><thead><tr><th>Название</th><th>Статус</th><th>Дата</th><th>Теги</th></tr></thead><tbody>{entries.map((entry) => <tr key={entry.id} onClick={() => go(`entry/${entry.id}`)}><td><span>{entry.icon}</span><b>{entry.title}</b></td><td><StatusPill status={entry.status} /></td><td>{entry.date}</td><td>{entry.tags.map((tag) => <Tag key={tag} text={tag} />)}</td></tr>)}</tbody></table></div>
}

function BoardView({ entries }: { entries: Entry[] }) {
  return <div className="board">{(["Идея", "В процессе", "Готово"] as Status[]).map((status) => <section key={status}><header><StatusPill status={status} /><span>{entries.filter((entry) => entry.status === status).length}</span></header>{entries.filter((entry) => entry.status === status).map((entry) => <button key={entry.id} onClick={() => go(`entry/${entry.id}`)}><strong>{entry.icon} {entry.title}</strong><div>{entry.tags.map((tag) => <Tag key={tag} text={tag} />)}</div><small>{entry.date}</small></button>)}</section>)}</div>
}

function GalleryView({ entries }: { entries: Entry[] }) {
  return <div className="gallery">{entries.map((entry) => <button key={entry.id} onClick={() => go(`entry/${entry.id}`)}><div style={{ backgroundImage: `url("${entry.cover}")` }} /><section><strong>{entry.icon} {entry.title}</strong><StatusPill status={entry.status} /><p>{entry.blocks.find((block) => block.type === "text")?.text}</p><small>{entry.date}</small></section></button>)}</div>
}

function EntryPage({ id, data, setData }: { id: string; data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const entry = data.entries.find((item) => item.id === id)
  if (!entry) return <div className="empty">Запись не найдена.</div>
  const chapter = chapters.find((item) => item.id === entry.chapter)!
  const update = (patch: Partial<Entry>) => setData((state) => ({ ...state, entries: state.entries.map((item) => item.id === id ? { ...item, ...patch } : item) }))
  const updateBlock = (blockId: string, patch: Partial<Block>) => update({ blocks: entry.blocks.map((block) => block.id === blockId ? { ...block, ...patch } : block) })
  const addBlock = (type: Block["type"]) => update({ blocks: [...entry.blocks, { id: `${Date.now()}`, type, text: type === "divider" ? "" : type === "check" ? "Новый пункт" : type === "image" ? entry.cover : "Начните писать…" }] })
  return (
    <div className="entry-page">
      <div className="entry-cover" style={{ backgroundImage: `linear-gradient(0deg, #08101d, transparent), url("${entry.cover}")` }} />
      <article className="entry-content">
        <div className="breadcrumbs"><button onClick={() => go("home")}>Главная</button><span>/</span><button onClick={() => go(`chapter/${chapter.id}`)}>{chapter.name}</button><span>/</span><b>{entry.title}</b></div>
        <input className="entry-icon" value={entry.icon} maxLength={2} onChange={(event) => update({ icon: event.target.value })} aria-label="Иконка" />
        <input className="entry-title" value={entry.title} onChange={(event) => update({ title: event.target.value })} aria-label="Название записи" />
        <div className="properties">
          <label><span>Статус</span><select value={entry.status} onChange={(event) => update({ status: event.target.value as Status })}><option>Идея</option><option>В процессе</option><option>Готово</option></select></label>
          <label><span>Дата</span><input type="date" value={entry.date} onChange={(event) => update({ date: event.target.value })} /></label>
          <label><span>Теги</span><input value={entry.tags.join(", ")} onChange={(event) => update({ tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} /></label>
          <label><span>Обложка</span><input value={entry.cover} onChange={(event) => update({ cover: event.target.value })} /></label>
        </div>
        <div className="blocks">{entry.blocks.map((block) => {
          if (block.type === "divider") return <hr key={block.id} />
          if (block.type === "image") return <div className="image-block" key={block.id}><img src={block.text} alt="" /><input value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} /></div>
          if (block.type === "check") return <label className="check-block" key={block.id}><button onClick={() => updateBlock(block.id, { done: !block.done })}>{block.done ? "✓" : ""}</button><textarea className={block.done ? "done" : ""} value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} /></label>
          return <textarea rows={block.type === "heading" ? 1 : 2} className={`block block--${block.type}`} key={block.id} value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} />
        })}</div>
        <div className="block-menu"><span>Добавить блок</span>{(["text", "heading", "check", "quote", "divider", "image"] as Block["type"][]).map((type) => <button key={type} onClick={() => addBlock(type)}>+ {{ text: "Текст", heading: "Заголовок", check: "Чек-лист", quote: "Цитата", divider: "Разделитель", image: "Изображение" }[type]}</button>)}</div>
        <div className="entry-danger"><button className="delete-entry" onClick={() => { if (window.confirm("Удалить эту запись навсегда?")) { setData((state) => ({ ...state, entries: state.entries.filter((item) => item.id !== id) })); go(`chapter/${chapter.id}`) } }}>Удалить запись</button></div>
      </article>
    </div>
  )
}

function SearchPalette({ data, onClose }: { data: AppData; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const results = data.entries.filter((entry) => entry.title.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
  return <div className="palette-backdrop" onMouseDown={onClose}><section className="palette" onMouseDown={(event) => event.stopPropagation()}><div className="palette__input"><Icon name="search" /><input autoFocus placeholder="Найти любую страницу…" value={query} onChange={(event) => setQuery(event.target.value)} /><button onClick={onClose}><Icon name="close" /></button></div><small>СТРАНИЦЫ</small>{results.map((entry) => { const chapter = chapters.find((item) => item.id === entry.chapter)!; return <button className="search-result" key={entry.id} onClick={() => { go(`entry/${entry.id}`); onClose() }}><span>{entry.icon}</span><div><b>{entry.title}</b><small>{chapter.name} · {entry.status}</small></div><i>↗</i></button> })}{results.length === 0 && <p className="no-results">Ничего не найдено. Возможно, это новая мысль.</p>}<footer><span>↵ открыть</span><span>esc закрыть</span></footer></section></div>
}

export default function App() {
  const [data, setData] = usePersistentData()
  const route = useRoute()
  const [search, setSearch] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const [guest, setGuest] = useState(false)
  useCloudSync(user, data, setData, initialData)
  useEffect(() => {
    setData((state) => (state.visits ?? []).includes(iso()) ? state : { ...state, visits: [...(state.visits ?? []), iso()] })
  }, [])
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearch(true) }
      if (event.key === "Escape") setSearch(false)
    }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [])
  let page: React.ReactNode = <Home data={data} setData={setData} />
  if (route.startsWith("chapter/")) page = <ChapterPage id={route.split("/")[1]} data={data} setData={setData} />
  if (route.startsWith("entry/")) page = <EntryPage id={route.split("/")[1]} data={data} setData={setData} />
  if (authLoading) return <div className="empty">Загружаю твоё пространство…</div>
  if (firebaseReady && !user && !guest) return <LoginScreen onGuest={() => setGuest(true)} />
  const account = user ? <><span className="online-dot" /><span className="account-email">{user.email}</span><button className="link-button" onClick={() => signOut(auth)}>Выйти</button></> : guest ? <>Локальный режим</> : undefined
  return <Shell route={route} onSearch={() => setSearch(true)} account={account}>{page}{search && <SearchPalette data={data} onClose={() => setSearch(false)} />}</Shell>
}
