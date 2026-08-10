import type { Metadata } from "next";
import InformationPage from "@/components/InformationPage";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Image Credits | Katpana Desert Tour",
  description: "Creator, source, license and modification details for destination photography used by Katpana Desert Tour.",
  path: "/image-credits",
  imageAlt: "Golden sand dunes with a parked 4x4 below snow-covered mountains near Skardu",
  index: false
});

const commonModification =
  "The local file was renamed for this site. Responsive derivatives were resized and JPEG-compressed; browser display may crop the image. No creator endorsement is implied.";

export default function ImageCreditsPage() {
  return (
    <InformationPage
      eyebrow="Licensing"
      title="Image credits"
      intro="Destination photographs are credited here to preserve creator attribution and license context. Creative Commons ShareAlike derivatives remain available under the same listed license."
      sections={[
        {
          heading: "Homepage hero and video",
          paragraphs: [
            "The homepage hero artwork and local landscape video were supplied with the project, but no third-party source or license record is stored in this repository. The site owner must retain proof of ownership or permission and replace either asset before launch if that evidence is unavailable."
          ]
        },
        {
          heading: "Katpana Cold Desert",
          paragraphs: [`Skardu Katpana Desert — Abdullah Shakoor. CC0 1.0 public-domain dedication. ${commonModification}`],
          links: [
            { label: "Wikimedia Commons file page", href: "https://commons.wikimedia.org/wiki/File:Skardu_Katpana_Desert.jpg" },
            { label: "CC0 1.0", href: "https://creativecommons.org/publicdomain/zero/1.0/" }
          ]
        },
        {
          heading: "Deosai Plains",
          paragraphs: [`Green Deosai Plains — Moiz Ismaili. Licensed CC BY-SA 4.0. ${commonModification}`],
          links: [
            { label: "Wikimedia Commons file page", href: "https://commons.wikimedia.org/wiki/File:Green_Deosai_Plains.jpg" },
            { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }
          ]
        },
        {
          heading: "Upper Kachura Lake",
          paragraphs: [`Upper Kachura Lake — Muhammad Awais. Licensed CC BY-SA 4.0. ${commonModification}`],
          links: [
            { label: "Wikimedia Commons file page", href: "https://commons.wikimedia.org/wiki/File:Upper_Kachura_Lake.jpg" },
            { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }
          ]
        },
        {
          heading: "Shigar Fort",
          paragraphs: [`Shigar Fort by ZILL NIAZI 22 — ZILL NIAZI. Licensed CC BY-SA 4.0. A Wikimedia 1920-pixel rendition was used before the local responsive transformations. ${commonModification}`],
          links: [
            { label: "Wikimedia Commons file page", href: "https://commons.wikimedia.org/wiki/File:Shigar_Fort_by_ZILL_NIAZI_22.jpg" },
            { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }
          ]
        },
        {
          heading: "Khaplu Palace",
          paragraphs: [`View of main entrance of Khaplu Palace — Muhammad Ashar. Licensed CC BY-SA 3.0 Unported. A Wikimedia 1920-pixel rendition was used before the local responsive transformations. ${commonModification}`],
          links: [
            { label: "Wikimedia Commons file page", href: "https://commons.wikimedia.org/wiki/File:View_of_main_entrance_of_Khaplu_Palace.jpg" },
            { label: "CC BY-SA 3.0", href: "https://creativecommons.org/licenses/by-sa/3.0/" }
          ]
        },
        {
          heading: "K2",
          paragraphs: [`Chogori — Zacharie Grossen. Licensed CC BY-SA 4.0. A Wikimedia 1920-pixel rendition was used before the local responsive transformations. ${commonModification}`],
          links: [
            { label: "Wikimedia Commons file page", href: "https://commons.wikimedia.org/wiki/File:Chogori.jpg" },
            { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }
          ]
        },
        {
          heading: "Hunza Valley",
          paragraphs: [`Hunza Valley, Hunza — Muhammad Amjad Jamal. Licensed CC BY-SA 4.0. ${commonModification}`],
          links: [
            { label: "Wikimedia Commons file page", href: "https://commons.wikimedia.org/wiki/File:Hunza_Valley,_Hunza.jpg" },
            { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }
          ]
        },
        {
          heading: "Rama Meadows",
          paragraphs: [`Rama meadows in Astore Valley — Faisal Iqbal. Licensed CC BY-SA 4.0. ${commonModification}`],
          links: [
            { label: "Wikimedia Commons file page", href: "https://commons.wikimedia.org/wiki/File:Rama_meadows_in_Astore_Valley.jpg" },
            { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" }
          ]
        }
      ]}
    />
  );
}
