import { useEffect, useState } from "react";
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
  const [joke, setJoke] = useState("Loading...");
  const [category, setCategory] = useState("dev");
  const [click, setClick] = useState(0);
  const [automode, setAutoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentJoke, setCurrentJoke] = useState("");
  const [categories, setCategories] = useState([]);

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

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setPosition({ x: mouseX, y: mouseY });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.chucknorris.io/jokes/categories",
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isLoading || !joke) return;
    let index = 0;
    setCurrentJoke("");

    const typewriterId = setInterval(() => {
      if (index < joke.length) {
        const nextChar = joke[index];

        setCurrentJoke((prev) => prev + nextChar);

        index++;
      } else {
        clearInterval(typewriterId);
      }
    }, 50);

    return () => clearInterval(typewriterId);
  }, [joke, isLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setJoke("");
        const response = await fetch(
          `https://api.chucknorris.io/jokes/random?category=${category}`,
        );

        const data = await response.json();
        setJoke(data.value);
      } catch (error) {
        console.error("Error loading the API: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    let Intervalid;

    if (automode) {
      Intervalid = setInterval(() => {
        fetchData();
      }, 5000);
    }

    fetchData();

    return () => {
      if (Intervalid) {
        clearInterval(Intervalid);
      }
    };
  }, [category, click, automode]);

  return (
    <>
      <div
        className="app-container"
        style={{ backgroundImage: `url(${backgrounds[category]})` }}
      >
        <div
          className="card"
          style={{
            "--position-x": `${position.x}px`,
            "--position-y": `${position.y}px`,
          }}
          onMouseMove={handleMouseMove}
        >
          <h2 className={isLoading ? "loader" : "header"}>
            {isLoading ? "" : "Joke of the day: "}

            {!isLoading && (
              <>
                {currentJoke}
                <span
                  className={currentJoke.length < joke.length ? "cursor" : ""}
                ></span>
              </>
            )}
          </h2>

          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
            }}
            id="selection"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setClick(click + 1);
            }}
          >
            Next Joke
          </button>

          <button
            onClick={() => {
              setAutoMode(!automode);
            }}
          >
            Turn {automode ? "Off" : "On"} Automode
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
