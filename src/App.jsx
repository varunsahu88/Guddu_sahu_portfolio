import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Mail, Figma, PenTool, FileText, Github, 
  Linkedin, ArrowUpRight, Menu, X, Sparkles, Send, Bot, Loader2, 
  Lightbulb, Zap, Terminal, Layers, Copy, Check, Plus, Lock, Unlock, 
  Trash2, Key, User, Upload, Image as ImageIcon, Flame, FileJson, 
  Code, Cpu, Palette, Target, Trophy, Activity, Briefcase, Quote, 
  MessageSquare, ChevronDown, Globe, Pencil, RefreshCw, Compass 
} from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';

// --- Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
const GEMINI_MODEL = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'guddu-portfolio-stable';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const skills = ["Vibe Coder", "Figma", "React", "Tailwind CSS", "Gemini AI", "Antigravity", "Firebase", "Node.js", "Vite"];

// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

const titleContainer = {
  animate: { transition: { staggerChildren: 0.3 } }
};

const titleLine = {
  initial: { y: "100%" },
  animate: { 
    y: 0, 
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1],
      delay: 0.1
    } 
  }
};

const menuContainerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};

const menuItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
};

// --- Local Vibe AI Logic (No API Required) ---
const ROASTS = [
  "Beta, career toh tera debugging mein hi beet jayega.",
  "Google ka interface dekh ke khush ho le, andar kabhi nahi jayega.",
  "Startup ke naam pe doston se paise maangna band kar.",
  "Naukri toh door ki baat hai, intern bhi koi na rakhe tujhe.",
  "Laptop band kar aur chai ki tapri khol le,",
  "Itna ganda idea laate kahan se ho?",
  "Itni mehnat agar kaam mein lagata toh aaj yahan na hota.",
  "Sapna itna bada aur aukat itni chhoti?"
];

const getLocalRoast = (input) => {
  return ROASTS[Math.floor(Math.random() * ROASTS.length)];
};

const getLocalAIChat = (input, projects) => {
  const text = input.toLowerCase();
  
  if (text.includes("kaun") || text.includes("who") || text.includes("guddu")) {
    return "Guddu Sahu main hi hoon—Delhi ka Vibe Coder. UI/UX architect aur AI experiments ka shaukeen.";
  }
  
  if (text.includes("project") || text.includes("work") || text.includes("experiments")) {
    if (projects.length === 0) return "Abhi tak koi experiment grid par nahi hai, par back-end par vibes on hain!";
    const best = projects[0];
    return `Mere paas ${projects.length} experiments hain. "${best.title}" mera latest/best flex hai. Experiments section check kar le!`;
  }
  
  if (text.includes("tech") || text.includes("stack") || text.includes("language")) {
    return "Figma, React, Tailwind, aur Antigravity—baaki sab vibe par depend karta hai.";
  }

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Bol bhai! Kya vibe hai aaj? Project dekhna hai ya roast hona hai?";
  }

  return "Ye out of syllabus hai. Experiments ke baare mein puch ya fir soja.";
};

// --- AI Project Describer ---
const handleAutoDescribe = async (title, link) => {
  if (!title) return "Awesome experiment by Guddu Sahu.";
  
  try {
    // Try Gemini if API Key exists
    if (apiKey) {
      const prompt = `Create a short, cool, and high-vibe description (max 20 words) for a tech project named "${title}" at ${link}. Keep it aesthetic and professional like a top-tier digital agency portfolio.`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
    }
  } catch (err) {
    console.warn("AI Describe Error, falling back to local vibes...", err);
  }

  // Local Vibe Fallback
  const fallbacks = [
    `A premium digital experience focused on ${title}. Built for performance and high-density visual impact.`,
    `Refining the boundaries of ${title} with a focus on cutting-edge UI/UX and modern tech stack.`,
    `A vibe-heavy experiment in ${title}, blending clean design with interactive storytelling.`,
    `Architecting the future of ${title} through a lens of minimalism and high-end aesthetic precision.`
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

// --- Sub-Components (Moved outside App to prevent re-mounting focus loss) ---
const VIBRANT_GRADIENTS = [
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-cyan-500 via-blue-600 to-indigo-700",
  "from-emerald-500 via-teal-600 to-cyan-600",
  "from-orange-500 via-red-600 to-rose-600",
  "from-fuchsia-600 via-purple-600 to-indigo-600",
  "from-amber-500 via-orange-600 to-yellow-500",
  "from-violet-600 via-purple-600 to-fuchsia-600",
  "from-sky-500 via-blue-500 to-indigo-500"
];

const getCategoryPrefix = (cat) => {
  const c = String(cat).toLowerCase();
  if (c.includes('app') || c.includes('native') || c.includes('build')) return "BUILD:";
  if (c.includes('web') || c.includes('live') || c.includes('site')) return "LIVE DEMO:";
  if (c.includes('design') || c.includes('concept') || c.includes('ui')) return "CONCEPT:";
  return "PROJECT:";
};

const ProjectCard = memo(({ p, index, isFeatured, isAdmin, handleEditClick, setShowProjectModal, setSelectedProject, confirmDeleteId, handleDeleteProject, setConfirmDeleteId, db, appId }) => {
  const gradientClass = VIBRANT_GRADIENTS[index % VIBRANT_GRADIENTS.length];
  const prefix = getCategoryPrefix(p.cat);

  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      whileHover={{ scale: 1.1, zIndex: 150, transition: { duration: 0.2 } }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-[2rem] h-[200px] md:h-[320px] shadow-2xl border border-white/10 cursor-pointer ${
        isFeatured ? 'w-full md:w-[calc(66.66%-1rem)]' : 'w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1.2rem)]'}
      `}
    >
      {/* Admin Controls */}
      {isAdmin && (
        <>
          <div className="absolute top-4 right-14 z-[110] flex items-center justify-center">
            <input 
              type="number" 
              defaultValue={p.displayOrder === 999 ? "" : p.displayOrder}
              onBlur={async (e) => {
                const val = e.target.value;
                if (val === String(p.displayOrder)) return;
                const targetDoc = doc(db, 'artifacts', appId, 'public', 'data', 'projects', p.id);
                await setDoc(targetDoc, { displayOrder: val ? parseInt(val) : 999 }, { merge: true });
              }}
              placeholder="#"
              className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 text-white rounded-full text-center text-[10px] md:text-xs font-black outline-none border-2 border-white shadow-xl focus:scale-110 transition-transform placeholder:text-white/50 pointer-events-auto"
            />
          </div>
          <div className="absolute top-4 left-4 flex gap-2 z-[120]">
            <button 
              onClick={(e) => { e.stopPropagation(); handleEditClick(p); setShowProjectModal(true); }} 
              className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all"
            >
              <Pencil size={12} />
            </button>
            {confirmDeleteId === p.id ? (
              <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }} className="px-2 py-1 bg-red-500 text-white rounded-full text-[8px] font-black">DEL?</button>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(p.id); }} className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all">
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </>
      )}
      {/* Vibrant Background Layer (Hidden when image is present) */}
      {!p.imageUrl && <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />}
      {p.imageUrl && <div className="absolute inset-0 bg-black" />}
      
      {/* Image / Blur Layer */}
      <div className="absolute inset-0 z-0 h-full w-full cursor-pointer" onClick={() => setSelectedProject(p)}>
        {p.imageUrl ? (
          <div className="absolute inset-0 z-0">
            <img 
              src={p.imageUrl} 
              alt={p.title} 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 opacity-40 backdrop-blur-3xl bg-white/5" />
        )}
        
        {/* Glow Overlay */}
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-20 p-5 md:p-8 flex flex-col justify-end">
          <ArrowUpRight className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 group-hover:text-white transition-all w-4 h-4 md:w-8 md:h-8" />
          
          <div className="text-left font-black uppercase">
            {isFeatured && (
              <p className="text-white/70 text-[10px] md:text-xs tracking-[0.3em] font-black mb-1 md:mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Featured Project
              </p>
            )}
            <p className="text-orange-100 text-[10px] md:text-sm tracking-[0.1em] font-black opacity-90">
              {prefix}
            </p>
            <h3 className={`font-black tracking-tighter text-white leading-tight mt-1 truncate
              ${isFeatured ? 'text-2xl md:text-6xl' : 'text-[14px] md:text-4xl'}
            `}>
              {String(p.title)}
            </h3>
            {p.desc && isFeatured && (
              <p className="hidden md:block text-zinc-200/80 text-lg mt-4 line-clamp-2 font-medium leading-relaxed max-w-xl">
                {String(p.desc)}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const ProjectModal = ({ 
  isOpen, onClose, editingProject, 
  newProjName, setNewProjName, 
  newProjLink, setNewProjLink, 
  newProjDesc, setNewProjDesc, 
  newProjOrder, setNewProjOrder,
  newProjImg, setNewProjImg,
  newProjScreenshots, setNewProjScreenshots,
  newProjType, setNewProjType,
  isAdding, handleAddProject,
  handleAutoDescribe, handleProjScreenshotUpload, removeScreenshot
}) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 font-black uppercase overflow-y-auto"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
        className="bg-zinc-900 border-2 border-orange-500/30 w-full max-w-4xl p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] relative shadow-[0_0_50px_rgba(249,115,22,0.2)] scrollbar-none"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-zinc-800 hover:bg-orange-500 text-white rounded-full transition-all active:scale-95"><X size={24} /></button>
        
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-white">{editingProject ? "Update" : "Add"} <span className="text-orange-500">Project</span></h2>
          <p className="text-[10px] text-zinc-500 tracking-widest mt-2">{editingProject ? `Editing: ${editingProject.id}` : "Share your latest experiment"}</p>
        </div>

        <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 block ml-1">Project Name</label>
              <input value={newProjName} onChange={e => setNewProjName(e.target.value)} placeholder="e.g. JuiceVerse" className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white focus:border-orange-500 outline-none transition-all uppercase font-black" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 block ml-1">Live URL</label>
                <input value={newProjLink} onChange={e => setNewProjLink(e.target.value)} placeholder="Link" className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white focus:border-orange-500 outline-none transition-all uppercase font-black" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 block ml-1">Display Rank</label>
                <input type="number" value={newProjOrder} onChange={e => setNewProjOrder(e.target.value)} placeholder="0" className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white focus:border-orange-500 outline-none transition-all uppercase font-black" />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <label className="text-[10px] text-zinc-400 block ml-1">Description (The Vision)</label>
              <textarea value={newProjDesc} onChange={e => setNewProjDesc(e.target.value)} placeholder="Tech stack, outcome, or vibe..." className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-6 text-sm text-white focus:border-orange-500 outline-none h-32 resize-none transition-all font-bold pr-14" required />
              <button 
                type="button" 
                onClick={async () => {
                  const desc = await handleAutoDescribe(newProjName, newProjLink);
                  setNewProjDesc(desc);
                }}
                className="absolute top-10 right-4 p-2 bg-zinc-800 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-90"
              >
                <Sparkles size={18} />
              </button>
            </div>

            <div className="flex bg-black p-1.5 rounded-2xl border border-zinc-800 gap-2">
              <button type="button" onClick={() => setNewProjType("website")} className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${newProjType === "website" ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>WEBSITE</button>
              <button type="button" onClick={() => setNewProjType("apk")} className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${newProjType === "apk" ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>TEST APP / APK</button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 block ml-1">Main Thumbnail</label>
              <label className="flex items-center justify-center aspect-video border-2 border-dashed border-zinc-800 rounded-[2rem] cursor-pointer bg-black/40 hover:border-orange-500/50 transition-all overflow-hidden relative group">
                {newProjImg ? (
                  <img src={newProjImg} alt="Preview" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-orange-500">
                    <ImageIcon size={32} />
                    <span className="text-[10px]">Select or Drop Image</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      let width = img.width; let height = img.height;
                      const MAX_SIZE = 1200;
                      if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } }
                      else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
                      canvas.width = width; canvas.height = height;
                      const ctx = canvas.getContext('2d');
                      ctx.drawImage(img, 0, 0, width, height);
                      setNewProjImg(canvas.toDataURL('image/jpeg', 0.8));
                    };
                    img.src = String(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }} />
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 block ml-1">Gallery Screenshots ({newProjScreenshots.length}/{newProjImg ? 3 : 4})</label>
              <div className="grid grid-cols-3 gap-3">
                {newProjScreenshots.map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 group/shot">
                    <img src={src} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeScreenshot(i)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover/shot:opacity-100 transition-opacity"><X size={10} /></button>
                  </div>
                ))}
                {newProjScreenshots.length < (newProjImg ? 3 : 4) && (
                  <label className="aspect-video border border-dashed border-zinc-800 rounded-xl flex items-center justify-center bg-black/20 cursor-pointer hover:border-orange-500 transition-all text-zinc-700 hover:text-orange-500">
                    <Plus size={20} />
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleProjScreenshotUpload} />
                  </label>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isAdding}
              onClick={(e) => { 
                // We handle sync in handleAddProject, just close on success
                // Actually handleAddProject is async, we should await it maybe?
                // But it's already a form submission handler.
              }}
              className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-sm tracking-[0.2em] shadow-[0_20px_40px_rgba(249,115,22,0.3)] active:scale-95 transition-all mt-6 flex items-center justify-center gap-3"
            >
              {isAdding ? <Loader2 className="animate-spin" /> : <><Check size={20} /> {editingProject ? "OVERWRITE DATA" : "PUBLISH TO GRID"}</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ProjectDetailModal = ({ p, onClose, setSelectedFullScreenImg, projects, setSelectedProject }) => {
  const currentIndex = projects.findIndex(item => item.id === p.id);
  const [direction, setDirection] = useState(0); // 1 = right, -1 = left

  const handleNext = () => {
    setDirection(1);
    if (currentIndex < projects.length - 1) {
      setSelectedProject(projects[currentIndex + 1]);
    } else {
      setSelectedProject(projects[0]); // Wrap to start
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    if (currentIndex > 0) {
      setSelectedProject(projects[currentIndex - 1]);
    } else {
      setSelectedProject(projects[projects.length - 1]); // Wrap to end
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1.05, 
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (direction) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 font-black uppercase"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.95, opacity: 0 }}
        className="bg-[#0D0D0D]/80 backdrop-blur-2xl border-4 border-[#E86737] w-[96vw] max-w-[1400px] h-[88vh] rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-[0_0_80px_-20px_rgba(232,103,55,0.4)]"
      >

        <button 
          onClick={onClose}
          className="absolute top-8 right-10 p-2 md:p-3 bg-zinc-800/30 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all active:scale-95 z-20"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div 
                key={p.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid lg:grid-cols-[440px_1fr] min-h-full h-fit"
              >
            <div className="p-6 md:p-16 pb-32 flex flex-col justify-between bg-zinc-900/40 backdrop-blur-2xl border-r border-white/5 order-2 lg:order-1 relative z-10">
              <div className="space-y-8 md:space-y-12">
                <div>
                  <p className="text-orange-500 text-xs md:text-xs tracking-[0.3em] font-black mb-3 uppercase">
                    {p.type === 'apk' ? 'APP' : 'WEBSITE'}
                  </p>
                  <h2 className="text-3xl md:text-5xl lg:text-5xl font-black text-white leading-[1.1] uppercase line-clamp-2 break-words">
                    {String(p.title)}
                  </h2>
                </div>
                <div className="space-y-4">
                  <h4 className="text-orange-500 text-[10px] md:text-xs tracking-[0.3em] font-black uppercase">The Vision</h4>
                  <p className="text-sm md:text-[15px] text-zinc-300 leading-relaxed font-bold uppercase whitespace-pre-wrap max-w-md">
                    {p.desc || "No description provided."}
                  </p>
                </div>
                <div className="pt-2">
                  <a 
                    href={p.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between bg-[#E86737] hover:bg-white text-white hover:text-black px-10 py-5 rounded-full transition-all duration-500 shadow-2xl active:scale-95 group min-w-[280px]"
                  >
                    <span className="font-black text-sm tracking-widest uppercase">
                      {p.type === "apk" ? "Test App / APK" : "Open Website"}
                    </span>
                    <div className="bg-white text-black p-1.5 rounded-full ml-4">
                      <ChevronRight className="group-hover:translate-x-0.5 transition-transform" size={18} />
                    </div>
                  </a>
                </div>
              </div>
              <div className="mt-12 md:mt-20 hidden md:grid grid-cols-2 gap-6 uppercase font-black max-w-md">
                <div className="bg-[#0A0A0A] p-8 rounded-[1.8rem] border border-zinc-800/40">
                  <p className="text-orange-500 text-[9px] mb-3 tracking-widest opacity-80 uppercase">Grid</p>
                  <p className="text-white text-3xl font-black">POS #{p.displayOrder || '1'}</p>
                </div>
                <div className="bg-[#0A0A0A] p-8 rounded-[1.8rem] border border-zinc-800/40">
                  <p className="text-orange-500 text-[9px] mb-3 tracking-widest opacity-80 uppercase">Status</p>
                  <p className="text-white text-3xl font-black uppercase">Live</p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-16 pb-32 order-1 lg:order-2 flex flex-col justify-center gap-8 bg-[#0F0F0F]/30 overflow-hidden">
              {(() => {
                const allVisuals = [
                  ...(p.imageUrl ? [p.imageUrl] : []),
                  ...(p.screenshots || [])
                ].slice(0, 4);
                
                const mainVisual = allVisuals[0];
                const thumbnails = allVisuals.slice(1);

                return allVisuals.length > 0 ? (
                  <div className="w-full flex flex-col gap-6 md:gap-8">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden border border-zinc-800/30 bg-zinc-950 group shadow-2xl cursor-zoom-in aspect-video w-full"
                      onClick={() => setSelectedFullScreenImg(mainVisual)}
                    >
                      <img src={mainVisual} alt="Main Showcase" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Plus className="text-white opacity-40" size={60} />
                      </div>
                    </motion.div>
                    <div className="grid grid-cols-3 gap-6 md:gap-8">
                      {thumbnails.map((src, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="relative aspect-video rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-zinc-800/30 bg-[#0A0A0A] group shadow-xl cursor-zoom-in"
                          onClick={() => setSelectedFullScreenImg(src)}
                        >
                          <img src={src} alt={`Visual ${i + 2}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Plus className="text-white opacity-40" size={30} />
                          </div>
                        </motion.div>
                      ))}
                      {[...Array(Math.max(0, 3 - thumbnails.length))].map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-video rounded-[2rem] md:rounded-[2.5rem] border border-dashed border-zinc-800/20 flex items-center justify-center bg-zinc-950/10">
                          <ImageIcon className="text-zinc-800 opacity-10" size={32} />
                        </div>
                      ))}
                    </div>

                    {/* Sticky nav placeholder */}
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-zinc-950/50 rounded-[4rem] border border-zinc-800/30 flex flex-col items-center justify-center text-zinc-600 gap-4">
                    <Compass size={40} className="opacity-20 stroke-1" />
                    <p className="text-[10px] tracking-widest uppercase font-black">No visuals found for this experiment</p>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

        {/* Global Sticky Navigation Controls */}
        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 lg:left-[440px] flex justify-center items-center z-[60] pointer-events-none px-4">
          <div className="flex items-center justify-center gap-3 py-2 bg-[#0D0D0D]/90 rounded-full border border-zinc-800/50 backdrop-blur-3xl px-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] pointer-events-auto ring-1 ring-white/5">
            <button 
              onClick={handlePrev}
              className="p-2 bg-zinc-800/40 hover:bg-[#E86737] text-white rounded-full transition-all active:scale-90 border border-white/5 group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="flex flex-col items-center min-w-[80px]">
              <span className="text-[9px] text-orange-500 font-black tracking-[0.2em] leading-none mb-1.5 uppercase drop-shadow-sm">
                Experiment {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <div className="h-0.5 w-10 bg-zinc-800/50 rounded-full overflow-hidden">
                <motion.div 
                  key={`progress-${currentIndex}`}
                  className="h-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / projects.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <button 
              onClick={handleNext}
              className="p-2 bg-zinc-800/40 hover:bg-[#E86737] text-white rounded-full transition-all active:scale-90 border border-white/5 group"
            >
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
};

const FullscreenViewer = ({ img, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-20"
      onClick={onClose}
    >
      <button 
        className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      <motion.img 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        src={img} 
        alt="Fullscreen Preview" 
        className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

const LiquidBackground = () => null;

const experiences = [
  { year: "2024 - Present", role: "UI/UX Designer & AI Builder", company: "Learning & Building", desc: "Architecting clean UI systems with logic-first AI integrations." },
  { year: "2020 - 2024", role: "Freelance Video Editor", company: "Self-Employed", desc: "Crafting viral content and visual rhythm for high-impact content." }
];

const testimonials = [
  { name: "Rahul Sharma", role: "Content Creator", text: "Viral editing rhythm is perfect. Guddu is elite." },
  { name: "Anjali Gupta", role: "Product Manager", text: "Logic and design combined beautifully. Damn sure stuff!" }
];

const faqs = [
  { q: "Execution ka matlab?", a: "Objective clear hone ke baad hi pixel hilte hain. PRD first approach." },
  { q: "Tech stack?", a: "React/Next.js + Firebase + AI logic." },
  { q: "AI in workflow?", a: "AI is my co-pilot for code and rapid logic prototyping." }
];


const App = () => {
  const [user, setUser] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugLog, setDebugLog] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [projects, setProjects] = useState([]);
  const [profileData, setProfileData] = useState({ imageUrl: "" });
  const [isUpdatingImg, setIsUpdatingImg] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjLink, setNewProjLink] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjOrder, setNewProjOrder] = useState(""); // Custom display order
  const [newProjImg, setNewProjImg] = useState("");
  const [isUploadingProjImg, setIsUploadingProjImg] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newProjType, setNewProjType] = useState("website"); // "website" or "apk"
  const [newProjScreenshots, setNewProjScreenshots] = useState([]); // Array of base64 screenshots
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Custom confirmation state
  const [roastInput, setRoastInput] = useState("");
  const [roastResult, setRoastResult] = useState("");
  const [isRoasting, setIsRoasting] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'bot', text: "Bol bhai! English, Hindi ya Hinglish—jis mein settle hona hai ho ja!" }]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFullScreenImg, setSelectedFullScreenImg] = useState(null);
  const [contactDraftInput, setContactDraftInput] = useState("");
  const [contactDraftResult, setContactDraftResult] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'error' | 'success', message: string }
  const [selectedProject, setSelectedProject] = useState(null);
  const chatEndRef = useRef(null);
  const dotControls = useAnimation();

  const addDebugLog = (msg) => {
    setDebugLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    addDebugLog("Manual Sync Start...");
    try {
      await signInAnonymously(auth);
      addDebugLog("Auth Resynced!");
      // Re-fetch everything
      const profileDoc = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'profile', 'identity'));
      if (profileDoc.exists()) setProfileData(profileDoc.data());
      
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'projects'), orderBy('displayOrder', 'asc'));
      const querySnapshot = await getDocs(q);
      const projs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projs.length > 0 ? projs : []);
      addDebugLog(`Sync Success: ${projs.length} projs`);
      setNotification({ type: 'success', message: "Database Synced!" });
    } catch (err) {
      addDebugLog(`Sync Error: ${err.message}`);
      setNotification({ type: 'error', message: "Sync Failed" });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

    // --- Initial Bouncy Intro Animation ---
  useEffect(() => {
    const startSimpleBounce = async () => {
      await dotControls.start({
        y: 0,
        opacity: 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 12, 
          mass: 1, 
          delay: 0.6 // Integration with cinematic text arrival
        }
      });
    };
    startSimpleBounce();
  }, [dotControls]);

  useEffect(() => {
    // Reset scroll to top on refresh
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const handleDotClick = async () => {
    await dotControls.start({
      x: [0, -100, -220, -350, -450, -350, -220, -100, 0],
      y: [0, -150, -220, -150, 0, -150, -220, -150, 0],
      rotate: [0, -180, -360, -540, -720, -540, -360, -180, 0],
      transition: { duration: 0.36, ease: "easeInOut" }
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth failed", err);
        addDebugLog(`AUTH FAIL: ${err.message}`);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        addDebugLog(`Auth Active: ${u.uid.slice(0,5)}...`);
      } else {
        addDebugLog("Auth Waiting/Null - Re-attempting...");
        signInAnonymously(auth).catch(e => addDebugLog(`Retry Auth Fail: ${e.message}`));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // We don't need 'user' for public reading as per Firestore rules
    const projCol = collection(db, 'artifacts', appId, 'public', 'data', 'projects');
    const unsubProjects = onSnapshot(projCol, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data.sort((a, b) => {
        const orderA = parseInt(a.displayOrder) || 999;
        const orderB = parseInt(b.displayOrder) || 999;
        if (orderA !== orderB) return orderA - orderB;
        return (b.timestamp || 0) - (a.timestamp || 0);
      }));
    });
    const profileDoc = doc(db, 'artifacts', appId, 'public', 'data', 'profile', 'identity');
    const unsubProfile = onSnapshot(profileDoc, (docSnap) => {
      if (docSnap.exists()) setProfileData(docSnap.data());
    });
    return () => {
      unsubProjects();
      unsubProfile();
    };
  }, [db, appId]); // Fetch immediately, don't wait for user auth

  // One-time migration for default projects
  useEffect(() => {
    if (!user || projects.length > 0) return;
    
    const migrateDefaults = async () => {
      const defaults = [
        { title: "JuiceVerse", cat: "Live Demo", link: "https://varunsahu88.github.io/Juiceverse/", desc: "Branding and design exploration.", displayOrder: 1 },
        { title: "Portfort", cat: "Concept", link: "https://varunsahu88.github.io/portfort02/index.html", desc: "A creative portfolio experiment.", displayOrder: 2 },
        { title: "Geneva", cat: "Featured", link: "https://github.com/varunsahu88", desc: "Dashboard UI and AI logic.", displayOrder: 3 }
      ];

      for (const p of defaults) {
        try {
          const projCol = collection(db, 'artifacts', appId, 'public', 'data', 'projects');
          await addDoc(projCol, { ...p, timestamp: Date.now() });
        } catch (e) { console.error("Migration failed", e); }
      }
    };

    // Only migrate if we genuinely have no projects (first load)
    const timeout = setTimeout(() => {
      if (projects.length === 0) migrateDefaults();
    }, 2000); 

    return () => clearTimeout(timeout);
  }, [user, projects.length]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showAdminModal || selectedProject || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showAdminModal, selectedProject, isMenuOpen]);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  
  useEffect(() => {
    if (showAIChat) scrollToBottom();
  }, [chatMessages, isTyping, showAIChat]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const securePass = import.meta.env.VITE_ADMIN_PASSWORD;
    if (adminPass === securePass) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPass("");
      setAdminError("");
    } else {
      setAdminError("Password galat hai!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setNotification({ type: 'success', message: "Logged out!" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !isAdmin || !user) return;
    setIsUpdatingImg(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1000;
        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        try {
          addDebugLog("Uploading Image...");
          const profileDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'profile', 'identity');
          await setDoc(profileDocRef, { imageUrl: compressedBase64 }, { merge: true });
          setProfileData({ imageUrl: compressedBase64 });
          addDebugLog("Upload Success! ✨");
          setNotification({ type: 'success', message: "Profile Pic Updated!" });
        } catch (err) {
          console.error("Firebase update failed", err);
          addDebugLog(`IMG FAIL: ${err.message}`);
          setNotification({ type: 'error', message: `Upload failed: ${err.message}` });
        } finally {
          setIsUpdatingImg(false);
        }
      };
      img.src = String(event.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleProjScreenshotUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !isAdmin || !user) return;
    
    setIsUploadingProjImg(true);
    let processed = 0;
    const newBatch = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1200;
          if (width > height) {
            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
          } else {
            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          newBatch.push(compressedBase64);
          processed++;
          
          if (processed === files.length) {
            // User wants max 4 total (Thumb + Screenshots)
            const maxScreenshots = newProjImg ? 3 : 4;
            setNewProjScreenshots(prev => [...prev, ...newBatch].slice(0, maxScreenshots));
            setIsUploadingProjImg(false);
          }
        };
        img.src = String(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (index) => {
    setNewProjScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleRoast = () => {
    if (!roastInput.trim() || isRoasting) return;
    setIsRoasting(true);
    setTimeout(() => {
      const result = getLocalRoast(roastInput);
      setRoastResult(result);
      setIsRoasting(false);
    }, 800);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjName) { addDebugLog("Add Fail: No Name"); return; }
    if (!newProjLink) { addDebugLog("Add Fail: No Link"); return; }
    if (!isAdmin) { addDebugLog("Add Fail: No Admin Session"); return; }
    if (!user) { addDebugLog("Add Fail: No Firebase User (Wait for login)"); return; }
    
    addDebugLog(`Save Start: ${newProjName}`);
    setIsAdding(true);
    try {
      let finalDesc = newProjDesc;
      if (!finalDesc.trim()) {
        addDebugLog("Desc missing, calling AI...");
        finalDesc = await handleAutoDescribe(newProjName, newProjLink);
        setNewProjDesc(finalDesc);
      }

      const projData = {
        title: String(newProjName),
        link: String(newProjLink),
        desc: String(finalDesc),
        displayOrder: newProjOrder ? parseInt(newProjOrder) : 999,
        imageUrl: newProjImg || "",
        screenshots: newProjScreenshots || [],
        type: newProjType || "website",
        cat: "BUILD",
        timestamp: editingProject ? (editingProject.timestamp || Date.now()) : Date.now()
      };

      if (editingProject) {
        const targetDoc = doc(db, 'artifacts', appId, 'public', 'data', 'projects', editingProject.id);
        await setDoc(targetDoc, projData, { merge: true });
        setNotification({ type: 'success', message: "Project updated successfully!" });
      } else {
        const projCol = collection(db, 'artifacts', appId, 'public', 'data', 'projects');
        await addDoc(projCol, projData);
        setNotification({ type: 'success', message: "Project added successfully!" });
      }
      setNewProjImg("");
      setNewProjScreenshots([]);
      setEditingProject(null);
      setShowProjectModal(false); // Close modal on success
    } catch (err) {
      console.error("FORCE FIX FAIL:", err);
      addDebugLog(`SAVE ERR: ${err.message}`);
      setNotification({ type: 'error', message: `FAIL: ${err.code || 'Error'} - ${err.message}` });
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleEditClick = (p) => {
    setEditingProject(p);
    setNewProjName(p.title);
    setNewProjLink(p.link);
    setNewProjDesc(p.desc || "");
    setNewProjOrder(p.displayOrder === 999 ? "" : String(p.displayOrder || ""));
    setNewProjImg(p.imageUrl || "");
    setNewProjScreenshots(p.screenshots || []);
    setNewProjType(p.type || "website");
  };
  
  const handleCancelEdit = () => {
    setEditingProject(null);
    setNewProjName("");
    setNewProjLink("");
    setNewProjDesc("");
    setNewProjOrder("");
    setNewProjImg("");
    setNewProjScreenshots([]);
    setNewProjType("website");
  };

  const handleDeleteProject = async (id) => {
    if (!isAdmin) {
      setNotification({ type: 'error', message: "Admin access required!" });
      return;
    }
    
    if (!id) {
      addDebugLog("Error: Missing ID for delete");
      return;
    }

    addDebugLog(`Attempting delete: ${id}`);
    setNotification({ type: 'success', message: "Force Deleting... ⚡" });
    
    try {
      // Direct path construction to avoid any reference issues
      const docPath = `artifacts/${appId}/public/data/projects/${id}`;
      addDebugLog(`Path: ${docPath}`);
      const targetDoc = doc(db, 'artifacts', appId, 'public', 'data', 'projects', id);
      
      await deleteDoc(targetDoc);
      
      addDebugLog("Firestore Success");
      setNotification({ type: 'success', message: "Project Pulverized! 💥" });
      setConfirmDeleteId(null);
      if (editingProject?.id === id) handleCancelEdit();
    } catch (err) {
      console.error("Remove failed", err);
      addDebugLog(`Fail: ${err.message}`);
      setNotification({ type: 'error', message: `Delete Failed: ${err.message}` });
    }
  };

  const handleAIChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    setTimeout(() => {
      const response = getLocalAIChat(userMsg, projects);
      setChatMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleDraftContact = (e) => {
    if (e) e.preventDefault();
    if (!contactDraftInput.trim() || isDrafting) return;
    setIsDrafting(true);
    setTimeout(() => {
      setContactDraftResult("Yo! I'm " + (profileData.imageUrl ? "ready" : "Guddu") + ". Check out my experiments! Vibe check passed.");
      setIsDrafting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-orange-500 selection:text-white scroll-smooth overflow-x-hidden">
      <LiquidBackground />

      {/* Admin Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 font-black uppercase">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="text-orange-500 font-black uppercase text-[10px] tracking-widest"><Lock size={16} className="inline mr-2" /> Admin Access</div>
                <button onClick={() => setShowAdminModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="••••••••" className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-white focus:border-orange-500 outline-none font-black uppercase text-xs" autoFocus />
                {adminError && <p className="text-red-500 text-[10px] font-bold text-center font-black uppercase">{adminError}</p>}
                <button type="submit" className="w-full bg-orange-500 py-3 rounded-xl uppercase font-black text-xs text-white">Unlock</button>
              </form>

              {isAdmin && (
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Manage Projects</h5>
                    <span className="text-[8px] bg-zinc-800 px-2 py-0.5 rounded text-orange-500">{projects.length} Total</span>
                  </div>
                  <div className="max-h-[250px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                    {projects.length === 0 && <p className="text-[9px] text-zinc-700 italic text-center py-4">No projects found.</p>}
                    {projects.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-zinc-800 group hover:border-orange-500/30 transition-all">
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className="text-[10px] font-black text-white truncate uppercase">{p.title || "Untitled"}</span>
                          <span className="text-[8px] text-zinc-600 truncate">{p.id}</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleEditClick(p)} className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all"><Pencil size={14} /></button>
                          {confirmDeleteId === p.id ? (
                            <button onClick={() => handleDeleteProject(p.id)} className="px-3 py-1 bg-red-500 text-white rounded-lg text-[8px] font-black animate-pulse">CONFIRM?</button>
                          ) : (
                            <button onClick={() => setConfirmDeleteId(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {debugLog.length > 0 && (
                    <div className="mt-4 p-3 bg-black rounded-xl border border-zinc-800 font-mono text-[7px] text-zinc-500 space-y-1 relative">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-1 mb-1">
                        <p className="text-orange-500 uppercase font-bold">Debug Console</p>
                        <button onClick={() => setDebugLog([])} className="text-[6px] text-zinc-700 hover:text-white uppercase transition-colors">Clear</button>
                      </div>
                      {debugLog.map((log, i) => <div key={i} className="truncate">{log}</div>)}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            variants={menuContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[80px] flex flex-col items-center justify-center font-black border-l border-white/10 shadow-[inset_0_0_150px_rgba(255,255,255,0.05)]"
          >
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 text-white bg-zinc-900 rounded-full border border-zinc-800 transition-transform active:scale-90"><X size={24} /></button>
            <motion.div className="flex flex-col gap-10 items-center text-center w-full">
              {navLinks.map((link) => (
                <motion.a 
                  key={link.name} 
                  variants={menuItemVariants}
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-3xl text-white hover:text-orange-500 transition-all tracking-widest uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] hover:scale-110"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div variants={menuItemVariants} className="flex gap-6 mt-6">
                <a href="https://github.com/varunsahu88" target="_blank" rel="noopener noreferrer" className="p-4 bg-zinc-900 rounded-2xl hover:text-orange-500 transition-all border border-zinc-800/50"><Github size={28} /></a>
                <button onClick={() => { setShowAdminModal(true); setIsMenuOpen(false); }} className="p-4 bg-zinc-900 rounded-2xl hover:text-orange-500 transition-all border border-zinc-800/50"><Lock size={28} /></button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl py-3 border-b border-zinc-800' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-8 md:px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="text-2xl font-black tracking-tighter text-white group cursor-default"
          >
            GS<span className="text-orange-500 group-hover:animate-pulse transition-all">.</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
            {navLinks.map(l => <a key={l.name} href={l.href} className="text-zinc-400 hover:text-white transition-colors">{l.name}</a>)}
            <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)}>{isAdmin ? <Unlock size={16} className="text-orange-500" /> : <Lock size={16} />}</button>
            <a href="#contact" className="bg-zinc-100 text-black px-6 py-2 rounded-full uppercase font-black text-[9px] hover:bg-orange-500 hover:text-white transition-all">Hire Me</a>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu size={24} /></button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[70vh] md:min-h-screen flex flex-col items-center justify-start md:justify-center pt-32 pb-12 md:pt-0 md:pb-0 px-6 text-center overflow-hidden z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-zinc-800 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-xs font-black text-orange-500 uppercase mb-3 tracking-[0.3em] shadow-xl">
            <Sparkles size={8} className="inline mr-2 md:mr-2" /> <span className="text-orange-500 font-black">Damn Sure</span> Execution
          </motion.div>
          
          <motion.h1 
            variants={titleContainer} 
            initial="initial" 
            animate="animate" 
            className="text-[6.1rem] sm:text-[7.8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] 2xl:text-[16.25rem] font-black tracking-tighter leading-[0.85] uppercase select-none mb-2 flex flex-col items-center transform-gpu will-change-transform"
            style={{ backfaceVisibility: 'hidden', perspective: 1000 }}
          >
            <div className="overflow-hidden"><motion.span variants={titleLine} className="bg-gradient-to-b from-white via-zinc-400 to-zinc-800 bg-clip-text text-transparent block transform-gpu">GUDDU</motion.span></div>
            <div className="flex items-baseline justify-center relative transform-gpu">
              <motion.span variants={titleLine} className="bg-gradient-to-r from-orange-400 via-orange-600 to-red-600 bg-clip-text text-transparent block transform-gpu">SAHU</motion.span>
              <motion.div 
                animate={dotControls} 
                initial={{ y: -200, opacity: 0 }}
                onClick={handleDotClick} 
                className="absolute left-[calc(100%+0.1em)] sm:left-[calc(100%+0.15em)] bottom-[0.1em] w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 bg-orange-500 rounded-full cursor-pointer shadow-[0_0_30px_rgba(249,115,22,0.6)] border-2 border-white/20 z-20 transform-gpu will-change-transform" 
                style={{ backfaceVisibility: 'hidden' }}
              />
            </div>
          </motion.h1>
          
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="text-base sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-400 uppercase mt-4">
            Designer <span className="text-orange-500 italic">by Heart.</span> <span className="mx-2 text-zinc-800 font-thin opacity-20">|</span> <span className="text-orange-500 italic">Vibe Coder</span> by Choice.
          </motion.div>
          
          <motion.p {...fadeInUp} transition={{ delay: 0.5 }} className="max-w-xl text-xs md:text-lg text-zinc-500 font-light mt-4 px-4 leading-relaxed opacity-80 italic">
            I can design <span className="text-orange-500 font-black">Any UI/UX</span> you can dream of. Architecting clean systems with <span className="text-orange-500 font-black">Figma & Antigravity</span> for 100% certainty.
          </motion.p>
          
          <motion.div {...fadeInUp} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10 md:mt-12 font-black uppercase">
            <a href="#projects" className="group bg-white text-black px-8 md:px-12 py-3 md:py-4 rounded-[1rem] font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all shadow-2xl flex items-center gap-3">Work <ChevronRight size={16} /></a>
            <a href="https://github.com/varunsahu88" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 text-white px-8 md:px-12 py-3 md:py-4 rounded-[1rem] font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] hover:border-orange-500/50 transition-all flex items-center gap-3 shadow-xl"><Github size={16} className="text-orange-500" /> GitHub</a>
          </motion.div>
        </div>
      </section>

      {/* Tech Scroll */}
      <section className="py-6 md:py-10 border-y border-zinc-900 bg-zinc-900/5 relative overflow-hidden font-black uppercase">
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-20 whitespace-nowrap px-10">
          {[...skills, ...skills, ...skills].map((s, i) => (
            <span key={i} className="text-xs md:text-[12px] font-black uppercase text-zinc-600 tracking-[0.5em] hover:text-orange-500 transition-all cursor-default">
              {s === "Gemini AI" || s === "Vibe Coder" ? <span className="text-orange-500">{s}</span> : s}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Identity Section */}
      <section id="about" className="py-8 md:py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24 items-center font-black uppercase">
          <motion.div {...fadeInUp} className="relative">
            <div className="aspect-square bg-zinc-900 rounded-[3rem] border border-zinc-800 flex items-center justify-center overflow-hidden relative group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {profileData.imageUrl ? (
                <img 
                  src={profileData.imageUrl} 
                  alt="Guddu Sahu" 
                  fetchpriority="high"
                  decoding="async"
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={100} className="text-zinc-800 group-hover:text-orange-500 transition-colors" />
              )}
              <div className="absolute bottom-8 left-8 text-left z-10">
                <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Identity</p>
                <h4 className="text-2xl font-black text-white uppercase tracking-tight">Guddu Sahu</h4>
              </div>
            </div>
            {isAdmin && (
              <div className="mt-8 p-6 bg-zinc-900/80 border border-orange-500/30 rounded-3xl backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase text-orange-500"><Upload size={14} /> Update Identity Photo</div>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer bg-black/40 hover:border-orange-500/50 transition-all group">
                  <div className="flex flex-col items-center">
                    {isUpdatingImg ? <Loader2 className="animate-spin text-orange-500" /> : <ImageIcon className="text-zinc-600 mb-2 group-hover:text-orange-500" size={24} />}
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{isUpdatingImg ? "Resizing..." : "Gallery Upload"}</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            )}
          </motion.div>
          <motion.div {...fadeInUp} className="text-left space-y-4">
            <span className="text-orange-500 font-black text-[10px] uppercase block tracking-[0.4em]">My Story</span>
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase text-white leading-[0.9]">Driven by <br /> <span className="text-orange-500 italic">curiosity.</span></h2>
            <p className="text-zinc-400 text-sm md:text-lg leading-relaxed opacity-70 font-medium">
              Based in Delhi, I’m a <span className="text-orange-500 font-black">Vibe Coder</span> who can design any UI/UX you throw at me. 
              I’ve built <span className="text-orange-500 font-black">2 Successful Apps</span> and high-performance <span className="text-orange-500 font-black">Frontend Websites</span>. 
              I architect Clean UI/UX systems by combining raw instinct with <span className="text-orange-500 font-black uppercase">100% certainty</span>.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["Vibe Coder", "UI/UX Design", "AI Builder", "Video Mastery"].map((t) => (
                <span 
                  key={t}
                  className={`px-4 py-2 bg-zinc-900 border ${t === 'Vibe Coder' ? 'border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.05)]' : 'border-zinc-800 text-zinc-500'} rounded-xl text-xs uppercase font-black tracking-widest hover:text-orange-500 hover:border-orange-500/50 transition-all cursor-default whitespace-nowrap`}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-12 md:py-32 px-6 max-w-7xl mx-auto relative z-10 font-black uppercase min-h-[600px]">
        <motion.h2 {...fadeInUp} className="text-5xl md:text-[8.9rem] font-black tracking-tighter uppercase mb-12 text-white leading-none text-center">
          <span className="animate-gradient-text">Experiments</span><span className="text-orange-500">.</span>
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          {projects.map((p, index) => (
            <ProjectCard 
              key={p.id} 
              p={p} 
              index={index}
              isFeatured={index === 0}
              isAdmin={isAdmin}
              editingProject={editingProject}
              handleCancelEdit={handleCancelEdit}
              newProjName={newProjName}
              setNewProjName={setNewProjName}
              newProjLink={newProjLink}
              setNewProjLink={setNewProjLink}
              newProjDesc={newProjDesc}
              setNewProjDesc={setNewProjDesc}
              handleAutoDescribe={handleAutoDescribe}
              newProjScreenshots={newProjScreenshots}
              removeScreenshot={removeScreenshot}
              newProjImg={newProjImg}
              setNewProjImg={setNewProjImg}
              setNewProjScreenshots={setNewProjScreenshots}
              handleProjScreenshotUpload={handleProjScreenshotUpload}
              handleAddProject={handleAddProject}
              isAdding={isAdding}
              setSelectedProject={setSelectedProject}
              confirmDeleteId={confirmDeleteId}
              handleDeleteProject={handleDeleteProject}
              setConfirmDeleteId={setConfirmDeleteId}
              handleEditClick={handleEditClick}
              db={db}
              appId={appId}
              newProjType={newProjType}
              setNewProjType={setNewProjType}
              setShowProjectModal={setShowProjectModal}
            />
          ))}
          {isAdmin && (
            <motion.div 
              whileHover={{ scale: 1.2, zIndex: 150, transition: { duration: 0.1, ease: "linear" } }}
              onClick={() => { handleCancelEdit(); setShowProjectModal(true); }}
              className="relative bg-zinc-900 border-2 border-dashed border-orange-500/30 p-4 md:p-6 rounded-[1.2rem] md:rounded-[2rem] flex flex-col items-center justify-center h-[144px] md:h-[288px] w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1.2rem)] shadow-2xl overflow-hidden group cursor-pointer hover:border-orange-500 transition-all"
            >
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-800 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <Plus size={32} />
                </div>
                <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-orange-500 transition-colors">Add Project</span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 md:py-24 lg:py-32 2xl:py-40 px-6 relative z-10 bg-zinc-900/10 font-black uppercase">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <span className="text-orange-500 font-black text-[10px] uppercase block tracking-[0.4em] mb-4">The Philosophy</span>
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase text-white leading-tight">Architecture of <span className="text-orange-500 italic">Certainty.</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div {...fadeInUp} className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] group hover:border-orange-500/30 transition-all shadow-2xl">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors"><Layers className="text-orange-500 group-hover:text-white" /></div>
              <h4 className="text-xl font-black text-white uppercase mb-4 tracking-tight">Structured <span className="text-orange-500">Chaos</span></h4>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">Design systems built on logic. Har pixel ke peeche ek reason hai.</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] group hover:border-orange-500/30 transition-all shadow-2xl">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors"><Cpu className="text-orange-500 group-hover:text-white" /></div>
              <h4 className="text-xl font-black text-white uppercase mb-4 tracking-tight">AI <span className="text-orange-500">Partnership</span></h4>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">AI detects languages and settle instantly. Efficient building logic.</p>
            </motion.div>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] group hover:border-orange-500/30 transition-all shadow-2xl">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors"><Trophy className="text-orange-500 group-hover:text-white" /></div>
              <h4 className="text-xl font-black text-white uppercase mb-4 tracking-tight">Damn <span className="text-orange-500">Sure</span> Finish</h4>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">Jab tak result solid na ho, build khatam nahi hota. Certainty is priority.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roast Section */}
      <section className="py-12 md:py-40 px-6 relative z-10 bg-black/20 border-y border-zinc-900 text-center font-black uppercase">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="inline-flex items-center gap-2 bg-zinc-900 border border-orange-500/30 px-6 py-2 rounded-full text-[10px] font-black text-orange-500 uppercase mb-8 shadow-lg"><Flame size={16} /> Reality Check ✨</motion.div>
          <motion.h2 {...fadeInUp} className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-10 leading-tight">Roast Your Ambition.</motion.h2>
          <div className="flex flex-col gap-6 items-center">
            <input value={roastInput} onChange={e => setRoastInput(e.target.value)} placeholder="Goal likho..." className="w-full max-w-lg bg-black border border-zinc-800 rounded-2xl py-5 px-8 text-lg text-white focus:border-orange-500 outline-none transition-all shadow-inner text-center" />
            <button onClick={handleRoast} disabled={isRoasting} className="bg-orange-500 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-[0_20px_40px_rgba(249,115,22,0.2)] active:scale-95">
              {isRoasting ? <Loader2 className="animate-spin" /> : "Get Roasted ✨"}
            </button>
            {roastResult && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-black/40 rounded-2xl border border-orange-500/20 max-w-lg w-full font-black text-orange-500 text-lg uppercase">"{String(roastResult)}"</motion.div>}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-12 md:py-40 px-6 relative z-10 border-t border-zinc-900 bg-zinc-900/10 font-black uppercase">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16">
            <span className="text-orange-500 font-black text-[10px] uppercase block tracking-widest">Real Journey</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Work <br className="hidden md:block" /><span className="text-orange-500">Timeline</span><span className="text-zinc-800">.</span></h2>
          </motion.div>
          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className="grid md:grid-cols-4 gap-4 p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] hover:border-orange-500/20 transition-all group shadow-xl">
                <div className="text-orange-500 font-black text-xs uppercase tracking-widest">{exp.year}</div>
                <div className="md:col-span-2">
                  <h4 className="text-xl font-black text-white group-hover:text-orange-500 transition-colors">{exp.role}</h4>
                  <p className="text-sm text-zinc-600 font-bold uppercase mt-1 tracking-widest">{exp.company}</p>
                </div>
                <div className="text-xs text-zinc-500 leading-relaxed font-medium group-hover:text-zinc-300 transition-colors">{exp.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-40 px-6 relative z-10 bg-zinc-900/10 border-y border-zinc-900 font-black uppercase">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <Quote className="text-orange-500 mx-auto mb-6" size={40} />
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Honest <span className="text-orange-500">Feedback</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeInUp} className="p-12 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] relative shadow-2xl group hover:border-orange-500/30 transition-all">
                <p className="text-lg md:text-xl text-zinc-300 italic mb-8">"{t.text}"</p>
                <div className="flex items-center gap-4 border-t border-zinc-800 pt-8">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-orange-500 font-black group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-lg">{t.name[0]}</div>
                  <div>
                    <h5 className="text-white font-black uppercase text-sm tracking-widest">{t.name}</h5>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-40 px-6 relative z-10 bg-black/20 border-t border-zinc-900 font-black uppercase">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <MessageSquare className="text-orange-500 mx-auto mb-6" size={40} />
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Curiosity <span className="text-orange-500">Unlocked</span></h2>
          </motion.div>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <motion.div key={i} {...fadeInUp} className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] overflow-hidden group hover:border-orange-500/20 transition-all shadow-xl">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-8 text-left flex justify-between items-center transition-colors">
                  <span className="font-black uppercase tracking-[0.2em] text-xs md:text-sm text-zinc-300 group-hover:text-orange-500">{f.q}</span>
                  <ChevronDown className={`text-zinc-600 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-orange-500' : ''}`} size={20} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-8 pb-8 text-zinc-500 text-sm leading-relaxed border-t border-zinc-800/50 pt-6 font-medium">
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-8 md:py-32 px-6 border-t border-zinc-900 bg-[#0c0c0c] relative z-10 text-center font-black uppercase">
        <motion.h2 {...fadeInUp} className="text-4xl md:text-[8.5rem] font-black tracking-tighter mb-16 uppercase text-white leading-none">Talk to <span className="text-orange-500 underline decoration-4 underline-offset-8">Me.</span></motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-20 text-left max-w-6xl mx-auto items-start">
          <motion.div {...fadeInUp} className="space-y-6 flex flex-col">
            <div className="flex flex-col gap-4">
              <a href="mailto:Varunsahu01p@gmail.com" className="flex items-center gap-4 text-sm md:text-xl font-bold hover:text-orange-500 transition-all group">
                <div className="p-4 bg-zinc-900 rounded-[1.2rem] border border-zinc-800 group-hover:border-orange-500/50 shadow-xl transition-all"><Mail size={22} className="text-orange-500" /></div>
                <span className="tracking-tight text-white/80">Varunsahu01p@gmail.com</span>
              </a>
            </div>
            <div className="flex gap-4 pt-6 justify-start">
              <a href="https://github.com/varunsahu88" target="_blank" rel="noopener noreferrer" className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 hover:bg-white hover:text-black transition-all shadow-xl"><Github size={26} className="text-white" /></a>
              <button onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminModal(true)} className={`p-5 bg-zinc-900 rounded-2xl border border-zinc-800 transition-all shadow-xl ${isAdmin ? 'text-orange-500 border-orange-500 animate-pulse' : 'text-zinc-600'}`}>
                {isAdmin ? <Unlock size={26} /> : <Lock size={26} />}
              </button>
            </div>
          </motion.div>
          <motion.div {...fadeInUp} className="bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800 p-8 md:p-12 rounded-[3rem] space-y-6 shadow-2xl relative overflow-hidden text-left">
            <div className="text-orange-500 font-black uppercase text-[11px] flex items-center gap-2 tracking-[0.3em]"><Sparkles size={16} /> AI Assistant <span className="text-[8px] opacity-40">(Gemini Powered)</span></div>
            <textarea value={contactDraftInput} onChange={e => setContactDraftInput(e.target.value)} placeholder="Idea likho..." className="w-full bg-black border border-zinc-800 rounded-2xl p-5 text-sm h-32 text-white outline-none focus:border-orange-500 transition-all shadow-inner font-medium" />
            <button onClick={handleDraftContact} className="w-full bg-orange-500 text-white py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">Generate Draft</button>
            {contactDraftResult && <div className="mt-4 p-4 bg-black/40 rounded-xl border border-zinc-800 text-[10px] text-zinc-300 leading-relaxed font-medium uppercase">{String(contactDraftResult)}</div>}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showProjectModal && (
          <ProjectModal 
            isOpen={showProjectModal}
            onClose={() => { setShowProjectModal(false); handleCancelEdit(); }}
            editingProject={editingProject}
            newProjName={newProjName}
            setNewProjName={setNewProjName}
            newProjLink={newProjLink}
            setNewProjLink={setNewProjLink}
            newProjDesc={newProjDesc}
            setNewProjDesc={setNewProjDesc}
            newProjOrder={newProjOrder}
            setNewProjOrder={setNewProjOrder}
            newProjImg={newProjImg}
            setNewProjImg={setNewProjImg}
            newProjScreenshots={newProjScreenshots}
            setNewProjScreenshots={setNewProjScreenshots}
            newProjType={newProjType}
            setNewProjType={setNewProjType}
            isAdding={isAdding}
            handleAddProject={handleAddProject}
            handleAutoDescribe={handleAutoDescribe}
            handleProjScreenshotUpload={handleProjScreenshotUpload}
            removeScreenshot={removeScreenshot}
          />
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 z-[300] px-6 py-3 rounded-2xl border font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
              notification.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-green-500/20 border-green-500/50 text-green-500'
            }`}
          >
            {notification.type === 'error' ? <X size={14} /> : <Check size={14} />}
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100"><X size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal 
            p={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            setSelectedFullScreenImg={setSelectedFullScreenImg}
            projects={projects}
            setSelectedProject={setSelectedProject}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFullScreenImg && (
          <FullscreenViewer 
            img={selectedFullScreenImg} 
            onClose={() => setSelectedFullScreenImg(null)} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-10 md:py-20 px-6 border-t border-zinc-900 text-center opacity-30 relative z-10 font-black uppercase tracking-[0.8em] text-[10px] md:text-[14px] text-zinc-500">
        GUDDU SAHU • <span className="text-orange-500">PIXEL CERTAINTY</span> • 2026
      </footer>

    </div>
  );
};

export default App;
