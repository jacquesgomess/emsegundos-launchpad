import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, FolderOpen, Inbox, LogOut, Plus, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type Message = Database["public"]["Tables"]["contact_messages"]["Row"];

const EMPTY_POST: PostInsert = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  sources: [],
  tags: [],
  related_post_ids: [],
  is_featured: false,
  has_affiliate_links: false,
};

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingPost, setEditingPost] = useState<PostInsert & { id?: string }>(EMPTY_POST);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setAuthorized(false);
      return;
    }
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      setAuthorized(false);
      return;
    }
    const [{ data: postRows, error: postsError }, { data: categoryRows }, { data: messageRows }] =
      await Promise.all([
        supabase.from("posts").select("*").order("updated_at", { ascending: false }),
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);
    if (postsError) {
      setAuthorized(false);
      return;
    }
    setPosts(postRows ?? []);
    setCategories(categoryRows ?? []);
    setMessages(messageRows ?? []);
    setAuthorized(true);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      await loadData();
      setChecking(false);
    });
  }, [loadData, navigate]);

  async function savePost(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...editingPost,
      excerpt: editingPost.excerpt || null,
      category_id: editingPost.category_id || null,
      published_at:
        editingPost.status === "published"
          ? editingPost.published_at || new Date().toISOString()
          : null,
      updated_content_at: new Date().toISOString(),
    };
    const id = editingPost.id;
    delete payload.id;
    const result = id
      ? await supabase.from("posts").update(payload).eq("id", id)
      : await supabase.from("posts").insert(payload);
    setSaving(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    toast.success(id ? "Artigo atualizado." : "Artigo criado como rascunho.");
    setEditingPost(EMPTY_POST);
    await loadData();
  }

  async function deletePost(id: string) {
    if (!window.confirm("Excluir este artigo definitivamente?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Artigo excluído.");
      if (editingPost.id === id) setEditingPost(EMPTY_POST);
      await loadData();
    }
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.error("Envie uma imagem de até 5 MB.");
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setEditingPost((post) => ({ ...post, cover_image_url: data.publicUrl }));
    toast.success("Imagem enviada.");
  }

  if (checking) return <AdminNotice text="Verificando acesso…" />;
  if (!authorized) {
    return (
      <AdminNotice text="Sua conta está autenticada, mas ainda não possui a função de administrador. Atribua a função admin no Supabase e entre novamente." />
    );
  }

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Painel editorial</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie artigos, categorias e mensagens do EmSegundos.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/admin/login" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>

      <Tabs defaultValue="posts" className="mt-8">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="posts">
            <FileText className="mr-2 h-4 w-4" />
            Artigos
          </TabsTrigger>
          <TabsTrigger value="categories">
            <FolderOpen className="mr-2 h-4 w-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="messages">
            <Inbox className="mr-2 h-4 w-4" />
            Mensagens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-border bg-card p-4">
              <Button className="w-full" variant="brand" onClick={() => setEditingPost(EMPTY_POST)}>
                <Plus className="mr-2 h-4 w-4" /> Novo artigo
              </Button>
              <div className="mt-4 space-y-2">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setEditingPost(post)}
                    className={`w-full rounded-xl border p-3 text-left ${
                      editingPost.id === post.id
                        ? "border-brand-teal bg-brand-teal/5"
                        : "border-border"
                    }`}
                  >
                    <span className="block font-bold text-foreground">{post.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {post.status === "published" ? "Publicado" : "Rascunho"} · /{post.slug}
                    </span>
                  </button>
                ))}
              </div>
            </section>
            <PostForm
              post={editingPost}
              categories={categories}
              saving={saving}
              onChange={setEditingPost}
              onSave={savePost}
              onDelete={editingPost.id ? () => deletePost(editingPost.id!) : undefined}
              onUpload={uploadImage}
            />
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManager categories={categories} reload={loadData} />
        </TabsContent>
        <TabsContent value="messages" className="mt-6">
          <MessageManager messages={messages} reload={loadData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostForm({
  post,
  categories,
  saving,
  onChange,
  onSave,
  onDelete,
  onUpload,
}: {
  post: PostInsert & { id?: string };
  categories: Category[];
  saving: boolean;
  onChange: (post: PostInsert & { id?: string }) => void;
  onSave: (event: React.FormEvent) => void;
  onDelete?: () => void;
  onUpload: (file: File) => void;
}) {
  const update = (key: keyof PostInsert, value: PostInsert[keyof PostInsert]) =>
    onChange({ ...post, [key]: value });
  const sourcesText = useMemo(
    () =>
      Array.isArray(post.sources)
        ? post.sources
            .map((source) =>
              source && typeof source === "object" && !Array.isArray(source)
                ? `${source.name ?? ""} | ${source.url ?? ""}`
                : "",
            )
            .filter(Boolean)
            .join("\n")
        : "",
    [post.sources],
  );

  return (
    <form onSubmit={onSave} className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">{post.id ? "Editar artigo" : "Novo artigo"}</h2>
        {onDelete ? (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Excluir
          </Button>
        ) : null}
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Título">
          <Input required value={post.title} onChange={(e) => update("title", e.target.value)} />
        </Field>
        <Field label="Slug">
          <Input
            required
            pattern="[a-z0-9-]+"
            value={post.slug}
            onChange={(e) => update("slug", slugify(e.target.value))}
          />
        </Field>
        <Field label="Categoria">
          <Select
            value={post.category_id ?? "none"}
            onValueChange={(value) => update("category_id", value === "none" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem categoria</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status">
          <Select
            value={post.status ?? "draft"}
            onValueChange={(value) => update("status", value as "draft" | "published")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Resumo" className="md:col-span-2">
          <Textarea
            rows={3}
            value={post.excerpt ?? ""}
            onChange={(e) => update("excerpt", e.target.value)}
          />
        </Field>
        <Field label="Conteúdo em Markdown" className="md:col-span-2">
          <Textarea
            required
            rows={18}
            value={post.content ?? ""}
            onChange={(e) => update("content", e.target.value)}
          />
        </Field>
        <Field label="Autor">
          <Input
            value={post.author_name ?? ""}
            onChange={(e) => update("author_name", e.target.value)}
          />
        </Field>
        <Field label="Série">
          <Input value={post.series ?? ""} onChange={(e) => update("series", e.target.value)} />
        </Field>
        <Field label="Tempo de leitura (min)">
          <Input
            type="number"
            min={1}
            value={post.reading_minutes ?? ""}
            onChange={(e) =>
              update("reading_minutes", e.target.value ? Number(e.target.value) : null)
            }
          />
        </Field>
        <Field label="Tags (separadas por vírgula)">
          <Input
            value={(post.tags ?? []).join(", ")}
            onChange={(e) =>
              update(
                "tags",
                e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
        <Field label="Imagem de capa" className="md:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={post.cover_image_url ?? ""}
              onChange={(e) => update("cover_image_url", e.target.value)}
              placeholder="URL ou envie um arquivo"
            />
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-bold">
              <Upload className="mr-2 h-4 w-4" /> Enviar
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              />
            </label>
          </div>
        </Field>
        <Field label="Texto alternativo da imagem" className="md:col-span-2">
          <Input
            value={post.cover_image_alt ?? ""}
            onChange={(e) => update("cover_image_alt", e.target.value)}
          />
        </Field>
        <Field label="Meta title">
          <Input
            maxLength={70}
            value={post.seo_title ?? ""}
            onChange={(e) => update("seo_title", e.target.value)}
          />
        </Field>
        <Field label="Meta description">
          <Textarea
            maxLength={170}
            rows={3}
            value={post.seo_description ?? ""}
            onChange={(e) => update("seo_description", e.target.value)}
          />
        </Field>
        <Field label="URL canônica">
          <Input
            type="url"
            value={post.canonical_url ?? ""}
            onChange={(e) => update("canonical_url", e.target.value)}
          />
        </Field>
        <Field label="URL do YouTube">
          <Input
            type="url"
            value={post.youtube_url ?? ""}
            onChange={(e) => update("youtube_url", e.target.value)}
          />
        </Field>
        <Field label="Fontes (uma por linha: Nome | URL)" className="md:col-span-2">
          <Textarea
            rows={5}
            value={sourcesText}
            onChange={(e) => update("sources", parseSourceLines(e.target.value))}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm font-bold">
          <Checkbox
            checked={post.is_featured ?? false}
            onCheckedChange={(v) => update("is_featured", v === true)}
          />
          Artigo em destaque
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <Checkbox
            checked={post.has_affiliate_links ?? false}
            onCheckedChange={(v) => update("has_affiliate_links", v === true)}
          />
          Contém links de afiliados
        </label>
      </div>
      <Button type="submit" variant="navy" className="mt-6" disabled={saving}>
        {saving ? "Salvando…" : "Salvar artigo"}
      </Button>
    </form>
  );
}

function CategoryManager({
  categories,
  reload,
}: {
  categories: Category[];
  reload: () => Promise<void>;
}) {
  const [draft, setDraft] = useState({
    name: "",
    slug: "",
    description: "",
    sort_order: categories.length + 1,
  });
  async function create(event: React.FormEvent) {
    event.preventDefault();
    const { error } = await supabase
      .from("categories")
      .insert({ ...draft, slug: slugify(draft.slug || draft.name) });
    if (error) toast.error(error.message);
    else {
      toast.success("Categoria criada.");
      setDraft({ name: "", slug: "", description: "", sort_order: categories.length + 2 });
      await reload();
    }
  }
  async function update(category: Category) {
    const name = window.prompt("Nome da categoria:", category.name)?.trim();
    if (!name) return;
    const description = window.prompt("Descrição:", category.description ?? "") ?? "";
    const { error } = await supabase
      .from("categories")
      .update({ name, slug: slugify(name), description })
      .eq("id", category.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Categoria atualizada.");
      await reload();
    }
  }
  async function remove(category: Category) {
    if (
      !window.confirm(`Excluir a categoria “${category.name}”? Os artigos ficarão sem categoria.`)
    )
      return;
    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Categoria excluída.");
      await reload();
    }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={create} className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-extrabold">Nova categoria</h2>
        <div className="mt-5 space-y-4">
          <Field label="Nome">
            <Input
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </Field>
          <Field label="Slug">
            <Input
              required
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
            />
          </Field>
          <Field label="Descrição">
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </Field>
          <Field label="Ordem">
            <Input
              type="number"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </Field>
        </div>
        <Button type="submit" variant="navy" className="mt-5">
          Criar categoria
        </Button>
      </form>
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-extrabold">Categorias existentes</h2>
        <ul className="mt-4 divide-y divide-border">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <strong>{category.name}</strong>
                <span className="ml-2 text-sm text-muted-foreground">/{category.slug}</span>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => update(category)}>
                  Editar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(category)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function MessageManager({
  messages,
  reload,
}: {
  messages: Message[];
  reload: () => Promise<void>;
}) {
  async function mark(id: string, is_read: boolean) {
    const { error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id);
    if (error) toast.error(error.message);
    else await reload();
  }
  async function remove(id: string) {
    if (!window.confirm("Excluir esta mensagem?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else await reload();
  }
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <AdminNotice text="Nenhuma mensagem recebida." />
      ) : (
        messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-2xl border bg-card p-5 ${message.is_read ? "border-border" : "border-brand-orange"}`}
          >
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-extrabold">{message.subject}</h2>
                <p className="text-sm text-muted-foreground">
                  {message.name} · {message.email} ·{" "}
                  {new Date(message.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => mark(message.id, !message.is_read)}
                >
                  {message.is_read ? "Marcar não lida" : "Marcar lida"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(message.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm">{message.message}</p>
          </article>
        ))
      )}
    </div>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function AdminNotice({ text }: { text: string }) {
  return (
    <div className="container-page py-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        {text}
      </div>
    </div>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSourceLines(value: string): Json {
  return value
    .split("\n")
    .map((line) => {
      const [name, ...url] = line.split("|");
      return { name: name.trim(), url: url.join("|").trim() };
    })
    .filter((source) => source.name || source.url);
}
