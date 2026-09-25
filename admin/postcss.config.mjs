// The admin portal is styled with hand-written CSS in `app/globals.css`, not
// Tailwind. Defining an explicit config here stops Next.js from walking up and
// picking up the public site's Tailwind setup for this app.
const postcssConfig = {
  plugins: {
    autoprefixer: {}
  }
}

export default postcssConfig
