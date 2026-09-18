import AuditorSidebar from '../../Components/AuditorSidebar/AuditorSidebar'
import Dashboard from '../../Components/Dashboard/Dashboard'

type Props = {}

const AuditorPage = (props: Props) => {
  return (
    <div className="relative text-left flex h-auto w-full overflow-hidden">
        
        <AuditorSidebar />
        
        <Dashboard children={undefined}></Dashboard>

    </div>
  )
}

export default AuditorPage