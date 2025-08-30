'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  typing?: boolean
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Nova, your AI assistant. How can I help you today? I can assist with room bookings, answer questions about our services, or provide information about Hotel Nova.",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedAction, setSuggestedAction] = useState<{ label: string; href: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickReplies = [
    "Check room availability",
    "What are your amenities?",
    "Restaurant menu",
    "Spa services",
    "Contact information"
  ]

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const { reply, action } = generateBotResponse(inputMessage)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setSuggestedAction(action || null)
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): { reply: string; action?: { label: string; href: string } } => {
    const input = userInput.toLowerCase()
    const roomMatch = userInput.match(/\b(\d{3,4})\b/)
    const room = roomMatch ? roomMatch[1] : null

    // Housekeeping / Cleaning requests
    if (/(clean|housekeeping|towel|towels|linen|laundry|make up room|turn down)/i.test(userInput)) {
      const r = room ? `Room ${room}` : 'your room'
      return {
        reply: `I can notify housekeeping to service ${r}. Please confirm the preferred time (e.g., now, in 30 minutes, or a specific time). If urgent, you can also call the front desk at +1 (555) 123-4567.`,
        action: room ? { label: 'Request Housekeeping', href: `action:housekeeping?room=${room}` } : undefined
      }
    }

    // Maintenance requests
    if (/(fix|broken|leak|maintenance|repair|ac|air\s*conditioning|tv|light|bulb|shower|toilet)/i.test(userInput)) {
      const r = room ? `Room ${room}` : 'your room'
      return {
        reply: `Thanks for letting us know. I can alert maintenance for ${r}. Could you describe the issue briefly and share when we can enter the room?`,
        action: room ? { label: 'Create Maintenance Ticket', href: `action:maintenance?room=${room}` } : undefined
      }
    }

    // Room service / food order
    if (/(room service|order food|menu|breakfast|dinner|lunch|coffee|tea)/i.test(userInput)) {
      return {
        reply: `Room Service is available 24/7. Highlights: Continental breakfast, club sandwich, pasta, and desserts. Would you like me to connect you or open the menu?`,
        action: { label: 'View Restaurant/Menu', href: '/#services' }
      }
    }

    // Check-in / Check-out times
    if (/(check\s*in|check\s*out|late check out|early check in)/i.test(userInput)) {
      return {
        reply: `Standard check-in is from 3:00 PM and check-out is until 12:00 PM (noon). Early check-in/late check-out are subject to availability. Would you like me to check availability for your dates?`,
        action: { label: 'Check Availability', href: '/booking' }
      }
    }

    // WiFi information
    if (/(wifi|wi-fi|internet|password)/i.test(userInput)) {
      return { reply: `High-speed WiFi is complimentary throughout the hotel. Network: HotelNova-Guest • Please request the latest password at the front desk or via your TV welcome screen.` }
    }

    // Parking / Directions
    if (/(parking|valet|car|directions|address)/i.test(userInput)) {
      return { reply: `We offer 24/7 valet parking at the main entrance. Self-parking is also available nearby. Our address: 123 Luxury Avenue, Downtown District. Need directions from your current location?` }
    }

    // Pool / Gym / Spa hours
    if (/(pool|gym|fitness|spa|massage|sauna|steam)/i.test(userInput)) {
      return { reply: `Facilities hours: Pool 6:00 AM–10:00 PM • Fitness Center 24/7 • Luxury Spa 9:00 AM–9:00 PM. Would you like to book a spa treatment?` }
    }

    // Policies
    if (/(policy|policies|pets|smoking|cancellation|id|deposit)/i.test(userInput)) {
      return { reply: `Key policies: No smoking indoors • Designated pet-friendly rooms (fee applies) • Government ID required at check-in • Standard cancellation by 6 PM day prior (rate-dependent). Need details on a specific policy?` }
    }

    if (input.includes('room') || input.includes('book') || input.includes('availability')) {
      return {
        reply: "I'd be happy to help you check room availability! We have Deluxe Ocean View rooms starting at $299/night, Family Suites at $449/night, and our Presidential Suite at $899/night. What dates are you looking for?",
        action: { label: 'Check Availability', href: '/booking' }
      }
    }

    
    if (input.includes('amenities') || input.includes('facilities')) {
      return { reply: "Hotel Nova offers premium amenities including: 🏊‍♂️ Infinity pool, 🍽️ Fine dining restaurant, 💆‍♀️ Luxury spa, 🏋️‍♂️ Fitness center, 🚗 Valet parking, 📶 High-speed WiFi, and 24/7 concierge service. Which would you like to know more about?" }
    }
    
    if (input.includes('restaurant') || input.includes('food') || input.includes('dining')) {
      return { reply: "Our award-winning restaurant serves international cuisine with fresh, locally-sourced ingredients. We're open for breakfast (6:30-10:30 AM), lunch (12:00-3:00 PM), and dinner (6:00-11:00 PM). We also offer 24/7 room service. Would you like to make a reservation?" }
    }
    
    if (input.includes('spa') || input.includes('massage') || input.includes('wellness')) {
      return { reply: "Our luxury spa offers rejuvenating treatments including Swedish massage, hot stone therapy, facial treatments, and wellness packages. We're open daily from 9:00 AM to 9:00 PM. Would you like to book a treatment or learn about our packages?" }
    }
    
    if (input.includes('contact') || input.includes('phone') || input.includes('address')) {
      return { reply: "📍 Hotel Nova is located in the heart of the city. 📞 Phone: +1 (555) 123-4567 ✉️ Email: info@hotelNova.com. Our front desk is available 24/7 for any assistance you need!" }
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('rate')) {
      return { reply: "Our room rates vary by season and availability: Deluxe Ocean View from $299/night, Family Suite from $449/night, Presidential Suite from $899/night. All rates include breakfast, WiFi, and access to our facilities. Would you like me to check current availability for specific dates?", action: { label: 'Check Rates & Availability', href: '/booking' } }
    }
    
    // Gentle correction / guidance for unrelated topics
    if (/(capital of|math problem|programming|football|movie|weather|stock|bitcoin|politics|celebrity)/i.test(userInput)) {
      return { reply: "I focus on Hotel Nova topics like bookings, rooms, amenities, dining, spa, policies, and assistance (e.g., housekeeping, maintenance, room service). Could you rephrase your question in that context?" }
    }

    return { reply: "I can help with: housekeeping and maintenance requests, room service and dining, bookings and availability, facilities and hours, WiFi/parking, and hotel policies. Please tell me what you need, e.g., 'clean my room 304 at 5 PM' or 'late check-out request'." }
  }

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply)
    sendMessage()
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${isOpen ? 'hidden' : 'block'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChatBubbleLeftRightIcon className="w-8 h-8" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full animate-pulse"></div>
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nova AI Assistant</h3>
                    <p className="text-sm text-primary-100">Online • Ready to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.slice(0, 3).map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Action */}
            {suggestedAction && (
              <div className="px-4 pb-2">
                <button
                  onClick={async () => {
                    try {
                      if (suggestedAction.href.startsWith('action:')) {
                        const url = new URL(suggestedAction.href.replace('action:', 'http://local/'))
                        const action = url.pathname.replace('/', '')
                        const room = url.searchParams.get('room') || ''
                        const preferredTime = window.prompt('Preferred time for service? (e.g., now, 5 PM)') || ''
                        const note = window.prompt('Any additional notes?') || ''
                        const type = action === 'housekeeping' ? 'housekeeping' : 'maintenance'
                        const res = await fetch('/api/v1/requests', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ type, room, preferredTime, note, source: 'chatbot' })
                        })
                        if (!res.ok) throw new Error('Failed to submit request')
                        const data = await res.json()
                        setMessages(prev => [...prev, {
                          id: Date.now().toString(),
                          text: `${type === 'housekeeping' ? 'Housekeeping' : 'Maintenance'} request created for Room ${room}. Ticket #${data.id}. We will attend shortly.`,
                          sender: 'bot',
                          timestamp: new Date()
                        }])
                      } else {
                        window.location.href = suggestedAction.href
                      }
                    } catch (e) {
                      setMessages(prev => [...prev, {
                        id: (Date.now()+2).toString(),
                        text: 'Sorry, we could not submit your request right now. Please try again or call the front desk.',
                        sender: 'bot',
                        timestamp: new Date()
                      }])
                    } finally {
                      setSuggestedAction(null)
                    }
                  }}
                  className="w-full btn-primary"
                >
                  {suggestedAction.label}
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
