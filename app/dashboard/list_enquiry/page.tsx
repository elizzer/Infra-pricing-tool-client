"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/user/inquiry/get?userId=${
        localStorage.getItem("userData")?.split(":")[2]
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setInquiries(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const deleteHandler = (id: string) => {
    console.log("[+]Delete action for inquiry ", id);
    console.log("[+]Selected inquiry ", selectedInquiry);
    const url = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/user/inquiry/delete?InquiryId=${id}`;
    console.log("[+]Delete request url", url);
    fetch(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("[+]Delete response ", res);
        closeModal();
        window.location.reload();
      });
  };

  const openModal = (inquiry:any) => {
    setSelectedInquiry(inquiry);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInquiry(null);
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between mt-8 align-middle">
        <h2 className="text-2xl font-semibold  text-black mb-4">
          List of Enquiries
        </h2>
        <button
          onClick={() => router.push("new_enquiry")}
          className="bg-blue-950 text-white font-bold py-2 px-4 rounded-lg mt-4 mb-5"
        >
          + Create new Inquiry
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-slate-400">
          <thead>
            <tr>
              <th className="border border-slate-300 px-4 py-2 text-slate-600 font-medium text-center">
                Cloud Provider
              </th>
              <th className="border border-slate-300 px-4 py-2 text-slate-600 font-medium">
                Region
              </th>
              <th className="border border-slate-300 px-4 py-2 text-slate-600 font-medium">
                Company Name
              </th>
              <th className="border border-slate-300 px-4 py-2 text-slate-600 font-medium">
                Product Details
              </th>
              <th className="border border-slate-300 px-4 py-2 text-slate-600 font-medium">
                Total Price
              </th>
              <th className="border border-slate-300 px-4 py-2 text-slate-600 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-black">
            {inquiries.map((inquiry:any) => (
              <tr key={inquiry._id} className="even:bg-slate-100 text-center">
                <td className="border border-slate-300 px-4 py-2">
                  {inquiry.cloudProvider}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  {inquiry.region}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  {inquiry.companyName}
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  <div className="flex flex-col">
                    {inquiry.products.map((product:any, index:any) => (
                      <div key={index} className="mb-2 flex gap-6">
                        <div>
                          <span className="font-semibold">Name:</span>{" "}
                          {product.name}
                        </div>
                        <div>
                          <span className="font-semibold">Term:</span>{" "}
                          {product.term}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  {inquiry.totalPrice} USD /month
                </td>
                <td className="border border-slate-300 px-4 py-2">
                  <button
                    onClick={() => openModal(inquiry)}
                    className="text-black font-bold py-2 px-4 rounded-lg"
                  >
                    ...
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50  flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg text-black p-4">
            <h2 className="text-xl font-semibold mb-4">Enquiry Details</h2>
            <div className="flex gap-10">
              <div>
                <div>Opportunity Name</div>
                <div className="font-bold">{selectedInquiry.companyName}</div>
              </div>
              <div>
                <div>Region</div>
                <div className="font-bold">{selectedInquiry.region}</div>
              </div>
              <div>
                <div>CSP</div>
                <div className="font-bold">{selectedInquiry.cloudProvider}</div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="font-semibold mb-4">Products Details</h2>
              {selectedInquiry &&
                selectedInquiry.products.map((product:any, index:any) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      {product.name} for {product.term}
                    </div>
                    <div className="text-gray">$6787</div>
                  </div>
                ))}
            </div>
            <div>
              <hr />
            </div>
            <div className="flex justify-between mt-4 font-bold">
              <div>Total</div>
              <div>{selectedInquiry.totalPrice}</div>
            </div>
            <div className="flex gap-5 justify-end">
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
              >
                Close
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  deleteHandler(selectedInquiry._id);
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
