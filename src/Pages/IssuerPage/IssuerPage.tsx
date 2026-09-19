
import Dashboard from '../../Components/Dashboard/Dashboard'
import IssuerSidebar from '../../Components/IssuerSidebar/IssuerSidebar'

type Props = {}

const IssuerPage = (props: Props) => {
  return (
    <div className="relative text-left flex h-auto w-full overflow-hidden">
        
        <IssuerSidebar />

        <Dashboard children={undefined}></Dashboard>

    </div>
  )
}

export default IssuerPage