import { useState, useEffect } from 'react';
import { getDirectusClient } from '@/lib/directus-client';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  status: string;
  last_access?: string;
  role: {
    name: string;
  };
  avatar?: string;
  branch?: string;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const client = await getDirectusClient();
      const response = await client.get('/users', {
        params: {
          fields: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'status', 'last_access', 'role.name', 'avatar.data'],
          limit: -1
        }
      });

      // Transform the data to match our interface
      const transformedUsers: User[] = response.data.data.map((user: any) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        status: user.status,
        last_access: user.last_access,
        role: user.role || { name: 'Staff' }, // Default role if not assigned
        avatar: user.avatar?.data?.id ? `/assets/${user.avatar.data.id}` : undefined,
        branch: 'All Branches' // TODO: Map to actual branch assignments when available
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');

      // Fallback to mock data if API fails
      const mockUsers: User[] = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@example.com',
          phone_number: '+1 234-567-8901',
          status: 'active',
          last_access: new Date().toISOString(),
          role: { name: 'Administrator' },
          avatar: undefined,
          branch: 'All Branches'
        },
        {
          id: '2',
          first_name: 'Emily',
          last_name: 'Davis',
          email: 'emily.davis@example.com',
          phone_number: '+1 234-567-8902',
          status: 'active',
          last_access: new Date(Date.now() - 86400000).toISOString(),
          role: { name: 'Manager' },
          avatar: undefined,
          branch: 'Miwaku Premium Landmark 81'
        }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers
  };
}