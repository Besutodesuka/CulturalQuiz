import React, { useEffect, useState } from 'react';
import introGif from '/FallingStar.gif';
import newBackground from '/StaticStar.jpg';
import { useNavigate } from 'react-router-dom';

const messages = [
  `It’s a beautiful night.
You stepped outside to breathe, when suddenly a cascade of radiant shooting stars lit up the sky.

"Make a wish", a gentle voice echoed in the wind.
You closed your eyes.`,

  `Suddenly, when you open your eyes.
You found that you are somewhere else.
The surface around is glowing and unfamiliar.
The air is light, the colors vivid, and yet… it feels oddly familiar.`,

  `When you look down, you found that your form has changed.
You are no longer human in the traditional sense, but something new,
something attuned to this strange world.`,

  `"Where am I?" you wonder.
A luminous being floats toward you. Its voice echoes in your mind.

“This is ███ planet, a mystery world where you have to explore by yourself.
Here, your wish has opened the gate.
Now, you must build the world you envisioned.”`,

  `You look around and find others — beings like you — equally confused, equally transformed.
Everyone knows the same thing, and don’t know what to do.
So we start to explore the world to gather information.`
];

const IntroPage = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fadeClass, setFadeClass] = useState('opacity-100');
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayClass, setOverlayClass] = useState('opacity-0');

  const navigate = useNavigate();

  const switchBackground = currentMessage >= 1;
  const backgroundImage = switchBackground ? `url(${newBackground})` : `url(${introGif})`;

  const handleClick = () => {
    // If already on last message, fade out and redirect
    if (currentMessage >= messages.length - 1) {
      setFadeClass('opacity-0');
      setTimeout(() => {
        navigate('/quiz');
      }, 500);
      return;
    }

    setFadeClass('opacity-0');

    setTimeout(() => {
      if (currentMessage === 0) {
        setShowOverlay(true);
        setTimeout(() => setOverlayClass('opacity-100'), 10);
        setTimeout(() => setCurrentMessage((prev) => prev + 1), 1010);
        setTimeout(() => setOverlayClass('opacity-0'), 1500);
        setTimeout(() => {
          setShowOverlay(false);
          setFadeClass('opacity-100');
        }, 2500);
      } else {
        setCurrentMessage((prev) => prev + 1);
        setFadeClass('opacity-100');
      }
    }, 500);
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center flex items-center justify-center transition-all duration-1000 cursor-pointer"
      style={{ backgroundImage }}
      onClick={handleClick}
    >
      <div
        className={`text-white text-center px-6 z-10 transition-opacity duration-500 ${fadeClass}`}
      >
        <p className="text-2xl md:text-4xl font-thin leading-relaxed whitespace-pre-line">
          {messages[currentMessage]}
        </p>
      </div>

      {showOverlay && (
        <div
          className={`absolute inset-0 bg-white z-20 transition-opacity duration-1000 ${overlayClass}`}
        ></div>
      )}
    </div>
  );
};

export default IntroPage;
