"use client";

import { onSnapshot, query, orderBy, where } from "firebase/firestore";
import { userCollection } from "@/lib/firebase/firestore";
import { useState, useEffect } from "react";
import type { Exam, ExamMarker } from "@/lib/types";

export function useExams(userId: string | null) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const col = userCollection(userId, "exams");
    const q = query(col, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setExams(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Exam));
      setReady(true);
    });

    return unsub;
  }, [userId]);

  return { exams, loading: !!userId && !ready };
}

export function useMarkerNames(userId: string | null) {
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    const col = userCollection(userId, "exam_markers");
    const unsub = onSnapshot(col, (snap) => {
      const nameSet = new Set<string>();
      snap.docs.forEach((d) => nameSet.add(d.data().marker as string));
      setNames(Array.from(nameSet).sort());
    });

    return unsub;
  }, [userId]);

  return names;
}

export function useExamMarkers(userId: string | null, markerName: string | null) {
  const [markers, setMarkers] = useState<ExamMarker[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userId || !markerName) return;

    const col = userCollection(userId, "exam_markers");
    const q = query(col, where("marker", "==", markerName));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ExamMarker);
      data.sort((a, b) => a.examDate.localeCompare(b.examDate));
      setMarkers(data);
      setReady(true);
    });

    return () => {
      unsub();
      setMarkers([]);
    };
  }, [userId, markerName]);

  return { markers, loading: !!(userId && markerName) && !ready };
}
