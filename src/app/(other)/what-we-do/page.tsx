import CommanLayout from "@/components/CommanLayout";
import WhatWeDo from "./_components/WhatWeDo";

export const metadata = {
  title: "Pixio: Shop & eCommerce NextJs Template | DexignZone",
  description: "Elevate your online retail presence with Pixio Shop & eCommerce React Template. Crafted with precision, this responsive and feature-rich template provides a seamless and visually stunning shopping experience. Explore a world of possibilities with modern design elements, intuitive navigation, and customizable features. Transform your website into a dynamic online storefront with Pixio, where style meets functionality for a captivating and user-friendly eCommerce journey.",  
};

const WhatWeDoPage = () => {
    return (
        <CommanLayout>
            <WhatWeDo />        
        </CommanLayout>
    );
};

export default WhatWeDoPage;