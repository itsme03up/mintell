"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.css"; // Changed from easymde.min.css

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title) {
      alert("タイトルを入力してください");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      console.log("Saving note:", { title, category, content });
      
      // Mock saving - in production this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push("/notes");
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">新規メモ作成</h1>
      
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
          <Button variant="outline" onClick={() => router.push("/notes")}>
            キャンセル
          </Button>
        </div>
      </div>
    </div>
  );
}
