import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">About ReShare</h1>
            <p className="text-lg text-muted-foreground">
              ReShare is on a mission to transform how surplus items are redistributed to create meaningful impact.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                To create a sustainable ecosystem where surplus items find their way to those who need them most,
                reducing waste while building stronger communities.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
              <p className="text-muted-foreground">
                A world where no usable item goes to waste, and every community has access to what they need. Through
                technology and collective action, we're building a more equitable and sustainable future.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Our Values</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <div>
                    <p className="font-semibold">Sustainability</p>
                    <p className="text-sm text-muted-foreground">Every donation keeps items out of landfills</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <div>
                    <p className="font-semibold">Transparency</p>
                    <p className="text-sm text-muted-foreground">Track your impact with detailed metrics</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <div>
                    <p className="font-semibold">Community</p>
                    <p className="text-sm text-muted-foreground">Building connections that matter</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <div>
                    <p className="font-semibold">Trust</p>
                    <p className="text-sm text-muted-foreground">Verified organizations and secure transactions</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
