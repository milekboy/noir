import SaleDiscountShopCard from "../../components/SaleDiscountShopCard";
import { GreatSavindData } from "../../constant/Alldata";

const ShortListBlog = () => {
    return (
        <div className="row">
            {GreatSavindData.map((data, ind)=>(
                <div className="col-lg-6 col-md-6 col-sm-6 m-b30" key={ind}  style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "300px",
                        overflow: "hidden",
                        position: "relative",
                    
                    }}>
                    <SaleDiscountShopCard image={data.image} name={data.name}/> 
                </div>
            ))}            
        </div>	
    );
};

export default ShortListBlog;