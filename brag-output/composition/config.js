// Soonlay brand film: the single place to edit text, colours, assets and timing.
// Keep this file valid JSON after the "window.FILM =" prefix: the soundtrack
// generator (audio/score.py) reads the same values so music stays in sync.
window.FILM = {
  "fps": 30,
  "scenes": [
    { "id": "idea", "duration": 3.4 },
    { "id": "interface", "duration": 4.6 },
    { "id": "build", "duration": 5.0 },
    { "id": "products", "duration": 5.5 },
    { "id": "brand", "duration": 4.5 },
    { "id": "cta", "duration": 3.0 }
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
    "idea": ["Every product starts with an ", "idea", "."],
    "interface": ["From idea to ", "interface", "."],
    "build": ["Design.", "Build.", "Scale."],
    "label": "Product Development Studio",
    "headline": ["Turning ideas", "into ", "real products."],
    "capabilities": "Web · Mobile · SaaS · Business Software · AI",
    "question": "Have an idea worth building?",
    "answer": ["Let's ", "build it."],
    "cta": "Start a Project",
    "url": "soonlay.tech"
  },
  "products": [
    { "kind": "web", "tag": "Web platform", "name": "Travel Booking Website", "img": "assets/img/web.jpg" },
    { "kind": "mobile", "tag": "Mobile app", "name": "Apna Khaata", "img": "assets/img/mobile.jpg" },
    { "kind": "dashboard", "tag": "Business software", "name": "Stock Management System", "img": "assets/img/dashboard.jpg" },
    { "kind": "ai", "tag": "AI product", "name": "AI Powered Healthcare System", "img": "assets/img/ai.jpg" }
  ]
}
