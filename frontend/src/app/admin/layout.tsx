import { AdminProviders } from "@/components/providers/admin"

export type AdminLayoutProps = React.PropsWithChildren

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminProviders>{children}</AdminProviders>
}
