import Head from "@/components/shared/Head";
import React from "react";

const dmca = () => {
  return (
    <div className="w-full">
    <div className="pt-20 px-4 space-y-4 text-lg mx-auto w-3/4">
      <Head title="DMCA - AniTrek" description="DMCA AniTrek" />

      <h1 className="text-3xl font-bold">DMCA Takedown Request</h1>

      <p>
        We value the intellectual property rights of others and ask that our users do the same. The Digital Millennium Copyright Act (DMCA) has established a process for dealing with complaints about copyright infringement. If you own the copyright or have the right to act on behalf of the copyright owner and would like to report a claim that a third party is infringing on that material, please file a DMCA report on our Contact page and we will take appropriate action.
      </p>

      <h2 className="text-2xl font-semibold">DMCA Report Requirements</h2>
      <ul className="px-4 list-inside list-disc">
        <li>A description of the copyrighted work that you believe is being infringed;</li>
        <li>A description of the material you believe is infringing and you wish to remove or disable access to, including the URL or other location of the document;</li>
        <li>Name, title (if agent), address, phone number, and email address;</li>
        <li>A statement that you agree to the authority: <i>"I strongly believe that the use of copyrighted material which I am complaining about is not authorized by the copyright owner, its agent, or as permitted by law (for example, fair use);"</i></li>
        <li>A statement that you did not perjure: <i>"The information in this notice is accurate and, under penalty of perjury, I am the owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed;"</i></li>
        <li>Electronic or physical signature of the copyright owner or authorized person acting on behalf of the owner.</li>
      </ul>

      <p>
        Your DMCA takedown request should be emailed to:{" "}
        <a href="mailto:moonlightbz@proton.me">moonlightbz@proton.me</a>
      </p>

      <p>
        We will review your DMCA request and take appropriate action, including removal of content from the site.
      </p>

      <hr className="my-8" />

      <h2 className="text-3xl font-bold">About AniTrek</h2>

      <p>
        AniTrek helps users track, discover, and get alerts for anime and manga episodes. We do not host or stream videos.
      </p>
    </div>
    </div>
  );
};

export default dmca;
