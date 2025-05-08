"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type EditNoteProps = {
  params: { id: string };
};

export default function EditNotePage({ params }: EditNoteProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        // TODO: Replace with actual API call
        // Mock data for demonstration
        if (params.id === "1") {
          setTitle("絶バハギミックまとめ");
          setCategory("絶バハムート討滅戦");
          setContent("# 絶バハムート討滅戦のギミック\n\n## フェーズ1\n\n```\n｜ 　　　　MT \n｜ 　D1　BOSS　D2 \n｜H1　　　　　　　H2 \n｜　 D3　　　　 D4 \n｜　　　 　ST \nMT西・ST東　青玉『12時→6時→12時』 \nスピア（ヒラ対象）１時 \n塔は近い順に、近接→遠隔→ヒラ \n外周騎士12時　頭割り２時　突進４時　青９時 \n鎖はボス真後ろ集まって散開\n```");
        } else if (params.id === "2") {
          setTitle("極ナイツマクロ");
          setCategory("極騎神ナイツ・オブ・ラウンド討滅戦");
          setContent("# 極ナイツのマクロ\n\n```\n｜ 　　　　MT \n｜ 　D1　BOSS　D2 \n｜H1　　　　　　　H2 \n｜　 D3　　　　 D4 \n｜　　　 　ST \n```\n\n## 散開位置\n\n```\n　　MT　　\nD1　　　D2\n　　BOSS　　\nH1　　　H2\n　　ST　　\n```");
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch note:", error);
        setLoading(false);
      }
    };

    fetchNote();
  }, [params.id]);

  const handleSave = async () => {
    if (!title) {
      alert("タイトルを入力してください");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      console.log("Updating note:", { id: params.id, title, category, content });
      
      // Mock updating - in production this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push(`/notes/${params.id}`);
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10 text-center">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">メモ編集</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">タイトル</label>
          <Input
            placeholder="例: 絶バハギミックまとめ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">カテゴリ</label>
          <Input
            placeholder="例: 絶バハムート討滅戦"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">内容</label>
          <div className="min-h-[300px]">
            {typeof window !== 'undefined' && (
              <SimpleMDE
                value={content}
                onChange={setContent}
                options={{
                  spellChecker: false,
                  placeholder: "ここにマクロや攻略テキストをペーストしてください。コードブロック(```)を使うと書式が保持されます。",
                  toolbar: ["bold", "italic", "heading", "|", "quote", "code", "|", "preview", "side-by-side"],
                }}
              />
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "保存中..." : "保存"}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/notes/${params.id}`)}>
            キャンセル
          </Button>
        </div>
      </div>
    </div>
  );
}
