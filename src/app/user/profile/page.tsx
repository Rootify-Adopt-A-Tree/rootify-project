import Image from "next/image";
import Navbar from "@/components/Header";
import Footer from "@/components/Footer";

const MyAccount = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-6">My Account</h1>

        {/* User Info Card */}
        <div className="relative bg-green-100 p-6 rounded-xl shadow-md">
          <div>
            <p className="font-semibold">Name: Samiksha Solanke</p>
            <p>Email ID: abc@xyz.com</p>
            <p>DOB: DD/MM/YYYY</p>
            <p>City: XXX</p>
            <p>Contact No: XXXXXXXXXX</p>
          </div>
          {/* Badge Image */}
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
            <Image src="/badge.png" alt="Badge" width={80} height={80} />
          </div>
        </div>

        {/* Trees Adopted Section */}
        <h2 className="text-2xl font-semibold text-green-800 mt-8">Trees Adopted</h2>
        {[1, 2].map((_, index) => (
          <div key={index} className="bg-green-100 p-4 rounded-lg shadow-md mt-4">
            <p><strong>Tree Name:</strong> XXXX</p>
            <p><strong>Location:</strong> XXXX</p>
            <p><strong>Plantation Date:</strong> XXXX</p>
            <p><strong>Cause:</strong> XXXX</p>
            <p><strong>Certificate:</strong> XXXX</p>
          </div>
        ))}

        {/* Volunteering Experience Section */}
        <h2 className="text-2xl font-semibold text-green-800 mt-8">Volunteering Experience</h2>
        {[1, 2].map((_, index) => (
          <div key={index} className="bg-green-100 p-4 rounded-lg shadow-md mt-4">
            <p><strong>Location:</strong> XXXX</p>
            <p><strong>Date:</strong> XXXX</p>
            <p><strong>Hours:</strong> XXXX</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default MyAccount;