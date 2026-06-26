"use client";

import { create } from "zustand";
import type { User } from "@/types/user";

interface UserStore {
  fetchedUsers: User[];
  setFetchedUsers: (users: User[]) => void;
  updateFetchedUser: (id: string, patch: Partial<User>) => void;

  savedUsers: User[];
  setSavedUsers: (users: User[]) => void;
  addSavedUser: (user: User) => void;
  updateSavedUser: (id: string, patch: Partial<User>) => void;
  removeSavedUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  fetchedUsers: [],
  setFetchedUsers: (users) => set({ fetchedUsers: users }),
  updateFetchedUser: (id, patch) =>
    set((s) => ({
      fetchedUsers: s.fetchedUsers.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    })),

  savedUsers: [],
  setSavedUsers: (users) => set({ savedUsers: users }),
  addSavedUser: (user) => set((s) => ({ savedUsers: [user, ...s.savedUsers] })),
  updateSavedUser: (id, patch) =>
    set((s) => ({
      savedUsers: s.savedUsers.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    })),
  removeSavedUser: (id) =>
    set((s) => ({ savedUsers: s.savedUsers.filter((u) => u.id !== id) })),
}));
