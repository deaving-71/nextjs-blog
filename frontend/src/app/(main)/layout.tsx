import { Header } from "@/components/common"

export type MainLayoutProps = React.PropsWithChildren
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="container">
      <Header />
      {children}
    </div>
  )
}
