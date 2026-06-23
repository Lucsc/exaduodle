import { useEffect, useState } from "react";
import { ENTITIES, ATTRIBUTES, compareAttribute, getDailyEntity } from "../data/entities";
import {
  createRandomZoomChallenge,
  isZoomChallengeValid,
} from "../data/zoom";
import {
  createRandomEmojiChallenge,
  isEmojiChallengeValid,
} from "../data/emojiChallenge";

const STORAGE_KEY = "exaduodle_game_state_v1";


function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function useGame() {
  const todayKey = getTodayKey();
  const target = getDailyEntity();

  const createInitialState = (savedState) => {
    const hasValidSavedZoomChallenge = isZoomChallengeValid(
      savedState?.zoomChallenge,
      ENTITIES
    );
    const zoomChallenge = hasValidSavedZoomChallenge
      ? savedState.zoomChallenge
      : createRandomZoomChallenge(ENTITIES, [target.id]);

    const hasValidSavedEmojiChallenge = isEmojiChallengeValid(
      savedState?.emojiChallenge,
      ENTITIES
    );
    const emojiChallenge = hasValidSavedEmojiChallenge
      ? savedState.emojiChallenge
      : createRandomEmojiChallenge(ENTITIES, [target.id]);

    return {
      guesses: savedState?.guesses || [],
      gameStatus: savedState?.gameStatus || "playing",
      zoomGuesses: hasValidSavedZoomChallenge ? savedState?.zoomGuesses || [] : [],
      zoomStatus: hasValidSavedZoomChallenge
        ? savedState?.zoomStatus || "playing"
        : zoomChallenge
          ? "playing"
          : "unavailable",
      zoomChallenge,
      emojiGuesses: hasValidSavedEmojiChallenge ? savedState?.emojiGuesses || [] : [],
      emojiStatus: hasValidSavedEmojiChallenge
        ? savedState?.emojiStatus || "playing"
        : emojiChallenge
          ? "playing"
          : "unavailable",
      emojiChallenge,
    };
  };

  const loadState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.date === todayKey) return createInitialState(saved);
    } catch {
      return createInitialState(null);
    }

    return createInitialState(null);
  };

  const saved = loadState();

  const [guesses, setGuesses] = useState(saved?.guesses || []);
  const [gameStatus, setGameStatus] = useState(saved?.gameStatus || "playing"); // playing | won | lost
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [zoomGuesses, setZoomGuesses] = useState(saved?.zoomGuesses || []);
  const [zoomStatus, setZoomStatus] = useState(saved?.zoomStatus || "unavailable");
  const [zoomChallenge] = useState(saved?.zoomChallenge || null);
  const [zoomInput, setZoomInput] = useState("");
  const [zoomError, setZoomError] = useState("");
  const [emojiGuesses, setEmojiGuesses] = useState(saved?.emojiGuesses || []);
  const [emojiStatus, setEmojiStatus] = useState(saved?.emojiStatus || "unavailable");
  const [emojiChallenge] = useState(saved?.emojiChallenge || null);
  const [emojiInput, setEmojiInput] = useState("");
  const [emojiError, setEmojiError] = useState("");
  const zoomTarget = ENTITIES.find((entity) => entity.id === zoomChallenge?.entityId) || null;
  const emojiTarget = ENTITIES.find((entity) => entity.id === emojiChallenge?.entityId) || null;

  const buildSuggestions = (query, existingGuesses) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    const alreadyGuessed = existingGuesses.map((guess) => guess.entity.name);

    return ENTITIES.filter(
      (entity) =>
        entity.name.toLowerCase().includes(normalizedQuery) &&
        !alreadyGuessed.includes(entity.name)
    ).slice(0, 5);
  };

  // Persist state
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        date: todayKey,
        guesses,
        gameStatus,
        zoomGuesses,
        zoomStatus,
        zoomChallenge,
        emojiGuesses,
        emojiStatus,
        emojiChallenge,
      })
    );
  }, [guesses, gameStatus, todayKey, zoomGuesses, zoomStatus, zoomChallenge, emojiGuesses, emojiStatus, emojiChallenge]);

  const suggestions = buildSuggestions(input, guesses);
  const zoomSuggestions = buildSuggestions(zoomInput, zoomGuesses);
  const emojiSuggestions = buildSuggestions(emojiInput, emojiGuesses);

  const submitGuess = (entity) => {
    if (gameStatus !== "playing") return;
    setError("");
    setInput("");

    const result = ATTRIBUTES.map(({ key }) => ({
      key,
      guessVal: entity[key],
      targetVal: target[key],
      ...compareAttribute(key, entity[key], target[key]),
    }));

    const newGuess = { entity, result };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    if (entity.id === target.id) {
      setGameStatus("won");
    }
  };

  const handleInputChange = (val) => {
    setInput(val);
    setError("");
  };

  const handleZoomInputChange = (val) => {
    setZoomInput(val);
    setZoomError("");
  };

  const handleSubmit = () => {
    const q = input.trim().toLowerCase();
    if (!q) return;
    const match = ENTITIES.find((e) => e.name.toLowerCase() === q);
    if (!match) {
      setError("Collègue non trouvé. Sélectionne une suggestion.");
      return;
    }
    if (guesses.find((g) => g.entity.id === match.id)) {
      setError("Déjà deviné !");
      return;
    }
    submitGuess(match);
  };

  const submitZoomGuess = (entity) => {
    if (gameStatus === "playing" || zoomStatus !== "playing" || !zoomTarget) {
      return;
    }

    setZoomError("");
    setZoomInput("");

    const newGuesses = [...zoomGuesses, { entity }];
    setZoomGuesses(newGuesses);

    if (entity.id === zoomTarget.id) {
      setZoomStatus("won");
      return;
    }

  };

  const handleZoomSubmit = () => {
    const q = zoomInput.trim().toLowerCase();
    if (!q || zoomStatus !== "playing") return;

    const match = ENTITIES.find((entity) => entity.name.toLowerCase() === q);

    if (!match) {
      setZoomError("Collègue non trouvé. Sélectionne une suggestion.");
      return;
    }

    if (zoomGuesses.find((guess) => guess.entity.id === match.id)) {
      setZoomError("Déjà deviné !");
      return;
    }

    submitZoomGuess(match);
  };

  const handleEmojiInputChange = (val) => {
    setEmojiInput(val);
    setEmojiError("");
  };

  const submitEmojiGuess = (entity) => {
    if (gameStatus === "playing" || emojiStatus !== "playing" || !emojiTarget) {
      return;
    }

    setEmojiError("");
    setEmojiInput("");

    const newGuesses = [...emojiGuesses, { entity }];
    setEmojiGuesses(newGuesses);

    if (entity.id === emojiTarget.id) {
      setEmojiStatus("won");
      return;
    }

    if (newGuesses.length >= 6) {
      setEmojiStatus("lost");
    }
  };

  const handleEmojiSubmit = () => {
    const q = emojiInput.trim().toLowerCase();
    if (!q || emojiStatus !== "playing") return;

    const match = ENTITIES.find((entity) => entity.name.toLowerCase() === q);

    if (!match) {
      setEmojiError("Collègue non trouvé. Sélectionne une suggestion.");
      return;
    }

    if (emojiGuesses.find((guess) => guess.entity.id === match.id)) {
      setEmojiError("Déjà deviné !");
      return;
    }

    submitEmojiGuess(match);
  };
  return {
    target,
    guesses,
    gameStatus,
    input,
    suggestions,
    error,
    handleInputChange,
    handleSubmit,
    submitGuess,
    zoomTarget,
    zoomGuesses,
    zoomStatus,
    zoomChallenge,
    zoomInput,
    zoomSuggestions,
    zoomError,
    handleZoomInputChange,
    handleZoomSubmit,
    submitZoomGuess,
    emojiTarget,
    emojiGuesses,
    emojiStatus,
    emojiChallenge,
    emojiInput,
    emojiSuggestions,
    emojiError,
    handleEmojiInputChange,
    handleEmojiSubmit,
    submitEmojiGuess,
  };
}
