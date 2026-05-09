"use client";

import { useState, useEffect, useCallback } from "react";
import {
  verifyAdminPassword,
  isAdminAuthenticated,
  logoutAdmin,
  AVAILABLE_IMAGES,
  type Destination,
  type Package,
} from "@/lib/packageStore";
import {
  fetchDestinations,
  fetchPackages,
  saveDestination,
  updateDestination,
  deleteDestinationAction,
  savePackage,
  updatePackage,
  deletePackageAction,
} from "@/app/actions";
import { LogOut, Plus, Pencil, Trash2, X, MapPin, Briefcase, Lock, Eye, EyeOff, Check, AlertTriangle } from "lucide-react";

type Tab = "destinations" | "packages";
type ModalMode = "add" | "edit";

// ─── Toast ───
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl animate-[slideDown_0.3s_ease] ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <Check size={18} /> : <AlertTriangle size={18} />}
      {message}
    </div>
  );
}

// ─── Login Screen ───
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await verifyAdminPassword(password);
    if (ok) { onLogin(); } else { setError("Incorrect password. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #050B1F 0%, #0A1628 50%, #0D1515 100%)" }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-headline)" }}>
            <span className="text-cyan-400">Lets</span>Trip Admin
          </h1>
          <p className="text-gray-400 text-sm">Enter your password to continue</p>
        </div>
        <div className="relative mb-4">
          <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mb-4 flex items-center gap-2"><AlertTriangle size={14} />{error}</p>}
        <button type="submit" disabled={loading || !password} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

// ─── Confirm Dialog ───
function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-[#192122] border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-500/10"><AlertTriangle size={20} className="text-red-400" /></div>
          <h3 className="text-white font-bold">Are you sure?</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Destination Form Modal ───
function DestinationModal({ mode, initial, onSave, onClose }: { mode: ModalMode; initial?: Destination; onSave: (d: Omit<Destination, "id">) => void; onClose: () => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [image, setImage] = useState(initial?.image || AVAILABLE_IMAGES[0].value);
  const [duration, setDuration] = useState(initial?.duration || "");
  const [price, setPrice] = useState(initial?.price || "");
  const [tags, setTags] = useState(initial?.tags.join(", ") || "");
  const [description, setDescription] = useState(initial?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, image, duration, price, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), description });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 rounded-2xl bg-[#192122] border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">{mode === "add" ? "➕ Add Destination" : "✏️ Edit Destination"}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Destination Name" value={name} onChange={setName} placeholder="e.g. Thailand" required />
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1.5">Image</label>
            <select value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all appearance-none">
              {AVAILABLE_IMAGES.map((img) => <option key={img.value} value={img.value}>{img.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration" value={duration} onChange={setDuration} placeholder="e.g. 7N" required />
            <Field label="Price" value={price} onChange={setPrice} placeholder="e.g. ₹62,000" required />
          </div>
          <Field label="Tags (comma-separated)" value={tags} onChange={setTags} placeholder="e.g. Adventure, Culture" />
          <Field label="Description" value={description} onChange={setDescription} placeholder="Short description..." required />
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity">
            {mode === "add" ? "Add Destination" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Package Form Modal ───
function PackageModal({ mode, initial, destinations, onSave, onClose }: { mode: ModalMode; initial?: Package; destinations: Destination[]; onSave: (p: Omit<Package, "id">) => void; onClose: () => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [image, setImage] = useState(initial?.image || AVAILABLE_IMAGES[0].value);
  const [price, setPrice] = useState(initial?.price || "");
  const [highlights, setHighlights] = useState(initial?.highlights.join(", ") || "");
  const [destinationId, setDestinationId] = useState(initial?.destinationId || destinations[0]?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, image, price, highlights: highlights.split(",").map((h) => h.trim()).filter(Boolean), destinationId });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 rounded-2xl bg-[#192122] border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">{mode === "add" ? "➕ Add Package" : "✏️ Edit Package"}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Package Name" value={name} onChange={setName} placeholder="e.g. 5N Dubai" required />
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1.5">Destination</label>
            <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all appearance-none" required>
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1.5">Image</label>
            <select value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50 transition-all appearance-none">
              {AVAILABLE_IMAGES.map((img) => <option key={img.value} value={img.value}>{img.label}</option>)}
            </select>
          </div>
          <Field label="Price" value={price} onChange={setPrice} placeholder="e.g. ₹81,500" required />
          <Field label="Highlights (comma-separated)" value={highlights} onChange={setHighlights} placeholder="e.g. 5-Star Hotel, Return Flights, Desert Safari" required />
        </div>
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity">
            {mode === "add" ? "Add Package" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Reusable Field ───
function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all" />
    </div>
  );
}

// ─── Main Admin Page ───
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("destinations");
  const [selectedDestFilter, setSelectedDestFilter] = useState<string>("all");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal state
  const [destModal, setDestModal] = useState<{ mode: ModalMode; item?: Destination } | null>(null);
  const [pkgModal, setPkgModal] = useState<{ mode: ModalMode; item?: Package } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "dest" | "pkg"; id: string; name: string } | null>(null);

  const refreshData = useCallback(async () => {
    const dests = await fetchDestinations();
    const pkgs = await fetchPackages();
    setDestinations(dests);
    setPackages(pkgs);
  }, []);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setChecking(false);
    refreshData();
  }, [refreshData]);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  // ─── Destination Handlers ───
  const handleSaveDest = async (data: Omit<Destination, "id">) => {
    if (destModal?.mode === "edit" && destModal.item) {
      const res = await updateDestination({ ...data, id: destModal.item.id });
      if (res.success) showToast(`"${data.name}" updated successfully!`, "success");
      else showToast(res.error || "Failed", "error");
    } else {
      const res = await saveDestination({ ...data, id: crypto.randomUUID() });
      if (res.success) showToast(`"${data.name}" added successfully!`, "success");
      else showToast(res.error || "Failed", "error");
    }
    setDestModal(null);
    refreshData();
  };

  const handleDeleteDest = async () => {
    if (confirmDelete && confirmDelete.type === "dest") {
      const res = await deleteDestinationAction(confirmDelete.id);
      if (res.success) showToast(`"${confirmDelete.name}" deleted.`, "success");
      else showToast(res.error || "Failed", "error");
      setConfirmDelete(null);
      refreshData();
    }
  };

  // ─── Package Handlers ───
  const handleSavePkg = async (data: Omit<Package, "id">) => {
    if (pkgModal?.mode === "edit" && pkgModal.item) {
      const res = await updatePackage({ ...data, id: pkgModal.item.id });
      if (res.success) showToast(`"${data.name}" updated successfully!`, "success");
      else showToast(res.error || "Failed", "error");
    } else {
      const res = await savePackage({ ...data, id: crypto.randomUUID() });
      if (res.success) showToast(`"${data.name}" added successfully!`, "success");
      else showToast(res.error || "Failed", "error");
    }
    setPkgModal(null);
    refreshData();
  };

  const handleDeletePkg = async () => {
    if (confirmDelete && confirmDelete.type === "pkg") {
      const res = await deletePackageAction(confirmDelete.id);
      if (res.success) showToast(`"${confirmDelete.name}" deleted.`, "success");
      else showToast(res.error || "Failed", "error");
      setConfirmDelete(null);
      refreshData();
    }
  };

  const handleLogout = () => { logoutAdmin(); setAuthenticated(false); };

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-[#050B1F]"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!authenticated) return <LoginScreen onLogin={() => { setAuthenticated(true); refreshData(); }} />;

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(180deg, #050B1F 0%, #0A1628 100%)", fontFamily: "var(--font-body)" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {destModal && <DestinationModal mode={destModal.mode} initial={destModal.item} onSave={handleSaveDest} onClose={() => setDestModal(null)} />}
      {pkgModal && <PackageModal mode={pkgModal.mode} initial={pkgModal.item} destinations={destinations} onSave={handleSavePkg} onClose={() => setPkgModal(null)} />}
      {confirmDelete && <ConfirmDialog message={`This will permanently delete "${confirmDelete.name}". This action cannot be undone.`} onConfirm={confirmDelete.type === "dest" ? handleDeleteDest : handleDeletePkg} onCancel={() => setConfirmDelete(null)} />}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050B1F]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>
              <span className="text-cyan-400">Lets</span>Trip <span className="text-gray-500 font-normal text-sm">Admin</span>
            </h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10 hover:text-white transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
          <button onClick={() => setTab("destinations")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "destinations" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <MapPin size={16} /> Destinations ({destinations.length})
          </button>
          <button onClick={() => setTab("packages")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === "packages" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Briefcase size={16} /> Packages ({packages.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {tab === "destinations" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>Manage Destinations</h2>
              <button onClick={() => setDestModal({ mode: "add" })} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity">
                <Plus size={16} /> Add Destination
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((d) => (
                <div key={d.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-gray-800">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setDestModal({ mode: "edit", item: d })} className="p-2 rounded-lg bg-black/60 backdrop-blur text-white hover:bg-cyan-500/40 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setConfirmDelete({ type: "dest", id: d.id, name: d.name })} className="p-2 rounded-lg bg-black/60 backdrop-blur text-white hover:bg-red-500/40 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-headline)" }}>{d.name}</h3>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{d.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold text-sm">{d.price}</span>
                    <span className="text-gray-500 text-xs">{d.duration}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {d.tags.map((tag) => <span key={tag} className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold uppercase tracking-wider">{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-headline)" }}>Manage Packages</h2>
              <button onClick={() => setPkgModal({ mode: "add" })} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold hover:opacity-90 transition-opacity">
                <Plus size={16} /> Add Package
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              <button onClick={() => setSelectedDestFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${selectedDestFilter === "all" ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>All Packages</button>
              {destinations.map(d => (
                <button key={d.id} onClick={() => setSelectedDestFilter(d.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${selectedDestFilter === d.id ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>{d.name}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.filter(p => selectedDestFilter === "all" || p.destinationId === selectedDestFilter).map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white text-sm" style={{ fontFamily: "var(--font-headline)" }}>{p.name}</h3>
                          <p className="text-cyan-400 font-bold mt-0.5">{p.price}</p>
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setPkgModal({ mode: "edit", item: p })} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => setConfirmDelete({ type: "pkg", id: p.id, name: p.name })} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.highlights.map((h) => <span key={h} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px]">{h}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
