import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  Copy, 
  Share2, 
  Volume2, 
  History, 
  X, 
  Play, 
  Pause,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";
import "./App.css";

import animalImg from "./assets/animal.png";
import careerImg from "./assets/career.png";
import celImg from "./assets/celebrity.png";
import devImg from "./assets/dev.jpg";
import expImg from "./assets/explicit.jpg";
import fasImg from "./assets/fashion.jpg";
import foodImg from "./assets/food.jpg";
import histImg from "./assets/history.jpg";
import moneyImg from "./assets/money.jpg";
import movImg from "./assets/movie.jpg";
import musicImg from "./assets/music.png";
import plotiImg from "./assets/political.png";
import relImg from "./assets/religion.jpg";
import sciImg from "./assets/science.jpg";
import sportImg from "./assets/sport.jpg";
import travelImg from "./assets/travel.jpg";

function App() {
  const [joke, setJoke] = useState("");
  const [category, setCategory] = useState("dev");
  const [click, setClick] = useState(0);
  const [automode, setAutoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentJoke, setCurrentJoke] = useState("");
  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const backgrounds = {
    dev: devImg,
    food: foodImg,
    animal: animalImg,
    music: musicImg,
    career: careerImg,
    money: moneyImg,
    political: plotiImg,
    religion: relImg,
    science: sciImg,
    sport: sportImg,
    travel: travelImg,
    celebrity: celImg,
    fashion: fasImg,
    explicit: expImg,
    movie: movImg,
    history: histImg,
  };

  const handleMouseMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#a855f7", "#f43f5e"],
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joke);
  };

  const shareJoke = () => {
    const text = encodeURIComponent(`"${joke}" - via Random Joke Generator`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const speakJoke = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(joke);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("https://api.chucknorris.io/jokes/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setCurrentJoke("");
      const response = await fetch(
        `https://api.chucknorris.io/jokes/random?category=${category}`
      );
      const data = await response.json();
      
      setJoke(data.value);
      setHistory((prev) => [data.value, ...prev].slice(0, 20));
      
      if (click > 0) triggerConfetti();
    } catch (error) {
      console.error("Error loading the API: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [category, click]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (automode) {
      const interval = setInterval(fetchData, 6000);
      return () => clearInterval(interval);
    }
  }, [automode, fetchData]);

  useEffect(() => {
    if (isLoading || !joke) {
      setCurrentJoke("");
      return;
    }

    let index = 0;
    let timeoutId;
    setCurrentJoke("");

    const type = () => {
      if (index < joke.length) {
        const char = joke[index];
        setCurrentJoke((prev) => prev + char);
        index++;
        timeoutId = setTimeout(type, 30);
      }
    };

    type();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [joke, isLoading]);

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgrounds[category]})` }}
    >
      <motion.button
        className="icon-btn history-toggle"
        style={{ position: "fixed", top: "2rem", right: "2rem", zIndex: 110 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
      >
        {isHistoryOpen ? <X /> : <History />}
      </motion.button>

      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="history-panel"
          >
            <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <History size={20} /> History
            </h3>
            <div style={{ overflowY: "auto", flexGrow: 1 }}>
              {history.map((h, i) => (
                <div 
                  key={i} 
                  className="history-item"
                  onClick={() => {
                    setJoke(h);
                    setIsHistoryOpen(false);
                  }}
                >
                  {h.length > 60 ? h.substring(0, 60) + "..." : h}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          "--position-x": `${position.x}px`,
          "--position-y": `${position.y}px`,
        }}
        onMouseMove={handleMouseMove}
      >
        <div className="joke-content">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="spinner"></div>
                <p>Fetching humor...</p>
              </motion.div>
            ) : (
              <motion.h2
                key="joke"
                className="header"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.4 }}
              >
                {currentJoke}
                {currentJoke.length < joke.length && <span className="cursor"></span>}
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        <div className="controls">
          <div className="select-wrapper">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            className="primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setClick(click + 1)}
          >
            <RefreshCw size={18} /> Next Joke
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAutoMode(!automode)}
            style={{ 
              background: automode ? "rgba(244, 63, 94, 0.2)" : "rgba(255, 255, 255, 0.05)",
              borderColor: automode ? "var(--accent)" : "var(--border-glass)"
            }}
          >
            {automode ? <Pause size={18} /> : <Play size={18} />}
            {automode ? "Stop Auto" : "Auto Mode"}
          </motion.button>
        </div>

        <div className="action-buttons">
          <motion.button
            className="icon-btn"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            <Copy size={18} />
          </motion.button>
          
          <motion.button
            className="icon-btn"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={shareJoke}
            title="Share on Twitter"
          >
            <Share2 size={18} />
          </motion.button>

          <motion.button
            className="icon-btn"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={speakJoke}
            title="Read aloud"
            style={{ color: isSpeaking ? "var(--primary)" : "white" }}
          >
            <Volume2 size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default App;

