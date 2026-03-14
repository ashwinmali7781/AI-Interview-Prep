// import { Link } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Code, MessageSquare, BarChart3, ArrowRight } from "lucide-react";
// import { motion } from "framer-motion";

// const HomePage = () => {
//   const { user } = useAuth();

//   const features = [
//     { icon: Code, title: "Coding Practice", description: "Solve curated interview problems with an integrated code editor" },
//     { icon: MessageSquare, title: "AI Mock Interviews", description: "Get asked technical questions and receive instant feedback" },
//     { icon: BarChart3, title: "Track Progress", description: "Monitor your performance and identify areas for improvement" },
//   ];

//   return (
//     <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #0f0f23 0%, #1a1040 40%, #0d1929 100%)" }}>

//       {/* Hero */}
//       <div className="relative overflow-hidden">
//         {/* Grid overlay */}
//         <div
//           className="pointer-events-none absolute inset-0 opacity-[0.04]"
//           style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
//         />
//         {/* Glow blobs */}
//         <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
//         <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/20 blur-[120px]" />

//         <div className="container relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//             <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-elevated">
//               <img src="/vite.svg" alt="logo" className="h-10 w-10" />
//             </div>
//             <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
//               AI Interview Prep
//             </h1>
//             <p className="mx-auto mb-8 max-w-lg text-lg text-white/70">
//               Master coding interviews with AI-powered practice, real-time feedback, and comprehensive progress tracking.
//             </p>
//             <div className="flex flex-wrap items-center justify-center gap-4">
//               {user ? (
//                 <Link to="/dashboard">
//                   <Button size="lg" className="gap-2 gradient-primary text-white shadow-elevated">
//                     Go to Dashboard <ArrowRight className="h-4 w-4" />
//                   </Button>
//                 </Link>
//               ) : (
//                 <>
//                   <Link to="/signup">
//                     <Button size="lg" className="gap-2 gradient-primary text-white shadow-elevated">
//                       Get Started <ArrowRight className="h-4 w-4" />
//                     </Button>
//                   </Link>
//                   <Link to="/login">
//                     <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-blue">
//                       Sign In
//                     </Button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Features — same dark background */}
//       <div className="relative">
//         {/* Subtle separator glow */}
//         <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

//         <div className="container py-24">
//           <div className="mb-12 text-center">
//             <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">Everything you need</p>
//             <h2 className="text-3xl font-bold text-white">Built for serious candidates</h2>
//           </div>
//           <div className="grid gap-8 md:grid-cols-3">
//             {features.map((feature, i) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: i * 0.15 }}
//                 className="rounded-xl border border-white/10 p-8 transition-all hover:border-indigo-500/30 hover:bg-white/5"
//                 style={{ background: "rgba(255,255,255,0.04)" }}
//               >
//                 <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
//                   <feature.icon className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
//                 <p className="text-white/60">{feature.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="border-t border-white/10 py-8 text-center text-sm text-white/40">
//         © {new Date().getFullYear()} AI Interview Prep. Built to help you land your dream job.
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Code, MessageSquare, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Code,
      title: "Coding Practice",
      description:
        "Solve curated interview problems with an integrated code editor",
    },
    {
      icon: MessageSquare,
      title: "AI Mock Interviews",
      description: "Get asked technical questions and receive instant feedback",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description:
        "Monitor your performance and identify areas for improvement",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="gradient-hero relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/20 blur-[120px]" />

        <div className="container relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-elevated">
              <img src="/vite.svg" alt="logo" className="h-10 w-10" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl">
              AI Interview Prep
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-lg text-primary-foreground/70">
              Master coding interviews with AI-powered practice, real-time
              feedback, and comprehensive progress tracking.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="gap-2 gradient-primary text-primary-foreground shadow-elevated"
                  >
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="gap-2 gradient-primary text-primary-foreground shadow-elevated"
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-blue"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="container py-24">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Everything you need
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            Built for serious candidates
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="rounded-xl border border-border bg-card p-8 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AI Interview Prep. Built to help you land
        your dream job.
      </div>
    </div>
  );
};

export default HomePage;
 