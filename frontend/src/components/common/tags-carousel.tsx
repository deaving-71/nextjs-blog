import { getTags } from "@/lib/actions/server/get-tags"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Tag } from "."

export async function TagsCarousel() {
  const tags = await getTags()

  return (
    <div className="grid place-content-center pb-8">
      <Carousel
        opts={{
          align: "start",
        }}
        className="max-w-[280px] sm:max-w-fit"
      >
        <CarouselContent>
          {tags.map((tag) => (
            <CarouselItem key={tag.slug} className="flex-[0_0_auto]">
              <Tag href={`/blogs?tag=${tag.slug}`} {...tag} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
