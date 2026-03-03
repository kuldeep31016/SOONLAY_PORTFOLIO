"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export function ContactHero() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!fullName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setStatusMessage("Please fill in all fields.")
      return
    }

    const toRecipient = "soonlay.tech@gmail.com"
    const ccRecipients = "syedayaan9376@gmail.com,iamkuldeepraj55@gmail.com"

    const emailSubject = `${subject.trim()}`

    const emailBody = `Hello Soonlay Team,

I would like to get in touch with you. Here are my details:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT DETAILS

Name: ${fullName.trim()}
Email: ${email.trim()}
Subject: ${subject.trim()}

Message:
${message.trim()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking forward to your response!

Best regards,
${fullName.trim()}`

    const mailtoLink = `mailto:${toRecipient}?cc=${ccRecipients}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink

    setStatusMessage("Opening your email client...")
    
    setTimeout(() => {
      setFullName("")
      setEmail("")
      setSubject("")
      setMessage("")
      setStatusMessage(null)
    }, 1500)
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-dark">
      <div className="mesh-gradient" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 flex justify-center"
            >
              <Badge>Contact Us</Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="mb-6 font-display text-4xl leading-tight tracking-tight text-primary sm:text-5xl lg:text-6xl"
            >
              Let's Work{" "}
              <span className="gradient-text">Together</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-2xl text-base text-secondary sm:text-lg"
            >
              Get in touch to discuss your project and see how we can turn your
              ideas into reality.
            </motion.p>
          </div>

          {/* Form and Contact Info Grid */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border/50 bg-surface/40 p-8 backdrop-blur-sm"
            >
              <h2 className="mb-6 text-xl font-semibold text-primary">
                Send Us a <span className="text-accent">Message</span>
              </h2>

              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-surface/60 px-4 py-3 text-sm text-primary placeholder:text-muted outline-none transition-colors focus:border-accent focus:bg-surface"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-surface/60 px-4 py-3 text-sm text-primary placeholder:text-muted outline-none transition-colors focus:border-accent focus:bg-surface"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-surface/60 px-4 py-3 text-sm text-primary placeholder:text-muted outline-none transition-colors focus:border-accent focus:bg-surface"
                  />
                </div>

                <div>
                  <textarea
                    rows={5}
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-border/50 bg-surface/60 px-4 py-3 text-sm text-primary placeholder:text-muted outline-none transition-colors focus:border-accent focus:bg-surface resize-none"
                  />
                </div>

                {statusMessage && (
                  <p className="text-sm text-accent">{statusMessage}</p>
                )}

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                >
                  Send Message
                </Button>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-primary">
                Contact <span className="text-accent">Information</span>
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <motion.a
                  href="mailto:hello@soonlay.tech"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="group flex items-start gap-4 rounded-xl border border-border/30 bg-surface/20 p-5 backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-surface/40"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-secondary">
                      Email
                    </h3>
                    <p className="text-base font-medium text-primary">
                      hello@soonlay.tech
                    </p>
                  </div>
                </motion.a>

                {/* Phone */}
                <motion.a
                  href="tel:+1234567890"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                  className="group flex items-start gap-4 rounded-xl border border-border/30 bg-surface/20 p-5 backdrop-blur-sm transition-all hover:border-accent/50 hover:bg-surface/40"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-secondary">
                      Call
                    </h3>
                    <p className="text-base font-medium text-primary">
                      +123-456-7890
                    </p>
                  </div>
                </motion.a>

                {/* Location */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-4 rounded-xl border border-border/30 bg-surface/20 p-5 backdrop-blur-sm"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-secondary">
                      Location
                    </h3>
                    <p className="text-base font-medium text-primary">
                      Mumbai, India
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
            className="mt-12 text-center text-sm text-secondary"
          >
            We'll get back to you within 24 hours.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
