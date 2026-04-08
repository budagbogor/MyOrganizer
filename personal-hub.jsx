import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "work", label: "Pekerjaan", icon: "◈" },
  { id: "business", label: "Bisnis", icon: "◆" },
  { id: "family", label: "Keluarga", icon: "❧" },
  { id: "calendar", label: "Kalender", icon: "◉" },
  { id: "contacts", label: "Kontak", icon: "◎" },
  { id: "credentials", label: "Kredensial", icon: "⬡" },
  { id: "data", label: "Data Penting", icon: "◫" },
  { id: "plans", label: "Rencana", icon: "◐" },
];

const COLORS = {
  work: "#C8A97E",
  business: "#7EB8C8",
  family: "#C87EA9",
  calendar: "#7EC89E",
  contacts: "#C8C87E",
  credentials: "#C87E7E",
  data: "#9E7EC8",
  plans: "#7E9EC8",
};

const initialData = {
  work: [
    { id: 1, title: "Review laporan Q1", priority: "tinggi", status: "proses", due: "2026-03-30", notes: "Cek dengan tim finance" },
    { id: 2, title: "Meeting klien Rabu", priority: "tinggi", status: "todo", due: "2026-04-02", notes: "" },
  ],
  business: [
    { id: 1, title: "Strategi pemasaran Q2", category: "Strategi", notes: "Target: 20% pertumbuhan" },
    { id: 2, title: "Rapat investor", category: "Keuangan", notes: "Siapkan deck presentasi" },
  ],
  family: [
    { id: 1, name: "Istri/Suami", role: "Pasangan", phone: "", notes: "" },
    { id: 2, name: "Anak 1", role: "Anak", phone: "", notes: "" },
  ],
  calendar: [
    { id: 1, title: "Ulang tahun pasangan", date: "2026-05-12", type: "penting", reminder: true },
    { id: 2, title: "Review tahunan", date: "2026-04-15", type: "kerja", reminder: true },
  ],
  contacts: [
    { id: 1, name: "Budi Santoso", role: "Rekan Bisnis", company: "PT Maju Jaya", phone: "+62812xxxxx", email: "", tag: "bisnis" },
  ],
  credentials: [
    { id: 1, service: "Email Utama", username: "nama@email.com", password: "••••••••", notes: "Gmail pribadi", visible: false },
  ],
  data: [
    { id: 1, title: "No. KTP", value: "•••••••••••••", category: "Identitas", notes: "" },
    { id: 2, title: "No. NPWP", value: "•••••••••••••", category: "Pajak", notes: "" },
  ],
  plans: [
    { id: 1, title: "Ekspansi bisnis ke Surabaya", phase: "Q3 2026", status: "perencanaan", details: "Cari lokasi strategis" },
    { id: 2, title: "Beli rumah kedua", phase: "2027", status: "riset", details: "Budget 2M" },
  ],
};

export default function PersonalHub() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [data, setData] = useState(initialData);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editItem, setEditItem] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const deleteItem = (section, id) => {
    setData(d => ({ ...d, [section]: d[section].filter(x => x.id !== id) }));
    showToast("Item dihapus");
  };

  const today = new Date();
  const todayStr = today.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const upcomingEvents = data.calendar
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const highPriorityWork = data.work.filter(w => w.priority === "tinggi" && w.status !== "selesai");

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0D0D10", color: "#E8E4DC", fontFamily: "'Georgia', serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .nav-item { transition: all 0.2s; cursor: pointer; padding: 10px 16px; border-radius: 6px; display: flex; align-items: center; gap: 10px; font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.05em; color: #666; }
        .nav-item:hover { background: rgba(200,169,126,0.08); color: #C8A97E; }
        .nav-item.active { background: rgba(200,169,126,0.12); color: #C8A97E; border-left: 2px solid #C8A97E; }
        .card { background: #13131A; border: 1px solid #1E1E28; border-radius: 10px; padding: 20px; transition: border-color 0.2s; }
        .card:hover { border-color: #2E2E3E; }
        .btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.08em; transition: all 0.2s; }
        .btn-gold { background: rgba(200,169,126,0.15); color: #C8A97E; border: 1px solid rgba(200,169,126,0.3); }
        .btn-gold:hover { background: rgba(200,169,126,0.25); }
        .btn-danger { background: rgba(200,80,80,0.1); color: #C85050; border: 1px solid rgba(200,80,80,0.2); }
        .btn-danger:hover { background: rgba(200,80,80,0.2); }
        .input { background: #0D0D10; border: 1px solid #2A2A38; border-radius: 6px; color: #E8E4DC; padding: 8px 12px; font-family: 'DM Mono', monospace; font-size: 12px; width: 100%; outline: none; transition: border-color 0.2s; }
        .input:focus { border-color: #C8A97E; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-family: 'DM Mono', monospace; letter-spacing: 0.05em; }
        .tag-tinggi { background: rgba(200,80,80,0.15); color: #C85050; }
        .tag-sedang { background: rgba(200,169,126,0.15); color: #C8A97E; }
        .tag-rendah { background: rgba(126,200,158,0.15); color: #7EC89E; }
        .tag-todo { background: rgba(126,152,200,0.15); color: #7E98C8; }
        .tag-proses { background: rgba(200,169,126,0.15); color: #C8A97E; }
        .tag-selesai { background: rgba(126,200,158,0.15); color: #7EC89E; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .modal { background: #13131A; border: 1px solid #2A2A38; border-radius: 12px; padding: 28px; width: 480px; max-height: 80vh; overflow-y: auto; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; letter-spacing: 0.02em; color: #E8E4DC; margin: 0 0 4px; }
        .mono { font-family: 'DM Mono', monospace; }
        .item-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: #0D0D10; border-radius: 8px; border: 1px solid #1A1A24; margin-bottom: 8px; transition: border-color 0.2s; }
        .item-row:hover { border-color: #2A2A38; }
        textarea.input { resize: vertical; min-height: 80px; }
        select.input { cursor: pointer; }
        .stat-card { background: #13131A; border: 1px solid #1E1E28; border-radius: 10px; padding: 16px 20px; flex: 1; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 220 : 60, background: "#0A0A0E", borderRight: "1px solid #1A1A24", display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #1A1A24", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #C8A97E, #7E98C8)", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⌘</div>
          {sidebarOpen && <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "#E8E4DC" }}>Personal Hub</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555", letterSpacing: "0.1em" }}>COMMAND CENTER</div>
          </div>}
        </div>

        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {SECTIONS.map(s => (
            <div key={s.id} className={`nav-item ${activeSection === s.id ? "active" : ""}`} onClick={() => setActiveSection(s.id)}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>{s.icon}</span>
              {sidebarOpen && <span>{s.label}</span>}
            </div>
          ))}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid #1A1A24" }}>
          <div className="nav-item" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ justifyContent: sidebarOpen ? "flex-start" : "center" }}>
            <span>{sidebarOpen ? "←" : "→"}</span>
            {sidebarOpen && <span>Tutup</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #1A1A24", display: "flex", alignItems: "center", gap: 16, background: "#0A0A0E" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555", letterSpacing: "0.12em", marginBottom: 2 }}>{todayStr.toUpperCase()}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#E8E4DC", fontStyle: "italic", fontWeight: 300 }}>
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </div>
          </div>
          <input
            className="input"
            placeholder="Cari..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200, fontSize: 11 }}
          />
          {activeSection !== "dashboard" && (
            <button className="btn btn-gold" onClick={() => setShowAdd(true)}>+ Tambah</button>
          )}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
          {activeSection === "dashboard" && <Dashboard data={data} upcoming={upcomingEvents} highPriority={highPriorityWork} setActiveSection={setActiveSection} />}
          {activeSection === "work" && <WorkSection data={data.work} search={search} onDelete={id => deleteItem("work", id)} onEdit={item => setEditItem({ section: "work", item })} />}
          {activeSection === "business" && <BusinessSection data={data.business} search={search} onDelete={id => deleteItem("business", id)} />}
          {activeSection === "family" && <FamilySection data={data.family} search={search} onDelete={id => deleteItem("family", id)} />}
          {activeSection === "calendar" && <CalendarSection data={data.calendar} search={search} onDelete={id => deleteItem("calendar", id)} />}
          {activeSection === "contacts" && <ContactsSection data={data.contacts} search={search} onDelete={id => deleteItem("contacts", id)} />}
          {activeSection === "credentials" && <CredentialsSection data={data.credentials} setData={creds => setData(d => ({ ...d, credentials: creds }))} search={search} onDelete={id => deleteItem("credentials", id)} />}
          {activeSection === "data" && <DataSection data={data.data} search={search} onDelete={id => deleteItem("data", id)} />}
          {activeSection === "plans" && <PlansSection data={data.plans} search={search} onDelete={id => deleteItem("plans", id)} />}
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <AddModal
          section={activeSection}
          onClose={() => setShowAdd(false)}
          onSave={(newItem) => {
            setData(d => ({
              ...d,
              [activeSection]: [...(d[activeSection] || []), { ...newItem, id: Date.now() }]
            }));
            setShowAdd(false);
            showToast("Item berhasil ditambahkan!");
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "success" ? "rgba(126,200,158,0.15)" : "rgba(200,80,80,0.15)", border: `1px solid ${toast.type === "success" ? "#7EC89E" : "#C85050"}`, color: toast.type === "success" ? "#7EC89E" : "#C85050", padding: "10px 20px", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 12, zIndex: 200 }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// DASHBOARD
function Dashboard({ data, upcoming, highPriority, setActiveSection }) {
  const stats = [
    { label: "Tugas Aktif", value: data.work.filter(w => w.status !== "selesai").length, color: "#C8A97E", section: "work" },
    { label: "Event Mendatang", value: data.calendar.filter(e => new Date(e.date) >= new Date()).length, color: "#7EC89E", section: "calendar" },
    { label: "Kontak", value: data.contacts.length, color: "#7E98C8", section: "contacts" },
    { label: "Rencana", value: data.plans.length, color: "#C87EA9", section: "plans" },
  ];

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ cursor: "pointer", borderLeft: `3px solid ${s.color}` }} onClick={() => setActiveSection(s.section)}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555", letterSpacing: "0.1em", marginBottom: 6 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Upcoming */}
        <div className="card">
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 16, color: "#7EC89E" }}>◉ Event Mendatang</div>
          {upcoming.length === 0 && <div style={{ color: "#444", fontSize: 13 }}>Tidak ada event mendatang</div>}
          {upcoming.map(e => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1A1A24" }}>
              <div>
                <div style={{ fontSize: 13, color: "#E8E4DC" }}>{e.title}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555", marginTop: 2 }}>{new Date(e.date).toLocaleDateString("id-ID")}</div>
              </div>
              <span className={`badge ${e.type === "kerja" ? "tag-sedang" : "tag-tinggi"}`}>{e.type}</span>
            </div>
          ))}
        </div>

        {/* High Priority */}
        <div className="card">
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 16, color: "#C85050" }}>◈ Prioritas Tinggi</div>
          {highPriority.length === 0 && <div style={{ color: "#444", fontSize: 13 }}>Semua tugas prioritas tinggi selesai!</div>}
          {highPriority.map(w => (
            <div key={w.id} style={{ padding: "10px 0", borderBottom: "1px solid #1A1A24" }}>
              <div style={{ fontSize: 13, color: "#E8E4DC" }}>{w.title}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <span className={`badge tag-${w.status}`}>{w.status}</span>
                {w.due && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555" }}>Due: {new Date(w.due).toLocaleDateString("id-ID")}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Overview */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 16, color: "#C8A97E" }}>◐ Rencana Pengembangan</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[{ id: "work", label: "Pekerjaan", count: data.work.length }, { id: "business", label: "Bisnis", count: data.business.length }, { id: "family", label: "Keluarga", count: data.family.length }, { id: "data", label: "Data Penting", count: data.data.length }, { id: "credentials", label: "Kredensial", count: data.credentials.length }].map(item => (
              <div key={item.id} style={{ background: "#0D0D10", border: "1px solid #1E1E28", borderRadius: 8, padding: "12px 18px", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#C8A97E" }}>{item.count}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666" }}>{item.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// WORK SECTION
function WorkSection({ data, search, onDelete, onEdit }) {
  const filtered = data.filter(w => w.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      {filtered.map(item => (
        <div key={item.id} className="item-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: "#E8E4DC", marginBottom: 6 }}>{item.title}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span className={`badge tag-${item.priority}`}>{item.priority}</span>
              <span className={`badge tag-${item.status}`}>{item.status}</span>
              {item.due && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555" }}>Due: {new Date(item.due).toLocaleDateString("id-ID")}</span>}
            </div>
            {item.notes && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", marginTop: 6 }}>{item.notes}</div>}
          </div>
          <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => onDelete(item.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}

// BUSINESS SECTION
function BusinessSection({ data, search, onDelete }) {
  const filtered = data.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      {filtered.map(item => (
        <div key={item.id} className="item-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: "#E8E4DC", marginBottom: 4 }}>{item.title}</div>
            <span className="badge tag-sedang">{item.category}</span>
            {item.notes && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", marginTop: 6 }}>{item.notes}</div>}
          </div>
          <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => onDelete(item.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}

// FAMILY SECTION
function FamilySection({ data, search, onDelete }) {
  const filtered = data.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      {filtered.map(item => (
        <div key={item.id} className="item-row">
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #C87EA9, #C8A97E)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
            {item.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: "#E8E4DC" }}>{item.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666", marginTop: 2 }}>{item.role}</div>
            {item.phone && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", marginTop: 4 }}>{item.phone}</div>}
            {item.notes && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", marginTop: 2 }}>{item.notes}</div>}
          </div>
          <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => onDelete(item.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}

// CALENDAR SECTION
function CalendarSection({ data, search, onDelete }) {
  const filtered = [...data].filter(e => e.title.toLowerCase().includes(search.toLowerCase())).sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <div>
      {filtered.map(item => {
        const d = new Date(item.date);
        const isPast = d < new Date();
        return (
          <div key={item.id} className="item-row" style={{ opacity: isPast ? 0.5 : 1 }}>
            <div style={{ textAlign: "center", minWidth: 48, background: "#0D0D10", border: "1px solid #2A2A38", borderRadius: 8, padding: "8px 4px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555" }}>{d.toLocaleDateString("id-ID", { month: "short" }).toUpperCase()}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "#7EC89E", lineHeight: 1 }}>{d.getDate()}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "#E8E4DC" }}>{item.title}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <span className={`badge ${item.type === "kerja" ? "tag-todo" : "tag-tinggi"}`}>{item.type}</span>
                {item.reminder && <span className="badge" style={{ background: "rgba(126,200,158,0.1)", color: "#7EC89E" }}>🔔 Reminder</span>}
                {isPast && <span className="badge" style={{ background: "rgba(80,80,80,0.2)", color: "#555" }}>Lewat</span>}
              </div>
            </div>
            <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => onDelete(item.id)}>Hapus</button>
          </div>
        );
      })}
    </div>
  );
}

// CONTACTS SECTION
function ContactsSection({ data, search, onDelete }) {
  const filtered = data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      {filtered.map(item => (
        <div key={item.id} className="item-row">
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #7E98C8, #7EB8C8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", color: "#fff" }}>
            {item.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: "#E8E4DC" }}>{item.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666" }}>{item.role} {item.company && `· ${item.company}`}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              {item.phone && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555" }}>{item.phone}</span>}
              {item.email && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555" }}>{item.email}</span>}
            </div>
          </div>
          <span className={`badge tag-${item.tag === "bisnis" ? "todo" : "sedang"}`}>{item.tag}</span>
          <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => onDelete(item.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}

// CREDENTIALS SECTION
function CredentialsSection({ data, setData, search, onDelete }) {
  const filtered = data.filter(c => c.service.toLowerCase().includes(search.toLowerCase()));
  const toggleVisible = (id) => {
    setData(data.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };
  return (
    <div>
      <div style={{ background: "rgba(200,80,80,0.08)", border: "1px solid rgba(200,80,80,0.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#C85050" }}>
        ⚠ Data kredensial bersifat sensitif. Pastikan tidak ada yang melihat layar Anda.
      </div>
      {filtered.map(item => (
        <div key={item.id} className="item-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: "#E8E4DC", marginBottom: 6 }}>{item.service}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555", marginBottom: 2 }}>USERNAME</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9E9E9E" }}>{item.username}</div>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555", marginBottom: 2 }}>PASSWORD</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9E9E9E" }}>{item.visible ? item.password : "••••••••"}</div>
              </div>
            </div>
            {item.notes && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", marginTop: 6 }}>{item.notes}</div>}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-gold" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => toggleVisible(item.id)}>
              {item.visible ? "Sembunyikan" : "Tampilkan"}
            </button>
            <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => onDelete(item.id)}>Hapus</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// DATA SECTION
function DataSection({ data, search, onDelete }) {
  const filtered = data.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {filtered.map(item => (
        <div key={item.id} className="card" style={{ position: "relative" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#555", letterSpacing: "0.1em", marginBottom: 4 }}>{item.category?.toUpperCase()}</div>
          <div style={{ fontSize: 14, color: "#E8E4DC", marginBottom: 6 }}>{item.title}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#C8A97E" }}>{item.value}</div>
          {item.notes && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555", marginTop: 6 }}>{item.notes}</div>}
          <button className="btn btn-danger" style={{ position: "absolute", top: 12, right: 12, padding: "2px 8px", fontSize: 9 }} onClick={() => onDelete(item.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

// PLANS SECTION
function PlansSection({ data, search, onDelete }) {
  const filtered = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const statusColors = { perencanaan: "tag-todo", riset: "tag-sedang", "dalam-proses": "tag-proses", selesai: "tag-selesai" };
  return (
    <div>
      {filtered.map(item => (
        <div key={item.id} className="item-row" style={{ alignItems: "flex-start" }}>
          <div style={{ width: 4, borderRadius: 2, background: "#C8A97E", alignSelf: "stretch", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 14, color: "#E8E4DC" }}>{item.title}</div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#7E98C8", marginLeft: 12, whiteSpace: "nowrap" }}>{item.phase}</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <span className={`badge ${statusColors[item.status] || "tag-todo"}`}>{item.status}</span>
            </div>
            {item.details && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#555", marginTop: 6 }}>{item.details}</div>}
          </div>
          <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 10 }} onClick={() => onDelete(item.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}

// ADD MODAL
function AddModal({ section, onClose, onSave }) {
  const [form, setForm] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fields = {
    work: [
      { key: "title", label: "Judul Tugas", type: "text" },
      { key: "priority", label: "Prioritas", type: "select", options: ["tinggi", "sedang", "rendah"] },
      { key: "status", label: "Status", type: "select", options: ["todo", "proses", "selesai"] },
      { key: "due", label: "Tenggat", type: "date" },
      { key: "notes", label: "Catatan", type: "textarea" },
    ],
    business: [
      { key: "title", label: "Judul", type: "text" },
      { key: "category", label: "Kategori", type: "text" },
      { key: "notes", label: "Catatan", type: "textarea" },
    ],
    family: [
      { key: "name", label: "Nama", type: "text" },
      { key: "role", label: "Peran", type: "text" },
      { key: "phone", label: "No. Telepon", type: "text" },
      { key: "notes", label: "Catatan", type: "textarea" },
    ],
    calendar: [
      { key: "title", label: "Judul Event", type: "text" },
      { key: "date", label: "Tanggal", type: "date" },
      { key: "type", label: "Tipe", type: "select", options: ["penting", "kerja", "keluarga", "pribadi"] },
    ],
    contacts: [
      { key: "name", label: "Nama", type: "text" },
      { key: "role", label: "Jabatan", type: "text" },
      { key: "company", label: "Perusahaan", type: "text" },
      { key: "phone", label: "No. Telepon", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "tag", label: "Tag", type: "select", options: ["bisnis", "pribadi", "keluarga", "pemerintah"] },
    ],
    credentials: [
      { key: "service", label: "Layanan / Platform", type: "text" },
      { key: "username", label: "Username / Email", type: "text" },
      { key: "password", label: "Password", type: "text" },
      { key: "notes", label: "Catatan", type: "textarea" },
    ],
    data: [
      { key: "title", label: "Nama Data", type: "text" },
      { key: "value", label: "Nilai / Nomor", type: "text" },
      { key: "category", label: "Kategori", type: "select", options: ["Identitas", "Pajak", "Keuangan", "Properti", "Kendaraan", "Lainnya"] },
      { key: "notes", label: "Catatan", type: "textarea" },
    ],
    plans: [
      { key: "title", label: "Judul Rencana", type: "text" },
      { key: "phase", label: "Target Waktu", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["perencanaan", "riset", "dalam-proses", "selesai"] },
      { key: "details", label: "Detail", type: "textarea" },
    ],
  };

  const sectionFields = fields[section] || [];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 20, color: "#E8E4DC" }}>
          Tambah — {SECTIONS.find(s => s.id === section)?.label}
        </div>
        {sectionFields.map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666", marginBottom: 6, letterSpacing: "0.08em" }}>{f.label.toUpperCase()}</div>
            {f.type === "select" ? (
              <select className="input" value={form[f.key] || ""} onChange={e => set(f.key, e.target.value)}>
                <option value="">Pilih...</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <textarea className="input" value={form[f.key] || ""} onChange={e => set(f.key, e.target.value)} />
            ) : (
              <input className="input" type={f.type} value={form[f.key] || ""} onChange={e => set(f.key, e.target.value)} />
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn" style={{ background: "transparent", color: "#555", border: "1px solid #2A2A38" }} onClick={onClose}>Batal</button>
          <button className="btn btn-gold" onClick={() => onSave(form)}>Simpan</button>
        </div>
      </div>
    </div>
  );
}
