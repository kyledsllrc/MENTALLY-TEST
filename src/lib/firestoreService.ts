import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";
import type {
  MoodEntry,
  JournalEntry,
  ScreenerResult,
  CBTThoughtRecord,
  DailyHabitLog,
} from "../types";

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  institution: string;
  createdAt: string;
  lastLoginAt: string;
}

/**
 * Ensures or updates the user profile record in Firestore
 */
export async function syncUserProfile(user: User): Promise<UserProfileData> {
  const userRef = doc(db, "users", user.uid);
  const nowIso = new Date().toISOString();

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const existing = snap.data() as UserProfileData;
      const updated: Partial<UserProfileData> = {
        lastLoginAt: nowIso,
        displayName: user.displayName || existing.displayName || "Student",
        email: user.email || existing.email,
        photoURL: user.photoURL || existing.photoURL,
      };
      await setDoc(userRef, updated, { merge: true });
      return { ...existing, ...updated };
    } else {
      const newProfile: UserProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split("@")[0] || "Student",
        photoURL: user.photoURL || null,
        institution: "Pateros Technological College",
        createdAt: nowIso,
        lastLoginAt: nowIso,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (err) {
    console.warn("Firestore syncUserProfile notice:", err);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Student",
      photoURL: user.photoURL || null,
      institution: "Pateros Technological College",
      createdAt: nowIso,
      lastLoginAt: nowIso,
    };
  }
}

/**
 * Mood Operations
 */
export async function saveMoodToFirestore(userId: string, mood: MoodEntry): Promise<void> {
  try {
    const moodRef = doc(db, "users", userId, "moods", mood.id);
    await setDoc(moodRef, {
      ...mood,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Could not save mood to Firestore:", err);
  }
}

export async function fetchMoodsFromFirestore(userId: string): Promise<MoodEntry[]> {
  try {
    const moodsCol = collection(db, "users", userId, "moods");
    const q = query(moodsCol, orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    const items: MoodEntry[] = [];
    snap.forEach((d) => {
      const data = d.data();
      items.push({
        id: d.id,
        timestamp: data.timestamp || new Date().toISOString(),
        score: data.score,
        label: data.label,
        emoji: data.emoji,
        feelings: Array.isArray(data.feelings) ? data.feelings : [],
        triggers: Array.isArray(data.triggers) ? data.triggers : [],
        note: data.note || "",
      });
    });
    return items;
  } catch (err) {
    console.warn("Could not load moods from Firestore:", err);
    return [];
  }
}

/**
 * Journal Operations
 */
export async function saveJournalToFirestore(userId: string, journal: JournalEntry): Promise<void> {
  try {
    const journalRef = doc(db, "users", userId, "journals", journal.id);
    await setDoc(journalRef, {
      ...journal,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Could not save journal to Firestore:", err);
  }
}

export async function deleteJournalFromFirestore(userId: string, journalId: string): Promise<void> {
  try {
    const journalRef = doc(db, "users", userId, "journals", journalId);
    await deleteDoc(journalRef);
  } catch (err) {
    console.warn("Could not delete journal from Firestore:", err);
  }
}

export async function fetchJournalsFromFirestore(userId: string): Promise<JournalEntry[]> {
  try {
    const journalsCol = collection(db, "users", userId, "journals");
    const q = query(journalsCol, orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    const items: JournalEntry[] = [];
    snap.forEach((d) => {
      const data = d.data();
      items.push({
        id: d.id,
        timestamp: data.timestamp || new Date().toISOString(),
        title: data.title || "Untitled Reflection",
        content: data.content || "",
        prompt: data.prompt,
        moodTag: data.moodTag,
        tags: Array.isArray(data.tags) ? data.tags : [],
      });
    });
    return items;
  } catch (err) {
    console.warn("Could not load journals from Firestore:", err);
    return [];
  }
}

/**
 * Habit Operations
 */
export async function saveHabitLogToFirestore(userId: string, habit: DailyHabitLog): Promise<void> {
  try {
    const habitRef = doc(db, "users", userId, "habits", habit.date);
    await setDoc(habitRef, {
      ...habit,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Could not save habit to Firestore:", err);
  }
}

export async function fetchHabitsFromFirestore(userId: string): Promise<DailyHabitLog[]> {
  try {
    const habitsCol = collection(db, "users", userId, "habits");
    const q = query(habitsCol, orderBy("date", "desc"));
    const snap = await getDocs(q);
    const items: DailyHabitLog[] = [];
    snap.forEach((d) => {
      items.push(d.data() as DailyHabitLog);
    });
    return items;
  } catch (err) {
    console.warn("Could not load habits from Firestore:", err);
    return [];
  }
}

/**
 * Screener Operations
 */
export async function saveScreenerToFirestore(userId: string, result: ScreenerResult): Promise<void> {
  try {
    const screenerRef = doc(db, "users", userId, "screeners", result.id);
    await setDoc(screenerRef, {
      ...result,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Could not save screener to Firestore:", err);
  }
}

export async function fetchScreenersFromFirestore(userId: string): Promise<ScreenerResult[]> {
  try {
    const screenersCol = collection(db, "users", userId, "screeners");
    const q = query(screenersCol, orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    const items: ScreenerResult[] = [];
    snap.forEach((d) => {
      items.push(d.data() as ScreenerResult);
    });
    return items;
  } catch (err) {
    console.warn("Could not load screeners from Firestore:", err);
    return [];
  }
}

/**
 * CBT Records
 */
export async function saveCBTRecordToFirestore(userId: string, record: CBTThoughtRecord): Promise<void> {
  try {
    const cbtRef = doc(db, "users", userId, "cbt", record.id);
    await setDoc(cbtRef, {
      ...record,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Could not save CBT record to Firestore:", err);
  }
}

export async function fetchCBTRecordsFromFirestore(userId: string): Promise<CBTThoughtRecord[]> {
  try {
    const cbtCol = collection(db, "users", userId, "cbt");
    const q = query(cbtCol, orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    const items: CBTThoughtRecord[] = [];
    snap.forEach((d) => {
      items.push(d.data() as CBTThoughtRecord);
    });
    return items;
  } catch (err) {
    console.warn("Could not load CBT records from Firestore:", err);
    return [];
  }
}
