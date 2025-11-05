
import React, { useState, useEffect, useRef } from 'react';
import type { Review } from '../types';
import { REVIEWS } from '../constants';
import { UsersIcon } from './icons/UsersIcon';
import { SparkIcon } from './icons/SparkIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { StarIcon } from './icons/StarIcon';

const useInView = (options: IntersectionObserverInit = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { ...options, threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView] as const;
};

const easeOutQuad = (t: number) => t * (2 - t);

const useCountUp = (end: number, duration: number = 2000, startInView: boolean) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!startInView) return;
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = easeOutQuad(progress);
            setCount(Math.floor(easedProgress * end));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration, startInView]);

    return count;
};

const StatCounter: React.FC<{ icon: React.ReactNode; end: number; suffix: string; label: string; isInView: boolean; }> = ({ icon, end, suffix, label, isInView }) => {
    const count = useCountUp(end, 2000, isInView);
    return (
        <div className="text-center">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-4 text-cyan-300 animate-pulse-glow">{icon}</div>
            <p className="text-4xl font-bold">{count.toLocaleString()}{suffix}</p>
            <p className="text-white/60">{label}</p>
        </div>
    );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="flex-shrink-0 w-[300px] h-full p-6 rounded-2xl bg-white/[.04] border border-white/10 backdrop-blur-[10px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20">
        <div>
            <div className="flex items-center mb-4">
                <img src={review.avatar} alt={review.username} className="w-12 h-12 rounded-full border-2 border-purple-400/50 mr-4" />
                <div>
                    <p className="font-bold">{review.username}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />)}
                    </div>
                </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{review.text}</p>
        </div>
    </div>
);

export const TrustSection: React.FC<{ isLoaded: boolean }> = ({ isLoaded }) => {
    const [sectionRef, isInView] = useInView();
    const [reviews, setReviews] = useState<Review[]>(REVIEWS);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        try {
            const savedReviews = localStorage.getItem('genora-user-reviews');
            if (savedReviews) {
                setReviews(prev => [...prev, ...JSON.parse(savedReviews)]);
            }
        } catch (error) {
            console.error("Failed to load user reviews from localStorage", error);
        }
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.length < 10 || rating === 0) {
            alert("Please provide a review and a star rating.");
            return;
        }

        const newReview: Review = {
            avatar: `https://i.pravatar.cc/48?u=${Math.random()}`,
            username: name || 'Anonymous Creator',
            rating,
            text: feedback,
        };

        try {
            const savedReviews = JSON.parse(localStorage.getItem('genora-user-reviews') || '[]');
            const updatedReviews = [...savedReviews, newReview];
            localStorage.setItem('genora-user-reviews', JSON.stringify(updatedReviews));
            setReviews(prev => [...prev, newReview]);
        } catch (error) {
            console.error("Failed to save review to localStorage", error);
        }
        
        setIsSubmitted(true);
        setName('');
        setEmail('');
        setFeedback('');
        setRating(0);

        setTimeout(() => setIsSubmitted(false), 4000);
    };

    return (
        <div ref={sectionRef} className={`py-24 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '700ms' }}>
            <style>
                {`
                @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-scroll { animation: scroll 60s linear infinite; }
                .animate-pulse-glow { animation: pulse-glow 3s infinite ease-in-out; }
                @keyframes pulse-glow { 0%, 100% { filter: drop-shadow(0 0 5px currentColor); } 50% { filter: drop-shadow(0 0 15px currentColor); } }
                `}
            </style>
            
            {/* Trust Counter Section */}
            <div className="text-center mb-20">
                <h2 className="text-3xl font-bold mb-4">Creators around the world trust GENORA to power their ideas.</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <StatCounter icon={<UsersIcon className="w-8 h-8"/>} end={50000} suffix="+" label="Active Users" isInView={isInView} />
                    <StatCounter icon={<SparkIcon className="w-8 h-8"/>} end={1200000} suffix="+" label="Ideas Generated" isInView={isInView} />
                    <StatCounter icon={<GlobeIcon className="w-8 h-8"/>} end={190} suffix="+" label="Countries Reached" isInView={isInView} />
                </div>
            </div>

            {/* User Reviews Section */}
            <div className="relative mb-20">
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0b0b0f] to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0b0b0f] to-transparent z-10"></div>
                <div className="overflow-hidden">
                    <div className="flex gap-8 animate-scroll hover:[animation-play-state:paused]">
                        {[...reviews, ...reviews].map((review, index) => <ReviewCard key={index} review={review} />)}
                    </div>
                </div>
                 <p className="text-center text-sm text-white/40 mt-6">Your feedback keeps GENORA improving every day.</p>
            </div>
            
            {/* Feedback Form Section */}
            <div className="max-w-2xl mx-auto">
                 <h2 className="text-4xl font-bold text-center mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4af3ff] to-[#b667ff]">
                      Share Your Experience 💫
                    </span>
                </h2>
                <p className="text-center text-white/60 mb-8">We love hearing from our users. Tell us how GENORA helps you create!</p>

                {isSubmitted ? (
                     <div className="text-center p-8 bg-white/10 rounded-lg border border-cyan-400/50">
                        <p className="text-2xl font-bold text-cyan-300">✨ Thanks for your feedback!</p>
                        <p className="text-white/80">It means a lot to us.</p>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4 p-8 bg-white/[.04] rounded-2xl border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="text" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/[.05] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                             <input type="email" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/[.05] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                        </div>
                        <textarea placeholder="Your review..." value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} className="w-full bg-white/[.05] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400" required></textarea>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-white/60">Your Rating:</span>
                            <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                                            (hoverRating || rating) > i ? 'text-yellow-400' : 'text-gray-600'
                                        }`}
                                        onMouseEnter={() => setHoverRating(i + 1)}
                                        onClick={() => setRating(i + 1)}
                                    />
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-[#4af3ff] to-[#b667ff] text-black font-bold py-3 px-4 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">Submit Review</button>
                    </form>
                )}
            </div>
        </div>
    );
};
