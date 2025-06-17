import WithoutFooterLayout from "@/components/WithoutFooterLayout";
import PortfolioThumbsSlider from "./_components/PortfolioThumbsSlider";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

const PortfolioThumbsSliderPage = () =>{
    return(
        <WithoutFooterLayout>
            <PortfolioThumbsSlider />
        </WithoutFooterLayout>
    )
}
export default PortfolioThumbsSliderPage;