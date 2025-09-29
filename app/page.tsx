"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parsePhoneNumberFromString } from "libphonenumber-js"

export default function RebuiltLandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hearAbout: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [visibleLines, setVisibleLines] = useState<boolean[]>([])
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    lineRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleLines((prev) => {
                const newVisible = [...prev]
                newVisible[index] = true
                return newVisible
              })
            }
          },
          { threshold: 0.3, rootMargin: "0px 0px -100px 0px" },
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const formatPhone = (value: string): string => {
  try {
    if (value.startsWith("001")) {
      value = "+1" + value.slice(3)
    }

    if (!value.startsWith("+")) {
      value = "+1" + value
    }

    const phone = parsePhoneNumberFromString(value)
    if (phone && phone.isValid()) {
      return phone.formatInternational();
    }
    return value
  } catch {
    return value
  }
}

const handlePhoneBlur = () => {
  setFormData((prev) => ({
    ...prev,
    phone: prev.phone ? formatPhone(prev.phone) : ""
  }))
}

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    let error = ""
    switch (field) {
      case "phone":
  if (value && !/^[\d\s()+-]+$/.test(value)) {
    error = "Invalid characters in phone number"
  } else {
    // Normalize for validation
    let normalized = value
    if (value.startsWith("001")) {
      normalized = "+1" + value.slice(3)
    } else if (!value.startsWith("+")) {
      normalized = "+1" + value
    }

    const phone = parsePhoneNumberFromString(normalized)
    if (value && (!phone || !phone.isValid())) {
      error = "Invalid phone number"
    }
  }
  break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email address"
        }
        break
      case "name":
        if (value && !/^[a-zA-Z\s]{2,}$/.test(value)) {
          error = "Name must be at least 2 letters"
        }
        break
    }
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.phone) newErrors.phone = "Phone is required"
    if (!formData.hearAbout) newErrors.hearAbout = "Please select an option"
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true);

      const formattedPhone = formatPhone(formData.phone);

      const googleFormUrl =
        "https://docs.google.com/forms/d/e/1FAIpQLSc58rca94b_DAEC6yEtvEoJsVyoRrXdtzHXsIZxSji_0PS_mA/formResponse"

      const payload = new URLSearchParams()
      payload.append("entry.777941367", formData.name)
      payload.append("entry.289348571", formattedPhone)
      payload.append("entry.1239498843", formData.email)
      payload.append("entry.1053014655", formData.hearAbout)

      await fetch(googleFormUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      })

      setIsSubmitted(true)
      setFormData({ name: "", email: "", phone: "", hearAbout: "" })
      setErrors({})
    } catch (err) {
      alert("Error submitting form.")
    } finally {
      setLoading(false)
    }
  }

  const storyGroups = [
    {
      lines: ["Before I was 28, I lived a dozen lives."],
      style: "text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-8",
    },
    {
      lines: [
        "Born in a war-torn country.",
        "Drowned in heroin as a teenager.",
        "Clawed my way out, bloodied, but alive.",
      ],
      style: "text-lg sm:text-xl lg:text-2xl leading-relaxed text-foreground/90 mb-6",
    },
    {
      lines: [
        "Built a business from scratch, making six figures a month.",
        "Lived in penthouses, flew first class, dined with views people only dream of.",
      ],
      style: "text-lg sm:text-xl lg:text-2xl leading-relaxed text-foreground/90 mb-6",
    },
    {
      lines: ["And then in a blink, I lost it all."],
      style: "text-xl sm:text-2xl lg:text-3xl font-semibold text-destructive mb-6",
    },
    {
      lines: [
        "A crash. A whisper of metal against pavement.",
        "They said I'd never walk again. Said my hands would never move, that life as I knew it was over.",
      ],
      style: "text-lg sm:text-xl lg:text-2xl leading-relaxed text-foreground/80 mb-8",
    },
    {
      lines: ["But I serve a God who doesn't listen to odds.", "And I don't introduce myself by statistics anymore."],
      style: "text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-8",
    },
    {
      lines: ["I am not what happened to me.", "I'm a man of purpose.", "A man of grit, grace, and God."],
      style: "text-lg sm:text-xl lg:text-2xl font-semibold text-foreground leading-relaxed mb-6",
    },
    {
      lines: ["I walk, not just on my feet but in faith.", "I rise, not just from beds but from ashes."],
      style: "text-lg sm:text-xl lg:text-2xl leading-relaxed text-foreground/90 mb-8",
    },
    {
      lines: ["I'm not here to impress you.", "I'm here to serve.", "To help. To rise and take others with me."],
      style: "text-lg sm:text-xl lg:text-2xl leading-relaxed text-foreground/90 mb-12",
    },
    {
      lines: ["Hi, my name is Roman.", "And I'm not finished."],
      style: "text-2xl sm:text-3xl lg:text-4xl font-bold text-primary border-l-4 border-primary pl-6 italic",
    },
  ]

  const allLines = storyGroups.flatMap((group) => group.lines)

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-20">
        <div
          className={`text-center space-y-8 sm:space-y-12 max-w-5xl mx-auto ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <Badge variant="secondary" className="text-sm font-medium animate-pulse">
            Coming Soon
          </Badge>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full transform scale-150 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent rounded-lg transform scale-110"></div>
            <img
              src="cover.jpg"
              alt="Rebuilt: A Journey Through Pain, Purpose, and Power by Roman Kendzerskyy"
              className="relative z-10 w-72 sm:w-96 lg:w-[28rem] rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-700 mx-auto border-2 border-primary/20"
            />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-wide">
                BY ROMAN KENDZERSKYY
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
            </div>

            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground text-pretty leading-relaxed px-4 max-w-3xl mx-auto">
              From the depths of addiction and devastation to walking in faith and purpose—
              <span className="text-primary font-semibold"> this is more than survival, this is transformation.</span>
            </p>

            <div className="pt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              >
                Join the Waitlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              A Story of <span className="text-primary">Redemption</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mb-8"></div>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {storyGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                {group.lines.map((line, lineIndex) => {
                  const globalIndex =
                    storyGroups.slice(0, groupIndex).reduce((acc, g) => acc + g.lines.length, 0) + lineIndex
                  return (
                    <div
                      key={globalIndex}
                      ref={(el) => {
                        lineRefs.current[globalIndex] = el
                      }}
                      className={`transform transition-all duration-1000 ${
                        visibleLines[globalIndex] ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      }`}
                      style={{ transitionDelay: `${(globalIndex % 3) * 200}ms` }}
                    >
                      <p className={`text-center px-4 ${group.style}`}>{line}</p>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div
              className={`order-2 lg:order-1 ${isVisible ? "animate-slide-in-left animate-delay-400" : "opacity-0"}`}
            >
              <img
                src="roman.jpg"
                alt="Roman - Author of Rebuilt"
                className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              />
            </div>

            <div
              className={`order-1 lg:order-2 space-y-4 sm:space-y-6 text-center lg:text-left ${isVisible ? "animate-slide-in-right animate-delay-600" : "opacity-0"}`}
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet Roman</h2>
                <p className="text-lg sm:text-xl text-primary font-medium">Author, Survivor, Servant</p>
              </div>

              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg leading-relaxed">
                <p>
                  From the depths of addiction and the devastation of a life-changing accident, Roman's story is one of
                  miraculous transformation.
                </p>
                <p>
                  Today, he walks not just in physical recovery, but in unwavering faith, dedicated to lifting others
                  from their own ashes.
                </p>
                <p className="font-medium text-primary">
                  This is more than a memoir—it's a testament to the power of resilience, faith, and purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-12 sm:py-20 px-4 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`space-y-6 sm:space-y-8 ${isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"}`}>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Be the first to read REBUILT</h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4">
                Join the waitlist to get notified when the book launches and receive exclusive updates from Roman.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-md mx-auto px-4" noValidate>
                <div className="space-y-2 text-left">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className={`text-base ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>


                  <div className="space-y-2 text-left">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567 OR +(Country Code)..."
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      onBlur={handlePhoneBlur}
                      required
                      className={`text-base ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2 text-left">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`text-base ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="hearAbout">How did you hear about this book?*</Label>
                  <Select
                    required
                    value={formData.hearAbout}
                    onValueChange={(value) => handleInputChange("hearAbout", value)}
                  >
                    <SelectTrigger className={`text-base ${errors.hearAbout ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto z-50" position="popper" sideOffset={4}>
                      <SelectItem value="convention">Convention</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="friend-family">Friend or Family</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                      <SelectItem value="blog-article">Blog or Article</SelectItem>
                      <SelectItem value="search-engine">Search Engine</SelectItem>
                      <SelectItem value="book-recommendation">Book Recommendation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.hearAbout && <p className="text-red-500 text-sm mt-1">{errors.hearAbout}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full text-base">
                  {loading ? "Sending..." : "Join Waitlist"}
                </Button>
              </form>
            ) : (
              <Card className="p-6 max-w-md mx-auto bg-primary/10 border-primary/20 mx-4" style={{justifySelf: "center"}}>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-primary">Thank you!</h3>
                  <p className="text-sm text-muted-foreground">
                    You've been added to the waitlist. You'll be notified when REBUILT is available.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">REBUILT</h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              A story of faith, resilience, and rising from ashes.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025{" "}
              <a href="https://acbytes.com" style={{ color: "#01b5ce" }} target="blank">
                ACBYTES
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
