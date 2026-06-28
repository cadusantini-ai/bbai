"use client";

import { onSnapshot, query, orderBy, where } from "firebase/firestore";
import { userCollection } from "@/lib/firebase/firestore";
import { useState, useEffect } from "react";
import type { Exam, ExamMarker, ExamCategory, MarkerStatus } from "@/lib/types";

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

export interface MarkerSummary {
  name: string;
  category: ExamCategory;
  latestDate: string;
  latestValue: number;
  unit: string;
  status: MarkerStatus;
  readingCount: number;
}

export interface MarkerGroup {
  category: ExamCategory;
  markers: MarkerSummary[];
}

const CATEGORY_ORDER: ExamCategory[] = [
  "hematologia",
  "hormonal",
  "hepatica",
  "bioquimica",
  "renal",
  "urina",
  "imagem",
  "outros",
];

export function useMarkersGrouped(userId: string | null) {
  const [groups, setGroups] = useState<MarkerGroup[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const col = userCollection(userId, "exam_markers");

    const unsub = onSnapshot(col, (snap) => {
      // Collapse all readings to one summary per marker (latest reading wins)
      const byMarker = new Map<
        string,
        { category: ExamCategory; latestDate: string; latestValue: number; unit: string; status: MarkerStatus; count: number }
      >();

      snap.docs.forEach((d) => {
        const data = d.data() as ExamMarker;
        const existing = byMarker.get(data.marker);
        if (!existing || data.examDate > existing.latestDate) {
          byMarker.set(data.marker, {
            category: data.category,
            latestDate: data.examDate,
            latestValue: data.value,
            unit: data.unit,
            status: data.status,
            count: (existing?.count ?? 0) + 1,
          });
        } else {
          existing.count += 1;
        }
      });

      // Group by category
      const byCategory = new Map<ExamCategory, MarkerSummary[]>();
      for (const [name, info] of byMarker) {
        const list = byCategory.get(info.category) ?? [];
        list.push({
          name,
          category: info.category,
          latestDate: info.latestDate,
          latestValue: info.latestValue,
          unit: info.unit,
          status: info.status,
          readingCount: info.count,
        });
        byCategory.set(info.category, list);
      }

      const result: MarkerGroup[] = [];
      for (const cat of CATEGORY_ORDER) {
        const markers = byCategory.get(cat);
        if (markers) {
          result.push({
            category: cat,
            markers: markers.sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
          });
        }
      }

      setGroups(result);
      setReady(true);
    });

    return unsub;
  }, [userId]);

  const totalMarkers = groups.reduce((s, g) => s + g.markers.length, 0);
  return { groups, loading: !!userId && !ready, totalMarkers };
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
