import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getCurrentUser, updateUser } from "@/services/userService";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const current = await getCurrentUser();
      if (current) {
        setUser(current);
        setName(current.name);
        setSector(current.sector || "");
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    const updated = await updateUser({
      name,
      sector,
    });

    if (updated) {
      setUser(updated);
      alert("Perfil atualizado com sucesso!");
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!user) {
    return <div className="p-6">Usuário não encontrado.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Meu Perfil</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input
            className="w-full border rounded-lg p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Setor</label>
          <input
            className="w-full border rounded-lg p-2"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border rounded-lg p-2 bg-muted"
            value={user.email}
            disabled
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}