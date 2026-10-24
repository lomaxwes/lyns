"use client";

import Link from "next/link";
import { FormEvent, useRef, useEffect, useState } from "react";

type Message = { id: string; text: string; own: boolean; time: string };
const contacts = [
  { id: "anna", name: "Анна", initials: "А", color: "peach", preview: "Давай встретимся на выходных?", time: "12:42" },
  { id: "max", name: "Максим", initials: "М", color: "blue", preview: "Привет! Как твои дела?", time: "11:20" },
  { id: "sonya", name: "Соня", initials: "С", color: "green", preview: "Спасибо, до встречи!", time: "Вчера" },
];
const initialMessages: Record<string, Message[]> = {
  anna: [
    { id: "1", text: "Привет! Как проходит неделя?", own: false, time: "12:40" },
    { id: "2", text: "Привет! Хорошо, уже строю планы на выходные ☀️", own: true, time: "12:41" },
    { id: "3", text: "Давай встретимся на выходных?", own: false, time: "12:42" },
  ],
  max: [{ id: "4", text: "Привет! Как твои дела?", own: false, time: "11:20" }],
  sonya: [{ id: "5", text: "Спасибо, до встречи!", own: false, time: "Вчера" }],
};

export default function Home() {
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState(initialMessages);
  const end = useRef<HTMLDivElement>(null);
  const contact = contacts.find((item) => item.id === active);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, active]);

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || !draft[active]?.trim()) return;
    const message = { id: crypto.randomUUID(), text: draft[active].trim(), own: true, time: new Intl.DateTimeFormat("ru", { hour: "2-digit", minute: "2-digit" }).format(new Date()) };
    setMessages((current) => ({ ...current, [active]: [...current[active], message] }));
    setDraft((current) => ({ ...current, [active]: "" }));
  }

  return (
    <main className={`messenger ${active ? "has-active" : ""}`}>
      <aside className="sidebar" aria-label="Переписки">
        <header className="brand"><Link href="/" aria-label="Lyns — главная">lyns<span>✳</span></Link><span className="tag">На связи</span></header>
        <div className="list-heading"><h1>Сообщения</h1><span>{contacts.length}</span></div>
        <label className="search"><span aria-hidden="true">⌕</span><input aria-label="Найти переписку" placeholder="Найти переписку" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <nav className="contacts" aria-label="Список диалогов">
          {contacts.filter((item) => item.name.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru"))).map((item) => {
            const last = messages[item.id].at(-1);
            return <button key={item.id} className={`contact ${active === item.id ? "selected" : ""}`} onClick={() => setActive(item.id)} aria-pressed={active === item.id}>
              <span className={`avatar ${item.color}`}>{item.initials}</span>
              <span className="contact-copy"><span className="contact-top"><strong>{item.name}</strong><time>{last?.time || item.time}</time></span><span className="preview">{last?.own ? "Вы: " : ""}{last?.text || item.preview}</span></span>
            </button>;
          })}
          {contacts.every((item) => !item.name.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru"))) && <p className="no-results">Переписка не найдена</p>}
        </nav>
        <footer className="profile"><span className="avatar self">В</span><div><strong>Вы</strong><small>Демонстрационный профиль</small></div></footer>
      </aside>
      <section className="conversation" aria-label={contact ? `Переписка с ${contact.name}` : "Выберите переписку"}>
        {contact ? <>
          <header className="conversation-header"><button className="back" onClick={() => setActive(null)} aria-label="Назад к перепискам">←</button><span className={`avatar ${contact.color}`}>{contact.initials}</span><div><h2>{contact.name}</h2><p>Демонстрационный диалог</p></div><span className="private-label">Личная переписка</span></header>
          <div className="messages" role="log" aria-label="Сообщения" aria-live="polite"><p className="date-label">Пример переписки</p>{messages[contact.id].map((message) => <div key={message.id} className={`bubble ${message.own ? "own" : ""}`}><p>{message.text}</p><time>{message.time}</time></div>)}<div ref={end} /></div>
          <form className="composer" onSubmit={send}><input aria-label="Сообщение" placeholder="Напишите сообщение…" maxLength={4000} value={draft[contact.id] || ""} onChange={(event) => setDraft((current) => ({ ...current, [contact.id]: event.target.value }))} /><button type="submit" disabled={!draft[contact.id]?.trim()} aria-label="Отправить сообщение">↑</button></form>
        </> : <div className="welcome"><span className="welcome-icon">✳</span><p className="eyebrow">МЕСТО ДЛЯ ВАШИХ РАЗГОВОРОВ</p><h2>Ближе друг к другу.</h2><p>Большие планы и маленькие новости.<br />Выберите переписку, чтобы начать разговор.</p><span className="welcome-note">Пространство для простого общения</span></div>}
        <div className="demo-note">Прототип · Сообщения видны только вам и исчезнут после обновления страницы</div>
      </section>
    </main>
  );
}
