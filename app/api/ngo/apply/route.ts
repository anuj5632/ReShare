import prisma from '@/lib/prisma'

// in-memory fallback for NGO applications when DB model isn't present yet
const _ngoApplications: any[] = []

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ngoId, name, email, phone, message } = body || {}
    if (!ngoId || !name || !email) {
      return new Response(JSON.stringify({ error: 'ngoId, name and email are required' }), { status: 400 })
    }

    // verify NGO exists
    const ngo = await (prisma as any).ngo?.findUnique ? await (prisma as any).ngo.findUnique({ where: { id: Number(ngoId) } }) : { id: Number(ngoId) }
    if (!ngo) return new Response(JSON.stringify({ error: 'NGO not found' }), { status: 404 })

    // attempt to persist using Prisma if available
    try {
      if ((prisma as any).ngoApplication && typeof (prisma as any).ngoApplication.create === 'function') {
        const app = await (prisma as any).ngoApplication.create({ data: { name: String(name), email: String(email), phone: phone ? String(phone) : null, message: message ? String(message) : null, ngo: { connect: { id: Number(ngoId) } } } })
        return new Response(JSON.stringify({ success: true, application: app }), { status: 201 })
      }
    } catch (e) {
      console.warn('prisma ngoApplication failed, falling back to memory', e)
    }

    const app = { id: _ngoApplications.length + 1, name: String(name), email: String(email), phone: phone || null, message: message || null, ngoId: Number(ngoId), createdAt: new Date().toISOString() }
    _ngoApplications.push(app)
    return new Response(JSON.stringify({ success: true, application: app, persisted: 'memory' }), { status: 201 })
  } catch (err: any) {
    console.error('ngo apply error', err)
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), { status: 500 })
  }
}
