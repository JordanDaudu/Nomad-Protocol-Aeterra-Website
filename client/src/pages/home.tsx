import HomeHero from "@/components/home/HomeHero";
import HomeQuickAccess from "@/components/home/HomeQuickAccess";
import HomeHub from "@/components/home/HomeHub";
import HomeLoreHighlight from "@/components/home/HomeLoreHighlight";
import HomeExternalLinks from "@/components/home/HomeExternalLinks";
import ScrollReveal from "@/components/home/ScrollReveal";

export default function Home() {
    return (
        <div className="space-y-4" data-testid="page-home">
            <ScrollReveal>
                <HomeHero />
            </ScrollReveal>
            <ScrollReveal delay={80} stagger>
                <HomeQuickAccess />
            </ScrollReveal>
            <ScrollReveal>
                <HomeHub />
            </ScrollReveal>
            <ScrollReveal>
                <HomeLoreHighlight />
            </ScrollReveal>
            <ScrollReveal delay={40} stagger>
                <HomeExternalLinks />
            </ScrollReveal>
        </div>
    );
}
