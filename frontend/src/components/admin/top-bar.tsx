import { useRouter } from "next/navigation"

import { errorHandler } from "@/lib/actions/client/error-handler"
import { useSignOut } from "@/hooks/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import { Icons } from "../icons"
import { Button } from "../ui/button"

export function TopBar() {
  const router = useRouter()
  const signout = useSignOut({
    onSuccess: () => {
      router.push("/admin/auth/sign-in")
    },
    onError: (errors) => errorHandler({ errors }),
  })

  return (
    <>
      <div className="w-full flex-1"></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Icons.CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signout.mutate()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
