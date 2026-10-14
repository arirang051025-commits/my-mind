import { useEffect, useRef, useState } from "react"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db, firebaseReady, googleProvider } from "./firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(firebaseReady)
  useEffect(() => {
    if (!firebaseReady) return
    return onAuthStateChanged(auth, (next) => {
      setUser(next)
      setLoading(false)
    })
  }, [])
  return { user, loading }
}

export function useCloudSync<T extends object>(
  user: User | null,
  data: T,
  setData: React.Dispatch<React.SetStateAction<T>>,
  defaults: T,
) {
  const loadedFor = useRef<string | null>(null)

  // При входе: забрать облачную копию; если её ещё нет, загрузить локальные данные.
  useEffect(() => {
    if (!user) {
      loadedFor.current = null
      return
    }
    let alive = true
    ;(async () => {
      try {
        const ref = doc(db, "users", user.uid)
        const snap = await getDoc(ref)
        if (!alive) return
        if (snap.exists()) {
          setData({ ...defaults, ...(snap.data() as T) })
        } else {
          await setDoc(ref, { ...(data as object) })
        }
      } catch {
        // Офлайн или база ещё не создана: остаёмся на локальных данных.
      } finally {
        if (alive) loadedFor.current = user.uid
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // При изменениях: сохранять в облако с небольшой задержкой.
  useEffect(() => {
    if (!user || loadedFor.current !== user.uid) return
    const timer = setTimeout(() => {
      setDoc(doc(db, "users", user.uid), { ...(data as object) }).catch(() => {})
    }, 800)
    return () => clearTimeout(timer)
  }, [data, user])
}

export function LoginScreen({ onGuest }: { onGuest: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const withGoogle = async () => {
    setError("")
    setBusy(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch {
      setError("Не получилось войти через Google. Попробуй ещё раз или войди по почте.")
    } finally {
      setBusy(false)
    }
  }

  const withEmail = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setBusy(true)
    try {
      if (mode === "login") await signInWithEmailAndPassword(auth, email, password)
      else await createUserWithEmailAndPassword(auth, email, password)
    } catch {
      setError(
        mode === "login"
          ? "Неверная почта или пароль."
          : "Не удалось создать аккаунт. Пароль должен быть не короче 6 символов, а почта ещё не зарегистрирована.",
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-screen">
      <section className="login-card">
        <span className="eyebrow">ТВОЁ ТИХОЕ МЕСТО</span>
        <h1>MY MIND</h1>
        <p>Войди, чтобы твой прогресс жил в облаке и открывался с любого устройства.</p>
        <button className="google-btn" onClick={withGoogle} disabled={busy}>
          Войти через Google
        </button>
        <div className="login-divider">
          <span>или по почте</span>
        </div>
        <form className="login-form" onSubmit={withEmail}>
          <input type="email" required placeholder="Почта" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input type="password" required placeholder="Пароль" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="login-submit" type="submit" disabled={busy}>
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <button className="login-switch" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Нет аккаунта? Создать" : "Уже есть аккаунт? Войти"}
        </button>
        <button className="login-guest" onClick={onGuest}>
          Продолжить без входа (только на этом устройстве)
        </button>
      </section>
    </div>
  )
}
