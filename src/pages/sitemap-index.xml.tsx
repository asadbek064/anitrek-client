// pages/sitemap.xml.tsx

import { escapeXmlCHaracters } from '@/lib/utils';
import supabase from '@/lib/supabase';
import { NextApiResponse } from 'next';

const baseUrl = 'https://anitrek.com';

function generateSiteMap(pages: string[]) {
    // Generate XML for the sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages.map((path) => {
            return `
            <sitemap>
                <loc>${baseUrl}/anime/details${escapeXmlCHaracters(path)}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
            </sitemap>`;
        }).join("")}
    </sitemapindex>`;
    
    return sitemapIndex;
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
    try {
        // Fetch data from supabase
        const { data, error } = await supabase.from('kaguya_anime_source').select('*');

        if (error) {
            throw error;
        }

        const pathList: string[] = [];
        if (data) {
            data.forEach((i) => {
                pathList.push(`/${i.mediaId}/${i.sourceMediaId}`);
            });
        }

        
        const sitemap = generateSiteMap(pathList);

        // Set the content type to XML
        res.setHeader("Content-Type", "application/xml");
        // Send the generated XML to the browser
        res.write(sitemap);
        res.end();
        
        return { props: {} };
    } catch (err) {
        console.error("Error generating sitemap:", err);
        // Handle errors here, e.g., return a 500 server error
        res.statusCode = 500;
        res.end();
        return { props: {} };
    }
}

// Export an empty function to satisfy Next.js requirements
export default function SiteMap() {}
