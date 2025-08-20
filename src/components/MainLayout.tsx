import { Fragment } from "react"
import Header from "./Header";
import Header2 from "./Header2";
import Footer from "./Footer";


interface Props {
    children: React.ReactNode 
}

const MainLayout = ({children} : Props) =>{
    return(
        <Fragment>
            <div className="page-wraper">
            {/*  <Header design="style-1 header-transparent"/> */}   
         
             <Header2/> 
             {children}
                <Footer />
            </div>
        </Fragment>
    )
}
export default MainLayout;