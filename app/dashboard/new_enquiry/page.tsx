"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  name: string;
  term: string;
  users: string;
}

interface EnquiryFormData {
  userId:string,
  cloudProvider: string;
  region: string;
  companyName:string;
  products: Product[];
}

const Enquiry: React.FC = () => {

  const router = useRouter()

  const [formData, setFormData] = useState<EnquiryFormData>({
    userId:"",
    cloudProvider: "",
    region: "",
    companyName: "",
    products: [{ name: "", term: "", users: "" }],
  });

  useEffect(()=>{
    setFormData((prev)=>{
      prev.userId=localStorage.getItem('userData')?.split(":")[2] as string
      return {
        ...prev
      }
    })
  
  },[])

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newProducts:any = [...formData.products];
    newProducts[index][name] = value;
    setFormData({ ...formData, products: newProducts });
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: "", term: "", users: "" }],
    });
  };

  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("[+]Selected form data ", JSON.stringify(formData));

    fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/user/inquiry/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          if (res.message === "unauthorized") {
            //route to login
          }
          //display error
          alert(res.message)
        } else {
          //show entry success
          router.push('list_enquiry')
        }
      });
  };

  function productDeleteHandler(index: any) {
    console.log("[+]Delete ", index);
    setFormData((prev) => {
      const updatedProducts = prev.products.filter((_, i) => i !== index);
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  }

  const products = [
    {
      name: "Product1",
      terms: ["1 year", "3 year", "PAYG"],
      users: [1, 5, 10, 15],
    },
    {
      name: "Product2",
      terms: ["1 year", "3 year", "PAYG"],
      users: [1, 5, 10, 15],
    },
    {
      name: "Product3",
      terms: ["1 year", "3 year", "PAYG"],
      users: [1, 5, 10, 15],
    },
  ];

  const regions = ["Asia","US East (N. Virginia)" ];

  return (
    <div className="container mx-auto text-black w-auto">
      <form onSubmit={handleSubmit} className=" w-auto m-5">
        <h2 className="text-black text-2xl mb-4 bold">Create Enquiry</h2>
        <div className="flex gap-4">
          <div className="rounded-lg border p-4 h-fit shadow-md">
            <div className="mb-4">
              <label className="text-black block bold mb-2">
                Preferred Cloud Service Provider
              </label>
              <div>
                <input
                  type="radio"
                  id="aws"
                  name="cloudProvider"
                  value="aws"
                  checked={formData.cloudProvider === "aws"}
                  onChange={handleChange}
                  className="mr-2"
                  required={true}
                />
                <label htmlFor="aws" className="mr-4">
                  AWS
                </label>

                <input
                  type="radio"
                  id="azure"
                  name="cloudProvider"
                  value="azure"
                  checked={formData.cloudProvider === "azure"}
                  onChange={handleChange}
                  className="mr-2"
                  required={true}
                />
                <label htmlFor="azure">Azure</label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="region" className="text-black block mb-2 bold">
                Region
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-indigo-500 focus:ring-1"
                style={{ minWidth: "200px" }}
              >
                {regions.map((region, index) => (
                  <option
                    key={index}
                    value={region}
                    className="text-gray-700 block px-4 py-2 text-md"
                    role="menuitem"
                  >
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label
                htmlFor="company-name"
                className="text-black block mb-2 bold"
              >
                Company Name
              </label>
              <input
                id="company-name"
                name="companyName"
                type="text"
                required={true}
                value={formData.companyName}
                onChange={handleChange}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-indigo-500 focus:ring-1"
              />
            </div>
          </div>
          <div className="rounded-lg border p-4 min-w-96 shadow-md">
            <div className="flex justify-between">
              <h2 className="text-black bold text-xl mb-2">Product List</h2>
              <button
                onClick={handleAddProduct}
                type="button"
                className=" text-black font-bold py-2 px-4 rounded-lg shadow-sm mb-2"
              >
                + Add Product
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {formData.products.map((product, index) => (
                <div  key={index} className="flex flex-col rounded-lg border border-gray  shadow-md">
                  <div className="w-full bg-slate-400 broder rounded-t-lg border-black flex flex-col">
                    <div className="self-end p-3 ">
                      <button
                        className="bg-red-500 text-white   py-1 px-3 rounded-md"
                        onClick={() => {
                          productDeleteHandler(index);
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                  <div
                    key={index}
                    className="product-item flex flex-row p-4 gap-10 mb-4 "
                  >
                    <div className="flex flex-col">
                      <label
                        htmlFor={`product-${index}-name`}
                        className="text-black mb-1"
                      >
                        Product Name
                      </label>

                      <select
                        id={`product-${index}-name`}
                        name="name"
                        value={product.name}
                        onChange={(e:any) => handleProductChange(index, e)}
                        className="input rounded-lg border border-gray-300 mb-2 text-gray-700 block px-4 py-2 text-sm min-w-80"
                      >
                        <option
                          value=""
                          className="text-gray-700 block px-4 py-2 text-sm"
                        >
                          Select Product
                        </option>
                        {products.map((productData, idx) => (
                          <option key={idx} value={productData.name}>
                            {productData.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {product.name && (
                      <>
                        <div className="flex flex-col">
                          <label
                            htmlFor={`product-${index}-term`}
                            className="text-black mb-1"
                          >
                            Term
                          </label>

                          <select
                            id={`product-${index}-term`}
                            name="term"
                            value={product.term}
                            onChange={(e:any) => handleProductChange(index, e)}
                            className="input rounded-lg border border-gray-300 mb-2 text-gray-700 block px-4 py-2 text-sm "
                          >
                            <option
                              value=""
                              className="text-gray-700 block px-4 py-2 text-sm"
                            >
                              Select Term
                            </option>
                            {products
                              .find((p) => p.name === product.name)
                              ?.terms.map((term, idx) => (
                                <option key={idx} value={term}>
                                  {term}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="flex flex-col">
                          <label
                            htmlFor={`product-${index}-Users`}
                            className="text-black mb-1"
                          >
                            Users
                          </label>

                          <select
                            id={`product-${index}-Users`}
                            name="users"
                            value={product.users}
                            onChange={(e:any) => handleProductChange(index, e)}
                            className="input rounded-lg border border-gray-300 mb-2 text-gray-700 block px-4 py-2 text-sm"
                          >
                            <option
                              value=""
                              className="text-gray-700 block px-4 py-2 text-sm"
                            >
                              Select users
                            </option>
                            {products
                              .find((p) => p.name === product.name)
                              ?.users.map((users, idx) => (
                                <option key={idx} value={users}>
                                  {users}
                                </option>
                              ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="fixed bottom-4 right-4">
          <button
            type="submit"
            className="btn btn-primary mr-2 bg-slate-900 text-white p-2 px-5 rounded-md"
          >
            Create
          </button>
          <button onClick={()=>{router.back()}} type="button" className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Enquiry;
