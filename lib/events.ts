import { EventEmitter } from "events"

type DonationEvent = {
  type: "donation.created"
  payload: any
}

// Singleton emitter shared across server runtime (dev & prod transient)
const emitter = new EventEmitter()

export function publishDonation(payload: any) {
  const ev: DonationEvent = { type: "donation.created", payload }
  emitter.emit("donation", ev)
}

export function subscribeDonations(cb: (ev: DonationEvent) => void) {
  emitter.on("donation", cb)
  return () => emitter.off("donation", cb)
}

export default emitter
