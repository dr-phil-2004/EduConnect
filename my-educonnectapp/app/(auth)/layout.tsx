

type Props ={
    children: React.ReactNode
}

const Layout= ({children}: Props) =>{
    return (
        <div className="flex items-center justify-center h-screen">
            {children}
        </div>
    )
}
export default Layout