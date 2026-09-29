import { COMPANY_INFO } from '../data/packagesData';

export const PrivacyPolicyPage = () => {
  return (
    <div className="bg-[#f5f5f7] min-h-screen text-[#1d1d1f]">
      {/* Apple Legal Header */}
      <section className="bg-white pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-[#e5e5ea] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">
            Legal & Compliance
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.08] text-balance">
            Privacy Policy.
          </h1>
          <p className="text-sm sm:text-base text-[#6e6e73] font-mono pt-2">
            Effective Date: January 1, 2026 · Last Updated: September 2026
          </p>
        </div>
      </section>

      {/* Legal Prose Content */}
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#e5e5ea] space-y-8 text-xs sm:text-sm text-[#424245] leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              1. Overview & Scope
            </h2>
            <p>
              Spiky Cabs ("we", "our", or "us"), headquartered at <em>Himachal Sarani, Opp Janki Apartment, Haiderpara, Siliguri, West Bengal 734001</em>, is dedicated to protecting the privacy of travelers engaging our private tourist cab packages across West Bengal, Sikkim, and Bhutan. This policy details our data practices for transport reservations, transit logistics, and statutory government border clearances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              2. Information We Collect
            </h2>
            <p>
              To confirm your vehicle allocation and comply with regional administrative requirements, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#6e6e73]">
              <li><strong>Contact Information:</strong> Full name, telephone/WhatsApp number, and email address.</li>
              <li><strong>Transit Timing:</strong> Train arrival codes at New Jalpaiguri (NJP), flight schedule at Bagdogra Airport (IXB), and hotel pickup addresses.</li>
              <li><strong>Statutory Identity Documentation:</strong> For Protected Area Permits (PAP) mandated by the Sikkim Tourism and Forest Departments (Tsomgo Lake, Nathula Pass, Lachung, and Yumthang Valley), we collect digital copies of approved Government identity cards (Voter ID or Passport) and recent passport photographs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              3. Use of Personal Information
            </h2>
            <p>
              Information collected is used strictly for operational purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#6e6e73]">
              <li>Issuing your cab booking voucher and assigning your verified local mountain chauffeur.</li>
              <li>Submitting statutory permit applications to the Sikkim Tourism Department, Army clearance checkposts, and Bhutan Road Safety & Transport Authority (RSTA).</li>
              <li>Providing real-time weather alerts and coordinating alternate routes in the event of landslides.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              4. Non-Commercial Data Protection
            </h2>
            <p>
              We do not sell, rent, monetize, or trade passenger information with third-party advertising companies. Identification data is shared exclusively with your assigned chauffeur for pickup and official government checkpost desks for permit authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this privacy statement, please contact us at:
            </p>
            <div className="bg-[#f5f5f7] rounded-2xl p-5 text-xs text-[#1d1d1f] space-y-1">
              <div><strong>Spiky Cabs Privacy Desk</strong></div>
              <div>Email: {COMPANY_INFO.email}</div>
              <div>Phone: {COMPANY_INFO.phone}</div>
              <div>Address: {COMPANY_INFO.address}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
