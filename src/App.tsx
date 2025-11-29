import { useState } from "react";
import RetroBackground from "./components/RetroBackground";
import FinalHero from "./components/FinalHero/FinalHero";
import AboutLarge from "./components/AboutLarge/AboutLarge";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import ScrollSmoothManager from "./components/ScrollSmooth/ScrollSmoothManager";
import GlobalBackground from "./components/Shared/GlobalBackground";
import IntroAnimation from "./components/Intro/IntroAnimation";
import SaturnPlayer from "./components/SaturnPlayer/SaturnPlayer";

function App() {
    const [renderer, setRenderer] = useState<any>(null);
    const [showIntro, setShowIntro] = useState(true);

    return (
        <div className="relative w-full min-h-screen text-white overflow-x-hidden">
            {showIntro && (
                <IntroAnimation onComplete={() => setShowIntro(false)} />
            )}

            <SaturnPlayer />

            <GlobalBackground />
            <RetroBackground onInit={setRenderer} startAnimation={!showIntro} />

            <ScrollSmoothManager renderer={renderer}>
                <div id="hero" data-section="hero" className="relative">
                    <FinalHero renderer={renderer} startAnimation={!showIntro} />
                    {/* Spacer for Hero Scroll Effect */}
                    <div style={{ height: '100vh' }}></div>
                </div>

                {/* Cinematic Chapter 2 Section */}
                <div id="about" data-section="about">
                    <AboutLarge />
                </div>

                {/* Skills Section */}
                <div id="skills" data-section="skills" data-no-exit-anim="true" style={{ marginBottom: '15vh' }}>
                    <Skills />
                </div>

                {/* Projects Section */}
                <div id="projects" data-section="projects" data-no-exit-anim="true">
                    <Projects />
                </div>

                {/* Contact Section */}
                <div id="contact" data-section="contact" style={{ marginBottom: '5vh' }}>
                    <Contact />
                </div>

                {/* Footer */}
                <div id="footer" data-section="footer">
                    <Footer />
                </div>
            </ScrollSmoothManager>
        </div >
    );
}

export default App;
