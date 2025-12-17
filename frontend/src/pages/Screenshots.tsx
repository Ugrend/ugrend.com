import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import type { LayoutContextType } from '../components/Layout';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Screenshot {
    filename: string;
    title: string;
    extra: string;
    date: string;
}

const Screenshots: React.FC = () => {
    const { setFooterVisible } = useOutletContext<LayoutContextType>();
    const [images, setImages] = useState<Screenshot[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null);

    // Fetch images
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/screenshots/');
                if (res.ok) {
                    const data = await res.json();
                    setImages(data);
                }
            } catch (e) {
                console.error("Failed to fetch screenshots", e);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    // Handle footer visibility & keyboard nav
    useEffect(() => {
        // Hide footer when previewing
        setFooterVisible(!selectedImage);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImage) {
                if (e.key === 'Escape') setSelectedImage(null);
            } else {
                if (e.key === 'ArrowLeft') prevSlide();
                if (e.key === 'ArrowRight') nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            // Ensure footer is visible when unmounting or changing state
            setFooterVisible(true);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage, setFooterVisible]);


    const nextSlide = () => {
        if (images.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        if (images.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getCircularIndex = (idx: number) => {
        const len = images.length;
        if (len === 0) return 0;
        return ((idx % len) + len) % len;
    };

    if (loading) return <div style={{ color: '#fff', padding: '2rem' }}>Loading screenshots...</div>;
    if (images.length === 0) return <div style={{ color: '#fff', padding: '2rem' }}>No screenshots found.</div>;

    const mainImage = images[currentIndex];
    const prevImage = images[getCircularIndex(currentIndex - 1)];
    const nextImage = images[getCircularIndex(currentIndex + 1)];

    return (
        <div style={{
            position: 'relative',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            overflow: 'hidden',
            marginTop: '2rem'
        }}>
            {/* Carousel Container */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '120%',
                height: 'auto',
                minHeight: '600px',
                gap: '1vw',
                marginBottom: '2rem'
            }}>
                <style>
                    {`
                    /* No hiding logic to ensure visibility */
                    `}
                </style>

                {/* Left Image (Flex Item) */}
                <motion.div
                    key={`prev-${prevImage.filename}-${currentIndex}`}
                    className="side-image"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.8, scale: 0.85 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'relative',
                        cursor: 'pointer',
                        filter: 'brightness(0.6)',
                        width: '400px',
                        height: '400px',
                        aspectRatio: '3/2',
                        zIndex: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '16px',
                        right: '-200px'
                    }}
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                >
                    <img
                        src={`/assets/imgs/screenshots/${prevImage.filename}`}
                        alt="Previous"
                        style={{
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </motion.div>

                {/* Main Image (Center Flex Item) */}
                <motion.div
                    key={currentIndex}
                    // layoutId removed
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        position: 'relative',
                        cursor: 'zoom-in',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '70vw', // Massive width (was 50vw)
                        height: '600px', // Fixed height for consistency
                        zIndex: 10
                    }}
                    onClick={() => setSelectedImage(mainImage)}
                >
                    <img
                        src={`/assets/imgs/screenshots/${mainImage.filename}`}
                        alt={mainImage.title}
                        style={{
                            borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                        }}
                    />

                    {/* Arrows (Absolute relative to Main Image container) */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '20px',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '50%',
                        display: 'flex',
                        zIndex: 30,
                        transition: 'background 0.2s'
                    }}
                        className="arrow-btn"
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
                        <ChevronLeft size={32} />
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        right: '20px',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        padding: '12px',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '50%',
                        display: 'flex',
                        zIndex: 30,
                        transition: 'background 0.2s'
                    }}
                        className="arrow-btn"
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
                        <ChevronRight size={32} />
                    </div>
                </motion.div>

                {/* Right Image (Flex Item) - Was missing before */}
                <motion.div
                    key={`next-${nextImage.filename}-${currentIndex}`}
                    className="side-image"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.8, scale: 0.85 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'relative',
                        cursor: 'pointer',
                        filter: 'brightness(0.6)',
                        width: '400px',
                        height: '400px',
                        aspectRatio: '3/2',
                        zIndex: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '16px',
                        left: '-200px'
                    }}
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                >
                    <img
                        src={`/assets/imgs/screenshots/${nextImage.filename}`}
                        alt="Next"
                        style={{
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </motion.div>
            </div>

            {/* Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`info-${currentIndex}`}
                style={{ textAlign: 'center', maxWidth: '600px' }}
            >
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(to right, #fff, #bbb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {mainImage.title || "Untitled"}
                </h2>
                <p style={{
                    color: '#888',
                    fontSize: '1rem',
                    lineHeight: '1.5'
                }}>
                    {mainImage.extra}
                </p>
                <p style={{
                    color: '#555',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem'
                }}>
                    {mainImage.date ? new Date(mainImage.date).toLocaleDateString() : ''}
                </p>
            </motion.div>

            {/* Fullscreen Preview */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.95)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4rem' // Increased padding for easier close
                        }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            // layoutId removed
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={`/assets/imgs/screenshots/${selectedImage.filename}`}
                                alt={selectedImage.title}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    boxShadow: '0 0 50px rgba(0,0,0,1)'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                cursor: 'pointer',
                                color: '#fff',
                                background: 'rgba(255,255,255,0.1)',
                                padding: '8px',
                                borderRadius: '50%'
                            }} onClick={() => setSelectedImage(null)}>
                                <X size={32} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Screenshots;
