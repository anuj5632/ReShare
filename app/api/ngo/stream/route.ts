import { NextResponse } from "next/server"
import { subscribeDonations } from "@/lib/events"
import { getUserFromCookie } from "@/lib/auth"

// Simple SSE endpoint for NGOs to subscribe to donation events.
// Clients should open a GET request with Accept: text/event-stream

export async function GET(req: Request) {
  try {
    const user = await getUserFromCookie()
    if (!user || user.role !== "NGO") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let unsubscribe: (() => void) | null = null
    let keepAlive: ReturnType<typeof setInterval> | null = null

    const stream = new ReadableStream({
      start(controller) {
        // send a comment to confirm connection
        controller.enqueue(encode(": connected\n\n"))

        const onDonation = (ev: any) => {
          try {
            const payload = JSON.stringify(ev.payload || ev)
            // dispatch event; clients can filter by ngoId or other fields
            controller.enqueue(encode(`event: donation\ndata: ${payload}\n\n`))
          } catch (e) {
            console.error('SSE send error', e)
          }
        }

        unsubscribe = subscribeDonations(onDonation)

        // Keep the connection alive by sending a ping every 15s
        keepAlive = setInterval(() => controller.enqueue(encode(": ping\n\n")), 15000)
      },
      cancel() {
        try {
          if (keepAlive) clearInterval(keepAlive as any)
          if (unsubscribe) unsubscribe()
        } catch (e) {
          console.error('SSE cleanup error', e)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

function encode(str: string) {
  return new TextEncoder().encode(str)
}
