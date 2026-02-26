import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Trash2, Shield, Loader2, UserPlus, Mail, AlertCircle } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('email');

        if (data) setUsers(data);
        setLoading(false);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setActionLoading(true);

        // In a real production app with full control, you'd use a server-side route or Edge Function
        // For this demo/setup, we'll use Supabase SignUp which will trigger our 'handle_new_user' DB trigger
        const { data, error } = await supabase.auth.signUp({
            email: newUser.email,
            password: newUser.password,
            options: {
                data: { role: 'admin' }
            }
        });

        if (error) {
            alert('Erro ao criar usuário: ' + error.message);
        } else {
            alert('Usuário criado com sucesso! Ele já pode fazer login.');
            setNewUser({ email: '', password: '' });
            setShowAddForm(false);
            fetchUsers();
        }
        setActionLoading(false);
    };

    const handleDeleteUser = async (id, email) => {
        // Important: You can't delete auth users easily from client side if they are not yourself
        // This is a limitation of client-side Supabase.
        // We will show an alert explaining this or provide instructions.
        alert(`Para excluir o usuário ${email}, você deve ir no painel do Supabase > Authentication e removê-lo por lá por questões de segurança.`);
    };

    if (loading) return (
        <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-servweld-blue" size={40} />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="text-servweld-blue" size={24} />
                    Gestão de Administradores
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-servweld-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all text-sm"
                >
                    <UserPlus size={18} />
                    {showAddForm ? 'Cancelar' : 'Adicionar Novo'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddUser} className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                            <input
                                type="email"
                                required
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-servweld-blue"
                                placeholder="exemplo@servweld.com.br"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha Temporária</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-servweld-blue"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="bg-servweld-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all text-sm disabled:opacity-50"
                    >
                        {actionLoading ? 'Criando...' : 'Confirmar Cadastro'}
                    </button>
                </form>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuário</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cargo</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-servweld-blue/10 rounded-full flex items-center justify-center text-servweld-blue font-bold">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">
                                        <Shield size={12} />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDeleteUser(user.id, user.email)}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                                        title="Excluir Usuário"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-800">
                <AlertCircle className="shrink-0" size={20} />
                <p className="text-sm">
                    <strong>Nota de Segurança:</strong> Por questões de segurança do Supabase, resets de senha esquecida e exclusão definitiva de contas devem ser feitos através do painel do Supabase. Aqui listamos quem tem permissão de acesso.
                </p>
            </div>
        </div>
    );
};

export default UserManagement;
