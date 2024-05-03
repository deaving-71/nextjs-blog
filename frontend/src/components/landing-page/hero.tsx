import { Button } from "../ui/button"
import { Input } from "../ui/input"

export function Hero() {
  return (
    <section className="grid h-full min-h-[600px] place-content-center">
      <div className="space-y-6 text-center">
        <h1 className="whitespace-nowrap text-5xl font-bold tracking-wide lg:text-7xl">
          Infinite Insights
        </h1>
        <p className="text-muted-foreground">
          Exploring the Boundless World of Ideas
        </p>
        <form>
          <div className="flex justify-center gap-2">
            <Input
              className="max-w-[320px]"
              placeholder="Enter your email"
              type="email"
            />
            <Button>Subscribe</Button>
          </div>
        </form>
      </div>
    </section>
  )
}
