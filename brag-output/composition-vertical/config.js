// Soonlay brand film: the single place to edit text, colours, assets and timing.
// Keep the object below valid JSON: the soundtrack generator (audio/score.py)
// reads the same values so the music stays in sync with the picture.
window.FILM = {
  "fps": 30,
  "scenes": [
    {
      "id": "idea",
      "duration": 3.2
    },
    {
      "id": "interface",
      "duration": 4.6
    },
    {
      "id": "build",
      "duration": 5.0
    },
    {
      "id": "promise",
      "duration": 5.8
    },
    {
      "id": "brand",
      "duration": 4.1
    },
    {
      "id": "cta",
      "duration": 4.2
    }
  ],
  "colors": {
    "bg": "#07110F",
    "surface": "#0E1C19",
    "text": "#EAF2EF",
    "secondary": "#A9BCB6",
    "muted": "#7F948D",
    "accent": "#9FE6CD",
    "accentDeep": "#5FBFA3",
    "coral": "#FF6B4A"
  },
  "logo": "assets/img/logo.png",
  "soundtrack": "assets/audio/score.wav",
  "text": {
    "idea": [
      "Every product starts with an ",
      "idea",
      "."
    ],
    "interface": [
      "From idea to ",
      "interface",
      "."
    ],
    "build": [
      "Design.",
      "Build.",
      "Scale."
    ],
    "label": "Product Development Studio",
    "headline": [
      "Turning ideas",
      "into ",
      "real products."
    ],
    "capabilities": "Web · Mobile · SaaS · Business Software · AI",
    "question": "Have an idea worth building?",
    "answer": [
      "Let's ",
      "build it."
    ],
    "cta": "Start a Project",
    "url": "soonlay.tech",
    "promise": {
      "you": [
        "You bring the ",
        "idea",
        "."
      ],
      "we": "We bring the rest.",
      "steps": [
        "Discovery call",
        "Working preview in 1–2 days",
        "Scope & milestones",
        "Launch & support"
      ],
      "proof": [
        "See it working ",
        "before",
        " you commit."
      ]
    }
  }
}
