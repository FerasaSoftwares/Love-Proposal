import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { triggerHeartExplosion } from '@/lib/confetti';
import { playSound } from '@/lib/sounds';
import HeartParticles from '@/components/HeartParticles';

export default function Proposal() {
  const [stage, setStage] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  const name = params?.get('name') || "My Love";
  const message = params?.get('message') || "You mean the world to me.";

  useEffect(() => {
    if (!params) return;
    let timer: NodeJS.Timeout;
    
    if (stage === 0) {
      timer = setTimeout(() => {
        setStage(1);
        playSound('emotional_swell', 0.4);
      }, 4000);
    } 
    else if (stage === 2) {
       playSound('tension_build', 0.5);
       timer = setTimeout(() => {
         setStage(3);
         playSound('proposal_spark', 0.6);
       }, 3000);
    }

    return () => clearTimeout(timer);
  }, [stage, params]);

  const handleNoHover = () => {
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 300 - 150;
    setNoButtonPosition({ x, y });
  };

  const handleYes = () => {
    setStage(4);
    triggerHeartExplosion();
  };

  if (!params) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-pink-100 to-rose-100 dark:from-red-950 dark:via-purple-950 dark:to-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative font-serif">
      <HeartParticles />

      <div className="absolute top-4 right-4 animate-pulse opacity-50">
        <Music className="w-6 h-6 text-primary" />
      </div>

      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5 }}
            className="text-center z-10"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <h2 className="text-2xl md:text-3xl text-muted-foreground mb-4 font-light">For</h2>
              <h1 className="text-6xl md:text-8xl font-script text-primary drop-shadow-sm p-4">{name}</h1>
            </motion.div>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
            className="max-w-lg w-full z-10 text-center px-6"
          >
            <CardContentWrapper>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <p className="text-lg md:text-2xl leading-relaxed text-foreground font-medium italic whitespace-pre-wrap">
                  "{message}"
                </p>
                
                <div className="mt-12">
                   <Button 
                    variant="ghost" 
                    onClick={() => {
                      setStage(2);
                      playSound('click', 0.4);
                    }} 
                    className="text-muted-foreground hover:text-primary hover:bg-transparent transition-all animate-pulse"
                    data-testid="btn-continue"
                  >
                    Continue <Heart className="w-4 h-4 ml-2 fill-current" />
                  </Button>
                </div>
              </motion.div>
            </CardContentWrapper>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
             key="pre-question"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0, filter: "blur(20px)" }}
             transition={{ duration: 1 }}
             className="text-center z-10 px-4"
          >
             <motion.h2 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
              className="text-3xl md:text-5xl font-serif text-foreground/80 leading-tight"
             >
               There is one question<br/>I've been wanting to ask...
             </motion.h2>
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-center z-10 w-full max-w-2xl px-4"
          >
             <div className="mb-8">
               <motion.div 
                 animate={{ 
                   scale: [1, 1.1, 1],
                   rotate: [0, 5, -5, 0]
                 }}
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="inline-block"
               >
                 <Heart className="w-24 h-24 md:w-32 md:h-32 text-primary fill-primary drop-shadow-2xl mx-auto" />
               </motion.div>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-script text-foreground mb-12 leading-tight drop-shadow-lg">
               Will you marry me?
             </h1>

             <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-8 relative min-h-[100px]">
               <motion.button
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.95 }}
                 className="px-12 py-4 bg-primary text-white text-xl md:text-2xl rounded-full shadow-xl shadow-primary/30 font-medium hover:bg-primary/90 transition-colors z-20"
                 onClick={() => {
                   handleYes();
                   playSound('triumphant_love', 0.7);
                 }}
                 data-testid="btn-yes"
               >
                 Yes, Forever!
               </motion.button>

               <motion.button
                 animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 onHoverStart={handleNoHover}
                 className="px-8 py-3 bg-white/50 text-muted-foreground text-lg rounded-full hover:bg-white/80 transition-colors backdrop-blur-sm z-10"
                 data-testid="btn-no"
               >
                 No
               </motion.button>
             </div>
          </motion.div>
        )}

        {stage === 4 && (
          <motion.div
            key="accepted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-10 px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <h1 className="text-6xl md:text-9xl font-script text-gradient-gold drop-shadow-sm mb-4 p-4">
                She Said Yes!
              </h1>
              <p className="text-2xl md:text-3xl font-serif text-foreground/80 mt-4">
                Let the adventure begin.
              </p>
              
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                 <p className="text-sm text-muted-foreground uppercase tracking-widest font-sans">
                   {format(new Date(), 'MMMM d, yyyy')}
                 </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CardContentWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white/40 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg border border-white/50 relative overflow-hidden mx-4">
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
     {children}
  </div>
);