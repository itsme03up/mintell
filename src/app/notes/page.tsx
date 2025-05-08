"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Note = {
  id: string;
  title: string;
  category: string;
  updated_at: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchNotes = async () => {
      try {
        // For demo, using mock data
        const mockNotes = [
          {
            id: "1",
            title: "絶バハギミックまとめ",
            category: "絶バハムート討滅戦",
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "極ナイツマクロ",
            category: "極騎神ナイツ・オブ・ラウンド討滅戦",
            updated_at: new Date().toISOString(),
          }
        ];
        setNotes(mockNotes);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">メモ一覧</h1>
        <Button asChild>
          <Link href="/notes/new">＋新規メモ</Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">読み込み中...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">メモはまだありません</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="p-4 hover:shadow-lg transition cursor-pointer">
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="text-sm text-muted-foreground">{note.category}</p>
                <p className="text-xs text-muted-foreground">
                  最終更新: {new Date(note.updated_at).toLocaleString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
