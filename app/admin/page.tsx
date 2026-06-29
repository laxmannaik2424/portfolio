'use client'

import { useState, useEffect } from 'react';
import { Menu, X, Save, LogOut, Image as ImageIcon, Link as LinkIcon, Upload, Loader2, CheckCircle2, ArrowLeft, ArrowRight, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CUSTOM UI COMPONENTS ---

function Toast({ message, onClose }: { message: string, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 right-6 bg-zinc-900 border border-green-500/50 shadow-2xl shadow-green-900/20 text-white px-6 py-4 rounded-xl flex items-center gap-3 z-[9999]"
    >
      <CheckCircle2 className="text-green-500" size={20} />
      <span className="font-medium tracking-wide">{message}</span>
    </motion.div>
  );
}

function ConfirmModal({ isOpen, message, onConfirm, onCancel }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-white">Are you sure?</h3>
            <p className="text-zinc-400 mb-8">{message}</p>
            <div className="flex gap-4">
              <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition font-semibold">Cancel</button>
              <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold text-white">Yes, Logout</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function UploadModal({ isOpen, onClose, onSave, oldPublicId }: any) {
  const [tab, setTab] = useState<'file'|'url'>('file');
  const [file, setFile] = useState<File|null>(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setUrl('');
      setLoading(false);
      setProgress(0);
      setTab('file');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (tab === 'url') {
      if (!url) return;
      onSave(url);
      onClose();
    } else {
      if (!file) return;
      setLoading(true);
      setProgress(10);
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (oldPublicId) formData.append('oldPublicId', oldPublicId);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            if (data.url) {
              onSave(data.url, data.public_id);
              onClose();
            } else {
              console.error("No url returned", data);
              alert("Upload failed. Please try again.");
              setLoading(false);
              setProgress(0);
            }
          } else {
            console.error("Upload proxy error:", xhr.responseText);
            alert("Upload failed. The server might be blocking large files or the network dropped.");
            setLoading(false);
            setProgress(0);
          }
        };

        xhr.onerror = () => {
          console.error("Upload network error");
          alert("Network error during upload. Please check your connection.");
          setLoading(false);
          setProgress(0);
        };

        xhr.send(formData);
      } catch (e) {
        console.error("Upload error", e);
        setLoading(false);
        setProgress(0);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="flex border-b border-zinc-800">
              <button onClick={() => setTab('file')} className={`flex-1 py-4 flex justify-center items-center gap-2 font-medium transition ${tab === 'file' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Upload size={18}/> Upload File</button>
              <button onClick={() => setTab('url')} className={`flex-1 py-4 flex justify-center items-center gap-2 font-medium transition ${tab === 'url' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><LinkIcon size={18}/> Image URL</button>
            </div>

            <div className="p-6">
              {tab === 'file' ? (
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-800/50 transition relative">
                  <input type="file" accept="image/*,video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                  }} />
                  <ImageIcon size={32} className="text-zinc-500 mb-4" />
                  <p className="text-zinc-300 font-medium mb-1">{file ? file.name : "Click or drag file to upload"}</p>
                  <p className="text-zinc-500 text-sm">PNG, JPG, MP4 up to 50MB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Direct Image/Video URL</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg" 
                    value={url} onChange={e => setUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-medium transition">Cancel</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading || (tab === 'file' ? !file : !url)}
                  className="flex-1 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold transition flex justify-center items-center disabled:opacity-50 relative overflow-hidden group"
                >
                  {loading && tab === 'file' && (
                    <div className="absolute left-0 top-0 bottom-0 bg-green-400/20 transition-all duration-300" style={{ width: `${progress}%` }} />
                  )}
                  <div className="relative z-10 flex items-center">
                    {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                    {loading ? (
                      tab === 'file' ? (progress > 0 ? `Uploading... ${progress}%` : "Starting upload...") : "Saving..."
                    ) : "Save Media"}
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// --- MAIN ADMIN PAGE ---

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [content, setContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Uploader State
  const [uploadState, setUploadState] = useState<{isOpen: boolean, path: (string | number)[], oldPid: string}>({ isOpen: false, path: [], oldPid: '' });
  const [currentAdminGridIndex, setCurrentAdminGridIndex] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchContent();
    } else {
      setLoading(false);
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Standard way to show native confirmation dialog when closing/reloading tab
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Destroy the session so if they navigate back/forward, they must log in again
      sessionStorage.removeItem('admin_auth');
    };
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (res.ok) setContent(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
        await fetchContent();
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) { setLoginError('Network error'); }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setContent(null);
    setShowLogoutConfirm(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (res.ok) setToastMsg('Settings saved successfully!');
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const updateNestedField = (path: (string | number)[], value: any) => {
    const newContent = { ...content };
    let current = newContent;
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]] === undefined) {
        current[path[i]] = (typeof path[i+1] === 'number') ? [] : {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setContent(newContent);
  };

  const openUploader = (path: (string | number)[], oldPid: string) => {
    setUploadState({ isOpen: true, path, oldPid });
  };

  const handleUploadSave = async (url: string, publicId: string) => {
    const newContent = { ...content };
    let current = newContent;
    for (let i = 0; i < uploadState.path.length - 1; i++) {
      if (current[uploadState.path[i]] === undefined) {
        current[uploadState.path[i]] = (typeof uploadState.path[i+1] === 'number') ? [] : {};
      }
      current = current[uploadState.path[i]];
    }
    // Assume path is something like ['hero', 'mediaUrl']
    // So we set mediaUrl, and optionally mediaPublicId
    const targetKey = uploadState.path[uploadState.path.length - 1];
    current[targetKey] = url;
    
    // Auto-update publicId sibling if it exists
    if (targetKey === 'mediaUrl') {
       current['mediaPublicId'] = publicId;
    }
    if (targetKey === 'mobileMediaUrl') {
       current['mobileMediaPublicId'] = publicId;
    }
    // If inside an array object (like works.mediaList[idx].url)
    if (targetKey === 'url') {
      current['publicId'] = publicId;
    }

    setContent(newContent);
    
    // Auto-save to DB after successful upload so users don't lose media on refresh
    try {
      const res = await fetch('/api/content', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      if (res.ok) setToastMsg('Media uploaded and automatically saved!');
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center"><Loader2 className="animate-spin mb-4" size={32}/><p className="text-zinc-500 font-medium tracking-widest uppercase text-sm">Loading</p></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 font-sans text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none"/>
        <form onSubmit={handleLogin} className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-10 rounded-[2rem] w-full max-w-sm flex flex-col space-y-6 shadow-2xl">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-black tracking-tighter mb-2">Prince.</h2>
            <p className="text-zinc-500 font-medium text-sm tracking-widest uppercase">Admin Portal</p>
          </div>
          {loginError && <p className="text-red-400 text-sm font-medium text-center bg-red-950/30 py-2 rounded-lg border border-red-900/50">{loginError}</p>}
          <div className="space-y-4">
            <input 
              type="text" placeholder="Username" 
              className="w-full px-5 py-4 bg-zinc-950/50 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors"
              value={loginUser} onChange={e => setLoginUser(e.target.value)} required 
            />
            <input 
              type="password" placeholder="Password" 
              className="w-full px-5 py-4 bg-zinc-950/50 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors"
              value={loginPass} onChange={e => setLoginPass(e.target.value)} required 
            />
          </div>
          <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  // If authenticated but no content fetched yet, show an error state so it doesn't crash on content.hero
  if (!content) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">Error: Content not found. Did you seed the database?</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white text-black rounded font-bold">Retry</button>
      </div>
    );
  }

  const tabs = ['Hero', 'About', 'Works', 'Services', 'Exhibitions', 'Footer', 'Credentials'];

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white font-sans flex flex-col md:flex-row relative">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-950 z-50">
        <h1 className="text-xl font-black tracking-tighter">Prince.</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-zinc-900 rounded-lg">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {(mobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`fixed md:sticky top-[73px] md:top-0 left-0 h-[calc(100dvh-73px)] md:h-[100dvh] w-64 shrink-0 bg-zinc-950/90 md:bg-zinc-950 border-r border-zinc-900 p-6 flex flex-col space-y-2 z-40 backdrop-blur-xl md:backdrop-blur-none`}
          >
            <h1 className="hidden md:block text-2xl font-black tracking-tighter mb-8 px-4 text-zinc-100">Prince.</h1>
            <div className="flex-1 overflow-y-auto space-y-1 pr-2">
              {tabs.map(tab => (
                <button 
                  key={tab} 
                  onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition font-medium tracking-wide flex items-center justify-between ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="pt-6 border-t border-zinc-900 mt-auto">
              <button onClick={() => setShowLogoutConfirm(true)} className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/30 hover:text-red-300 transition font-medium flex items-center gap-3">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-zinc-950/50 min-h-[calc(100dvh-73px)] md:min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight">{activeTab}</h2>
              <p className="text-zinc-500 font-medium mt-1">Manage content and media</p>
            </div>
            {activeTab !== 'Credentials' && (
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 flex items-center gap-2 w-full md:w-auto justify-center"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>

          <div className="space-y-8 pb-20">
            {activeTab === 'Hero' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800">
                  <label className="block mb-6"><span className="text-zinc-400 font-medium block mb-3">Top Subheading</span>
                    <textarea className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors h-32" value={content?.hero?.topSubheading || ''} onChange={e => updateNestedField(['hero', 'topSubheading'], e.target.value)} />
                  </label>
                  <label className="block mb-6"><span className="text-zinc-400 font-medium block mb-3">Signature Subtext</span>
                    <textarea className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors h-24" value={content?.hero?.signatureSubtext || ''} onChange={e => updateNestedField(['hero', 'signatureSubtext'], e.target.value)} />
                  </label>
                  <div className="pt-6 border-t border-zinc-800">
                    <span className="text-zinc-400 font-medium block mb-4">Background Media</span>
                    
                    <div className="flex flex-col gap-8">
                      {/* Desktop */}
                      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className="w-40 h-40 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative group cursor-pointer shrink-0" onClick={() => openUploader(['hero', 'mediaUrl'], content?.hero?.mediaPublicId)}>
                          {content?.hero?.mediaUrl?.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) 
                            ? <video src={content?.hero?.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                            : <img src={content?.hero?.mediaUrl} className="w-full h-full object-cover" alt="Hero Media" />
                          }
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><Upload size={24}/></div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="text-white font-bold tracking-wide">Desktop Background</h4>
                          <p className="text-sm text-zinc-500">Click the thumbnail to upload a new video or image, or paste a URL for the desktop layout.</p>
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className="w-24 h-40 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative group cursor-pointer shrink-0" onClick={() => openUploader(['hero', 'mobileMediaUrl'], content?.hero?.mobileMediaPublicId)}>
                          {content?.hero?.mobileMediaUrl?.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) 
                            ? <video src={content?.hero?.mobileMediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                            : <img src={content?.hero?.mobileMediaUrl || content?.hero?.mediaUrl} className="w-full h-full object-cover" alt="Hero Mobile Media" />
                          }
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><Upload size={24}/></div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="text-white font-bold tracking-wide">Mobile Background</h4>
                          <p className="text-sm text-zinc-500">Upload a separate portrait-ratio media for mobile devices to fix ratio issues.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs (About, Services, Exhibitions, Footer) truncated for brevity but similarly styled if needed. 
                I will style Works specifically as requested. */}
            
            {activeTab === 'Works' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <label className="block"><span className="text-zinc-400 font-medium block mb-3">Year</span>
                      <input type="text" className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={content?.works?.year || ''} onChange={e => updateNestedField(['works', 'year'], e.target.value)} />
                    </label>
                    <label className="block"><span className="text-zinc-400 font-medium block mb-3">Title</span>
                      <input type="text" className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={content?.works?.title || ''} onChange={e => updateNestedField(['works', 'title'], e.target.value)} />
                    </label>
                  </div>
                  <label className="block mb-8"><span className="text-zinc-400 font-medium block mb-3">Description</span>
                    <textarea className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors h-32" value={content?.works?.description || ''} onChange={e => updateNestedField(['works', 'description'], e.target.value)} />
                  </label>
                  
                  <div className="pt-6 border-t border-zinc-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <span className="text-zinc-300 font-medium mr-3">Bento Grid Media Editor</span>
                        <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full">WYSIWYG</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setCurrentAdminGridIndex(Math.max(0, currentAdminGridIndex - 1))}
                          disabled={currentAdminGridIndex === 0}
                          className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                        >
                          <ArrowLeft size={16} />
                        </button>
                        <span className="text-sm font-medium">Grid {currentAdminGridIndex + 1} of {content?.works?.grids?.length || 1}</span>
                        <button 
                          onClick={() => setCurrentAdminGridIndex(Math.min((content.works.grids?.length || 1) - 1, currentAdminGridIndex + 1))}
                          disabled={currentAdminGridIndex >= (content?.works?.grids?.length || 1) - 1}
                          className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                        >
                          <ArrowRight size={16} />
                        </button>
                        <div className="flex items-center ml-2 gap-2">
                          <button 
                            onClick={() => {
                              const newGrids = [...(content?.works?.grids || [])];
                              newGrids.push({ mediaList: [] });
                              updateNestedField(['works', 'grids'], newGrids);
                              setCurrentAdminGridIndex(newGrids.length - 1);
                            }}
                            className="text-xs bg-white text-black px-3 py-2 rounded-lg font-bold hover:bg-zinc-200"
                          >
                            + Add Grid
                          </button>
                          
                          <button 
                            onClick={() => {
                              if (!content?.works?.grids || content?.works?.grids?.length <= 1) {
                                alert("You cannot delete the last grid. Just replace its images.");
                                return;
                              }
                              const newGrids = [...(content?.works?.grids || [])];
                              newGrids.splice(currentAdminGridIndex, 1);
                              updateNestedField(['works', 'grids'], newGrids);
                              setCurrentAdminGridIndex(Math.max(0, currentAdminGridIndex - 1));
                            }}
                            disabled={!content?.works?.grids || content?.works?.grids?.length <= 1}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-500"
                            title="Delete current grid"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500 mb-6">Click any block in the grid to change its media. Use the arrows to paginate through different grids.</p>
                    
                    {/* BENTO GRID REPLICA */}
                    <div className="grid grid-cols-3 gap-2 w-full max-w-[800px] mx-auto p-4 bg-zinc-950 rounded-2xl border border-zinc-900">
                      {[
                        { col: 'col-span-2', aspect: 'aspect-[2/1]' }, // 0: Wide Bridge
                        { col: 'col-span-1 row-span-2', aspect: 'aspect-[1/2]' }, // 1: Portrait
                        { col: 'col-span-1', aspect: 'aspect-square' }, // 2: Curves
                        { col: 'col-span-1', aspect: 'aspect-square' }, // 3: Faces
                        { col: 'col-span-1 row-span-2', aspect: 'aspect-[1/2]' }, // 4: Window
                        { col: 'col-span-1', aspect: 'aspect-square', special: true }, // 5: Red Square
                        { col: 'col-span-1', aspect: 'aspect-square' }, // 6: Tower
                        { col: 'col-span-2', aspect: 'aspect-[2/1]' }  // 7: Wide Silhouette
                      ].map((cell, idx) => {
                        const currentGrid = content?.works?.grids?.[currentAdminGridIndex] || { mediaList: [] };
                        const media = currentGrid.mediaList?.[idx] || { url: '', publicId: '' };
                        const isVideo = media.url?.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i);
                        
                        return (
                          <div 
                            key={idx} 
                            onClick={() => openUploader(['works', 'grids', currentAdminGridIndex, 'mediaList', idx, 'url'], media.publicId)}
                            className={`${cell.col} relative ${cell.aspect} ${cell.special ? 'bg-[#cc0000]' : 'bg-zinc-900'} overflow-hidden group cursor-pointer border border-zinc-800`}
                          >
                            {cell.special ? (
                               <div className="absolute w-[125%] h-[125%] -left-[15%] -top-[20%] -rotate-[12deg] z-20 border-[3px] md:border-4 border-white shadow-2xl bg-black overflow-hidden group-hover:scale-105 transition-transform">
                                {isVideo ? <video src={media.url} className="w-full h-full object-cover grayscale" autoPlay muted loop /> : (media.url ? <img src={media.url} className="w-full h-full object-cover grayscale" /> : <div className="w-full h-full bg-black"></div>)}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload size={24} className="text-white"/></div>
                               </div>
                            ) : (
                              <>
                                {isVideo ? <video src={media.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" autoPlay muted loop /> : (media.url ? <img src={media.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full bg-black"></div>)}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-30"><Upload size={24} className="text-white"/></div>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other sections simplified for brevity but functional */}
            {activeTab === 'About' && (
              <div className="bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800 space-y-6">
                <label className="block mb-6"><span className="text-zinc-400 font-medium block mb-3">Title</span>
                  <input type="text" className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={content?.about?.title || ''} onChange={e => updateNestedField(['about', 'title'], e.target.value)} />
                </label>
                <label className="block mb-6"><span className="text-zinc-400 font-medium block mb-3">Description</span>
                  <textarea className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors h-48" value={content?.about?.description || ''} onChange={e => updateNestedField(['about', 'description'], e.target.value)} />
                </label>

                <div className="pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-zinc-300 font-medium block">Media Stack (Images & Videos)</span>
                    <button 
                      onClick={() => {
                        const newList = [...(content?.about?.mediaList || [])];
                        newList.push({ url: '', publicId: '' });
                        updateNestedField(['about', 'mediaList'], newList);
                      }}
                      className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-zinc-200 transition flex items-center gap-2"
                    >
                      <Plus size={14}/> Add Media
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {content?.about?.mediaList?.map((item: any, idx: number) => {
                      const isVideo = item?.url?.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i);
                      return (
                        <div key={idx} className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                          <div 
                            className="w-24 h-24 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 relative group cursor-pointer shrink-0"
                            onClick={() => openUploader(['about', 'mediaList', idx, 'url'], item?.publicId)}
                          >
                            {isVideo 
                              ? <video src={item?.url} className="w-full h-full object-cover" autoPlay muted loop playsInline /> 
                              : (item?.url ? <img src={item?.url} className="w-full h-full object-cover" alt="About Media" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">Empty</div>)
                            }
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-30"><Upload size={16} className="text-white"/></div>
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-xs text-zinc-500 mb-1">Media #{idx + 1}</p>
                            <p className="text-sm text-zinc-300 truncate max-w-[200px] md:max-w-md">{item?.url || "No media uploaded"}</p>
                          </div>

                          <button 
                            onClick={() => {
                              const newList = [...(content?.about?.mediaList || [])];
                              newList.splice(idx, 1);
                              updateNestedField(['about', 'mediaList'], newList);
                            }}
                            className="p-3 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )
                    })}
                    {(!content?.about?.mediaList || content?.about?.mediaList?.length === 0) && (
                      <p className="text-sm text-zinc-500 text-center py-8 border border-dashed border-zinc-800 rounded-xl">No media items added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Services' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800">
                  <label className="block mb-8"><span className="text-zinc-400 font-medium block mb-3">Description</span>
                    <textarea className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors h-32" value={content?.services?.description || ''} onChange={e => updateNestedField(['services', 'description'], e.target.value)} />
                  </label>
                  
                  <div className="pt-6 border-t border-zinc-800">
                    <span className="text-zinc-300 font-medium mb-6 block">Services List</span>
                    <div className="space-y-4">
                      {content?.services?.list?.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col md:flex-row items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                          <div 
                            className="w-full md:w-32 h-20 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 relative group cursor-pointer shrink-0"
                            onClick={() => openUploader(['services', 'list', idx, 'mediaUrl'], item?.publicId)}
                          >
                            {item?.mediaUrl?.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) 
                              ? <video src={item?.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                              : <img src={item?.mediaUrl} className="w-full h-full object-cover" alt={item?.title} />
                            }
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-30"><Upload size={20} className="text-white"/></div>
                          </div>
                          <input 
                            type="text" 
                            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" 
                            value={item?.title || ""} 
                            placeholder="Service Title"
                            onChange={e => updateNestedField(['services', 'list', idx, 'title'], e.target.value)} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Exhibitions' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <label className="block"><span className="text-zinc-400 font-medium block mb-3">Year</span>
                      <input type="text" className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={content?.exhibitions?.year || ''} onChange={e => updateNestedField(['exhibitions', 'year'], e.target.value)} />
                    </label>
                    <label className="block"><span className="text-zinc-400 font-medium block mb-3">Title</span>
                      <input type="text" className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={content?.exhibitions?.title || ''} onChange={e => updateNestedField(['exhibitions', 'title'], e.target.value)} />
                    </label>
                  </div>
                  <label className="block mb-8"><span className="text-zinc-400 font-medium block mb-3">Description</span>
                    <textarea className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors h-32" value={content?.exhibitions?.description || ''} onChange={e => updateNestedField(['exhibitions', 'description'], e.target.value)} />
                  </label>
                  
                  <div className="pt-6 border-t border-zinc-800">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-zinc-300 font-medium">Exhibitions List</span>
                      <button 
                        onClick={() => {
                          const newList = [...(content?.exhibitions?.list || [])];
                          newList.push({ text: "NEW LOCATION\nNEW STUDIO", mediaUrl: "", publicId: "" });
                          updateNestedField(['exhibitions', 'list'], newList);
                        }}
                        className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold hover:bg-zinc-200 transition"
                      >
                        + Add Exhibition
                      </button>
                    </div>
                    <div className="space-y-4">
                      {content?.exhibitions?.list?.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col md:flex-row items-start gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900 relative">
                          <button 
                            onClick={() => {
                              const newList = (content?.exhibitions?.list || []).filter((_: any, i: number) => i !== idx);
                              updateNestedField(['exhibitions', 'list'], newList);
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-500 z-40"
                          >
                            <X size={14} />
                          </button>
                          <div 
                            className="w-full md:w-48 h-32 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 relative group cursor-pointer shrink-0"
                            onClick={() => openUploader(['exhibitions', 'list', idx, 'mediaUrl'], item?.publicId)}
                          >
                            {item?.mediaUrl?.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) 
                              ? <video src={item?.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                              : <img src={item?.mediaUrl} className="w-full h-full object-cover" alt="Exhibition" />
                            }
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-30"><Upload size={20} className="text-white"/></div>
                          </div>
                          <textarea 
                            className="w-full h-32 p-4 bg-zinc-900 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" 
                            value={item?.text || ""} 
                            placeholder="LOCATION, DATE&#10;STUDIO NAME"
                            onChange={e => updateNestedField(['exhibitions', 'list', idx, 'text'], e.target.value)} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Footer' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800">
                  <span className="text-zinc-400 font-medium block mb-4">Background Media</span>
                  
                  <div className="flex flex-col gap-8">
                    {/* Desktop */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="w-full sm:w-64 aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative group cursor-pointer shrink-0" onClick={() => openUploader(['footer', 'mediaUrl'], content?.footer?.mediaPublicId)}>
                        {content?.footer?.mediaUrl?.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) 
                          ? <video src={content?.footer?.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                          : <img src={content?.footer?.mediaUrl} className="w-full h-full object-cover" alt="Footer Media" />
                        }
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><Upload size={24}/></div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-white font-bold tracking-wide">Desktop Background</h4>
                        <p className="text-sm text-zinc-500">Upload a landscape video/image for the desktop footer background.</p>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="w-24 h-40 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative group cursor-pointer shrink-0" onClick={() => openUploader(['footer', 'mobileMediaUrl'], content?.footer?.mobileMediaPublicId)}>
                        {content?.footer?.mobileMediaUrl?.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) 
                          ? <video src={content?.footer?.mobileMediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                          : <img src={content?.footer?.mobileMediaUrl || content?.footer?.mediaUrl} className="w-full h-full object-cover" alt="Footer Mobile Media" />
                        }
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><Upload size={24}/></div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-white font-bold tracking-wide">Mobile Background</h4>
                        <p className="text-sm text-zinc-500">Upload a portrait video/image for the mobile footer background.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800 space-y-8">
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-white">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="block">
                        <span className="text-zinc-400 font-medium block mb-2">Email Address</span>
                        <input 
                          type="email" 
                          value={content.footer?.email || ''} 
                          onChange={e => updateNestedField(['footer', 'email'], e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                          placeholder="hello@example.com"
                        />
                      </label>
                      <label className="block">
                        <span className="text-zinc-400 font-medium block mb-2">Mobile Number</span>
                        <input 
                          type="text" 
                          value={content.footer?.mobile || ''} 
                          onChange={e => updateNestedField(['footer', 'mobile'], e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                          placeholder="+91 76763 43642"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800">
                    <h3 className="text-xl font-bold mb-4 text-white">Social Links & Toggles</h3>
                    
                    <div className="space-y-6">
                      <label className="block">
                        <span className="text-zinc-400 font-medium block mb-2">Instagram Link</span>
                        <p className="text-sm text-zinc-500 mb-2">Controls the right-side floating button and mobile contact card.</p>
                        <input 
                          type="url" 
                          value={content.socials?.instagram || ''} 
                          onChange={e => updateNestedField(['socials', 'instagram'], e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                          placeholder="https://instagram.com/yourprofile"
                        />
                      </label>

                      <label className="block">
                        <span className="text-zinc-400 font-medium block mb-2">WhatsApp Link</span>
                        <p className="text-sm text-zinc-500 mb-2">Controls the left-side floating button and mobile contact card.</p>
                        <input 
                          type="url" 
                          value={content.socials?.whatsapp || ''} 
                          onChange={e => updateNestedField(['socials', 'whatsapp'], e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                          placeholder="https://wa.me/12345678900"
                        />
                      </label>

                      <label className="flex items-center gap-4 cursor-pointer mt-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={content.socials?.enableInstagram !== false}
                            onChange={e => updateNestedField(['socials', 'enableInstagram'], e.target.checked)}
                          />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${content.socials?.enableInstagram !== false ? 'bg-[#cc0000]' : 'bg-zinc-700'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${content.socials?.enableInstagram !== false ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                          <span className="text-white font-medium block">Enable Instagram Floating Button & Card</span>
                          <span className="text-zinc-500 text-sm">Toggle visibility of the Instagram elements globally.</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-4 cursor-pointer mt-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={content.socials?.enableWhatsapp !== false}
                            onChange={e => updateNestedField(['socials', 'enableWhatsapp'], e.target.checked)}
                          />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${content.socials?.enableWhatsapp !== false ? 'bg-[#25D366]' : 'bg-zinc-700'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${content.socials?.enableWhatsapp !== false ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                          <span className="text-white font-medium block">Enable Floating WhatsApp Button & Card</span>
                          <span className="text-zinc-500 text-sm">Toggle visibility of the WhatsApp elements globally.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Credentials' && (
               <CredentialUpdateForm setToastMsg={setToastMsg} />
            )}

          </div>
        </div>
      </div>

      <UploadModal 
        isOpen={uploadState.isOpen} 
        oldPublicId={uploadState.oldPid}
        onClose={() => setUploadState({isOpen: false, path: [], oldPid: ''})}
        onSave={handleUploadSave}
      />

      <ConfirmModal 
        isOpen={showLogoutConfirm}
        message="Are you sure you want to log out of the admin panel?"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />

      <AnimatePresence>
        {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
      </AnimatePresence>
    </div>
  );
}

function CredentialUpdateForm({ setToastMsg }: { setToastMsg: (msg: string) => void }) {
  const [oldUser, setOldUser] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldUsername: oldUser, oldPassword: oldPass, newUsername: newUser, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok) {
        setToastMsg('Credentials updated! Please re-login.');
        setTimeout(() => {
          sessionStorage.removeItem('admin_auth');
          window.location.reload();
        }, 2000);
      } else {
        setErrorMsg(data.error || 'Failed to update credentials');
      }
    } catch (err) { setErrorMsg('Network error occurred'); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-800 max-w-md space-y-6">
      <h3 className="text-2xl font-bold">Security</h3>
      <p className="text-zinc-500 text-sm">Update your admin login credentials.</p>
      
      {errorMsg && <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-3 rounded-xl text-sm font-medium">{errorMsg}</div>}
      
      <input type="text" placeholder="Current Username" required className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={oldUser} onChange={e=>setOldUser(e.target.value)} />
      <input type="password" placeholder="Current Password" required className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={oldPass} onChange={e=>setOldPass(e.target.value)} />
      <hr className="border-zinc-800 my-4" />
      <input type="text" placeholder="New Username" required className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={newUser} onChange={e=>setNewUser(e.target.value)} />
      <input type="password" placeholder="New Password" required className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white transition-colors" value={newPass} onChange={e=>setNewPass(e.target.value)} />
      <button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-bold transition flex justify-center items-center">
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Credentials"}
      </button>
    </form>
  )
}
