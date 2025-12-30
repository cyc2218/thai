
import React from 'react';
import { 
  Calendar, 
  Ticket, 
  Wallet, 
  ClipboardList,
  Map as MapIcon
} from 'lucide-react';

export const COLORS = {
  beige: '#F7F4EB',
  grid: '#E0E5D5',
  primary: '#8BAE8E',
  secondary: '#C6A664',
  text: '#5D5443',
  white: '#FFFFFF',
};

export const CATEGORY_COLORS: Record<string, string> = {
  Sightseeing: 'bg-[#A8D1D1]',
  Food: 'bg-[#F2D1D1]',
  Transport: 'bg-[#D1D1F2]',
  Stay: 'bg-[#F2E5D1]',
};

export const NAV_ITEMS = [
  { id: 'schedule', label: '行程', icon: <Calendar size={20} /> },
  { id: 'metro', label: '地鐵', icon: <MapIcon size={20} /> },
  { id: 'bookings', label: '預訂', icon: <Ticket size={20} /> },
  { id: 'expense', label: '記帳', icon: <Wallet size={20} /> },
  { id: 'planning', label: '準備', icon: <ClipboardList size={20} /> },
];
