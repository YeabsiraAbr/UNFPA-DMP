'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingState, EmptyState } from '@/components/ui/LoadingState'
import { messagesService } from '@/services'
import type { Conversation, Message } from '@/services/types'
import { cn } from '@/lib/utils'
import { MessageSquare, Search, Send, ArrowLeft, Plus } from 'lucide-react'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [newConversationUserId, setNewConversationUserId] = useState('')
  const [creatingConversation, setCreatingConversation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadConversations() {
    setLoadingConversations(true)
    try {
      const res = await messagesService.listConversations()
      if (res.success) {
        setConversations(res.conversations ?? [])
      }
    } catch {
      setConversations([])
    } finally {
      setLoadingConversations(false)
    }
  }

  async function handleNewConversation() {
    if (!newConversationUserId.trim()) return
    setCreatingConversation(true)
    try {
      const res = await messagesService.getOrCreateConversation(newConversationUserId.trim())
      if (res.success && res.conversation) {
        setShowNewConversation(false)
        setNewConversationUserId('')
        await loadConversations()
        selectConversation(res.conversation)
      }
    } catch {} finally {
      setCreatingConversation(false)
    }
  }

  async function selectConversation(conv: Conversation) {
    setSelectedConversation(conv)
    setLoadingMessages(true)
    try {
      const [msgRes] = await Promise.all([
        messagesService.listMessages(conv.id),
        messagesService.markConversationRead(conv.id).catch(() => {}),
      ])
      if (msgRes.success) {
        setMessages(msgRes.messages ?? [])
      }
    } catch {
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }

  async function handleSend() {
    if (!newMessage.trim() || !selectedConversation) return
    setSending(true)
    try {
      const res = await messagesService.sendMessage(selectedConversation.id, {
        body: newMessage.trim(),
      })
      if (res.success && res.message) {
        setMessages((prev) => [...prev, res.message])
        setNewMessage('')
      }
    } catch {
      // silently fail – the user can retry
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true
    const name = ((c as Record<string, unknown>).otherUserName as string) ?? ''
    const lastMsg = ((c as Record<string, unknown>).lastMessageBody as string) ?? ''
    const q = searchQuery.toLowerCase()
    return name.toLowerCase().includes(q) || lastMsg.toLowerCase().includes(q)
  })

  const currentUserId =
    typeof window !== 'undefined' ? localStorage.getItem('unfpa_user_id') : null

  return (
    <DashboardLayout
      title="Messages"
      subtitle="Conversations and messaging"
    >
      <Card padding="none" className="h-[calc(100vh-200px)] flex overflow-hidden">
        {/* Left panel – conversation list */}
        <div
          className={cn(
            'w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-700 flex flex-col flex-shrink-0',
            selectedConversation && 'hidden md:flex'
          )}
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Search conversations…"
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => setShowNewConversation(!showNewConversation)}
                title="New conversation"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {showNewConversation && (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter user ID…"
                  value={newConversationUserId}
                  onChange={(e) => setNewConversationUserId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleNewConversation() }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleNewConversation}
                  disabled={!newConversationUserId.trim() || creatingConversation}
                  isLoading={creatingConversation}
                >
                  Start
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <LoadingState message="Loading conversations…" />
            ) : filteredConversations.length === 0 ? (
              <EmptyState message={searchQuery ? 'No matching conversations' : 'No conversations yet'} />
            ) : (
              filteredConversations.map((conv) => {
                const rec = conv as Record<string, unknown>
                const name = (rec.otherUserName as string) ?? 'Unknown'
                const lastMsg = (rec.lastMessageBody as string) ?? ''
                const unread = Boolean(rec.unreadCount)
                const isSelected = selectedConversation?.id === conv.id

                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={cn(
                      'w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-slate-100 dark:border-slate-800',
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    )}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          'text-sm truncate',
                          unread ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'
                        )}>
                          {name}
                        </p>
                        {unread && (
                          <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {lastMsg || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right panel – message thread */}
        <div
          className={cn(
            'flex-1 flex flex-col',
            !selectedConversation && 'hidden md:flex'
          )}
        >
          {selectedConversation ? (
            <>
              {/* Thread header */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
                  {(((selectedConversation as Record<string, unknown>).otherUserName as string) ?? 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {((selectedConversation as Record<string, unknown>).otherUserName as string) ?? 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loadingMessages ? (
                  <LoadingState message="Loading messages…" />
                ) : messages.length === 0 ? (
                  <EmptyState message="No messages yet – start the conversation!" />
                ) : (
                  messages.map((msg) => {
                    const rec = msg as Record<string, unknown>
                    const isSent = rec.senderId === currentUserId || rec.fromMe === true
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex', isSent ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                            isSent
                              ? 'bg-brand-500 text-white rounded-br-md'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-md'
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                          {msg.attachmentUrl && (
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                'block mt-1 text-xs underline',
                                isSent ? 'text-white/80' : 'text-brand-500'
                              )}
                            >
                              View attachment
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose */}
              <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Input
                  placeholder="Type a message…"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  isLoading={sending}
                  size="md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <MessageSquare className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  )
}
