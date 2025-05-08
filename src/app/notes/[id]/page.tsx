"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

type NoteDetailProps = {
  params: { id: string };
};

type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  updated_at: string;
};

export default function NoteDetailPage({ params }: NoteDetailProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        // TODO: Replace with actual API call
        // Mock data for demonstration
        if (params.id === "1") {
          setNote({
            id: "1",
            title: "絶バハギミックまとめ",
            category: "絶バハムート討滅戦",
            content: "# 絶バハムート討滅戦のギミック\n\n## フェーズ1\n\n```\n｜ 　　　　MT \n｜ 　D1　BOSS　D2 \n｜H1　　　　　　　H2 \n｜　 D3　　　　 D4 \n｜　　　 　ST \nMT西・ST東　青玉『12時→6時→12時』 \nスピア（ヒラ対象）１時 \n塔は近い順に、近接→遠隔→ヒラ \n外周騎士12時　頭割り２時　突進４時　青９時 \n鎖はボス真後ろ集まって散開\n```",
            updated_at: new Date().toISOString(),
          });
        } else if (params.id === "2") {
          setNote({
            id: "2",
            title: "極ナイツマクロ",
            category: "極騎神ナイツ・オブ・ラウンド討滅戦",
            content: "# 極ナイツのマクロ\n\n```\n｜ 　　　　MT \n｜ 　D1　BOSS　D2 \n｜H1　　　　　　　H2 \n｜　 D3　　　　 D4 \n｜　　　 　ST \n```\n\n## 散開位置\n\n```\n　　MT　　\nD1　　　D2\n　　BOSS　　\nH1　　　H2\n　　ST　　\n```",
            updated_at: new Date().toISOString(),
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch note:", error);
        setLoading(false);
      }
    };

    fetchNote();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("このメモを削除してもよろしいですか？")) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      console.log("Deleting note:", params.id);
      
      // Mock deletion - in production this would call the API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push("/notes");
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10 text-center">読み込み中...</div>;
  }

  if (!note) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>メモが見つかりませんでした</p>
        <Button asChild className="mt-4">
          <Link href="/notes">メモ一覧に戻る</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <p className="text-sm text-muted-foreground">{note.category}</p>
          <p className="text-xs text-muted-foreground">
            最終更新: {new Date(note.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href={`/notes/${params.id}/edit`}>編集</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            削除
          </Button>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>
    </div>
  );
}
