"use client"
import CommanLayout from "@/components/CommanLayout"
import ShopCart from "./_components/ShopCart"
import ProductSection from "@/elements/Home/AiSuggestion";

const ShopCartPage = () =>{
    return(
        <CommanLayout>
            <ShopCart />
            <div className="px-5">
                <ProductSection/>
            </div>
        </CommanLayout>
    )    
}
export default ShopCartPage;