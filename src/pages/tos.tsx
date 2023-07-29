import Head from "@/components/shared/Head";
import React from "react";

const tos = () => {
  return (
    <div className="pt-20 px-4 md:px-12 space-y-4">
      <Head
        title="Terms of Service - AnimetTV"
        description="Terms of Service at AnimetTV"
      />

      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <div className="container mx-auto px-4">
          <p className="text-lg mb-4">Welcome to our anime streaming website. By using our website, you agree to be bound by the following terms and conditions ("Terms of Service"). If you do not agree to these Terms of Service, please do not use our website.</p>

          <ul className="list-inside space-y-4">
          <li>
        <strong>Use of Website</strong>
        <ul>
            <li>You may use our website for your personal, non-commercial use only.</li>
            <li>You may not use our website for any illegal or unauthorized purpose.</li>
            <li>You agree to comply with all applicable laws and regulations in your use of our website.</li>
        </ul>
        </li>
        <li>
            <strong>Intellectual Property</strong>
            <p>All content on our website, including but not limited to text, graphics, images, logos, and software, is the property of our website or its licensors and is protected by United States and international copyright laws. You may not reproduce, distribute, display, or transmit any content on our website without our prior written permission.</p>
        </li>
        <li>
            <strong>User Content</strong>
            <p>You may submit content to our website, including but not limited to comments, reviews, and ratings. By submitting content to our website, you grant us a non-exclusive, worldwide, royalty-free, perpetual, irrevocable, and fully sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content in any form, media, or technology now known or hereafter developed.</p>
        </li>
        <li>
            <strong>Disclaimer of Warranties</strong>
            <p>Our website is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of our website or the information, content, materials, or products included on our website. You expressly agree that your use of our website is at your sole risk.</p>
        </li>
        <li>
            <strong>Limitation of Liability</strong>
            <p>In no event shall our website or its affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or the content on our website. Some states or jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, so the above limitation may not apply to you.</p>
        </li>
        <li>
            <strong>Indemnification</strong>
            <p>You agree to indemnify and hold harmless our website and its affiliates from any claim or demand, including reasonable attorneys fees, made by any third party due to or arising out of your use of our website, your violation of these Terms of Service, or your violation of any rights of another.</p>
        </li>
        <li>
            <strong>Modification of Terms</strong>
            <p>We reserve the right to modify these Terms of Service at any time. Your continued use of our website after any such modification constitutes your acceptance of the modified Terms of Service.</p>
        </li>
        <li>
            <strong>Governing Law</strong>
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of the United States and the State of [insert state]. Any disputes arising out of or related to these Terms of Service shall be resolved exclusively in the state or federal courts located in [insert county, state].</p>
        </li>
        <li>
            <strong>Contact Us</strong>
            <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:demonking@sector.city">demonking@sector.city</a>.</p>
        </li>
          </ul>

          <p className="text-lg mt-4">By using our website, you acknowledge that you have read, understand, and agree to these Terms of Service.</p>
      </div>

    </div>
  );
};

export default tos;
