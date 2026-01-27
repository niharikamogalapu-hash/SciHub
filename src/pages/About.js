import React, { useEffect } from "react";

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="page fade-in">
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div className="slide-up" style={{ marginBottom: "4rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", marginBottom: "1rem", marginTop: "0", background: "linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            About SciHub
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#9ca3af", maxWidth: "700px", margin: "0 auto", lineHeight: "1.8" }}>
            The passionate teens behind SciHub
          </p>
        </div>

        {/* Why We Built This */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.8rem", marginTop: "0", marginBottom: "1rem", color: "#38bdf8" }}>Why We Built This</h2>
          <p style={{ lineHeight: "1.8", marginBottom: "1rem", fontSize: "1.02rem", color: "#f9fafb" }}>
            We created SciHub because we saw a need in our community. Too many students find science intimidating, 
            boring, or disconnected from their lives. We wanted to change that. We wanted to build a platform where 
            learning science feels less like a chore and more like an adventure—where complex ideas become crystal clear 
            and where every student feels supported in their learning journey.
          </p>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            This isn't just a project for us. It's our passion project, our commitment to making education better, 
            and our proof that two dedicated students can create something that truly makes a difference.
          </p>
        </div>

        {/* Our Story */}
        <h2 style={{ fontSize: "2rem", marginTop: "3rem", marginBottom: "2rem", color: "#f9fafb" }}>Our Journey</h2>
        
        {/* Key Highlight */}
        <div className="card slide-up" style={{ marginBottom: "2rem", borderLeft: "3px solid #a855f7", background: "radial-gradient(circle at top left, #1f2937 0, #020617 60%)", padding: "2rem" }}>
          <p style={{ margin: "0", fontSize: "1.1rem", fontWeight: "600", color: "#f9fafb" }}>
            ⭐ We're only 15 years old, and we built this entire platform from scratch. This is what happens when young minds are passionate about making a difference.
          </p>
        </div>

        {/* Niharika's Section */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h3 style={{ color: "#38bdf8", marginTop: "0", fontSize: "1.5rem", marginBottom: "1rem" }}>🚀 Niharika's Technical Excellence</h3>
          <p style={{ lineHeight: "1.8", marginBottom: "1rem", fontSize: "1.02rem", color: "#f9fafb" }}>
            Niharika took on the monumental task of building the entire platform from the ground up. We're talking hundreds and hundreds of hours 
            of coding, debugging, designing, and optimizing. Every interactive game, every lesson page, every feature you see on this 
            site came from her dedication and technical expertise at just 15 years old.
          </p>
          <p style={{ lineHeight: "1.8", marginBottom: "1rem", fontSize: "1.02rem", color: "#f9fafb" }}>
            But here's the thing—it wasn't easy. Niharika faced countless challenges. There were bugs that took hours to track down. 
            Features that didn't work the way she envisioned. Times when the code wouldn't cooperate, and she'd have to completely rethink 
            an entire section. She dealt with performance issues, struggled with responsive design across different devices, and had to learn 
            new technologies on the fly just to make certain features possible. There were moments of frustration, late nights staring at 
            error messages, and moments where she questioned if she could pull this off.
          </p>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            But she pushed through. She researched solutions online, tested relentlessly, rewrote entire sections of code to make them better, 
            and never settled for "good enough." She stayed up late troubleshooting issues, researched best practices, and constantly refined 
            every detail to make sure the platform is not just functional, but beautiful, intuitive, and actually enjoyable to use. 
            Niharika's perseverance and technical brilliance is the backbone of everything you see here—and remember, she did all this while 
            managing school, homework, and everything else that comes with being 15.
          </p>
        </div>

        {/* Parimita's Section */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h3 style={{ color: "#a855f7", marginTop: "0", fontSize: "1.5rem", marginBottom: "1rem" }}>💡 Parimita's Creative Vision & Partnership</h3>
          <p style={{ lineHeight: "1.8", marginBottom: "1rem", fontSize: "1.02rem", color: "#f9fafb" }}>
            While Niharika was coding, I (Parimita) was thinking about how to make this truly special. At 15, I contributed creative ideas 
            for the curriculum structure, suggested features that would actually help students learn better, and helped shape the overall 
            vision of the platform. I was the voice asking "what if we could..." and "what would students really want?" 
          </p>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            But our partnership meant we also supported each other through the struggles. When Niharika hit a coding wall and felt stuck, 
            I'd brainstorm solutions with her. When I had doubts about our ideas, she'd show me what was possible through code. We had tough 
            conversations about what to cut and what to keep, we had to learn project management and planning at an age when most teens are 
            just thinking about weekend plans. We pushed each other, challenged each other's thinking, and built something neither of us 
            could have created alone.
          </p>
        </div>

        {/* Karthikashree's Section */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h3 style={{ color: "#10b981", marginTop: "0", fontSize: "1.5rem", marginBottom: "1rem" }}>🐛 Karthikashree's Quality Assurance & Attention to Detail</h3>
          <p style={{ lineHeight: "1.8", marginBottom: "1rem", fontSize: "1.02rem", color: "#f9fafb" }}>
            As our Quality Assurance specialist, Karthikashree played a crucial role in making sure SciHub was rock-solid and bug-free. 
            While Niharika was building features and Parimita was shaping the vision, Karthikashree meticulously tested every corner of the 
            platform, finding bugs that we missed, identifying edge cases we didn't think of, and pushing us to make everything better.
          </p>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            Her eye for detail and relentless testing uncovered issues ranging from small UI glitches to significant logic problems that could 
            have broken the user experience. Beyond just finding bugs, Karthikashree worked closely with us to understand the issues and provided 
            clear feedback that helped us fix them faster. She was instrumental in ensuring that every game works perfectly, every lesson loads 
            smoothly, and every feature functions as intended. Her contribution made SciHub not just functional, but reliable and trustworthy—
            the kind of platform where students and educators can have complete confidence.
          </p>
        </div>

        {/* The Struggle & Victory */}
        <div className="card slide-up" style={{ marginBottom: "2rem", padding: "2rem" }}>
          <h3 style={{ color: "#38bdf8", marginTop: "0", fontSize: "1.5rem", marginBottom: "1rem" }}>🤝 The Struggle, The Growth, The Victory</h3>
          <p style={{ lineHeight: "1.8", marginBottom: "1rem", fontSize: "1.02rem", color: "#f9fafb" }}>
            This wasn't easy. There were long nights, frustrating bugs that seemed impossible to solve, merge conflicts that made no sense, 
            and moments where we genuinely questioned if we could pull this off. We struggled with complex logic, debugged problems for hours, 
            dealt with features that seemed amazing in theory but were a nightmare to build in reality. We had to learn database management, 
            API integration, responsive design—all while being 15-year-olds who were supposed to be studying for other classes too.
          </p>
          <p style={{ lineHeight: "1.8", marginBottom: "0", fontSize: "1.02rem", color: "#f9fafb" }}>
            But we pushed through because we both believed in this mission. We learned more in building SciHub than we could have in any 
            classroom. Niharika's technical brilliance combined with my creative vision created something extraordinary. We proved that 
            age is just a number when you have determination, and that two 15-year-olds can build something that genuinely helps people. 
            This isn't just a project for us—it's our legacy, our passion, and proof of what's possible when young people are given the 
            space to dream big and work hard.
          </p>
        </div>

        {/* Closing Message */}
        <div style={{ textAlign: "center", marginTop: "3rem", marginBottom: "2rem" }}>
          <p style={{ lineHeight: "1.8", fontSize: "1.05rem", fontStyle: "italic", color: "#9ca3af", marginBottom: "0" }}>
            SciHub is our hard work, our passion, and our gift to students everywhere. Welcome to something special.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

export default About;


