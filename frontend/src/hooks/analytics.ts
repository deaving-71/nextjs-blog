import { useSuspenseQuery } from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"
import { getAnalysisValidator } from "@/lib/validator/analytics"

export function useGetAnalysis() {
  return useSuspenseQuery({
    queryKey: ["analysis"],
    queryFn: async () => {
      const result = await fetcher("/admin/analytics")
      return getAnalysisValidator.parse(result)
    },
  })
}
