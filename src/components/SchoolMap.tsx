import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Phone,
  Mail,
  ExternalLink,
  Edit3,
  Compass,
  Building,
  Layers,
  Sparkles,
  Maximize2,
  Clock,
  Info,
  Radio,
  Zap,
  CheckCircle,
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Map as MapIcon,
} from 'lucide-react';
import { SchoolInfo, User } from '../types';

interface SchoolMapProps {
  schoolInfo: SchoolInfo;
  currentUser: User;
  onUpdateLocation: (updated: Partial<SchoolInfo>) => void;
}

// Campus landmarks within Daniel Maramba National High School
interface CampusLandmark {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  category: 'classroom' | 'gate' | 'lab' | 'admin' | 'sports';
  description: string;
  room: string;
  color: string;
}

const DMNHS_LANDMARKS: CampusLandmark[] = [
  {
    id: 'gate-main',
    name: 'Main Entrance & Gate',
    subtitle: 'Maramba Street / Don Florencio Villanueva St',
    lat: 16.00115,
    lng: 120.3991,
    category: 'gate',
    description: 'Official student and visitor entrance, guardhouse, and vehicle drop-off zone along Maramba Street.',
    room: 'Main Campus Gate 1',
    color: '#059669',
  },
  {
    id: 'bldg-c-ict',
    name: 'Building C — ICT Wing (Rm 304)',
    subtitle: 'Grade 11 - PTP Block 7 Homeroom & CSS Lab',
    lat: 16.00195,
    lng: 120.39985,
    category: 'classroom',
    description: 'Official homeroom of Grade 11 - PTP Block 7 (Adviser: Eliza P. Zarate). Equipped with 45 networked desktop workstations, crimping benches, and CSS test benches.',
    room: 'Room 304 & CSS Computer Lab 2',
    color: '#1d4ed8',
  },
  {
    id: 'scilab-b',
    name: 'Science Laboratory Hall B',
    subtitle: 'General Science Practicum',
    lat: 16.0016,
    lng: 120.39925,
    category: 'lab',
    description: 'Physical science and biological experimentation hall (Instructor: Eduardo F. Rarang, Jr.).',
    room: 'SciLab Hall B',
    color: '#0284c7',
  },
  {
    id: 'math-faculty',
    name: 'Mathematics & Faculty Center',
    subtitle: 'Room 204 & Teacher Consultation',
    lat: 16.00135,
    lng: 120.39965,
    category: 'classroom',
    description: 'General Mathematics classroom (Instructor: Dondon C. Onoza) and faculty consultation desks.',
    room: 'Faculty Center Room 204',
    color: '#7c3aed',
  },
  {
    id: 'admin-registrar',
    name: 'Administration & Registrar Wing',
    subtitle: 'Principal Office & Records Center',
    lat: 16.0012,
    lng: 120.4002,
    category: 'admin',
    description: 'Central school administration, student records, enrollment verification, and guidance counseling.',
    room: 'Administration Building',
    color: '#0f172a',
  },
  {
    id: 'grandstand-oval',
    name: 'School Grandstand & Quadrangle',
    subtitle: 'Athletics & Flag Ceremony Grounds',
    lat: 16.0022,
    lng: 120.4004,
    category: 'sports',
    description: 'Open-air athletic oval, sports complex, and daily morning school assembly quadrangle.',
    room: 'Campus Quadrangle',
    color: '#d97706',
  },
];

// Campus perimeter polygon (derived from OSM Way 820100143)
const CAMPUS_BOUNDS = [
  [16.00045, 120.39867],
  [16.00284, 120.39867],
  [16.00284, 120.40121],
  [16.00045, 120.40121],
] as [number, number][];

export const SchoolMap: React.FC<SchoolMapProps> = ({
  schoolInfo,
  currentUser,
  onUpdateLocation,
}) => {
  // Map View Mode: 'interactive' | 'google' | 'satellite' | 'floorplan'
  const [mapMode, setMapMode] = useState<'interactive' | 'google' | 'satellite' | 'floorplan'>('interactive');
  const [selectedLandmark, setSelectedLandmark] = useState<string>('bldg-c-ict');
  const [selectedFacility, setSelectedFacility] = useState<string>('ict-wing');

  // Admin Update Location Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formAddress, setFormAddress] = useState(schoolInfo.campusAddress);
  const [formLat, setFormLat] = useState(schoolInfo.latitude);
  const [formLng, setFormLng] = useState(schoolInfo.longitude);
  const [formPhone, setFormPhone] = useState(schoolInfo.contactPhone);
  const [formEmail, setFormEmail] = useState(schoolInfo.contactEmail);
  const [formSchoolName, setFormSchoolName] = useState(schoolInfo.schoolName);

  // Leaflet map container reference
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // Digital Campus Facilities for 2D Interactive Floor Plan
  const campusFacilities = [
    {
      id: 'ict-wing',
      name: 'Building C — ICT Wing (3rd Floor)',
      tag: 'Block 7 Homeroom & Lab',
      room: 'Room 304 & CSS Computer Lab 2',
      adviser: 'Eliza P. Zarate',
      color: '#1d4ed8',
      desc: 'Official homeroom of Grade 11 - PTP Block 7. Equipped with 45 networked desktop workstations, cabling bays, and diagnostic repair tools for Computer Systems Servicing.',
      classes: ['Computer Systems Servicing', 'Homeroom Guidance', 'Daily Morning Assembly'],
      floor: '3rd Floor, West Wing',
    },
    {
      id: 'science-lab',
      name: 'Science Laboratory Hall B',
      tag: 'General Science',
      room: 'SciLab 1 & Apparatus Room',
      adviser: 'Eduardo F. Rarang, Jr.',
      color: '#059669',
      desc: 'Dedicated physical science, chemistry, and life science experimental laboratory with safety eye-wash stations, optical microscopes, and chemical fume hoods.',
      classes: ['General Science (Mon/Wed/Fri)', 'Science Investigation Practicum'],
      floor: 'Ground Floor, Building B',
    },
    {
      id: 'math-wing',
      name: 'Mathematics & Faculty Center',
      tag: 'General Mathematics',
      room: 'Faculty Center Room 204',
      adviser: 'Dondon C. Onoza',
      color: '#0284c7',
      desc: 'Lecture hall for business mathematics, functions, rational equations, and afternoon peer tutoring consultation sessions.',
      classes: ['General Mathematics (Mon/Tue/Wed/Thu)', 'Math Olympiad Clinic'],
      floor: '2nd Floor, Main Academic Wing',
    },
    {
      id: 'socsci-wing',
      name: 'Social Sciences & Humanities Pavilion',
      tag: 'Araling Panlipunan',
      room: 'Social Sciences Room 102',
      adviser: 'Marjulyn I. Albarillo',
      color: '#d97706',
      desc: 'Lecture and audiovisual discussion room for Philippine history, sociological development, and research presentation panels.',
      classes: ['Pag-aaral ng Kasaysayan at Lipunang Pilipino (Mon/Wed/Fri)'],
      floor: 'Ground Floor, Rizal Hall',
    },
    {
      id: 'comm-lab',
      name: 'Languages & Audio-Visual Hall',
      tag: 'Communication Arts',
      room: 'Room 105 & CommLab 205',
      adviser: 'Emmanuel L. Cacapit & Shela D. Paragas',
      color: '#dc2626',
      desc: 'Equipped with soundproof speech booths, speech presentation lectern, and multimedia projection for technical report presentations and Filipino debate.',
      classes: ['Effective Communication', 'Mabisang Komunikasyon'],
      floor: '2nd Floor, Mabini Building',
    },
    {
      id: 'career-guidance',
      name: 'Career Guidance & Immersion Office',
      tag: 'Life and Career Skills',
      room: 'Guidance Center Rm 101/103',
      adviser: 'Christian David U. & Christian David U. Andaya',
      color: '#7c3aed',
      desc: 'Interview simulation room, career assessment center, and counseling office for technical track career preparation and internship readiness.',
      classes: ['Life and Career Skills (Tue/Thu/Fri)', 'Workplace Mock Interview'],
      floor: '1st Floor, Student Services Hall',
    },
    {
      id: 'admin-building',
      name: 'Administration & Registrar Wing',
      tag: 'School Management',
      room: 'Registrar Office & Principal Hall',
      adviser: 'Principal / Registrar Admin',
      color: '#0f172a',
      desc: 'Central school administrative offices, student record verification, enrollment processing, and institutional management.',
      classes: ['School ID Clearance', 'Certificates of Enrollment', 'Section Transfers'],
      floor: 'Executive Administration Building',
    },
  ];

  const activeFacility =
    campusFacilities.find((f) => f.id === selectedFacility) || campusFacilities[0];

  const activeLandmark =
    DMNHS_LANDMARKS.find((l) => l.id === selectedLandmark) || DMNHS_LANDMARKS[1];

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (mapMode !== 'interactive') {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      return;
    }

    if (!mapContainerRef.current) return;

    // Destroy existing instance if container changed
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const centerLat = schoolInfo.latitude || 16.00146;
    const centerLng = schoolInfo.longitude || 120.39953;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 17,
      minZoom: 14,
      maxZoom: 19,
      zoomControl: false,
    });

    leafletMapRef.current = map;

    // High performance CartoDB Voyager / OpenStreetMap raster tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // Add zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Campus boundary highlight polygon
    L.polygon(CAMPUS_BOUNDS, {
      color: '#1d4ed8',
      weight: 2,
      dashArray: '5, 8',
      fillColor: '#3b82f6',
      fillOpacity: 0.12,
    })
      .addTo(map)
      .bindTooltip('Daniel Maramba NHS — Official Campus Grounds', {
        permanent: false,
        direction: 'center',
        className: 'font-semibold text-xs text-blue-900',
      });

    // Custom Icon Generator using HTML DivIcon
    const createCustomIcon = (color: string, isMain = false) => {
      const size = isMain ? 38 : 32;
      return L.divIcon({
        className: 'custom-school-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${isMain ? 18 : 14}px;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <span>${isMain ? '🏫' : '📍'}</span>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
      });
    };

    // Add Markers for all DMNHS Landmarks
    DMNHS_LANDMARKS.forEach((lm) => {
      const isBlock7 = lm.id === 'bldg-c-ict';
      const marker = L.marker([lm.lat, lm.lng], {
        icon: createCustomIcon(lm.color, isBlock7),
        title: lm.name,
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 2px; min-width: 220px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f294a; margin-bottom: 2px;">
            ${lm.name}
          </div>
          <div style="font-size: 11px; font-weight: 600; color: ${lm.color}; margin-bottom: 6px;">
            ${lm.subtitle}
          </div>
          <p style="font-size: 11px; color: #4b5563; line-height: 1.4; margin: 0 0 8px 0;">
            ${lm.description}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 6px;">
            <span>Room: <strong>${lm.room}</strong></span>
            <span style="font-family: monospace;">16.00° N, 120.40° E</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedLandmark(lm.id);
      });

      // Open popup for Block 7 homeroom by default
      if (isBlock7) {
        setTimeout(() => {
          marker.openPopup();
        }, 300);
      }
    });

    // Invalidate map size after animation/render completes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [mapMode, schoolInfo.latitude, schoolInfo.longitude]);

  // Focus specific landmark on the Leaflet map
  const handleFocusLandmark = (lm: CampusLandmark) => {
    setSelectedLandmark(lm.id);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([lm.lat, lm.lng], 18, {
        duration: 1.2,
      });
    }
  };

  const handleResetCenter = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo(
        [schoolInfo.latitude || 16.00146, schoolInfo.longitude || 120.39953],
        17,
        { duration: 1 }
      );
    }
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLocation({
      schoolName: formSchoolName,
      campusAddress: formAddress,
      latitude: Number(formLat),
      longitude: Number(formLng),
      contactPhone: formPhone,
      contactEmail: formEmail,
    });
    setModalOpen(false);
  };

  // Official navigation URL directly to Daniel Maramba National High School on Google Maps
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    'Daniel Maramba National High School, Santa Barbara, Pangasinan'
  )}`;

  const wazeUrl = `https://waze.com/ul?ll=${schoolInfo.latitude || 16.00146},${
    schoolInfo.longitude || 120.39953
  }&navigate=yes`;

  const osmUrl = 'https://www.openstreetmap.org/way/820100143';

  // Google Maps Official Embed with search query resolving directly to Daniel Maramba National High School
  const gmapsEmbedQuery = encodeURIComponent(
    'Daniel Maramba National High School, Santa Barbara, Pangasinan'
  );
  const gmapsEmbedUrl = `https://maps.google.com/maps?q=${gmapsEmbedQuery}&t=${
    mapMode === 'satellite' ? 'k' : 'm'
  }&z=17&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f294a] text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/40 text-blue-200 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Digital Interactive Campus Navigation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Daniel Maramba NHS — Campus Map
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm">
              Instant digital interactive map, verified Google Maps location, and 2D facility floor plan for Grade 11 - PTP Block 7.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow cursor-pointer transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Waze App</span>
            </a>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  setFormSchoolName(schoolInfo.schoolName);
                  setFormAddress(schoolInfo.campusAddress);
                  setFormLat(schoolInfo.latitude);
                  setFormLng(schoolInfo.longitude);
                  setFormPhone(schoolInfo.contactPhone);
                  setFormEmail(schoolInfo.contactEmail);
                  setModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Admin: Update Location</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Official Verified Campus Location Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 shadow-2xs flex items-start gap-3">
        <Building className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-blue-950 text-sm">
              Exact School Location:
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Verified Official Campus
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800">
              OSM Way 820100143
            </span>
          </div>
          <p className="text-blue-800 leading-relaxed">
            <strong>{schoolInfo.schoolName}</strong> — {schoolInfo.campusAddress} • Phone:{' '}
            <strong className="font-mono">{schoolInfo.contactPhone}</strong>
          </p>
        </div>
      </div>

      {/* Map Mode Selector */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setMapMode('interactive')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapMode === 'interactive'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Digital Interactive Map</span>
            <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-emerald-500 text-white font-extrabold">
              Fast
            </span>
          </button>
          <button
            onClick={() => setMapMode('google')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapMode === 'google'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Google Maps Live POI</span>
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapMode === 'satellite'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Satellite Aerial View</span>
          </button>
          <button
            onClick={() => setMapMode('floorplan')}
            className={`px-3 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mapMode === 'floorplan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Campus Floor Plan &amp; Wings</span>
          </button>
        </div>

        <div className="flex items-center gap-3 px-3 text-gray-500 font-mono text-[11px]">
          <span>GPS: {schoolInfo.latitude.toFixed(5)}° N, {schoolInfo.longitude.toFixed(5)}° E</span>
        </div>
      </div>

      {/* VIEW MODE 1: DIGITAL INTERACTIVE LEAFLET MAP */}
      {mapMode === 'interactive' && (
        <div className="space-y-4">
          {/* Quick Landmark Focus Pills */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Campus Quick Jump:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {DMNHS_LANDMARKS.map((lm) => (
                <button
                  key={lm.id}
                  onClick={() => handleFocusLandmark(lm)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedLandmark === lm.id
                      ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-2xs'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lm.color }}
                  />
                  <span>{lm.name}</span>
                </button>
              ))}
              <button
                onClick={handleResetCenter}
                className="px-3 py-1.5 rounded-lg font-semibold text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer flex items-center gap-1"
                title="Reset map view to whole campus"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Center Campus</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Interactive Leaflet Map Canvas */}
            <div className="flex-2 bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex flex-col justify-between min-h-[500px]">
              <div className="relative w-full h-[460px] sm:h-[500px] rounded-xl overflow-hidden border border-gray-200 bg-slate-50">
                <div ref={mapContainerRef} className="w-full h-full z-10" />

                {/* Top Overlay Badge */}
                <div className="absolute top-3 left-3 z-20 bg-white/95 px-3 py-1.5 rounded-lg shadow-md border border-gray-200 text-xs font-semibold text-gray-800 backdrop-blur-xs flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Interactive Digital Campus Map • Daniel Maramba NHS</span>
                </div>

                {/* Legend in Bottom Corner */}
                <div className="absolute bottom-3 left-3 z-20 bg-white/95 p-2 rounded-lg shadow-md border border-gray-200 text-[11px] text-gray-700 backdrop-blur-xs hidden sm:block">
                  <div className="font-bold text-gray-900 mb-1">Campus Legend:</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#1d4ed8]"></span>
                      Bldg C (PTP Block 7)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                      Main Entrance Gate
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
                      Science Lab Hall B
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#7c3aed]"></span>
                      Math &amp; Faculty 204
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2 px-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    Maramba Street, Poblacion Norte, Santa Barbara, Pangasinan 2419
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={osmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 flex items-center gap-1 text-[11px]"
                  >
                    <span>View on OpenStreetMap</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <span>Google Maps Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Selected Landmark Detail Card */}
            <div className="flex-1 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-base text-[#0f294a] flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>Selected Campus Location</span>
                  </h3>
                  <span
                    className="px-2.5 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: activeLandmark.color }}
                  >
                    {activeLandmark.category.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Facility Name
                    </span>
                    <h4 className="font-extrabold text-gray-900 text-sm mt-0.5">
                      {activeLandmark.name}
                    </h4>
                    <p className="text-blue-700 font-semibold text-xs">
                      {activeLandmark.subtitle}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Facility Overview
                    </span>
                    <p className="text-gray-700 leading-relaxed bg-blue-50/40 p-3 rounded-lg border border-blue-100">
                      {activeLandmark.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Room &amp; Section Assignment
                    </span>
                    <span className="font-semibold text-gray-800">
                      {activeLandmark.room}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Coordinates:</span>
                      <span className="font-mono font-semibold">
                        {activeLandmark.lat.toFixed(5)}° N, {activeLandmark.lng.toFixed(5)}° E
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>School Phone:</span>
                      <a href={`tel:${schoolInfo.contactPhone}`} className="font-mono font-semibold text-blue-600 hover:underline">
                        {schoolInfo.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleFocusLandmark(activeLandmark)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Zoom In on This Location</span>
                  </button>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-emerald-600" />
                    <span>Get Turn-by-Turn Navigation</span>
                  </a>
                </div>
              </div>

              {/* Quick Switch to Floor Plan */}
              <div
                onClick={() => setMapMode('floorplan')}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 cursor-pointer hover:border-blue-400 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#0f294a] mb-0.5">
                    Looking for Room 304 &amp; CSS Lab?
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    Click to view the 2D Digital Floor Plan &amp; Wings Guide.
                  </p>
                </div>
                <Building className="w-6 h-6 text-blue-600 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2 & 3: GOOGLE MAPS LIVE POI OR SATELLITE AERIAL VIEW */}
      {(mapMode === 'google' || mapMode === 'satellite') && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-2 bg-white rounded-2xl border border-gray-200 shadow-xs p-4 flex flex-col justify-between min-h-[500px]">
            <div className="relative w-full h-[460px] sm:h-[500px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
              <iframe
                title="Daniel Maramba National High School Google Maps"
                src={gmapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="eager"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-lg shadow-md border border-gray-200 text-xs font-semibold text-gray-800 backdrop-blur-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  {mapMode === 'satellite'
                    ? 'Google Satellite Aerial Feed • Daniel Maramba NHS'
                    : 'Google Maps Official School POI • Daniel Maramba NHS'}
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2 px-1">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {schoolInfo.campusAddress}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMapMode('interactive')}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  ← Switch to Fast Digital Interactive Map
                </button>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4">
              <h3 className="font-bold text-base text-[#0f294a] flex items-center gap-2 border-b border-gray-100 pb-3">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Campus Location Details</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Official School Name
                  </span>
                  <span className="font-bold text-gray-800 text-sm">
                    {schoolInfo.schoolName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Physical Campus Address
                  </span>
                  <span className="text-gray-700 leading-relaxed font-medium">
                    {schoolInfo.campusAddress}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Section Homeroom &amp; Lab
                  </span>
                  <span className="text-blue-800 font-semibold">
                    {schoolInfo.roomNumber} &amp; CSS Computer Lab 2
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={`tel:${schoolInfo.contactPhone}`} className="hover:underline font-mono font-semibold">
                      {schoolInfo.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <a href={`mailto:${schoolInfo.contactEmail}`} className="hover:underline font-mono truncate">
                      {schoolInfo.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Live Directions</span>
                </a>
              </div>
            </div>

            {/* Quick Switch */}
            <div
              onClick={() => setMapMode('interactive')}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-4 cursor-pointer hover:border-blue-400 transition-all flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-xs text-[#0f294a] mb-0.5">
                  Want instant loading &amp; landmark pins?
                </h4>
                <p className="text-[11px] text-gray-600">
                  Switch to the vector digital map for instant speed.
                </p>
              </div>
              <MapIcon className="w-6 h-6 text-blue-600 shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 4: INTERACTIVE DIGITAL CAMPUS FLOOR PLAN VIEW */}
      {mapMode === 'floorplan' && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-3">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#0f294a] flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Interactive Campus Wings &amp; Facilities</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Click any building to view classroom details, assigned teachers, and room numbers
              </p>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {campusFacilities.map((fac) => (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedFacility === fac.id
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600/30'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: fac.color }}
                        />
                        <h4 className="font-bold text-xs text-[#0f294a]">
                          {fac.name}
                        </h4>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono pl-4">
                        {fac.room} • {fac.floor}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700 shrink-0">
                      {fac.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: activeFacility.color }}
                  />
                  <h3 className="font-bold text-base text-[#0f294a]">
                    {activeFacility.name}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">
                  {activeFacility.tag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Room Designation:
                  </span>
                  <span className="font-bold text-gray-800 font-mono">
                    {activeFacility.room}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Floor &amp; Wing Location:
                  </span>
                  <span className="font-bold text-gray-800">
                    {activeFacility.floor}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Assigned Teacher / Adviser:
                  </span>
                  <div className="flex items-center gap-2 text-gray-800 font-semibold bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>{activeFacility.adviser}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Facility Specifications &amp; Equipment:
                  </span>
                  <p className="text-gray-700 leading-relaxed bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                    {activeFacility.desc}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Scheduled Classes &amp; Sessions Held Here:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeFacility.classes.map((cls, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-800 border border-gray-200"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Homeroom of <strong>Grade 11 - PTP Block 7</strong>
              </span>
              <button
                onClick={() => setMapMode('interactive')}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg cursor-pointer transition-colors"
              >
                View Digital Map →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Update Coordinates Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-gray-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-[#0f294a] mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Admin: Update Campus Location &amp; Coordinates</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter official campus street address, latitude, and longitude. Updates persist across portal.
            </p>

            <form onSubmit={handleSaveLocation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={formSchoolName}
                  onChange={(e) => setFormSchoolName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={formLat}
                    onChange={(e) => setFormLat(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={formLng}
                    onChange={(e) => setFormLng(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Presets */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFormSchoolName('Daniel Maramba National High School');
                      setFormLat(16.00146);
                      setFormLng(120.39953);
                      setFormAddress('Maramba Street, Poblacion Norte, Santa Barbara, Pangasinan 2419');
                      setFormPhone('+63 75 653 6329');
                    }}
                    className="px-2.5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-[11px] font-semibold cursor-pointer"
                  >
                    Exact DMNHS Campus (Maramba St.)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSchoolName('Daniel Maramba NHS — Building C (ICT Wing)');
                      setFormLat(16.00195);
                      setFormLng(120.39985);
                      setFormAddress('Maramba Street, Poblacion Norte, Santa Barbara, Pangasinan 2419');
                    }}
                    className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-medium cursor-pointer"
                  >
                    Building C (PTP Block 7)
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
