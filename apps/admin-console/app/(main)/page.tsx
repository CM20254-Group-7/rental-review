import AdminConsolePageLayout from "@/components/ui/page-layout"
import { NextPage } from "next"

const Dashboard: NextPage = () => {
  return (
    <AdminConsolePageLayout title="Dashboard">
    <div className="flex flex-col gap-2 items-center">
      <p className="text-md font-semibold">Nothing Here Yet</p>
      <div>
        <p>Should Contain:</p>
        <ul className="list-disc pl-6">
          <li>Site Statistics</li>
        </ul>
      </div>
    </div>
    </AdminConsolePageLayout>
  )
}

export default Dashboard