import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { registerHandlers } from './roomManager'

const app = express()
app.use(cors({ origin: '*' }))
app.get('/health', (_, res) => res.json({ ok: true }))

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('connected:', socket.id)
  registerHandlers(io, socket)
  socket.on('disconnect', () => console.log('disconnected:', socket.id))
})

const PORT = 3001
httpServer.listen(PORT, () => {
  console.log(`✅ Roll The Beat server running on http://localhost:${PORT}`)
})
