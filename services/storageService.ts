
import { LeaveRequest, LeaveStatus } from '../types';

// Google Apps Script Web App URL (Updated)
const API_URL = 'https://script.google.com/macros/s/AKfycbxQU3k-hD_3b7TApffCfl_pu-i1JPx6SsMwF4Wr8LVKTMMRSkuZcffzCVGM0ueYKezz/exec';

// Simple In-Memory Cache
let cacheData: LeaveRequest[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

export const getLeaves = async (forceRefresh = false): Promise<LeaveRequest[]> => {
  if (!forceRefresh && cacheData && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    return cacheData;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    const formattedData = data.map((item: any) => ({
        id: String(item.id),
        fullName: item.fullName,
        position: item.position,
        department: item.department,
        leaveType: item.leaveType,
        startDate: item.startDate,
        endDate: item.endDate,
        totalDays: Number(item.totalDays) || 0, // Added totalDays
        reason: item.reason,
        contact: item.contact,
        address: item.address || '',
        status: item.status,
        createdAt: item.createdAt,
        note: item.note
    }));

    cacheData = formattedData;
    lastFetchTime = Date.now();

    return formattedData;
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return cacheData || []; 
  }
};

export const invalidateCache = () => {
    cacheData = null;
    lastFetchTime = 0;
};

export const addLeave = async (leave: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
  try {
    const payload = {
        ...leave,
        status: LeaveStatus.PENDING,
        createdAt: new Date().toISOString()
    };

    // Ensure totalDays is sent correctly
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'create', payload: payload })
    });
    
    invalidateCache(); 
    return true;
  } catch (error) {
    console.error("Error adding leave:", error);
    return false;
  }
};

export const deleteLeave = async (id: string): Promise<boolean> => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id: id })
    });
    invalidateCache(); 
    return true;
  } catch (error) {
    console.error("Error deleting leave:", error);
    return false;
  }
};

export const updateLeaveStatus = async (id: string, status: LeaveStatus, note?: string): Promise<boolean> => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateStatus', id, status, note })
    });
    invalidateCache(); 
    return true;
  } catch (error) {
    console.error("Error updating status:", error);
    return false;
  }
};
