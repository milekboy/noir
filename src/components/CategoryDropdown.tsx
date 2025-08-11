"use client"
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import NetworkInstance from "@/app/api/NetworkInstance";
import { useState, useEffect } from "react";

interface Category {
    _id: string;
    name: string;
  }


export default function Categorydropdown(){
    const [selectCat, setSelectCat] = useState("All Categories");

    const [category, setCategory] = useState<Category[]>([]);
      const networkInstance = NetworkInstance();
      useEffect(() => {
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


    
      const getProducts = async () => {
        try {
          const res = await networkInstance.get("category/get-all-categories");
    
          setCategory(res.data);
          console.log(res.data);
          console.log(category);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

    return(
        <Dropdown className="bootstrap-select default-select">
            <Dropdown.Toggle as="div" className="btn dropdown-toggle btn-light show">
                {selectCat}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>setSelectCat("All Categories")}><span><Link href="/shop-with-category">All Categories</Link></span></Dropdown.Item>
                {category.map((item, ind)=>( <Dropdown.Item onClick={()=>setSelectCat(item.name)} key={ind}>
                    <span><Link href="/shop-with-category">{item.name}</Link></span>
                </Dropdown.Item> ))}
                <Dropdown.Item onClick={()=>setSelectCat("UrbanSkirt")}><span><Link href="/shop-with-category">UrbanSkirt</Link></span></Dropdown.Item>
                <Dropdown.Item onClick={()=>setSelectCat("VelvetGown")}><span><Link href="/shop-with-category">VelvetGown</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("LushShorts")}><span><Link href="/shop-with-category">LushShorts</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Vintage")}><span><Link href="/shop-with-category">Vintage</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Wedding")}><span><Link href="/shop-with-category">Wedding</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Cotton")}><span><Link href="/shop-with-category">Cotton</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Linen")}><span><Link href="/shop-with-category">Linen</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Smart Casual Staples")}><span><Link href="/shop-with-category">Smart Casual Staples</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Back to Campus")}><span><Link href="/shop-with-category">Back to Campus</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Accessories Corner")}><span><Link href="/shop-with-category">Accessories Corner</Link></span></Dropdown.Item>                        
                <Dropdown.Item onClick={()=>setSelectCat("Layered Looks")}><span><Link href="/shop-with-category">Layered Looks</Link></span></Dropdown.Item>                        
            </Dropdown.Menu>
        </Dropdown> 
    )
}