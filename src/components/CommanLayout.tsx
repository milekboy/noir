import Header from "./Header";
import Footer from "./Footer";
import Header2 from "./Header2";

interface Props {
    children: React.ReactNode 
}


const CommanLayout = ({children} : Props) => {
    return(
        <div className="page-wraper">
            <Header2/>
                {children}
            <Footer />
        </div>
    )
}
export default CommanLayout;