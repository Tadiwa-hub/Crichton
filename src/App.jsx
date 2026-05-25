import React, { useState, useEffect, useRef } from 'react';
import { motion, animate, AnimatePresence, useScroll, useTransform, useInView, useMotionValue } from 'framer-motion';
import { 
  Home, 
  Bed, 
  Coffee, 
  Calendar, 
  MapPin, 
  Wifi, 
  Zap, 
  Trees, 
  Flame, 
  Utensils, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  Wine
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from 'date-fns';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const baseUrl = import.meta.env.BASE_URL || "/";
const asset = (path) => `${baseUrl}${path}`;

const roomUIConfig = {
  "Sanyati": {
    image: "/sanyati/room.jpg",
    features: ["Private ensuite bathroom", "Spacious and warmly appointed", "Executive level comfort"],
    type: "Executive Level Comfort"
  },
  "Pungwe": {
    image: "/pungwe/room.jpg",
    features: ["Private ensuite bathroom", "Comfortable and elegant", "Perfect for solo or couple stays"],
    type: "Perfect for Solo or Couple Stays"
  },
  "Odzi": {
    image: "/odzi/room.jpg",
    features: ["Shares bathroom with one other room", "Warmly appointed", "Great value"],
    type: "Warmly Appointed"
  },
  "Gwayi": {
    image: "/gwayi/room.jpg",
    features: ["Shares bathroom with one other room", "Comfortable and cosy", "Great value"],
    type: "Comfortable and Cosy"
  },
  "Self Catering": {
    image: "/self-catering/sc1.jpg",
    features: ["Fully equipped kitchenette", "Private entrance", "Beautiful garden views", "Perfect for long stays"],
    type: "Private and Independent"
  },
  "Full House": {
    image: "/sanyati/full-house.jpg",
    features: ["Entire property exclusively yours", "Perfect for families or groups", "All amenities included"],
    type: "Exclusively Yours"
  }
};

const WhatsAppIcon = ({ className }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// --- Components ---

const CalendarInput = React.forwardRef(({ onClick, startDate, endDate }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory text-left focus:border-gold outline-none transition-all"
  >
    {startDate ? (
      `${format(startDate, 'MMM dd, yyyy')} - ${endDate ? format(endDate, 'MMM dd, yyyy') : 'Select End Date'}`
    ) : (
      "Click to choose your dates"
    )}
  </button>
));

const StatItem = ({ value, label, suffix = "" }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const animation = animate(count, value, { duration: 2, ease: "easeOut" });
      return animation.stop;
    }
  }, [inView, value, count]);

  return (
    <div ref={ref} className="text-center">
      <motion.div 
        className="text-4xl md:text-5xl font-cormorant font-bold text-gold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
      >
        <motion.span>{rounded}</motion.span>{suffix}
      </motion.div>
      <div className="text-ivory/80 uppercase tracking-widest text-xs font-medium">{label}</div>
    </div>
  );
};

const SectionHeading = ({ title, subtitle, light = false }) => (
  <div className="text-center mb-16">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("text-4xl md:text-5xl font-cormorant mb-4", light ? "text-ivory" : "text-forest")}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn("text-sm uppercase tracking-[0.3em] font-medium opacity-70", light ? "text-ivory" : "text-earth")}
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 60 }}
      viewport={{ once: true }}
      className="h-[1px] bg-gold mx-auto mt-6"
    />
  </div>
);

const RoomCard = ({ room, index, onBook }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        ease: [0.215, 0.61, 0.355, 1],
      }}
      className={cn(
        "flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 last:mb-0 bg-white/40 p-4 md:p-6 rounded-[1.5rem] border border-gold/20 backdrop-blur-sm shadow-[0_0_30px_rgba(201,168,76,0.1)] hover:shadow-[0_0_40px_rgba(201,168,76,0.2)] transition-all duration-500",
        !isEven && "md:flex-row-reverse"
      )}
    >
      <div className="w-full md:w-5/12 overflow-hidden rounded-xl group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[16/10] md:aspect-[16/11]"
        >
          <motion.img 
            src={room.image} 
            alt={room.name} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-forest/5 group-hover:bg-transparent transition-colors duration-500" />
        </motion.div>
      </div>
      
      <div className="w-full md:w-7/12 px-4 md:px-6 py-2">
        <div className="max-w-md mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-xl md:text-2xl font-cormorant text-forest">{room.name}</h3>
            </div>
            <p className="text-gold font-medium mb-3 tracking-widest uppercase text-[9px]">{room.type}</p>
            <p className="text-lg font-cormorant text-earth mb-4">USD {room.price} <span className="text-xs font-inter text-forest/60">/ night</span></p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mb-6">
              {(room.features || []).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-forest/80 italic font-cormorant text-sm">
                  <span className="w-1 h-1 bg-gold rounded-full shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => onBook(room.id)} 
              className="inline-block btn-primary group relative overflow-hidden text-sm py-2 px-8"
            >
              <span className="relative z-10">Book {room.name.split(' ~ ')[0]}</span>
              <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [dbRooms, setDbRooms] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          fetch('/api/rooms'),
          fetch('/api/bookings')
        ]);
        
        if (roomsRes.ok) {
          const data = await roomsRes.json();
          setDbRooms(Array.isArray(data) ? data : []);
        }
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const nextSlide = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [dustParticles] = useState(() => 
    [...Array(20)].map(() => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
      duration: 5 + Math.random() * 5,
      yOffset: Math.random() * -100
    }))
  );

  const rooms = (dbRooms || []).map(room => {
    // Normalize ID for robust matching
    const normalizedId = room.id ? room.id.trim().toLowerCase() : "";
    
    let config = roomUIConfig[room.id];
    if (!config && normalizedId.includes("self")) config = roomUIConfig["Self Catering"];
    if (!config && normalizedId.includes("sanyati")) config = roomUIConfig["Sanyati"];
    if (!config && normalizedId.includes("pungwe")) config = roomUIConfig["Pungwe"];
    if (!config && normalizedId.includes("odzi")) config = roomUIConfig["Odzi"];
    if (!config && normalizedId.includes("gwayi")) config = roomUIConfig["Gwayi"];
    if (!config && normalizedId.includes("full")) config = roomUIConfig["Full House"];
    
    return {
      ...room,
      price: normalizedId.includes("sanyati") ? "65" : normalizedId.includes("pungwe") ? "55" : normalizedId.includes("self") ? "50" : normalizedId.includes("full") ? "160" : "45",
      image: config?.image || "/sanyati/room.jpg", // Ultimate fallback
      ...(config || {})
    };
  });

  const isRoomOccupied = (roomId) => {
    const today = new Date().toISOString().split('T')[0];
    return (bookings || []).some(b => {
      // If we are checking the Full House card
      if (roomId === 'Full House') {
        // Full House is occupied if IT is booked OR if ANY room (except Self Catering) is booked
        return (b.room_id === 'Full House' || (b.room_id !== 'Full House' && b.room_id !== 'Self Catering')) && 
               today >= b.check_in && today < b.check_out;
      }
      
      // If we are checking the Self Catering card
      if (roomId === 'Self Catering') {
        return b.room_id === 'Self Catering' && today >= b.check_in && today < b.check_out;
      }

      // If we are checking an individual room (Sanyati, Pungwe, etc.)
      // It is occupied if IT is booked OR if the Full House is booked
      return (b.room_id === roomId || b.room_id === 'Full House') && 
             today >= b.check_in && today < b.check_out;
    });
  };

  const amenities = [
    { icon: <Trees className="w-6 h-6" />, label: "Lush Garden with Gazebo" },
    { icon: <Flame className="w-6 h-6" />, label: "Braai Facilities" },
    { icon: <Wifi className="w-6 h-6" />, label: "High-Speed Fibre WiFi" },
    { icon: <Zap className="w-6 h-6" />, label: "Reliable Power & Water" },
    { icon: <div className="font-bold text-lg">🎱</div>, label: "Games Lounge (Pool & Snooker)" },
    { icon: <Coffee className="w-6 h-6" />, label: "Two Comfortable Lounges" },
    { icon: <Utensils className="w-6 h-6" />, label: "Fully Equipped Kitchen" },
    { icon: <Wine className="w-6 h-6" />, label: "Optional Breakfast & Light Meals" },
    { icon: <Star className="w-6 h-6" />, label: "Personalised Service" },
    { icon: <MapPin className="w-6 h-6" />, label: "Marlborough, Harare" },
  ];

  const testimonials = [
    {
      text: "I had a great stay and you were so understanding that's why I chose you again. Remember the room we said we are coming back to how much is that one ?",
      author: "Darren M.",
      location: "Zimbabwe"
    },
    {
      text: "I loved the stay and we are coming back again. You went out if your way to help us feel comfortable and your hospitality is top notch. The home itself is cozy. And to that I say thank you.",
      author: "Brendon N.",
      location: "Zimbabwe"
    },
    {
      text: "We truly had a wonderful stay at your lodge. The hospitality, comfort, and overall atmosphere were excellent, and we really enjoyed our time there. Thank you again for making our stay memorable. We'll definitely recommend your lodge to others and would love to visit again in the future.",
      author: "Raising L.",
      location: "Zimbabwe"
    },
    {
      text: "I wanted to take a moment to express my heartfelt thanks for the warm hospitality you showed us during our recent stay at your beautiful BNB in Harare. The kids and I had an amazing time, and we truly felt at home. I'd be more than happy to recommend your place to colleagues and friends looking for accommodation in Harare. Your BNB is lovely, and I'm sure they'll appreciate the care and attention you put into making guests feel welcome. Thank you again for making our stay so special. I'll be sure to spread the word!",
      author: "W.S. Academy",
      location: "Harare"
    },
    {
      text: "Great spot for a family vacation. A clean place even the rooms, they are well kept. A quite and peaceful place. The bed was comfortable. The host was friendly and responsive. The Wifi was good. We were given good food, it was well good. I enjoyed the stay.",
      author: "The Mlauzi's",
      location: "Zimbabwe"
    }
  ];

  const galleryImages = [
    "/images/hero.jpg",
    "/images/garden.jpg",
    "/images/lounge.jpg",
    "/images/experience.jpg",
    "/pungwe/room.jpg",
    "/sanyati/room.jpg",
    "/sanyati/full-house.jpg",
    "/gwayi/room.jpg",
    "/odzi/room.jpg",
    "/self-catering/sc1.jpg",
    "/self-catering/sc2.jpg",
    "/self-catering/sc3.jpg",
    "/self-catering/sc4.jpg",
    "/self-catering/sc5.jpg"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    room: 'Sanyati',
    checkIn: '',
    checkOut: '',
    guests: '1',
    source: 'Google Search',
    requests: ''
  });

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select your stay dates on the calendar.");
      return;
    }

    const checkInStr = format(startDate, 'yyyy-MM-dd');
    const checkOutStr = format(endDate, 'yyyy-MM-dd');

    // 1. Automatically save to D1 Database
    try {
      const saveResponse = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: formData.room,
          check_in: checkInStr,
          check_out: checkOutStr
        })
      });
      
      if (saveResponse.ok) {
        // Refresh local bookings state to show the update immediately
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      }
    } catch (err) {
      console.error("Failed to auto-save booking:", err);
    }

    // 2. Open WhatsApp as usual
    const message = `Hello! I'd like to book ${formData.room} at Crichton Cottage.
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Location:* ${formData.location}
*Check-in:* ${checkInStr}
*Check-out:* ${checkOutStr}
*Guests:* ${formData.guests}
*How did you hear:* ${formData.source}
*Special requests:* ${formData.requests || 'None'}`;
    
    const whatsappUrl = `https://wa.me/263717089945?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const selectRoom = (roomId) => {
    setFormData(prev => ({ ...prev, room: roomId }));
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (datePickerRef.current) {
        datePickerRef.current.setOpen(true);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-6 md:px-12",
          isScrolled ? "bg-ivory shadow-md" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className={cn(
              "text-2xl md:text-3xl font-cormorant font-bold transition-colors duration-500",
              isScrolled ? "text-forest" : "text-ivory"
            )}>
              CRICHTON COTTAGE
            </h1>
            <div className="h-[1px] w-full bg-gold/50 mt-1" />
          </div>

          <div className="hidden md:flex items-center gap-12 text-sm font-medium tracking-widest uppercase">
            {['Home', 'Rooms', 'Amenities', 'Experience', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={cn(
                  "relative group transition-colors duration-500",
                  isScrolled ? "text-forest/80 hover:text-forest" : "text-ivory/80 hover:text-ivory"
                )}
              >
                {item}
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all group-hover:w-full"
                />
              </a>
            ))}
            <a href="#book" className="btn-gold py-2 px-6 text-xs">Book Now</a>
          </div>

          <button className="md:hidden text-gold" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-forest">
        <motion.div 
          animate={{ scale: [1, 1.05] }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut" 
          }}
          style={{ scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={asset("images/hero.jpg")} 
            alt="Crichton Cottage Property" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-forest/40" />
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center text-ivory px-4"
        >
          <div className="overflow-hidden mb-4">
            <motion.h1 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-5xl md:text-8xl font-cormorant font-bold uppercase tracking-tighter"
            >
              {"CRICHTON COTTAGE".split(" ").map((word, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </div>
          
          <motion.p 
            className="text-xl md:text-2xl font-cormorant italic mb-4"
          >
            {"Your Home Away From Home".split(" ").map((word, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
          
          <motion.p 
            className="text-gold font-medium tracking-[0.4em] uppercase text-xs mb-12"
          >
            {"Marlborough, Harare".split(" ").map((word, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 + i * 0.1 }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <a href="#rooms" className="btn-primary group relative overflow-hidden min-w-[200px]">
              <span className="relative z-10">Explore Rooms</span>
              <div className="absolute inset-0 shimmer-bg opacity-20 group-hover:opacity-40 transition-opacity" />
            </a>
            <a href="#book" className="btn-gold border-ivory text-ivory hover:bg-ivory hover:text-forest min-w-[200px] relative overflow-hidden group">
              <span className="relative z-10">Booking Request</span>
              <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-10 transition-opacity" />
            </a>
          </motion.div>
        </motion.div>

        {/* Floating Dust Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {dustParticles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold/30 rounded-full"
              initial={{ 
                x: p.x, 
                y: p.y,
                opacity: 0 
              }}
              animate={{ 
                y: [null, p.yOffset],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: p.duration, 
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </section>

      {/* Introduction */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={asset("images/intro.jpg")} 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="Property Background"
          />
          <div className="absolute inset-0 bg-ivory/90" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center px-6"
        >
          <div className="flex justify-center items-center gap-6 mb-12">
            <div className="h-[1px] w-16 bg-gold/50" />
            <Star className="text-gold w-6 h-6" />
            <div className="h-[1px] w-16 bg-gold/50" />
          </div>
          <h2 className="text-3xl md:text-5xl font-cormorant text-forest leading-[1.4] tracking-tight">
            Tucked away in Harare's leafy Marlborough suburb, a warm welcoming retreat for both leisure and business travellers.
          </h2>
          <div className="mt-12 flex justify-center">
            <div className="h-20 w-[1px] bg-gold/30" />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={asset("sanyati/stats.jpg")} 
            className="w-full h-full object-cover"
            alt="Stats Background"
          />
          <div className="absolute inset-0 bg-forest/80 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-18">
          <StatItem value={5} label="Bedrooms" />
          <StatItem value={2} label="Lounges" />
          <StatItem value={1} label="Games Lounge" />
          <StatItem value={1} label="Garden Cottage" />
          <StatItem value={0} label="Commission" suffix="%" />
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-32 bg-ivory/30">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading title="Our Rooms" subtitle="Named after Zimbabwe's great rivers" />
          
          <div className="px-6">
            <div className="bg-earth/5 border border-gold/20 p-4 mb-16 text-center max-w-sm mx-auto">
              <p className="text-earth font-medium uppercase tracking-widest text-xs">Minimum Stay: 2 Nights</p>
            </div>
            
            {rooms.map((room, index) => (
              <RoomCard 
                key={index} 
                room={room} 
                index={index} 
                onBook={selectRoom} 
                isOccupied={isRoomOccupied(room.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The Experience */}
      <section id="experience" className="relative py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={asset("images/experience.jpg")} 
            alt="Garden" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-forest/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-cormorant text-ivory font-bold mb-8 uppercase tracking-tighter">
              Evenings Under The Zimbabwean Sky
            </h2>
            <p className="text-xl md:text-2xl font-cormorant italic text-ivory/90 leading-relaxed mb-12">
              Our lush tropical garden and elegant gazebo provide the perfect backdrop for tranquil evenings. Whether you're enjoying a traditional braai or simply relaxing with a book, the Zimbabwean air is best enjoyed at Crichton Cottage.
            </p>
            <a href="#gallery" className="btn-gold border-ivory text-ivory">View Gallery</a>
          </motion.div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-32 bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Premium Amenities" subtitle="Everything you need for a comfortable stay" />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {amenities.map((item, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="flex flex-col items-center text-center p-8 bg-white/50 border border-gold/10 hover:border-gold/30 hover:bg-white transition-all duration-300 group"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-gold mb-4 p-4 rounded-full bg-ivory group-hover:bg-gold group-hover:text-ivory transition-colors duration-300"
                >
                  {item.icon}
                </motion.div>
                <h4 className="text-forest font-medium text-sm uppercase tracking-wider">{item.label}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Direct Booking Advantage */}
      <section className="py-32 bg-forest overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Direct Booking Advantage" subtitle="Why book with us directly" light />
          
          <div className="grid md:grid-cols-2 gap-12 relative">
            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gold/20" />

            {/* Others */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8 p-8 md:p-12"
            >
              <h3 className="text-2xl font-cormorant text-ivory/60 mb-8">Booking.com / Airbnb</h3>
              {[
                "15-20% commission taken",
                "Platform controls your listing",
                "Delayed payments",
                "Rigid cancellation policies"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-ivory/40">
                  <XCircle className="w-5 h-5 text-red-400/50" />
                  <span className="font-inter line-through">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* Direct */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8 p-8 md:p-12 bg-ivory/5 border border-gold/20"
            >
              <h3 className="text-2xl font-cormorant text-gold mb-8">Crichton Cottage Direct</h3>
              {[
                "0% commission — full rate kept",
                "Direct communication with host",
                "Instant WhatsApp confirmation",
                "Personal touch guaranteed"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-ivory">
                  <CheckCircle2 className="w-5 h-5 text-gold" />
                  <span className="font-inter font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How To Book */}
      <section className="py-32 bg-ivory">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading title="How to Book" subtitle="3 Simple Steps" />
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Calendar className="w-8 h-8" />, title: "Choose Room", text: "Select your preferred room and travel dates." },
              { icon: <MessageCircle className="w-8 h-8" />, title: "Send Request", text: "Submit our simple booking form via WhatsApp." },
              { icon: <CheckCircle2 className="w-8 h-8" />, title: "Confirmation", text: "Receive personal confirmation from your host." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="text-gold mb-6 flex justify-center">{step.icon}</div>
                <h4 className="text-xl font-cormorant text-forest mb-4 uppercase tracking-widest">{i+1}. {step.title}</h4>
                <p className="text-forest/70 font-inter text-sm">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={asset("pungwe/room.jpg")} 
            className="w-full h-full object-cover"
            alt="Booking Background"
          />
          <div className="absolute inset-0 bg-forest/90 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-ivory/[0.03] border border-gold/10 p-6 md:p-16 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-md">
            <h2 className="text-3xl md:text-5xl font-cormorant mb-4 text-center text-ivory">Reserve Your Stay</h2>
            <p className="text-gold font-medium uppercase tracking-[0.3em] text-[9px] text-center mb-10 md:mb-16">Personalised Booking Experience</p>
            
            <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
              {/* Form fields remain same but with more premium styling */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory focus:border-gold outline-none transition-all placeholder:text-ivory/20"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory focus:border-gold outline-none transition-all placeholder:text-ivory/20"
                  placeholder="+263..."
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory focus:border-gold outline-none transition-all placeholder:text-ivory/20"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">Where are you coming from?</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory focus:border-gold outline-none transition-all placeholder:text-ivory/20"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">Room Preference</label>
                <select 
                  className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory focus:border-gold outline-none transition-all appearance-none"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                >
                  <option className="bg-forest" value="Sanyati">Sanyati ~ Executive Ensuite</option>
                  <option className="bg-forest" value="Pungwe">Pungwe ~ Standard Ensuite</option>
                  <option className="bg-forest" value="Odzi">Odzi ~ Shared Bathroom</option>
                  <option className="bg-forest" value="Gwayi">Gwayi ~ Shared Bathroom</option>
                  <option className="bg-forest" value="Self Catering">Self Catering ~ Garden Cottage</option>
                  <option className="bg-forest" value="Full House">Full House ~ All Four Rooms</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">Select Your Stay Dates (Click to open Calendar)</label>
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(dates) => {
                      const [start, end] = dates;
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    minDate={new Date()}
                    excludeDateIntervals={
                      (() => {
                        let filtered = bookings.filter(b => b.room_id === formData.room);
                        
                        // If booking Full House, block all individual room bookings too
                        if (formData.room === 'Full House') {
                          const allRoomBookings = bookings.filter(b => b.room_id !== 'Full House');
                          filtered = [...filtered, ...allRoomBookings];
                        }
                        // If booking individual room, also block Full House bookings
                        else if (formData.room !== 'Self Catering') {
                          const fullHouseBookings = bookings.filter(b => b.room_id === 'Full House');
                          filtered = [...filtered, ...fullHouseBookings];
                        }
                        
                        return filtered.map(b => ({
                          start: parseISO(b.check_in),
                          end: parseISO(b.check_out)
                        }));
                      })()
                    }
                    ref={datePickerRef}
                    customInput={
                      <CalendarInput startDate={startDate} endDate={endDate} />
                    }
                    calendarClassName="premium-calendar"
                    monthsShown={window.innerWidth > 768 ? 2 : 1}
                    popperPlacement="bottom-start"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">Number of Guests</label>
                <select 
                  className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory focus:border-gold outline-none transition-all"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                >
                  {[1,2].map(n => <option key={n} value={n} className="bg-forest">{n}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">How did you hear about us?</label>
                <select 
                  className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory focus:border-gold outline-none transition-all"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                >
                  <option className="bg-forest">Google Search</option>
                  <option className="bg-forest">Booking.com</option>
                  <option className="bg-forest">Airbnb</option>
                  <option className="bg-forest">WhatsApp</option>
                  <option className="bg-forest">Referred by friend</option>
                  <option className="bg-forest">Other</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">Special Requirements</label>
                <textarea 
                  className="w-full bg-transparent border-b border-ivory/20 py-3 text-ivory focus:border-gold outline-none transition-all"
                  rows={2}
                  placeholder="Any special requests..."
                  value={formData.requests}
                  onChange={(e) => setFormData({...formData, requests: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2 flex flex-col items-center gap-6 md:gap-10 mt-8 md:mt-12">
                <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-ivory/40 font-medium text-center">
                  <span>Check-in: 3:00 PM</span>
                  <span>Check-out: 10:00 AM</span>
                </div>
                
                <button type="submit" className="w-full md:w-auto btn-gold px-12 md:px-24 py-4 md:py-5 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center gap-4 text-ivory">
                    SEND BOOKING REQUEST <WhatsAppIcon className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 shimmer-bg opacity-20 group-hover:opacity-40 transition-opacity" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Gallery Carousel */}
      <section id="gallery" className="py-32 bg-forest overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Property Gallery" subtitle="A Glimpse Into Luxury" light />
          
          <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGalleryIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={galleryImages[currentGalleryIndex]} 
                  alt={`Gallery ${currentGalleryIndex}`} 
                  className="w-full h-full object-cover rounded-3xl shadow-2xl border border-gold/20"
                />
                <div className="absolute inset-0 bg-forest/20 rounded-3xl" />
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute inset-x-4 flex justify-between items-center pointer-events-none">
              <button 
                onClick={prevSlide}
                className="p-4 rounded-full bg-ivory/10 hover:bg-ivory/20 text-ivory backdrop-blur-md transition-all pointer-events-auto border border-ivory/20 group"
              >
                <ChevronRight className="w-8 h-8 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={nextSlide}
                className="p-4 rounded-full bg-ivory/10 hover:bg-ivory/20 text-ivory backdrop-blur-md transition-all pointer-events-auto border border-ivory/20 group"
              >
                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 flex gap-2 pointer-events-auto">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentGalleryIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === currentGalleryIndex ? "w-8 bg-gold" : "bg-ivory/30"
                  )}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-ivory/40 text-sm font-cormorant italic">
              Slide to explore our gardens, lounges, and premium rooms
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={asset("images/lounge.jpg")} 
            className="w-full h-full object-cover"
            alt="Testimonials Background"
          />
          <div className="absolute inset-0 bg-ivory/95 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionHeading title="Guest Reviews" subtitle="Kind words from our guests" />
          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-10 rounded-2xl shadow-sm border border-gold/5 relative group hover:shadow-xl transition-all duration-500"
              >
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-gold text-gold" />)}
                </div>
                <p className="text-xl font-cormorant text-forest mb-8 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-[1px] bg-gold/50" />
                  <div>
                    <h4 className="font-semibold text-forest uppercase tracking-widest text-[10px]">{t.author}</h4>
                    <p className="text-earth/60 text-[9px] uppercase tracking-widest">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="contact" className="relative py-32 overflow-hidden bg-forest/5">
        <div className="absolute inset-0">
          <img 
            src={asset("images/garden.jpg")} 
            className="w-full h-full object-cover opacity-10 grayscale"
            alt="Location Map Background"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-cormorant text-forest mb-8 leading-tight">Marlborough, Harare</h2>
            <p className="text-xl font-cormorant text-forest/70 mb-12 leading-relaxed">
              Tucked away in a leafy suburb, providing easy access to the CBD and Airport while maintaining a peaceful atmosphere.
            </p>
            <div className="space-y-8">
              {[
                { icon: <MapPin className="w-5 h-5" />, text: "Marlborough, Harare, Zimbabwe" },
                { icon: <Phone className="w-5 h-5" />, text: "+263 71 708 9945" },
                { icon: <WhatsAppIcon className="w-5 h-5" />, text: "Direct WhatsApp Booking" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="p-3 rounded-full bg-gold/10 text-gold group-hover:bg-gold group-hover:text-ivory transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium tracking-widest text-forest uppercase">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-gold/20"
          >
            <div className="absolute inset-0 grayscale opacity-40">
              <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800" alt="Map" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-forest/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-forest flex items-center justify-center mx-auto mb-6 rounded-full shadow-[0_0_40px_rgba(25,67,50,0.4)] border border-gold/30">
                  <MapPin className="text-gold w-8 h-8" />
                </div>
                <h3 className="font-cormorant text-2xl text-ivory uppercase tracking-[0.3em]">VISIT US</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest text-ivory py-24 px-6 border-t border-gold/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-gold mb-4">CRICHTON COTTAGE</h2>
          <p className="text-ivory/60 uppercase tracking-[0.4em] text-[10px] mb-12">Your Home Away From Home</p>
          
          <div className="flex gap-8 mb-16 text-[10px] uppercase tracking-widest font-medium opacity-40">
            <span>Marlborough, Harare</span>
            <span>|</span>
            <span>Check-in: 3:00 PM</span>
            <span>|</span>
            <span>Check-out: 10:00 AM</span>
          </div>
          
          <a href="#book" className="btn-gold px-12 py-4 mb-24">Book Your Escape</a>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-ivory/5">
            <p className="text-[10px] uppercase tracking-widest text-ivory/40">© 2024 Crichton Cottage. All Rights Reserved.</p>
            <p className="text-[10px] uppercase tracking-widest text-ivory/20 font-inter">Site by Tadiwa</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-gold/20 flex justify-around items-center py-4 px-6">
        <a href="#home" className="flex flex-col items-center gap-1 text-forest/60 hover:text-gold transition-colors">
          <Home className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-tighter">Home</span>
        </a>
        <a href="#rooms" className="flex flex-col items-center gap-1 text-forest/60 hover:text-gold transition-colors">
          <Bed className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-tighter">Rooms</span>
        </a>
        <a href="#amenities" className="flex flex-col items-center gap-1 text-forest/60 hover:text-gold transition-colors">
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-tighter">Stay</span>
        </a>
        <a href="#book" className="flex flex-col items-center gap-1 text-gold">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-tighter font-bold">Book</span>
        </a>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.a
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(25, 67, 50, 0.4)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        href="https://wa.me/263717089945"
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
      >
        <WhatsAppIcon className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <div className="absolute inset-0 rounded-full shimmer-bg opacity-20 pointer-events-none" />
      </motion.a>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-forest flex flex-col items-center justify-center"
          >
            <button className="absolute top-8 right-8 text-gold" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-10 h-10" />
            </button>
            <div className="flex flex-col gap-8 text-center">
              {['Home', 'Rooms', 'Amenities', 'Experience', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-4xl font-cormorant text-ivory hover:text-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a 
                href="#book" 
                className="btn-gold mt-8"
                onClick={() => setMobileMenuOpen(false)}
              >
                Booking Request
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
